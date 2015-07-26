/*
 * server/routes.js
 */

'use strict'

var Result = require('./models/result'),
    Question = require('./models/question'),
    path = require('path');

module.exports = function(app) {

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
