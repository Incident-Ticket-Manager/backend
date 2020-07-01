let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { registerValidation, validate } = require('../validators');
let crypto = require('crypto');

/**
 * @typedef RegisterDTO
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
 * @param {RegisterDTO.model} register.body.required - Register body
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User registered
 * @returns {Errors.model} 422 - Validation errors
 * @returns {Error.model} 400 - Username is already used
 */
router.post('/', registerValidation, validate, async (req, res, next) => {
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
