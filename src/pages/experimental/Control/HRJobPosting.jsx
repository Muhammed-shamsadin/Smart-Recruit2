import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  Backdrop,
  Fade,
  TextField
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RestoreIcon from '@mui/icons-material/Restore';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useTable, usePagination } from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, postJob, updateJobStatus } from '../../../redux/slices/JobSlice';
import Sidebar from '../../../components/Experimental/Sidebar';
import Navbar from '../../../components/Experimental/Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const HRJobPostingPage = () => {
  const dispatch = useDispatch();
  const jobPostings = useSelector((state) => state.jobs.list);
  const [selectedJobPosting, setSelectedJobPosting] = useState(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [pageSize] = useState(5);

  // Fetch jobs on mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Handle post job
  // Handle post job
const handlePostJob = useCallback(async () => {
  if (!selectedJobPosting || !selectedDeadline) {
    alert('Please select a deadline before posting the job.');
    return;
  }
  try {
    const updatedJobPosting = {
      ...selectedJobPosting,
      posted: true,  // Set the job's status to "posted"
      status: 'posted', // Add status update to 'posted'
      deadline: moment(selectedDeadline).toISOString(), // Save deadline
    };
    await dispatch(postJob(updatedJobPosting)); // Update the job
    dispatch(fetchJobs()); // Fetch updated jobs after posting
    handleClosePostJobModal(); // Close modal
  } catch (error) {
    console.error('Error posting job:', error);
  }
}, [dispatch, selectedJobPosting, selectedDeadline]);


  // Retract job
  const handleRetractJob = useCallback(async (jobId) => {
    try {
      await dispatch(updateJobStatus({ id: jobId, status: 'retracted' }));

      // Update the job status locally, resetting the posted status and deadline in the same row
      dispatch({
        type: 'jobs/updateJobList',
        payload: jobPostings.map(job =>
          job.id === jobId ? { ...job, posted: false, deadline: null } : job
        ),
      });
    } catch (error) {
      console.error('Error retracting job:', error);
    }
  }, [dispatch, jobPostings]);

  
  

  // Open and close modal
  const handleClickOpenPostJobModal = useCallback((job) => {
    setSelectedJobPosting(job);
    setSelectedDeadline(job.deadline ? moment(job.deadline).toDate() : null); // Prepopulate deadline if it exists
    setIsPostJobModalOpen(true);
  }, []);

  const handleClosePostJobModal = useCallback(() => {
    setIsPostJobModalOpen(false);
    setSelectedJobPosting(null);
    setSelectedDeadline(null);
  }, []);

  // Handle date change
  const handleDateChange = useCallback((date) => {
    setSelectedDeadline(date);
  }, []);

  // Define columns for react-table
  const columns = useMemo(() => [
    {
      Header: 'Title',
      accessor: 'title',
      Cell: ({ value }) => (
        <div className="truncate" title={value}>{value}</div>
      ),
      width: 200,
    },
    {
      Header: 'Department',
      accessor: 'department',
      Cell: ({ value }) => (
        <div className="truncate" title={value}>{value}</div>
      ),
      width: 150,
    },
    {
      Header: 'Location',
      accessor: 'location',
      Cell: ({ value }) => (
        <div className="truncate" title={value}>{value}</div>
      ),
      width: 150,
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: ({ value }) => (
        <div className="truncate" title={value} style={{ width: '300px' }}>{value}</div>
      ),
      width: 300,
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => (
        <div className="truncate" title={value}>{value}</div>
      ),
      width: 120,
    },
    {
      Header: 'Posted',
      accessor: 'posted',
      Cell: ({ value }) => (
        value ? <CheckCircle className="text-green-500" /> : <Cancel className="text-red-500" />
      ),
      disableSortBy: true,
      width: 100,
    },
    {
      Header: 'Deadline',
      accessor: 'deadline',
      Cell: ({ value }) => (
        value ? moment(value).format('YYYY-MM-DD') : 'No deadline set'
      ), // Display the deadline properly
      width: 200,
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        row.original.posted ? (
          <Button
            variant="outlined"
            className="bg-red-500 hover:bg-red-700 text-white"
            onClick={() => handleRetractJob(row.original.id)}
            endIcon={<RestoreIcon />}
          >
            Retract
          </Button>
        ) : (
          <Button
            variant="outlined"
            className="bg-green-500 hover:bg-green-700 text-white"
            onClick={() => handleClickOpenPostJobModal(row.original)}
            endIcon={<SendIcon />}
          >
            Post Job
          </Button>
        )
      ),
      width: 150,
    },
  ], [handleClickOpenPostJobModal, handleRetractJob]);

  // Table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, gotoPage } = useTable(
    {
      columns,
      data: jobPostings, // Ensure that jobPostings data is updated correctly with posted jobs
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
    usePagination
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-[6] flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 bg-white">
          <div className='shadow-black shadow-md'>
            <div className="bg-white rounded-lg shadow-md p-4">
              <Typography variant="h4" component="h1" className="text-center text-gray-800 py-4 mb-6">
                Job Postings
              </Typography>
              <div className="overflow-x-auto">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                  <thead>
                    {headerGroups.map(headerGroup => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <th {...column.getHeaderProps()} style={{ width: column.width }} className="px-6 py-3 bg-white text-black">
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                    {rows.slice(state.pageIndex * pageSize, state.pageIndex * pageSize + pageSize).map(row => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map(cell => (
                            <td {...cell.getCellProps()} style={{ width: cell.column.width }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => gotoPage(0)}
                  disabled={state.pageIndex === 0}
                >
                  First Page
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => gotoPage(state.pageIndex - 1)}
                  disabled={state.pageIndex === 0}
                >
                  Previous Page
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => gotoPage(state.pageIndex + 1)}
                  disabled={state.pageIndex >= Math.ceil(rows.length / pageSize) - 1}
                >
                  Next Page
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => gotoPage(Math.ceil(rows.length / pageSize) - 1)}
                  disabled={state.pageIndex >= Math.ceil(rows.length / pageSize) - 1}
                >
                  Last Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isPostJobModalOpen}
        onClose={handleClosePostJobModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isPostJobModalOpen}>
          <Box className="absolute inset-0 flex justify-center items-center">
            <div className="bg-white rounded-md p-6 shadow-lg max-w-lg mx-auto">
              <Typography variant="h6" className="mb-4">
                Select Deadline for {selectedJobPosting?.title}
              </Typography>
              <Calendar
                onChange={handleDateChange}
                value={selectedDeadline}
                minDate={new Date()}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePostJob}
                  disabled={!selectedDeadline}
                >
                  Confirm & Post
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClosePostJobModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default HRJobPostingPage;
