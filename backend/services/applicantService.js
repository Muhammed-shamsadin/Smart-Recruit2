const prisma = require('../prisma/client'); // Ensure this path is correct and Prisma client is properly configured

// Helper function to format date in ISO-8601 format
const formatDate = (date) => {
  if (date) {
    return new Date(date).toISOString(); // Convert to ISO-8601 format
  }
  return null;
};

// Create a new applicant
const createApplicant = async (data) => {
    try {
      const { firstName, lastName, email, coverLetter, jobPosition, departmentId, dateApplied, status, stage, testRating, interviewRating, dateProcessed, totalScore } = data;
  
      // Input validation for required fields
      if (!firstName || !lastName || !email || !departmentId || !dateApplied) {
        throw new Error("Missing required fields.");
      }
  
      // Check if the departmentId exists in the Department table
      const department = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
      });
  
      if (!department) {
        throw new Error('Department does not exist.');
      }
  
      // Proceed to create the applicant if the department exists
      const applicant = await prisma.applicant.create({
        data: {
          firstName,
          lastName,
          email,
          coverLetter,
          jobPosition,
          departmentId: Number(departmentId),
          dateApplied: formatDate(dateApplied),
          status: status || 'pending',
          stage: stage || 'underReview',
          testRating: testRating || null,
          interviewRating: interviewRating || null,
          dateProcessed: formatDate(dateProcessed) || null,
          totalScore: totalScore || null,
        },
      });
  
      return applicant;
    } catch (error) {
      console.error('Error creating applicant:', error.message);
      throw new Error('Database error: ' + error.message);
    }
  };

// Get all applicants
const getAllApplicants = async () => {
  try {
    return await prisma.applicant.findMany({
      include: { department: true }, // Include related department details
    });
  } catch (error) {
    console.error('Error fetching all applicants:', error);
    throw new Error('Database error: ' + error.message);
  }
};

// Get an applicant by ID
const getApplicantById = async (id) => {
  try {
    const applicant = await prisma.applicant.findUnique({
      where: { id: Number(id) },
      include: { department: true }, // Include related department details
    });

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    return applicant;
  } catch (error) {
    console.error('Error fetching applicant by ID:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};

// Update an applicant
// Update an applicant
const updateApplicant = async (id, data) => {
  try {
    // Log incoming data to debug
    console.log('Data received for update:', data);

    // Destructure the necessary fields
    const { firstName, lastName, email, departmentId, dateApplied, ...rest } = data;

    // Input validation for required fields
    if (!firstName || !lastName || !email || !departmentId || !dateApplied) {
      throw new Error("Missing required fields.");
    }

    // Check if the departmentId exists
    const department = await prisma.department.findUnique({
      where: { id: Number(departmentId) },
    });

    if (!department) {
      throw new Error('Department does not exist.');
    }

    // Proceed to update the applicant
    const updatedApplicant = await prisma.applicant.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        email,
        coverLetter: rest.coverLetter || null,
        jobPosition: rest.jobPosition || null,
        departmentId: Number(departmentId),
        dateApplied: formatDate(dateApplied),
        status: rest.status || 'pending',
        stage: rest.stage || 'underReview',
        testRating: rest.testRating || null,
        interviewRating: rest.interviewRating || null,
        dateProcessed: formatDate(rest.dateProcessed) || null,
        totalScore: rest.totalScore || null,
      },
    });

    return updatedApplicant;
  } catch (error) {
    console.error('Error updating applicant:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};





// Delete an applicant
const deleteApplicant = async (id) => {
  try {
    const deletedApplicant = await prisma.applicant.delete({
      where: { id: Number(id) },
    });
    return deletedApplicant;
  } catch (error) {
    console.error('Error deleting applicant:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};

module.exports = {
  createApplicant,
  getAllApplicants,
  getApplicantById,
  updateApplicant,
  deleteApplicant,
};
