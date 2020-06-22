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
		models.ticket.belongsTo(models.client, {
			onDelete: 'cascade'
		});
		models.ticket.belongsTo(models.project, {
			onDelete: 'cascade'
		});
		models.ticket.belongsTo(models.user, {
			onDelete: 'cascade'
		});
	};
	return Ticket;
};