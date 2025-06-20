var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var dogsRouter = require('/api/dogs');
var walkrequestssRouter = require('/api/walkrequests/open');
var messagesRouter = require('./routes/messages');