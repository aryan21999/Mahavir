const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const multer = require('multer');
const session_str = require('node-sessionstorage')

const users = require('./models/userModel')

const auth = require('./controller/loginController')
const postController = require('./controller/postController')
const appController = require('./controller/appController')


const dashboardController = require('./controller/web/dashboard')
const authController = require('./controller/web/authController')
const dataController = require('./controller/web/dataController')
const jobPostController = require('./controller/web/jobPostController')
const subscriptionController = require('./controller/web/subscriptionController')


router.post('/login', async function (req, res) {

    const query = { $and: [{ $or: [{ "role": "5" }, { "role": "6" }] }, { $or: [{ email: req.body.username }, { phoneNumber: req.body.username }] }] }
    const data = await users.findOne(query);
    console.log(data, 'line no...........38')
    if (data) {
        const validPassword = await bcrypt.compare(req.body.password, data.password, function (err, isMatch) {
        // compare(req.body.password, data.password, function (err, isMatch) {
            console.log(isMatch, 'line no.....42')
                        if (isMatch) {
                session_str.setItem('session_id', data._id)
                session_str.setItem('profileImage', data.profileImage)
                session_str.setItem('username', data.username)
                session_str.setItem('email', data.email)
                session_str.setItem('phoneNumber', data.phoneNumber)
                session_str.setItem('role_id', data.role)
                res.redirect("/dashboard")
            }
            else {
                req.flash("error", "Invalid Credential");
                res.redirect('/login')
                console.log('OUT')
            }
        })
    } else {
        // req.flash("error", "Username is wrong");
        res.redirect("/login")
        console.log('IN')
    }
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
var upload = multer({ storage: storage });

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader, typeof bearerHeader, req.headers)
    if (typeof bearerHeader !== 'undefined') {
        console.log('hsjj')
        const bearer = bearerHeader.split(' ');
        const beareTOKEN = bearer[1];
        jwt.verify(beareTOKEN, 'testing', (err, authData) => {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            }
            else {
                req.auth = authData;
                console.log(req.auth)
                next();
            }
        })
    } else {
        res.sendStatus(403)
    }
}

//****************************************    ADMIN ROUTES   ****************************************** */

function requireLogin(req, res, next) {
    if (session_str.getItem('session_id')) {
        return next();
    } else {
        res.locals = { title: 'pages-blank' };
        req.flash('error', 'Please Login');
        res.redirect('/login');
    }
}


router.get('', authController.login, function (req, res) {
    res.render('Auth/login')
});

router.get('/login', authController.login);

router.get('/dashboard',requireLogin, dashboardController.dashboard);
router.get('/profile', requireLogin, authController.profile)
router.post('/editProfile', requireLogin, upload.single('picture'), authController.editProfile);

router.get('/change_password', requireLogin, authController.changePasswordPage)
router.post('/changePass', requireLogin, authController.changePassword)

router.get('/404', function (req, res) {
    res.render('Admin/404')
});

router.get('/blank', function (req, res) {
    res.render('Admin/blank')
});

// Sub-Admin Api's
router.get('/subadmin', requireLogin, authController.subadminList)
router.post('/saveSubadmin', requireLogin, upload.single('picture'), authController.addSubadmin)
router.get('/editSubadmin', requireLogin, authController.editSubadminDetail);
router.get('/permissionUser', requireLogin, authController.permissionUser);
router.get('/permission:id', requireLogin, authController.assignRole);
router.post('/saveEditSubadmin', requireLogin, upload.single('picture'), authController.saveEditSubadmin);
router.get('/deleteSubadmin:id', requireLogin, authController.deleteSubadmin)

// Jobs Api's
router.get('/jobs', requireLogin, dataController.jobList)
router.get('/getJobDetail', requireLogin, dataController.getJobDetail)
router.get('/delete_job/:id', requireLogin, dataController.deleteJob)
router.get('/updateJobStatus/:url/:status', requireLogin, dataController.updateJobStatus);

