var mongoose = require('mongoose');
var schema = mongoose.Schema;

var notificationKeys = new schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time: {
        type: String,
    },
},
    {
        timestamps: true      // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

module.exports = mongoose.model("notification", notificationKeys)
