var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');

//var getModel = require(`./model-${require('../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {

    var favoriteData = [];

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
                commonFunction.getFavouriteData('FavouriteProperties', req.session.user_id, (err, getFavouriteData) => {
                    if (err) {
                        return;
                    }
                    getFavouriteData.forEach(element => {
                        favoriteData.push(element.PropertyID);
                    });
                    res.render('properties-details', {
                        title: 'Property Listing',
                        sess_val: req.session.user_id,
                        subscribe_email: req.session.email,
                        propertyType: propertyType,
                        cities: cities,
                        Tags: Tags,
                        favoriteData: favoriteData,
                        userName: req.session.name
                    });
                });
            });
        });
    });

});

module.exports = router;