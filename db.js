'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const db = {};

// enable ssl
let sslOptions = process.env.SSL ? {
	require: true,
	rejectUnauthorized: false
} : null;

let sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	protocol: "postgres",
	ssl: true,
	dialectOptions: {
		ssl: sslOptions,
	},
	define: {
		timestamps: false
	}
});

let dir = __dirname + "/models";

const models = [
	'user.js',
	'project.js',
	'user_project.js',
	'client.js',
	'ticket.js',
];

models.forEach(async file => {
	const model = sequelize['import'](path.join(dir, file));
	db[model.name] = model;

	await model.sync();
	if (model.associate) {
		await model.associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
