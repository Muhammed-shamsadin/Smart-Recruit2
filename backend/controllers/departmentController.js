const departmentService = require('../services/departmentService');

const createDepartment = async (req, res) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json(department);
  } catch (error) {
    console.error('Error in createDepartment controller:', error.message);
    res.status(500).json({ error: 'Error creating department' });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.json(departments);
  } catch (error) {
    console.error('Error in getAllDepartments controller:', error.message);
    res.status(500).json({ error: 'Error fetching departments' });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Error in getDepartmentById controller:', error.message);
    res.status(500).json({ error: 'Error fetching department' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await departmentService.updateDepartment(req.params.id, req.body);
    res.json(department);
  } catch (error) {
    console.error('Error in updateDepartment controller:', error.message);
    res.status(500).json({ error: 'Error updating department' });
  }
};


const deleteDepartment = async (req, res) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteDepartment controller:', error.message);
    res.status(500).json({ error: 'Error deleting department' });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};
