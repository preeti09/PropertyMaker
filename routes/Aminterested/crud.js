var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    
    host:config.get('SMTPHOST'),
    port:config.get('SMTPPORT'),
    secure: true,
    auth: {
        user: config.get('EMAIL_SENDING_USER'),
        pass: config.get('EMAIL_SENDING_PASS')
    }
});

router.post('/', function (req, res, next) {
   
    commonFunction.selectAll('Countries',(err, Countries) => {   
        if (err) {
            var result = {};
                result.status =  'error';
                result.msg =  'network error occure';
                result.country = null;
                result.data = null;
                res.send(JSON.stringify(result));
                return;
        }
    
    if (req.session.user_id) {
        getModel.getUserDetails('Users', req.session.user_id, (err, entity) => {
            var result = {};
            if (err) {
                result.status =  'error';
                result.msg =  'Network error occure';
                result.country = Countries;
                result.data = null;
            };

            if(entity){
                result.status =  'success',
                result.msg = true;
                result.data = entity;
                result.country = Countries;
            }
            res.send(JSON.stringify(result));
            return;
      });
    } 
    else {
            var result = {};
            result.status =  'error';
            result.msg =  'NO Data';
            result.country = Countries;
            result.data = null;
            res.send(JSON.stringify(result));
            return;
         }
    });
});

router.post('/submit', function (req, res, next) {

    var UnitIdentifier = (req.body.UnitIdentifier) ? (req.body.UnitIdentifier) : null;
    var propertyId = (req.body.propertyId) ? parseInt(req.body.propertyId) : null;
    var UserID = (req.body.userId) ? parseInt(req.body.userId) : null;
    var SearchPrice = (req.body.SearchPrice) ? parseInt(req.body.SearchPrice) : null;
    var Extent = (req.body.Extent) ? (req.body.Extent) : null;
    var propertyTitle = req.body.PropertyName;
    var AskingPrice = (req.body.AskingPrice) ? parseInt(req.body.AskingPrice) : null;
    var AMListingID = (req.body.AMListingID) ? parseInt(req.body.AMListingID) : null;
    var Email = (req.body.Email) ? req.body.Email : null;
   
    var data = [{
        'PropertyID': propertyId,
        'EmailID' : Email,
        'UserID': UserID,
        'SearchPrice': SearchPrice,
        'IsActive': true,
        'Name': req.body.Name,
        'PhoneNumber': req.body.phoneNumber,
        'Country': req.body.countryIam,
        'WhatsAppNumber': req.body.whatsAppNumber,
        'Message': req.body.message,
        'UnitID': null,
        'Extent' : Extent,
        'AskingPrice' : AskingPrice,
        'AMListingID': AMListingID
    }];
    var listingData = {};

    if(req.body.typeProperty){
      var extent = req.body.typeProperty.split('@');
      data[0].AskingPrice = parseInt(req.body.AskingPrice) * parseInt(extent[1]);
      data[0].UnitID = parseInt(extent[0]);
      data[0].Extent = parseInt(extent[1]);
      data[0].Budget = parseInt(req.body.AskingPrice) * parseInt(extent[1]);
      var UnitTitle = extent[2];
    } else {
      data[0].AskingPrice = parseInt(req.body.AskingPrice);
      data[0].Budget = parseInt(req.body.TotalPrice);
      data[0].Extent = Extent;
      var UnitTitle = '';  
    }
  /*   if(AMListingID){
        commonFunction.getDataByID('ListingPlotsForSale','ListingID',AMListingID,(err, res) =>{
            if (err) {
                var result = {};
                result.status =  'danger';
                result.msg =  'Network error occure';
               // res.send(JSON.stringify(result));
                return;
            };
            listingData.ID = res[0].ListingID;
            listingData.Colony = res[0].Colony;
            listingData.Facing = res[0].Facing;
            listingData.Price = res[0].Price;
            listingData.AllottedVillage = res[0].AllottedVillage;
        });
    } */
    commonFunction.insertData('CustomerInterestedProperties',data,(err, results) =>{
        var html = '<h2>Interested Person Details</h2>\
        <span><b> Name : </b> '+ data[0].Name +'</span><br>\
        <span><b> Email : </b> '+ Email +'</span><br>\
        <span><b> Phone Number : </b> '+ data[0].PhoneNumber +'</span><br>\
        <span><b> Phone Number : </b> '+ data[0].PhoneNumber +'</span><br>\
        <span><b> Property ID : </b> '+ data[0].PropertyID +' </span><br>\
        <span><b> Property Title : </b> '+ propertyTitle +'</span><br>\
        <span><b> Budget : </b> '+ data[0].Budget +'</span><br><br>\
        <span><b> Price: </b>'+ data[0].SearchPrice +'/'+ req.body.UnitIdentifier+'</span><br>';
        if( data[0].AMListingID){
        html+= '<span><b>  AMListingID : </b> '+ data[0].AMListingID+' </span><br>';
        }
        html +='<span><b> Country : </b> '+ data[0].Country +'</span><br>\
        <span><b> WhatsApp Number : </b> '+ data[0].WhatsAppNumber +'</span>';
      /*   if(AMListingID && listingData){
        html += '<span><b> Listing ID  : </b> '+ listingData.ID +'</span><br>\
            <span><b> Colony : </b> '+ listingData.Colony +'</span><br>\
            <span><b> Facing : </b> '+ listingData.Facing +'</span><br>\
            <span><b> Price : </b> '+ listingData.Price +'/'+ req.body.UnitIdentifier+'</span><br>\
            <span><b> Alloted Village : </b> '+ listingData.AllottedVillage +'</span><br>';
        } else {
        html+= '<span><b> Price: </b>'+ data[0].SearchPrice +'/'+ req.body.UnitIdentifier+'</span><br>';
        }
        if(data[0].UnitID){
        html += '<span><b> Unit ID : </b> '+ data[0].UnitID +'</span><br>\
        <span><b> Unit Title : </b> '+ UnitTitle +'</span><br>'; 
        } */
        

        var mailOptions = {
            from: config.get('EMAIL_FROM'),
            to: 'Support@avenue.in',
            // to: 'shreya@amwebtech.com',
            subject: data[0].Name + ' has an Interest on '+propertyTitle+' | Avenir Realty LLP',
            html: html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                var result = {};
                result.emailStatus =  'danger';
            } else {
                result.emailStatus =  'success';
            }
        });
    
    
        if (err) {
            var result = {};
            result.status =  'danger';
            result.msg =  'Network error occure';
            res.send(JSON.stringify(result));
            return;
        };
            
        if(results){
            var result = {};
            result.status =  'success';
            result.msg =  'Thank you for the message.Our team will get back to you.';
            result.insertId = results; 
            res.send(JSON.stringify(result));
            return;
        } else {
            var result = {};
            result.status =  'danger';
            result.msg =  'Something went wrong. Please try again !';
            result.insertId = results; 
            res.send(JSON.stringify(result));
            return;
        }
    }); 
}); 


module.exports = router;