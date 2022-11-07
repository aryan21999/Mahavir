var mongoose = require('mongoose');
var schema = mongoose.Schema;

var qualificationKeys = new schema({

    name: {
        type: String,
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("qualification", qualificationKeys)
