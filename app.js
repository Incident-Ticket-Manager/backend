let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let cors = require('cors');

require('dotenv').config()

let indexRouter = require('./routes/index');
let registerRouter = require('./routes/register');
let loginRouter = require('./routes/login');
let usersRouter = require('./routes/users');
let projectsRouter = require('./routes/projects');
let ticketsRouter = require('./routes/tickets');
let clientsRouter = require('./routes/clients');

let expressJwt = require('express-jwt'); 

let app = express();
let expressSwagger = require('express-swagger-generator')(app);

console.log(process.env);

const { sequelize } = require('./db.js');

let isDev = process.env.DEV != undefined;

// Swagger engine setup
let options = {
	swaggerDefinition: {
		info: {
			description: 'Server api for Incident-Ticket-Manager',
			title: 'ITM API',
			version: '1.0.0',
		},
		produces: [
			"application/json",
		],
		host: isDev ? 'localhost:3000' : 'api-itm.herokuapp.com',
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: "Simple JWT",
				value: "Bearer <JWT>"
				
			}
		}
	},
	route: {
		url: '/docs',
		docs: '/docs/swagger.json'
	},
	basedir: __dirname, //app absolute path
	files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options)

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
		process.exit(1);
	}
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(expressJwt({
	secret: process.env.SECRET,
	algorithms: ['HS256']
}).unless({
	path: [
		'/',
		'/login',
		'/register'
	]
}));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/clients', clientsRouter);
app.use('/tickets', ticketsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
