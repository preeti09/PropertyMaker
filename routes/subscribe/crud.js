var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
const nodemailer = require('nodemailer');

var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);

router.post('/', function (req, res, next) {
    var data = [{
        'EmailAddress': req.body.email,
        'IsActive': true,
    }]; 
    commonFunction.insertData('UserSubscriptions', data, (err, results) => {
        console.log(err, results)
        var response = {};
        if (err) {
            response.status = 'danger';
            response.msg = 'Network error occured. Please try again.';
        } else {
        response.status = 'success';
        response.msg = 'Thank you for subscribing to our newsletter'; 
        }
        res.send(response);
    });
});










module.exports = router;
