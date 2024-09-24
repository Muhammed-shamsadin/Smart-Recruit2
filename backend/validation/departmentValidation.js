// const { check, validationResult } = require('express-validator');

// const validateDepartment = [
//   check('name').notEmpty().withMessage('Name is required'),
//   check('status').notEmpty().withMessage('Status is required'),
//   check('dateFormed').isDate().withMessage('DateFormed must be a valid date'),
//   check('positionOpen').isBoolean().withMessage('PositionOpen must be a boolean'),
//   check('adminId').isInt().withMessage('AdminId must be an integer'),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   }
// ];

// module.exports = { validateDepartment };

