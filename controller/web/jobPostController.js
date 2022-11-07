const mongoose = require('mongoose')
const moment = require('moment')
const session_str = require('node-sessionstorage')

const role = require('../../models/role')
const jobCategoryModel = require('../../models/jobCategory')
const skillModel = require('../../models/skillModel')
const jobType = require('../../models/jobTypeModel')
const workTypeModel = require('../../models/workType')
const experience = require('../../models/experienceModel')
const currencyModel = require('../../models/currencyModel')
const salaryBudgetModel = require('../../models/salaryBudget')
const qualificationModel = require('../../models/qualification')
const extraBenefitModel = require('../../models/extraBenefits')

// <-------------- Job Category Api's -------------->
exports.category_List = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	jobCategoryModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Category' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/jobCategory', { data, moment, profileImage })
            } else if (result.jobCategory === true) {
                res.render('Admin/jobCategory', { data, moment, profileImage })
            } else if (result.jobCategory === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}

exports.addJobCategory = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var categoryData = {
        name: req.body.name,
    }
    let saveItem = new jobCategoryModel(categoryData);
    saveItem.save().then(async doc => {
        let data = await jobCategoryModel.find({}).exec()
        req.flash('success', 'Job Category Added Successfully');
        res.render('Admin/jobCategory', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteJobCategory = async function (req, res, next) {
    jobCategoryModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Job Category deleted Successfully');
        res.redirect('/jobCategoryList')
    }).catch(err => {
        console.log(err, 'error in deleting job Category')
        res.redirect('/jobCategoryList')

    })
}

exports.editJobCategory = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await jobCategoryModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Job Category edited Sucessfully')
    res.redirect('/jobCategoryList')
}

exports.getJobCategoryDetail = function (req, res, next) {
    jobCategoryModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            jobCategoryModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <------------------ Job Type Api's ------------------>
exports.jobType_List = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	jobType.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Type' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/jobType', { data, moment, profileImage })
            } else if (result.jobType === true) {
                res.render('Admin/jobType', { data, moment, profileImage })
            } else if (result.jobType === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addJobType = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var categoryData = {
        name: req.body.name,
    }
    let saveItem = new jobType(categoryData);
    saveItem.save().then(async doc => {
        let data = await jobType.find({}).exec()
        req.flash('success', 'Job Type Added Successfully');
        res.render('Admin/jobType', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteJobType = async function (req, res, next) {
    jobType.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Job Type deleted Successfully');
        res.redirect('/jobTypeList')
    }).catch(err => {
        console.log(err, 'error in deleting Job Type')
        res.redirect('/jobTypeList')

    })
}

exports.editJobType = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await jobType.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Job Type edited Sucessfully')
    res.redirect('/jobTypeList')
}

exports.getJobTypeDetail = function (req, res, next) {
    jobType.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            jobType.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <------------------- Work Place Type Api's ----------------------->
exports.workPlaceType_List = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	workTypeModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Work Place' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/workplaceType', { data, moment, profileImage })
            } else if (result.workplaceType === true) {
                res.render('Admin/workplaceType', { data, moment, profileImage })
            } else if (result.workplaceType === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addWorkPlace = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var workTypeData = {
        name: req.body.name,
    }
    let saveItem = new workTypeModel(workTypeData);
    saveItem.save().then(async doc => {
        let data = await workTypeModel.find({}).exec()
	req.flash('success', 'Work Place Added Successfully');
        res.render('Admin/workplaceType', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteWorkType = async function (req, res, next) {
    workTypeModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Work Place deleted Successfully');
        res.redirect('/workplaceTypeList')
    }).catch(err => {
        console.log(err, 'error in deleting Work Place')
        res.redirect('/workplaceTypeList')

    })
}

exports.editWorkType = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await workTypeModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Work Place edited Sucessfully')
    res.redirect('/workplaceTypeList')
}

exports.getWorkTypeDetail = function (req, res, next) {
    workTypeModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            workTypeModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <------------------- Experience Api's ------------------------->
exports.experience_List = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	experience.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Type' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/experience', { data, moment, profileImage })
            } else if (result.experience === true) {
                res.render('Admin/experience', { data, moment, profileImage })
            } else if (result.experience === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addExperience = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var experienceData = {
        name: req.body.name,
    }
    let saveItem = new experience(experienceData);
    saveItem.save().then(async doc => {
        let data = await experience.find({}).exec()
        req.flash('success', 'Experience Added Successfully');
        res.render('Admin/experience', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteExperience = async function (req, res, next) {
    experience.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'experience deleted Successfully');
        res.redirect('/experienceList')
    }).catch(err => {
        console.log(err, 'error in deleting experience')
        res.redirect('/experienceList')

    })
}

exports.editExperience = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await experience.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'experience edited Sucessfully')
    res.redirect('/experienceList')
}

