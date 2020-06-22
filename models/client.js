'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('client', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
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
	};
    return Client;
};