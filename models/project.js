'use strict';

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('projects', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID
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