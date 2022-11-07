const mongoose = require('mongoose');
const user = require('../../models/userModel');
// const post = require('../models/postModel')
// const category = require('../models/categoryModel')
const role = require('../../models/role');
const session_str = require('node-sessionstorage')

exports.dashboard = async function (req, res, next) {
	let profileImage = session_str.getItem('profileImage')
    var startups = await user.count({ role: 1 }).exec();
    var experiencedCompanies = await user.count({ role: 2 }).exec();
    var jobSeekers = await user.count({ role: 4 }).exec();
    var bankers = await user.count({ role: 3 }).exec();
    var investors = await user.count({ role: 7 }).exec();

    console.log(session_str.getItem('session_id'), 'line no........1.4')
    console.log(session_str.getItem('role_id'), 'line no........1.5')

    getUserDetails(session_str.getItem('session_id'), function (result) {
        console.log(result, 'line no.......17')
        if (session_str.getItem('role_id') === "5") {
            res.render('Dashboard/dashboard', { startups, experiencedCompanies, jobSeekers, bankers, investors, profileImage })
        } else if (result.dashboard === true) {
            res.render('Dashboard/dashboard', { startups, experiencedCompanies, jobSeekers, bankers, investors, profileImage })
        } else if (result.dashboard === false) {
            res.render('Admin/404');
        }
    });
}

function getUserDetails(roleId, callback) {
    var user = {};
    role.find({ user_id: mongoose.Types.ObjectId(roleId) }).exec(function (err, roles) {
        if (err) { return next(err); }
        callback(roles[0]);
    });
}
