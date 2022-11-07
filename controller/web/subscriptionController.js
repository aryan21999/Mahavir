const mongoose = require('mongoose');
const session_str = require('node-sessionstorage')
const moment = require('moment');

const user = require('../../models/userModel');
const subscription = require('../../models/subscriptionPlan')
const roles = require('../../models/role')

exports.addSubscription = async function (req, res, next) {
    var userVariable = {
        subscription_name: req.body.subscription_name,
        validity: req.body.validity,
        charge: req.body.charge,
        description: req.body.description
    }
    new subscription(userVariable).save().then(data => {
        req.flash('success', 'subscription plan added succesfully')
        res.redirect('/subscription_list')
    }).catch(err => {
        console.log(err)
        req.flash('error', 'something went wrong')

        res.redirect('/subscription_list')
    })

}

exports.subscription_list = async function (req, res, next) {
    subscription.find({}).sort({ createdAt: -1 }).exec().then(data => {
        console.log(data, '++++++++++++++++')
        res.locals = { title: 'Subscription Plan' };
        var profileImage = session_str.getItem('profileImage');
        getUserDetails(session_str.getItem('session_id'), function (result) {
            console.log(result)
            if (session_str.getItem('role_id') === "5") {
                res.render('Admin/subscription', { data, moment, profileImage })
            } else if (result.subscriptionPlan === true) {
                res.render('Admin/subscription', { data, moment, profileImage })
            } else if (result.subscriptionPlan === false) {
                res.render('Admin/permission_error', { profileImage });
            }
        });
    }).catch(err => {
        console.log(err, 'error')
        res.send(500);
    })
}

exports.editPlan = async function (req, res, next) {
    console.log(userVariable, 'line no........56')
    var userVariable = {
        subscription_name: req.body.subscription_name,
        validity: req.body.validity,
        charge: req.body.charge,
        description: req.body.description
    }
    var data = await subscription.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: userVariable })
    req.flash('success', 'Plan edited Sucessfully')
    res.redirect('/subscription_list')
    // console.log(userVariable, 'line no...............56 postController');
}

exports.getPlanDetail = function (req, res, next) {
    subscription.find({ _id: mongoose.Types.ObjectId(req.query._id) }).exec((err, data) => {
        console.log(req.query._id, 'line no.........122')
        console.log(data, 'line no.........122')
        if (data) {
            subscription.find({ _id: mongoose.Types.ObjectId(data[0]._id) }).exec((err) => {
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

exports.deletePlan = async function (req, res, next) {
    subscription.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(data => {
        req.flash('error', 'Plan Deleted Successfully')
        res.redirect('/subscription_list')
    }).catch(err => {
        console.log(err, 'error in deletePlan')
        res.redirect('/subscription_list')

    })
}

exports.planDetail = async function (req, res, next) {
    subscription.find({ _id: mongoose.Types.ObjectId(req.body.id) }).exec().then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
}

function getUserDetails(roleId, callback) {
    var user = {};
    roles.find({ user_id: mongoose.Types.ObjectId(roleId) })
        .exec(function (err, roles) {
            if (err) { return next(err); }
            callback(roles[0]);
        });
}