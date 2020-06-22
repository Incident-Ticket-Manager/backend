'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
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
		models.project.hasMany(models.ticket, { as: 'project_tickets' });
	};
	Project.sync();
    return Project;
};