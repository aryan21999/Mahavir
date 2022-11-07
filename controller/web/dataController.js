const mongoose = require('mongoose')
const moment = require('moment')
const session_str = require('node-sessionstorage')

const role = require('../../models/role')
const userModel = require('../../models/userModel')
const govtProjetModel = require("../../models/govermentProject")
const projectModel = require('../../models/projectModel')
const jobModel = require('../../models/jobModel')
const postModel = require('../../models/postModel')
const skillModel = require('../../models/skillModel')

// <------------------------- Project Api's -------------------------->

exports.projectList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
   	 projectModel.find({ }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/projects', { data, moment, profileImage })
            } else if (result.projects === true) {
                res.render('Admin/projects', { data, moment, profileImage })
            } else if (result.projects === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

// exports.approveProject = async function (req, res, next) {
//     try {
//         projectModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { projectStatus: "APPROVED" } }).then(async data => {
//             req.flash('success', 'Project Approved successfully');
//             console.log(data);
//             res.redirect('/projects')
//         })
//     } catch (err) {
//         console.log(err, 'error')
//         res.redirect('/projects')
//     }
// }

// exports.approveProjectList = async function (req, res, next) {
//     projectModel.find({ projectStatus: "APPROVED" }).sort({ createdAt: -1 }).exec().then(data => {
//         res.locals = { title: 'Projects' };
//         // var profileImage = req.user.profileImage;
//         getUserDetails(session_str.getItem('session_id'), function (result) {
//             console.log(result)
//             if (session_str.getItem('role_id') === "5") {
//                 res.render('Admin/approveProject', { data, moment })
//             } else if (result.approveProject === true) {
//                 res.render('Admin/approveProject', { data, moment })
//             } else if (result.approveProject === false) {
//                 res.render('Admin/404');
//             }
//         });
//     }).catch(err => {
//         console.log(err, 'error')
//         res.send(500);
//     })
// }

exports.deleteProject = async function (req, res, next) {
    projectModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Project deleted Successfully');
        res.redirect('/projects')
    }).catch(err => {
        console.log(err, 'error in deleting Project')
        res.redirect('/projects')

    })
}

exports.updateProjectStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")
        var status = false;

    }

    projectModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}

exports.getProjectDetail = async function (req, res, next) {
    var data = await projectModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "ic": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ic.user_id",
                foreignField: "_id",
                as: "us"
            }
        },
        {
            "$unwind": {
                "path": "$us",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "currencies",
                localField: "ic.currency_id",
                foreignField: "_id",
                as: "ci"
            }
        },
        {
            "$unwind": {
                "path": "$ci",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "prices",
                localField: "ic.price_id",
                foreignField: "_id",
                as: "pi"
            }
        },
        {
            "$unwind": {
                "path": "$pi",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "title": "$ic.title",
                "summary": "$ic.summary",
                "category": "$ic.category",
                "description": "$ic.description",
                "document": "$ic.document",
                "skill": "$ic.skills",
                "currency": "$ci.name",
                "price": "$pi.name",
                "username": "$us.username",
                "date": "$ic.date",
            }
        }
    ])
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
    // console.log(data, 'line no.......116')
    // const skillData = await skillModel.find({}).exec();
    // var projectList = data.map(async obj => {
    //     if (obj.skill) {
    //         var str = obj.skill
    //         var str_array = str.split(',');
    //         console.log(str_array, "str_array")
    //         var arr = [];
    //         for (var i = 0; i < str_array.length; i++) {
    //             const skill_types = await skillModel.findOne({ _id: mongoose.Types.ObjectId(str_array[i]) })
    //             console.log(skill_types, "===================Line no 165");
    //             if (skill_types) {
    //                 arr[i] = skill_types.name
    //             }
    //         }
    //         obj.skill = arr.toString();
    //     } else {
    //         obj.skill = '';
    //     }
    //     return obj;
    // });
    // const finalProjectList = await Promise.all(projectList);
    // console.log(finalProjectList, 'line no......137')
    // if (finalProjectList) {
    //     var json = {
    //         data: finalProjectList[0],
    //         skillData: skillData,
    //     }
    //     console.log(data, 'line no........254')
    //     res.send(json)
    // }
    // else {
    //     res.send(data[0])
    // }
}

