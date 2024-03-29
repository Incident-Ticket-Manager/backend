let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');
const { loginValidation, validate } = require('../validators/user');

/**
 * @typedef LoginDTO
 * @property {string} username - Username of the user
 * @property {string} password - Password of the user
 */

/**
 * @typedef LoggedUserDTO
 * @property {string} username - Username of the user
 * @property {boolean} admin - User is admin or not
 * @property {string} token - JWT token
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
 * @returns {Errors.model} 422 - Validation errors
 */
router.post('/', loginValidation, validate, async (req, res) => {
	let password = crypto.createHash('sha256').update(req.body.password).digest('hex');

	let user = await sequelize.user.findOne({
		where: {
			username: req.body.username,
			password: password
		}
	});

	if(user == null){
		return res.status(400).json({
			error: "Invalid credentials"
		});
	}

	let token = jwt.sign({
		username: user.username,
		admin: user.admin
	}, process.env.SECRET, {
		expiresIn: 3600 * 24
	});

	res.json({
		username: user.username,
		admin: user.admin,
		token: token
	});
});

module.exports = router;
