var mongoose = require('mongoose');
var schema = mongoose.Schema;

var workTypeKeys = new schema({

    name: {
        type: String,        
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("work_type", workTypeKeys)
