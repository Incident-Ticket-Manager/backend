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
			through: models.userProjects,
			onUpdate: 'cascade'
		});

		models.project.belongsTo(models.user, { 
			foreignKey: 'admin',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});

		models.project.hasMany(models.ticket, {
			foreignKey: 'projectName',
			onDelete: 'cascade',
			onUpdate: 'cascade'
		});
	};
    return Project;
};