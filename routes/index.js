const jwt = require('../api/util/authVerify');
var express = require('express');
var router = express.Router();
const db = require('../api/util/database');
const session = require('express-session');
var md5 = require('md5');
const exphbs = require('express-handlebars');
const nulltoken = require('../api/util/jwtalgotype');
var hbs = exphbs.create({})


hbs.handlebars.registerHelper("increasePrice", function(price) {
  price += 10;
  return price;
});

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

/* GET none page. */
router.get('/none', function (req, res, next) {
  res.render('none')
});

/* Submit Login */
router.post('/none', function (req, res, next) {
  
  const { username, email, password } = req.body;
  
  var query = "SELECT * FROM user where email = '" + email + "'";

  db.get(query, function (err, row) {
    if (err) {
      res.render('none', {
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
          res.render('none',{
            welcome: "Sucessfully Signed in as " + row.name,    
          });
      }
    } catch (error) {
      res.render('none', {
        error: error
      })
    }
    }
  })
})

/* GET none page. */
router.get('/admin', function (req, res, next) {

  let id = nulltoken(req)
  
  if(id === 1){
    res.render('admin',{
      message : "Welcome Admin"
    });
  }else{
      res.render('none', {
        message : "Only Available to Admin"
      }); 
  }
});



module.exports = router;