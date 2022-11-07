const url = {
    base_url: 'http://182.76.237.248:8080/upload'
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const projectModel = require('../models/projectModel');
const jobModel = require('../models/jobModel')
const jobType = require('../models/jobTypeModel')
const workPlace = require('../models/workType')
const jobCategory = require('../models/jobCategory')
const skill = require('../models/skillModel')
const experience = require('../models/jobExperience')
const salaryBudgetModel = require('../models/salaryBudget')
const qualification = require('../models/qualification')
const extraBenefit = require('../models/extraBenefits')
const notification = require('../models/notification');
const contactUsModel = require('../models/contactUs')
const aboutUsModel = require('../models/aboutUs')
const likeModel = require('../models/likeModel');
const commentModel = require('../models/commentModel');
const generalBusinessInformationModel = require('../models/generalBusinessInformation');
const paymentOptionsModel = require('../models/paymentOptions')
const saveJobModel = require('../models/saveJob');
const appliedJob = require('../models/appliedJob');
const comparePostModel = require('../models/comparepost');
const subscriptionDataModel = require('../models/subscription');
const subscriptionPlanModel = require('../models/subscriptionPlan')


var today = new Date();

exports.testFcm = async function (req, res) {
    var data = {
        title: req.body.title,
        message: req.body.message,
        device_type: req.body.device_type
    }
    console.log(data)
    const result = await send_fcm(data);
    res.send({ 'status': 'true', msg: " successfully done", data: result })
    console.log(result, "line no 2292");
}

async function send_fcm(data) {
    var FCM = require('fcm-node');

    // subterra Server Key
    var serverKey = 'AAAAh0HSCZY:APA91bF1ctrIeeNN_Mor5Vr6JhkBzqxixaOXEh-WHXRptutGgfkym4F1j0ITO3zBvBf_4cO5xK9afZYRHxE6sbLLg29DRflPdtNa7DeWyS-zvPOFQoWYemEKgdxvnDbVaBDYg9b1mj7M'
    var fcm = new FCM(serverKey);

    var sound = "";
    if (data.device_type == "ios" || data.device_type == 'web') {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: data.device_token,

            notification: {  //you can send only notification or only data(or include both)
                title: data.title,
                body: data.message,
            }
        }
    } else {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: data.device_token,
            data: {  //you can send only notification or only data(or include both)
                title: data.title,
                message: data.message,
            }
        }
    }

    fcm.send(message, function (err, response) {
        console.log(message, "Data Line no. 2335");
        if (err) {
            console.log("fcm error", err)
            return true;
        } else {
            new fcmModel(data).save((saveErr, saveRes) => {

                if (saveErr) {
                    console.log(saveErr, "saveErr");
                    // return res.send({ responseCode: 500, responseMessage: "Internal server error.", responseResult: saveErr });
                }
                else {
                    console.log(saveRes, "saveRes");
                    // return res.send({ responseCode: 200, responseMessage: "Notification save successfully!", responseResult: saveRes });
                }
            })
            console.log("success", response)
            return true;
        }
    });
}

exports.fcmList = function (req, res, next) {

    fcmModel.find({ userId: mongoose.Types.ObjectId(req.body.user_id) }).exec().then(data => {
        console.log(data, "data");
        if (data) {
            res.status(200).json({ 'status': 'success', 'msg': 'Fcm notification list', 'data': data });
        }
        else {
            res.status(200).json({ 'status': 'error', 'msg': 'No data available', 'data': [] });
        }
    })
}

