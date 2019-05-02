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

function getAllPropertyDetails(cb){

    var query = connection.query('SELECT p.*, pi."ImageURL", pt."UnitIdentifier", pd."North", pd."East", pd."West", st."URL", pd."South" FROM "Properties" p LEFT JOIN "PropertyImages" pi ON p."ID" = pi."PropertyID" AND pi."DisplayOrderID" = 0 LEFT JOIN "PropertyType" pt ON p."PropertyTypeID" = pt."ID" LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "SEOTags" st ON  st."PropertyID"= p."ID"  LEFT JOIN "RecommendedProperties" rp ON  rp."PropertyID"= p."ID" WHERE p."PropertyStatusID" = 3 AND p."IsActive" = true AND p."ID" IN (SELECT "PropertyID" FROM "SEOTags") AND p."ID" IN (SELECT "PropertyID" FROM "RecommendedProperties") ORDER BY p."ID" DESC',(err, results)=>{
        

        if (err) {
            cb(err);
            return;
        }

        cb(null, results.rows);
    });
}

function SearchProperties(res,obj,page,cb){
 //   console.log('in home',obj)
    var where = 'WHERE ';
    var and = '';
    res.clearCookie("propertyType");
    res.clearCookie("filterAreaProperty");
    res.clearCookie("budget_min");
    res.clearCookie("budget_max");
    res.clearCookie("bed");
    res.clearCookie("bath");
    res.clearCookie("cupboards");
    res.clearCookie("road_width");
    res.clearCookie("water_source");
    res.clearCookie("north");
    res.clearCookie("east");
    res.clearCookie("west");
    res.clearCookie("south");
    res.clearCookie("sortby");
    
    if(obj.propertyType){
        res.cookie('propertyType', obj.propertyType);
        where += 'p."PropertyTypeId" = '+obj.propertyType+' ';
        and = 'AND';
    }
    if(obj.filterAreaProperty){
        res.cookie('filterAreaProperty', obj.filterAreaProperty);
        where += and+' (p."GeoLocation" like `'+obj.filterAreaProperty+'%` OR p."Title" like `'+obj.filterAreaProperty+'%`) ';
        and = 'AND';
    }
    if(obj.budget_min){
        res.cookie('budget_min', obj.budget_min);
        where += ''+and+' p."AskingPrice" >='+ obj.budget_min+' ';  
        and = 'AND';
    }
    if(obj.budget_max){
        res.cookie('budget_max', obj.budget_max);
        where += ''+and+' p."AskingPrice" <='+ obj.budget_max+' ';
        and = 'AND';
    }
    if(obj.bed){
        res.cookie('bed', obj.bed);
        where += ''+and+' pup."NumberofBeds" ='+ obj.bed+' ';
        and = 'AND';
    }
    if(obj.bath){
        res.cookie('bath', obj.bath);
        where += ''+and+' pup."NumberofBath" ='+ obj.bath+' ';
        and = 'AND';
    }
    if(obj.cupboards){
        res.cookie('cupboards', obj.cupboards);
        where += ''+and+' p."Cupboards" ='+ obj.cupboards+' ';
        and = 'AND';
    }
    if(obj.road_width){
        res.cookie('road_width', obj.road_width);
        where += ''+and+' ls."Road_Width" ='+ obj.road_width+' ';
        and = 'AND';
    }
    if(obj.water_source){
        res.cookie('water_source', obj.water_source);
        where += ''+and+' pl."WaterSource" ="'+ obj.water_source+'" ';
        and = 'AND';
    }
    if(obj.north || obj.east || obj.west || obj.south){
        res.cookie('north', obj.north);
        res.cookie('east', obj.east);
        res.cookie('west', obj.west);
        res.cookie('south', obj.south);
        where += ''+and+' (p."Facing" ="'+ obj.north+'" OR p."Facing" ="'+ obj.east+'" OR p."Facing" ="'+ obj.west+'" OR p."Facing" ="'+ obj.south+'") ';
    }
    var sort = 'order by p."ID"';
    if(obj.sortby){
        res.cookie('sortby', obj.sortby);
        sort = 'ORDER BY "'+obj.sortby+'"';
    }
    if(where == 'WHERE '){
        where = '';
    }
    
    var start = (page - 1)*20;
    var end = 20; 
   
    var groupby = 'GROUP BY p."ID" order by p."ID"';
    var select = 'p.*,pup.*, pl.WaterSource';
    var count = 'count(*) as count';
    
    var query = connection.query('SELECT count(distinct p."ID") as count FROM "Properties" p LEFT JOIN "Users" a ON p."AgentID" = a."ID" LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "PropertyUnitPlan" pup ON p."ID" = pup."PropertyID" LEFT JOIN "Layout_Sizes" ls ON p."ID" = ls.PropertyID LEFT JOIN "Plots_Lands" pl ON p."ID" = pl."PropertyID" '+where+' '+sort+' ',(err, count)=>{
        
        if (err) {
            cb(err);
            return;
        }

        var query = connection.query('SELECT p.*,pup.*, pl."WaterSource",fap."status" as favourite, fap."user_id" as f_user_id FROM "Properties" p LEFT JOIN "Users" a ON p."AgentID" = a."ID" LEFT JOIN "PropertyDetails" pd ON p."ID" = pd."PropertyID" LEFT JOIN "PropertyUnitPlan" pup ON p."ID" = pup."PropertyID" LEFT JOIN "Layout_Sizes" ls ON p."ID" = ls."PropertyID" LEFT JOIN "Plots_Lands" pl ON p."ID" = pl."PropertyID" LEFT JOIN "Favourite_Property" fap on p."ID" = fap."PropertyID" '+where+' GROUP BY p."ID"  '+sort+' limit '+start+', '+end+'',(err, results)=>{
            
            if (err) {
                cb(err);
                return;
            }
         
            cb(null, results.rows, count.rows[0].count);
        });
        
           
    });
   

}

