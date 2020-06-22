var express = require('express');
var router = express.Router();
var sequelize = require('../db.js');
const { body, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', async (req, res, next) => {
	var users = await sequelize.users.findAll();
	res.json(users.map((user) => user.toJSON()))
});

router.post('/', [
	body('username').not().isEmpty(),
	body('password').matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$'),
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
		var response = await sequelize.users.create({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});

		res.json(response.dataValues);
	}
	catch(e){
		console.log(e);
		res.status(400).json({
			error: 'This username is already used'
		});
	}
});

module.exports = router;
