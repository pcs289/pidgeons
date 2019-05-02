var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
require('dotenv').config();
var app = express();

var pidgeonsRouter = require('./routes/pidgeons');
var authRouter = require('./routes/auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.options('*', cors());

mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true});

app.use('/pidgeons', pidgeonsRouter);
app.use('/auth', authRouter);
module.exports = app;
