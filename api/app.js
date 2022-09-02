var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var { expressjwt: jwt } = require("express-jwt");
var sqlite = require('sqlite3');
var sqliteStoreFactory = require('express-session-sqlite').default;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const handlebars = require('./util/handlebars')(exphbs);
require("dotenv").config();
var index = require('../routes');
var app = express();
var fs = require('fs');
const TOKEN_SECRET= fs.readFileSync(path.join(__dirname, '/util/pub.pem'));
// view engine setup
app.set('views', path.join(__dirname, '../views'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

const SqliteStore = sqliteStoreFactory(session);
const DBSOURCE = "db.sqlite"

app.use(session({
  store: new SqliteStore({
    // Database library to use. Any library is fine as long as the API is compatible
    // with sqlite3, such as sqlite3-offline
    driver: sqlite.Database,
    // for in-memory database
    path: DBSOURCE,
    // path: '/tmp/sqlite.db',
    // Session TTL in milliseconds
    ttl: 3600000,
    // (optional) Session id prefix. Default is no prefix.
    prefix: 'sess:',
    // (optional) Adjusts the cleanup timer in milliseconds for deleting expired session rows.
    // Default is 5 minutes.
    cleanupInterval: 300000
  }),
  resave: false,
  saveUninitialized: false,
  secret: "test123",
  secure: false
  //... don't forget other expres-session options you might need
}));

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('../public/images'))
app.use(express.static('public/images'))
app.use(express.static('public/stylesheets'))
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use('/protected', jwt({
//   secret: process.env.TOKEN_SECRET = TOKEN_SECRET,
//   requestProperty: 'accessToken',
//   algorithms: ["HS256"],
//   getToken: req => {
//   return req.cookies['access_token'];
//   }
//   }));
  
module.exports = app;