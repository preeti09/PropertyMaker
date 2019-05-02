'use strict';
const connection = require("../../db-connection");

function apiIsTitleExists(propertyTitle,cb){
  var query = 'SELECT * FROM "Properties" WHERE "Title" = \''+propertyTitle+'\' ';
  connection.query(query, (err, results)=>{
   
    if (err) {
      cb(err);
      return;
    }
    cb(null, results.rows);
  });
}

function getEditpropertiesData(ID,cb){
    if(ID){
        var query = 'SELECT  p.*, ca."Area" ,c."Name" as city , ST_AsText(pl."Location") as Geometry FROM "Properties" p LEFT JOIN "CityArea" ca ON p."AreaID" = ca."ID" LEFT JOIN "Cities" c ON p."CityID" = c."ID"  LEFT JOIN "PropertyLocations" pl ON p."ID" = pl."PropertyID"  WHERE p."ID" ='+ID;
        connection.query(query,(err, results)=>{
            if (err) {
                console.log(err,'--------------')
                return;
            }
            cb(null, results.rows);
        });
    } else{
    cb(null,[]);
    }
}

function getEditpropertiesDetailData(ID,cb){
    //console.log(ID,"--------------getEditpropertiesDetailData")
        if(ID){
        var query = 'SELECT  pd.*, pa."Authority" FROM "PropertyDetails" pd LEFT JOIN "PlanApprovalAuthority" pa ON pd."PlanApprovedBy" = pa."ID" WHERE pd."PropertyID" ='+ID;
      //  console.log(query)
        connection.query(query, (err, results) => {
          //  console.log('---------------',results.rows[0])
            if (err) {
                cb(err);
                return;
            }else if(results.rows[0]){
                cb(null,results.rows[0]);
            }else{
                cb(null,[]);
            }
            
        });
    }
}

function EditImagesdata(ID,cb){
    var sql = 'SELECT "ImageURL" FROM "PropertyImages" where "PropertyID" =' +ID;
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }else
       /*  {
            var tempValue = [];
            var Edit_tempValue = [];
           
            if(results.rows.length){
                for (let i = 0; i < results.rows.length; i++) {
                    if(typeof tempValue[results.rows[i].PropertyID] == 'undefined'){
                        tempValue[results.rows[i].PropertyID] = [];
                    }
                    tempValue.push(results.rows[i]['ImageURL']);
                    Edit_tempValue = (results.rows[i]['ImageURL']);
                }
                console.log(tempValue);
                console.log(Edit_tempValue,'Edit_tempValue')
                cb(null, Edit_tempValue);
            }else{
                cb(null, Edit_tempValue);
            }
        } */
            
            var tempValue = [];
            var filterImages = [];
            
            if(results.rows.length){
                for (let i = 0; i < results.rows.length; i++) {
                  /*   if(typeof tempValue == '' ){
                        tempValue = [];
                    } */
                    tempValue.push(results.rows[i]['ImageURL']);
                }

             //   var filterImages = tempValue.split(',');
               // console.log('==============',tempValue)
                cb(null, tempValue);
            }else{
                cb(null, tempValue);
            }
    });
}

function getEditpropertyUnitData(table,ID,cb){
    if(ID){
        var query = 'SELECT * FROM "'+table+'" WHERE "PropertyID" = '+ID+'';
        connection.query(query,(err, results)=>{
            if (err) {
                console.log(err,'--------------')
                return;
            }
            cb(null, results.rows);
        });
        } else{
        cb(null,[]);
    }
}

function getEditpropertySpecificationData(ID,cb){
    if(ID){
        var query = 'SELECT "PropertySpecifications"."Value","PropertySpecifications"."SpecificationID", "Specifications"."Specification","Specifications"."Description" FROM "PropertySpecifications" LEFT JOIN "Specifications" ON "PropertySpecifications"."SpecificationID" = "Specifications"."ID" WHERE "PropertySpecifications"."PropertyID" = '+ID;
        connection.query(query,(err, results)=>{
            if (err) {
                console.log(err,'--------------')
                return;
            }
            cb(null, results.rows);
        });
        } else{
        cb(null,[]);
    }
}

function getEditpropertyAmenityData(ID,cb){
    if(ID){
        var query = 'SELECT "PropertyAmenities"."AmenityID", "Amenities"."Amenity","Amenities"."Description" FROM "PropertyAmenities" LEFT JOIN "Amenities" ON "PropertyAmenities"."AmenityID" = "Amenities"."ID" WHERE "PropertyAmenities"."PropertyID" = '+ID;;
        connection.query(query,(err, results)=>{
            if (err) {
                console.log(err,'--------------')
                return;
            }
            cb(null, results.rows);
        });
        } else{
        cb(null,[]);
    }
}

function userDetail(table,user_id,cb){
  if(user_id){
    var query = 'SELECT "Name" FROM "'+table+'" WHERE "ID"='+user_id+'';
    connection.query(query,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
    } else{
        cb(null,[]);
    }
}

module.exports = {
    apiIsTitleExists : apiIsTitleExists,
    getEditpropertiesData : getEditpropertiesData,
    getEditpropertiesDetailData : getEditpropertiesDetailData,
    getEditpropertyUnitData : getEditpropertyUnitData,
    getEditpropertySpecificationData : getEditpropertySpecificationData,
    getEditpropertyAmenityData : getEditpropertyAmenityData,
    userDetail : userDetail,
    EditImagesdata : EditImagesdata,
};