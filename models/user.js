'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
		},
        username: {
			type: DataTypes.STRING,
			unique: true
		},
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
		models.user.hasMany(models.project, { as: 'user_projects' });
		models.user.hasMany(models.ticket);
	};
	User.sync();
    return User;
};