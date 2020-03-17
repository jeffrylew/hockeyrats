const express = require('express');
const router = express.Router();

/* GET lessons page. */
router.get('/', (req, res, next) => {
  res.render('lessons');
});

module.exports = router;