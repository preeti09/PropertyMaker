'use strict';
var in_array = require('in_array');
const connection = require("../../db-connection");
const async = require('async');
function SearchProperties(obj, cb) {
    console.log(obj,'object here----------');
  var and = '';
    var area_id = 0;
    var unitDetailsJoin = '';

    var groupby = 'GROUP BY p."ID",a."Name",pt."UnitIdentifier",ca."Area", c."Name",pd."RoadAccess", pl."Location" ,pd."ProjectStatusID", p."AbuttingRoadWidth", pd."RERAApproved",pd."WaterSource", pd."East", pd."West", pd."North", pd."South",st."URL"';
    var where = 'WHERE p."PropertyStatusID" = 3 AND p."IsActive" = true AND '; 
    var join = '';
  
 /*    if(obj.plotSizeMin){
        where += '' + and + '  pd."PlotLength" >= ' + obj.plotSizeMin + ' ';
        and = ' AND';
    }
    if(obj.plotSizeMax){
        where += '' + and +' pd."PlotLength" <= ' + obj.plotSizeMax + ' ';
        and =  ' AND';
    } */
    if (obj.budget_min) {

        if(obj.type == 'Plots'){
            obj.budget_min = obj.budget_min[1];   
        }  else{
            obj.budget_min = obj.budget_min[0];  
        }

        where += ' p."TotalPrice" >= ' + obj.budget_min + ' ';
        and =  ' AND';
    }

    if (obj.budget_max) {

        if(obj.type == 'Plots'){
            obj.budget_max = obj.budget_max[1];   
        }  else{
            obj.budget_max = obj.budget_max[0];  
        }
        
        where += '' + and + ' p."TotalPrice" <= ' + obj.budget_max + ' ';
        and = ' AND';
    }
    
    if (obj.ResaleProperty) {
        where += '' + and + ' p."ResaleProperty" IN(' + obj.ResaleProperty + ') ';
        and = ' AND';
    }

    if(obj.plotSizeMin){
        where +=  '' + and + ' p."Extent" >= ' + obj.plotSizeMin + ' ';
        and =  ' AND';
    }

    if(obj.plotSizeMax){
        where += '' + and + ' p."Extent" <= ' + obj.plotSizeMax + ' ';
        and =  ' AND';
    }

    if (obj.RERA_Approved && obj.RERA_Approved !='all') {

        where += '' + and + ' pd."RERAApproved"IN (' +   obj.RERA_Approved + ') ';
        and = ' AND';
    }

    if (obj.RoadAccess && obj.RoadAccess !='all') {
        where += '' + and + ' pd."RoadAccess" IN(' + obj.RoadAccess + ') ';
        and = ' AND';
    }

    if (obj.WaterSource && obj.WaterSource !='all') {
        where += '' + and + ' pd."WaterSource"  = \'' + obj.WaterSource + '\' ';
        and = ' AND';
    }

/*     if (obj.CityID) {
        console.log('**************');
        
        console.log(obj.CityID);
        where += '' + and + ' p."CityID" = ' + obj.CityID + ' ';
        and = ' AND';
    } */
    

    if (obj.CityID ) {
            where += '' + and + ' p."CityID"  in(' +obj.CityID + ') ';
            and = ' AND';
    }

    if (obj.area_id ) {

        if(typeof area_id == 'object'){
            var area_id = obj.area_id.join(',');
        }else{
            var area_id = obj.area_id;
        }

        where += '' + and + ' p."AreaID" in(' + area_id + ') ';
        and = ' AND';
    }
    
    
    if (obj.PropertyTypeID) {
        where += ' ' + and + ' p."PropertyTypeID" = ' + obj.PropertyTypeID + '';
    }

    if (obj.PropertyTypeChildID) {
        where += ' ' + and + ' p."PropertyTypeChildID" = ' + obj.PropertyTypeChildID + '';
        and = ' AND';
    }

    /* if (obj.posession) {
        var moment = require('moment');
        var currentDate = moment().format('YYYY/MM/DD');
    
        if(typeof obj.posession == 'object'){
            var maxNo = Math.max.apply(null, obj.posession);
            var pastDate = moment().subtract(maxNo, 'years').format('YYYY/MM/DD');
        }

        if(obj.posession == 0){
            var pastDate = moment().subtract(3, 'months').format('YYYY/MM/DD');
        }

        if(typeof obj.posession != 'object' && obj.posession != 0){ 
            var pastDate = moment().subtract(obj.posession, 'years').format('YYYY/MM/DD');
        }
        where += '' + and + ' pd."PossessionDate" BETWEEN \'' + pastDate + '\' AND \'' + currentDate + '\' ';
        and = ' AND'; 
    }
     */
    
    if (obj.facing) {
        var or = 'OR';
        where += '' + and + '';
        if(typeof obj.facing == 'object'){
            for(var i=0; i< obj.facing.length; i++){
                if(i == 0){
                    where += ' ( pd."'+obj.facing[i]+'" = true ';
                }else{
                    where += '' + or + ' pd."'+obj.facing[i]+'" = true ';
                }   
            }
            where += ') ';
        }else{
            where += ' pd."'+obj.facing+'" = true ';
        }
        and = ' AND';
    }
    if (obj.amenities) {
        join += ' JOIN "PropertyAmenities" pa ON p."ID" = pa."PropertyID" ';
        var amenities = obj.amenities;
     
        if(typeof obj.amenities == 'object' ){
            amenities = obj.amenities.join(',');
        }
        where += '' + and + ' pa."AmenityID" IN(' + amenities + ') ';
        and = ' AND';
    }

    if (obj.NumberofBeds) {
        join += ' JOIN "PropertyUnitDetails" pud ON p."ID" = pud."PropertyID" ';
        where += '' + and + ' pud."NumberofBeds" IN(' + obj.NumberofBeds + ' )';
        and = ' AND';
    }


    if (obj.specification) {
        join += ' JOIN "PropertySpecifications" ps ON p."ID" = ps."PropertyID" ';
        var specification = obj.specification;
      
        if(typeof obj.specification == 'object' ){
            specification = obj.specification.join(',');
        }
        where += '' + and + ' ps."SpecificationID" IN(' + specification + ') ';
        and = ' AND';
    }
    
    if (obj.extentMin) {
        where += '' + and + ' p."Extent" >= ' + obj.extentMin + ' ';
        and = ' AND';
    }

    if (obj.extentMax) {
        where += '' + and + ' p."Extent" <= ' + obj.extentMax + ' ';
        and = ' AND';
    }

    if (obj.AbuttingRoadWidthMin) {
        where += '' + and + ' p."AbuttingRoadWidth" >= ' + obj.AbuttingRoadWidthMin + ' ';
        and = ' AND';
    }

    if (obj.AbuttingRoadWidthMax) {
        where += '' + and + ' p."AbuttingRoadWidth" <= ' + obj.AbuttingRoadWidthMax + ' ';
        and = ' AND';
    }
       
    async.waterfall([
        function(callback){
            if(typeof (obj.city) == 'object' && obj.city[1].length > 0 && obj.city[1] != 'All'){

                where += '' + and + ' p."CityID" in (' + obj.city[1] + ') ';
                          and = ' AND';
                          callback();
            }
            else {
                var query = connection.query('SELECT "ID" FROM "Cities" WHERE "Name" = \'' + obj.city + '\' ', (err, cities) => {
                      if (err) {
                          cb(err);
                          return;
                      }
                      if (cities.rows.length > 0) {
                          where += '' + and + ' p."CityID" in (' + cities.rows[0].ID + ') ';
                          and = ' AND';
                      }
                      if (obj.area_id) {
                          area_id = obj.area_id;
                      }
                      callback();
                })
            }
        },
        function(callback){
            if(obj.area){
            var query = connection.query('SELECT "ID" FROM "CityArea" WHERE "Area" IN( \'' + obj.area + '\') ', (err, area) => {
                if (err) {
                    cb(err);
                    return;
                }
                if (area.rows.length > 0 && area_id == 0) {
                    where += '' + and + ' p."AreaID" = ' + area.rows[0].ID + ' ';
                    and = ' AND';
                } else if (area_id != 0) {
                    where += '' + and + ' p."AreaID" IN( ' + area_id + ' )';
                    and = ' AND';
                }
                callback();
            });
        }else{
            callback();
        }
        },
        function(callback){
            var query = connection.query('SELECT "ID" FROM "PropertyType" WHERE "Type" = \'' + obj.type + '\'', (err, type) => {
                if (err) {
                    cb(err);
                    return;
                }

                if (type.rows.length > 0) {
                    where += ' ' + and + ' p."PropertyTypeID" = ' + type.rows[0].ID + '';

                    and = ' AND';
                }

                if (obj.category) {
                    where += ' ' + and + ' p."PropertyTypeChildID" = ' + obj.category + '';

                    and = ' AND';
                }
                callback();
            });
        },
        
        function(callback){
            join += ' JOIN "SEOTags" st ON  st."PropertyID"= p."ID" ';
            where += '' + and + 
            ' p."ID" IN (SELECT "PropertyID" FROM "SEOTags")';
            // if (where == 'WHERE') {
            //     where = '';
            // }
            var SQL = 'SELECT p.*, ST_AsText(pl."Location") as Geometry, a."Name", ca."Area", c."Name" as city, st."URL",pd."ProjectStatusID", pt."UnitIdentifier", pd."RERAApproved", pd."RoadAccess", pd."East",pd."WaterSource",p."AbuttingRoadWidth", pd."West", pd."North", pd."South" FROM "Properties" p LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "PropertyType" pt ON p."PropertyTypeID" = pt."ID" LEFT JOIN "Agents" a on p."AgentID" = a."ID" LEFT JOIN "CityArea" ca ON p."AreaID" = ca."ID" LEFT JOIN "Cities" c ON p."CityID" = c."ID" LEFT JOIN "PropertyLocations" pl ON p."ID" = pl."PropertyID" '+join+' ' + where + ' '+groupby+' ORDER BY p."CreatedDate" DESC';
            console.log(SQL,'***********');
            var query = connection.query(SQL, (err, results) => {
                
                if (err) {
                    callback(err);
                    return;                       
                }
                callback(null,results.rows);
                
            });
        }
    ],function(FinalError,FinalResponse){
        
        cb(null, FinalResponse);
    });

}

