let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');
const ticket = require('../models/ticket');

/**
 * @typedef ProjectDTO
 * @property {string} name - Name of the project
 * @property {string} admin - Admin name of the project
 */

/**
 * @typedef Error
 * @property {string} error - Register error
 */

/**
 * Get all projects of the current user
 * @route GET /projects
 * @group Projects
 * @consumes application/json
 * @produces application/json
 * @returns {Array.<ProjectDTO>} 200 - Projects
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/', async (req, res, next) => {

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		},
		include: {
			model: sequelize.project,
			through: {attributes: []}
		}
	});

	if(user != null) {
		res.json(user.projects);
	}
	else {
		res.status(401).json();
	}
});

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
 * @typedef ProjectFullDTO
 * @property {string} name - Name of the project
 * @property {string} admin - Admin name of the project
 * @property {Array.<TicketDTO>} tickets - Tickets of the project
 * @property {object} stats - Tickets stats
 */

/**
 * Get one project with his name
 * @route GET /projects/:name
 * @group Projects
 * @param {string} name
 * @consumes application/json
 * @produces application/json
 * @returns {ProjectFullDTO.model} 200 - Project
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/:name', async (req, res, next) => {
	if(req.params.name != null) {

		let project = await sequelize.project.findOne({
			where: {
				name: req.params.name
			},
			include: {
				model: sequelize.ticket,
				include: sequelize.client
			}
		});

		if(project != null) {

			let ticketStats = {
				"total": project.tickets.length
			}

			project.tickets.forEach((ticket) => {
				let status = ticket.status.toLowerCase();
				if(ticketStats[status] == null) {
					ticketStats[status] = 1;
				}
				else {
					ticketStats[status]++;
				}
			});

			let json = project.toJSON();
			json.ticketStats = ticketStats;

			res.json(json);
		}
		else {
			res.json({
				error: 'This project doesn\'t exists'
			})
		}
		
	}
	else {
		res.json({
			error: 'Invalid name'
		});
	}
});

/**
 * Add a new project
 * @route POST /projects
 * @group Projects
 * @param {ProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ProjectDTO.model} 200 - Project
 * @returns {Error.model} 400 - Project name already used
 * @returns 401 - User not authentified
 * @security JWT
 */
router.post('/', [
	body('name').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		}
	});

	if(user != null){
		try{
			let project = await sequelize.project.create({
				name: req.body.name,
				admin: user.username
			});

			await user.addProject(project);

			res.json(project);
		}
		catch(e){
			res.status(400).json({
				error: 'This project name is already used'
			});
		}
	}
	else {
		res.status(401).json();
	}
});

/**
 * @typedef UpdateProjectDTO
 * @property {string} name - Name of the project
 * @property {string} newName - New name of the project
 */

/**
 * Update a project
 * @route PUT /projects
 * @group Projects
 * @param {UpdateProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ProjectDTO.model} 200 - Project
 * @returns {Error.model} 400 - Project doesn't exists, the name is already used or you are not the admin of the project
 * @returns 401 - User not authentified
 * @security JWT
 */
router.put('/', [
	body('name').not().isEmpty(),
	body('newName').not().isEmpty(),
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let project  = await sequelize.project.findOne({
		where: {
			name: req.body.name
		}
	});

	if(project != null) {

		if(project.admin == req.user.username) {
			try {
				await sequelize.project.update({
					name: req.body.newName
				}, {
					where: {
						name: req.body.name
					},
				});

				res.json(await sequelize.project.findOne({
					where: {
						name: req.body.newName
					}
				}));
			}
			catch(e){
				res.status(400).json({
					error: 'This project name is already used'
				});
			}
		}
		else {
			res.status(400).json({
				error: 'You are not the admin of this project'
			});
		}
	}
	else{
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

/**
 * @typedef DeleteProjectDTO
 * @property {string} name - Name of the project
 */

/**
 * Delete a project
 * @route DELETE /projects
 * @group Projects
 * @param {DeleteProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This project doesn't exists or you are not the admin of the project
 * @returns 401 - User not authentified
 * @security JWT
 */
router.delete('/', [
	body('name').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let project  = await sequelize.project.findOne({
		where: {
			name: req.body.name
		}
	});

	if(project != null) {
		if(project.admin = req.user.username){
			await project.destroy();
			res.json();
		}
		else {
			res.status(400).json({
				error: 'You are not the admin of this project'
			});
		}
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

/**
 * @typedef UserProjectDTO
 * @property {string} user - Name of the user
 * @property {string} project - Name of the project
 */

/**
 * Add a user to a project
 * @route POST /projects/user
 * @group Projects
 * @param {UserProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This user, the project doesn't exists or you are not the admin of the project
 * @returns 401 - User not authentified
 * @security JWT
 */
router.post('/user', [
	body('user').not().isEmpty(),
	body('project').not().isEmpty()
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
			name: req.body.project,
		}
	});

	if(project != null) {
		if(project.admin == req.user.username) {
			let user = await sequelize.user.findOne({
				where: {
					username: req.body.user,
				}
			});

			if(user != null){

				await user.addProject(project);

				res.json();
			}
			else {
				res.status(400).json({
					error: 'This user doesn\'t exists'
				});
			}
		}
		else {
			res.status(400).json({
				error: 'You are not the admin of the project'
			});
		}
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

/**
 * Remove a user from a project
 * @route DELETE /projects/user
 * @group Projects
 * @param {UserProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This user, the project doesn't exists, not admin, don't remove yourself
 * @returns 401 - User not authentified
 * @security JWT
 */
router.delete('/user', [
	body('user').not().isEmpty(),
	body('project').not().isEmpty()
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
			name: req.body.project,
		}
	});

	if(project != null) {
		if(project.admin == req.user.username) {
			if(project.admin == req.body.user){
				res.status(400).json({
					error: 'You can\'t remove yourself'
				});
			}
			else {
				let user = await sequelize.user.findOne({
					where: {
						username: req.body.user,
					}
				});

				if(user != null){

					await user.removeProject(project);

					res.json();
				}
				else {
					res.status(400).json({
						error: 'This user doesn\'t exists'
					});
				}
			}
		}
		else {
			res.status(400).json({
				error: 'You are not the admin of the project'
			});
		}
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

module.exports = router;
