var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');

//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
    
    if (!req.session.user_id) {
        req.session.redirect = '/amaravati-plots';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=amaravati-plots');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=amaravati-plots');
            } else {
                res.redirect(req.headers.referer);

                
            }
        } else {
            res.redirect('/?redirectTo=amaravati-plots');
        }

        return false;
    }
    if (req.session.profile == false) {
        req.session.redirect = '/amaravati-plots';
        res.redirect('/profile');
        return false;
    }

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
                    res.render('amaravati-plots', {
                        title: 'amaravati-plots',
                        sess_val: req.session.user_id,
                        propertyType: propertyType,
                        subscribe_email: req.session.email,
                        popularPost: popularPost,
                        cities: cities,
                        userName: req.session.name,
                        Tags: Tags, 
                        Meta_tags: './metadata/amaravati-plots',
                    });
                });
            });
        });
    });
});



module.exports = router;