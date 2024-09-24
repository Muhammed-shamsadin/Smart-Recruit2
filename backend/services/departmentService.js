const prisma = require('../prisma/client'); // Ensure this path is correct and Prisma client is properly configured

// Helper function to format date in ISO-8601 format
const formatDate = (date) => {
  if (date) {
    return new Date(date).toISOString(); // Convert to ISO-8601 format
  }
  return null;
};

// Create a new department
const createDepartment = async (data) => {
  try {
    const { name, status, dateFormed, positionOpen, adminId } = data;

    // Input validation
    if (!name || !status) {
      throw new Error("Missing required fields: name or status.");
    }

    // Use a default admin ID if adminId is not provided
    const defaultAdminId = 1; // Replace with the actual ID of your default admin
    const validAdminId = adminId ? Number(adminId) : defaultAdminId;

    console.log(`Checking if adminId ${validAdminId} exists...`);

    // Ensure adminId exists in the User table
    const adminExists = await prisma.user.findUnique({
      where: { id: validAdminId },
    });

    if (!adminExists) {
      throw new Error('Invalid adminId: Admin does not exist.');
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        status,
        dateFormed: formatDate(dateFormed),
        positionOpen,
        adminId: validAdminId,
      }
    });

    return department;
  } catch (error) {
    console.error('Error creating department:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};



// Get all departments
const getAllDepartments = async () => {
  try {
    return await prisma.department.findMany();
  } catch (error) {
    console.error('Error fetching all departments:', error);
    throw new Error('Database error: ' + error.message);
  }
};

// Get a department by ID
const getDepartmentById = async (id) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: Number(id) }
    });
    
    if (!department) {
      throw new Error('Department not found');
    }

    return department;
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    throw new Error('Database error: ' + error.message);
  }
};

//get department by name
const getDepartmentByName = async (name) => {
  try {
    return await prisma.department.findUnique({
      where: { name },
    });
  } catch (error) {
    console.error('Error fetching department by name:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};

// Update a department by ID
const updateDepartment = async (id, data) => {
  try {
    const updatedDepartment = await prisma.department.update({
      where: { id: Number(id) },
      data: data,
    });
    return updatedDepartment;
  } catch (error) {
    console.error('Error updating department:', error.message);
    throw new Error('Database error: ' + error.message);
  }
};



// Delete a department by ID
const deleteDepartment = async (id) => {
  try {
    const deletedDepartment = await prisma.department.delete({
      where: { id: Number(id) }
    });

    return deletedDepartment;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw new Error('Database error: ' + error.message);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentByName,
  updateDepartment,
  deleteDepartment
};
