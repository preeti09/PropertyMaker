'use strict';
var in_array = require('in_array');
const connection = require("../../db-connection");

function getPropertyValues(table,id,cb){
    var query = connection.query('SELECT * FROM "'+table+'" where "PropId"= '+id+' ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}

function getAllPropertyDetails(sessionId,cb){
    var query =  'SELECT fp.*, pi."ImageURL", p.*,c."Name",ca."Area", st."URL", pt."UnitIdentifier" FROM "FavouriteProperties" fp LEFT JOIN "Properties" p ON fp."PropertyID" = p."ID" LEFT JOIN "PropertyImages" pi ON fp."PropertyID" = pi."PropertyID" AND pi."DisplayOrderID" = 0 LEFT JOIN "PropertyType" pt ON p."PropertyTypeID" = pt."ID" LEFT JOIN "Cities" c ON p."CityID" = c."ID" LEFT JOIN "CityArea" ca ON p."AreaID" =ca."ID" LEFT JOIN "SEOTags" st ON  st."PropertyID"= fp."PropertyID" WHERE p."PropertyStatusID" = 3 AND fp."PropertyID" IN (SELECT "PropertyID" FROM "SEOTags") AND fp."UserID" = '+sessionId+' AND fp."IsActive" = true  ORDER BY p."CreatedDate" DESC';
    connection.query(query,(err, results)=>{
    if (err) {
        cb(err);
       console.log(err);
        return;
    }
    
    cb(null, results.rows);
});
}


function getPropertyUnitData(propertyIDS,cb){
    if(propertyIDS && propertyIDS.length > 0){
    var sql = 'SELECT * FROM "PropertyUnitDetails" where "PropertyID" IN( '+propertyIDS+' )';
    connection.query(sql, (err, results) => {
       
        if (err) {
            cb(err);
            return;
        }
        if(results.rows){
            var tempValue = [];
            for (let i = 0; i < results.rows.length; i++) {
                if(results.rows[i].PropertyID != 'undefined'){
                    tempValue.push(results.rows[i]);
                }
            }
     
            cb(null, tempValue);
        }
    });
    }else{
        cb(null, []);
    }
}

function getAutocompleteArray(cb){
    var query = connection.query('SELECT "Location", "Title" FROM "Properties" p order by p."ID"',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
      
        var AutoCompleteArr = [];
        
        for(var i =0; i< results.rows.length; i++){
            AutoCompleteArr.push({'option':results.rows[i].Location});
            AutoCompleteArr.push({'option':results.rows[i].Title});
        }
        cb(null, AutoCompleteArr);
    });
}

function saveGetInTouch(postObj,cb){ // INSERT THE DATA OF GET IN TOUCH.
    var sql = 'INSERT INTO "Enquiry" ("Name", "Email", "Subject", "Message", "IsActive") VALUES ('+"'"+postObj.name+"'"+', '+"'"+postObj.email+"'"+', '+"'"+postObj.subject+"'"+', '+"'"+postObj.email+"'"+', true);';
    var query = connection.query(sql, (err, res) => {
        if (err) {
            var err_msg = "Network Error Occured!";
            cb('err', err_msg);
            return;
        }else{
            cb(null, "Insert record successfully.");
            return
        }
    });
}

/* function getPropertyImages(cb){
    connection.query('SELECT pi."PropertyID", pi."ImageURL" FROM "PropertyImages" pi JOIN "Properties" p ON pi."PropertyID" = p."ID" where p."PropertyStatusID" =3 ORDER BY pi."DisplayOrderID"',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
} */

function RemoveFavourite(data,cb){
    connection.query('DELETE FROM "FavouriteProperties" WHERE "PropertyID"='+data.id+' AND "UserID"='+data.userID+'',(err, results)=>{
            if (err) {
              
                cb(err);
                return;
            }
        cb(null, results);
    }); 
}

module.exports = {
    getPropertyValues:getPropertyValues,
    getAllPropertyDetails:getAllPropertyDetails,
    getAutocompleteArray:getAutocompleteArray,
    saveGetInTouch:saveGetInTouch,
   // getPropertyImages:getPropertyImages,
    RemoveFavourite:RemoveFavourite,
    getPropertyUnitData:getPropertyUnitData
};