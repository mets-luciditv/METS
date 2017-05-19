var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./routes/api');
var category=require('./routes/category')
var toc=require('./routes/toc')
var tov=require('./routes/tov')
var solr=require('./routes/solr')
var compression = require('compression')
var app = express();
const winston = require('winston');
winston.level=process.env.LOG_LEVEL||'debug';
console.log("log level:%s",winston.level)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, process.env.WWW_ROOT||'public')));
app.use('/javascripts',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/api',api);
app.use('/api/category',category)
app.use('/api/toc',toc)
app.use('/api/tov',tov)
app.use('/api/solr',solr)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
