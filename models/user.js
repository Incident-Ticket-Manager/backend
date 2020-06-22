const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../db.js')

class User extends Model {}
User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
}, { sequelize, modelName: 'user' });

User.sync({force: true});

exports.User;