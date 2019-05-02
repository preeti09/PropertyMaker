var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
var async = require('async');
const seoModel = require("../seo/model-cloudsql");
var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);


router.get('/', function (req, res, next) {

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

                getModel.getAllPropertyDetails((err, propertyResult) => {
                    if (err) {
                        return;
                    }

                    getModel.getAutocompleteArray((err, autocpmpleteArr) => {
                        if (err) {
                            return;
                        }

                        commonFunction.getPopularPost((err, popularPost) => {

                            if (err) {
                                return;
                            }

                            commonFunction.selectAll('CityArea',(err, cityArea) => {
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
                                        getModel.getPropertyImages((err, PropertyImages) => {
                                            if (err) {
                                                return;
                                            }
                                            var images = [];
                                            PropertyImages.forEach(element => {
                                                if (typeof images[element.PropertyID] == 'undefined') {
                                                    images[element.PropertyID] = [];
                                                }
                                                images[element.PropertyID].push(element.ImageURL);
                                            });
                                            res.render('404', {
                                                title: 'Page not found',
                                                propertyType: propertyType,
                                                userName: req.session.name,
                                                propertyResult: propertyResult,
                                                autocpmpleteArr: autocpmpleteArr,
                                                popularPost: popularPost,
                                                sess_val: req.session.user_id,
                                                subscribe_email: req.session.email,
                                                cityArea: cityArea,
                                                cities: cities,
                                                Tags: Tags,
                                                images: images,
                                                seoData: seoData,
                                                query:'',
                                          
                                                //cookieValue:cookieValue,
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