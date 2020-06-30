let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

/**
 * Delete user
 * @route DELETE /users/{userName}
 * @group Users
 * @consumes application/json
 * @produces application/json
 * @returns 200 - User deleted
 * @returns {Error.model} 400 - User doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.delete('/:user', async (req, res, next) =>{
	if(req.user.admin) {
		let user = await sequelize.user.findOne({
			where: {
				name: req.params.user
			}
		});

		if(user != null) {
			await user.destroy();
			res.json();
		}
		else {
			res.json({
				error: 'This user doesn\'t exists'
			});
		}
	}
	else {
		res.json({
			error: 'You are not an admin'
		});
	}
});

module.exports = router;