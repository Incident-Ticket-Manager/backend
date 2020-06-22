const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db.js')

class Ticket extends Model {}
Ticket.init({
	title: DataTypes.STRING,
	content: DataTypes.STRING,
}, { sequelize, modelName: 'ticket' });

exports.Ticket;