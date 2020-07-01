const { body } = require('express-validator');
let validate = require('./validator');

const projectDetailsValidation = [
	param('project', 'Project name required').not().isEmpty()
];

const addProjectValidation = [
	body('name', 'Project name required').not().isEmpty()
];

const updateProjectValidation = [
	param('project', 'Project name required').not().isEmpty(),
	body('name', 'New name required').not().isEmpty()
];

const deleteProjectValidation = [
	param('project', 'Project name required').not().isEmpty()
];

const addUserProjectValidation = [
	body('user', 'User username required').not().isEmpty(),
	body('project', 'Project name required').not().isEmpty()
];

const deleteUserProjectValidation = [
	param('user', 'User username required').not().isEmpty(),
	param('project', 'Project name required').not().isEmpty()
];

module.exports = {
	projectDetailsValidation,
	addProjectValidation,
	updateProjectValidation,
	deleteProjectValidation,
	addUserProjectValidation,
	deleteUserProjectValidation,
	validate
};