exports.addContactUs = function (req, res) {    
    var contactData = {
        email: req.body.email,
        number: req.body.number
    }
    
    new contactUsModel(contactData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Add Post Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.contactUs = (req, res) => {
    contactUsModel.find({}).exec(function (err, data){
        if (err) {
            res.status(500).json({ 'status': 0, 'msg': 'Something went wrong', 'data': []})
        } else {
            res.status(200).json({ 'status': 1, 'msg': 'ContactUs Data found successfully', 'data': data})
        }
    })
}

exports.aboutUs = (req, res) => {
    aboutUsModel.find({}).exec(function (err, data){
        if (err) {
            res.status(500).json({ 'status': 0, 'msg': 'Something went wrong', 'data': []})
        } else {
            res.status(200).json({ 'status': 1, 'msg': 'AboutUs Data found successfully', 'data': data})
        }
    })
}

exports.addAboutUs = function (req, res) {
    var aboutData = {
        title: req.body.title,
        description: req.body.description
    }
    new aboutUsModel(aboutData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Add Post Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addNotification = function (req, res) {
    var notificationData = {
        title: req.body.title,
        description: req.body.description,
        date: new Date().toISOString().slice(0, 10),
        time: today.getHours() + ":" + today.getMinutes(),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
    }
    new notification(notificationData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Add Notification Successfully', 'data': data });
    }).catch((error) => {
        res.status(200).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.notificationList = (req, res) => {
    notification.find({}).exec(function (err, data) {
        if (err) {
            console.log("Line no 455", err);
            res.status(500).json({ 'status': 0, 'msg': 'something went wrong ', 'data': [] });
        }
        else {
            res.status(200).json({ 'status': 1, 'msg': 'Notification list fetched successfully', 'data': data });
        }
    })
}

exports.notification = async (req, res) => {
    var userVariable = {
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        type: req.body.type,
    }
    if (type == 1) {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.user_id) }, { $set: { notificationStatus: "1" } }).then(data => {
            res.status(200).json({ 'status': 1, 'meg': 'Notification Off Successfully', 'data': data });
        });
    } else if (type == 2) {
        userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.user_id) }, { $set: { notificationStatus: "0" } }).then(data => {
            res.status(200).json({ 'status': 1, 'meg': 'Notification On Successfully', 'data': data });
        });
    }
}

// API for viewUserContent
exports.userDetail = async (req, res) => {
    const profileData = await userModel.findById({ _id: mongoose.Types.ObjectId(req.body.user_id) });
    profileData.profileImage = `${url.base_url}/${profileData.profileImage}`;
    if (profileData) {
        console.log(profileData, 'line no...................27')
        return res.status(200).json({ 'status': 1, 'msg': "User Detail Found successfully.", 'data': profileData });
    }
}

// Edit Profile API
exports.editProfile = async function (req, res, next) {
    console.log(req.body, req.file, 'editProfile');

    var userVariable = {};
    if (req.file == ' ' || req.file == null) {
        userVariable = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            businessName: req.body.businessName,
            address: req.body.address,
            summary: req.body.summary,
            experience_id: mongoose.Types.ObjectId(req.body.experience_id),
        }
        if (req.body.address) {
            userVariable.address = req.body.address
        }
    }
    else {
        userVariable = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            profileImage: req.file.filename,
            businessName: req.body.businessName,
            address: req.body.address,
            summary: req.body.summary,
            experience_id: mongoose.Types.ObjectId(req.body.experience_id),
        }
        // if (req.body.profileImage) {
        //     userVariable.profileImage = req.body.profileImage
        // }
        if (req.body.profileImage != undefined) {
            userVariable.profileImage = req.files.profileImage[0].filename;
        }
    }
    console.log(userVariable, 'line no...............72')
    var getUser = await userModel.find({ _id: mongoose.Types.ObjectId(req.body._id) }).exec();
    console.log(getUser, "getUser data line no.....47")
    if (getUser.length > 0) {
        console.log(req.body._id, "getUer._id")
        var editUserData = await userModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, userVariable, { new: true });

        // To Make Edit Profile Image Base_url
        editUserData.profileImage = `${url.base_url}/${editUserData.profileImage}`;

        console.log(editUserData, "editUSerData")
        res.status(200).json({ 'status': 1, 'msg': 'Profile Edited Successfully', 'data': editUserData });
    }
    else {
        return res.status(200).json({ 'status': 0, 'msg': "User data not found", 'data': null });
    }
}

exports.postList = async function (req, res) {
    const postData = await postModel.find({postReport: true}).exec();
    postData.postImage = `${url.base_url}/${postData.postImage}`;
    if (postData) {
        return res.status(200).json({ 'status': 1, 'msg': "Post List Found successfully.", 'data': postData });
    }
}

exports.postDetail = async (req, res) => {
    const postData = await postModel.findById({ _id: mongoose.Types.ObjectId(req.body.post_id) });
    postData.postImage = `${url.base_url}/${postData.postImage}`;
    return res.status(200).json({ 'status': 1, 'msg': "User Detail Found successfully.", 'data': postData });
}

