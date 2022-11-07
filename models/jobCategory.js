var mongoose = require('mongoose');
var schema = mongoose.Schema;

var job_categoryKeys = new schema({

    name: {
        type: String, 
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("job_category", job_categoryKeys)
