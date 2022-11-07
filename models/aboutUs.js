var mongoose = require('mongoose');
var schema = mongoose.Schema;

var aboutusKeys = new schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
},
    {
        timestamps: true      // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

module.exports = mongoose.model("aboutus", aboutusKeys)