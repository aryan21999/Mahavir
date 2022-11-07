var mongoose = require('mongoose');
var schema = mongoose.Schema;

var paymentOptionsKeys = new schema({

    option: {
        type: String,                           
    },
    icon: {
        type: String,                           
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("payment_options", paymentOptionsKeys)
