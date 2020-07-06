let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { 
	addTicketValidation, 
	updateTicketValidation,
	assignTicketValidation,
	assignToTicketValidation,
	resolveTicketValidation,
	validate, 
} = require('../validators/ticket');

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
 * Get all tickets of the current user
 * @route GET /tickets
 * @group Tickets
 * @produces application/json
 * @returns {Array.<TicketDTO>} 200 - Projects
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/', async (req, res) => {

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

	if(user == null) {
		return res.status(401).json();
	}

	res.json(user.tickets);
});

/**
 * @typedef CreateTicketDTO
 * @property {string} project - Name of the project
 * @property {string} title - Title of the ticket
 * @property {string} content - Content of the ticket
 * @property {string} client - Id of the client
 */

/**
 * Add a new ticket
 * @route POST /tickets
 * @group Tickets
 * @param {CreateTicketDTO.model} ticket.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Project or client doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/', addTicketValidation, validate, async (req, res) => {

	let project = await sequelize.project.findOne({
		where: {
			name: req.body.project
		}
	});

	if(project == null){
		return res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}

	let client = await sequelize.client.findOne({
		where: {
			id: req.body.client
		}
	});

	if(client == null) {
		return res.status(400).json({
			error: 'This client doesn\'t exists'
		});
	}

	let ticket = await sequelize.ticket.create({
		title: req.body.title,
		content: req.body.content,
		clientId: client.id
	});

	await project.addTicket(ticket);

	let json = ticket.toJSON();
	json.client = client.toJSON();

	res.json(json);
});

/**
 * @typedef UpdateTicketDTO
 * @property {string} title - Title of the ticket
 * @property {string} content - Content of the ticket
 * @property {string} client - Id of the client
 */

/**
 * Update a ticket
 * @route PUT /tickets/{ticketId}
 * @group Tickets
 * @param {string} ticket.path.required
 * @param {UpdateTicketDTO.model} ticket.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket or client doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.put('/:ticket', updateTicketValidation, validate, async (req, res) => {

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.params.ticket
		}
	});

	if(ticket == null) {
		return res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}

	let client = await sequelize.client.findOne({
		where: {
			id: req.body.client
		}
	});

	if(client == null) {
		return res.status(400).json({
			error: 'This client doesn\'t exists'
		});
	}

	await sequelize.ticket.update({
		title: req.body.title,
		content: req.body.content,
		clientId: client.id
	}, {
		where: {
			id: req.params.ticket
		}
	});

	ticket = await sequelize.ticket.findOne({
		where: {
			id: req.params.ticket
		}
	});

	let json = ticket.toJSON();
	json.client = client.toJSON();

	res.json(json);
});

/**
 * Assign a ticket to the current user
 * @route POST /tickets/assign/{ticketId}
 * @group Tickets
 * @param {string} ticket.path.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket doesn't exists or ticket is already assigned
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/assign/:ticket', assignTicketValidation, validate,  async (req, res) => {

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.params.ticket
		}
	});

	if(ticket == null) {
		return res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}

	if(ticket.userName != null) {
		return res.status(400).json({
			error: 'This ticket is already assigned'
		});
	}

	ticket.userName = req.user.username;
	ticket.status = 'In progress';
	ticket = await ticket.save();

	res.json(ticket);
});

/**
 * @typedef AssignTicketDTO
 * @property {string} ticket - Id of the ticket
 * @property {string} name - Name of the user
 */

/**
 * Assign a ticket to a user
 * @route POST /tickets/assign
 * @group Tickets
 * @param {AssignTicketDTO.model} assign.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket or user doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/assign', assignToTicketValidation, validate, async (req, res) => {

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.body.ticket
		}
	});

	if(ticket == null) {
		return res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}

	let user = await sequelize.user.findOne({
		where: {
			username: req.body.user
		}
	});

	if(user == null) {
		return res.status(400).json({
			error: 'This user doesn\'t exists'
		});
	}

	ticket.userName = req.body.user;
	ticket.status = 'In progress';
	ticket = await ticket.save();

	res.json(ticket);
});

/**
 * Resolve ticket
 * @route POST /tickets/{ticketId}/resolve
 * @group Tickets
 * @param {string} ticket.path.required
 * @consumes application/json
 * @produces application/json
 * @returns {TicketDTO.model} 200 - Ticket
 * @returns {Error.model} 400 - Ticket doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/:ticket/resolve', resolveTicketValidation, validate, async (req, res) => {

	let ticket = await sequelize.ticket.findOne({
		where: {
			id: req.params.ticket
		}
	});

	if(ticket == null) {
		return res.status(400).json({
			error: 'This ticket doesn\'t exists'
		});
	}

	ticket.status = 'Resolved';
	ticket = await ticket.save();

	res.json(ticket);
});

module.exports = router;
