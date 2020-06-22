let express = require('express');
let router = express.Router();

/* GET tickets listing. */
router.get('/', function(req, res, next) {
	res.redirect('/docs');
});

module.exports = router;