// Goverment Project Api's
router.post('/addGovtProject', requireLogin, upload.single('document'), dataController.addGovtProject);
router.get('/govermentProject', requireLogin, dataController.govermentProject);
router.get('/getGovtProjDetail', requireLogin, dataController.getGovtProjDetail);
router.get('/deleteGovtProj/:id', requireLogin, dataController.deleteGovtProj);
router.post('/editGovtProj', requireLogin, upload.single('document'), dataController.editGovtProj);

// Projects Api's
router.get('/projects', requireLogin, dataController.projectList)
// router.get('/approveProject', requireLogin, dataController.approveProject);
// router.get('/approveProjectList', requireLogin, dataController.approveProjectList);
router.get('/getProjectDetail', requireLogin, dataController.getProjectDetail)
router.get('/delete_project/:id', requireLogin, dataController.deleteProject)
router.get('/updateProjectStatus/:url/:status', requireLogin, dataController.updateProjectStatus);

// Posts Api's
router.get('/posts', requireLogin, dataController.postList)
router.get('/getPostDetail', requireLogin, dataController.getPostDetail)
router.get('/delete_post/:id', requireLogin, dataController.deletePost)
router.get('/updatePostStatus/:url/:postReport', requireLogin, dataController.updatePostStatus);

// Job Category Api's
router.post('/addJobCategory', requireLogin, jobPostController.addJobCategory)
router.post('/editJobCategory', requireLogin, jobPostController.editJobCategory)
router.get('/jobCategoryList', requireLogin, jobPostController.category_List)
router.get('/getJobCategoryDetail', requireLogin, jobPostController.getJobCategoryDetail)
router.get('/deleteJobCategory/:id', requireLogin, jobPostController.deleteJobCategory)

// Skill Api's
router.post('/addSkill', requireLogin, jobPostController.addSkill)
router.post('/editSkill', jobPostController.editSkill)
router.get('/skill_List', requireLogin, jobPostController.skill_List)
router.get('/getSkillDetail',  jobPostController.getSkillDetail)
router.get('/deleteSkill/:id', jobPostController.deleteSkill)

// Job Type Api's
router.post('/addJobType', requireLogin, jobPostController.addJobType)
router.post('/editJobType', requireLogin, jobPostController.editJobType)
router.get('/jobTypeList', requireLogin, jobPostController.jobType_List)
router.get('/getJobTypeDetail', requireLogin, jobPostController.getJobTypeDetail)
router.get('/deleteJobType/:id', requireLogin, jobPostController.deleteJobType)

// Work Place Type Api's
router.post('/addWorkType', requireLogin, jobPostController.addWorkPlace)
router.post('/editWorkType', requireLogin, jobPostController.editWorkType)
router.get('/workplaceTypeList', requireLogin, jobPostController.workPlaceType_List)
router.get('/getWorkTypeDetail', requireLogin, jobPostController.getWorkTypeDetail)
router.get('/deleteWorkType/:id', requireLogin, jobPostController.deleteWorkType)

// Experience Api's
router.post('/addExperience', requireLogin, jobPostController.addExperience)
router.post('/editExperience', requireLogin, jobPostController.editExperience)
router.get('/experienceList', requireLogin, jobPostController.experience_List)
router.get('/getExperienceDetail', requireLogin, jobPostController.getExperienceDetail)
router.get('/deleteExperience/:id', requireLogin, jobPostController.deleteExperience)

// Currency Api's
router.post('/addCurrency', requireLogin, jobPostController.addCurrency)
router.post('/editCurrency', requireLogin, jobPostController.editCurrency)
router.get('/currencyList', requireLogin, jobPostController.currencyList)
router.get('/getCurrencyDetail', requireLogin, jobPostController.getCurrencyDetail)
router.get('/deleteCurrency/:id', requireLogin, jobPostController.deleteCurrency)

