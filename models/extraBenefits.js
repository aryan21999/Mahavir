var mongoose = require('mongoose');
var schema = mongoose.Schema;

var extraBenefitKeys = new schema({

    name: {
        type: String,
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("extra_benefit", extraBenefitKeys)
