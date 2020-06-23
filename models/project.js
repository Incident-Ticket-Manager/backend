'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
		name: {
			primaryKey: true,
			type: DataTypes.STRING,
		},
    }, {
        tableName: 'projects'
    });
    Project.associate = models => {
		models.project.belongsToMany(models.user, { 
			foreignKey: 'projectName',
			through: models.userProjects 
		});

		models.project.hasMany(models.ticket, {
			foreignKey: 'projectName'
		});
	};
    return Project;
};