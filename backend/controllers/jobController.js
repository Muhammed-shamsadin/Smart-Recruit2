const jobService = require('../services/jobService');

const createJob = async (req, res) => {
  try {
    const jobData = req.body;

    // Ensure required fields are present
    const requiredFields = ['title', 'departmentId', 'location', 'type'];
    const missingFields = requiredFields.filter(field => !jobData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Create job
    const job = await jobService.createJob(jobData);

    res.status(201).json(job);
  } catch (error) {
    console.error('Error in createJob controller:', error.message);
    res.status(500).json({ error: 'Error creating job: ' + error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.json(jobs); // Make sure the department info is included in the response
  } catch (error) {
    console.error('Error in getAllJobs controller:', error.message);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error in getJobById controller:', error.message);
    res.status(500).json({ error: 'Error fetching job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.json(job);
  } catch (error) {
    console.error('Error in updateJob controller:', error.message);
    res.status(500).json({ error: 'Error updating job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteJob controller:', error.message);
    res.status(500).json({ error: 'Error deleting job' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};
