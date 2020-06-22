'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('projects', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
		},
		name: DataTypes.STRING,
    }, {
        tableName: 'projects'
    });
    Project.associate = models => {
		// associations can be defined here
		models.projects.hasMany(models.tickets);
	};
	Project.sync();
    return Project;
};