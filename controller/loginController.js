var user = require('../models/userModel');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

var SALT_FACTOR = 10;

const experience = require('../models/experienceModel');
const reasonModel = require('../models/reasonForRegistration');
const businessType = require('../models/businessTypeModel');

function comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        console.log("user model line no 69 isMatch", isMatch)
        callback(null, isMatch);
    });
};

exports.register = async function (req, res, next) {
    const query = { $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] }
    console.log(query, 'line no......10')
    const document = await user.findOne(query);
    
    if (!req.body.email && !req.body.phoneNumber) {
        return res.status(200).json({ 'status': 0, 'msg': "email & mobileNumber not define" });
    }
    else if (document != null && (document.email == req.body.email)) {
        return res.status(200).json({ 'status': 0, 'msg': "email already exists" });
    }
    else if (document != null && (document.phoneNumber == req.body.phoneNumber)) {
        return res.status(200).json({ 'status': 0, 'msg': "Mobile number already exists" });
    }
    else {
        let userVariable = {
            "username": req.body.username,
            "password": bcrypt.hashSync(req.body.password),
            "email": req.body.email,
            "phoneNumber": req.body.phoneNumber,
            "businessName": req.body.businessName,
            "address": req.body.address,
            "experience_id": mongoose.Types.ObjectId(req.body.experience_id),
            "registrationReason_id": mongoose.Types.ObjectId(req.body.registrationReason_id),
            "businessType_id": mongoose.Types.ObjectId(req.body.businessType_id),
	        "date": new Date().toISOString().slice(0, 10)

        }

        if (userVariable.businessType_id == "624d8d4dfac5886159a6e575") {
            userVariable.role = 1
        } if (userVariable.businessType_id == "624d8d58fac5886159a6e577") {
            userVariable.role = 2
        } if (userVariable.businessType_id == "624d8d66fac5886159a6e579") {
            userVariable.role = 3
        } if (userVariable.businessType_id == "624e7444f6d5261961066664") {
            userVariable.role = 4
        }if (userVariable.businessType_id == "62bc102f15adf84ebf39cde2") {
            userVariable.role = 7
        }
        
        console.log(userVariable, "Register User Data");

        new user(userVariable).save().then(function (doc) {

            if (doc.length > 0) {

                res.status(200).json({ 'status': 1, 'msg': 'registration successfull', 'data': doc })
            }
            else {
                console.log(doc);
                res.status(200).json({ 'status': 1, 'msg': 'registration successfull', 'data': doc })
            }
        }).catch(err =>
            console.error(err)
        )
    }
}

exports.login = async function (req, res, next) {
    const query = { $or: [{ email: req.body.username }, { phoneNumber: req.body.username }] }
    user.findOne(query, (error, result) => {
        if (error) {
            return res.status(400).json({ 'status': 0, 'msg': "Internal server error.", 'data': error });
        } else if (!result) {
            return res.status(200).json({ 'status': 0, 'msg': " Incorrect email or mobile no.", 'data': null });
        } else {
            // var password = bcrypt.hashSync(req.body.password);

            if (bcrypt.compareSync(req.body.password, result.password)) {
                console.log(result.password)
                var token = jwt.sign({ _id: result._id, email: result.email }, 'testing', { expiresIn: '20d' });
                var data = {
                    token: token,
                    _id: result._id,
                    "email": result.email,
                    "phoneNumber": result.phoneNumber,
                    "role": result.role,
                    "username": result.username,
                }
                console.log("line no-26------------", data)
                return res.status(200).json({ 'status': 1, 'msg': "login successfully.", 'data': data });

            } else {
                return res.status(200).json({ 'status': 0, 'msg': "Credentials are wrong.", 'data': null });
            }
        }
    })
}

