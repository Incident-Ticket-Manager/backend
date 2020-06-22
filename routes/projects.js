var express = require('express');
var router = express.Router();

/* GET projets listing. */
router.get('/', function(req, res, next) {
  res.send('projects\' respond');
});

module.exports = router;
