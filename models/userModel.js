var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userKeys = new schema({

    username: {
        type: String,                           // mormal user = 0 , bussiness Users = 1 , Admin = 2
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default : null
    },
    role: {                                             // 1-Startups, 2-Experienced, 3-Banker, 4-Job Seeker, 5-Admin, 6-Sub-Admin
        type: String,
    },
    businessName: {
        type: String,
        default : null
    },
    summary: {
        type: String,
        default: null
    },
    businessType_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businessType'
    },
    experience_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'experience'
    },
    registrationReason_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registrationReason'
    },
    userStatus: {
        type: String,
        enum: ["PENDING", "APPROVED"],
        default: "APPROVED"
    },
    deviceId: {
        type: String,
        default: null
    },
    deviceModelName: {
        type: String,
        default: null
    },
    deviceType: {
        type: String, default: null
    },
    deviceTokenFcm: {
        type: String, default: null
    },
    date: {
        type: String
    },
    subscriptionStatus: {
        type: String,
        enum: ["NOTSUBSCRIBE", "SUBSCRIBED"],
        default: "NOTSUBSCRIBE",
    },
    subscribe: {
        type: String,
        default: "0"
    },
    
},
    {
        timestamps: true
    });
module.exports = mongoose.model("user", userKeys)
