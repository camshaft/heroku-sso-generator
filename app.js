/**
 * Module dependencies
 */

var stack = require('simple-stack-common');
var hash = require('crypto').createHash;

var app = module.exports = stack();

app.set('view engine', 'jade');

app.useBefore('router', '/public', stack.middleware.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  var id = req.body.id;
  var salt = req.body.salt;
  var timestamp = now();

  // TODO generate nav-data
  var navData = encodeNavData({app: req.body.app});

  res.render('redirect', {
    url: req.body.url,
    id: id,
    token: generateToken(id, salt, timestamp),
    timestamp: timestamp,
    navData: navData,
    app: req.body.app,
    email: req.body.email
  });
});

function generateToken(id, salt, timestamp) {
  var sha = hash('sha1');
  sha.update([id, salt, timestamp].join(':'));
  return sha.digest('hex');
}

function encodeNavData(obj) {
  return (new Buffer(JSON.stringify(obj))).toString('base64');
}

function now() {
  return Math.round(Date.now() / 1000);
}
