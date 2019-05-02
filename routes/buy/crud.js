var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const config = require('../../config');
const async = require('async');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);
const seoModel = require("../seo/model-cloudsql");

router.get('/', function (req, res, next) {
    getModel.getURIData(req.originalUrl.slice(1), (err, results) => {
       
        if (err) {
            return;
        }
        var obj = {
            CityID: results[0].CityID,
            area_id: results[0].CityAreaID,
            PropertyTypeID: results[0].PropertyTypeID,
            category: results[0].PropertyTypeChildID,
            type: ''
        };
        FilterProperty(req, res, obj);
    });
});

router.get('/search', function (req, res, next) { 
    
    req.session.redirect = req.headers.referer +'buy'+ req.url;
    var obj = req.query;
    
    FilterProperty(req, res, obj);
});

function FilterProperty(req, res, obj) {
    var mapLocations = [];
    var cities = [];
    var Amenities = [];
    var Specifications = [];
    var propertyType = [];
    var cityArea = [];
    var propertyCategory = [];
    var recommemdedIds = [];
    var propertyResult = [];
    var seoData = {};
    var PropertyStatus = [];
    var ImageGallery = [];
    var UnitData = [];
    var PropertyLocations = [];
    var Message = '';
    var MetaTags;
    var favoriteData =[];
    var UnitIdentifier = '';
    
    async.waterfall([
        function(callback){ // GET MESSAGE.  
            getModel.Message(obj,(err,ResponseMsg)=>{
                if (err) { 
                    return; 
                }
                Message = ResponseMsg;
                callback();
            });
        },
        function (callback) { 
           // console.log('seoModel');
            var fullURL = 'https://' + req.get('host') + req.originalUrl;
            seoModel.checkUrl_Exists(fullURL, (err, seoResponse) => {
                seoData = seoResponse.msg;
                if (err) {
                    return;
                }
            });
            callback(null, fullURL);
        },

        function (data, callback) { // GET ALL CITIES.
           // console.log('CITIES');
            commonFunction.selectAll('Cities', (err, Cities) => {
                if (err) {
                    return;
                }
                cities = Cities;
                callback(err, cities);
            });
        },
        function (dataInWaterFall, callback) { // FAVORITE DATA
            //console.log('FAVORITE');
            commonFunction.getFavouriteData('FavouriteProperties',req.session.user_id,(err, getFavouriteData) => {
                if (err) {
                    return;
                }
                
                getFavouriteData.forEach(element => {
                    favoriteData.push(element.PropertyID);
                });
                callback(err, favoriteData);
            });
        },
        function (dataInWaterFall, callback) { // GET ALL AMENITIES
            //console.log('AMENITIES');
            commonFunction.selectAll('Amenities', (err, amenities) => {
                if (err) {
                    return;
                }
                Amenities = amenities;
                callback(err, Amenities);
            });
        },
        function (dataInWaterFall, callback) { // GET ALL PROJECTSTATUS
            //console.log('PROJECTSTATUS');
            commonFunction.selectAll('ProjectStatus', (err, Status) => {
                if (err) {
                    return;
                }
                Status.forEach(item => {
                    if (typeof PropertyStatus[item.ID] == 'undefined') {
                        PropertyStatus[item.ID] = '';
                    }
                    PropertyStatus[item.ID] = item.Status;
                });
                callback(err, PropertyStatus);
            });
        },
        function (dataInWaterFall, callback) { // GET ALL SPECIFICATIONS
            //console.log('SPECIFICATIONS');
            commonFunction.selectAll('Specifications', (err, specifications) => {
                if (err) {
                    return;
                }
                Specifications = specifications;
                callback(err, Specifications);
            });
        },
        function (dataInWaterFall, callback) { // GET PROPERTY TYPE
            commonFunction.selectAll('PropertyType', (err, PropertyType) => {
                if (err) {
                    return;
                }
                for(var i=0; i< PropertyType.length; i++){
                    if(PropertyType[i].Type == req.query.type ){
                        UnitIdentifier = PropertyType[i].UnitIdentifier;
                    }
                }
                propertyType = PropertyType;
                callback(err, propertyType);
            });
        },
        function (dataInWaterFall, callback) { // GET CITY AREA BY PROPERTY
           // console.log('CITY AREA BY PROPERTY');
            getModel.getCityAreaByProperty(obj, (err, CityArea) => {
              //  console.log('obj',obj);
                if (err) {
                    return;
                }
                cityArea = CityArea;
                callback(err, cityArea);
            });
        },
       
   /*      function (dataInWaterFall, callback) { // GET PROPERTY TYPE CHILD
            //console.log(' PROPERTY TYPE CHILD');
            commonFunction.selectAll('PropertyTypeChild',(err, PropertyCategory) => {
                if (err) {
                    return;
                }
                propertyCategory = PropertyCategory;
                callback(err, propertyCategory);
            });
        }, */
        function (dataInWaterFall, callback) { // GET PROPERTY TYPE CHILD
            var obj = {
                table : 'PropertyTypeChild',
                orderby : 'PropertyTypeChild',
            }
            commonFunction.customQuery(obj, (err, PropertyCategory) => {
                if (err) {
                    return;
                }
                propertyCategory = PropertyCategory;
                callback(err, propertyCategory);
            });
        },
        function (dataInWaterFall, callback) { // GET RECOMMENDED
           // console.log('RECOMMENDED');
            commonFunction.getRecommemded((err, recommemded) => {
                if (err) {
                    return;
                }
                for (var i = 0; i < recommemded.length; i++) {
                    recommemdedIds.push(recommemded[i].PropertyID);
                }
                callback(err, recommemded);
            });
        },       
        function (dataInWaterFall, callback) {
            commonFunction.getTags(req.originalUrl, (err, Tags) => {

                if (Tags) {
                    MetaTags = Tags
                }
                callback(err, Tags);
            });
        },  
        function (dataInWaterFall, callback) { // GET ALL SEARCHED PROPERTY
        getModel.SearchProperties(obj, (err, propertyResults) => {
                propertyResult = propertyResults;
                var propertyIDS =[]; 
                if(propertyResults.length > 0){              
                for(var i = 0; i < propertyResults.length; i++){

                var propertyIDS = [];

                for (var i = 0; i < propertyResults.length; i++) {
                    propertyIDS.push(propertyResults[i].ID);
                    if (propertyResults[i].geometry) {
                     //   console.log(propertyResults[i],'********')
                        PropertyLocations.push({
                            geometry: propertyResults[i].geometry,
                            ID: propertyResults[i].ID
                        
                        });
                    }
                   // console.log(propertyIDS);
                } 

                getModel.getPropertyImages(propertyIDS, (imageErr, imageData) => {

                    ImageGallery = imageData;
                    getModel.getPropertyUnitData(propertyIDS, (unitErr, unitData) => {
                        
                        UnitData = unitData;
                     callback();
                    });
                });
            }

            }else{
                callback();
            }
        }); 
    }
    ], function (FinalError, FinalResponse) { 
        // PAGE RANDER WITH ALL SEARCHED PROPERTY DATA
            res.render('properties-details', {
            title: 'Search',
            sess_val: req.session.user_id,
            UnitIdentifier : UnitIdentifier,
            subscribe_email:req.session.email,
            propertyResult: propertyResult,
            propertyResultStr: JSON.stringify(mapLocations),
            cities: cities,
            propertyType: propertyType,
            cityArea: cityArea,
            propertyCategory: propertyCategory,
            query: obj,
            recommemdedIds: recommemdedIds,
            Amenities: Amenities,
            Specifications: Specifications,
            seoData: seoData,
            PropertyStatus: PropertyStatus,
            currencyFormat: commonFunction.currencyFormat,
            YouTubeGetID : commonFunction.YouTubeGetID,
            GalleryImage: ImageGallery,
            UnitTableData: UnitData,
            PropertyLocations: PropertyLocations,
            Message: Message,
            favoriteData: favoriteData,
            userName: req.session.name,
            showAdvanceSearch: true,
            Tags: MetaTags,
            Meta_tags : './metadata/buy_search_meta'
        }); 
        // res.render('search-new', {
        //     title: 'Search',
        //     sess_val: req.session.user_id,
        //     UnitIdentifier : UnitIdentifier,
        //     subscribe_email:req.session.email,
        //     propertyResult: propertyResult,
        //     propertyResultStr: JSON.stringify(mapLocations),
        //     cities: cities,
        //     propertyType: propertyType,
        //     cityArea: cityArea,
        //     propertyCategory: propertyCategory,
        //     query: obj,
        //     recommemdedIds: recommemdedIds,
        //     Amenities: Amenities,
        //     Specifications: Specifications,
        //     seoData: seoData,
        //     PropertyStatus: PropertyStatus,
        //     currencyFormat: commonFunction.currencyFormat,
        //     YouTubeGetID : commonFunction.YouTubeGetID,
        //     GalleryImage: ImageGallery,
        //     UnitTableData: UnitData,
        //     PropertyLocations: PropertyLocations,
        //     Message: Message,
        //     favoriteData: favoriteData,
        //     userName: req.session.name,
        //     showAdvanceSearch: true,
        //     Tags: MetaTags,
        //     Meta_tags : './metadata/buy_search_meta'
        // }); 
    });
}

