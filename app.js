var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var port = 3001;

var db = require('./model/db'),
    user = require('./model/users'),
    room = require('./model/rooms');

var initPassport = require('./passport/init');

var users = require('./routes/users');
var rooms = require('./routes/rooms');

var app = express();



// view engine setup
app.set(express.static, path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/js/')));
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));

var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// Initialize Passport

initPassport(passport);

var routes = require('./routes/index')(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/rooms', rooms);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("---The error: --- " + err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log("---The error: --- " + err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
app.listen(port, function(){
  console.log('Server listening on port ' + port)
});