exports.getExperienceDetail = function (req, res, next) {
    experience.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            jobType.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <------------------- Currency Api's ------------------------->
exports.currencyList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	currencyModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Type' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/addCurrency', { data, moment, profileImage })
            } else if (result.addCurrency === true) {
                res.render('Admin/addCurrency', { data, moment, profileImage })
            } else if (result.addCurrency === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addCurrency = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var CurrencyData = {
        name: req.body.name,
    }
    let saveItem = new currencyModel(CurrencyData);
    saveItem.save().then(async doc => {
        let data = await currencyModel.find({}).exec()
        req.flash('success', 'Currency Added Successfully');
        res.render('Admin/addCurrency', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteCurrency = async function (req, res, next) {
    currencyModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Currency deleted successfully');
        res.redirect('/currencyList')
    }).catch(err => {
        console.log(err, 'error in deleting currency')
        res.redirect('/currencyList')

    })
}

exports.editCurrency = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await currencyModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Cuurency edited sucessfully')
    res.redirect('/currencyList')
}

exports.getCurrencyDetail = function (req, res, next) {
    currencyModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            jobType.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

//<---------------- Salary Budget Api's ----------------------->
exports.salaryBudgetList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	salaryBudgetModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Type' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/salaryBudget', { data, moment, profileImage })
            } else if (result.salaryBudget === true) {
                res.render('Admin/salaryBudget', { data, moment, profileImage })
            } else if (result.salaryBudget === false) {
                res.render('Admin/permission_error', profileImage);
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addSalaryBudget = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var salaryBudgetData = {
        name: req.body.name,
    }
    let saveItem = new salaryBudgetModel(salaryBudgetData);
    saveItem.save().then(async doc => {
        let data = await salaryBudgetModel.find({}).exec()
        req.flash('success', 'salaryBudget Added Successfully');
        res.render('Admin/salaryBudget', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404',)
    })
}

exports.deleteSalaryBudget = async function (req, res, next) {
    salaryBudgetModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'experience deleted Successfully');
        res.redirect('/salaryBudgetList')
    }).catch(err => {
        console.log(err, 'error in deleting experience')
        res.redirect('/salaryBudgetList')

    })
}

exports.editSalaryBudget = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await salaryBudgetModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'experience edited Sucessfully')
    res.redirect('/salaryBudgetList')
}

exports.getSalaryBudgetDetail = function (req, res, next) {
    salaryBudgetModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            salaryBudgetModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <--------------------- Qualification Api's ------------------>
exports.qualificationList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	qualificationModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Qualification' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/qualification', { data, moment, profileImage })
            } else if (result.qualification === true) {
                res.render('Admin/qualification', { data, moment, profileImage })
            } else if (result.qualification === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}


exports.addQualification = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var qualificationeData = {
        name: req.body.name,
    }
    let saveItem = new qualificationModel(qualificationeData);
    saveItem.save().then(async doc => {
        let data = await qualificationModel.find({}).exec()
        req.flash('success', 'Qualification Added Successfully');
        res.render('Admin/qualification', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteQualification = async function (req, res, next) {
    qualificationModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Qualification deleted Successfully');
        res.redirect('/qualificationList')
    }).catch(err => {
        console.log(err, 'error in deleting experience')
        res.redirect('/qualificationList')

    })
}

exports.editQualification = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await qualificationModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Qualification edited Sucessfully')
    res.redirect('/qualificationList')
}

exports.getQualificationDetail = function (req, res, next) {
    qualificationModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            qualificationModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <----------------------------- Extra Benefits Api's ------------------------>
exports.extraBenifitList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	extraBenefitModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'Job Type' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/extraBenefit', { data, moment, profileImage })
            } else if (result.extraBenefit === true) {
                res.render('Admin/extraBenefit', { data, moment, profileImage })
            } else if (result.extraBenefit === false) {
                res.render('Admin/permission_error', {profileImage});
            }
        });
    }).catch(err => {
        res.redirect('/404')
        console.log(err, 'error')
    })
}

exports.addExtraBenifit = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var experienceData = {
        name: req.body.name,
    }
    let saveItem = new extraBenefitModel(experienceData);
    saveItem.save().then(async doc => {
        let data = await extraBenefitModel.find({}).exec()
        req.flash('success', 'Experience Added Successfully');
        res.render('Admin/extraBenefit', { data, moment, profileImage })
    }).catch((err) => {
        next(new Error(err));
        res.redirect('/404')
    })
}

exports.deleteExtraBenifit = async function (req, res, next) {
    extraBenefitModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Benifit deleted Successfully');
        res.redirect('/extraBenifitList')
    }).catch(err => {
        console.log(err, 'error in deleting Benifit')
        res.redirect('/extraBenifitList')

    })
}

