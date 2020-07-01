const { param, body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

	return res.status(422).json({
		errors: extractedErrors,
	});
};

const registerValidation = () => {
	return [
		body('username').not().isEmpty().withMessage('Username required'),
		body('password').matches(/^(?=.*?[A-Z])(?=.*[a-z])(?=.*[\d])(?!.*\s).{8,}$/)
			.withMessage('Valid password required'),
		body('email').isEmail().withMessage('Valid email required')
	]
};

const loginValidation = () => {
	return [
		body('username').not().isEmpty().withMessage('Username required'),
		body('password').not().isEmpty().withMessage('Password required'),
	]
};

module.exports = {
	registerValidation,
	loginValidation,
	validate,
}