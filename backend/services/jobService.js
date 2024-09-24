const prisma = require('../prisma/client'); 

// Helper function to format date in ISO-8601 format
const formatDate = (date) => {
  if (date) {
    return new Date(date).toISOString(); // Convert to ISO-8601 format
  }
  return null;
};

// Create a new job
const createJob = async (jobData) => {
  try {
    const {
      title,
      departmentId,
      // departmentname, // Added this
      location,
      description,
      responsibilities,
      requirements,
      preferredSkills,
      type,
      status,
      deadline,
      posted,
      teamLeadId,
      adminId,
      managerId,
      hrId,
      keySuggestions
    } = jobData;

    const job = await prisma.job.create({
      data: {
        title,
        departmentId,
        // departmentname, // Use this field
        location,
        description,
        responsibilities,
        requirements,
        preferredSkills,
        type,
        status: status || 'Pending', // Default status if not provided
        deadline: deadline ? new Date(deadline) : null, // Ensure deadline is a Date object
        posted,
        teamLeadId,
        adminId,
        managerId,
        hrId,
        keySuggestions
      },
      // include: {
      //   department: true, // Include department details
      // },
    });

    return job;
  } catch (error) {
    console.error('Error in createJob service:', error.message);
    throw error; // Re-throw error to handle in the controller
  }
};


// Get all jobs
const getAllJobs = async () => {
  try {
    return await prisma.job.findMany();
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw new Error('Database error: ' + error.message);
  }
};

// Get a job by ID
const getJobById = async (id) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: Number(id) }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    throw new Error('Database error: ' + error.message);
  }
};

// Update a job by ID
const updateJob = async (id, data) => {
  try {
    // If deadline is provided, ensure it's a valid Date object
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    }

    const updatedJob = await prisma.job.update({
      where: { id: Number(id) },
      data: data,
    });
    return updatedJob;
  } catch (error) {
    console.error('Error updating job:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};


// Delete a job by ID
const deleteJob = async (id) => {
  try {
    await prisma.job.delete({
      where: { id: Number(id) }
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Database error: ' + error.message);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};
