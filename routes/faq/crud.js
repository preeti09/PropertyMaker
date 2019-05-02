var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');

//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
    // console.log(req.originalUrl,'*****************');
    req.session.redirect = req.originalUrl;

    const seoModel = require("../seo/model-cloudsql");

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
              
                            res.render('faq', {
                                title: 'FAQ',
                                sess_val: req.session.user_id,
                                propertyType: propertyType,
                                subscribe_email: req.session.email,
                                popularPost: popularPost,
                                cities: cities,
                                seoData: seoData,
                                MetaTags: Tags,
                                Meta_tags : './metadata/faq_meta',
                                userName: req.session.name,

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