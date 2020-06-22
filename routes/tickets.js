var express = require('express');
var router = express.Router();

/* GET tickets listing. */
router.get('/', function(req, res, next) {
  res.send('tickets\' respond');
});

module.exports = router;
