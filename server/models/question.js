/*
 * server/models/question.js
 */

'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question_id: Number,
    title: String,
    owner: {
        reputation: Number,
        user_id: Number,
        user_type: String,
        accept_rate: Number,
        profile_image: String,
        display_name: String,
        link: String
    },
    score: Number,
    creation_date: Number,
    link: String,
    is_answered: Boolean
});

module.exports = mongoose.model('Question', QuestionSchema);
