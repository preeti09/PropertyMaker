var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');

//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {

    commonFunction.getPopularPost((err, popularPost) => {
        if (err) {
            return;
        }
        commonFunction.selectAll('Cities', (err, cities) => {
            if (err) {
                return;
            }
            commonFunction.selectAll('PropertyType',(err, propertyType) => {
                if (err) {
                    return;
                }
                commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                    if (err) {
                        return;
                    }
                    res.render('services', {
                        title: 'Services',
                        sess_val: req.session.user_id,
                        propertyType: propertyType,
                        popularPost: popularPost,
                        Tags: Tags,
                        subscribe_email: req.session.email,
                        cities: cities
                    });
                });
            });
        });
    });

});

module.exports = router;