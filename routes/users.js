var express = require('express');
var router = express.Router();
var sequelize = require('../db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users\' respond');
});

router.post('/', async function(req, res, next) {

	console.log(req.body);
	try{
		var response = await sequelize.users.create({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});
	}
	catch(e){
		console.log(e);
	}

	res.json();
});

module.exports = router;
