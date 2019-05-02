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
        req.session.redirect = '/MyFavorites';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=MyFavorites');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=MyFavorites');
            } else {
                res.redirect(req.headers.referer);
            }
        } else {
            res.redirect('/?redirectTo=MyFavorites');
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

                                        /*   getModel.getPropertyImages((err, PropertyImages) => {   
                                              if (err) {
                                                  return;
                                              }
                                              var images =[];
                                              PropertyImages.forEach(element => {
                                                  if(typeof images[element.PropertyID] == 'undefined'){
                                                      images[element.PropertyID] = [];    
                                                  }
                                                  images[element.PropertyID].push(element.ImageURL);
                                              }); */
                                        getModel.getPropertyUnitData(propertyIDS, (unitErr, unitData) => {
                                            if (unitErr) {
                                                return;
                                            }
                                            var UnitData = [];
                                            UnitData = unitData;
                                            // console.log(propertyResult,'_____',UnitData)
                                            res.render('favorites', {
                                                title: 'Favorites Details',
                                                propertyType: propertyType,
                                                propertyResult: propertyResult,
                                                autocpmpleteArr: autocpmpleteArr,
                                                popularPost: popularPost,
                                                sess_val: req.session.user_id,
                                                subscribe_email: req.session.email,
                                                cityArea: cityArea,
                                                cities: cities,
                                                //  images:images,
                                                UnitTableData: UnitData,
                                                seoData: seoData,
                                                MetaTags: Tags,
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


router.post('/saveFavorite', (req, res, next) => {

    var data = [{
        UserID: parseInt(req.body.UserID),
        PropertyID: parseInt(req.body.PropertyID),
        IsActive: true
    }]

    commonFunction.saveFavourite('FavouriteProperties', data, (err, results) => {
        if (err) {
            res.send({
                status: 'danger',
                msg: 'Error in saved favourite.'
            });
            return false;
        } else {
            res.send({
                status: 'success',
                msg: 'Favourite saved successfully.'
            });
            return false;
        }
    })
});

router.post('/RemoveFavourite', (req, res, next) => {
    getModel.RemoveFavourite(req.body, (err, Removedata) => {
        if (err) {
            res.send({
                status: 'error',
                msg: err
            });
            return;
        } else {
            res.send({
                status: 'success',
                msg: 'Favourite Removed successfully.'
            });
        }
    });
});
module.exports = router;