let express = require('express');
let router = express.Router();
let sequelize = require('../db.js');
let jwt = require('jsonwebtoken'); 
const { body, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', async (req, res, next) => {
	let users = await sequelize.users.findAll();
	res.json(users.map((user) => user.toJSON()))
});

router.post('/', [
	body('username').not().isEmpty(),
	body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
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
		let response = await sequelize.users.create({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});

		var token = jwt.sign({
			username: req.body.username
		}, process.env.SECRET);

		res.json({
			username: req.body.username,
			token: token
		});
	}
	catch(e){
		console.log(e);
		res.status(400).json({
			error: 'This username is already used'
		});
	}
});

module.exports = router;