// <------------------------ Post Api's ------------------------->

exports.postList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	postModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/posts', { data, moment, profileImage })
            } else if (result.posts === true) {
                res.render('Admin/posts', { data, moment, profileImage })
            } else if (result.posts === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deletePost = async function (req, res, next) {
    postModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Post deleted Successfully');
        res.redirect('/posts')
    }).catch(err => {
        console.log(err, 'error in deleting Post')
        res.redirect('/posts')

    })
}

exports.updatePostStatus = function (req, res, next) {
    console.log(req.query.id, req.params.postReport, 'line no...476')
    var url = req.params.url;
    if (req.params.postReport == 1) {
        console.log("true")
        var postReport = true;
    }
    else {
        console.log("false")
        var postReport = false;
    }

    postModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { postReport } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}

exports.getPostDetail = async function (req, res, next) {
    var data = await postModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "ic": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "ic.user_id",
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
            "$project": {
                "description": "$ic.description",
                "postImage": "$ic.postImage",
                "username": "$sc.username",
                "email": "$sc.email",
                "address": "$sc.address",
                "date": "$ic.date",
            }
        }
    ])
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}


// <------------------------Goverment Project Api's----------------------------->


exports.addGovtProject = function (req, res) {
    var projectData = {
        title: req.body.title,
        summary: req.body.summary,
        category: req.body.category,
        skill: req.body.skill,
        document: req.file.filename,
        description: req.body.description,
        price: req.body.price,
        currency: req.body.currency,
        date: new Date().toISOString().slice(0, 10),
        status: "1",
        postCategory: "4",
    }
    if (req.body.document != undefined) {
        projectData.document = req.files.document[0].filename;
    }
    new govtProjetModel(projectData).save().then(data => {
        req.flash('success', 'Project Added Sucessfully')
        res.redirect('/govermentProject')
    }).catch((error) => {
        req.flash('Failed', 'Something went wrong!')
        res.redirect('/govermentProject')
    });
}

exports.govermentProject = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
	govtProjetModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        console.log(data, '++++++++++++++++')
        res.locals = { title: 'Subscription Plan' };
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/govermentProject', { data, moment, profileImage })
            } else if (result.govermentProject === true) {
                res.render('Admin/govermentProject', { data, moment, profileImage })
            } else if (result.govermentProject === false) {
                res.render('Admin/permission_error', { profileImage });
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteGovtProj = async function (req, res, next) {
    govtProjetModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Project deleted Successfully');
        res.redirect('/govermentProject')
    }).catch(err => {
        console.log(err, 'error in deleting job')
        res.redirect('/govermentProject')

    })
}

exports.editGovtProj = async function (req, res, next) {
    var projectData = {
        title: req.body.title,
        summary: req.body.summary,
        category: req.body.category,
        skill: req.body.skill,
        description: req.body.description,
        document: req.file.filename,
        price: req.body.price,
        currency: req.body.currency,
        date: new Date().toISOString().slice(0, 10),
        status: "1",
    }
    var data = await govtProjetModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: projectData })
    req.flash('success', 'Project edited Sucessfully')
    res.redirect('/govermentProject')
    // console.log(userVariable, 'line no...............56 postController');
}

exports.getGovtProjDetail = function (req, res, next) {
    govtProjetModel.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        console.log(req.query._id, 'line no.........122')
        console.log(data, 'line no.........122')
        if (data) {
            govtProjetModel.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
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


//  <------------------------------- Job Api's --------------------------------->

exports.jobList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	jobModel.find({}).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/jobs', { data, moment, profileImage })
            } else if (result.jobs === true) {
                res.render('Admin/jobs', { data, moment, profileImage })
            } else if (result.jobs === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteJob = async function (req, res, next) {
    jobModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Job deleted Successfully');
        res.redirect('/jobs')
    }).catch(err => {
        console.log(err, 'error in deleting job')
        res.redirect('/jobs')

    })
}

