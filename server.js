var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');

var app = express();

app.configure(function(){
  app.use(express.bodyParser());
  app.use('/images', express.static(__dirname + '/images'));
  app.use('/styles', express.static(__dirname + '/styles'));
  app.use(express.static(__dirname + '/public'));
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    username = username || 'username';
    //TAKE THIS OUT FOR PASSWORD CHECKING
    if (password === process.env.PASSWORD || true){
     return done(null, true);
    } else {
     return done(null, false);
 }
  }
));

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/login', function(request, response){
  response.sendfile('login.html');
});

app.get('*', function(request, response){
  if (request.user){
    handle(request, response);
  } else {
    response.redirect('/login');
  }
});

var handle = function(request, response){
  console.log('looks like you logged in! Congratulations');
  var url = request.url;
  console.log(url);
};


app.listen(process.env.PORT || 3000);