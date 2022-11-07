var mongoose = require("mongoose");
var subscription = new mongoose.Schema({
    subscription_name: {
        type: String,
        required: true
    },
    validity: {
        type: String
    },
    charge: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "0"
    },
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

var subscription = module.exports = mongoose.model("subscription", subscription);
module.exports = subscription;