exports.updateJobStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")

        var status = false;

    }

    jobModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}

exports.getJobDetail = async function (req, res, next) {
    var data = await jobModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "jm": "$$ROOT"
            }
        },
        {
            "$project": {
                "title": "$jm.title",
                "jobType": "$jm.jobType",
                "workplaceType": "$jm.workplaceType",
                "address": "$jm.address",
                "company": "$jm.company",
                "jobCategory": "$jm.jobCategory",
                "skillRequired": "$jm.skillRequired",
                "jobFile": "$jm.jobFile",
                "experienceRequired": "$jm.experienceRequired",
                "jobDescription": "$jm.jobDescription",
                "jobResponsibility": "$jm.jobResponsibility",
                "salaryBudget": "$jm.salaryBudget",
                "qualification": "$jm.qualification",
                "extraBenefit": "$jm.extraBenefit",
                "date": "$jm.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}


// <---------------------------- Startup Api's ------------------------------->

exports.startupList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
        userModel.find({ $and: [{role: 1}, {userStatus: "PENDING"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/startup', { data, moment, profileImage })
            } else if (result.startup === true) {
                res.render('Admin/startup', { data, moment, profileImage })
            } else if (result.startup === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.approveStartup = async function (req, res, next) {
    try {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { userStatus: "APPROVED" } }).then(async data => {
            req.flash('success', 'Company Approved successfully');
            console.log(data);
            res.redirect('/startups')
        })
    } catch (err) {
        console.log(err, 'error')
        res.redirect('/startups')
    }
}

exports.approveStartupList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ $and: [{role: 1}, {userStatus: "APPROVED"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/approveStartups', { data, moment, profileImage })
            } else if (result.approveStartups === true) {
                res.render('Admin/approveStartups', { data, moment, profileImage })
            } else if (result.approveStartups === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteStartup = async function (req, res, next) {
    userModel.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) }).then(async data => {
        const postData = await postModel.deleteMany({ user_id: data._id });
        const projectData = await projectModel.deleteMany({ user_id: data._id });
        const jobData = await jobModel.deleteMany({ user_id: data._id });
        req.flash('error', 'Startup company deleted Successfully');
        res.redirect('/approveStartupList')
    }).catch(err => {
        console.log(err, 'error in deleting Startup company')
        res.redirect('/approveStartupList')
    })
}

exports.getStartupDetail = async function (req, res, next) {
    var data = await userModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "js": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "experiences",
                localField: "js.experience_id",
                foreignField: "_id",
                as: "ex"
            }
        },
        {
            "$unwind": {
                "path": "$ex",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "registrationreasons",
                localField: "js.registrationReason_id",
                foreignField: "_id",
                as: "re"
            }
        },
        {
            "$unwind": {
                "path": "$re",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "username": "$js.username",
                "phoneNumber": "$js.phoneNumber",
                "email": "$js.email",
		"summary": "$js.summary",
                "profileImage": "$js.profileImage",
                "address": "$js.address",
                "experience": "$ex.name",
                "registrationReason": "$re.name",
                "date": "$js.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}

exports.updateStartupCompanyStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")
        var status = false;
    }
    userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}


// <------------------------------ Experience Api's ----------------------------->
exports.experiencedCompany = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ $and: [{role: 2}, {userStatus: "PENDING"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'experiencedCompany' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/experiencedCompany', { data, moment, profileImage })
            } else if (result.experiencedCompany === true) {
                res.render('Admin/experiencedCompany', { data, moment, profileImage })
            } else if (result.experiencedCompany === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.approveExperiencedCompany = async function (req, res, next) {
    try {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { userStatus: "APPROVED" } }).then(async data => {
            req.flash('success', 'Company Approved successfully');
            console.log(data);
            res.redirect('/experiencedCompany')
        })
    } catch (err) {
        console.log(err, 'error')
        res.redirect('/experiencedCompany')
    }
}

exports.approveExperiencedCompanyList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    userModel.find({ role: 2 }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/approveExperiencedCompany', { data, moment, profileImage })
            } else if (result.approveExperiencedCompany === true) {
                res.render('Admin/approveExperiencedCompany', { data, moment, profileImage })
            } else if (result.approveExperiencedCompany === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteExperiencedCompany = async function (req, res, next) {
    userModel.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) }).then(async data => {
        const postData = await postModel.deleteMany({ user_id: data._id });
        const projectData = await projectModel.deleteMany({ user_id: data._id });
        const jobData = await jobModel.deleteMany({ user_id: data._id });
        req.flash('error', 'Experienced company deleted Successfully');
        res.redirect('/approveExperiencedCompanyList')
    }).catch(err => {
        console.log(err, 'error in deleting Experienced company')
        res.redirect('/approveExperiencedCompanyList')
    })
}

