import React, { useEffect, useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { fetchApplicants, updateApplicant } from '../redux/slices/ApplicantSlice'; // Update import path as necessary
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

// Custom StyledDataGrid
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light'
      ? 'rgba(0,0,0,.85)'
      : 'rgba(255,255,255,0.85)',
  backgroundColor: 'white',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${
      theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
    }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light'
        ? 'rgba(0,0,0,.85)'
        : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
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
    <GridToolbarContainer style={{ justifyContent: 'flex-start', backgroundColor: '#f0f4ff' }}>
      <GridToolbarExport style={{ color: 'blue' }} /> {/* Custom color and position */}
    </GridToolbarContainer>
  );
};

const ApplicantsTable = ({ searchTerm }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { list, status, error } = useSelector((state) => state.applicants);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullCoverLetterModalOpen, setFullCoverLetterModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [gridHeight, setGridHeight] = useState('auto');

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'loading') {
      const rowHeight = 52;
      const headerHeight = 56;
      const toolbarHeight = 56;
      const totalHeight = headerHeight + toolbarHeight + rowHeight * paginationModel.pageSize + 40;

      setGridHeight(`${totalHeight}px`);
    }
  }, [status, paginationModel.pageSize]);

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const filteredData = searchTerm
    ? list.filter((item) =>
        `${item.firstName} ${item.lastName} ${item.jobPosition}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : list;

    const handleAccept = async (id) => {
      const applicant = list.find(app => app.id === id);
      const updatedApplicant = {
        ...applicant, // Spread existing fields
        status: 'Accepted',
        stage: 'UnderReview',
        testRating: null,
        interviewRating: null,
        dateProcessed: new Date().toISOString(),
      };
    
      try {
        const response = await dispatch(updateApplicant({ id, updates: updatedApplicant })).unwrap();
        dispatch(updateList(list.map(applicant => applicant.id === id ? response : applicant)));
        console.log('Accepted applicant:', response);
      } catch (error) {
        console.error('Error accepting applicant:', error);
      }
    };
    
    const handleReject = async (id) => {
      const applicant = list.find(app => app.id === id);
      const updatedApplicant = {
        ...applicant, // Spread existing fields
        status: 'Rejected',
        stage: 'Rejected',
        testRating: null,
        interviewRating: null,
        dateProcessed: new Date().toISOString(),
      };
    
      try {
        const response = await dispatch(updateApplicant({ id, updates: updatedApplicant })).unwrap();
        dispatch(updateList(list.map(applicant => applicant.id === id ? response : applicant)));
        console.log('Rejected applicant:', response);
      } catch (error) {
        console.error('Error rejecting applicant:', error);
      }
    };
    


  const handleRetract = async (id) => {
    const updatedApplicant = {
      status: 'Pending',
      stage: null,
      testRating: null,
      interviewRating: null,
      dateProcessed: null,
    };

    try {
      await dispatch(updateApplicant({ id, updates: updatedApplicant })).unwrap();
      console.log('Retracted applicant:', updatedApplicant);
    } catch (error) {
      console.error('Error retracting applicant:', error);
    }
  };

  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplicant(null);
  };

  const openFullCoverLetterModal = () => {
    setFullCoverLetterModalOpen(true);
  };

  const closeFullCoverLetterModal = () => {
    setFullCoverLetterModalOpen(false);
  };

  const columns = [
  { field: 'id', headerName: <strong className='text-base'>ID</strong>, width: 100, sortable: false },
  { field: 'firstName', headerName: <strong className='text-base'>First Name</strong>, width: 150 },
  { field: 'lastName', headerName: <strong className='text-base'>Last Name</strong>, width: 150 },
  { field: 'jobPosition', headerName: <strong className='text-base'>Job Position</strong>, width: 200 },
  { field: 'dateApplied', headerName: <strong className='text-base'>Date Applied</strong>, width: 150 },
  {
    field: 'status',
    headerName: <strong className='text-base'>Status</strong>,
    width: 150,
    renderCell: (params) => {
      let statusColor = 'gray';
      switch (params.value) {
        case 'Accepted':
          statusColor = 'green';
          break;
        case 'Rejected':
          statusColor = 'red';
          break;
        default:
          statusColor = 'gray';
      }
      return (
        <span style={{ color: statusColor, fontWeight: 'bold' }}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: 'action',
    headerName: <strong className='text-base'>Action</strong>,
    width: 200,
    renderCell: (params) => {
      const { id, status } = params.row;
      return (
        <>
          {status === 'Pending' && (
            <>
              <button
                className='bg-green-500 text-white px-2 py-1 rounded'
                onClick={() => handleAccept(id)}
              >
                Accept
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded ml-2'
                onClick={() => handleReject(id)}
              >
                Reject
              </button>
            </>
          )}
          {status === 'Accepted' && (
            <button
              className='bg-gray-500 text-white px-2 py-1 rounded'
              onClick={() => handleRetract(id)}
            >
              Retract
            </button>
          )}
          {status === 'Rejected' && (
            <button
              className='bg-gray-500 text-white px-2 py-1 rounded'
              onClick={() => handleRetract(id)}
            >
              Retract
            </button>
          )}
        </>
      );
    },
  },
];


  return (
    <div style={{ height: gridHeight, width: '100%' }}>
      <StyledDataGrid
        rows={filteredData}
        columns={columns}
        pagination
        paginationMode="server"
        pageSize={paginationModel.pageSize}
        rowCount={filteredData.length}
        onPaginationModelChange={handlePaginationModelChange}
        components={{
          Pagination: CustomPagination,
          Toolbar: CustomToolbar,
        }}
      />
      {/* Add Modal implementation here */}
    </div>
  );
};

export default ApplicantsTable;
