'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let dir = __dirname + "/models";

fs.readdirSync(dir)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(dir, file));
		db[model.name] = model;
	});

Object.values(db).forEach(model => {
	if (model.associate) {
		model.associate(db);
	}
});

Object.values(db).forEach(model => {
	model.sync();
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
