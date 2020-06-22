'use strict';

const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const UserProject = sequelize.define('userProjects', {}, {
        tableName: 'user_projects'
    });
    return UserProject;
};