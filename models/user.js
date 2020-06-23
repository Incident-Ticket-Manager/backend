'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
			primaryKey: true,
			type: DataTypes.STRING,
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
		models.user.belongsToMany(models.project, { through: models.userProjects });
		models.user.hasMany(models.project);
	};
    return User;
};