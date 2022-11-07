const url = {
    base_url: 'http://182.76.237.248:8080/upload'
};

const mongoose = require('mongoose')

const post = require('../models/postModel')
const priceModel = require('../models/priceModel')
const currencyModel = require('../models/currencyModel')
const projectModel = require('../models/projectModel')
const jobModel = require('../models/jobModel')
const jobType = require('../models/jobTypeModel')
const workPlace = require('../models/workType')
const jobCategory = require('../models/jobCategory')
const skillModel = require('../models/skillModel')
const experience = require('../models/jobExperience')
const salaryBudgetModel = require('../models/salaryBudget')
const qualification = require('../models/qualification')
const extraBenefit = require('../models/extraBenefits')
const appliedJobModel = require('../models/appliedJob')
const saveJobModel = require('../models/saveJob')
const userModel = require('../models/userModel')


exports.addPost = function (req, res) {
    var postData = {
        description: req.body.description,
        postImage: req.file.filename,
        postCategory: "1",
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        date: new Date().toISOString().slice(0, 10),
    }
    if (req.body.postImage != undefined) {
        postData.postImage = req.files.postImage[0].filename;
    }
    console.log(postData);
    new post(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Post Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addPrice = function (req, res) {
    var postData = {
        name: req.body.name,
    }
    console.log(postData);
    new priceModel(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Price Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addCurrency = function (req, res) {
    var postData = {
        name: req.body.name,
    }
    console.log(postData);
    new currencyModel(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Currency Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addProject = function (req, res) {
    var projectData = {
        title: req.body.title,
        summary: req.body.summary,
        category: req.body.category,
        skills: req.body.skills,
        description: req.body.description,
        document: req.file.filename,
        price_id: req.body.price_id,
        currency_id: req.body.currency_id,
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        date: new Date().toISOString().slice(0, 10),
        status: "1",
    }
    if (req.body.document != undefined) {
        postData.document = req.files.document[0].filename;
    }
    console.log(projectData, 'proect Data of ')
    new projectModel(projectData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Project Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.projectDetail = async (req, res) => {
    const projectData = await projectModel.findById({ _id: mongoose.Types.ObjectId(req.body.post_id) });
    projectData.document = `${url.base_url}/${projectData.document}`;
    return res.status(200).json({ 'status': 1, 'msg': "User Detail Found successfully.", 'data': projectData });
}

exports.addJob = function (req, res) {
    var jobData = {
        title: req.body.title,
        jobType: req.body.jobType,
        workplaceType: req.body.workplaceType,
        address: req.body.address,
        company: req.body.company,
        jobCategory: req.body.jobCategory,
        skillRequired: req.body.skillRequired,
        experienceRequired: req.body.experienceRequired,
        jobDescription: req.body.jobDescription,
        jobResponsibility: req.body.jobResponsibility,
        salaryBudget: req.body.salaryBudget,
        qualification: req.body.qualification,
        extraBenefit: req.body.extraBenefit,
        jobFile: req.file.filename,
        createdBy: mongoose.Types.ObjectId(req.body.createdBy),
        date: new Date().toISOString().slice(0, 10),
        status: "1",
    }
    if (req.body.jobFile != undefined) {
        jobData.jobFile = req.files.jobFile[0].filename;
    }
    new jobModel(jobData).save().then(data => {
        console.log(data, 'Posted Job Data')
        res.status(200).json({ 'status': 1, 'msg': 'Job Posted Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.saveJob = function (req, res) {
    var jobData = {
        userId: mongoose.Types.ObjectId(req.body.userId),
        jobId: mongoose.Types.ObjectId(req.body.jobId),
        createdBy: mongoose.Types.ObjectId(req.body.createdBy),
        saveJobStatus: 1,
        date: new Date().toISOString().slice(0, 10),
    }
    new saveJobModel(jobData).save().then(async data => {
        var jobModelData = await jobModel.findByIdAndUpdate({ _id: data.jobId }, { $set: { jobStatus: "1" } });
        res.status(200).json({ 'status': 1, 'msg': 'Job Saved Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.saveJobList = async function (req, res) {
    var data = await saveJobModel.aggregate([
        {
            "$match": { $and: [ {'userId': mongoose.Types.ObjectId(req.body.userId)}, {'saveJobStatus': "1"} ] }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "pm.jobId",
                foreignField: "_id",
                as: "ui"
            }
        },
        {
            "$unwind": {
                "path": "$ui",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.createdBy",
                foreignField: "_id",
                as: "cb"
            }
        },
        {
            "$unwind": {
                "path": "$cb",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "jobFile": "$ui.jobFile",
                "title": "$ui.title",
                "company": "$ui.company",
                "saveJobStatus": "$pm.saveJobStatus",
                "date": "$pm.date",
                "profileImage": "$cb.profileImage",
            }
        }
    ])
    console.log(data , 'line no     179')
    saveJobData = data.map(async obj => {
        if (obj.jobFile) {
            obj.jobFile = `${url.base_url}/${obj.jobFile}`;
        }
        else {
            obj.jobFile = '';
        }
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalPostList = await Promise.all(saveJobData);
    console.log(finalPostList, 'line no.....')
    return res.send({ 'status': 1, 'msg': "Save Job List Found successfully.", 'data': finalPostList });
}

exports.editJob = async function (req, res) {
    try {
        var jobData = {};
        var jobData = {
            title: req.body.title,
            jobType: req.body.jobType,
            workplaceType: req.body.workplaceType,
            address: req.body.address,
            company: req.body.company,
            jobCategory: req.body.jobCategory,
            skillRequired: req.body.skillRequired,
            experienceRequired: req.body.experienceRequired,
            jobDescription: req.body.jobDescription,
            jobResponsibility: req.body.jobResponsibility,
            salaryBudget: req.body.salaryBudget,
            qualification: req.body.qualification,
            extraBenefit: req.body.extraBenefit,
            jobFile: req.file.filename,
            user_id: mongoose.Types.ObjectId(req.body.user_id),
            date: new Date().toISOString().slice(0, 10),
            status: "1",
        }
        if (req.body.jobFile != undefined) {
            jobData.jobFile = req.files.jobFile[0].filename;
        }
        var jobDetail = await jobModel.find({ _id: mongoose.Types.ObjectId(req.body._id) }).exec();
        if (jobDetail.length > 0) {
            var editJobData = await jobModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, jobData, { new: true });
            res.status(200).json({ status: 'success', msg: 'Job edited Successfully', data: editJobData });
        }
        else {
            return res.send({ responseCode: 404, msg: "Job data not found", data: [] });
        }
    } catch (error) {
        return res.status(500).json({ status: "error", msg: 'Something Went Wrong', data: null });
    }
}

exports.jobDataList = async (req, res) => {
    const jobTypeData = await jobType.find({ }).exec();
    const workPlaceData = await workPlace.find({ }).exec();
    const JobCatData = await jobCategory.find({ }).exec();
    const skillData = await skillModel.find({ }).exec();
    const experienceData = await experience.find({ }).exec();
    const salaryBudgetData = await salaryBudgetModel.find({ }).exec();
    const qualificationData = await qualification.find({ }).exec();
    const extraBenefitData = await extraBenefit.find({ }).exec();

    var Data = {
        jobTypeData: jobTypeData,
        workPlaceData: workPlaceData,
        workPlaceData: workPlaceData,
        JobCatData: JobCatData,
        skillData: skillData,
        experienceData: experienceData,
        salaryBudgetData: salaryBudgetData,
        qualificationData: qualificationData,
        extraBenefitData: extraBenefitData,
    }
    return res.status(200).json({ 'status': 1, 'msg': "Detail fetched successfully.", 'data': Data });
}

exports.projectData = async (req, res) => {
    const skillsData = await skillModel.find({ }).exec();
    const currencyData = await currencyModel.find({ }).exec();

    var Data = {
        currencyData: currencyData,
        skillsData: skillsData,
    }
    return res.status(200).json({ 'status': 1, 'msg': "Detail fetched successfully.", 'data': Data });
}

exports.projectCategoryList = async (req, res) => {
    const projectCatData = await jobCategory.find({ }).exec();

    var Data = {
        projectCatData: projectCatData,
    }
    return res.status(200).json({ 'status': 1, 'msg': "Detail fetched successfully.", 'data': Data });
}

exports.applyJob = async function (req, res) {
    let userId = req.body.user_id;
    let jobId = req.body.job_id;
    let createdBy = req.body.createdBy;
    let status = 1;
    var jobData = {
        "userId": userId,
        "jobId": jobId,
        "createdBy": createdBy,
        "status": status
    }
    // console.log(jobData, 'line no.......331'); return false;
    if (status == "1") {
        new appliedJobModel(jobData).save().then(data => {
                var jobModelData = jobModel.findByIdAndUpdate({ _id: data.jobId }, { $set: { jobStatus: "2" } });
            res.status(200).json({ 'status': 1, 'msg': 'Job Applied Successfully', 'data': data });
        });
    } else if (status == "0") {
        appliedJobModel.deleteOne({ $set: [{ 'userId': userId }, { 'jobId': jobId }, , { 'createdBy': createdBy }] }).then(async data => {
            res.status(200).json({ 'status': 1, 'msg': 'Not Applied', 'data': null });
        });
    }
}

exports.appliedJobs = async function (req, res) {
    var data = await appliedJobModel.aggregate([
        {
            "$match": { userId: mongoose.Types.ObjectId(req.body.user_id) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "pm.jobId",
                foreignField: "_id",
                as: "jb"
            }
        },
        {
            "$unwind": {
                "path": "$jb",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.userId",
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
            "$project": {
                "title": "$jb.title",
                "jobId": "$jb._id",
                "company": "$jb.company",
                "user_id": "$us.user_id",
                "profileImage": "$us.profileImage",
                "date": "$pm.date",
            }
        }
    ])
    jobData = data.map(async obj => {
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalJobList = await Promise.all(jobData);
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalJobList });
}

exports.appliedJobUsers = async (req, res) => {
    var data = await appliedJobModel.aggregate([
        {
            "$match": { jobId: mongoose.Types.ObjectId(req.body.job_id) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "pm.jobId",
                foreignField: "_id",
                as: "jb"
            }
        },
        {
            "$unwind": {
                "path": "$jb",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.userId",
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
            "$project": {
                // "title": "$jb.title",
                // "jobId": "$jb._id",
                // "company": "$jb.company",
                // // "profileImage": "$us.profileImage",
                // "date": "$jb.date",
                "status": "$pm.status",
                "userId": "$pm.userId",
                "_id": "$jb._id",
                "title": "$jb.title",
                "username": "$us.username",
                "phoneNumber": "$us.phoneNumber",
                "email": "$us.email",
                "profileImage": "$us.profileImage",
                "address": "$us.address",
                "role": "$us.role",
                "summary": "$jb.summary",
                "businessType_id": "$us.businessType_id",
                "experience_id": "$us.experience_id",
                "registrationReason_id": "$us.registrationReason_id",
                "deviceTokenFcm": "$us.deviceTokenFcm",
            }
        }
    ])
    console.log(data, 'hvfsfvkjhv')
    jobData = data.map(async obj => {
        console.log(obj, 'jdfkjsdbkfbshdbfh')
        const jobDetail = await jobModel.find({_id: obj._id}).exec();
        console.log(jobDetail, 'job detaoil')
        const userDetail = await userModel.find({_id: jobDetail[0].user_id}).exec();
        console.log(userDetail[0], 'userDetail..')
        // for (i = 0; i < jobData.length; i++) {
        //     jobData[i].profileImage = `${url.base_url}/${jobData[i].profileImage}`;
        // }
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalJobList = await Promise.all(jobData);
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalJobList });
}

exports.appliedJobUsersComp = async (req, res) => {
    var data = await appliedJobModel.aggregate([
        {
            "$match": { createdBy: mongoose.Types.ObjectId(req.body.createdBy) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "pm.jobId",
                foreignField: "_id",
                as: "jb"
            }
        },
        {
            "$unwind": {
                "path": "$jb",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.userId",
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
            "$project": {
                "status": "$pm.status",
                "_id": "$jb._id",
                "userId": "$pm.userId",
                "title": "$jb.title",
                "username": "$us.username",
                "phoneNumber": "$us.phoneNumber",
                "email": "$us.email",
                "profileImage": "$us.profileImage",
                "address": "$us.address",
                "role": "$us.role",
                "summary": "$jb.summary",
                "businessType_id": "$us.businessType_id",
                "experience_id": "$us.experience_id",
                "registrationReason_id": "$us.registrationReason_id",
                "deviceTokenFcm": "$us.deviceTokenFcm",
            }
        }
    ])
    console.log(data, 'hvfsfvkjhv')
    jobData = data.map(async obj => {
        console.log(obj, 'jdfkjsdbkfbshdbfh')
        const jobDetail = await jobModel.find({_id: obj._id}).exec();
        console.log(jobDetail, 'job detaoil')
        const userDetail = await userModel.find({_id: jobDetail[0].user_id}).exec();
        console.log(userDetail[0], 'userDetail..')
        // for (i = 0; i < jobData.length; i++) {
        //     jobData[i].profileImage = `${url.base_url}/${jobData[i].profileImage}`;
        // }
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalJobList = await Promise.all(jobData);
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalJobList });
}

exports.addSkill = async function (req, res) {
    let name = req.body.name;
    var skillData = {
        "name": name,
    }
    // console.log(jobData, 'line no.......331'); return false;
        new skillModel(skillData).save().then(data => {
            res.status(200).json({ 'status': 1, 'msg': 'Job Applied Successfully', 'data': data });
        });
}
