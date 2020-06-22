'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID
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
	User.sync({force: true});
    return User;
};