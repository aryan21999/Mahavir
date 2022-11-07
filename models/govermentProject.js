var mongoose = require('mongoose');
var schema = mongoose.Schema;

var govtProjectKeys = new schema({
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
    skill: {
        type: String,
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
    currency: {
        type: String,
        default: null
    },
    price: {
        type: String,
        default: null
    },
    date: {
        type: String
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("govtProjectKeys", govtProjectKeys)
