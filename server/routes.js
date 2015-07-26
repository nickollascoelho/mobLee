/* jslint node: true */
'use strict';

var Result = require('./models/result'),
    Question = require('./models/question'),
    path = require('path'),
    request = require('request'),
    zlib = require('zlib'),
    fs = require('fs');

module.exports = function (app) {

    app.get('/v1/question', function (req, res) {
        res.setHeader('content-type', 'application/json');
        findWithQuery(req.query, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });

    app.get('/v1/persist', function (req, res) {
        res.setHeader('content-type', 'text/plain');
        requestWithEncoding(options, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                addQuestions(data, function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('Success');
                    }
                });
            }
        });
    });

    app.get('/:page', function (req, res) {
        var page = req.params.page;
        if (!page) {
            return;
        }
        var filePath = path.resolve('client/' + page + '.html');
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.redirect("/");
        }
    });

    app.get('/:folder/:filename', function (req, res) {
        var filename = req.params.filename;
        var folder = req.params.folder;
        if (!folder) {
            return;
        }
        if (!filename) {
            return;
        }
        res.sendFile(path.resolve('client/' + folder + '/' + filename));
    });

    app.get('*', function (req, res) {
        res.sendFile(path.resolve('client/index.html'));
    });
};

// =========== //


var MAX_LIMIT_PER_PAGE = 100;

/*
 *  query: { page : Number, rpp : Number, sort : String,  score: Number }
 */
var findWithQuery = function (query, callback) {
    var find = Question.find({});
    if (query.score) {
        find.where('score').gt(query.score);
    }
    if (query.sort) {
        find.sort(query.sort);
    }
    if (query.page) {
        find.skip((query.page - 1) * MAX_LIMIT_PER_PAGE);
    }
    if (query.rpp && query.rpp <= MAX_LIMIT_PER_PAGE) {
        find.limit(query.rpp);
    } else {
        find.limit(MAX_LIMIT_PER_PAGE);
    }
    find.lean().exec(questionFindCallback(callback));
};

var questionFindCallback = function (cb) {
    var callback = cb;
    return function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            Result.find({}).lean().exec(function (err, results) {
                var result = results[0];
                removeDatabaseProperties(result);
                docs = docs.map(populateOwnerName);
                result.content = docs.map(removeDatabaseProperties);
                callback(err, result);
            });
        }
    };
};

var populateOwnerName = function (doc) {
    if (doc.owner) {
        doc.owner_name = doc.owner.display_name;
    }
    return doc;
};

var removeDatabaseProperties = function (obj) {
    delete obj._id;
    delete obj.__v;
    delete obj.owner;
    return obj;
};

var options = {
    url: 'http://api.stackexchange.com/2.2/search?page=1&pagesize=99&order=desc&sort=creation&tagged=php&site=stackoverflow',
    headers: {
        'accept-charset': 'ISO-8859-1,utf-8;',
        'accept-encoding': 'gzip,deflate'
    }
};

var requestWithEncoding = function (options, callback) {
    var req = request.get(options);

    req.on('response', function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            var buffer = Buffer.concat(chunks);
            var encoding = res.headers['content-encoding'];
            if (encoding === 'gzip') {
                zlib.gunzip(buffer, function (err, decoded) {
                    callback(err, decoded && decoded.toString());
                });
            } else {
                callback(null, buffer.toString());
            }
        });
    });

    req.on('error', function (err) {
        callback(err);
    });
};

var addQuestions = function (data, callback) {
    var questions = JSON.parse(data).items;
    Question.create(questions, function (err, docs) {
        Result.find({}, function (err, docs) {
            var result;
            if (err) {
                callback(err);
            }
            if (docs) {
                result = docs[0];
            }
            if (!result) {
                return;
            }
            result.last_update = Date.now();
            Result.update(result, function (err, doc) {
                callback(err);
            });
        });
    });
};

/*
 * Bootstrap document on server start
 */
((function () {
    Result.count({}, function (err, count) {
        if (count === 0) {
            Result.create({content: []}, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Created first document');
                }
            });
        }
    });
})());
