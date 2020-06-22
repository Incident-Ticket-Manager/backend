let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

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
		await sequelize.user.create({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});

		res.status(200).end();
	}
	catch(e){
		res.status(400).json({
			error: 'This username is already used'
		});
	}

	res.status(500).end();
});

module.exports = router;
