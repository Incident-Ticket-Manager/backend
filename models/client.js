'use strict';

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('clients', {
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
	};
	Client.sync({force: true});
    return Client;
};