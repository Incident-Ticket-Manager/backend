const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db.js')

class Project extends Model {}
Project.init({
    name: DataTypes.STRING,
}, { sequelize, modelName: 'project' });

Project.sync({force: true});

exports.Project;