exports.projectList = async (req, res) => {
var data = await projectModel.aggregate([
        // {
        //     "$match": { post_id: mongoose.Types.ObjectId(req.body.post_id) }
        // },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.user_id",
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
            "_id": "$pm._id",
            "title": "$pm.title",
            "summary": "$pm.summary",
            "category": "$pm.category",
            "description": "$pm.description",
            "document": "$pm.document",
            "skills": "$pm.skills",
            "status": "$pm.status",
            "postCategory": "$pm.postCategory",
            "projectStatus": "$pm.projectStatus",
            "date": "$pm.date",
            "currency_id": "$pm.currency_id",
            "price": "$pm.price_id",
            "user_id": "$pm.user_id",
            "username":"$us.username",
	    "businessName":"$us.businessName",
            "profileImage":"$us.profileImage",
            }
        }
    ])
    console.log(data, 'data of comment')
    projectData = data.map(async obj => {
        // const projectDetail = await projectModel.find({_id: obj.project_id}).exec();
        // const userDetail = await userModel.find({_id: jobDetail[0].user_id}).exec();
        // console.log(userDetail[0], 'userDetail..')
        // obj.profileImage = userDetail[0].profileImage
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalProjectList = await Promise.all(projectData);
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalProjectList });
}

//exports.projectDetail = async (req, res) => {
    //const projectData = await projectModel.findById({ _id: mongoose.Types.ObjectId(req.body.project_id) });
    //projectData.document = `${url.base_url}/${projectData.document}`;
   // return res.status(200).json({ 'status': 1, 'msg': "Project Detail Found successfully.", 'data': projectData });
//}

