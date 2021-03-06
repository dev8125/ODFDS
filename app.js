var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uuid = require('uuid/v4');
var session = require('express-session');

var indexRouter = require('./routes/index');
var restRouter = require('./routes/restRouter');
var driverRouter = require('./routes/driverRouter');
var cons = require('consolidate');
var app = express();

// View engine setup (use html).
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  genid: (req) => { return uuid(); },
  cookie: { maxAge: 10 * 60 * 6000 }, // expires after 10m
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/rest', express.static(path.join(__dirname, 'public')));
app.use('/driver', express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/rest', restRouter);
app.use('/driver', driverRouter);

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
