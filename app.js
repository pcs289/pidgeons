var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();
var app = express();

var pidgeonsRouter = require('./routes/pidgeons');
var authRouter = require('./routes/auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true});

app.use('/pidgeons', pidgeonsRouter);
app.use('/auth', authRouter);
module.exports = app;
