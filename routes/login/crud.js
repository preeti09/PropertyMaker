var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
const nodemailer = require('nodemailer');

var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);

var transporter = nodemailer.createTransport({

    host: config.get('SMTPHOST'),
    port: config.get('SMTPPORT'),
    secure: true,
    auth: {
        user: config.get('EMAIL_SENDING_USER'),
        pass: config.get('EMAIL_SENDING_PASS')
    }
});



/*router.get('/', function (req, res, next) {
    
    getModel.getPopularPost((err,popularPost) =>{
        if (err) {
            return;
        }
        commonFunction.selectAll('Cities',(err, cities) => {   
        if (err) {

            return;
        }
        res.render('login', {
            title: 'Login',
            sess_val: req.session.user_id,
            popularPost:popularPost,
            cities:cities
        });
        });
    });
    
});*/

router.post('/', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var remember_me = (req.body && req.body.remember_me) ? true : false;
    var ent = {};

    getModel.loginUser(username, password, (err, entities) => {
        if (err == 'err') {
            ent.msg = entities;
            ent.loginstatus = 'error';
            ent.remember_me = remember_me;
            //req.flash('error', 'Email or password is invalid', req.get('referer'));
        } else {
            req.session.user_id = entities[0].ID;
            req.session.email = entities[0].Email;
            req.session.name = entities[0].Name;
            req.session.profile_image = entities[0].ProfileImagelink;
            req.session.socialData = entities[0];

            if ((entities[0].IsLoginAllowed == 'true' || entities[0].IsLoginAllowed == true) && (entities[0].IsActive == 'true' || entities[0].IsActive == true)) {
                req.session.profile = true;
                ent.loginstatus = 'success';
                ent.msg = 'Login Successful!  Redirecting...';
                ent.remember_me = remember_me;
                ent.url = req.session.redirect ? req.session.redirect : req.headers.referer;
                ent.user_id = entities[0].ID;
                ent.email = entities[0].Email;
                ent.name = entities[0].Name;
            } else if (entities[0].IsActive == 'false' || entities[0].IsActive == false) {
                req.session.destroy();
                ent.loginstatus = 'error';
                ent.msg = 'Your account is deactivated, please contact <a href="mailto:support@avenue.in">support@avenue.in</a>';
            } else if (entities[0].IsLoginAllowed == 'false' || entities[0].IsLoginAllowed == false) {
                req.session.profile = false;
                ent.loginstatus = 'success';
                ent.msg = 'Login Successful!  Redirecting...';
                ent.remember_me = remember_me;
                ent.url = '/profile';
                ent.user_id = entities[0].ID;
                ent.email = entities[0].Email;
                ent.name = entities[0].Name;
            }
        }
        res.send(JSON.stringify(ent));
    });
});

router.post('/changePassword', (req, res, next) => {


    var queryString = Buffer.from(req.body.email).toString('base64');
    var randomNum = Math.floor(100000 + Math.random() * 900000);

    getModel.checkEmail_Exists(req.body.email, (err, savedData) => {
        if (err) {
            next(err);
            return;
        } else if (savedData.length > 0) {
            var data = {
                Token: randomNum
            };
            getModel.update_num(req.body.email, data, (err, savedData) => {
                if (err) {
                    next(err);
                    return;
                }

                var mailOptions = {
                    from: config.get('EMAIL_FROM'),
                    to: req.body.email,
                    subject: 'Forgot Password | Avenir Realty LLP',
                    text: 'Hello, Please go to this link for reset your password ' + req.headers.origin + '/login/Password_setting/?con=' + queryString + '&token=' + randomNum
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send({
                            'status': 'danger',
                            'msg': 'Error in Sending Email. Please try again'
                        });
                        return;
                    } else {

                        res.send({
                            'status': 'success',
                            'msg': 'The reset Password link sent on your email address, please check your Email.'
                        });
                        return;
                    }
                });

            });
        } else {
            res.send({
                'status': 'danger',
                'msg': 'Email Id does not exists.'
            });
        }
    });
});

router.get('/Password_setting', (req, res, next) => {
    var email = Buffer.from(req.query.con, 'base64').toString('ascii');
    var token = req.query.token;
    var data = {
        'email': email,
        'token': token
    };
    commonFunction.getPropertyType((err, propertyType) => {
        if (err) {
            return;
        }
        commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
            if (err) {
                return;
            }
            commonFunction.selectAll('Cities',(err, cities) => {
                if (err) {
                    cb(err, propertyData);
                } else {
                    res.render('forgotPassword', {
                        title: "Change Password",
                        sess_val: req.session.user_id,
                        subscribe_email: req.session.email,
                        userName: req.session.name,
                        propertyType: propertyType,
                        Tags: Tags,
                        data: data,
                        cities: cities,
                    });
                }
            });
        });
    });
});

router.post('/Password_setting', (req, res, next) => {

    var data = {
        'password': req.body.password,
        'confirmpassword': req.body.confirm_password
    };

    getModel.update_password(req.body.emailP, req.body.token, data, (err, savedData) => {
        if (err || savedData == undefined) {
            res.send({
                'status': 'danger',
                'msg': 'Link expired. Please generate again.'
            });
        } else if (savedData == 'Done') {
            res.send({
                'status': 'success',
                'msg': 'Password Changed Successfully.'
            });
        }

    });
});

router.get('/logout', (req, res) => {
    var redirect = req.session.redirect ? '/' : req.headers.referer;
    req.session.destroy();
    res.redirect(redirect);
});

router.get('/checkEmailAvailability', (req, res) => { // CHECK EMAIL IN DATABASE THAT IS ALREADY EXISTS OR NOT
    getModel.apiCheckEmailAvailability(req.param("email"), (err, userData) => {
        if (userData && userData.length) {
            res.json({
                status: 200
            });
            return;
        } else {
            res.json({
                status: 500
            });
            return;
        }
    })
});

module.exports = router;