exports.addExperience = function (req, res) {
    var postData = {
        name: req.body.name,
    }
    new experience(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Experience Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addRegistrationReason = function (req, res) {
    var postData = {
        name: req.body.name,
    }
    new reasonModel(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Registration Reason Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.addBusinessType = function (req, res) {
    var postData = {
        name: req.body.name,
    }
    new businessType(postData).save().then(data => {
        res.status(200).json({ 'status': 1, 'msg': 'Business Type Added Successfully', 'data': data });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': null });
    });
}

exports.registrationList = async (req, res) => {
    const businessTypeData = await businessType.find({ }).exec();

    const registrationReasonData = await reasonModel.find({ });

    const experienceData = await experience.find({ });
    var Data = {
        businessTypeData: businessTypeData,
        registrationReasonData: registrationReasonData,
        experienceData: experienceData,
    }
    return res.status(200).json({ 'status': 1, 'msg': "Detail fetched successfully.", 'data': Data });
}

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

// Send OTP API
exports.sendOtp = function (req, res) {
    var username = req.body.user
    if (isNaN(username)) {
        var search = { email: username };
        var type = "email";
    } else {
        var search = { phoneNumber: username };
        var type = "mobile";
    }
    user.find(search)
        .exec(function (err, userData) {
            console.log(userData)
            if (err) {
                res.status(500).send({ 'status': 0, 'msg': 'Something want worng', 'data': null });
            } else {
                if (userData.length > 0) {
                    // console.log(getOtp(), "get Otp")
                    let otp = generateOTP();
                    if (type == "email") {
                        var upddata = {
                            'otp': otp,
                            'username': userData[0].email,
                        }
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'maxtratechnologies.test@gmail.com',
                                pass: 'Maxtra@123'
                            }
                        });
                        var mailOptions = {
                            from: 'SBCC maxtratechnologies.test@gmail.com',
                            to: username,
                            subject: 'Forgot Password OTP',
                            text: 'Your one time password is: ' + otp
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("Error is:" + error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.status(200).json({ 'status': 1, 'msg': 'successfully sent OTP', 'data': { otp } });
                    }
                    if (type == "mobile") {
                        res.status(200).json({ 'status': 1, 'msg': 'successfully sent OTP', 'data': { otp } });
                    }

                } else {
                    res.status(200).json({ 'status': 1, 'msg': 'user not exist', 'data': null });
                }
            }
        })
}

exports.changePassword = (req, res) => {
    let email = req.body.username
    console.log(email, 'line no......209')
    user.find({ email: email }).find(function (error, data) {
        console.log(data.length, 'line no......116');
        if (error) {
            res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': [] });
        }
        if (data.length > 0) {
            let oldPassword = req.body.oldPassword;
            if (oldPassword) {
                comparePassword(req.body.oldPassword, data[0].password, function (error, isMatch) {
                    console.log(isMatch, 'line no............250')
                    if (isMatch) {
                        bcrypt.genSalt(SALT_FACTOR, function (error, salt) {
                            if (error) {
                                return res.status(400).json({ 'status': 0, 'msg': "Something Went wrong.", 'data': error });
                            }
                            bcrypt.hash(req.body.password, salt, function (error, hashedPassword) {

                                if (error) {
                                    return res.status(400).json({ 'status': 0, 'msg': "Something Went Wrong.", 'data': error });
                                }
                                let password = hashedPassword;
                                var Variables = {
                                    password: password,
                                };

                                user.update({ _id: mongoose.Types.ObjectId(data[0]._id) }, Variables, function (error, raw) {
                                    if (error) {
                                        res.status(400).json({ 'status': 1, 'msg': 'something went wrong', 'data': [] });
                                    }
                                    else {
                                        res.status(200).json({ 'status': 1, 'msg': 'Password Changed successfully', 'data': data });
                                    }
                                })
                            });
                        });
                    } else {
                        res.status(200).json({ 'status': 0, 'msg': 'incorrect old_password ', 'data': [] });
                    }
                })
            } else {
                res.status(200).json({ 'status': 0, 'msg': 'Please Enter The Previous Password ', 'data': [] });
            }
        } else {
            res.status(200).json({ 'status': 0, 'msg': 'not exist ', 'data': [] });
        }
    })
}

exports.forgotpassword = function (req, res, next) {
    let username = req.body.username;
    if (isNaN(username)) {
        var search = { email: username, status: true };
    } else {
        var search = { phoneNumber: username, status: true };
    }
    user.find(search)
        .exec(function (err, userData) {
            if (err) {
                res.status(500).send({ 'status': 0, 'msg': 'Something want worng', 'data': [] });
            } else {
                //console.log(userData);
                var Variables = {
                    password: req.body.password,
                };
                bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                    if (err) {
                        res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': [] });
                    }
                    bcrypt.hash(req.body.password, salt, function (err, hashedPassword) {
                        if (err) {
                            res.status(400).json({ 'status': 0, 'msg': 'something went wrong', 'data': [] });
                        }
                        user.password = hashedPassword;
                        console.log(user.password)
                        var Variables = {
                            password: user.password,
                        };
                        console.log(Variables)
                        user.update({ _id: mongoose.Types.ObjectId(userData[0]._id) }, Variables, function (err, raw) {
                            res.status(200).json({ 'status': 1, 'msg': 'Password Change Successfully', 'data': userData[0] });
                        })
                    });
                });
            }
        })
};