const { body, param } = require('express-validator');
let validate = require('./validator');

const addTicketValidation = [
	body('project', 'Project name required').not().isEmpty(),
	body('client', 'Client id required').not().isEmpty(),
	body('title', 'Title required').not().isEmpty(),
	body('content', 'Content required').not().isEmpty(),
];

const updateTicketValidation = [
	param('ticket', 'Ticket id required').not().isEmpty(),
	body('client', 'Client id required').not().isEmpty(),
	body('title', 'Title required').not().isEmpty(),
	body('content', 'Content required').not().isEmpty(),
];

const assignTicketValidation = [
	param('ticket', 'Ticket id required').not().isEmpty(),
];

const assignToTicketValidation = [
	body('ticket', 'Ticket id required').not().isEmpty(),
	body('user', 'User username required').not().isEmpty(),
];

const resolveTicketValidation = [
	param('ticket', 'Ticket id required').not().isEmpty(),
];

module.exports = {
	addTicketValidation,
	updateTicketValidation,
	assignTicketValidation,
	assignToTicketValidation,
	resolveTicketValidation,
	validate
};