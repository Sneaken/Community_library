const createError = require ('http-errors');
const express = require ('express');
const path = require ('path');
const cookieParser = require ('cookie-parser');
const logger = require ('morgan'); //http请求中间件
const passport = require('passport');

const usersRouter = require ('./routes/api/user');
const adminRouter = require ('./routes/api/admin');
const staffRouter = require('./routes/api/staff');
const generalRouter = require('./routes/api/generalPurpose');
const app = express ();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//使用中间件来处理（格式化）请求中的数据
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/user', usersRouter);
app.use('/api/admin',adminRouter);
app.use('/api/staff',staffRouter);
app.use('api/generalPurpose',generalRouter);

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

module.exports = app;
