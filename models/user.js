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
			unique: true,
			validate: {
				isEmail: true,
			}
		},
		admin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
    }, {
        tableName: 'users'
	});

    User.associate = models => {
		models.user.belongsToMany(models.project, { 
			foreignKey: 'userName',
			through: models.userProjects,
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		models.user.hasMany(models.ticket, {
			foreignKey: 'userName',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	};
    return User;
};