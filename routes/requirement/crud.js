var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
const nodemailer = require('nodemailer');
const seoModel = require("../seo/model-cloudsql");

router.get('/', function (req, res, next) {
    // console.log(req.originalUrl,'*****************');
    req.session.redirect = req.originalUrl;
   var async = require('async');
   var seoData = {};
   async.waterfall([
       function (callback) {
           var fullURL = 'https://' + req.get('host') + req.originalUrl;
           console.log("fullURL is: ", fullURL);
           seoModel.checkUrl_Exists(fullURL, (err, seoResponse) => {
               seoData = seoResponse.msg;
           });
           callback();
       },
       function (data, callback) {
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
                       commonFunction.selectAll('PropertySaleType', (err, saleType) => {
                        if (err) {
                            return;
                        }
                       commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                           if (err) {
                               return;
                           }
                        //    console.log(Tags,'---------')

                            res.render('requirement', {
                                title: 'Requirement',
                               sess_val: req.session.user_id,
                               popularPost: popularPost,
                               propertyType: propertyType,
                               subscribe_email: req.session.email,
                               cities: cities,
                               seoData: seoData,
                               saleType:saleType,
                               Tags: Tags,

                               //Meta_tags : './metadata/terms_ofService_meta',

                               userName: req.session.name
                           });
                       });
                   });
               });
            });
           });
       }
   ], function (finalError, finalResponse) {

   });
});
router.post('/save', function (req, res, next) {
    if (!req.session.user_id) {
        req.session.redirect = '/requirement';
        // req.flash('error', 'Access denied! Please Login First.', '/');
        res.redirect('/');
        return false;
    }

    req.body.user_id = req.session.user_id;

    console.log(req.body);
    return false;
    commonFunction.insertData('requirement', req.body, (err, results) => {
        if (err) {
            req.flash('error', 'Something went wrong. Please try again.', '/requirement');
            return;
        }
        commonFunction.getCredential('credential', 'requirement', (err, results) => {
            var json = JSON.parse(results[0].value);
            if (err) {
                req.flash('error', 'Error in sending mail to support.', '/requirement');
                return;
            }

            var transporter = nodemailer.createTransport({

                host: config.get('SMTPHOST'),
                port: config.get('SMTPPORT'),
                secure: true,
                auth: {
                    user: config.get('EMAIL_SENDING_USER'),
                    pass: config.get('EMAIL_SENDING_PASS')
                }
            });

            var mailOptions = {
                from: json.email,
                to: 'support@avenue.in',
                subject: 'Requirement | Avenir Realty LLP',
                text: 'New requirement added.'
            };

            transporter.sendMail(mailOptions, function (error, info) {

                if (error) {
                    req.flash('error', 'Error in Sending Email. Please try again', '/requirement');
                    return;
                } else {
                    req.flash('success', 'Requirement added successfully.', '/requirement');
                    return;
                }
            });


        });


    });

});

module.exports = router;