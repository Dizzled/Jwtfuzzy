const jwt = require("jsonwebtoken");

function nulltoken(req) {
    var cookieJar = {};
    var cookies = req.headers.cookie.split(';');
  
    for (cookie of cookies) {
      let pair = cookie.split('=');
      cookieJar[pair[0].trim()] = pair[1].trim()
    }
    
    if ('session_token' in cookieJar) {
      var session_token = cookieJar['session_token'];
    }else{
      return null;
    }
  
    const token = session_token;
    const decoded = jwt.verify(token);
    var userID = decoded.id;
    return userID;
  }

module.exports = nulltoken;