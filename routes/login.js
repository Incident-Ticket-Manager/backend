let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');
let jwt = require('jsonwebtoken'); 

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

	let response = await sequelize.user.findOne({
		where: {
			username: req.body.username,
			password: req.body.password
		}
	});

	if(response != null){
		let token = jwt.sign({
			username: req.body.username
		}, process.env.SECRET);

		res.json({
			username: req.body.username,
			token: token
		});
	}

	res.status(400).end();
});

module.exports = router;
