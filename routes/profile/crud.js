var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {

    if (!req.session.user_id) {
        //req.session.redirect = '/properties-details/'+propId; 
        res.redirect('/');
        return false;
    }
    commonFunction.selectAll('Countries', (err, Countries) => {
        if (err) {
            return;
        }
        commonFunction.selectAll('States', (err, States) => {
            if (err) {
                return;
            }
            commonFunction.selectAll('Cities',(err, cities) => {
                if (err) {
                    return;
                }
                commonFunction.selectAll('UserType',(err, UserType) => {
                    if (err) {
                        return;
                    }
                    commonFunction.getPropertyType((err, propertyType) => {
                        if (err) {
                            return;
                        }
                        getModel.userDetail('Users', req.session.user_id, (err, results) => {
                            if (err) {
                                return;
                            }
                            commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                                if (err) {
                                    return;
                                }
                                userDetail = results;
                                res.render('profile', {
                                    title: 'Profile',
                                    cities: cities,
                                    Countries: Countries,
                                    States: States,
                                    UserType: UserType,
                                    sess_val: req.session.user_id,
                                    subscribe_email: req.session.email,
                                    query: req.session.socialData,
                                    userName: req.session.name,
                                    userDetail: userDetail,
                                    propertyType: propertyType,
                                    Tags: Tags,
                                    profile: req.session.profile,

                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


module.exports = router;