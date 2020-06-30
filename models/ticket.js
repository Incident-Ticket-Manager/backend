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
		status: {
			type: DataTypes.ENUM(
				'Open',
				'In progress',
				'Resolved'
			),
			defaultValue: 'Open'
		},
		date: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW
		}
    }, {
        tableName: 'tickets'
    });
    Ticket.associate = models => {
		models.ticket.belongsTo(models.client, {
			foreignKey: 'clientId',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		models.ticket.belongsTo(models.project, {
			foreignKey: 'projectName',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
		
		models.ticket.belongsTo(models.user, {
			foreignKey: 'userName',
			onDelete: 'set null',
			onUpdate: 'cascade'
		});
	};
	return Ticket;
};