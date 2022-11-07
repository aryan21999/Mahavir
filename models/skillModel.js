var mongoose = require('mongoose');
var schema = mongoose.Schema;

var skillKeys = new schema({

    name: {
        type: String,                           
    },
    // jobCategory_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'job_category'
    // },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("skill", skillKeys)
