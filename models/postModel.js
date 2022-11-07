var mongoose = require('mongoose');
var schema = mongoose.Schema;

var postKeys = new schema({
    description: {
        type: String,                           
    },
    postImage:{
        type: String,
        default: null
    },
    postReport: {
        type: Boolean,
        default: true
    },
    postStatus: {
        type: String,
        enum: ["PENDING", "APPROVE"],
        default: "APPROVE"
    },
    status: {
        type: String,
        enum: ["PUBLIC", "PRIVATE"],
        default: "PUBLIC"
    },
    postCategory: {
        type: String,
    },
    like: {
        type: String,
        default: "0"
    },
    likeStatus: {
        type: String,
        default: "0"
    },
    comment: {
        type: String,
        default: "0"
    },
    compareStatus: {
        type: String,
        default: "0"
    },
    date: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("post", postKeys)
