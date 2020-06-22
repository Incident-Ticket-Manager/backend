'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
		id: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV1,
		},
		name: {
			type: DataTypes.STRING,
			unique: true
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