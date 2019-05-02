var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
var async = require('async');
const config = require('../../config');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: config.get('SMTPHOST'),
    port: config.get('SMTPPORT'),
    secure: true,
    auth: {
        user: config.get('EMAIL_SENDING_USER'),
        pass: config.get('EMAIL_SENDING_PASS')
    }
});

//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
     // console.log(req.originalUrl,'*****************');
     req.session.redirect = req.originalUrl;
    commonFunction.getPopularPost((err, popularPost) => {
        if (err) {
            return;
        }
        commonFunction.selectAll('Cities', (err, cities) => {
            if (err) {
                return;
            }
            commonFunction.getPropertyType((err, propertyType) => {
                if (err) {
                    return;
                }
                commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                    if (err) {
                     return;
                    }
                    res.render('contact-us', {
                        title: 'Contact Us',
                        sess_val: req.session.user_id,
                        propertyType: propertyType,
                        subscribe_email: req.session.email,
                        popularPost: popularPost,
                        cities: cities,
                        Tags:  Tags,
                        Meta_tags : './metadata/ContactUs_meta',
                        userName: req.session.name
                    });
                });
            });
        });
    });
});
router.post('/save-ContactUs-details', function (req, res, next) {

    var html = "<h3>Person's Contact Details: </h3>";
    html += '<span><b> First Name : </b> ' + req.body.first_name + '</span><br>\
        <span><b> Email : </b> ' + req.body.email + '</span><br>\
        <span><b> Phone : </b> ' + req.body.phone + '</span><br>\
        <span><b> Message : </b> ' + req.body.message + '</span><br>';

    var mailOptions = {
        from: config.get('EMAIL_FROM'),
        to: 'support@avenue.in',
        //to: 'amw.shreyamishra@gmail.com',
        subject: req.body.first_name + ' has tried to Contact',
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (info) {
            var result = {};
            result.status = 'success';
            result.msg = 'Your query has been submitted, our team will get in touch with you';
            res.send(JSON.stringify(result));
            return;
        } else {
            var result = {};
            result.status = 'danger';
            result.msg = 'Something went wrong. Please try again !';
            res.send(JSON.stringify(result));
            return;
        }
    });
});

module.exports = router;