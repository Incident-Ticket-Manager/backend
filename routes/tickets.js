let express = require('express');
let router = express.Router();

/* GET tickets listing. */
router.get('/', async (req, res, next) => {
  res.send('tickets\' respond');
});

module.exports = router;
