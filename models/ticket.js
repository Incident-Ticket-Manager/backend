'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('ticket', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
		},
		title: DataTypes.STRING,
		content: DataTypes.STRING,
    }, {
        tableName: 'tickets'
    });
    Ticket.associate = models => {
		// associations can be defined here
	};
	Ticket.sync();
    return Ticket;
};