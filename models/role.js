var mongoose = require("mongoose");
var rolesSchema = new mongoose.Schema({
    user_id:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'user'
    },
    dashboard :{ type:Boolean,default:false },
    projects :{ type:Boolean,default:false },
    govermentProject :{ type:Boolean,default:false },
    approveProject :{ type:Boolean,default:false },
    posts :{ type:Boolean,default:false },
    jobs :{ type:Boolean,default:false },
    jobCategory :{ type:Boolean,default:false },
    jobType :{ type:Boolean,default:false },
    workplaceType :{ type:Boolean,default:false },
    experience :{ type:Boolean,default:false },
    salaryBudget :{ type:Boolean,default:false },
    qualification :{ type:Boolean,default:false },
    extraBenefit :{ type:Boolean,default:false },
    skill :{ type:Boolean,default:false },
    startup :{ type:Boolean,default:false },
    approveStartups :{ type:Boolean,default:false },
    experiencedCompany :{ type:Boolean,default:false },
    approveExperiencedCompany :{ type:Boolean,default:false },
    jobSeeker :{ type:Boolean,default:false },
    approveJobSeeker :{ type:Boolean,default:false },
    banker :{ type:Boolean,default:false },
    approveBanker :{ type:Boolean,default:false },
    subAdmin:{ type:Boolean,default:false },
    user:{type:Boolean,default:false},
    subscriptionPlan:{type:Boolean,default:false},
    govermentProject:{type:Boolean,default:false},
    feedback:{ type:Boolean,default:false },
    query:{ type:Boolean,default:false },
    updatedby:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },
}, {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

var roles = module.exports = mongoose.model("subadmin_roles", rolesSchema);
module.exports = roles;