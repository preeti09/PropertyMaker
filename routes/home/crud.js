var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
const nodemailer = require('nodemailer');
const config = require('../../config');
const seoModel = require("../seo/model-cloudsql");
const async = require('async');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);
var each = require('foreach');
var LivePg = require('pg-live-select');
var buyModule = require('../buy/model-cloudsql');
var singlePropModule = require('../single-property/model-cloudsql');

var liveDb = new LivePg('postgres://dataissues:dataissues2017!!@avenuepostgre.cdxnapz4fc7w.ap-south-1.rds.amazonaws.com/Avenue', 'myapp');

router.get('/', function (req, res, next) {
    
    var async = require('async');

    var seoData = {}
    async.waterfall([
        function (callback) {
           
            var fullURL = 'https://' + req.get('host') + req.originalUrl;

            seoModel.checkUrl_Exists(fullURL, (err, seoResponse) => {
                seoData = seoResponse.msg;
            });
            callback();
        },
        function (data, callback) {
            commonFunction.getPropertyType((err, propertyType) => {
               
                if (err) {
                    return;
                }

                getModel.getAllPropertyDetails((err, propertyResult) => {
                 
                    if (err) {
                        return;
                    }
                    propertyResult = propertyResult;
                    var propertyIDS = [];

                    for (var i = 0; i < propertyResult.length; i++) {
                        propertyIDS.push(propertyResult[i].ID);
                    }

                    getModel.getPropertyUnitData(propertyIDS, (err, indexunitdata) => {
                       
                        if (err) {
                         
                            return;
                        }
                        getModel.getAutocompleteArray((err, autocpmpleteArr) => {
                            
                            if (err) {
                            
                                return;
                            }
                            commonFunction.getPopularPost((err, popularPost) => {
                                
                                if (err) {
                                    return;
                                }
                                commonFunction.selectAll('CityArea', (err, cityArea) => {
                                    
                                    if (err) {
                                        return;
                                    }
                                    commonFunction.selectAll('Cities', (err, cities) => {
                                       
                                        if (err) {
                                            return;
                                        }

                                        getModel.getPropertyImages((err, PropertyImages) => {
                                            
                                            if (err) {
                                                return;
                                            }
                                            commonFunction.getFavouriteData('FavouriteProperties', req.session.user_id, (err, getFavouriteData) => {
                                               
                                                if (err) {
                                                    return;
                                                }

                                                var images = [];
                                                var favoriteData = [];
                                                getFavouriteData.forEach(element => {
                                                    favoriteData.push(element.PropertyID);
                                                });

                                                PropertyImages.forEach(element => {
                                                    if (typeof images[element.PropertyID] == 'undefined') {
                                                        images[element.PropertyID] = [];
                                                    }
                                                    images[element.PropertyID].push(element.ImageURL);
                                                });
                     
                                                res.render('index', {
                                                    title: 'Home',
                                                    propertyType: propertyType,
                                                    propertyResult: propertyResult,
                                                    autocpmpleteArr: autocpmpleteArr,
                                                    popularPost: popularPost,
                                                    sess_val: req.session.user_id,
                                                    cityArea: cityArea,
                                                    cities: cities,
                                                    images: images,
                                                    seoData: seoData,
                                                    unitData: indexunitdata.unitData,
                                                    userName: req.session.name,
                                                    subscribe_email: req.session.email,
                                                    favoriteData: favoriteData,
                                                    currencyFormat: commonFunction.currencyFormat,
                                                    Meta_tags : './metadata/home_meta', 
                                                });
                                            });
                                        });
                                    })
                                });
                            });
                        });
                    });
                });
            });

        }
    ], function (finalError, finalResponse) {

    });
});

