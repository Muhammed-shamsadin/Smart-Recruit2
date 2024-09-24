// // userValidation.js

// const { body, validationResult } = require('express-validator');

// // Middleware to validate user input
// const validateUser = [
//   body('name')
//     .notEmpty()
//     .withMessage('Name is required')
//     .isLength({ max: 255 })
//     .withMessage('Name must be at most 255 characters long'),
  
//   body('email')
//     .notEmpty()
//     .withMessage('Email is required')
//     .isEmail()
//     .withMessage('Invalid email format')
//     .isLength({ max: 255 })
//     .withMessage('Email must be at most 255 characters long'),

//   body('role')
//     .notEmpty()
//     .withMessage('Role is required')
//     .isLength({ max: 50 })
//     .withMessage('Role must be at most 50 characters long'),

//   body('password')
//     .notEmpty()
//     .withMessage('Password is required')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters long')
//     .isLength({ max: 255 })
//     .withMessage('Password must be at most 255 characters long'),
  
//   // Middleware to check validation results
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// module.exports = { validateUser };
