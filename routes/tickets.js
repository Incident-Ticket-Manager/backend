let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

/**
 * @typedef ClientDTO
 * @property {string} id - Id of the client
 * @property {string} name - Name of the client
 * @property {string} email - Email of the client
 * @property {string} phone - Phone of the client
 * @property {string} address - Address of the client
 */

/**
 * @typedef TicketDTO
 * @property {string} id - Id of the ticket
 * @property {string} title - Title of the ticket
 * @property {string} content - Content of the ticket
 * @property {enum} status - Status of the ticket - eg: Open, In progress, Resolved
 * @property {string} userName - Assigned user
 * @property {string} projectName - Project of the ticket
 * @property {string} clientId - The client id who create the ticket
 * @property {ClientDTO.model} client - Client who created the ticket
 */

/**
 * @typedef Error
 * @property {string} error - Register error
 */

/**
 * Get all tickets of the current user
 * @route GET /tickets
 * @group Tickets
 * @consumes application/json
 * @produces application/json
 * @returns {Array.<TicketDTO>} 200 - Projects
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/', async (req, res, next) => {

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		},
		include: [
			{
				model: sequelize.ticket,
				include: sequelize.client
			},
		]
	});

	if(user != null) {
		res.json(user.tickets);
	}
	else {
		res.status(401).json();
	}
});

/**
 * @typedef CreateTicketDTO
 * @property {string} project - Name of the project
 * @property {string} title - Title of the ticket
 * @property {string} content - Content of the ticket
 * @property {string} name - Name of the client
 * @property {string} email - Email of the client
 * @property {string} phone - Phone of the client
 * @property {string} address - Address of the client
 */

/**
 * Add a new ticket
 * @route POST /tickets
 * @group Tickets
 * @param {CreateTicketDTO.model} ticket.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Project doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.post('/', [
	//project
	body('project').not().isEmpty(),
	//client
	body('name').not().isEmpty(),
	body('email').isEmail(),
	body('phone').isMobilePhone(),
	body('address').not().isEmpty(),
	//ticket
	body('title').not().isEmpty(),
	body('content').not().isEmpty(),
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let project = await sequelize.project.findOne({
		where: {
			name: req.body.project
		}
	});

	if(project != null){
		let client = await sequelize.client.create({
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address,
		});

		let ticket = await sequelize.ticket.create({
			title: req.body.title,
			content: req.body.content,
		});

		client.addTicket(ticket);
		project.addTicket(ticket);

		let json = ticket.toJSON();
		json.client = client.toJSON();

		res.json(json);
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

/**
 * @typedef AssignTicketDTO
 * @property {string} ticket - Id of the ticket
 * @property {string} user - Name of the user
 */

/**
 * Assign a ticket to a user
 * @route POSt /tickets/assign
 * @group Tickets
 * @param {AssignTicketDTO.model} ticket.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket doesn't exists or user doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.post('/assign', [
	body('ticket').not().isEmpty(),
	body('user').not().isEmpty()
], async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.body.ticket
		}
	});

	if(ticket != null) {
		
		let user = await sequelize.user.findOne({
			where: {
				username: req.body.user
			}
		});

		if(user != null) {
			ticket.userUsername = user.username;
			ticket.status = 'In progress';
			ticket = await ticket.save();

			res.json(ticket);
		}
		else {
			res.status(400).json({
				error: 'This user doesn\'t exists'
			});
		}
	}
	else {
		res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}
});

/**
 * @typedef UpdateTicketDTO
 * @property {string} ticket - Id of the ticket
 * @property {enum} status - Status of the ticket - eg: Open, In progress, Resolved
 */

/**
 * Resolve ticket
 * @route POST /tickets/resolve
 * @group Tickets
 * @param {string} ticket.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.post('/resolve', [
	body('ticket').not().isEmpty(),
], async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.body.ticket
		}
	});

	if(ticket != null) {
		ticket.status = 'Resolved';
		ticket = await ticket.save();
		
		res.json(ticket);
	}
	else {
		res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}
});

module.exports = router;
