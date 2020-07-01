let express = require('express');
let router = express.Router();
let sequelize = require('../db');
const { 
	addClientValidation, 
	updateClientValidation,
	deleteClientValidation,
	validate, 
} = require('../validators/client');

/**
 * @typedef CClientDTO
 * @property {string} name - Name of the client
 * @property {string} email - Email name of the client
 * @property {string} phone - Phone name of the client
 * @property {string} address - Address name of the client
 */

/**
 * @typedef ClientDTO
 * @property {string} id - Id of the client
 * @property {string} name - Name of the client
 * @property {string} email - Email of the client
 * @property {string} phone - Phone of the client
 * @property {string} address - Address of the client
 */

/**
 * Get all clients
 * @route GET /clients
 * @group Clients
 * @consumes application/json
 * @produces application/json
 * @returns {Array.<ClientDTO>} 200 - List of clients
 * @returns 401 - User not authentified
 * @security JWT
 */
router.get('/', async (req, res, next) => {
	let clients = await sequelize.client.findAll();
	res.json(clients);
});

/**
 * Add a client
 * @route POST /clients
 * @group Clients
 * @param {CClientDTO.model} client.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ClientDTO.model} 200 - Client
 * @returns {Error.model} 400 - You are not an admin
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.post('/', addClientValidation, validate, async (req, res, next) => {

	if(!req.user.admin) {
		return res.status(400).json({
			error: 'You are not an admin'
		})
	}

	let client = await sequelize.client.create({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
	});

	res.json(client);
});

/**
 * @typedef UpdateClientDTO
 * @property {string} name - Name of the client
 * @property {string} email - Email name of the client
 * @property {string} phone - Phone name of the client
 * @property {string} address - Address name of the client
 */

/**
 * Update a client
 * @route PUT /clients/{clientId}
 * @group Clients
 * @param {UpdateClientDTO.model} client.body.required
 * @consumes application/json
 * @produces application/json
 * @returns {ClientDTO.model} 200 - Client
 * @returns {Error.model} 400 - Client doesn't exists
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.put('/:client', updateClientValidation, validate, async (req, res, next) => {

	if(!req.user.admin) {
		return res.status(400).json({
			error: 'You are not an admin'
		});
	}

	await sequelize.client.update({
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		address: req.body.address,
	}, {
		where: {
			id: req.params.client
		}
	});

	res.json(await sequelize.client.findOne({
		where: {
			id: req.params.client
		}
	}));
});

/**
 * Delete a client
 * @route DELETE /clients/{clientId}
 * @group Clients
 * @param {string} client.path.required
 * @consumes application/json
 * @produces application/json
 * @returns 200 - Project deleted
 * @returns {Error.model} 400 - This client doesn't exists or you are not an admin
 * @returns 401 - User not authentified
 * @returns {Errors.model} 422 - Validation errors
 * @security JWT
 */
router.delete('/:client', deleteClientValidation, validate,  async (req, res, next) => {

	if(!req.user.admin) {
		return res.status(400).json({
			error: 'You are not an admin'
		})
	}

	let client = await sequelize.client.findOne({
		where: {
			id: req.params.client
		}
	});

	if(client == null){
		return res.status(400).json({
			error: 'This client doesn\'t exists'
		});
	}

	await client.destroy();
	res.json();
});

module.exports = router;
