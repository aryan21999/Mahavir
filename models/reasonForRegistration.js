var mongoose = require('mongoose');
var schema = mongoose.Schema;

var registrationReasonKeys = new schema({

    name: {
        type: String,                           // mormal user = 0 , bussiness Users = 1 , Admin = 2
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("registrationReason", registrationReasonKeys)
