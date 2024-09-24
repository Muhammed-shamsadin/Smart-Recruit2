import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, updateApplicant } from '../redux/slices/ApplicantSlice';
import axios from 'axios';

const CandidatesTable = ({ searchTerm, filterStatus = 'Accepted' }) => {
  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.applicants);
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState('UnderReview');
  const [testRating, setTestRating] = useState('');
  const [interviewRating, setInterviewRating] = useState('');
  const [isTestRatingSaved, setIsTestRatingSaved] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchApplicants());
    }
  }, [dispatch, status]);

  const handleStageChange = (e) => {
    const newStage = e.target.value;
    setStage(newStage);
    if (newStage === 'Interview' && !isTestRatingSaved) {
      alert('Please enter and save a Test rating before selecting Interview stage.');
      return;
    }
  };

  const handleSave = async () => {
    if (stage === 'Interview' && !isTestRatingSaved) {
      alert('Test rating is required before saving Interview rating.');
      return;
    }

    const calculatedTotalScore = Number(testRating) + Number(interviewRating);
    const updatedCandidate = { 
      ...selectedCandidate, 
      stage, 
      testRating: Number(testRating), 
      interviewRating: Number(interviewRating), 
      totalScore: calculatedTotalScore 
    };

    try {
      await axios.put(`http://localhost:5000/api/applicants/${selectedCandidate.id}`, updatedCandidate);
      dispatch(updateApplicant(updatedCandidate));

      // Update local state to reflect the new values immediately
      const updatedList = list.map(candidate =>
        candidate.id === selectedCandidate.id ? updatedCandidate : candidate
      );
      dispatch({ type: 'applicants/updateList', payload: updatedList });

      closeModal();
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handlePass = async (candidateId) => {
    try {
      const updatedCandidate = { ...list.find(cand => cand.id === candidateId), candidateStatus: 'Passed' };
      await axios.put(`http://localhost:5000/api/applicants/${candidateId}`, updatedCandidate);
      dispatch(updateApplicant(updatedCandidate));

      // Update local state
      const updatedList = list.map(candidate =>
        candidate.id === candidateId ? updatedCandidate : candidate
      );
      dispatch({ type: 'applicants/updateList', payload: updatedList });
    } catch (error) {
      console.error('Error updating candidate status to Passed:', error);
    }
  };

  const handleFail = async (candidateId) => {
    try {
      const updatedCandidate = { ...list.find(cand => cand.id === candidateId), candidateStatus: 'Failed' };
      await axios.put(`http://localhost:5000/api/applicants/${candidateId}`, updatedCandidate);
      dispatch(updateApplicant(updatedCandidate));

      // Update local state
      const updatedList = list.map(candidate =>
        candidate.id === candidateId ? updatedCandidate : candidate
      );
      dispatch({ type: 'applicants/updateList', payload: updatedList });
    } catch (error) {
      console.error('Error updating candidate status to Failed:', error);
    }
  };

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setStage(candidate.stage || 'UnderReview');
    setTestRating(candidate.testRating || '');
    setInterviewRating(candidate.interviewRating || '');
    setIsTestRatingSaved(!!candidate.testRating);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
    setStage('UnderReview');
    setTestRating('');
    setInterviewRating('');
    setIsTestRatingSaved(false);
  };

  const handleRatingChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 50)) {
      setter(value);
    }
  };

  const filteredData = (list || [])
    .filter(item => item.status === filterStatus)
    .filter(item =>
      `${item.firstName} ${item.lastName} ${item.jobPosition}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const columns = [
      { field: 'id', headerName: 'ID', width: 100, sortable: false },
      { field: 'firstName', headerName: 'First Name', width: 150 },
      { field: 'lastName', headerName: 'Last Name', width: 150 },
      { field: 'jobPosition', headerName: 'Job Position', width: 200 },
      { field: 'dateApplied', headerName: 'Date Applied', width: 150 },
      {
        field: 'stage',
        headerName: 'Stage',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.stage || 'Not Yet Assigned'}</span>
        ),
      },
      {
        field: 'testRating',
        headerName: 'Test Rating',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.testRating || 'N/A'}</span>
        ),
      },
      {
        field: 'interviewRating',
        headerName: 'Interview Rating',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.interviewRating || 'N/A'}</span>
        ),
      },
      {
        field: 'totalScore',
        headerName: 'Total Score',
        width: 150,
        renderCell: (params) => (
          <span>{params.row.totalScore || 'N/A'}</span>
        ),
      },
      {
        field: 'candidateStatus',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => {
          const statusColor = {
            Failed: 'red',
            Passed: 'green',
            Pending: 'gray',
          }[params.row.candidateStatus] || 'gray'; // Default to gray
    
          return (
            <span style={{ color: statusColor, fontWeight: 'bold' }}>
              {params.row.candidateStatus || 'Pending'}
            </span>
          );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 350,
        renderCell: (params) => {
          const candidate = params.row;
          const showRejectButton =
            (candidate.stage === 'Test' && candidate.testRating < 25) ||
            (candidate.stage === 'Interview' && candidate.interviewRating < 25);
    
          return (
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white"
                onClick={() => openModal(candidate)}
              >
                View
              </button>
              <button
                className="px-3 py-1 text-sm font-semibold text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white"
                onClick={() => handlePass(candidate.id)}
              >
                Pass
              </button>
              <button
                className="px-3 py-1 text-sm font-semibold text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                onClick={() => handleFail(candidate.id)}
              >
                Fail
              </button>
            </div>
          );
        },
      },
    ];
    

  return (
    <div className="relative w-full h-[500px] bg-white border border-gray-200 rounded-lg shadow overflow-y-auto">
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15]}
        pagination
        disableSelectionOnClick
        autoHeight={false}
      />

      {modalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Update Candidate</h3>
            <div className="mb-4">
              <label className="block text-gray-700">Stage</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={stage}
                onChange={handleStageChange}
              >
                <option value="UnderReview">Under Review</option>
                <option value="Test">Test</option>
                <option value="Interview">Interview</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Test Rating</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={testRating}
                onChange={handleRatingChange(setTestRating)}
                placeholder="0 - 50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Interview Rating</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={interviewRating}
                onChange={handleRatingChange(setInterviewRating)}
                placeholder="0 - 50"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ml-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesTable;
