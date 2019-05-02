const connection = require(__dirname+"/db-connection");
const connection1 = require(__dirname+"/db-connection1");

var each = require('foreach');
var logger = require('./logger').Logger;

function selectAll(table,cb){
    var query = connection.query('SELECT * FROM "'+table+'" ',(err, results)=>{
        if (err) {
            console.log(err);
            cb(err);
            return;
        }
        
        cb(null, results.rows);
    });
}

function customQuery(obj,cb){
    var query = connection.query('SELECT * FROM "'+ obj.table+'" ORDER BY "'+ obj.orderby +'" ',(err, results)=>{
        if (err) {
            console.log(err);
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}


function deletedata(table, where, cb){
   // console.log('*************table',table)
    var query = connection.query('DELETE FROM "'+table+'" WHERE "'+ where.Key+'" = '+ where.ID,(err, results)=>{
       console.log('DELETE FROM "'+table+'" WHERE "'+ where.Key+'" = '+ where.ID);
        if (err) {
            cb(err);
            return;
        }
        cb(null, results);
    });     
}

function updateData(table, obj, where, cb){
    var obj = jsonToUpdateString(obj);
    var query = connection.query('UPDATE "'+table+'" SET '+obj+' WHERE "'+ where.Key+'" = '+ where.ID ,(err, results)=>{
        console.log('UPDATE "'+table+'" SET '+obj+' WHERE "'+ where.Key+'" = '+ where.ID)
        if (err) {
            console.log(err);
            cb(err);
            return;
        }
        
        var query = connection.query('SELECT max("ID") as ID FROM "'+table+'"', (err, res) => {
            if (err) {
                cb(err);
                return;
            }
            cb(null,res.rows[0].id);
        });
    });
}

function insertData(table,obj,cb){
    
    var obj = jsonToString(obj);
    var query = connection.query('INSERT INTO "'+table+'" ('+obj.key+') values '+   obj.values+'', (err, res) => {
    console.log('INSERT INTO "'+table+'" ('+obj.key+') values '+obj.values+'');
        console.log('err in insertData: =========== ',err);
        if (err) {
         
        logger.error(err+' --------- '+'INSERT INTO "'+table+'" ('+obj.key+') values '+obj.values+'');
            cb(err);
            return;
        }
        var query = connection.query('SELECT max("ID") as ID FROM "'+table+'"', (err, res) => {
            if (err) {
                cb(err);
                return;
            }
            //  console.log(res.rows[0].id,'-------------')
            cb(null,res.rows[0].id);
        });
    });
}

function getCredential(table, key, cb){
    var query = connection.query('SELECT * FROM "'+table+'" WHERE "key" ="'+key+'" ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}

function getFavourite(table,Propid,user_id,cb){
    var query = connection.query('SELECT * FROM "'+table+'" WHERE "Propid"='+Propid+' AND "user_id"='+user_id+' ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}


function getFavouriteData(table,user_id,cb){
    if(user_id){
    var query = 'SELECT "PropertyID" FROM "'+table+'" WHERE "UserID"='+user_id+'';
    connection.query(query,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
   }else{
       cb(null,[]);
   }
}

function saveFavourite(table,data,cb){
    var query = connection.query('SELECT * FROM "'+table+'" WHERE "PropertyID"='+data[0].PropertyID+' AND "UserID"='+data[0].UserID+' ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        if(results.rows.length > 0){
            //var status = (results.rows[0].IsActive) ? false : true; 
            var query = connection.query('DELETE FROM "'+table+'" WHERE "PropertyID"='+data[0].PropertyID+' AND "UserID" = '+data[0].UserID+'',(err, results)=>{
                if (err) {
                    cb(err);
                    return;
                }
                cb(null, results);
            });     
        }else{
            insertData(table,data,cb)
        }
    });
}

function getPopularPost(cb){
    var query = connection.query('SELECT * FROM "Properties" order by "ID" DESC limit 3 ',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
    
}

function getDataByID(table,key,val,cb){  
    var query = 'SELECT * FROM "'+table+'" WHERE "'+key+'" = '+val+' ';
    // console.log('******************',query)
    connection.query(query,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        // console.log('---------',results.rows);
        cb(null, results.rows);
    });
}

function getNameByID(table,propertyID,key,cb){
    var query = connection.query('SELECT "'+key+'" FROM "'+table+'" where "ID" = '+propertyID+'',(err, results)=>{ 
        if (err) {
        console.log(err);
            cb(err);
            return;
        }
        cb(null,results);
    });
}

function getPropertyType(cb){
    var query = connection.query('SELECT * FROM "PropertyType"',(err, results)=>{   
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows); 
    });
}

function getPropertyCategory(cb){
    var query = connection.query('SELECT * FROM "PropertyTypeChild"',(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}

function jsonToString(data){
    // console.log(data,'---------')
    var keys = '';
    var values = '';
    each(data, function (value, key, object) {
        
        keys = '';
        var temp = '';
        values += '(';
        each(value, function (value1, key1, object1) {
            keys += '"'+ key1 +'",';
            if(value1 == null){
                temp += value1+',';
                console.log(key1,value1+',');
            }else{
                temp += '\''+value1+'\',';
                console.log(key1,value1+',');
            }
        });
        values += temp.slice(0,-1)+'),';    
    });
    keys = keys.slice(0,-1);
    values = values.slice(0,-1);
    return {key:keys,values:values}; 
}


function jsonToUpdateString(data){
    // console.log(data,'-----------data')
    var str = '';
    each(data, function (value, key, object) {       
        if(value == null){
            str += '"'+ key +'"='+value+',';
        }else{
            str += '"'+ key +'"=\''+value+'\',';
        }
    });
    str = str.slice(0,-1);
    console.log(str,'------------str')
    return str; 
}  


/* function jsonToUpdateString(data){
    console.log(data,'-----------data')
    var str = '';
    each(data, function (value, key, object) {       
        if(value == null){
            str += '"'+ key +'"='+value+',';
        }else{
            str += '"'+ key +'"=\''+value+'\',';
        }
    });
    str = str.slice(0,-1);
    console.log(str,'------------str')
    return str; 
} */

function getRecommemded(cb){
    var sql = 'SELECT "PropertyID" FROM "RecommendedProperties" WHERE "IsActive" = true';
    var query = connection.query(sql,(err, results)=>{
        if (err) {
            cb(err);
            return;
        }
        cb(null, results.rows);
    });
}

function checkRedirectURL(url){
    url = url.slice(url.indexOf('?') + 1).split('&');


    status = 0;
    
    for (var i = 0; i < url.length; i++) {  
        var urlparam = url[i].split('=');  
        if(urlparam[0] == 'redirectTo'){
            status = 2;
        }
    }
    if(url.length > 2 && status == 2){
        status = 2;
    }
    if(url.length > 1 && status == 0){
        status = 1;
    }
    return status;
}

function getPriceTrends(next){ // PREPARE THE DYNAMIC DATA FOR PRICE TRENDS MAP WITH ALL VALUES.
    var async = require('async');
    var moment = require('moment');
    var fs = require('fs');
    var geoJson = {};
    var priceHistoryData = [];
    var dates = [];
    async.waterfall([
        function(cb){
            geoJson = JSON.parse(fs.readFileSync('apcrda_villages.geo.json'));
            cb(null,geoJson);
        },
        function(geoJson,cb){
            var SQL = 'SELECT * FROM "PriceHistory"';
            connection1.query(SQL, (err,data) => {
                    data.rows.sort(function (a, b) {
                        return a['PriceDate'] - b['PriceDate'];
                    });
                priceHistoryData = data;
                if(err){
                    cb(err,priceHistoryData);
                }else{
                    if(priceHistoryData.rows.length){
                        each(priceHistoryData.rows, function (value, key, object) { 
                            each(geoJson.features, function (element, key1, object) { 
                                var tempValue = {};
                                if (element.properties.v_code == value['VillageID']){
                                    
                                    var tempvalue = [];
                                    each(priceHistoryData.rows, function (priceObj, priceKey, priceObject) {
                                        if(element.properties.v_code == priceObj['VillageID']){
                                            tempvalue.push(priceObj);
                                        }
                                    })
                                   
                                    var date = moment(value['PriceDate']).format('YYYY-MM-DD');
                                    array = {
                                        date:  date,
                                        residential: [ value['ResidentialMin'], value['ResidentialMax'] ],
                                        commercial: [ value['CommercialMin'], value['CommercialMax'] ],
                                        average: [ (value['ResidentialMin']+value['CommercialMin'])/2, (value['ResidentialMax']+value['CommercialMax'])/2 ]
                                    };
                                   
                                    if(element['properties']['prices'] == undefined){
                                        element['properties']['prices'] = {}    
                                    }
                                    element['properties']['prices'][date] = array;
                                    element['properties']['v_name'] = value['Village'];
    
                                    var foundDate = dates.filter( e => e == value.PriceDate); 
                                    if(!foundDate.length){
                                        dates.push(value.PriceDate);
                                    }
                                }
                            });
                        });
                        
                        cb(err,priceHistoryData);
                        
                    }else{
                        cb(err,priceHistoryData);
                    }
                }
            });
        }
    ],function(finalError, finalResponse){
        next(geoJson, dates);
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
        
            var defaultImage = 'https://avenueproperty.s3.ap-south-1.amazonaws.com/images/1529576338069';
            if(results.rows.length){
                for (let i = 0; i < results.rows.length; i++) {
                    if(results.rows[i]['ImageURL'] == ''){
                        results.rows[i]['ImageURL']  = defaultImage;
                    }
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

/* function getPropertyTypeByID(propertyIDS,cb) {
    var sql = 'SELECT * FROM "PropertyType" where "ID" IN ('+propertyIDS+')';
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }else{
            console.log(results,'------------------')
            cb(null,results);
        }
    });
} */


function getPropertyUnitData(propertyIDS,cb){
    var sql = 'SELECT * FROM "PropertyUnitDetails" where "PropertyID" IN( '+propertyIDS+' )';
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
        if(results.rows.length){
            var tempValue = [];
            for (let i = 0; i < results.rows.length; i++) {
                if(typeof tempValue[results.rows[i].PropertyID] == 'undefined'){
                    tempValue[results.rows[i].PropertyID] = [];
                }
                tempValue[results.rows[i].PropertyID].push(results.rows[i]);
            }
            cb(null, tempValue);
            // cb(null, results.rows); 
        }
        else{
            var tempValue = [];
            cb(null, tempValue);
        }
    });
}

function YouTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }

function currencyFormat(input) {
   //console.log('*********',input);
    input=input.toString();
    var lastThree = input.substring(input.length-3);
    var otherNumbers = input.substring(0,input.length-3);
    if(otherNumbers != ''){
        lastThree = ',' + lastThree;
    }
    input = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    var a = input.split(',');
    
    var p = '';
    if(a.length == 4){
        p += a[0];
        if(a[1] != 00){
            p += '.'+a[1];
        }
        p += ' Cr';
    }else
    if(a.length == 3){
        p += a[0];
        if(a[1] != 0){
            p += '.'+a[1];
        }
        p += ' L';
    }else
    if(a.length == 2){
        p += a[0];
        if(a[1] != 00){
            p += '.'+a[1][0];
        }
        p += ' K';
    }else{
        p = input;
    }
    return p;
}

function getMonthName(input){
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"]; 
    var month = monthNames[input];
    return month;
}

function getTags(url, cb){
    // console.log(url,'----------------------------------');
    var sql = 'SELECT "Tags" FROM "SEOTags" where "URL" = \''+url+'\'';
    connection.query(sql, (err, results) => {
        if (err) {
            cb(err);
            return;
        }
      //  console.log('------------',results.rows)
        if(results.rows.length > 0){
            cb(null, results.rows[0].Tags);
        }else{
            cb(null,[]);
        }
    });

}

module.exports = {
    selectAll:selectAll,
    getCredential:getCredential,
    getFavourite:getFavourite,
    saveFavourite:saveFavourite,
    getPopularPost:getPopularPost,
    insertData:insertData,
    getPropertyType:getPropertyType,
    getPropertyCategory:getPropertyCategory,
    jsonToString:jsonToString,
    jsonToUpdateString:jsonToUpdateString,
    getRecommemded:getRecommemded,
    checkRedirectURL:checkRedirectURL,
    getPriceTrends:getPriceTrends,
    getMonthName : getMonthName,
    currencyFormat:currencyFormat,
    getPropertyImages:getPropertyImages,
    getPropertyUnitData:getPropertyUnitData,
    getFavouriteData:getFavouriteData,
    getDataByID:getDataByID,
    YouTubeGetID:YouTubeGetID,
    getNameByID:getNameByID,
    getTags:getTags,
    customQuery:customQuery,
    updateData:updateData,
    deletedata:deletedata
   // getPropertyTypeByID:getPropertyTypeByID,

};

   