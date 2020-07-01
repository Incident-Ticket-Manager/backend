let express = require('express');
let router = express.Router();

/* GET tickets listing. */
router.get('/', async  (req, res) => {
	res.redirect('/docs');
});

module.exports = router;
