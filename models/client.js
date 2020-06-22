const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db.js')

class Client extends Model {}
Client.init({
	name: DataTypes.STRING,
	email: DataTypes.STRING,
	phone: DataTypes.STRING,
	address: DataTypes.STRING,
}, { sequelize, modelName: 'client' });

Client.sync({force: true});

exports.Client;