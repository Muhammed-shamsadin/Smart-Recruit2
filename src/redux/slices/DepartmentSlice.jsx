import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/departments';

// Async thunks with error handling
export const fetchDepartments = createAsyncThunk('departments/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addDepartment = createAsyncThunk('departments/add', async (departmentData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, departmentData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const editDepartment = createAsyncThunk('departments/edit', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        const index = state.list.findIndex((dept) => dept.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter((dept) => dept.id !== action.payload);
        state.status = 'succeeded';
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(editDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default departmentSlice.reducer;
