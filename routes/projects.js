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
});

router.put('/', [
	body('name').not().isEmpty(),
	body('newName').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	try {
		var data = await sequelize.project.update({
			name: req.body.newName
		}, {
			where: {
				name: req.body.name
			},
		});

		if(data[0]) {
			res.json(await sequelize.project.findOne({
				where: {
					name: req.body.newName
				}
			}));
		}
		else{
			res.status(400).json({
				error: 'This project doesn\'t exists'
			});
		}
	}
	catch(e){
		res.status(400).json({
			error: 'This project name is already used'
		});
	}
});

router.delete('/', [
	body('name').not().isEmpty()
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let project = await sequelize.project.destroy({
		where: {
			name: req.body.name,
		}
	});

	if(project) {
		res.status(200).end();
	}
	else {
		res.status(400).json({
			error: 'This project doesn\'t exists'
		});
	}
});

module.exports = router;
