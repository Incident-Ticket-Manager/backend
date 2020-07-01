let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let crypto = require('crypto');
const { registerValidation, validate } = require('../validators/user');

/**
 * @typedef UserDTO
 * @property {string} username - Username of the user
 * @property {string} password - Password of the user
 * @property {string} email - Email of the user
 */

/**
 * @typedef Error
 * @property {string} error - Error message
 */

/**
 * @typedef Errors
 * @property {Array.<Error>} errors - List of errors
 */

/**
 * Register a new user
 * @route POST /register
 * @group Authentification
 * @param {UserDTO.model} user.body.required - user body
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User registered
 * @returns {Error.model} 400 - Username or email is already used
 * @returns {Errors.model} 422 - Validation errors
 */
router.post('/', registerValidation, validate, async (req, res) => {
	try{
		let password = crypto.createHash('sha256').update(req.body.password).digest('hex');
		await sequelize.user.create({
			username: req.body.username,
			password: password,
			email: req.body.email
		});

		res.json();
	}
	catch(e){
		res.status(400).json({
			error: 'This username or this email is already used'
		});
	}
});

module.exports = router;
