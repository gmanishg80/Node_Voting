const { body } = require('express-validator');

const validateVoter = () => {
  return [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isString().withMessage('Name must be a string'),

    body('age')
      .notEmpty().withMessage('Age is required')
      .isInt({ min: 0 }).withMessage('Age must be a positive integer'),

    body('email')
      .optional()
      .isEmail().withMessage('Enter a valid Email'),

    body('mobile')
      .optional()
      .isString().withMessage('Mobile number must be a string'),

    body('address')
      .notEmpty().withMessage('Address is required')
      .isString().withMessage('Address must be a string'),

    body('aadharCardNumber')
      .notEmpty().withMessage('Aadhar Card Number is required')
      .isNumeric().withMessage('Aadhar Card Number must be a number')
      .isLength({ min: 12, max: 12 }).withMessage('Aadhar Card Number must be 12 digits'),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 5 }).withMessage('Password must contain at least 5 characters '),

    body('role')
      .optional()
      .isIn(['voter', 'admin']).withMessage('Role must be either "voter" or "admin"'),

  ];
};

module.exports = {
  validateVoter,
};