commonFunction.selectAll('SEOPages', function (err, results) {
    if (err) {
        return;
    }
    each(results, function (value, key, object) {
        router.get('/' + value.URI, function (req, res, next) {
            buyModule.getURIData(req.originalUrl.slice(1), (err, results) => {
              
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
    });
});

liveDb.select('SELECT * FROM "SEOPages"', {
    'SEOPages': function (row) {
        
        router.get('/' + row.URI, function (req, res, next) {
            buyModule.getURIData(req.originalUrl.slice(1), (err, results) => {
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
        
    }
});

commonFunction.selectAll('SEOTags', function (err, results) {
    if (err) {
        return;
    }
    each(results, function (value, key, object) {
        if (value.PropertyID) {
            router.get(value.URL, function (req, res) {
                singlePropModule.getURLData(req.originalUrl.split('?')[0], (err, results) => {
                    if (err) {
                        return;
                    }
                    req.session.redirect = req.headers.referer + req.url.slice(1);
                    PropertyID = results[0].PropertyID
                    ShowIndividualProperty(PropertyID, res, req);
                });
            });
        }
    });
});

liveDb.select('SELECT * FROM "SEOTags"', {
    'SEOTags': function (row) {
        if (row.PropertyID) {
            router.get(row.URL, function (req, res) {
                singlePropModule.getURLData(req.originalUrl.split('?')[0], (err, results) => {
                    if (err) {
                        return;
                    }
                    PropertyID = results[0].PropertyID
                    ShowIndividualProperty(PropertyID, res, req);
                });
            });
        }   
    }
});

commonFunction.selectAll('Blog_Post_Redirect', function (err, results) {
    if (err) {
        return;
    }
    each(results, function (value, key, object) {
        router.get(value.URL, function (req, res, next) {
            res.redirect(value.Redirect_URL);
        });
    });
});

liveDb.select('SELECT * FROM "Blog_Post_Redirect"', {
    'Blog_Post_Redirect': function (row) {

        router.get(row.URL, function (req, res) {
            res.redirect(row.Redirect_URL);
        });
    }
});


/* router.get('/2015/10/21/amaravathi-master-plan', function (req, res) {
    res.redirect('https://blog.avenue.in/2015/10/21/amaravathi-master-plan/');
}); */

router.get('/properties-grid', function (req, res, next) {
    var page = req.cookies.page ? req.cookies.page : 1;
    var sortby = req.cookies.sortby ? req.cookies.sortby : '';

    commonFunction.getPropertyType((err, propertyType) => {
        if (err) {
            return;
        }

        getModel.SearchProperties(res, req.cookies, page, (err, propertyResult, count) => {

            if (err) {
                return;
            }

            getModel.getAutocompleteArray((err, autocpmpleteArr) => {
                if (err) {
                    return;
                }

                commonFunction.getPopularPost((err, popularPost) => {
                    if (err) {
                        return;
                    }

                    res.render('properties-grid', {
                        title: 'Properties Grid',
                        propertyResult: propertyResult,
                        propertyType: propertyType,
                        userName: req.session.name,
                        autocpmpleteArr: autocpmpleteArr,
                        count: count,
                        page: page,
                        sortby: sortby,
                        popularPost: popularPost,
                        sess_val: req.session.user_id,
                        subscribe_email: req.session.email
                    });
                });
            });
        });
    });
});

router.post('/properties-grid', function (req, res, next) {

    commonFunction.getPropertyType((err, propertyType) => {
        if (err) {
            return;
        }

        getModel.SearchProperties(res, req.body, 1, (err, propertyResult, count) => {
            if (err) {
                return;
            }

            getModel.getAutocompleteArray((err, autocpmpleteArr) => {
                if (err) {
                    return;
                }

                res.render('properties-grid', {
                    title: 'Properties Grid',
                    propertyResult: propertyResult,
                    propertyType: propertyType,
                    query: req.body,
                    autocpmpleteArr: autocpmpleteArr,
                    count: count,
                    page: 1,
                    sortby: '',
                    sess_val: req.session.user_id,
                    userName: req.session.name,
                    subscribe_email: req.session.email,
                });
            });
        });
    });
});


router.get('/properties-details/:propId', function (req, res, next) {
    var propId = req.params.propId;
    var favoriteData = [];
    if (!req.session.user_id) {
        req.session.redirect = '/properties-details/' + propId;
        // req.flash('error', 'Access denied! Please Login First.', '/');
        res.redirect('/');
        return false;
    }
    if (req.session.profile == false) {
        req.session.redirect = '/properties-details/' + propId;
        res.redirect('/profile');
        return false;
    }


    getModel.getPropertyValues('properties', propId, (err, propertyResult) => {
        getModel.getPropertyValues('Apartments_Projects_Houses', propId, (err, Apartments_Projects_Houses) => {
            getModel.getPropertyValues('Amenities', propId, (err, Amenities) => {
                getModel.getPropertyValues('Specifications', propId, (err, Specifications) => {
                    getModel.getPropertyValues('Floor_Plans', propId, (err, Floor_Plans) => {
                        getModel.getPropertyValues('Layouts', propId, (err, layouts) => {
                            getModel.getPropertyValues('Layout_Sizes', propId, (err, layout_sizes) => {
                                getModel.getPropertyValues('Plots_Lands', propId, (err, Plots_Lands) => {
                                    commonFunction.getFavourite('Favourite_Property', propId, req.session.user_id, (err, Favourite_Property) => {
                                        commonFunction.getPopularPost((err, popularPost) => {
                                            commonFunction.getFavouriteData('FavouriteProperties', req.session.user_id, (err, getFavouriteData) => {
                                                if (err) {
                                                    return;
                                                }
                                                commonFunction.getPropertyType((err, propertyType) => {
                                                    if (err) {
                                                        return;
                                                    }
                                                    getFavouriteData.forEach(element => {
                                                        favoriteData.push(element.PropertyID);
                                                    });

                                                    res.render('properties-details', {
                                                        title: 'Property Details',
                                                        propertyResult: propertyResult,
                                                        userName: req.session.name,
                                                        Apartments_Projects_Houses: Apartments_Projects_Houses,
                                                        Amenities: Amenities,
                                                        propertyType: propertyType,
                                                        Specifications: Specifications,
                                                        Floor_Plans: Floor_Plans,
                                                        layouts: layouts,
                                                        layout_sizes: layout_sizes,
                                                        Plots_Lands: Plots_Lands,
                                                        popularPost: popularPost,
                                                        subscribe_email: req.session.email,
                                                        sess_val: req.session.user_id,
                                                        favoriteData: favoriteData,
                                                        Favourite_Property: Favourite_Property,
                                                        buy_search_meta: true,
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// router.post('/save-as-favourite', function (req, res, next) {
//     req.body.user_id = req.session.user_id;
//     commonFunction.saveFavourite('Favourite_Property',req.body,(err,results) =>{
//         if(err){
//             res.send('Error in saved favourite.');
//         return false;
//         }
//             res.send('Favourite saved successfully.');

//     })
// });

router.post('/getInTouch', function (req, res, next) {
    var postData = req.body;
    var emailQueue = [{
            name: postData.name,
            email: postData.email,
            subject: "Welcome in Avenue",
            message: "Hello " + postData.name + ",\n \n Thank you for expressing your interest in our company"
        }
        /* {
            name: 'Manoj',
            email: 'amw.manojkpatidar@gmail.com',
            subject: 'Someone want to need enquiry. Please have a look when you get a chance.',
            message: 'Someone want to need enquiry. Please have a look when you get a chance.'
        } */
    ];

    getModel.saveGetInTouch(postData, (err, response) => {
        if (err) {
            return;
        } else {

            var transporter = nodemailer.createTransport({

                host: config.get('SMTPHOST'),
                port: config.get('SMTPPORT'),
                secure: true,
                auth: {
                    user: config.get('EMAIL_SENDING_USER'),
                    pass: config.get('EMAIL_SENDING_PASS')
                }
            });

            emailQueue.forEach(element => {
                var mailOptions = {
                    from: config.get('EMAIL_FROM'),
                    to: element.email,
                    subject: element.subject,
                    text: element.message
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.send({
                            status: 'error',
                            message: 'There is some error while inserting details!'
                        });
                        return;
                    } else {
                        res.send({
                            status: 'success',
                            message: 'Save details successfully.'
                        });
                        return;
                    }
                });
            });
        }
    });
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
    var favoriteData = [];
    var MetaTags;
    var UnitIdentifier = '';

    async.waterfall([
        function (callback) { // GET MESSAGE.  
            buyModule.Message(obj, (err, ResponseMsg) => {
                if (err) {
                    return;
                }
                Message = ResponseMsg;
                callback();
            });
        },
        function (callback) {
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
            commonFunction.selectAll('Cities', (err, Cities) => {
                if (err) {
                    return;
                }
                cities = Cities;
                callback(err, cities);
            });
        },
        function (dataInWaterFall, callback) { // GET ALL AMENITIES
            commonFunction.selectAll('Amenities', (err, amenities) => {
                if (err) {
                    return;
                }
                Amenities = amenities;
                callback(err, Amenities);
            });
        },
        function (dataInWaterFall, callback) { // FAVORITE DATA
            commonFunction.getFavouriteData('FavouriteProperties', req.session.user_id, (err, getFavouriteData) => {
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
                    if(PropertyType[i].Type == req.query.type || PropertyType[i].ID == obj.PropertyTypeID){
                        UnitIdentifier = PropertyType[i].UnitIdentifier;
                    }
                }
                propertyType = PropertyType;
                callback(err, propertyType);
            });
        },
        function (dataInWaterFall, callback) { // GET CITY AREA BY PROPERTY
            buyModule.getCityAreaByProperty(obj, (err, CityArea) => {
                if (err) {
                    return;
                }
                cityArea = CityArea;
                callback(err, cityArea);
            });
        },
        function (dataInWaterFall, callback) { // GET PROPERTY TYPE CHILD
            var query_obj = {
                table : 'PropertyTypeChild',
                orderby : 'PropertyTypeChild',
            }
            commonFunction.customQuery(query_obj, (err, PropertyCategory) => {
                if (err) {
                    return;
                }
                propertyCategory = PropertyCategory;
                callback(err, propertyCategory);
            });
        },
        function (dataInWaterFall, callback) { // GET RECOMMENDED
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
            commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {

                if (Tags) {
                    MetaTags = Tags
                }
                callback(tagErr, Tags);
            });
        },
        function (dataInWaterFall, callback) { // GET ALL SEARCHED PROPERTY
            buyModule.SearchProperties(obj, (err, propertyResults) => {
                propertyResult = propertyResults;

                var propertyIDS = [];
                if (propertyResults.length > 0) {
                    for (var i = 0; i < propertyResults.length; i++) {

                        var propertyIDS = [];

                        for (var i = 0; i < propertyResults.length; i++) {
                            propertyIDS.push(propertyResults[i].ID);
                            if (propertyResults[i].geometry) {
                                PropertyLocations.push({
                                    geometry: propertyResults[i].geometry,
                                    ID: propertyResults[i].ID
                                });
                            }
                        }
                        buyModule.getPropertyImages(propertyIDS, (imageErr, imageData) => {
                            ImageGallery = imageData;
        
                            buyModule.getPropertyUnitData(propertyIDS, (unitErr, unitData) => {

                                UnitData = unitData;
                                callback();
                            });
                        });
                    }

                } else {
                    callback();
                }
            });
        }
    ], function (FinalError, FinalResponse) {
        //  console.log(MetaTags,'-----------------');
        res.render('properties-details', {
            title: 'Search',
            sess_val: req.session.user_id,
            propertyResult: propertyResult,
            propertyResultStr: JSON.stringify(mapLocations),
            cities: cities,
            propertyType: propertyType,
            cityArea: cityArea,
            propertyCategory: propertyCategory,
            query: obj,
            recommemdedIds: recommemdedIds,
            Amenities: Amenities,
            userName: req.session.name,
            Specifications: Specifications,
            subscribe_email: req.session.email,
            seoData: seoData,
            PropertyStatus: PropertyStatus,
            currencyFormat: commonFunction.currencyFormat,
            YouTubeGetID: commonFunction.YouTubeGetID,
            GalleryImage: ImageGallery,
            UnitTableData: UnitData,
            favoriteData: favoriteData,
            PropertyLocations: PropertyLocations,
            Message: Message,
            showAdvanceSearch:true,
            Tags:MetaTags,
            Meta_tags : './metadata/buy_search_meta', 
            UnitIdentifier: UnitIdentifier
        }); 

    });
}

function ShowIndividualProperty(propertyID, res, req) {
    var propertyData = {
        StatusData: [],
        cities: [],
        singlePropertyResult: {
            Images: ''
        },
        AmenityResult: [],
        SpecificationResult: [],
        similarProperties: [],
        UnitData: [],
        SimilarUnitData: [],
        ImageGallery: [],
        PropertyType: [],
    };
    var favoriteData = [];
    if (propertyID) {
        async.waterfall([
            function (cb) { // GET ALL CITIES
                commonFunction.selectAll('Cities', (err, cities) => {
                    if (err) {
                        cb(err, propertyData);
                    } else {
                        propertyData.cities = cities;
                        cb(null, propertyData);
                    }
                });
            },
            function (propertyData, cb) { // GET ALL CITIES
                commonFunction.selectAll('PlanApprovalAuthority', (err, results) => {
                    if (err) {
                        cb(err, propertyData);
                    } else {
                        propertyData.results = results;
                        cb(null, propertyData);
                    }
                });
            },
            function (propertyData, cb) { // GET ALL CITIES
                commonFunction.selectAll('UnitsOfArea', (err, unitarea) => {
                    if (err) {
                        cb(err, propertyData);
                    } else {
                        propertyData.unitarea = unitarea;
                        cb(null, propertyData);
                    }
                });
            },
            function (propertyData, cb) {
                singlePropModule.getSinglePropertyDetails(propertyID, (err, singlePropertyResult) => {
                    if (singlePropertyResult && singlePropertyResult.length) {
                        propertyData.singlePropertyResult = singlePropertyResult[0];
                        //	cb(null,propertyData);
                    } else {
                        //	cb(err,propertyData);
                    }
                    commonFunction.getPropertyUnitData(propertyID, (unitErr, out) => {
                        propertyData.UnitData = out;

                        cb(null, propertyData);
                    });
                });
            },
            function (propertyData, cb) {
                commonFunction.selectAll("ProjectStatus", (err, ProjectStatus) => {
                    if (err) {
                        cb(err, propertyData);
                    } else {
                        propertyData.ProjectStatus = ProjectStatus;
                        for (i = 0; i < propertyData.ProjectStatus.length; i++) {
                            propertyData.StatusData[propertyData.ProjectStatus[i].ID] = propertyData.ProjectStatus[i].Status;
                        }
                        StatusData = propertyData.StatusData;
                        cb(null, propertyData);
                    }
                });
            },
            function (propertyData, cb) {
                singlePropModule.getSimilarProperties(propertyID, propertyData.singlePropertyResult.PropertyTypeID, (err, similarProperties) => {
                    if (similarProperties && similarProperties.length) {
                        propertyData.similarProperties = similarProperties;

                        cb(null, propertyData);
                    } else {

                        cb(err, propertyData);
                    }

                });
            },
            function (propertyData, cb) {
                getModel.getIndividualPropertyTypeDetail("PropertyType", propertyData.singlePropertyResult.PropertyTypeID, (err, PropertyType) => {
                    if (PropertyType && PropertyType.length) {
                        propertyData.PropertyType = PropertyType;
                        cb(null, propertyData);
                    } else {
                        cb(null, propertyData);
                    }
                });
            },
            function (propertyData, cb) { // GET ALL AMENITIES OF PROPERTY.
                singlePropModule.getAmenities(propertyID, (err, AmenityResult) => {
                    if (AmenityResult && AmenityResult.length) {
                        propertyData.AmenityResult = AmenityResult;
                        cb(null, propertyData);
                    } else {
                        cb(err, propertyData);
                    }
                })
            },
            function (propertyData, cb) { // GET ALL SPECIFICATIONS OF PROPERTY.
                singlePropModule.getSpecification(propertyID, (err, SpecificationResult) => {
                    if (SpecificationResult && SpecificationResult.length) {
                        propertyData.SpecificationResult = SpecificationResult;
                        cb(null, propertyData);
                    } else {
                        cb(err, propertyData);
                    }
                })
            },
            function (propertyData, cb) { // GET ALL IMAGES OF PROPERTY.
                var propertyIDS = [];
                for (var i = 0; i < propertyData.similarProperties.length; i++) {
                    propertyIDS.push(propertyData.similarProperties[i].ID);
                }

                commonFunction.getPropertyImages(propertyIDS, (imageErr, imageData) => {
                    propertyData.ImageGallery = imageData;
                    commonFunction.getPropertyType((err, propertyType) => {
                        if (err) {
                            return;
                        }
                        propertyData.propertyType = propertyType;


                        getModel.getPropertyUnitData(propertyIDS, (unitErr, out) => {
                            propertyData.SimilarUnitData = out;
                            //console.log(out,'=========')
                            cb(null, propertyData);
                        });
                    });
                });

            },
            function (propertyData, cb) { // FAVORITE DATA
                commonFunction.getFavouriteData('FavouriteProperties', req.session.user_id, (err, getFavouriteData) => {
                    if (err) {
                        return;
                    }
                    getFavouriteData.forEach(element => {
                        favoriteData.push(element.PropertyID);
                    });
                    cb(err, favoriteData);
                });
            }
        ], function (finalError, finalResponse) {
            if (finalError) {
                console.log('--------', finalError);
                res.send("There is some error on server!");
            } else { 
                // console.log(propertyData.singlePropertyResult,'-------------single');
                res.render('single-property-details', {
                    title: 'single-property-details',
                    sess_val: req.session.user_id,
                    subscribe_email: req.session.email,
                    cities: propertyData.cities,
                    propertyType: propertyData.propertyType,
                    propertyDetails: propertyData.singlePropertyResult,
                    planApprovedData: propertyData.results,
                    imageGallery: propertyData.singlePropertyResult.Images,
                    amenities: propertyData.AmenityResult,
                    specifications: propertyData.SpecificationResult,
                    similarProperties: propertyData.similarProperties,
                    StatusData: propertyData.StatusData,
                    PropertyType: propertyData.PropertyType,
                    similarPropertiesImageGallery: propertyData.ImageGallery,
                    UnitData: propertyData.UnitData,
                    Unitarea: propertyData.unitarea,
                    priceCalculation: propertyData.UnitData.extent,
                    favoriteData: favoriteData,
                    currencyFormat: commonFunction.currencyFormat,
                    getMonthName: commonFunction.getMonthName,
                    userName: req.session.name,
                    Tags: propertyData.singlePropertyResult.Tags,
                    SimilarUnitData: propertyData.SimilarUnitData.unitData,
                    YouTubeGetID: commonFunction.YouTubeGetID
                });
            }
        });
    } else {
        res.send("You have not selected any property. Please select a property first!");
    }
}

module.exports = router;