// Store.jsx
import { configureStore } from '@reduxjs/toolkit';
import departmentReducer from '../../redux/slices/DepartmentSlice.jsx';
import jobReducer from '../../redux/slices/JobSlice.jsx';
import applicantReducer from '../../redux/slices/ApplicantSlice.jsx'; // Correct import path

const store = configureStore({
  reducer: {
    departments: departmentReducer,
    jobs: jobReducer,
    applicants: applicantReducer, // Correctly imported
  },
});

export default store;
