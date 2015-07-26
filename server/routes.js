/*
 * server/routes.js
 */

'use strict'

var Result = require('./models/result'),
    Question = require('./models/question'),
    path = require('path'),
    request = require('request'),
    zlib = require('zlib');

module.exports = function(app) {

  app.get('/v1/persist', function(request, response) {
    requestWithEncoding(options, function(err, data) {
      if (err) response.send(err);
      else addQuestions(data, function(err) {
        if (err) response.send(err);
        else response.send('Success');
      });
    });
  });

  app.get('/:folder/:filename', function(req, res) {
    var filename = req.params.filename;
    var folder = req.params.folder;
    if (!folder) return;
    if (!filename) return;
    res.sendFile(path.resolve('client/' + folder + '/' + filename));
  });

  app.get('*', function(request, response) {
    response.sendFile(path.resolve('client/index.html'));
  });
};

var options = {
  url: 'http://api.stackexchange.com/2.2/search?page=1&pagesize=99&order=desc&sort=creation&tagged=php&site=stackoverflow',
  headers: {
    'accept-charset' : 'ISO-8859-1,utf-8;',
    'accept-encoding' : 'gzip,deflate'
  }
};

var requestWithEncoding = function(options, callback) {
  var req = request.get(options);

  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding === 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else {
        callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err) {
    callback(err);
  });
};

var addQuestions = function(data, callback) {
  var questions = JSON.parse(data).items;
  Question.create(questions, function(err, docs) {
    Result.find({}, function(err, docs) {
      if (err) callback(err);
      else Result.update(docs[0], function(err, doc) {
            callback(err);
           });
    });
  });
};

/*
 * Bootstrap document on server start
 */
(function() {
  Result.count({}, function(err, count) {
    if (count === 0) {
      Result.create({ content: [] }, function (err, result) {
        if (err) console.log(err);
        else console.log('Created first document');
      });
    }
  });
})();
