var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
const seoModel = require("../seo/model-cloudsql");
//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
     // console.log(req.originalUrl,'*****************');
     req.session.redirect = req.originalUrl;
    var async = require('async');
    var seoData = {};
    async.waterfall([
        function (callback) {
            var fullURL = 'https://' + req.get('host') + req.originalUrl;

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
                commonFunction.getPropertyType((err, propertyType) => {
                    if (err) {
                        return;
                    }
                    commonFunction.selectAll('Cities', (err, cities) => {
                        if (err) {
                            return;
                        }
                        commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                            if (err) {
                                return;
                            }
                            res.render('privacy-policy', {
                                title: 'Privacy Policy',
                                sess_val: req.session.user_id,
                                subscribe_email: req.session.email,
                                propertyType: propertyType,
                                popularPost: popularPost,
                                cities: cities,
                                seoData: seoData,
                                Tags: Tags,
                                Meta_tags : './metadata/privacy_policy_meta',
                                userName: req.session.name
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