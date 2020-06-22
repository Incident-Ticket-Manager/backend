'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
		},
        username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true,
			}
		}
    }, {
        tableName: 'users'
    });
    User.associate = models => {
		// associations can be defined here
		models.users.hasMany(models.projects);
		models.users.hasMany(models.tickets);
	};
	User.sync();
    return User;
};