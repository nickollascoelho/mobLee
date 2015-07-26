# MobLee StackOverflowApi

Node.js web application with a simple REST API built with Express 4.x.

[![Build Status](https://travis-ci.org/nickollascoelho/stack_moblee.svg?branch=master)](https://travis-ci.org/nickollascoelho/stack_moblee)

#### Built with:
* [node.js](http://www.nodejs.org/)
* [express](http://www.expressjs.com/)
* [mongolab](http://www.mongolab.com/)
* [bootstrap](http://getbootstrap.com/)
* [jquery](http://www.jquery.com/)

#### Dependencies:
* [nodejs](http://www.nodejs.org/)

#### Install dependencies (may might need to use `sudo` for various reasons):
* `brew/apt-get install nodejs`
* `npm install`

#### Environment variables:
* `MONGLAB_STACK_MOBLEE_URL` -  Mongolab url (including authentication)
 * example: `mongodb://<dbuser>:<dbpassword>@<dbserver>.mongolab.com:<dbport>/<db>`
* `PORT` - Port exposed (default 8080)
  * example: `3000`

#### Run the application:
* set environment variables
* `npm start` or `node server`
* navigate your browser to `http://localhost:PORT`

#### Introduction:
The objective of this project is:
- Consume [StackOverflow API](https://api.stackexchange.com/docs/) data.
- Expose these data by its api.

API Calls:
1. GET http://localhost/stack_moblee/v1/persist
  * Used to retrieve data from StackOverflow and persist to be consumed later.
2. GET http://localhost/stack_moblee/v1/question?page={$1}&rpp={$2}&sort={$3}&score={$4} (All optional parameters)
  * All optional parameters.
  * Score paramter should query only questions with a greater value than specified.
  * Sort paramater define which property should be used to order the results. It accepts any of question model properties: question_id, title, owner_name, score, creation_date, link ou is_answered.
  * Page and 'rpp' (results per page) parameters should not be used without each other.
  * JSON response like:
  * ```javascript
  {
  "last_update": 1437405249,
  "content": [
      {
      "question_id": 1
      "title": "Título da pergunta",
      "owner_name": "Display name do usuário que fez a pergunta",
      "score": 10,
      "creation_date": 1437405249
      "link": "http://stackoverflow.com/questions/31520296/some-question",
      "is_answered": false
      },
      {
      "question_id": 2
      "title": "Título da pergunta 2",
      "owner_name": "Display name do usuário que fez a pergunta 2",
      "score": 5,
      "creation_date": 1437405248
      "link": "http://stackoverflow.com/questions/31520296/some-question",
      "is_answered": true
      }
    ]
  };
  ```

The last_update property should have the last date when data were saved.

All date properties should have the [Unix Timestamp](http://www.unixtimestamp.com) format.

* Feel free to send pull requests. :-)