router.get('/filter', function (req, res, next) {  

    commonFunction.getRecommemded((err, recommemded) => {                         
        recommemdedIds = [];
        propertyResult = [];
        ImageGallery = [];
        UnitData = [];
        favoriteData = [];
        PropertyLocations = [];
        cityArea = [];
        Message = '';
        UnitIdentifier = '';
        for (var i = 0; i < recommemded.length; i++) {
            recommemdedIds.push(recommemded[i].PropertyID);
        }

        getModel.SearchProperties(req.query, (err, propertyResults) => {
            propertyResult = propertyResults;
            async.waterfall([
                function(cb){ // GET MESSAGE.

                  //  console.log(req.query);
                    getModel.Message(req.query, (err,ResponseMsg)=>{
                        if (err) { 
                            return; 
                        }
                        Message = ResponseMsg;
                        commonFunction.getFavouriteData('FavouriteProperties',req.session.user_id,(err, getFavouriteData) => {
                            if (err) {
                                return;
                            }
                            getFavouriteData.forEach(element => {
                                favoriteData.push(element.PropertyID);
                            });
                        });
                        cb();
                    });
                },
                function (cb) {
                    var propertyIDS = [];
                    if( propertyResult && propertyResult.length > 0){
                        for (var i = 0; i < propertyResult.length; i++) {
                            propertyIDS.push(propertyResult[i].ID);
                            if (propertyResult[i].geometry) {
                                PropertyLocations.push({
                                    geometry: propertyResult[i].geometry,
                                    ID: propertyResult[i].ID
                                });
                            }
                        }
                    }
                   
                    getModel.getPropertyImages(propertyIDS, (imageErr, imageData) => {
                        ImageGallery = imageData;
                        getModel.getPropertyUnitData(propertyIDS, (unitErr, unitData) => {
                            UnitData = unitData;
                            cb();
                        });
                    });

                },
                function(cb){
                    commonFunction.selectAll('PropertyType', (err, PropertyType) => {
                        if (err) {
                           // cb();
                            return;
                        }
                        for(var i=0; i< PropertyType.length; i++){
                            if(PropertyType[i].Type == req.query.type){
                                UnitIdentifier = PropertyType[i].UnitIdentifier;
                            }
                        }
                        cb();
                    });
                }

            ], function (finalError, finalResponse) {
                // console.log(propertyResult,'-----propertyResult')
                var data = {
                    recommemdedIds: recommemdedIds,
                    propertyResult: propertyResult,
                    GalleryImage: ImageGallery,
                    UnitTableData: UnitData,
                    PropertyLocations: PropertyLocations,
                    Message: Message,
                    UnitIdentifier: UnitIdentifier,
                    favoriteData: favoriteData
                };
                res.send(data);
            });
        });
    });
   
});


module.exports = router;