exports.getExperiencedCompanyDetail = async function (req, res, next) {
    var data = await userModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "js": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "experiences",
                localField: "js.experience_id",
                foreignField: "_id",
                as: "ex"
            }
        },
        {
            "$unwind": {
                "path": "$ex",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "registrationreasons",
                localField: "js.registrationReason_id",
                foreignField: "_id",
                as: "re"
            }
        },
        {
            "$unwind": {
                "path": "$re",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "username": "$js.username",
                "phoneNumber": "$js.phoneNumber",
                "email": "$js.email",
                "profileImage": "$js.profileImage",
                "address": "$js.address",
                "experience": "$ex.name",
                "registrationReason": "$re.name",
                "date": "$js.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}

exports.updateExperiencedCompanyStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")

        var status = false;

    }

    userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}

// <-------------------------- Banker Api's ---------------------------------------->

exports.banker = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ role: 3 }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'banker' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/banker', { data, moment, profileImage })
            } else if (result.banker === true) {
                res.render('Admin/banker', { data, moment, profileImage })
            } else if (result.banker === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.approveBanker = async function (req, res, next) {
    try {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { userStatus: "APPROVED" } }).then(async data => {
            req.flash('success', 'Company Approved successfully');
            console.log(data);
            res.redirect('/banker')
        })
    } catch (err) {
        console.log(err, 'error')
        res.redirect('/banker')
    }
}

exports.approveBankerList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ $and: [{role: 3}, {userStatus: "APPROVED"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/approveBanker', { data, moment, profileImage })
            } else if (result.approveBanker === true) {
                res.render('Admin/approveBanker', { data, moment, profileImage })
            } else if (result.approveBanker === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteBanker = async function (req, res, next) {
    userModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Banker deleted Successfully');
        res.redirect('/approveBankerList')
    }).catch(err => {
        console.log(err, 'error in deleting Banker')
        res.redirect('/approveBankerList')
    })
}

exports.getBankerDetail = async function (req, res, next) {
    var data = await userModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "js": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "experiences",
                localField: "js.experience_id",
                foreignField: "_id",
                as: "ex"
            }
        },
        {
            "$unwind": {
                "path": "$ex",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "registrationreasons",
                localField: "js.registrationReason_id",
                foreignField: "_id",
                as: "re"
            }
        },
        {
            "$unwind": {
                "path": "$re",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "username": "$js.username",
                "phoneNumber": "$js.phoneNumber",
                "email": "$js.email",
                "profileImage": "$js.profileImage",
                "address": "$js.address",
                "experience": "$ex.name",
                "registrationReason": "$re.name",
                "date": "$js.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}

exports.updateBankerStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")

        var status = false;

    }

    userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}


// <-------------------------- Investor Api's ---------------------------------------->

exports.approveInvestorList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ $and: [{role: 7}, {userStatus: "APPROVED"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'investors' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/investor', { data, moment, profileImage })
            } else if (result.investor === true) {
                res.render('Admin/investor', { data, moment, profileImage })
            } else if (result.investor === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteInvestor = async function (req, res, next) {
    userModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Investor deleted Successfully');
        res.redirect('/approveInvestorList')
    }).catch(err => {
        console.log(err, 'error in deleting investor')
        res.redirect('/approveInvestorList')
    })
}

