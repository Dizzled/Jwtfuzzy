var express = require('express');
var router = express.Router();

/* GET home page. */
router.get(["/","/index"], function(req, res, next) {
  res.render('index', { title: 'Test' });
});


/* GET challenges page. */
router.get("/challenges", function(req, res, next) {
  res.render('challenges', { title: 'Test' });
});


module.exports = router;

