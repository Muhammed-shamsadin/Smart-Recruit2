import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridToolbarExport,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import NotificationDep from './NotificationDep';
import {
  fetchDepartments,
  addDepartment,
  editDepartment,
  deleteDepartment
} from '../redux/slices/DepartmentSlice'; // Correct path and named imports

// Custom StyledDataGrid
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // styling here
}));

// Custom Pagination component
const CustomPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page + 1}
      count={pageCount}
      renderItem={(props) => <PaginationItem {...props} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      style={{ justifyContent: 'flex-start', backgroundColor: '#f0f4ff' }}
    >
      <GridToolbarExport style={{ color: 'blue' }} />
    </GridToolbarContainer>
  );
};

const DepartmentsTable = () => {
  const dispatch = useDispatch();
  const departments = useSelector((state) => state.departments.list);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    status: 'Active',
    positionOpen: false,
    adminId: '', 
  });

  const [departmentId, setDepartmentId] = useState(null); // Add this state

  const [actionType, setActionType] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [gridHeight, setGridHeight] = useState('auto');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      const rowHeight = 52; 
      const headerHeight = 56; 
      const toolbarHeight = 56;
      const totalHeight = headerHeight + toolbarHeight + rowHeight * paginationModel.pageSize + 40;
      setGridHeight(`${totalHeight}px`);
      setTimeout(() => setLoading(false), 100);
    }
  }, [loading, paginationModel.pageSize]);

  const handlePaginationModelChange = (newPaginationModel) => {
    setLoading(true);
    setPaginationModel(newPaginationModel);
  };

  const handleSave = async () => {
    try {
      if (!selectedDepartment) {
        console.error('No department selected');
        return;
      }

      const updatedData = {
        name: newDepartment.name,
        status: newDepartment.status,
        positionOpen: newDepartment.positionOpen,
        adminId: newDepartment.adminId,
      };

      // Dispatch editDepartment action
      await dispatch(editDepartment({ id: selectedDepartment.id, updatedData }));
      setNotification({
        message: 'Department updated successfully!',
        type: 'success',
      });
      setModalOpen(false); // Close modal after save
    } catch (error) {
      console.error('Error updating department:', error.message);
    }
  };

  const handleAddDepartment = async () => {
    if (newDepartment.name.trim() === '') {
      alert('Department name cannot be empty');
      return;
    }
    const departmentToAdd = {
      ...newDepartment,
      dateFormed: new Date().toISOString().split('T')[0],
    };
    console.log('Adding Department:', departmentToAdd); // Debug log
    dispatch(addDepartment(departmentToAdd));
    setNotification({
      message: 'Department added successfully!',
      type: 'success',
    });
    closeModal();
  };

  const handleDeleteDepartment = () => {
    console.log('Deleting Department:', selectedDepartment.id); // Debug log
    dispatch(deleteDepartment(selectedDepartment.id));
    setNotification({
      message: 'Department deleted successfully!',
      type: 'delete',
    });
    closeConfirmation();
  };

  // Function to open the modal
  const openModal = (department = null, action = '') => {
    setSelectedDepartment(department || { name: '', status: 'Active', positionOpen: false });
    setNewDepartment(department || { name: '', status: 'Active', positionOpen: false, adminId: '' });
    setActionType(action);
    setIsEditing(action === 'edit'); // Determine if editing
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDepartment(null);
    setNewDepartment({ name: '', status: 'Active', positionOpen: false, adminId: '' });
  };

  const openConfirmation = (action = '') => {
    setActionType(action);
    setConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationOpen(false);
  };

  const columns = [
    {
      field: 'id',
      headerName: <strong className="text-base">ID</strong>,
      width: 200,
    },
    {
      field: 'name',
      headerName: <strong className="text-base">Department Name</strong>,
      width: 600,
    },
    {
      field: 'status',
      headerName: <strong className="text-base">Status</strong>,
      width: 300,
    },
    {
      field: 'action',
      headerName: <strong className="text-base">Action</strong>,
      width: 340,
      renderCell: (params) => (
        <div className="flex h-[50px] items-center gap-2">
          <button
            className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white active:bg-blue-800 active:text-white"
            onClick={() => openModal(params.row, 'edit')}
          >
            Change
          </button>
          <button
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white active:bg-red-800 active:text-white"
            onClick={() => {
              setSelectedDepartment(params.row);
              openConfirmation('delete');
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {notification.message && (
        <NotificationDep
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      <div className="mb-4 flex justify-start">
        <button
          className="px-4 py-2 font-semibold bg-accent text-white rounded hover:bg-blue-500"
          onClick={() => openModal(null, 'add')}
        >
          Add Department
        </button>
      </div>
      <div className="relative bg-white border border-gray-200 rounded-lg shadow overflow-y-auto" style={{ height: gridHeight }}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin text-blue-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 12a8 8 0 018-8v8H4zm0 0a8 8 0 0016 0H4z"
                />
              </svg>
            </div>
          </div>
        ) : (
          <StyledDataGrid
            rows={departments}
            columns={columns}
            pageSize={paginationModel.pageSize}
            onPageSizeChange={handlePaginationModelChange}
            pagination
            components={{ Pagination: CustomPagination, Toolbar: CustomToolbar }}
            paginationMode="server"
            onPaginationModelChange={handlePaginationModelChange}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${modalOpen ? 'block' : 'hidden'}`}>
        <div className="relative top-1/4 mx-auto p-5 border w-96 shadow-lg bg-white rounded-md">
          <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Department' : 'Add Department'}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              isEditing ? handleSave() : handleAddDepartment();
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Department Name:</label>
              <input
                type="text"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
              <select
                value={newDepartment.status}
                onChange={(e) => setNewDepartment({ ...newDepartment, status: e.target.value })}
                className="border border-gray-300 rounded w-full py-2 px-3"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Position Open:</label>
              <input
                type="checkbox"
                checked={newDepartment.positionOpen}
                onChange={(e) => setNewDepartment({ ...newDepartment, positionOpen: e.target.checked })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Admin ID:</label>
              <input
                type="text"
                value={newDepartment.adminId}
                onChange={(e) => setNewDepartment({ ...newDepartment, adminId: e.target.value })}
                className="border border-gray-300 rounded w-full py-2 px-3"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isEditing ? 'Save Changes' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${confirmationOpen ? 'block' : 'hidden'}`}>
        <div className="relative top-1/4 mx-auto p-5 border w-96 shadow-lg bg-white rounded-md">
          <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this department?</h3>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeConfirmation}
              className="px-4 py-2 bg-red-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteDepartment}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsTable;
