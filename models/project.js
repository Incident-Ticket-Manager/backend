'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
		name: {
			primaryKey: true,
			type: DataTypes.STRING,
		},
		admin: DataTypes.STRING,
		date: {
			type: DataTypes.DATE,
			defaultValue: Sequelize.NOW
		}
    }, {
        tableName: 'projects'
    });
    Project.associate = models => {
		models.project.belongsToMany(models.user, { 
			foreignKey: 'projectName',
			through: models.userProjects 
		});

		models.project.belongsTo(models.user, { 
			foreignKey: 'admin',
			through: models.userProjects 
		});

		models.project.hasMany(models.ticket, {
			foreignKey: 'projectName'
		});
	};
    return Project;
};