exports.getInvestorDetail = async function (req, res, next) {
    var data = await userModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "js": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "investors",
                localField: "js.investor_id",
                foreignField: "_id",
                as: "ex"
            }
        },
        {
            "$unwind": {
                "path": "$ex",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "registrationreasons",
                localField: "js.registrationReason_id",
                foreignField: "_id",
                as: "re"
            }
        },
        {
            "$unwind": {
                "path": "$re",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "username": "$js.username",
                "phoneNumber": "$js.phoneNumber",
                "email": "$js.email",
                "profileImage": "$js.profileImage",
                "address": "$js.address",
                "experience": "$ex.name",
                "registrationReason": "$re.name",
                "date": "$js.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}

exports.updateInvestorStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")

        var status = false;

    }

    userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}


// <------------------------------------- Job Seeker Api's ---------------------------------->

exports.jobSeeker = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({role: 4}).exec().then(data => {
        res.locals = { title: 'jobSeeker' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/jobSeeker', { data, moment, profileImage })
            } else if (result.jobSeeker === true) {
                res.render('Admin/jobSeeker', { data, moment, profileImage })
            } else if (result.jobSeeker === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.approveJobSeeker = async function (req, res, next) {
    try {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { userStatus: "APPROVED" } }).then(async data => {
            req.flash('success', 'Company Approved successfully');
            console.log(data);
            res.redirect('/jobSeeker')
        })
    } catch (err) {
        console.log(err, 'error')
        res.redirect('/jobSeeker')
    }
}

exports.approveJobSeekerList = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    	userModel.find({ $and: [{role: 4}, {userStatus: "APPROVED"}] }).sort({ createdAt: -1 }).exec().then(data => {
        res.locals = { title: 'startups' };
        // var profileImage = req.user.profileImage;
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/jobSeeker', { data, moment, profileImage })
            } else if (result.jobSeeker === true) {
                res.render('Admin/jobSeeker', { data, moment, profileImage })
            } else if (result.jobSeeker === false) {
                res.render('Admin/404', {profileImage});
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.deleteJobSeeker = async function (req, res, next) {
    userModel.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) }).then(async data => {
        const postData = await postModel.deleteMany({ user_id: data._id });
        req.flash('error', 'Job Seeker deleted Successfully');
        res.redirect('/jobSeeker')
    }).catch(err => {
        console.log(err, 'error in deleting job seeker')
        res.redirect('/jobSeeker')
    })
}

exports.getJobSeekerDetail = async function (req, res, next) {
    var data = await userModel.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.query._id) }
        },
        {
            "$project": {
                "js": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "experiences",
                localField: "js.experience_id",
                foreignField: "_id",
                as: "ex"
            }
        },
        {
            "$unwind": {
                "path": "$ex",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "registrationreasons",
                localField: "js.registrationReason_id",
                foreignField: "_id",
                as: "re"
            }
        },
        {
            "$unwind": {
                "path": "$re",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "username": "$js.username",
                "phoneNumber": "$js.phoneNumber",
                "email": "$js.email",
                "profileImage": "$js.profileImage",
                "address": "$js.address",
                "experiences": "$ex.name",
                "registrationReason": "$re.name",
                "date": "$js.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    if (data) {
        var json = {
            data: data[0],
        }
        res.send(json)
    }
    else {
        res.send(data[0])
    }
}

exports.updateJobSeekerStatus = function (req, res, next) {
    console.log(req.query.id, req.params.status, 'line no...476')
    var url = req.params.url;
    if (req.params.status == 1) {
        console.log("true")
        var status = true;
    }
    else {
        console.log("false")

        var status = false;

    }

    userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { $set: { status } }, { new: true }, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Updated Docs : ", docs);
            res.redirect(`/${url}`)

        }
    })
}

function getUserDetails(roleId, callback) {
    var user = {};
    role.find({ user_id: mongoose.Types.ObjectId(roleId) }).exec(function (err, roles) {
        if (err) { return next(err); }
        callback(roles[0]);
    });
}