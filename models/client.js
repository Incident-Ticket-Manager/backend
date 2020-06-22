'use strict';

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('clients', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID
		},
		name: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
			}
		},
		phone: DataTypes.STRING,
		address: DataTypes.STRING,
    }, {
        tableName: 'clients'
    });
    Client.associate = models => {
		// associations can be defined here
		models.clients.hasMany(models.tickets);
	};
	Client.sync();
    return Client;
};