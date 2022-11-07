var mongoose = require('mongoose');
var schema = mongoose.Schema;

var appliedJobKeys = new schema({

    status: {
        type: String,
        default: 1
    },
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
    date: {
        type: String
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("appliedJob", appliedJobKeys)
