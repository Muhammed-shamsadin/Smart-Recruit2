import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base URL
const BASE_URL = 'http://localhost:5000/api/applicants';

// Fetch applicants
export const fetchApplicants = createAsyncThunk('applicants/fetchApplicants', async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

// Add applicant
export const addApplicant = createAsyncThunk('applicants/addApplicant', async (newApplicant) => {
  const response = await axios.post(BASE_URL, newApplicant);
  return response.data;
});

// Edit applicant
export const editApplicant = createAsyncThunk('applicants/editApplicant', async (updatedApplicant) => {
  const response = await axios.put(`${BASE_URL}/${updatedApplicant.id}`, updatedApplicant);
  return response.data;
});

// Delete applicant
export const deleteApplicant = createAsyncThunk('applicants/deleteApplicant', async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

// Update applicant status
export const updateApplicant = createAsyncThunk('applicants/updateApplicant', async ({ id, updates }) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updates);
  return response.data;
});

const applicantSlice = createSlice({
  name: 'applicants',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateList: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch applicants
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Add applicant
    builder
      .addCase(addApplicant.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });

    // Edit applicant
    builder
      .addCase(editApplicant.fulfilled, (state, action) => {
        const index = state.list.findIndex(applicant => applicant.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });

    // Delete applicant
    builder
      .addCase(deleteApplicant.fulfilled, (state, action) => {
        state.list = state.list.filter(applicant => applicant.id !== action.payload);
      });

    // Update applicant status
    builder
      .addCase(updateApplicant.fulfilled, (state, action) => {
        const index = state.list.findIndex(applicant => applicant.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { updateList } = applicantSlice.actions; // Export the updateList action
export default applicantSlice.reducer;
