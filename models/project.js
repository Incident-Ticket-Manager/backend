'use strict';

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('projects', {
		name: DataTypes.STRING,
    }, {
        tableName: 'projects'
    });
    Project.associate = models => {
        // associations can be defined here
	};
	Project.sync({force: true});
    return Project;
};