var mongoose = require('mongoose');
var schema = mongoose.Schema;

var jobExperienceKeys = new schema({

    name: {
        type: String,
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("jobExperience", jobExperienceKeys)
