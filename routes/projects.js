let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

router.get('/', async (req, res, next) => {

	let user = await sequelize.user.findOne({
		where: {
			username: req.user.username
		},
		include: {
			model: sequelize.project,
			through: {attributes: []}
		}
	});

	if(user != null) {
		res.json(user.projects);
	}

	res.status(401).end();
});

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
	});

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
	
	res.status(401).end();
});

router.put('/', [
	body('id').not().isEmpty(),
	body('name').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let project = await sequelize.project.findOne({
		where: {
			id: req.body.id,
		}
	});

	if(project != null){
		project.update({
			name: req.body.name
		});

		res.json(project.toJSON());
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

module.exports = router;
