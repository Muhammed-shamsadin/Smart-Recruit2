const applicantService = require('../services/applicantService');

const createApplicant = async (req, res) => {
  try {
    const applicant = await applicantService.createApplicant(req.body);
    res.status(201).json(applicant);
  } catch (error) {
    console.error('Error in createApplicant controller:', error.message);
    res.status(500).json({ error: 'Error creating applicant' });
  }
};

const getAllApplicants = async (req, res) => {
  try {
    const applicants = await applicantService.getAllApplicants();
    res.json(applicants);
  } catch (error) {
    console.error('Error in getAllApplicants controller:', error.message);
    res.status(500).json({ error: 'Error fetching applicants' });
  }
};

const getApplicantById = async (req, res) => {
  try {
    const applicant = await applicantService.getApplicantById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    res.json(applicant);
  } catch (error) {
    console.error('Error in getApplicantById controller:', error.message);
    res.status(500).json({ error: 'Error fetching applicant' });
  }
};

const updateApplicant = async (req, res) => {
  try {
    const applicant = await applicantService.updateApplicant(req.params.id, req.body);
    res.json(applicant);
  } catch (error) {
    console.error('Error in updateApplicant controller:', error.message);
    res.status(500).json({ error: 'Error updating applicant' });
  }
};

const deleteApplicant = async (req, res) => {
  try {
    await applicantService.deleteApplicant(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteApplicant controller:', error.message);
    res.status(500).json({ error: 'Error deleting applicant' });
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
  getApplicantById,
  updateApplicant,
  deleteApplicant,
};
