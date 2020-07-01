let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { 
	projectDetailsValidation,
	addProjectValidation,
	updateProjectValidation,
	deleteProjectValidation,
	addUserProjectValidation,
	deleteUserProjectValidation,
	validate
} = require('../validators/projects');

/**
 * @typedef ProjectDTO
 * @property {string} name - Name of the project
 * @property {string} admin - Admin name of the project
 * @property {string} date - Creation date of the project
 * @property {bool} isAdmin - If the current user is the admin
 */

/**
 * Get all projects of the current user
 * @route GET /projects
 * @group Projects
 * @produces application/json
 * @returns {Array.<ProjectDTO>} 200 - Projects
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
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

	if(user == null) {
		return res.status(401).json();
	}

	let projects = [];
	user.projects.forEach((e) => {
		let project = e.toJSON();
		project.isAdmin = project.admin == req.user.username;
		projects.push(project);
	})
	res.json(projects);
});

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
 * @property {string} date - Creation date of the project
 * @property {bool} isAdmin - If the current user is the admin
 * @property {Array.<TicketDTO>} tickets - Tickets of the project
 * @property {object} stats - Tickets stats
 */

/**
 * Get one project with his name
 * @route GET /projects/{projectName}
 * @group Projects
 * @param {string} projectName.path.required
 * @produces application/json
 * @returns {ProjectFullDTO.model} 200 - Project
 * @returns {Error.model} 400 - Project doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.get('/:project', projectDetailsValidation, validate, async (req, res, next) => {

	let project = await sequelize.project.findOne({
		where: {
			name: req.params.project
		},
		include: {
			model: sequelize.ticket,
			include: sequelize.client
		}
	});

	if(project == null) {
		return res.json({
			error: 'This project doesn\'t exists'
		})
	}

	let ticketStats = {
		"total": project.tickets.length,
		"open": 0,
		"in progress": 0,
		"resolved": 0
	}

	project.tickets.forEach((ticket) => {
		let status = ticket.status.toLowerCase();
		ticketStats[status]++;
	});

	let json = project.toJSON();
	json.isAdmin = project.admin == req.user.username;
	json.ticketStats = ticketStats;

	res.json(json);
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
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/', addProjectValidation, validate, async (req, res, next) => {

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		}
	});

	if(user == null){
		return res.status(401).json();
	}

	try{
		let project = await sequelize.project.create({
			name: req.body.name,
			admin: user.username,
		});

		await user.addProject(project);
		res.json(project);
	}
	catch(e){
		res.status(400).json({
			error: 'This project name is already used'
		});
	}
});

/**
 * Update a project
 * @route PUT /projects/{projectName}
 * @group Projects
 * @param {string} project.path.required
 * @param {string} name.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ProjectDTO.model} 200 - Project
 * @returns {Error.model} 400 - Project doesn't exists, the name is already used or you are not the admin of the project
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.put('/:project', updateProjectValidation, validate, async (req, res, next) => {

	let project  = await sequelize.project.findOne({
		where: {
			name: req.params.project
		}
	});

	if(project == null) {
		return res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}

	if(project.admin != req.user.username) {
		res.status(400).json({
			error: 'You are not the admin of this project'
		});
	}

	try {
		await sequelize.project.update({
			name: req.body.name
		}, {
			where: {
				name: req.params.project
			},
		});

		res.json(await sequelize.project.findOne({
			where: {
				name: req.body.name
			}
		}));
	}
	catch(e){
		res.status(400).json({
			error: 'This project name is already used'
		});
	}
});

/**
 * @typedef DeleteProjectDTO
 * @property {string} name - Name of the project
 */

/**
 * Delete a project
 * @route DELETE /projects/{projectName}
 * @group Projects
 * @param {string} projectName.path.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This project doesn't exists or you are not the admin of the project
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.delete('/:project', deleteProjectValidation, validate, async (req, res, next) => {

	let project  = await sequelize.project.findOne({
		where: {
			name: req.params.project
		}
	});

	if(project == null) {
		return res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}

	if(project.admin != req.user.username) {
		return res.status(400).json({
			error: 'You are not the admin of this project'
		});
	}

	await project.destroy();
	res.json();
});

/**
 * @typedef UserProjectDTO
 * @property {string} user - Name of the user
 * @property {string} project - Name of the project
 */

/**
 * Add a user to a project
 * @route POST /projects/users
 * @group Projects
 * @param {UserProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This user, the project doesn't exists or you are not the admin of the project
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/users', addUserProjectValidation, validate, async (req, res, next) => {

	let project = await sequelize.project.findOne({
		where: {
			name: req.body.project,
		}
	});

	if(project == null) {
		return res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}

	if(project.admin != req.user.username) {
		return res.status(400).json({
			error: 'You are not the admin of the project'
		});
	}

	let user = await sequelize.user.findOne({
		where: {
			username: req.body.user,
		}
	});

	if(user == null){
		return res.status(400).json({
			error: 'This user doesn\'t exists'
		});
	}

	await user.addProject(project);
	res.json();
});

/**
 * Remove a user from a project
 * @route DELETE /projects/{projectName}/users/{userName}
 * @group Projects
 * @param {string} user.path.required
 * @param {string} project.path.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This user, the project doesn't exists, not admin, don't remove yourself
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.delete('/:project/users/:user', deleteUserProjectValidation, validate, async (req, res, next) => {

	let project = await sequelize.project.findOne({
		where: {
			name: req.params.project,
		}
	});

	if(project == null) {
		return res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}

	if(project.admin != req.user.username) {
		return res.status(400).json({
			error: 'You are not the admin of the project'
		});
	}

	if(project.admin == req.params.user){
		return res.status(400).json({
			error: 'You can\'t remove yourself'
		});
	}

	let user = await sequelize.user.findOne({
		where: {
			username: req.params.user,
		}
	});

	if(user == null){
		return res.status(400).json({
			error: 'This user doesn\'t exists'
		});
	}

	await user.removeProject(project);
	res.json();
});

module.exports = router;
