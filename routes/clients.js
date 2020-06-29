let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { body, validationResult } = require('express-validator');

/**
 * @typedef ClientDTO
 * @property {string} name - Name of the client
 * @property {string} email - Email name of the client
 * @property {string} phone - Phone name of the client
 * @property {string} address - Address name of the client
 */

/**
 * @typedef Error
 * @property {string} error - Register error
 */

/**
 * @typedef UpdateClientDTO
 * @property {string} id - Id of the client
 * @property {string} name - Name of the client
 * @property {string} email - Email name of the client
 * @property {string} phone - Phone name of the client
 * @property {string} address - Address name of the client
 */

/**
 * Update a client
 * @route PUT /clients
 * @group Clients
 * @param {UpdateClientDTO.model} client.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ClientDTO.model} 200 - Client
 * @returns {Error.model} 400 - Client doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.put('/', [
	body('id').not().isEmpty(),
	body('name').not().isEmpty(),
	body('email').isEmail(),
	body('phone').isMobilePhone(),
	body('address').not().isEmpty(),
],
async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}
});

/**
 * @typedef DeleteClientDTO
 * @property {string} id - Id of the project
 */

/**
 * Delete a client
 * @route DELETE /clients/{clientId}
 * @group Clients
 * @param {string} client.path.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This client doesn't exists
 * @returns 401 - User not authentified
 * @security JWT
 */
router.delete('/:client', async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array() 
		});
	}

	let client = await sequelize.client.findOne({
		where: {
			id: req.params.client
		}
	});

	if(client != null){
		await client.destroy();
	}
	else {
		res.status(400).json({
			error: 'This client doesn\'t exists'
		})
	}
});

module.exports = router;
