var mongoose = require('mongoose');
var schema = mongoose.Schema;

var jobKeys = new schema({
    title: {
        type: String,                           
    },
    jobType:{
        type: String,
        default: null
    },
    workplaceType: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    jobCategory: {
        type: String,
        required: true
    },
    skillRequired: {
        type: String,
        required: true
    },
    jobFile: {
        type: String,
        default: null
    },
    experienceRequired: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        default: null
    },
    jobResponsibility: {
        type: String,
        default: null
    },
    salaryBudget: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    extraBenefit: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    postCategory: {
        type: String,
    },
    date: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    jobStatus: {
        type: String,
	    enum: ["0", "1", "2"],
	    default: "0",
    },
    jobApplicationStatus: {
        type: String,
        default: "0",
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("job", jobKeys)
