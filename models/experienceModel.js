var mongoose = require('mongoose');
var schema = mongoose.Schema;

var experienceKeys = new schema({

    name: {
        type: String,
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("experience", experienceKeys)
