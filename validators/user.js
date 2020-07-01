const { body, param } = require('express-validator');
let validate = require('./validator');

const registerValidation = [
	body('username', 'Username required').not().isEmpty(),
	body('password', 'Valid password required').matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[\d])(?!.*\s).{8,}$/),
	body('email', 'Valid email required').isEmail()
];

const loginValidation = [
	body('username', 'Username required').not().isEmpty(),
	body('password', 'Password required').not().isEmpty()
];

const deleteValidation = [
	param('user', 'Username required').not().isEmpty(),
];

module.exports = {
	registerValidation,
	loginValidation,
	deleteValidation,
	validate
};