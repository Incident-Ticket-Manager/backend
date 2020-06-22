'use strict';

module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('tickets', {
		title: DataTypes.STRING,
		content: DataTypes.STRING,
    }, {
        tableName: 'tickets'
    });
    Ticket.associate = models => {
        // associations can be defined here
	};
	Ticket.sync({force: true});
    return Ticket;
};