function getPropertyUnitData(propertyIDS,cb){
   // console.log(propertyIDS)
    if(propertyIDS.length > 0){
        var sql = 'SELECT * FROM "PropertyUnitDetails" where "PropertyID" IN( '+propertyIDS+') ';
        connection.query(sql, (err, results) => {
          //  console.log(sql)
            if (err) {
                cb(err);
                return;
            }
            if(results.rows){
                var tempValue = [];
                var extent = [];
                var out = {
                    unitData : [],
                    extent : []
                }
                for (let i = 0; i < results.rows.length; i++) {
                    if(results.rows[i].PropertyID != 'undefined'){
                        if(tempValue[results.rows[i].PropertyID] == undefined){
                            tempValue[results.rows[i].PropertyID] = [];
                        }
                        if(extent[results.rows[i].PropertyID] == undefined){
                            extent[results.rows[i].PropertyID] = [];
                        }
                        tempValue[results.rows[i].PropertyID].push(results.rows[i]);
                        if(results.rows[i].UnitExtent){
                            extent[results.rows[i].PropertyID].push(results.rows[i].UnitExtent);
                        }else if(results.rows[i].SuperBuiltUpArea){
                            extent[results.rows[i].PropertyID].push(results.rows[i].SuperBuiltUpArea);
                        }
                    }
                }
                out.unitData = tempValue;
                out.extent = extent; 
                cb(null, out);
            }
        });
    }
    else{
    //    console.log('-------------')
        cb(null,[]);
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



function getPropertyImages(cb){
    connection.query('SELECT pi."PropertyID", pi."ImageURL" FROM "PropertyImages" pi JOIN "Properties" p ON pi."PropertyID" = p."ID" where p."PropertyStatusID" =3 ORDER BY pi."DisplayOrderID"',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
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

function getPropertyTypeDetail(table,PropertyType,cb){
    var sql = 'SELECT * FROM "'+table+'" WHERE "ID" = \'' + PropertyType +'\' ';
    
    connection.query(sql, (err, results) => {
      
        if (err) {
            cb(err);
            return;
        }else if(results.rows > 0){
            cb(null, results.rows);
        } else{
            cb(null,[]);
        } 
    });
} 


module.exports = {
    getPropertyValues:getPropertyValues,
    getAllPropertyDetails:getAllPropertyDetails,
    SearchProperties:SearchProperties,
    getAutocompleteArray:getAutocompleteArray,
    saveGetInTouch:saveGetInTouch,
    getPropertyImages:getPropertyImages,
    getPropertyUnitData:getPropertyUnitData,
    getPropertyTypeDetail:getPropertyTypeDetail,
    getIndividualPropertyTypeDetail : getIndividualPropertyTypeDetail,
   
};