let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

/**
 * @typedef ProjectDTO
 * @property {string} name - Name of the project
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
			});

			user.addProject(project);

			res.json(project.toJSON());
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
 * @returns {Error.model} 400 - Project doesn't exists or name is already used
 * @returns 401 - User not authentified
 * @security JWT
 */
router.put('/', [
	body('name').not().isEmpty(),
	body('newName').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	try {
		var data = await sequelize.project.update({
			name: req.body.newName
		}, {
			where: {
				name: req.body.name
			},
		});

		if(data[0]) {
			res.json(await sequelize.project.findOne({
				where: {
					name: req.body.newName
				}
			}));
		}
		else{
			res.status(400).json({
				error: 'This project doesn\'t exists'
			});
		}
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
 * @route DELETE /projects
 * @group Projects
 * @param {DeleteProjectDTO.model} project.body.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This project doesn't exists
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

	let project = await sequelize.project.destroy({
		where: {
			name: req.body.name,
		}
	});

	if(project) {
		res.json();
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

module.exports = router;
