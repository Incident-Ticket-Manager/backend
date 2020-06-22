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
		models.project.hasMany(models.ticket);
		models.project.belongsToMany(models.user, { through: models.userProjects });
	};
    return Project;
};