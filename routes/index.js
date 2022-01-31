const authVerify = require('../util/authVerify');
var express = require('express');
var router = express.Router();
const db = require('../util/database');
var md5 = require('md5');


/* GET home page. */
router.get(["/","/index"], function(req, res, next) {
  res.render('index', { title: 'Test' });
});

/* GET challenges page. */
router.get("/challenges", function(req, res, next) {
  res.render('challenges');
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render('register')
});

/* Register New User */
router.post("/register", function (req, res, next) {

  if (req.body.email > 0 && req.body.username > 0 && req.body.password > 0) {

    res.render('register', {
      message: err.message
    });
    return;
  }

  var sql = "select * from user where email = ?";
  var email = req.body.email;
  db.get(sql, email, (err, row) => {
    if (!row) {

      var insert = 'INSERT INTO user (name, email, password) VALUES(?,?,?)';
      console.log(insert);

      db.run(insert, [req.body.username, req.body.email, md5(req.body.password)], function (err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows inserted ${this.changes}`);

        res.render('register', {
          success: "Thank you for signing up!"
        })
      });

    } else {
      res.render('register', {
        error: "registration failed user already exists!"

      })
    }
  })

});


module.exports = router;