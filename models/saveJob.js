var mongoose = require('mongoose');
var schema = mongoose.Schema;

var saveJobKeys = new schema({

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    saveJobStatus: {
        type: String,
        default: "0"
    },
    
},
    {
        timestamps: true
    });
module.exports = mongoose.model("saveJob", saveJobKeys)