function Message(obj,cb){

    var where = '';
    var and = '';
    
    if(obj.category || obj.categoryname) { 
        if(obj.categoryname){
            where += '"PropertyTypeChild"= \''+obj.categoryname+'\'';
            and = 'AND';
        }
        if(obj.category){
            where += '"ID"='+obj.category;
        }
        if(obj.PropertyTypeChildID){
            where += '"ID"='+obj.PropertyTypeChildID;
        }
        var SQL = 'SELECT "SearchTypeChild" FROM "PropertyTypeChild" WHERE'+where+' ';

        connection.query(SQL, (err, results) => {
         
            if (err) {
                cb(err);
                return;
            }
            if(results.rows[0]){
                cb(null,results.rows[0].SearchTypeChild);
            }else{
                cb(null,[]);
            }
            
        });
    }
    else if(obj.PropertyTypeID || obj.type) {
        if(obj.PropertyTypeID){
            where += '"ID"='+obj.PropertyTypeID;
            and = 'AND';
        }
        if(obj.type){
          
            where += ''+and+' "Type"= \''+obj.type+'\'';
        }
        var SQL = 'SELECT "SearchType" FROM "PropertyType" WHERE '+where+' ';
        var query = connection.query(SQL, (err, results) => {
           
            if (err) {
                cb(err);
                return;
            }
            if(results.rows){
                cb(null,results.rows[0].SearchType);  
            }
        });
    }else{
        cb(null,'Properties');
    }

}

