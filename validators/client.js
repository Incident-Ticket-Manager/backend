const { body, param } = require('express-validator');
let validate = require('./validator');

const addClientValidation = [
	body('name', 'Client name required').not().isEmpty(),
	body('email', 'Valid email required').isEmail(),
	body('phone', 'Valid phone number required').isMobilePhone(),
	body('address', 'Address required').not().isEmpty(),
];

const updateClientValidation = [
	param('client', 'Client id required').not().isEmpty(),
	body('name', 'Client name required').not().isEmpty(),
	body('email', 'Valid email required').isEmail(),
	body('phone', 'Valid phone number required').isMobilePhone(),
	body('address', 'Address required').not().isEmpty(),
];

const deleteClientValidation = [
	param('client', 'Client id required').not().isEmpty(),
];

module.exports = {
	addClientValidation,
	updateClientValidation,
	deleteClientValidation,
	validate
};