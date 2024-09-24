// src/redux/slices/JobSlice.jsx

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = 'http://localhost:5000/api/jobs'; // Update to match jobService.js

// Async thunk to fetch jobs
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
});

// Async thunk to fetch a single job by ID
export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
});

// Async thunk to post jobs
export const postJob = createAsyncThunk('jobs/postJob', async (newJob) => {
    const response = await axios.post(BASE_URL, newJob);
    return response.data; // Ensure you return the created job
});


// Async thunk to update job status
export const updateJobStatus = createAsyncThunk('jobs/updateJobStatus', async ({ id, status }) => {
    // Fetch the current job data
    const currentJobResponse = await axios.get(`${BASE_URL}/${id}`);
    const currentJob = currentJobResponse.data;
    
    // Update only the status
    const updatedJob = { ...currentJob, status };
    const response = await axios.put(`${BASE_URL}/${id}`, updatedJob);

    return response.data; // Return the updated job data
});

// Async thunk to delete a job
export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id) => {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
});

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        list: [],
        currentJob: null,
        status: 'idle',
        error: null,
        filter: 'All',
    },
    reducers: {
        setJobs: (state, action) => {
            state.list = action.payload;
          },
        setFilter(state, action) {
            state.filter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(postJob.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(postJob.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(postJob.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchJobs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchJobById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentJob = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(updateJobStatus.fulfilled, (state, action) => {
                const updatedJob = action.payload;
                const index = state.list.findIndex(job => job.id === updatedJob.id);
                if (index >= 0) {
                    state.list[index] = updatedJob;
                }
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                const id = action.payload;
                state.list = state.list.filter(job => job.id !== id);
            });
    },
});

// Export the setFilter action
export const { setJobs, setFilter } = jobSlice.actions;

export default jobSlice.reducer;
