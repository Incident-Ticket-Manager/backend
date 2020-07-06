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

const updateUserValidation = [
	body('username', 'Username required').not().isEmpty(),
	body('password', 'Password required').not().isEmpty(),
	body('email', 'Valid email required').isEmail()
];

const deleteUserValidation = [
	param('user', 'Username required').not().isEmpty(),
];

module.exports = {
	registerValidation,
	loginValidation,
	updateUserValidation,
	deleteUserValidation,
	validate
};