/*
 * server/index.js
 */

'use strict'

var express  = require('express'),
   app      = express(),
   mongoose = require('mongoose'),
   database = require('./config/database'),
   morgan = require('morgan'),
   bodyParser = require('body-parser'),
   methodOverride = require('method-override'),
   errorHandler = require('error-handler'),
   http = require('http'),
   path = require('path');

mongoose.connect(database.url);

app.set('port', process.env.PORT || 8080);

app.use(express.static(__dirname + '/client'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
