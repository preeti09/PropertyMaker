'use strict';
const connection = require("../../db-connection");

function getSinglePropertyDetails(propertyID,cb){
  var sql= 'SELECT  p.*, pd."TotalUnits",pd."TotalFloors",pd."TotalTowers",pd."East",pd."West",pd."South",pd."North",pt."Type",pt."UnitIdentifier", pd."ProjectName",pd."PlanApprovedBy",pd."RERAApproved",pd."RERAApprovalNumber", pd."ExtentOfTotalSiteUnitID",pd."BankLoan", pd."LaunchDate", pd."PossessionDate", pd."PlotLength", pd."PlotWidth", pd."NorthRoadWidth", pd."EastRoadWidth", pd."WestRoadWidth", pd."SouthRoadWidth", pd."ApprovalNumber",pd."ExtentOfTotalSite", ca."Area", c."Name" as city , st."URL",  st."Tags", ST_AsText(pl."Location") as Geometry FROM "Properties" p LEFT JOIN "CityArea" ca ON p."AreaID" = ca."ID" LEFT JOIN "Cities" c ON p."CityID" = c."ID" LEFT JOIN "PropertyType" pt ON p."PropertyTypeID" = pt."ID" LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "PropertyLocations" pl ON p."ID" = pl."PropertyID" LEFT JOIN "SEOTags" st ON  st."PropertyID"= p."ID" WHERE p."ID" = '+propertyID+' AND p."ID" IN (SELECT "PropertyID" FROM "SEOTags")';
  connection.query(sql, (err, results) => {
    if (err) {
      cb(err);
      return;
    }
    connection.query('SELECT "ImageURL" FROM "PropertyImages" WHERE "PropertyID"='+propertyID,(err, Images) => {
      var ImgURL = [];
      if(Images.rows){
        for(var i=0; i < Images.rows.length; i++){
          if(Images.rows[i].ImageURL){
            ImgURL.push(Images.rows[i].ImageURL)
          }
        }
        console.log('ImgURL',ImgURL)
        results.rows[0].Images = ImgURL;
      
        cb(null, results.rows); 
      }else{
        cb(null, []);  
      }
    })
  });
}

function getURLData(URL,cb){
  var SQL = 'SELECT "PropertyID" FROM "SEOTags" WHERE "URL"=\'' +URL+ '\'';
    // console.log(SQL);
  var query = connection.query(SQL, (err, results) => {
    
      if (err) {
          cb(err);
          return;
      }
      
      cb(null,results.rows);
  });
}


function getIndividualPropertyTypeDetail(table,PropertyTypeID,cb){
  var sql = 'SELECT * FROM "'+table+'" WHERE "ID" = \'' + PropertyTypeID +'\' ';
  connection.query(sql, (err, results) => {
      if (err) {
          cb(err);
          return;
      }else if(results.rows.length > 0){
          cb(null, results.rows);
      } else cb(null,[]);
  });
} 

function getAmenities(propertyID,cb){
  var query = 'SELECT "Amenities"."Amenity","Amenities"."Description" FROM "PropertyAmenities" LEFT JOIN "Amenities" ON "PropertyAmenities"."AmenityID" = "Amenities"."ID" WHERE "PropertyAmenities"."PropertyID" = '+propertyID;
  //  console.log('getAmenities==========',query)
  connection.query(query, (err, results) => {
    console.log('Error on Amenities: ',err)
    if (err) {
      cb(err);
      return;
    }
    cb(null, results.rows);
  });
}



function getSpecification(propertyID,cb){

  var query = 'SELECT "PropertySpecifications"."Value", "Specifications"."Specification","Specifications"."Description" FROM "PropertySpecifications" LEFT JOIN "Specifications" ON "PropertySpecifications"."SpecificationID" = "Specifications"."ID" WHERE "PropertySpecifications"."PropertyID" = '+propertyID;
  
  connection.query(query, (err, results) => {
    console.log('Error on Specification: ',err)
    if (err) {
      cb(err);
      return;
    }
    cb(null, results.rows);
  });

}
function getSimilarProperties(propertyID,PropertyTypeID,cb){
    var sql = 'SELECT p.*, a."Name", ca."Area", c."Name" as city, st."URL" FROM "Properties" p LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "Agents" a on p."AgentID" = a."ID" LEFT JOIN "CityArea" ca ON p."AreaID" = ca."ID" LEFT JOIN "Cities" c ON p."CityID" = c."ID" LEFT JOIN "SEOTags" st ON  st."PropertyID"= p."ID" WHERE p."ID" NOT IN( '+propertyID+' ) AND p."PropertyTypeID" = '+PropertyTypeID+' AND p."PropertyStatusID" = 3 AND p."IsActive" = true AND p."ID" IN (SELECT "PropertyID" FROM "SEOTags") ORDER BY p."CreatedDate" DESC  LIMIT 12 ';

    connection.query(sql, (err, results)=>{
    if (err) {
      cb(err);
      return;
    }
    cb(null, results.rows);
  });
}
function getPropertyUnitDetailData(propertyIDS,cb){
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
}

module.exports = {
  getSinglePropertyDetails:getSinglePropertyDetails,
  getAmenities:getAmenities,
  getSpecification:getSpecification,
  getSimilarProperties:getSimilarProperties,
  getURLData:getURLData,
  getPropertyUnitDetailData:getPropertyUnitDetailData,
  getIndividualPropertyTypeDetail:getIndividualPropertyTypeDetail
  
};