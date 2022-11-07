var user = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const role = require('../../models/role');
const Roles = require('../../models/role');
const mongoose = require('mongoose')
const session_str = require('node-sessionstorage')
const SALT_FACTOR = 10;


exports.login = async function (req, res, next) {
    if (session_str.setItem('session_id')) {
        // req.flash('success', 'Login Succesfuly');
        res.redirect('/');
    } else {
        // req.flash('error', 'Invalid Credential');
        res.render('Auth/login');
    }
}

//Edit-Profile Api

exports.profile = async function (req, res, next) {
    try {
        var profileImage = session_str.getItem('profileImage')
        let getUser = await user.find({ _id: session_str.getItem('session_id') }).exec();
        res.locals = { title: 'Profile' };
        res.render('Admin/profile', { getUser: getUser, profileImage });
    } catch (err) {
        res.send(err, 500)
    }
}

exports.editProfile = async function (req, res, next) {
    console.log(req.body, req.file, 'editProfile');
    var profileImage = session_str.getItem('profileImage');
    var userVariable = {};
    if (req.file == ' ' || req.file == null) {
        userVariable = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.number,
            password: req.body.password
        }
    }
    else {
        userVariable = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.number,
            password: req.body.password,
            profileImage: req.file.filename
        }
    }
    var editUserData = await user.update({ _id: session_str.getItem('session_id') }, userVariable)

    var getUser = await user.find({ _id: session_str.getItem('session_id') }).exec();
    if (editUserData.length > 0) {
        console.log(editUserData, 'fdsdsdfdsf');
        res.locals = { title: 'Profile' };
        req.flash('success', 'Profile Edited Successfully')
        res.redirect('/profile');
    }
    else {
        console.log(editUserData, 'dksdklsfdlkdslkdslkdlskldkflsdkkl')
        res.locals = { title: 'Profile' };
        req.flash('success', 'Profile Edited Successfully')
        res.redirect('/profile');
    }
}

function comparePassword(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        console.log("user model line no 69 isMatch", isMatch)
        callback(null, isMatch);
    });
};

//Change Password Api

exports.changePasswordPage = function (req, res, next) {
    var profileImage = session_str.getItem('profileImage');
    res.locals = { title: 'change Password' };
    res.render('Admin/changePassword', { profileImage });
}

exports.changePassword = async function (req, res, next) {
    console.log(session_str.getItem('email'), 'line no. 211')
    user.find({ email: session_str.getItem('email') }).exec().then(data => {
        if (data.length > 0) {
            if (req.body.old_password) {
                comparePassword(req.body.old_password, data[0].password, function (err, isMatch) {
                    console.log(isMatch, 'line no........218')
                    if (isMatch) {
                        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                            if (err) {
                                console.log(err);
                                return done(err);
                            }
                            bcrypt.hash(req.body.pwd1, salt, function (err, hashedPassword) {
                                if (err) {
                                    return done(err);
                                }

                                user.password = hashedPassword;
                                var Variables = {
                                    password: user.password,
                                };
                                console.log(Variables, hashedPassword, req.body.pwd1, salt, 'line no.......231');
                                user.update({ _id: mongoose.Types.ObjectId(session_str.getItem('session_id')) }, Variables, function (err, raw) {
                                    req.flash('success', 'Password Change Successfully');
                                    res.render('Auth/login');
                                })
                            });
                        });
                    }
                    else {
                        res.locals = { title: 'change Password' };
                        res.render('Auth/login');
                    }
                })
            }
            else {
                bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    bcrypt.hash(req.body.pwd1, salt, noop, function (err, hashedPassword) {
                        if (err) { return done(err); }

                        let password = hashedPassword;
                        var Variables = {
                            password: password,
                        };
                        user.update({ _id: mongoose.Types.ObjectId(session_str.getItem('session_id')) }, Variables, function (err, raw) {
                            if (err) {
                                console.log(err)
                                res.locals = { title: 'login' };
                                res.render('Auth/login');
                            }
                            else {
                                res.locals = { title: 'login' };
                                res.render('Auth/login');
                            }
                        })
                    });
                });
            }
        }
    })
}

