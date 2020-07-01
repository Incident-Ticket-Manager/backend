let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { loginValidation, validate } = require('../validators');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');

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
 * @returns {Errors.model} 422 - Validation errors
 * @returns {Error.model} 400 - Invalid credentials
 */
router.post('/', loginValidation, validate, async (req, res, next) => {
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
	}, process.env.SECRET);

	res.json({
		username: user.username,
		admin: user.admin,
		token: token
	});
});

module.exports = router;
