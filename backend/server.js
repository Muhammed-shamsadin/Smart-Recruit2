  const express = require('express');
  const cors = require('cors');
  const app = express();

  // Import routes
  const userRoutes = require('./routes/users');
  const departmentRoutes = require('./routes/departments');
  const jobRoutes = require('./routes/jobs');
  const applicantRoutes = require('./routes/applicants');  // Add this line

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Route handlers
  app.use('/api/users', userRoutes);
  app.use('/api/departments', departmentRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applicants', applicantRoutes);  // Add this line

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
