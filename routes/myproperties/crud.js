var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const nodemailer = require('nodemailer');
const config = require('../../config');
const seoModel = require("../seo/model-cloudsql");
var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
    sessionId = req.session.user_id;
    if (!sessionId) {
        req.session.redirect = '/myproperties';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=myproperties');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=myproperties');
            } else {
                res.redirect(req.headers.referer);
            }
        } else {
            res.redirect('/?redirectTo=myproperties');
        }

        return false;
    }
    //var cookieValue = req.cookies.username;
    var async = require('async');
    var seoData = {}
    async.waterfall([
        function (callback) {
            var fullURL = 'https://' + req.get('host') + req.originalUrl;

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

                getModel.getAllPropertyDetails(sessionId, (err, propertyResult) => {
                    if (err) {
                        return;
                    }
                    propertyResult = propertyResult;
                    var propertyIDS = [];
                    for (var i = 0; i < propertyResult.length; i++) {
                        propertyIDS.push(propertyResult[i].ID);
                    }

                    getModel.getAutocompleteArray((err, autocpmpleteArr) => {
                        if (err) {
                            return;
                        }
                        commonFunction.getPopularPost((err, popularPost) => {

                            if (err) {
                                return;
                            }
                            commonFunction.selectAll('CityArea', (err, cityArea) => {
                                if (err) {
                                    return;
                                }
                                commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                                    if (err) {
                                        return;
                                    }
                                    commonFunction.selectAll('Cities', (err, cities) => {
                                        if (err) {
                                            return;
                                        }
                                        getModel.getPropertyUnitData(propertyIDS, (unitErr, unitData) => {
                                            if (unitErr) {
                                                return;
                                            }
                                            var UnitData = [];
                                            UnitData = unitData;
                                            // console.log(propertyResult,'_____',UnitData)
                                            res.render('myproperties', {
                                                title: 'MyProperties',
                                                propertyType: propertyType,
                                                propertyResult: propertyResult,
                                                autocpmpleteArr: autocpmpleteArr,
                                                popularPost: popularPost,
                                                sess_val: req.session.user_id,
                                                subscribe_email: req.session.email,
                                                cityArea: cityArea,
                                                cities: cities,
                                                UnitTableData: UnitData,
                                                seoData: seoData,
                                                Tags: Tags,
                                                userName: req.session.name,
                                                currencyFormat: commonFunction.currencyFormat
                                            });
                                        });
                                    })
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



module.exports = router;