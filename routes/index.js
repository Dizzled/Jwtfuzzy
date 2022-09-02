const jwt = require('../api/util/authVerify');
var express = require('express');
var router = express.Router();
const db = require('../api/util/database');
var md5 = require('md5');
const exphbs = require('express-handlebars');
var hbs = exphbs.create({})


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
  res.render('none', {
    message: "Please Login"
  })
});

/* Submit Login */
router.post('/none', function (req, res, next) {
  
  const {email, password } = req.body;
  
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
          const token = jwt.generateAccessToken({id: row.id, name: row.email})
          res.cookie('JWT', token) 
          res.render('none',{
            welcome: "Sucessfully Signed in as " + row.name,    
          });
      }
    } catch (error) {
      res.render('none', {
        error: "User Does Not Exist!!"
      })
    }
    }
  })
})

/* GET none page. */
router.get('/admin', function (req, res, next) {
 
  try {
    let decoded = jwt.getUserID(req)
    console.log("admin " + decoded)
    if(decoded === 1){
      res.render('admin',{
        message : "Welcome Admin User"
      });
    }else{
        res.json("Only Available to Admin!"); 
    }
  } catch (err) {
    console.log(err)
      res.json(err)
    }
  });

/* GET none page. */
router.get('/hmac', function (req, res, next) {
  res.render('hmac', {
  })
});

/* Submit Login */
router.post('/hmac', function (req, res, next) {
  const {email, password } = req.body;
  
  var query = "SELECT * FROM user where email = '" + email + "'";

  db.get(query, function (err, row) {
    if (err) {
      res.render('hmac', {
        error: err + " " + row
      })
      return;
    }else{
    try {
      if (row.password === md5(password)) {
          //Create JWT session token
          const token = jwt.generateAccessToken({id: row.id, name: row.email})
          req.session.userID = row.id;
          res.cookie('JWT',token) 
          res.render('hmac',{
            welcome: "Sucessfully Signed in as " + row.name,   
          });
      }
    } catch (error) {
      res.render('hmac', {
        error: error
      })
    }
    }
  })
})

/* GET home page. */
router.get('/help', function(req, res, next) {
  res.render('help');
});

router.get('/signature', function (req, res, next) {
  res.render('signature');
});

router.post('/signature', function (req, res, next) {
  let = 'signature'
  const {email, password } = req.body;
  
  var query = "SELECT * FROM user where email = '" + email + "'";

  db.get(query, function (err, row) {
    if (err) {
      res.render('signature', {
        error: err + " " + row
      })
      return;
    }else{
    try {
      if (row.password === md5(password)) {
          //Create JWT session token
          const token = jwt.generateAccessToken({id: row.id, name: row.email})
          req.session.userID = row.id;
          res.cookie('JWT',token) 
          res.render('signature',{
            welcome: "Sucessfully Signed in as " + row.name,   
          });
      }
    } catch (error) {
      res.render('signature', {
        error: error
      })
    }
    }
  })
})

router.get('/weaksig', function (req, res, next) {
  res.render('weaksig');
});

router.post('/weaksig', function (req, res, next) {
  let = 'weaksig'
  const {email, password} = req.body;
  
  var query = "SELECT * FROM user where email = '" + email + "'";

  db.get(query, function (err, row) {
    if (err) {
      res.render('weaksig', {
        error: err + " " + row
      })
      return;
    }else{
    try {
      if (row.password === md5(password)) {
          //Create JWT session token
          const token = jwt.weakAccessToken({id: row.id, name: row.email})
          req.session.userID = row.id;
          res.cookie('JWT',token) 
          res.render('weaksig',{
            welcome: "Sucessfully Signed in as " + row.name,   
          });
      }
    } catch (error) {
      res.render('signature', {
        error: error
      })
    }
    }
  })
})


module.exports = router;