var mongoose = require('mongoose');
var schema = mongoose.Schema;

var generalBusinessInformationKeys = new schema({

    name: {
        type: String,
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("general_business_information", generalBusinessInformationKeys)