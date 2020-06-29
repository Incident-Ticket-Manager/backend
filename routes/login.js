let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');
let jwt = require('jsonwebtoken');

/**
 * @typedef LoginDTO
 * @property {string} username - Username of the user
 * @property {string} password - Password of the user
 */

/**
 * @typedef LoggedUserDTO
 * @property {string} username - Username of the user
 * @property {string} token - JWT token
 */

/**
 * @typedef Error
 * @property {string} error - Register error
 */

/**
 * Login
 * @route POST /login
 * @group Authentification
 * @param {LoginDTO.model} login.body.required - Login body
 * @consumes application/json
 * @produces application/json
 * @returns {LoggedUserDTO.model} 200 - User logged
 * @returns {Error.model} 400 - Invalid credentials
 */
router.post('/', [
	body('username').not().isEmpty(),
	body('password').not().isEmpty(),
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
			username: req.body.username,
			password: req.body.password
		}
	});

	if(user != null){
		let token = jwt.sign({
			username: user.username
		}, process.env.SECRET);

		res.json({
			username: user.username,
			token: token
		});
	}
	else {
		res.status(400).json({
			error: "Invalid credentials"
		});
	}
});

module.exports = router;
