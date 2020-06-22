'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
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
	};
	User.sync({force: true});
    return User;
};