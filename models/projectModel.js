var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectKeys = new schema({
    title: {
        type: String,                           
    },
    summary:{
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    document: {
        type: String,
        default: null
    },
    skills: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    },
    postCategory: {
        type: String,
    },
    projectStatus: {
        type: String,
        enum: ["PENDING", "APPROVED"],
        default: "PENDING"
    },
    date: {
        type: String
    },
    currency_id: {
        type: String,
    },
    price_id: {
         type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("project", projectKeys)
