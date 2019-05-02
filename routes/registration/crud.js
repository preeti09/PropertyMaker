var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);

router.get('/', function (req, res, next) {
    
    commonFunction.selectAll('Countries',(err, Countries) => {
        if (err) {
            return;
        }
        commonFunction.selectAll('States', (err, States) => {
            if (err) {
                return;
            }
            commonFunction.selectAll('Cities', (err, cities) => {
                if (err) {
                    return;
                }
                commonFunction.selectAll('UserType', (err, UserType) => {
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
                            res.render('signup', {
                                title: 'Sign Up',
                                cities: cities,
                                propertyType: propertyType,
                                Countries: Countries,
                                Tags: Tags,
                                States: States,
                                UserType: UserType,
                                sess_val: req.session.user_id,
                                subscribe_email: req.session.email,
                                query: req.session.socialData
                            });
                        });
                    });
                });
            });
        });
    });
});

router.post('/save', function (req, res, next) {
    var id = req.body.id;

    if (typeof id == 'undefined') {
   

        var users_obj = [{
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            IsLoginAllowed: false
        }];

        getModel.checkRegistration(users_obj, (err, savedData) => {
         
            if (err == 'err') {
                req.flash('error', savedData, '/registration');
                return;
            } else if (err == 'exist') {
                req.flash('error', savedData, '/');
                return;
            } else {
                req.session.user_id = savedData[0].ID;
                req.session.email = savedData[0].Email;
                req.session.name = savedData[0].Name;
                req.session.profile = true;
                req.session.profile_image = savedData[0].ProfileImagelink;
                req.session.socialData = savedData[0];

                res.redirect('/profile');
                // req.flash('success', savedData, '/');
                return;
            }
        });
    } else {
       // ('not working')

        var WhatsAppNumber = req.body.WhatsAppNumber ? req.body.ISDCode[0] + req.body.PhoneNumber : '';

        var SecondWhatsAppNumber = req.body.SecondWhatsAppNumber ? req.body.ISDCode[1] + req.body.SecondPhoneNumber : '';

        var users_obj = [{
            UserTypeID: req.body.UserTypeID,
            Name: req.body.Name,
            Email: req.body.Email,
            Password: req.body.Password,
            PhoneNumber: req.body.ISDCode[0] + req.body.PhoneNumber,
            WhatsAppNumber: WhatsAppNumber,
            SecondPhoneNumber: req.body.ISDCode[1] + req.body.SecondPhoneNumber,
            SecondWhatsAppNumber: SecondWhatsAppNumber,
            Country: req.body.Country,
            State: req.body.State,
            City: req.body.City,
            IsLoginAllowed: true,
            Address: req.body.Address
        }];

        getModel.updateUser(users_obj[0], id, (err, savedData) => {
            if (err == 'err') {
                var result = {};
                result.status = 'error';
                result.msg = 'Something went wrong, Please try again';
                res.send(JSON.stringify(result));
                return;
            } else {
                
                req.session.profile = true;
                req.session.socialData.IsLoginAllowed = true;
                var result = {};
                result.status = 'success';
                result.msg = 'Your Profile has been updated successfully';
                if(req.session.redirect != undefined){
                    result.redirect = req.session.redirect;
                }else{
                    result.redirect = '/';
                }
       
                res.send(JSON.stringify(result));
                return;
            }
        });
    }

});

router.post('/socialLogin', function (req, res, next) {

    var dt = convertDate(new Date());
    var user_name = req.body.user_name ? req.body.user_name : req.body.first_name;
    const data = [{
        'Name': user_name,
        'Email': req.body.email,
        'Password': '',
        IsActive: true,
        IsLoginAllowed: false
        //        'ProfileImagelink':req.body.profile_image,
    }];

    getModel.checkRegistration(data, (err, savedData) => {
        if (err == 'err') {
            req.flash('error', savedData, '/registration');
            return;
        } else {
            getModel.Login(req.body.email, req.body.username, (err, entities) => {
                if (err) {
                    entities[0].loginstatus = 'error';
                    entities[0].url = '/';
                    entities[0].msg = 'Something went wrong. Please try again.';
                } else {

                    req.session.socialData = entities[0];
                    req.session.user_id = entities[0].ID;
                    req.session.email = entities[0].Email;
                    req.session.name = entities[0].Name;


                    if ((entities[0].IsLoginAllowed == 'true' || entities[0].IsLoginAllowed == true) && (entities[0].IsActive == 'true' || entities[0].IsActive == true)) {
                        entities[0].loginstatus = 'success';
                        req.session.profile = true;
                        entities[0].url = req.session.redirect ? req.session.redirect : '/';
                    } else if (entities[0].IsActive == 'false' || entities[0].IsActive == false) {
                        req.session.destroy();
                        entities[0].loginstatus = 'error';
                        entities[0].msg = 'Your account is deactivated, please contact <a href="mailto:support@avenue.in">support@avenue.in</a>';
                    } else if (entities[0].IsLoginAllowed == 'false' || entities[0].IsLoginAllowed == false) {
                        req.session.profile = false;
                        entities[0].loginstatus = 'success';
                        entities[0].url = '/profile';
                    }

                }
                res.send(JSON.stringify(entities[0]));
            });

        }
    });

});

module.exports = router;

function convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}