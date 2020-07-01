let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { deleteValidation, validate } = require('../validators/user');

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
router.delete('/:user', deleteValidation, validate, async (req, res, next) =>{

	let user = await sequelize.user.findOne({
		where: {
			username: req.params.user
		}
	});

	if(!req.user.admin) {
		return res.json({
			error: 'You are not an admin'
		});
	}

	if(user == null) {
		return res.json({
			error: 'This user doesn\'t exists'
		});
	}

	await user.destroy();
	res.json();
});

module.exports = router;