let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');
let crypto = require('crypto');

/**
 * @typedef RegisterDTO
 * @property {string} username - Username of the user
 * @property {string} password - Password of the user
 * @property {string} email - Email of the user
 */

/**
 * @typedef Error
 * @property {string} error - Register error
 */

/**
 * Register a new user
 * @route POST /register
 * @group Authentification
 * @param {RegisterDTO.model} register.body.required - Register body
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User registered
 * @returns {Error.model} 400 - Username is already used
 */
router.post('/', [
	body('username').not().isEmpty(),
	body('password').matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[\d])(?!.*\s).{8,}$/),
	body('email').isEmail()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

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
