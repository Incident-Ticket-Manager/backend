const { param, body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = []
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

	return res.status(422).json({
		errors: extractedErrors,
	});
};

const registerValidation = [
	body('username', 'Username required').not().isEmpty(),
	body('password', 'Valid password required').matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[\d])(?!.*\s).{8,}$/),
	body('email', 'Valid email required').isEmail()
];

const loginValidation = [
	body('username', 'Username required').not().isEmpty(),
	body('password', 'Password required').not().isEmpty()
];

module.exports = {
	registerValidation,
	loginValidation,
	validate,
}