exports.editExtraBenifit = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await extraBenefitModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'experience edited Sucessfully')
    res.redirect('/extraBenifitList')
}

exports.getExtraBenifitDetail = function (req, res, next) {
    extraBenefitModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            extraBenefitModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// <----------------- Skill Api's ------------------------->
exports.addSkill = async function (req, res, next) {
    var userVariable = {
        "name": req.body.name,
        "jobCategory_id": req.body.jobCategory
    }
    console.log(userVariable, "userVariable");
    let data1 = await jobCategoryModel.find({}).exec();
    console.log(data1, 'line no......523');
    let saveItem = new skillModel(userVariable);
    // console.log(data1, 'line nooooo.....163')
    saveItem.save().then(async doc => {
        let data2 = await skillModel.find({}).exec()

        // console.log(doc)
        res.locals = { title: 'skill' };
        var data = await skillModel.aggregate([
            {
                "$project": {
                    "ic": "$$ROOT"
                }
            },
            {
                "$lookup": {
                    from: "job_category",
                    localField: "ic.jobCategory_id",
                    foreignField: "_id",
                    as: "sc"
                }
            },
            {
                "$unwind": {
                    "path": "$sc",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    "name": "$ic.name",
                    "job_category": "$sc.name",
                    "createdAt": "$ic.createdAt",
                }
            }
        ])
        req.flash('success', 'Skill Added Successfully');
        res.redirect('/skill_List')
    }).catch((err) => {
        req.flash('error', 'Something Went Wrong');
        next(new Error(err));
    })
}

exports.skill_List = async function (req, res, next) {
    let data1 = await jobCategoryModel.find({}).exec();
    var data = await skillModel.aggregate([
        {
            "$project": {
                "ic": "$$ROOT"
            }
        },
        {
            "$lookup": {
                from: "job_categories",
                localField: "ic.jobCategory_id",
                foreignField: "_id",
                as: "sc"
            }
        },
        {
            "$unwind": {
                "path": "$sc",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $project: {
                "name": "$ic.name",
                "job_category": "$sc.name",
                "createdAt": "$ic.createdAt",
            }
        }
    ])
    res.locals = { title: 'Item Category' };
	let profileImage = session_str.getItem('profileImage')
    // var profileImage = req.user.profileImage;
    getUserDetails(session_str.getItem('session_id'), function (result) {
        // console.log(result)
        if (session_str.getItem('role_id') === "5") {
            res.render('Admin/skill', { data, data1, moment, profileImage })
        } else if (result.skill === true) {
            res.render('Admin/skill', { data, data1, moment, profileImage })
        } else if (result.skill === false) {
            res.render('Admin/permission_error', {profileImage});
        }
    });
}

exports.editSkill = async function (req, res, next) {
    var userVariable = {
        name: req.body.name,
    }
    var data = await skillModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Skill edited Sucessfully')
    res.redirect('/skill_List')
}

exports.deleteSkill = async function (req, res, next) {
    skillModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Skill deleted Successfully');
        res.redirect('/skill_List')
    }).catch(err => {
        console.log(err, 'error in deleting Benifit')
        res.redirect('/skill_List')

    })
}

exports.getSkillDetail = async function (req, res, next) {
    skillModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        if (data) {
            skillModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
                var json = {
                    data: data[0],
                }
                res.send(json)
            })
        }
        else {
            res.send(data[0])
        }
    })
}

// exports.addSkill = async function (req, res, next) {
//     var name = req.body.name;
//     var jobCategory_id = req.body.jobCategory;
//     console.log(req.body.name, req.body.jobCategory);

//     var userVariable = {
//         "name": req.body.name,
//         "jobCategory_id": req.body.jobCategory
//     }
//     console.log(userVariable, "userVariable");
//     let data1 = await jobCategoryModel.find({}).exec();
//     console.log(data1, 'line no......523');
//     let saveItem = new skillModel(userVariable);
//     // console.log(data1, 'line nooooo.....163')
//     saveItem.save().then(async doc => {
//         let data2 = await skillModel.find({}).exec()

//         // console.log(doc)
//         res.locals = { title: 'skill' };
//         var data = await skillModel.aggregate([
//             {
//                 "$project": {
//                     "ic": "$$ROOT"
//                 }
//             },
//             {
//                 "$lookup": {
//                     from: "job_category",
//                     localField: "ic.jobCategory_id",
//                     foreignField: "_id",
//                     as: "sc"
//                 }
//             },
//             {
//                 "$unwind": {
//                     "path": "$sc",
//                     "preserveNullAndEmptyArrays": true
//                 }
//             },
//             {
//                 $project: {
//                     "name": "$ic.name",
//                     "job_category": "$sc.name",
//                     "createdAt": "$ic.createdAt",
//                 }
//             }
//         ])
//         req.flash('success', 'Item Category Added Successfully');
//         res.redirect('/skill_List')
//     }).catch((err) => {
//         req.flash('error', 'Something Went Wrong');
//         next(new Error(err));
//     })
// }

