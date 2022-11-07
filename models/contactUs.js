var mongoose = require('mongoose');
var schema = mongoose.Schema;

var contactusKeys = new schema({

    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
},
    {
        timestamps: true      // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

module.exports = mongoose.model("contactus", contactusKeys)