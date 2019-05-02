var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
var async = require('async');
const config = require('../../config');
const seoModel = require("../seo/model-cloudsql");

const nodemailer = require('nodemailer');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);
var transporter = nodemailer.createTransport({

    host: config.get('SMTPHOST'),
    port: config.get('SMTPPORT'),
    secure: true,
    auth: {
        user: config.get('EMAIL_SENDING_USER'),
        pass: config.get('EMAIL_SENDING_PASS')
    }
});
router.get('/', function (req, res, next) {
 // console.log(req.session.user_id,'----------');
    if (!req.session.user_id) {
        
        req.session.redirect = '/submit-request';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=submit-request');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=submit-request');
            } else {
                res.redirect(req.headers.referer);
            }
        } else {
            res.redirect('/?redirectTo=submit-request');
        }

        return false;
    }
    if (req.session.profile == false) {
      //  console.log(req.session,'Out---------------------------')
        req.session.redirect = '/submit-request';
        res.redirect('/profile');
        return false;
    }

    var async = require('async');
    var seoData = {};
    async.waterfall([
        function (callback) {
            var fullURL = 'https://' + req.get('host') + req.originalUrl;
            // console.log("fullURL is: ", fullURL);
            seoModel.checkUrl_Exists(fullURL, (err, seoResponse) => {
                seoData = seoResponse.msg;
            });
            callback();
        },
        function (data, callback) {
            commonFunction.getPropertyType((err, propertyType) => {
                if (err) {
                    return;
                }

                commonFunction.getPropertyCategory((err, propertyCategory) => {
                    if (err) {
                        return;
                    }
                    commonFunction.selectAll('Cities', (err, cities) => {
                        if (err) {
                            return;
                        }
                        commonFunction.selectAll('CityArea', (err, cityArea) => {
                            if (err) {
                                return;
                            }
                            commonFunction.selectAll('AreaLocalities', (err, localities) => {
                                if (err) {
                                    return;
                                }
                                commonFunction.selectAll('UnitsOfArea', (err, UnitsOfArea) => {
                                    if (err) {
                                        return;
                                    }
                                    commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                                        if (err) {
                                            return;
                                        }
                                      
                                        res.render('submit-request', {
                                            title: 'Submit request',
                                            propertyType: propertyType,
                                            propertyCategory: propertyCategory,
                                            sess_val: req.session.user_id,
                                            cityArea: cityArea,
                                            subscribe_email: req.session.email,
                                            userName: req.session.name,
                                            cities: cities,
                                            seoData: seoData,
                                            UnitsOfArea: UnitsOfArea,
                                            Tags: Tags,
                                            Meta_tags: './metadata/submit_request_meta',
                                        });
                                    });
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

router.post('/save-property-details', function (req, res, next) {


    var data = [{
        'UserID': req.session.user_id ? req.session.user_id : null,
        'BuyOrSell': req.body.BuyOrSell ? req.body.BuyOrSell : '',
        'CityID': req.body.CityID ? req.body.CityID : null,
        //'Area': req.body.area ? req.body.area : null,
        'AreaID': req.body.AreaID ? req.body.AreaID : null,
        'PropertyTypeID': req.body.propertyType ? req.body.propertyType : null,
        'Extent': req.body.extent ? req.body.extent : null,
        'North': req.body.north ? req.body.north : false,
        'East': req.body.east ? req.body.east : false,
        'West': req.body.west ? req.body.west : false,
        'South': req.body.south ? req.body.south : false,
        'Description': req.body.description ? req.body.description : '',
        'Price': req.body.price ? req.body.price.replace(/\,/g, "") : null,
        'PropertyTypeChildID': req.body.PropertyTypeChildID ? req.body.PropertyTypeChildID : null,
        'IsActive': true
    }];

    var MailData = {};

    async.waterfall([
        function (cb) {
            if (req.body.CityID) {
                commonFunction.getNameByID('Cities', req.body.CityID, 'Name', (err, res) => {
                    if (err) {
                        return;
                    }
                    MailData.Name = res.rows[0].Name;
                    cb(null, MailData)
                });
            }
        },
        function (MailData, cb) {
            if (req.body.propertyType) {
                commonFunction.getNameByID('PropertyType', req.body.propertyType, 'Type', (err, res) => {
                    if (err) {
                        //console.log('Error of submit request',err);
                        return;
                    }
                    MailData.Type = res.rows[0].Type;
                    //console.log(' MailData.Type ',  MailData.Type);
                    cb(null, MailData)
                });
            }
        },
        function (MailData, cb) {
            if (req.body.PropertyTypeChildID) {
                commonFunction.getNameByID('PropertyTypeChild', req.body.PropertyTypeChildID, 'PropertyTypeChild', (err, res) => {
                    if (err) {
                        return;
                    }
                    MailData.PropertyTypeChild = res.rows[0].PropertyTypeChild;

                    cb(null, MailData)
                });

            }
        },
        function (MailData, cb) {

            commonFunction.insertData('CustomerRequirements', data, (err, results) => {
                if (err) {
                    return
                }
                getModel.userDetail('Users', req.session.user_id, (err, submitResponse) => {
                    if (err) {
                        return;
                    }

                    if (data[0].BuyOrSell == 'buy') {
                        subject = 'Customer Buy Request'
                    }
                    if (data[0].BuyOrSell == 'sell') {
                        subject = 'Customer Sell Request'
                    }

                    var temp = [req.body.north ? 'North' : '',
                        req.body.south ? 'South' : '',
                        req.body.east ? 'East' : '',
                        req.body.west ? 'West' : ''
                    ];

                    var str = '';
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[i]) {
                            str += ' ' + temp[i] + '|';
                        }
                    }
                    var html = '<h2>' + subject + ' Details</h2>\
        <span><b> Name : </b> ' + req.session.name + '</span><br>';
                    if (MailData.Name) {
                        html += '<span><b> City : </b> ' + MailData.Name + '</span><br>';
                    }
                    if (submitResponse[0].Email) {
                        html += '<span><b> Email: </b> ' + submitResponse[0].Email + '</span><br>';
                    }
                    if (MailData.Type) {
                        html += '<span><b> Property Type : </b> ' + MailData.Type + '</span><br>';
                    }
                    if (req.body.area) {
                        html += '<span><b> Area: </b> ' + req.body.area + ' </span><br>';
                    }
                    if (data[0].Extent) {
                        html += '<span><b> Extent : </b> ' + data[0].Extent + '</span><br>';
                    }
                    if (data[0].Description) {
                        html += '<span><b> Description : </b> ' + data[0].Description + '</span><br>';
                    }
                    if (data[0].Price) {
                        html += '<span><b> Price : </b> ' + data[0].Price + '</span><br>';
                    }
                    if (MailData.PropertyTypeChild) {
                        html += '<span><b> Property Category : </b> ' + MailData.PropertyTypeChild + '</span><br>';
                    }
                    if (submitResponse[0].PhoneNumber) {
                        html += '<span><b> Phone Number  : </b> ' + submitResponse[0].PhoneNumber + '</span><br>';
                    }
                    if (submitResponse[0].WhatsAppNumber) {
                        html += '<span><b> WhatsApp Number : </b> ' + submitResponse[0].WhatsAppNumber + '</span><br>';
                    }
                    if (submitResponse[0].Country) {
                        html += '<span><b> Country : </b> ' + submitResponse[0].Country + '</span><br>';
                    }
                    if (str) {
                        html += '<span><b> Facing : </b> ' + str + '</span><br>';
                    }

                    var mailOptions = {
                        from: config.get('EMAIL_FROM'),
                        to: 'support@avenue.in',
                        //  to: 'amw.shreyamishra@gmail.com',
                        subject: subject,
                        html: html
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (info) {
                            var result = {};
                            result.status = 'success';
                            result.msg = 'Your request submitted successfully';
                            res.send(JSON.stringify(result));
                            return;
                        } else {
                            var result = {};
                            result.status = 'danger';
                            result.msg = 'Something went wrong. Please try again';
                            res.send(JSON.stringify(result));
                            return;
                        }
                    });
                    cb(null, results);
                });
            });
        }
    ], function (finalError, finalResponse) {

        if (finalError) {

            console.log('finalError', finalError);
        }
        if (finalResponse) {
            console.log('finalResponse', finalResponse);
        }
    });
});


module.exports = router;