// exports.skill_List = async function (req, res, next) {
//     let data1 = await jobCategoryModel.find({}).exec();
//     var data = await skillModel.aggregate([
//         {
//             "$project": {
//                 "ic": "$$ROOT"
//             }
//         },
//         {
//             "$lookup": {
//                 from: "job_categories",
//                 localField: "ic.jobCategory_id",
//                 foreignField: "_id",
//                 as: "sc"
//             }
//         },
//         {
//             "$unwind": {
//                 "path": "$sc",
//                 "preserveNullAndEmptyArrays": true
//             }
//         },
//         {
//             $project: {
//                 "name": "$ic.name",
//                 "job_category": "$sc.name",
//                 "createdAt": "$ic.createdAt",
//             }
//         }
//     ])
//     res.locals = { title: 'Item Category' };
//	let profileImage = session_str.getItem('profileImage')
//     // var profileImage = req.user.profileImage;
//     getUserDetails(session_str.getItem('session_id'), function (result) {
//         // console.log(result)
//         if (session_str.getItem('role_id') === "5") {
//             res.render('Admin/skill', { data, data1, moment, profileImage })
//         } else if (result.skill === true) {
//             res.render('Admin/skill', { data, data1, moment, profileImage })
//         } else if (result.skill === false) {
//             res.render('Admin/permission_error', {profileImage});
//         }
//     });
// }

// exports.getItemDetail = async function (req, res, next) {
//     var data = await itemCategory.aggregate([
//         {
//             "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
//         },
//         {
//             "$project": {
//                 "ic": "$$ROOT"
//             }
//         },
//         {
//             $lookup: {
//                 from: "shop_categories",
//                 localField: "ic.shop_category",
//                 foreignField: "_id",
//                 as: "sc"
//             }
//         },
//         {
//             "$unwind": {
//                 "path": "$sc",
//                 "preserveNullAndEmptyArrays": true
//             }
//         },

//         {
//             "$project": {
//                 // "shop_id": "$shopName._id",
//                 // "shop_type_id": "$sc._id",
//                 "name": "$ic.name",
//                 "shop_cat_id": "$ic.shop_cat_id",
//                 "shopCatName": "$sc.name",
//                 "createdAt": "$ic.createdAt",
//             }
//         }
//     ])

//     const shop_type = await shopCategory.find({}).exec();
//     console.log(data, 'line no......247 post')

//     if (data) {
//         var json = {
//             data: data[0],
//             shop_type: shop_type,
//         }
//         res.send(json)
//     }
//     else {
//         res.send(data[0])
//     }
// }

// exports.editItemCategory = async function (req, res, next) {
//     // var _id = mongoose.Types.ObjectId(req.body._id);
//     var userVariable = {
//         name: req.body.name,
//         shop_category: mongoose.Types.ObjectId(req.body.shop_category),
//     }
//     console.log(userVariable, 'hjghhjjhjgh ***********line No.309');
//     // var profileImage = session_str.getItem('profileImage');

//     itemCategory.find({ _id: mongoose.Types.ObjectId(req.body._id) }).exec(async (err, data) => {
//         console.log(data, 'line no.........312 item')
//         console.log(req.body._id, 'line no.........312 item')
//         if (err) {
//             console.log(err)
//             res.redirect('/itemCategory_List');
//         }
//         else {
//             if (data.length > 0) {
//                 console.log('matched')
//                 req.flash('success', 'Item Category Edited Successfully')
//                 await itemCategory.updateOne({ _id: mongoose.Types.ObjectId(req.body._id) }, { $set: userVariable })
//                 res.redirect('/itemCategory_List')
//             }
//             else {
//                 console.log('notmatched')
//                 req.flash('error', 'Something Went wrong')
//                 res.redirect('/itemCategory_List')

//             }
//         }
//     })
// }

// exports.deleteitemCategory = async function (req, res, next) {
//     itemCategory.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
//         req.flash('error', 'Item Category Deleted Successfully');
//         res.redirect('/itemCategory_List')
//     }).catch(err => {
//         console.log(err, 'error in deleteitemCategory')
//         res.redirect('/itemCategory_List')
//     })
// }

function getUserDetails(roleId, callback) {
    var user = {};
    role.find({ user_id: mongoose.Types.ObjectId(roleId) }).exec(function (err, roles) {
        if (err) { return next(err); }
        callback(roles[0]);
    });
}