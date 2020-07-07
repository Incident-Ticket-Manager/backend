let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let Sequelize = require('sequelize');
const { 
	deleteUserValidation, 
	updateUserValidation,
	validate 
} = require('../validators/user');

/**
 * @typedef GetUserDTO
 * @property {string} username - Username of the user
 * @property {string} email - Email of the user
 * @property {string} admin - If the current user is and admin
 * @property {number} ticketCount - Number of tickets
 */

/**
 * Get all users
 * @route GET /users
 * @group Users
 * @consumes application/json
 * @produces application/json
 * @returns {Array.<GetUserDTO>} 200 - List of users
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/', async (req, res) =>{
	let users = await sequelize.user.findAll({
		attributes: { 
			include: [[Sequelize.fn("count", Sequelize.col("tickets.id")), "ticketCount"]],
			exclude: ['password']
		},
		include: [{
			model: sequelize.ticket,
			attributes: []
		}],
		group: ['user.username']
	});
	res.json(users);
});

/**
 * Update current user
 * @route PUT /users
 * @group Users
 * @param {UserDTO.model} user.body.required - User body
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User updated
 * @returns {Error.model} 400 - Username or email is already used
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.put('/', updateUserValidation, validate, async (req, res) =>{

	try {
		await sequelize.user.update({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		}, {
			where: {
				username: req.user.username
			}
		});

		res.json();
	}
	catch(e) {
		res.status(400).json({
			error: 'This username or this email is already used'
		});
	}
});

/**
 * Delete user
 * @route DELETE /users/{user}
 * @group Users
 * @param {string} user.path.required - User username
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User deleted
 * @returns {Error.model} 400 - User doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.delete('/:user', deleteUserValidation, validate, async (req, res) =>{

	let user = await sequelize.user.findOne({
		where: {
			username: req.params.user
		}
	});

	if(!req.user.admin) {
		return res.json({
			error: 'You are not an admin'
		});
	}

	if(user == null) {
		return res.json({
			error: 'This user doesn\'t exists'
		});
	}

	await user.destroy();
	res.json();
});

module.exports = router;