// Salary Budget Api's
router.post('/addSalaryBudget', requireLogin, jobPostController.addSalaryBudget)
router.post('/editSalaryBudget', requireLogin, jobPostController.editSalaryBudget)
router.get('/salaryBudgetList', requireLogin, jobPostController.salaryBudgetList)
router.get('/getSalaryBudgetDetail', requireLogin, jobPostController.getSalaryBudgetDetail)
router.get('/deleteSalaryBudget/:id', requireLogin, jobPostController.deleteSalaryBudget)

// Qualification Api's
router.post('/addQualification', requireLogin, jobPostController.addQualification)
router.post('/editQualification', requireLogin, jobPostController.editQualification)
router.get('/qualificationList', requireLogin, jobPostController.qualificationList)
router.get('/getQualificationDetail', requireLogin, jobPostController.getQualificationDetail)
router.get('/deleteQualification/:id', requireLogin, jobPostController.deleteQualification)

// Extra Benefits Api's
router.post('/addExtraBenifit', requireLogin, jobPostController.addExtraBenifit)
router.post('/editExtraBenifit', requireLogin, jobPostController.editExtraBenifit)
router.get('/extraBenifitList', requireLogin, jobPostController.extraBenifitList)
router.get('/getExtraBenifitDetail', requireLogin, jobPostController.getExtraBenifitDetail)
router.get('/deleteExtraBenifit/:id', requireLogin, jobPostController.deleteExtraBenifit)

// StartUp Company Api's
router.get('/startups', requireLogin, dataController.startupList);
router.get('/approveStartup', requireLogin, dataController.approveStartup);
router.get('/approveStartupList', requireLogin, dataController.approveStartupList);
router.get('/getStartupDetail', requireLogin, dataController.getStartupDetail)
router.get('/delete_startup/:id', requireLogin, dataController.deleteStartup)
router.get('/updateStartupCompanyStatus/:url/:status', requireLogin, dataController.updateStartupCompanyStatus);

// Experienced Company Api's
router.get('/experiencedCompany', requireLogin, dataController.experiencedCompany);
router.get('/approveExperiencedCompany', requireLogin, dataController.approveExperiencedCompany);
router.get('/approveExperiencedCompanyList', requireLogin, dataController.approveExperiencedCompanyList);
router.get('/getExperiencedCompanyDetail', requireLogin, dataController.getExperiencedCompanyDetail)
router.get('/delete_experiencedCompany/:id', requireLogin, dataController.deleteExperiencedCompany)
router.get('/updateExperiencedCompanyStatus/:url/:status', requireLogin, dataController.updateExperiencedCompanyStatus);

// Job Seeker Api's
router.get('/jobSeeker', requireLogin, dataController.jobSeeker);
router.get('/approveJobSeeker', requireLogin, dataController.approveJobSeeker);
router.get('/approveJobSeekerList', requireLogin, dataController.approveJobSeekerList);
router.get('/getJobSeekerDetail', requireLogin, dataController.getJobSeekerDetail)
router.get('/delete_jobSeeker/:id', requireLogin, dataController.deleteJobSeeker)
router.get('/updateJobSeekerStatus/:url/:status', requireLogin, dataController.updateJobSeekerStatus);

// Banker Api's
router.get('/banker', requireLogin, dataController.banker);
router.get('/approveBanker', requireLogin, dataController.approveBanker);
router.get('/approveBankerList', requireLogin, dataController.approveBankerList);
router.get('/getBankerDetail', requireLogin, dataController.getBankerDetail)
router.get('/delete_banker/:id', requireLogin, dataController.deleteBanker)
router.get('/updateBankerStatus/:url/:status', requireLogin, dataController.updateBankerStatus);

// Investor Api's
router.get('/approveInvestorList', requireLogin, dataController.approveInvestorList);
router.get('/getInvestorDetail', requireLogin, dataController.getInvestorDetail)
router.get('/deleteInvestor/:id', requireLogin, dataController.deleteInvestor)
router.get('/updateInvestorStatus/:url/:status', requireLogin, dataController.updateInvestorStatus);