exports.projectDetail = async (req, res) => {
    var data = await projectModel.aggregate([
        {
            "$match": {  _id: mongoose.Types.ObjectId(req.body.project_id) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.user_id",
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
                "_id": "$pm._id",
                "title": "$pm.title",
                "summary": "$pm.summary",
                "category": "$pm.category",
                "description": "$pm.description",
                "document": "$pm.document",
                "skills": "$pm.skills",
                "status": "$pm.status",
                "postCategory": "$pm.postCategory",
                "projectStatus": "$pm.projectStatus",
                "date": "$pm.date",
                "currency_id": "$pm.currency_id",
                "price_id": "$pm.price_id",
                "user_id": "$pm.user_id",
                "businessName":"$us.businessName",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    jobData = data.map(async obj => {
        console.log(obj, 'lin ne no..........46')
        if (obj.document) {
            obj.document = `${url.base_url}/${obj.document}`;
        }
        else {
            obj.document = '';
        }
        return obj;
    })
    let finalJobList = await Promise.all(jobData);
    return res.send({ 'status': 1, 'msg': "Job list fetched successfully.", 'data': finalJobList });
}


exports.jobList = async (req, res) => {
    var user_id = req.body._id
    var data = await jobModel.aggregate([
        {
            "$match": { status: true }
        },
        {
            "$project": {
                "jb": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "jb.createdBy",
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
                "_id": "$jb._id",
                "title": "$jb.title",
                "company": "$jb.company",
                "address": "$jb.address",
                "experienceRequired": "$jb.experienceRequired",
                "salaryBudget": "$jb.salaryBudget",
                "skillRequired": "$jb.skillRequired",
                "profileImage": "$us.profileImage",
                "createdBy": "$jb.createdBy",
                "date": "$jb.date",
                "jobStatus": "$jb.jobStatus",
                "jobApplicationStatus": "$jb.jobApplicationStatus",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    var post_list = []
    jobData = data.map(async obj => {
        const post_lists = await saveJobModel.find({ 'userId': req.body.user_id, 'jobId': obj._id });
        const job_lists = await appliedJob.find({ 'userId': req.body.user_id, 'jobId': obj._id });
        console.log(post_lists.length, 'post_lists data')
        console.log(post_lists.length, 'post_lists data')
        if (post_lists.length > 0) {
            obj.jobApplicationStatus = "1"
        } else if(job_lists.length > 0) {
            obj.jobStatus = "1"
        }
        post_list.push(obj)
        return post_list;
    })
    console.log(post_list, 'post_list')
    let finalJobList = await Promise.all(jobData);
    //     console.log(obj, 'lin ne no..........46')
    //     if (obj.profileImage) {
    //         obj.profileImage = `${url.base_url}/${obj.profileImage}`;
    //     }
    //     else {
    //         obj.profileImage = '';
    //     }
    //     return obj;
    // })
    // let finalJobList = await Promise.all(jobData);
    return res.send({ 'status': 1, 'msg': "Job list fetched successfully.", 'data': finalJobList[finalJobList.length -1] });
}

exports.jobDetail = async (req, res) => {
    const jobData = await jobModel.findById({ _id: mongoose.Types.ObjectId(req.body.job_id) });
    jobData.jobFile = `${url.base_url}/${jobData.jobFile}`;
    return res.status(200).json({ 'status': 1, 'msg': "Job Detail Found successfully.", 'data': jobData });
}

exports.likePost = async function (req, res) {
    let userId = req.body.user_id;
    let postId = req.body.post_id;
    let status = req.body.status;
    var likeData = {
        "userId": userId,
        "postId": postId,
        "status": status
    }
    // console.log(likeData, 'line no.......331'); return false;
    if (status == "1") {
        new likeModel(likeData).save().then(async data => {
            res.status(200).json({ 'status': 1, 'msg': 'Post Liked', 'data': data });
        });
    } else {
        likeModel.deleteOne({ $set: [{ 'userId': userId }, { 'postId': postId }] }).then(async data => {
            res.status(200).json({ 'status': 1, 'msg': 'Post Unliked', 'data': null });
        });
    }
}

// Subterra Map Shop List Example -----------> 
 
exports.likePostData = async function (req, res) {
    var user_id = req.body.id
    const postData = await postModel.find({});
    // console.log(user_id, 'line no........334');return false;
    var post_list = []
    if (postData.length > 0) {
        console.log(user_id, 'line INN')
        pamars = postData.map(async (obj) => {
            // console.log(obj, 'line no////338');return false;
            const post_lists = await likeModel.find({ 'userId': user_id, 'postId': obj._id }).count();
            // console.log(pamars, 'line no......335')
            if (post_lists > 0) {
                obj.likeStatus = "1"
            }
            return post_list;
        })
        let likePostData = await Promise.all(pamars);
        console.log(postData);
    }
}

exports.postedJob = async function (req, res) {
    var data = await jobModel.aggregate([
        {
            "$match": { 'createdBy': mongoose.Types.ObjectId(req.body.createdBy)}
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "jobs",
                localField: "pm.job_id",
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
            "$project": {
                "jobFile": "$pm.jobFile",
                "title": "$pm.title",
                "company": "$pm.company",
                "jobType": "$pm.jobType",
                "workplaceType": "$pm.workplaceType",
                "address": "$pm.address",
                "jobCategory": "$pm.jobCategory",
                "skillRequired": "$pm.skillRequired",
                "experienceRequired": "$pm.experienceRequired",
                "jobDescription": "$pm.jobDescription",
                "jobResponsibility": "$pm.jobResponsibility",
                "salaryBudget": "$pm.salaryBudget",
                "qualification": "$pm.qualification",
                "extraBenefit": "$pm.extraBenefit",
                "status": "$pm.status",
                "date": "$pm.date",
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
        return obj;
    })
    let finalPostList = await Promise.all(saveJobData);
    console.log(finalPostList, 'line no.....')
    return res.send({ 'status': 1, 'msg': "Save Job List Found successfully.", 'data': finalPostList });
}

exports.commentPost = async function (req, res) {
    var commentData = {
        comment: req.body.comment,
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        post_id: mongoose.Types.ObjectId(req.body.post_id),
    }
    // console.log(commentData);return false;
    new commentModel(commentData).save().then(async data => {
        if(data){
            console.log(data, 'line no,.... data')
            var userData = await commentModel.aggregate([
                {
                    "$match": { _id: data._id }
                },
                {
                    "$project": {
                        "pm": "$$ROOT"
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "pm.post_id",
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
                        localField: "pm.user_id",
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
                        "comment": "$pm.comment",
                        // "company": "$jb.company",
                        "profileImage": "$us.profileImage",
                        "username": "$us.username",
                        "date": "$jb.date",
                    }
                }
            ])
            console.log(userData, 'data of comment')
            commentData = userData.map(async obj => {
                // const jobDetail = await jobModel.find({_id: obj.jobId}).exec();
                // const userDetail = await userModel.find({_id: jobDetail[0].user_id}).exec();
                // console.log(userDetail[0], 'userDetail..')
                // obj.profileImage = userDetail[0].profileImage
                if (obj.profileImage) {
                    obj.profileImage = `${url.base_url}/${obj.profileImage}`;
                }
                else {
                    obj.profileImage = '';
                }
                return obj;
            })
            let finalCommentList = await Promise.all(commentData);
            res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalCommentList });
        }
        })
}

exports.commentList = async function (req, res) {
    var data = await commentModel.aggregate([
        {
            "$match": { post_id: mongoose.Types.ObjectId(req.body.post_id) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "pm.post_id",
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
                localField: "pm.user_id",
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
                "comment": "$pm.comment",
                // "company": "$jb.company",
                "profileImage": "$us.profileImage",
                "username": "$us.username",
                "date": "$jb.date",
            }
        }
    ])
    console.log(data, 'data of comment')
    commentData = data.map(async obj => {
        // const jobDetail = await jobModel.find({_id: obj.jobId}).exec();
        // const userDetail = await userModel.find({_id: jobDetail[0].user_id}).exec();
        // console.log(userDetail[0], 'userDetail..')
        // obj.profileImage = userDetail[0].profileImage
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalCommentList = await Promise.all(commentData);
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': finalCommentList });
}

exports.planList = async function (req, res) {

    var data = await subscriptionPlanModel.aggregate([
        // {
        //     "$match": { 'user_id': mongoose.Types.ObjectId(req.body.user_id) }
        // },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
        "$project": {
            "status": "$pm.status",
            "_id": "$pm._id",
            "subscription_name": "$pm.subscription_name",
            "validity": "$pm.validity",
            "charge": "$pm.charge",
            "description": "$pm.description",
            "createdAt": "$pm.createdAt",
            "updatedAt": "$pm.updatedAt",
            "__v": "$pm.__v"
            }
        }
    ])
    var plan_list = [];
    sub_data = data.map(async obj => {
        console.log(obj, 'lin ne no..........46');
	const plan_lists = await subscriptionDataModel.find({ 'userId': req.body.user_id, 'subscription_id': obj._id });

        if (plan_lists.length > 0) {
            console.log('INNNNNNN')
            obj.status = "1" 
        }
        plan_list.push(obj)
        return plan_list;
    })
    let finalPostList = await Promise.all(sub_data);
    console.log(finalPostList,'finalPostList');
    res.status(200).json({ 'status': 1, 'message': 'Post Detail fetch successfully', 'data': finalPostList[finalPostList.length - 1] });
}

exports.searchJob = async (req, res) => {
   
    var job = req.body.input 
    var data = await jobModel.aggregate([
        {
            "$match": { $or: [
                { "title":  { $regex: new RegExp("^" + job.toLowerCase(), "i") }  },
                { "company": { $regex: new RegExp("^" + job.toLowerCase(), "i") } },
                { "jobCategory": { $regex: new RegExp("^" + job.toLowerCase(), "i") } },
                { "jobType": { $regex: new RegExp("^" + job.toLowerCase(), "i") } },
                { "salaryBudget": { $regex: new RegExp("^" + job.toLowerCase(), "i") } },
                { "address": { $regex: new RegExp("^" + job.toLowerCase(), "i") } },
            ]}
        },
        {
            "$project": {
                "jb": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "jb.user_id",
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
                "company": "$jb.company",
                "address": "$jb.address",
                "experienceRequired": "$jb.experienceRequired",
                "salaryBudget": "$jb.salaryBudget",
                "skillRequired": "$jb.skillRequired",
                "jobCategory": "$jb.jobCategory",
                "profileImage": "$us.profileImage",
                "date": "$jb.date",
            }
        }
    ])
    console.log(data, 'lin ne no..........464')
    jobData = data.map(async obj => {
        console.log(obj, 'lin ne no..........46')
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        return obj;
    })
    let finalJobList = await Promise.all(jobData);
    return res.send({ 'status': 1, 'msg': "Job list fetched successfully.", 'data': finalJobList });
}


//exports.companies = async function (req, res) {
   // userModel.find({ $or: [{ "role": "2" }, { "role": "1" }] }).exec(function (err, data) {
       // if (err) {
         //   console.log("Line no 455", err);
          //  res.status(500).json({ 'status': 0, 'msg': 'something went wrong ', 'data': [] });
        //}
       // else {
       //     res.status(200).json({ 'status': 1, 'msg': 'Company list fetched successfully', 'data': data });
      //  }
   // })
//}

exports.companies = async function (req, res) {
    var type = req.body.type;
    if (type == '1'){
        const counts = await userModel.aggregate([
            {
                $match: {$or: [{ "role": "2" }, { "role": "1" }]}
            },
            {
                "$project": {
                    "pm": "$$ROOT"
                }
            },
            {
                $limit: 1
            },
            {
                "$project": {
                "status": "$pm.status",
                "_id": "$pm._id",
                "username": "$pm.username",
                "phoneNumber": "$pm.phoneNumber",
                "email": "$pm.email",
                "profileImage": "$pm.profileImage",
                "password": "$pm.password",
                "address": "$pm.address",
                "role": "$pm.role",
                "businessName": "$pm.businessName",
                "summary": "$pm.summary",
                "businessType_id": "$pm.businessType_id",
                "experience_id": "$pm.experience_id",
                "registrationReason_id": "$pm.registrationReason_id",
                "userStatus": "$pm.userStatus",
                "deviceId": "$pm.deviceId",
                "deviceModelName": "$pm.deviceModelName",
                "deviceType": "$pm.deviceType",
                "deviceTokenFcm": "$pm.deviceTokenFcm",
                "createdAt": "$pm.createdAt",
                "updatedAt": "$pm.updatedAt",
                "__v": "$pm.__v"
            }
        }
        ])

        res.status(200).json({ 'status': 1, 'msg': 'Company list fetched successfully', 'data': counts });

    } else if(type == '2'){
        const counts = await userModel.aggregate([
            {
                $match: {$or: [{ "role": "2" }, { "role": "1" }]}
            },
            {
                "$project": {
                    "pm": "$$ROOT"
                }
            },
            {
                "$project": {
                "status": "$pm.status",
                "_id": "$pm._id",
                "username": "$pm.username",
                "phoneNumber": "$pm.phoneNumber",
                "email": "$pm.email",
                "profileImage": "$pm.profileImage",
                "password": "$pm.password",
                "address": "$pm.address",
                "role": "$pm.role",
                "businessName": "$pm.businessName",
                "summary": "$pm.summary",
                "businessType_id": "$pm.businessType_id",
                "experience_id": "$pm.experience_id",
                "registrationReason_id": "$pm.registrationReason_id",
                "userStatus": "$pm.userStatus",
                "deviceId": "$pm.deviceId",
                "deviceModelName": "$pm.deviceModelName",
                "deviceType": "$pm.deviceType",
                "deviceTokenFcm": "$pm.deviceTokenFcm",
                "createdAt": "$pm.createdAt",
                "updatedAt": "$pm.updatedAt",
                "__v": "$pm.__v"
            }
        }
        ])
        res.status(200).json({ 'status': 1, 'msg': 'Company list fetched successfully', 'data': counts });
    }
}

exports.addPostToCompare = async function (req, res) {
    var postData = {
        post_id: mongoose.Types.ObjectId(req.body.post_id),
        user_id: mongoose.Types.ObjectId(req.body.user_id),
	postedBy: mongoose.Types.ObjectId(req.body.postedBy),
        status: "1",
        date: new Date().toISOString().slice(0, 10),
    }
    const post = await comparePostModel.find({ post_id: postData.post_id }).then(data => {
        console.log(data, 'data of post');
        console.log(data.length, 'data of post');
        if (data.length > 0) {
            res.status(400).json({ 'status': 1, 'message': 'Post Already Exists', 'data': [] });
        } else {
            new comparePostModel(postData).save().then(data => {
                res.status(200).json({ 'status': 1, 'message': 'Post Added Successfully', 'data': data });
            })
        }
    })
}

exports.removePost = async function (req, res) {
let userVariable = {
    user_id: mongoose.Types.ObjectId(req.body.user_id),
    post_id: mongoose.Types.ObjectId(req.body.post_id),
}
    const postData = await comparePostModel.findOneAndDelete({$and: [{post_id: userVariable.post_id}, {user_id: userVariable.user_id}] }).then( data => {

        if(data) {
            res.status(200).json({ 'status': 1, 'message': 'Post Removed Successfully', 'data': data });
        } else {
            res.status(200).json({ 'status': 0, 'message': 'Post Already Removed', 'data': [] });
        }
    }) 
}

exports.comparePost = async (req, res) => {
    var data = await comparePostModel.aggregate([
        {
            "$match": { 'user_id': mongoose.Types.ObjectId(req.body.user_id) }
        },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.postedBy",
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
                from: "posts",
                localField: "pm.post_id",
                foreignField: "_id",
                as: "ps"
            }
        },
        {
            "$unwind": {
                "path": "$ps",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "_id": "$pm._id",
                "user_id": "$pm.user_id",
                "post_id": "$pm.post_id",
		"username": "$us.username",
		"profileImage": "$us.profileImage",
		"postImage": "$ps.postImage",
		"description": "$ps.description",
		"like": "$ps.like",
		"likeStatus": "$ps.likeStatus",
		"comment": "$ps.comment",
		"compareStatus": "$ps.compareStatus",
		"date": "$ps.date",
		"postCategory": "$ps.postCategory",
            }
        }
    ])
    var post_list = [];
    postData = data.map(async obj => {
        console.log(obj, 'lin ne no..........46');

	const likeData = await likeModel.find({ postId: obj.post_id }).count();
        const commentData = await commentModel.find({ post_id: obj.post_id }).count();
	const post_lists = await likeModel.find({ 'userId': req.body.user_id, 'postId': obj.post_id });
	const post_compare = await comparePostModel.find({ 'user_id': req.body.user_id, 'post_id': obj.post_id });

        obj.like = likeData,
        obj.comment = commentData

        if (post_lists.length > 0) {
            console.log('INNNNNNN')
            obj.likeStatus = "1"
        }

        if (post_compare.length > 0) {
            console.log('INNNNNNN')
            obj.compareStatus = "1" 
        }

        if (obj.postImage) {
            obj.postImage = `${url.base_url}/${obj.postImage}`;
        }
        else {
            obj.postImage = '';
        }
	if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        post_list.push(obj)
        return post_list;
    })
    let finalPostList = await Promise.all(postData);
    console.log(finalPostList,'finalPostList');
    res.status(200).json({ 'status': 1, 'message': 'Post Detail fetch successfully', 'data': finalPostList[finalPostList.length - 1] });
};

exports.dashboard = async (req, res) => {
    var data = await postModel.aggregate([
        // {
        //     "$match": { $and: [{ 'user_id': mongoose.Types.ObjectId(req.body.user_id) }, { status: '2' }] }
        // },
        {
            "$project": {
                "pm": "$$ROOT"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "pm.user_id",
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
            "$project": {
                "_id": "$pm._id",
                "description": "$pm.description",
                "postImage": "$pm.postImage",
                "postStatus": "$pm.postStatus",
                "status": "$pm.status",
                // "like": "$pm.like",
                "likeStatus": "$pm.likeStatus",
		"compareStatus": "$pm.compareStatus",
                // "comment": "$pm.comment",
                "date": "$pm.date",
                "user_id": "$pm.user_id",
                "username": "$ui.username",
                "profileImage": "$ui.profileImage",
                "role": "$ui.role",
                "createdAt": "$pm.createdAt",
                "updatedAt": "$pm.updatedAt",
                "__v": "$pm.__v"
            }
        }
    ])
    var post_list = []
    postData = data.map(async obj => {
        console.log(obj, 'lin ne no..........46')
        const likeData = await likeModel.find({ postId: obj._id }).count();
        // console.log(likeData,"line no 90");return false;
        const commentData = await commentModel.find({ post_id: obj._id }).count();

        const post_lists = await likeModel.find({ 'userId': req.body.user_id, 'postId': obj._id });

	const post_compare = await comparePostModel.find({ 'user_id': req.body.user_id, 'post_id': obj._id });

        console.log(post_lists.length, 'post_lists data')
        if (post_lists.length > 0) {
            console.log('INNNNNNN')
            obj.likeStatus = "1"
        }
        if (post_compare.length > 0) {
            console.log('INNNNNNN')
            obj.compareStatus = "1"
        }
        obj.like = likeData,
            obj.comment = commentData
        if (obj.postImage) {
            obj.postImage = `${url.base_url}/${obj.postImage}`;
        }
        else {
            obj.postImage = '';
        }
        if (obj.profileImage) {
            obj.profileImage = `${url.base_url}/${obj.profileImage}`;
        }
        else {
            obj.profileImage = '';
        }
        post_list.push(obj)
        return post_list;
    })
    let finalPostList = await Promise.all(postData);
    const story = await userModel.find({ $or: [{ "role": "2" }, { "role": "1" }] });
    for (i = 0; i < story.length; i++) {
        story[i].profileImage = `${url.base_url}/${story[i].profileImage}`;
    }

    const projectData = await projectModel.find({});
    for (i = 0; i < projectData.length; i++) {
        projectData[i].document = `${url.base_url}/${projectData[i].document}`;
    }

    const jobData = await jobModel.find({});
    for (i = 0; i < jobData.length; i++) {
        jobData[i].jobFile = `${url.base_url}/${jobData[i].jobFile}`;
    }

    console.log(story.profileImage, 'line no.....144')
    var Data = {
        story: story,
        finalPostList: finalPostList[finalPostList.length - 1].reverse(),
        projectData: projectData.reverse(),
        jobData: jobData.reverse(),
    }
    // console.log(Data, 'line no results');return false;
    res.status(200).json({ 'status': 1, 'msg': 'Post Detail fetch successfully', 'data': Data });
}

exports.generalBusinessInformation = function(req, res) {

    generalBusinessInformationModel.find({}).exec().then(data => {
        console.log(data, "data");
        if (data) {
            res.status(200).json({ 'status': 'success', 'msg': 'General Business Information', 'data': data });
        }
        else {
            res.status(200).json({ 'status': 'error', 'msg': 'No data available', 'data': [] });
        }
    })
}

exports.paymentOptions = function (req, res) {
    // var Data = {
    //     option1: req.body.option1,
    //     option2: req.body.option2,
    //     option3: req.body.option3,    
    // }
    
    // new paymentOptionsModel(Data).save().then(data => {
    //     res.status(200).json({ 'status': 1, 'msg': 'Add Successfully', 'data': data });
    // }).catch((error) => {
    //     console.log(error);
    //     res.status(500).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    // });
    paymentOptionsModel.find({}).exec().then(data => {
        console.log(data, "data");
        if (data) {
            res.status(200).json({ 'status': 'success', 'msg': 'Payment Options', 'data': data });
        }
        else {
            res.status(200).json({ 'status': 'error', 'msg': 'No data available', 'data': [] });
        }
    })
}

exports.buyPlanDetail = (req, res, next) => {
    try {
        var userVariable = {
            amount: req.body.amount,
            user_id: mongoose.Types.ObjectId(req.body.user_id),
            subscription_id: mongoose.Types.ObjectId(req.body.subscription_id),
            date: new Date().toISOString().slice(0, 10)

        }
        console.log(req.body, 'line no..........856')
        // console.log(userVariable, 'line no.......857');return false;
        new subscriptionDataModel(userVariable).save().then(async data => {
	if(userVariable){
                const userStatus = await userModel.findOneAndUpdate({ _id: userVariable.user_id }, { $set: { subscriptionStatus: "SUBSCRIBED", subscribe: "1" } }).exec();
                res.status(200).json({ 'status': '1', 'msg': 'Payment done Successfully!', 'data': data });
            } else {
                subscriptionDataModel.find({ user_id: userVariable.user_id }).then(async userData => {
                    console.log(userData.length)
                    if (userData.length > 0) {
                        res.status(200).json({ 'status': '1', 'msg': 'Already Subscribe!', 'data': data });
                    } else {
                        res.status(200).json({ 'status': '1', 'msg': 'Already Subscribe!', 'data': data });
                    }
                });
            }
        })
    } catch (error) {
        res.status(200).json({ 'status': '0', 'msg': 'something went wrong ', 'data': [] });
    }
}