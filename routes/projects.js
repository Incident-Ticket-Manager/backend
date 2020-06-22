let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

router.post('/', [
	body('name').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	try{
		let response = await sequelize.project.create({
			name: req.body.name,
			user: req.body.username
		});

		res.json(response.toJSON());
	}
	catch(e){
		res.status(400).json({
			error: 'This project name is already used'
		});
	}

	res.status(200).end();
});

module.exports = router;
