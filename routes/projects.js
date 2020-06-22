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

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		}
	})

	if(user != null){
		try{
			let project = await sequelize.project.create({
				name: req.body.name,
			});

			user.addProject(project);

			res.json(project.toJSON());
		}
		catch(e){
			res.status(400).json({
				error: 'This project name is already used'
			});
		}

		res.status(200).end();
	}
	else {
		res.status(400).json({
			error: 'This user doesn\'t exist'
		});
	}
	
});

module.exports = router;
