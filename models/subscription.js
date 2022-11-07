var mongoose = require("mongoose");
var subscribeUsers = new mongoose.Schema({
    amount: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    subscription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription'
    },
    date: {
        type: String,
    },
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

var subscribeUsers = module.exports = mongoose.model("subscribeUsers", subscribeUsers);
module.exports = subscribeUsers;
