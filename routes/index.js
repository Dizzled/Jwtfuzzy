const jwt = require('../api/util/authVerify');
var express = require('express');
var router = express.Router();
const db = require('../api/util/database');
const session = require('express-session');
var md5 = require('md5');


/* GET home page. */
router.get(["/","/index"], function(req, res, next) {
  res.render('index', { title: 'Test' });
});

/* GET challenges page. */
router.get("/challenges", function(req, res, next) {

  if(jwt.authenticateToken(req)){
    res.render('challenges', {
      welcome: "Welcome " + req.session.name 
    });
  }else{
      res.json({ "error" : "User needs to be logged in to access challenges." });
    }
  });

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render('register')
});

/* Register New User */
router.post("/register", function (req, res, next) {

  const { username, email, password } = req.body;

  if (!(username && password && email)) {
    res.status(400).send("All input is required");
  }

  var sql = "select * from user where email = ?";

  
  db.get(sql, email, (err, row) => {
    if (!row) {

      var insert = 'INSERT INTO user (name, email, password) VALUES(?,?,?)';

      db.run(insert, [username, email, md5(password)], function (err) {
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

/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login')
});

/* Submit Login */
router.post('/login', function (req, res, next) {
  
  const { username, email, password } = req.body;
  
  var query = "SELECT * FROM user where email = '" + email + "'";

  db.get(query, function (err, row) {
    if (err) {
      res.render('login', {
        error: err + " " + row
      })
      return;
    }else{
    try {
      if (row.password === md5(password)) {
          //Create JWT session token
          const token = jwt.generateAccessToken({id: row.id, name: req.body.email})
          req.session.userID = row.id;
          res.cookie('session_token',token) 
          res.render('challenges',{
            welcome: "Sucessfully Signed in as " + row.name,    
          });
      }
    } catch (error) {
      res.render('login', {
        error: error
      })
    }
    }
  })
})

/* GET none page. */
router.get('/none', function (req, res, next) {
  res.render('none')
});



module.exports = router;