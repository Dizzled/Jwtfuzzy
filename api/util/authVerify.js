const jwt = require('jsonwebtoken');
var atob = require('atob');
const {
  json
} = require('express/lib/response');
var fs = require('fs');
var path = require('path');


const privatekey = fs.readFileSync(path.join(__dirname, 'priv.pem'));
// const splitPem = process.env.TOKEN_SECRET.match(/.{1,64}/g);

function getcookie(req) {

  var cookieJar = {};
  var cookies = req.headers.cookie.split(';');

  for (cookie of cookies) {

    let pair = cookie.split('=');
    cookieJar[pair[0].trim()] = pair[1].trim()

  }

  if ('JWT' in cookieJar) {

    return session_token = cookieJar['JWT'];

  } else {

    return null

  }
}

function authenticateToken(req) { // Verify if token is valid
  var cookieJar = {};
  var cookies = req.headers.cookie.split(';');

  for (cookie of cookies) {
    let pair = cookie.split('=');
    cookieJar[pair[0].trim()] = pair[1].trim()
  }

  if ('JWT' in cookieJar) {
    var session_token = cookieJar['JWT'];
  }

  const token = session_token;
  let decoded = null;
  try {
    decoded = jwt.verify(token, privatekey);
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
  } else if ((decoded.exp - decoded.iat) > 3600) {
    console.log("Failed on time");
    return false;
  } else {
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

  if ('JWT' in cookieJar) {

    var session_token = cookieJar['JWT'];

  } else {

    return null

  }

  const token = session_token;

  //Convert to JSON string and split based off period.
  let check = JSON.stringify(token).split('.')

  //Decode base64 portion of token 
  let base64convert = atob(check[0])

  let parsed = JSON.parse(base64convert)

  /** Outdated None Algorithm Being Passed**/
  if (parsed['alg'] === 'none' && req.headers.referer.includes('none')) {

    jwt.verify(token, null, function (err, decoded) {
      if (err) {
        return err;

      } else {
        // console.log(decoded)
        return decoded.id
      }
    })
  }
  /**No Signature Check lazy programmers**/
  else if (req.headers.referer.includes('signature')) {

    var decoded = jwt.decode(token);
    return decoded.id
  }
  /**Weak Signature with Killer key **/ 
  else if (req.headers.referer.includes('weaksig')) {

    var decoded = jwt.verify(token, 'killer')
    return decoded.id; 

  }else{
      var decoded = jwt.verify(token, privatekey) 
      return decoded.id;
  }

}

function generateAccessToken(username) {

  let token = jwt.sign(username, privatekey, {
    noTimestamp: true,
    algorithm: 'HS256'
  });
  console.log(username.id + " " + username.name + " " + token)
  return token
}

function weakAccessToken(username) {

  let token = jwt.sign(username, 'killer', {
    noTimestamp: true,
    algorithm: 'HS256'
  });
  console.log(username.id + " " + username.name + " " + token)
  return token
}

module.exports = jwt;
module.exports = {
  getUserID,
  authenticateToken,
  generateAccessToken,
  getcookie,
  weakAccessToken
};

// To use this function you will need to include the line in your routes file:
// const authVerify = require('../util/authVerify');
// To call the authenticateToken function use the following:
// ${authVerify.getUserID()}