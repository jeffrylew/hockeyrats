const express = require('express');
const router = express.Router();

/* GET media page. */
router.get('/', (req, res, next) => {
  res.render('media');
});

module.exports = router;