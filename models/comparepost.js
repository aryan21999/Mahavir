var mongoose = require('mongoose');
var schema = mongoose.Schema;

var comparepostKeys = new schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        default: "0"
    },
    date: {
        type: String
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("comparepost", comparepostKeys)