//Subscription Plan Api's
router.post('/addSubscription', requireLogin, subscriptionController.addSubscription);
router.get('/subscription_list', requireLogin, subscriptionController.subscription_list);
router.get('/delete_subscription/:id', requireLogin, subscriptionController.deletePlan);
router.post('/editPlan', requireLogin, subscriptionController.editPlan);
router.get('/getPlanDetail', requireLogin, subscriptionController.getPlanDetail);
router.get('/planDetail', requireLogin, subscriptionController.planDetail);

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy( function(err) {
            if (err) {
                res.status(400).send('Unable to log out')
                console.log(err, 'hjghgh')
                return next(err);
            } else {
                res.redirect('/login')
            }
        });
    } else {
        res.end()
    }
})


//****************************************    USER ROUTES   ****************************************** */

router.post('/api/register', auth.register);
router.post('/api/registrationList', auth.registrationList);
router.post('/api/login', auth.login);
router.post('/api/userDetail', appController.userDetail);
router.post('/api/edit_profile', upload.single('profileImage'), appController.editProfile);
router.post('/api/change_password', verifyToken, auth.changePassword);
router.post('/api/forgotPassword', auth.forgotpassword);
router.post('/api/sendOtp', auth.sendOtp);

router.post('/api/dashboard', appController.dashboard);

router.post('/api/addExperience', auth.addExperience);

router.get('/api/projectData', postController.projectData)

router.get('/api/projectCategoryList', postController.projectCategoryList)

router.post('/api/addBusinessType', auth.addBusinessType);

router.post('/api/addRegistrationReason', auth.addRegistrationReason);

router.post('/api/addPost', upload.single('postImage'), postController.addPost);
router.post('/api/postDetail', appController.postDetail);
router.post('/api/postList', appController.postList);

router.post('/api/addProject', upload.single('document'), postController.addProject);
router.post('/api/projectDetail', appController.projectDetail);
router.get('/api/projectList', appController.projectList);
router.post('/api/addPrice', postController.addPrice);
router.post('/api/addCurrency', postController.addCurrency);

router.post('/api/addJob',upload.single('jobFile'), postController.addJob);
router.post('/api/saveJob', postController.saveJob);
router.post('/api/saveJobList', postController.saveJobList);
router.post('/api/editJob',upload.single('jobFile'), postController.editJob);
router.post('/api/jobDataList', postController.jobDataList);
router.post('/api/jobDetail', appController.jobDetail);
router.post('/api/jobList', appController.jobList);
router.post('/api/postedJob', appController.postedJob);

router.post('/api/applyJob', postController.applyJob);
router.post('/api/appliedJobs', postController.appliedJobs);
router.post('/api/appliedJobUsers', postController.appliedJobUsers);
router.post('/api/appliedJobUsersComp', postController.appliedJobUsersComp);

router.post('/api/planList', appController.planList);

router.post('/api/likePost', appController.likePost);
router.post('/api/likePostData', appController.likePostData);
router.post('/api/commentPost', appController.commentPost);
router.post('/api/commentList', appController.commentList);

router.post('/api/addAboutUs', appController.addAboutUs);
router.get('/api/aboutUs', appController.aboutUs);

router.post('/api/addContactUs', appController.addContactUs);
router.get('/api/contactUs', appController.contactUs);

router.post('/api/addNotification', appController.addNotification)
router.post('/api/notificationList', appController.notificationList)
router.post('/api/notification', appController.notification)


router.post('/api/fcmList', appController.fcmList);

router.post('/api/searchJob', appController.searchJob)

router.post('/api/companies', appController.companies)

router.post('/api/addPostToCompare', appController.addPostToCompare);
router.post('/api/removePost', appController.removePost);
router.post('/api/comparePost', appController.comparePost);

router.post('/api/addSkill', postController.addSkill)

router.get('/api/generalBusinessInformation', appController.generalBusinessInformation)

router.get('/api/paymentOptions', appController.paymentOptions)

router.post('/api/buyPlanDetail', appController.buyPlanDetail)



module.exports = router;    