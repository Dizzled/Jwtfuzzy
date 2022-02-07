const jwt = require('jsonwebtoken');
const TOKEN_SECRET='youllneverfindthiskey';
const config = process.env;
// get config vars

// access config var
process.env.TOKEN_SECRET = TOKEN_SECRET

function authenticateToken(req) { // Verify if token is valid
  var cookieJar = {};
  var cookies = req.headers.cookie.split(';');

  for (cookie of cookies) {
    let pair = cookie.split('=');
    cookieJar[pair[0].trim()] = pair[1].trim()
  }
  
  if ('session_token' in cookieJar) {
    var session_token = cookieJar['session_token'];
  }
  console.log(session_token)
  const token = session_token;
  let decoded = null;
  try {
    decoded = jwt.verify(token, TOKEN_SECRET);
  } catch (error) {
    console.log(error)
    return false;
  }
  
  console.log(decoded);
  console.log(req.session)
  const userID = req.session.userID;

  console.log("ID: " + userID);

  if (decoded.id != userID) {
    console.log(`Failed on userID ${decoded.userID} ${userID}`);
    return false;
  }
  else if ((decoded.exp - decoded.iat) > 3600) {
    console.log("Failed on time");
    return false;
  }
  else {
    console.log("authVerify success");
    return true;
    
  }
}

function getUserID(req) {
  var cookieJar = {};
  var cookies = req.headers.cookie.split(';');

  for (cookie of cookies) {
    let pair = cookie.split('=');
    cookieJar[pair[0].trim()] = pair[1].trim()
  }
  
  if ('session_token' in cookieJar) {
    var session_token = cookieJar['session_token'];
  }

  const token = session_token;
  const decoded = jwt.verify(token, TOKEN_SECRET);
  var userID = decoded.id;
  return userID;
}

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}




  module.exports = jwt;
  exports.authenticateToken = authenticateToken;
  exports.TOKEN_SECRET = TOKEN_SECRET;
  module.exports = { getUserID, authenticateToken, generateAccessToken};

  // To use this function you will need to include the line in your routes file:
  // const authVerify = require('../util/authVerify');
  // To call the authenticateToken function use the following:
  // ${authVerify.getUserID()}