exports.subadminList = async function (req, res, next) {
    var profileImage = session_str.getItem('profileImage');
    var subadminUserList = await user.find({ role: 6 }).exec();
    res.locals = { title: 'Subadmin' };

    getUserDetails(session_str.getItem('session_id'), function (result) {
        console.log(result)
        if (session_str.getItem('role_id') === "5") {
            res.render('Admin/subadmin', { getUser: subadminUserList, profileImage });
        } else if (result.subAdmin === true) {
            res.render('Admin/subadmin', { getUser: subadminUserList, profileImage });
        } else if (result.subAdmin === false) {
            res.render('Admin/permission_error', { profileImage });
        }
    });
}


exports.addSubadmin = async function (req, res, next) {
    console.log('line no.79****************')
    console.log(req.body.username)
    var json = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: 6
    }
    if (req.file) {
        json.profileImage = req.file.filename
    }
    console.log(json, 'dssdsdsdf')

    user.count({ "$or": [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] }).exec().then(data => {
        console.log(data, 'count ++++++')

        if (data < 1) {
            let addSubadmin = new user(json);
            console.log(addSubadmin)
            addSubadmin.save().then(async function (data) {
                console.log(data, 'here******************');
                try {
                    let subadminData = await new role({ user_id: mongoose.Types.ObjectId(data._id), updatedby: mongoose.Types.ObjectId(session_str.getItem('session_id')) }).save()
                    console.log(subadminData, 'subadminData')
                    req.flash('success', 'subadmin added successfully');
                    res.redirect('/subadmin')
                }
                catch (err) {
                    req.flash('error', 'added new subadmin');

                    console.log(err, 'error is here added subadmin');
                    res.redirect('/subadmin')
                }
            }).catch(err => {
                req.flash('error', err);

                res.redirect('/subadmin')
            });
        }
        else {
            req.flash('error', 'email or number already registered ');

            res.redirect('/subadmin')
        }
    }).catch(err => {
        req.flash('error', 'something went wrong');

        console.log(err, 'error is here added subadmin');
        res.redirect('/subadmin')
    })
}



exports.editSubadminDetail = async function (req, res, next) {
    console.log(req.query.id)
    let editDetails = await user.find({ _id: mongoose.Types.ObjectId(req.query.id) }).exec()
    res.send({ editDetails: editDetails[0] })
}

exports.deleteSubadmin = function (req, res, next) {
    role.deleteOne({ user_id: mongoose.Types.ObjectId(req.params.id) }).exec().then(data => {
        user.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).exec().then(user => {
            req.flash('success', 'deleted Subadmin');
            res.redirect('/subadmin')
        }).catch(err => {
            req.flash('error', 'something went wrong');
            res.redirect('/subadmin')
        })
    }).catch(err => {
        req.flash('error', 'something went wrong');
        res.redirect('/subadmin')

    })

}

exports.saveEditSubadmin = async function (req, res, next) {
    var profileImage = session_str.getItem('profileImage');

    if (req.file == " " || req.file == undefined) {
        var json = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.number,
        }
    }
    else {
        var json = {
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.number,
            profileImage: req.file.filename,
        }
    }

    user.updateOne({ _id: mongoose.Types.ObjectId(req.body.editId) }, { $set: json }).then(async function (data) {
        req.flash('success', 'updated subadmin');
        res.redirect('/subadmin')
    }).catch(err => {
        req.flash('error', 'updated subadmin');
        res.redirect('/subadmin')
    })
}

exports.permissionUser = async function (req, res, next) {
    var module = req.query.module;
    // console.log(req.query.module, 'line no.......211' )
    var input = {
        updatedby: session_str.getItem('session_id'),
    };
    // console.log(session_str.getItem('session_id'), 'line no......215')
    input[module] = req.query.value;
    var options = {
        new: true,
        upsert: true,
    };
    console.log(req.query.value, 'line no.......222')
    Roles.updateOne({ user_id: mongoose.Types.ObjectId(req.query.user_id) }, input, options).then(function (docs) {
        res.status(200).json({
            collections: docs
        });
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.assignRole = async function (req, res, next) {
    res.locals = { title: 'permission' };
    var profileImage = session_str.getItem('profileImage');
    var usersList = await user.find({ _id: mongoose.Types.ObjectId(req.params.id) }).exec();
    var userRoleDetail = await role.find({ user_id: usersList[0]._id }).exec();
    console.log(userRoleDetail, 'line no........242')
    res.render('Admin/permission', { usersList, userRoleDetail, profileImage });
}

function getUserDetails(roleId, callback) {
    var user = {};
    role.find({ user_id: mongoose.Types.ObjectId(roleId) }).exec(function (err, roles) {
        if (err) { return next(err); }
        callback(roles[0]);
    });
}
