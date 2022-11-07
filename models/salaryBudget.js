var mongoose = require('mongoose');
var schema = mongoose.Schema;

var salaryBudgetKeys = new schema({

    name: {
        type: String, 
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("salary_budget", salaryBudgetKeys)
