const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const config = require('config')
const http = require('http')

const dbUtil = require('./db')(config.database)
dbUtil.connect()
global.db = dbUtil


const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const usersRoutes = require('./routes/users');
const manufacturersRoutes = require('./routes/manufacturers');


app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/mfgs', manufacturersRoutes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port); // Listen on port defined in environment
console.log('Server is running on port',config.port)

module.exports = app;