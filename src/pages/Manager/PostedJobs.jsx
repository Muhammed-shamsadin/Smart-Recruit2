// src/pages/PostedJobs.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus, deleteJob, postJob } from '../../redux/slices/JobSlice';
import Table from '../../components/Table';

const PostedJobs = () => {
    const dispatch = useDispatch();
    const jobs = useSelector((state) => state.jobs.list);
    const jobStatus = useSelector((state) => state.jobs.status);

    useEffect(() => {
        if (jobStatus === 'idle') {
            dispatch(fetchJobs());
        }
    }, [dispatch, jobStatus]);

    const handleAccept = (id) => {
        dispatch(updateJobStatus({ id, status: 'Accepted' }));
    };

    const handleReject = (id) => {
        dispatch(updateJobStatus({ id, status: 'Rejected' }));
    };

    const handleDelete = (id) => {
        dispatch(deleteJob(id));
    };

    const handlePost = async (newJob) => {
        await dispatch(postJob(newJob));
        dispatch(fetchJobs()); // Fetch jobs again to ensure the list is updated
    };

    return (
        <div className="bg-white p-8 rounded shadow-lg w-full mx-auto">
            <h1 className="text-2xl font-bold mb-6">Posted Jobs</h1>
            {jobs.length > 0 ? (
                <Table
                    data={jobs}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                    handleDelete={handleDelete}
                />
            ) : (
                <p>No jobs posted yet.</p>
            )}
        </div>
    );
};

export default PostedJobs;