function getURIData(URI,cb){
    //console.log('-------------------',URI);
    var SQL = 'SELECT * FROM "SEOPages" WHERE "URI"=\'' +URI+ '\'';
    //console.log('---------',SQL)
    var query = connection.query(SQL, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
      //  console.log(results.rows,'-------------');
        cb(null,results.rows);
    });
}

function getCityAreaByProperty(obj,cb) {
    var and = '';
    if(obj.city && obj.city != 'All'){
        and = 'AND "CityID" IN (SELECT "ID" FROM "Cities" WHERE "Name" = \'' + obj.city + '\')';
    }else{
        and = 'AND "CityID" IN (SELECT "ID" FROM "Cities")';
    }
    var SQL = 'SELECT * FROM "CityArea" where "ID" IN (SELECT "AreaID" FROM "Properties" ) '+and+' Order by "Area" ASC ';
    
    var query = connection.query(SQL, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
        
        cb(null, results.rows);
    });
}

function getPropertyImages(propertyIDS,cb) {
    
    var sql = 'SELECT "PropertyID", "ImageURL" FROM "PropertyImages" where "PropertyID" IN ('+propertyIDS+')';
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }else{
            var tempValue = [];
            
           
            if(results.rows.length){
                for (let i = 0; i < results.rows.length; i++) {
                    if(typeof tempValue[results.rows[i].PropertyID] == 'undefined'){
                        tempValue[results.rows[i].PropertyID] = [];
                    }
                    tempValue[results.rows[i].PropertyID].push(results.rows[i]['ImageURL']);
                }
                cb(null, tempValue);
            }else{
                cb(null, tempValue);
            }
        }
    });
}


function getPropertyTypeDetail(table,PropertyType,cb){
    var sql = 'SELECT * FROM "'+table+'" WHERE "Type" = \'' + PropertyType +'\' ';
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
} 

function getPropertyUnitData(propertyIDS,cb){
    var sql = 'SELECT * FROM "PropertyUnitDetails" where "PropertyID" IN( '+propertyIDS+' )';
    connection.query(sql, (err, results) => {
  
        if (err) {
            cb(err);
            return;
        }
        if(results.rows){
            var tempValue = [];
            for (let i = 0; i < results.rows.length; i++) {
                if(tempValue[results.rows[i].PropertyID] == undefined){
                    tempValue[results.rows[i].PropertyID] = [];
                }   
                tempValue[results.rows[i].PropertyID].push(results.rows[i]);
            }
            cb(null, tempValue);
        }
    });
}


module.exports = {
    SearchProperties: SearchProperties,
    getCityAreaByProperty: getCityAreaByProperty,
    getPropertyImages: getPropertyImages,
    getPropertyUnitData:getPropertyUnitData,
    getURIData:getURIData,
    Message:Message,
    getPropertyTypeDetail :getPropertyTypeDetail
    //getSpecificationByAdvance:getSpecificationByAdvance,
   // getCityAreaInAdvance:getCityAreaInAdvance,

};










