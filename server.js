var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var express = require('express');

var app = express();

//Configuring app--passport needs cookieParser, session, and passport stuff
app.configure(function(){
  app.use(express.bodyParser());
  app.use('/images', express.static(__dirname + '/images'));
  app.use('/styles', express.static(__dirname + '/styles'));
  app.use('/bower_components', express.static(__dirname + '/bower_components'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  //TODO change to an actual secret later
  app.use(express.session({ secret: 'something secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('using local strategy', username, password);
    username = username || 'username';
    //TODO get rid of true
    if (true || password === process.env.PASSWORD){
     return done(null, username);
    } else {
     return done(null, false);
    }
  }
));

//  This code is necessary for passport to keep state (it's not really important for this application)
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  console.log('deserializing', id);
  done(null, id);
});

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/login', function(request, response){  response.sendfile('login.html'); });

app.get('*', function(request, response){
  if (request.user) handle(request, response);
  else response.redirect('/login');
});

var handle = function(request, response){
  var url = request.url.toLowerCase();
  console.log('logged in with url ', url);
  if (url === '/') response.sendfile('./index.html');
};

app.listen(process.env.PORT || 3000);