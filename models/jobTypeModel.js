var mongoose = require('mongoose');
var schema = mongoose.Schema;

var jobTypeKeys = new schema({

    name: {
        type: String, 
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("job_type", jobTypeKeys)
