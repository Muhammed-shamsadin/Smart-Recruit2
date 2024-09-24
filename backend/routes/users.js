const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');  // Correct path to userController
// const { authenticateToken } = require('../middleware/auth');
// const { validateUser } = require('../validation/userValidation');

// Debugging Statements
console.log('userController:', userController);
console.log('createUser:', userController.createUser);

// Route Definitions
router.post('/',userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
