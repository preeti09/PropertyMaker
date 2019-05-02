var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
var async = require('async');
const config = require('../../config');
var getModel = require(`./model-${config.get('DATA_BACKEND')}`);

const seoModel = require("../seo/model-cloudsql");
router.get('/', function (req, res, next) {
     if (!req.session.user_id) {
        req.session.redirect = '/submit-property';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=submit-property');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=submit-property');
            } else {
                res.redirect(req.headers.referer);
            }
        } else {
            res.redirect('/?redirectTo=submit-property');
        }

        return false;
    }
    if (req.session.profile == false) {
        req.session.redirect = '/submit-property';
        res.redirect('/profile');
        return false;
    } 

    var async = require('async');
    var seoData = {};
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

                commonFunction.getPropertyCategory((err, propertyCategory) => {
                    if (err) {
                        return;
                    }
                    commonFunction.selectAll('Cities', (err, cities) => {
                        if (err) {
                            return;
                        }
                        commonFunction.selectAll('CityArea', (err, cityArea) => {
                            if (err) {
                                return;
                            }
                            commonFunction.selectAll('AreaLocalities', (err, localities) => {
                                if (err) {
                                    return;
                                }
                                commonFunction.getPopularPost((err, popularPost) => {
                                    if (err) {
                                        return;
                                    }
                                    commonFunction.selectAll('Amenities', (err, Amenities) => {
                                        if (err) {
                                            return;
                                        }
                                        commonFunction.selectAll('Soil', (err, soil) => {
                                            if (err) {
                                                return;
                                            }
                                            commonFunction.selectAll('Specifications', (err, specifications) => {
                                                if (err) {
                                                    return;
                                                }
                                                commonFunction.selectAll('ProjectStatus', (err, ProjectStatus) => {
                                                    if (err) {
                                                        return;
                                                    }
                                                    commonFunction.selectAll('PlanApprovalAuthority', (err, PlanApprovedby) => {
                                                        if (err) {
                                                            return;
                                                        }
                                                        commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                                                            if (err) {
                                                                return;
                                                            }
                                                            commonFunction.selectAll('UnitsOfArea', (err, UnitsOfArea) => {
                                                                if (err) {
                                                                    return;
                                                                }
                                                                res.render('submit-property', {
                                                                    title: 'Submit Property',
                                                                    propertyType: propertyType,
                                                                    propertyCategory: propertyCategory,
                                                                    sess_val: req.session.user_id,
                                                                    cityArea: cityArea,
                                                                    subscribe_email: req.session.email,
                                                                    type: ' ',
                                                                    userName: req.session.name,
                                                                    popularPost: popularPost,
                                                                    cities: cities,
                                                                    localities: localities,
                                                                    Amenities: Amenities,
                                                                    soil: soil,
                                                                    specifications: specifications,
                                                                    ProjectStatus: ProjectStatus,
                                                                    seoData: seoData,
                                                                    PlanApprovedby: PlanApprovedby,
                                                                    UnitsOfArea: UnitsOfArea,
                                                                    userName: req.session.name,
                                                                    propertyResult: '',
                                                                    EditImagesdata: '',
                                                                    EditpropertiesDetailData: '',
                                                                    EditUnitDetailData: '',
                                                                    EditSpecificationData: '',
                                                                    EditAmenityData: '',
                                                                    Tags: Tags,
                                                                    Meta_tags: './metadata/submit_property_meta',

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
        }
    ], function (finalError, finalResponse) {
    });
});

router.post('/save-property-details', function (req, res, next) {
    console.log('============',req.body)
       async.waterfall([
           function (cb) {
               if (req.body.areaId == '') {
                   var citiAreaObj = [{
                       CityID: req.body.CityID,
                       Area: req.body.area,
                       IsActive: 1,
                       Priority: 1
                   }];
                   commonFunction.insertData('CityArea', citiAreaObj, (err, cityAreaId) => {
                       if (err) {
                           req.flash('error', 'Property submission failed. Please try again later.', '/submit-property');
                           return;
                       } else {
                           req.body.areaId = cityAreaId;
                           cb(null, req);
                       }
                   });
               } else {
                   cb(null, req);
               }
           }
       ], function (finalError, finalResponse) {
   
           if (!req.session.user_id) {
               req.session.redirect = '/submit-property';
               if (req.headers.referer) {
                   var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
                   if (checkRedirectTo == 0) {
                       res.redirect(req.headers.referer + '?redirectTo=submit-property');
                   } else if (checkRedirectTo == 1) {
                       res.redirect(req.headers.referer + '&redirectTo=submit-property');
                   } else {
                       res.redirect(req.headers.referer);
                   }
               } else {
                   res.redirect('/?redirectTo=submit-property');
               }
               return false;
           }
   
           var specification_data = JSON.parse(req.body.specification_obj);
           var propertyTypeData = JSON.parse(req.body.propertyTypeData);
           var propType = propertyTypeData[req.body.propertyType].toLowerCase();
           
           var amenities = req.body.amenities;
           var BrochureURL = req.body.BrochureURL ? req.body.BrochureURL : null;
           var SurveryNumber = req.body.surveyNo ? req.body.surveyNo : null;
           var OwnerName = req.body.ownerName ? req.body.ownerName : null,
               TotalUnits = req.body.TotalUnits ? req.body.TotalUnits : null,
               TotalFloors = req.body.TotalFloors ? req.body.TotalFloors : null,
               PossessionDate = req.body.PossessionDate ? req.body.PossessionDate : null,
               ProjectStatusID = req.body.ProjectStatusID ? req.body.ProjectStatusID : null,
               BankLoan = req.body.bankLoan ? req.body.bankLoan : false,
               RERAApproved = req.body.RERAApproved ? req.body.RERAApproved : false,
               RERAApprovalNumber = req.body.RERAApprovalNumber ? req.body.RERAApprovalNumber : '',
               RecentCrop = req.body.RecentCrop ? req.body.RecentCrop : null,
               SoilTypeID = req.body.SoilTypeID ? req.body.SoilTypeID : null,
               WaterSource = req.body.WaterSource ? req.body.WaterSource : null,
               North = req.body.north ? req.body.north : false,
               East = req.body.east ? req.body.east : false,
               West = req.body.west ? req.body.west : false,
               South = req.body.south ? req.body.south : false,
               NorthRoadWidth =  req.body.NorthRoadWidth ?  req.body.NorthRoadWidth : null,
               EastRoadWidth =  req.body.EastRoadWidth ?  req.body.EastRoadWidth : null,
               SouthRoadWidth =  req.body.SouthRoadWidth ?  req.body.SouthRoadWidth : null,
               WestRoadWidth =  req.body.WestRoadWidth ?  req.body.WestRoadWidth : null,   
               PlanApprovedBy = req.body.PlanApprovedBy ? req.body.PlanApprovedBy : null,
               ApprovalNumber = '',
               ExtentOfTotalSite = req.body.ExtentOfTotalSite ? req.body.ExtentOfTotalSite : null,
               ExtentOfTotalSiteUnitID = req.body.ExtentOfTotalSiteUnitID ? req.body.ExtentOfTotalSiteUnitID : null,
               TotalTowers = req.body.TotalTowers ? req.body.TotalTowers : null,
               RoadAccess = req.body.RoadAccess ? req.body.RoadAccess : false,
               DisplayPrice = req.body.displayPrice ? true : false,
               locality = req.body.locality ? req.body.locality : '',
               PropertyTypeChildID = req.body.PropertyTypeChildID ? req.body.PropertyTypeChildID : 0,
               PlotWidth = req.body.PlotWidth ? req.body.PlotWidth : null,
               PlotLength = req.body.PlotLength ? req.body.PlotLength : null,
               ImageGallery = req.body.gellery_images.slice(1).split(','),
               ResaleProperty = req.body.ResaleProperty,
               AbuttingRoadWidth = req.body.abuttingRoadWidth ? req.body.abuttingRoadWidth : null,
               Extent = req.body.extent ? req.body.extent : null,
               LandMark = req.body.Landmark ? req.body.Landmark : '';
           var TotalPrice = parseInt(req.body.asking_price.replace(/\,/g, ""));
           if (Extent) {
               TotalPrice = (parseInt(req.body.asking_price.replace(/\,/g, "")) * parseInt(Extent));
           } else if (ExtentOfTotalSite) {
               TotalPrice = (parseInt(req.body.asking_price.replace(/\,/g, "")) * parseInt(ExtentOfTotalSite));
           }
   
   
           if (propType == 'plots') {
               var ProjectName = req.body.ProjectName1 ? req.body.ProjectName1 : null,
                   LaunchDate = req.body.LaunchDate[0] ? req.body.LaunchDate[0] : req.body.LaunchDate[1];
               ApprovalNumber = (req.body.ApprovalNumber && req.body.ApprovalNumber[0]) ? req.body.ApprovalNumber[0] : req.body.ApprovalNumber[1];
   
               if (PropertyTypeChildID == 4) {
                   ResaleProperty = false;
               } else {
                   ResaleProperty = true;
               }
   
           } else {
               var LaunchDate = req.body.LaunchDate ? req.body.LaunchDate : '';
               var ProjectName = req.body.ProjectName ? req.body.ProjectName : null,
                   BankLoan = req.body.bankLoan1 ? req.body.bankLoan1 : false;
           }
   
   
           var d = new Date();
           var createDate = 'current_timestamp';
           var properties_obj = [{
               AgentID: req.session.user_id,
               PropertyTypeID: req.body.propertyType,
               Title: req.body.property_title,
               CityID: req.body.CityID,
               AreaID: req.body.areaId,
               Location: locality,
               Extent: Extent,
               AskingPrice: req.body.asking_price.replace(/\,/g, ""),
               SearchPrice: req.body.search_price.replace(/\,/g, ""),
               //Facing: '',
               AbuttingRoadWidth: AbuttingRoadWidth,
               LandMark: LandMark,
               VideoGallery: req.body.gellery_video.slice(1),
               VideoURL: req.body.VideoUrl,
               IsActive: true,
               BrochureURL: BrochureURL,
               PropertyTypeChildID: PropertyTypeChildID,
               DisplayPrice: DisplayPrice,
               SurveryNumber: SurveryNumber,
               ResaleProperty: ResaleProperty,
               PropertyStatusID: 1,
               TotalPrice: parseInt(TotalPrice)
           }];
   
           async.waterfall([
               function (cb) {
                   commonFunction.insertData('Properties', properties_obj, (err, propertyId) => {
                       if (err) {
                           cb(err, 'Property submission failed. Please try again later.');
                           return;
                       }
                       cb(null, propertyId);
                   });
               },
               function (propertyId, cb) {
                   PropertyImages_obj = [];
                   for (var i = 0; i < ImageGallery.length; i++) {
                       if (ImageGallery[i]) {
                           PropertyImages_obj.push({
                               PropertyID: propertyId,
                               ImageURL: ImageGallery[i],
                               DisplayOrderID: i
                           });
                       }
                   }
                
                   if (PropertyImages_obj.length > 0) {
                       commonFunction.insertData('PropertyImages', PropertyImages_obj, (err, id) => {
                           if (err) {
                               cb(err, 'Property submission failed. Please try again later.');
                               return;
                           }
                           cb(null, propertyId);
                       });
                   } else {
                       cb(null, propertyId);
                   }
               },
               function (propertyId, cb) {
                   var PropertyLocations_obj = [{
                       PropertyID: propertyId,
                       LocationUnknown: false
                   }];
                   if (req.body.drawShap) {
                       PropertyLocations_obj[0].Location = req.body.drawShap;
                   } else {
                       PropertyLocations_obj[0].LocationUnknown = true;
                   }
                   commonFunction.insertData('PropertyLocations', PropertyLocations_obj, (err, id) => {
                       if (err) {
                           cb(err, 'Property submission failed. Please try again later.');
                           return;
                       }
                       cb(null, propertyId);
                   });
               },
               function (propertyId, cb) {
                   var properyDetails_obj = [{
                       PropertyID: propertyId,
                       OwnerName: OwnerName,
                       PropertyDescription: req.body.description,
                       ExtentOfTotalSite: ExtentOfTotalSite,
                       TransactionType: 'white',
                       LegalCheckDone: true,
                       TotalUnits: TotalUnits,
                       TotalFloors: TotalFloors,
                       LaunchDate: LaunchDate,
                       PossessionDate: PossessionDate,
                       ProjectStatusID: ProjectStatusID,
                       BuilderID: 0,
                       IsActive: true,
                       BankLoan: BankLoan,
                       RecentCrop: RecentCrop,
                       SoilTypeID: SoilTypeID,
                       WaterSource: WaterSource,
                       ProjectName: ProjectName,
                       ApprovalNumber: ApprovalNumber,
                       TotalTowers: TotalTowers,
                       RoadAccess: RoadAccess,
                       PlotWidth: PlotWidth,
                       PlotLength: PlotLength,
                       East: East,
                       West: West,
                       North: North,
                       South: South,
                       PlanApprovedBy: PlanApprovedBy,
                       NorthRoadWidth: NorthRoadWidth,
                       EastRoadWidth: EastRoadWidth,
                       SouthRoadWidth: SouthRoadWidth,
                       WestRoadWidth: WestRoadWidth,
                       ExtentOfTotalSiteUnitID: ExtentOfTotalSiteUnitID,
                       RERAApproved: RERAApproved,
                       RERAApprovalNumber: RERAApprovalNumber
   
                   }];
                   commonFunction.insertData('PropertyDetails', properyDetails_obj, (err, id) => {
                       if (err) {
                           cb(err, 'Property submission failed. Please try again later.')
                           return;
                       }
                       cb(null, propertyId);
                   });
               },
              
               function (propertyId, cb) {
                var propertyUnitDetails = [];
                if (propType == 'residential') {
                    for (var i = 0; i < req.body.multiple_option_length; i++) {
                           var UnitTitle = req.body['title_' + i] ? req.body['title_' + i] : '',
                               unitNorth = req.body['north_' + i] ? req.body['north_' + i] : false,
                               unitEast = req.body['east_' + i] ? req.body['east_' + i] : false,
                               unitWest = req.body['west_' + i] ? req.body['west_' + i] : false,
                               unitSouth = req.body['south_' + i] ? req.body['south_' + i] : false,
                               PlinthArea = req.body['plinthArea_' + i] ? req.body['plinthArea_' + i] : null,
                               NumberofBeds = req.body['bedrooms_' + i] ? req.body['bedrooms_' + i] : null,
                               NumberofBath = req.body['bathrooms_' + i] ? req.body['bathrooms_' + i] : null,
                               SuperBuiltUpArea = req.body['buildUpArea_' + i] ? req.body['buildUpArea_' + i] : null,
                               UndividedShare = req.body['undividedShare_' + i] ? req.body['undividedShare_' + i] : null,
                               CarParkingArea = req.body['CarParkingArea_' + i] ? req.body['CarParkingArea_' + i] : null,
                               BalconyArea = req.body['BalconyArea_' + i] ? req.body['BalconyArea_' + i] : null,
                               UnitExtent = req.body['UnitExtent_' + i] ? req.body['UnitExtent_' + i] : null,
                               UnitNumber = req.body['UnitNumber_' + i] ? req.body['UnitNumber_' + i] : null;
                           numberofblaconies = req.body['numberofblaconies_' + i] ? req.body['numberofblaconies_' + i] : null;
                           UnitFloor = req.body['UnitFloor_' + i] ? req.body['UnitFloor_' + i] : null;
                           FloorPlanURL = req.body['FloorPlanURL_' + i] ? req.body['FloorPlanURL_' + i] : null;
                           VideoURL = req.body['VideoURL_' + i] ? req.body['VideoURL_' + i] : null;
                           var obj = {
                               PropertyID: propertyId,
                               NumberofBeds: NumberofBeds,
                               NumberofBath: NumberofBath,
                               SuperBuiltUpArea: SuperBuiltUpArea,
                               PlinthArea: PlinthArea,
                               CarParkingArea: CarParkingArea,
                               BalconyArea: BalconyArea,
                               UndividedShare: UndividedShare,
                               UDSRatio: 0,
                               FloorPlanURL: FloorPlanURL,
                               VideoURL: VideoURL,
                               PlotRoadWidth: 0,
                               UnitNumber: UnitNumber,
                               UnitFloor: UnitFloor,
                               North: unitNorth,
                               East: unitEast,
                               West: unitWest,
                               South: unitSouth,
                               BrochureURL: BrochureURL,
                               UnitTitle: UnitTitle,
                               UnitExtent: UnitExtent
                           };
                   
                           if (UnitTitle) {
                               propertyUnitDetails.push(obj);
                           }
                       }

                   } else if (propType == 'plots') {

                       for (var i = 0; i < req.body.multiple_option_length_1; i++) {
                           var UnitTitle = req.body['plotsTitle_' + i],
                               PlotWidth = req.body['PlotWidth_' + i] ? req.body['PlotWidth_' + i] : null,
                               PlotLength = req.body['PlotLength_' + i] ? req.body['PlotLength_' + i] : null,
                               unitNorth = req.body['plotsNorth_' + i] ? req.body['plotsNorth_' + i] : false,
                               unitEast = req.body['plotsEast_' + i] ? req.body['plotsEast_' + i] : false,
                               unitWest = req.body['plotsWest_' + i] ? req.body['plotsWest_' + i] : false,
                               unitSouth = req.body['plotsSouth_' + i] ? req.body['plotsSouth_' + i] : false,
                               UnitExtent = req.body['plotsUnitExtent_' + i] ? req.body['plotsUnitExtent_' + i] : null,
                               UnitNumber = req.body['plotsUnitNumber_' + i] ? req.body['plotsUnitNumber_' + i] : null;
   
                           var obj = {
                               PropertyID: propertyId,
                               PlotLength: PlotLength,
                               PlotWidth: PlotWidth,
                               UnitNumber: UnitNumber,
                               North: unitNorth,
                               East: unitEast,
                               West: unitWest,
                               South: unitSouth,
                               UnitTitle: UnitTitle,
                               UnitExtent: UnitExtent
                           };
                           if (UnitTitle) {
                               propertyUnitDetails.push(obj);
                           }
                       }
                   }
                    else {
                       var PlotWidth = req.body.PlotWidth ? req.body.PlotWidth : null;
                       var PlotLength = req.body.PlotLength ? req.body.PlotLength : null;
                       var obj = {
                           PropertyID: propertyId,
                           PlotWidth:PlotWidth,
                           PlotLength:PlotLength
                       };
   
                       propertyUnitDetails.push(obj);
                   } 
    
                   if (propertyUnitDetails.length > 0) {
               
                       commonFunction.insertData('PropertyUnitDetails', propertyUnitDetails, (err, id) => {
   
                           if (err) {
                               cb(err, 'Property submission failed. Please try again later.');
                               return;
                           }
                           cb(null, propertyId);
                       });
                   } else {
                       cb(null, propertyId);
                   }
               },
               function (propertyId, cb) {
                   var Amenities_obj = [];
                   if (amenities) {
                       for (var i = 0; i < amenities.length; i++) {
                           Amenities_obj.push({
                               PropertyID: propertyId,
                               PropertyUnitID: 0,
                               AmenityID: amenities[i]
                           });
                       }
                   }
                   if (Amenities_obj.length > 0) {
                       commonFunction.insertData('PropertyAmenities', Amenities_obj, (err, id) => {
                           if (err) {
                               cb(err, 'Property submission failed. Please try again later.')
                               return;
                           }
                           cb(null, propertyId);
                       });
                   } else {
                       cb(null, propertyId);
                   }
   
               },
               function (propertyId, cb) {
                   var specification_obj = [];
             
                   for (var i = 0; i < specification_data.length; i++) {
                       if (req.body.PropertyTypeChildID == specification_data[i].PropertyTypeChildID) {
                           specification_obj.push({
                               PropertyID: propertyId,
                               PropertyUnitID: 0,
                               SpecificationID: specification_data[i].ID,
                               Value: req.body['spec_' + specification_data[i].Specification]
                           });
                       }
                   }
                   if (specification_obj.length > 0) {
                       commonFunction.insertData('PropertySpecifications', specification_obj, (err, id) => {
                           if (err) {
                               cb(err, 'Property submission failed. Please try again later.')
                               return;
                           }
                           cb();
                       });
                   } else {
                       cb();
                   }
               }
           ], function (finalError, finalResponse) {
               if (finalError) {
                   console.log('---------------------',finalError)
                var result = {};
                result.status = 'danger';
                result.msg = 'Something went wrong. Please try again';
                res.send(JSON.stringify(result));
                return;
               }
              else {
                var result = {};
                result.status = 'success';
                result.msg = 'Property submitted successfully.';
                res.send(JSON.stringify(result));
                return;
            } 
        });
   
    });
});

router.post('/:ID/save-property-details', function (req, res, next) {
//   console.log(req.body,'----------------');
    var EditPropertyID = req.body.PropertyID;
    var gellery_video = null;
    var gellery_images = null;
    if(req.body.gellery_images || req.body.gellery_video){
        gellery_images =   (req.body.gellery_images).split(',');
        gellery_images = gellery_images.filter(v => v != '' && v != null &&
        v != undefined && v != []);
        gellery_video =   (req.body.gellery_video).split(',');
        gellery_video = gellery_video.filter(v => v != '' && v != null &&
        v != undefined && v != []);
    }
    async.waterfall([
    function (cb) {
        if (req.body.areaId == '') {
            var citiAreaObj = [{
                CityID: req.body.CityID,
                Area: req.body.area,
                IsActive: 1,
                Priority: 1
            }];
            commonFunction.insertData('CityArea', citiAreaObj, (err, cityAreaId) => {
                if (err) {
                    req.flash('error', 'Property submission failed. Please try again later.', '/submit-property');
                    return;
                } else {
                    req.body.areaId = cityAreaId;
                    cb(null, req);
                }
            });
        } else {
            cb(null, req);
        }
    }
   ] , function (finalError, finalResponse) {   
           if (!req.session.user_id) {
               req.session.redirect = '/submit-property';
               if (req.headers.referer) {
                   var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
                   if (checkRedirectTo == 0) {
                       res.redirect(req.headers.referer + '?redirectTo=submit-property');
                   } else if (checkRedirectTo == 1) {
                       res.redirect(req.headers.referer + '&redirectTo=submit-property');
                   } else {
                       res.redirect(req.headers.referer);
                   }
               } else {
                   res.redirect('/?redirectTo=submit-property');
               }
               return false;
           }
          
           var specification_data = JSON.parse(req.body.specification_obj);
           var propertyTypeData = JSON.parse(req.body.propertyTypeData);
           var propType = propertyTypeData[req.body.propertyType].toLowerCase();
           var amenities = req.body.amenities;
           var BrochureURL = req.body.BrochureURL ? req.body.BrochureURL : null;
           var SurveryNumber = req.body.surveyNo ? req.body.surveyNo : null;
           var OwnerName = req.body.ownerName ? req.body.ownerName : null,
               TotalUnits = req.body.TotalUnits ? req.body.TotalUnits : null,
               TotalFloors = req.body.TotalFloors ? req.body.TotalFloors : null,
               PossessionDate = req.body.PossessionDate ? req.body.PossessionDate : null,
               ProjectStatusID = req.body.ProjectStatusID ? req.body.ProjectStatusID : null,
               BankLoan = req.body.bankLoan ? req.body.bankLoan : false,
               RERAApproved = req.body.RERAApproved ? req.body.RERAApproved : false,
               RERAApprovalNumber = req.body.RERAApprovalNumber ? req.body.RERAApprovalNumber : '',
               RecentCrop = req.body.RecentCrop ? req.body.RecentCrop : null,
               SoilTypeID = req.body.SoilTypeID ? req.body.SoilTypeID : null,
               WaterSource = req.body.WaterSource ? req.body.WaterSource : null,
               North = req.body.north ? req.body.north : false,
               East = req.body.east ? req.body.east : false,
               West = req.body.west ? req.body.west : false,
               South = req.body.south ? req.body.south : false,
               NorthRoadWidth =  req.body.NorthRoadWidth ?  req.body.NorthRoadWidth : null,
               EastRoadWidth =  req.body.EastRoadWidth ?  req.body.EastRoadWidth : null,
               SouthRoadWidth =  req.body.SouthRoadWidth ?  req.body.SouthRoadWidth : null,
               WestRoadWidth =  req.body.WestRoadWidth ?  req.body.WestRoadWidth : null,   
               PlanApprovedBy = req.body.PlanApprovedBy ? req.body.PlanApprovedBy : null,
               ApprovalNumber = '',
               ExtentOfTotalSite = req.body.ExtentOfTotalSite ? req.body.ExtentOfTotalSite : null,
               ExtentOfTotalSiteUnitID = req.body.ExtentOfTotalSiteUnitID ? req.body.ExtentOfTotalSiteUnitID : null,
               TotalTowers = req.body.TotalTowers ? req.body.TotalTowers : null,
               RoadAccess = req.body.RoadAccess ? req.body.RoadAccess : false,
               DisplayPrice = req.body.displayPrice ? true : false,
               locality = req.body.locality ? req.body.locality : '',
               PropertyTypeChildID = req.body.PropertyTypeChildID ? req.body.PropertyTypeChildID : 0,
               PlotWidth = req.body.PlotWidth ? req.body.PlotWidth : null,
               PlotLength = req.body.PlotLength ? req.body.PlotLength : null,
               ImageGallery = gellery_images,
               ResaleProperty = req.body.ResaleProperty,
               AbuttingRoadWidth = req.body.abuttingRoadWidth ? req.body.abuttingRoadWidth : null,
               Extent = req.body.extent ? req.body.extent : null,
               LandMark = req.body.Landmark ? req.body.Landmark : null;
           var TotalPrice = parseInt(req.body.asking_price.replace(/\,/g, ""));
           if (Extent) {
               TotalPrice = (parseInt(req.body.asking_price.replace(/\,/g, "")) * parseInt(Extent));
           } else if (ExtentOfTotalSite) {
               TotalPrice = (parseInt(req.body.asking_price.replace(/\,/g, "")) * parseInt(ExtentOfTotalSite));
           }
   
   
           if (propType == 'plots') {
          
               var ProjectName = req.body.ProjectName1 ? req.body.ProjectName1 : null,
                   LaunchDate = req.body.LaunchDate[0] ? req.body.LaunchDate[0] : req.body.LaunchDate[1];
               ApprovalNumber = (req.body.ApprovalNumber && req.body.ApprovalNumber[0]) ? req.body.ApprovalNumber[0] : req.body.ApprovalNumber[1];
   
               if (PropertyTypeChildID == 4) {
                   ResaleProperty = false;
               } else {
                   ResaleProperty = true;
               }
   
           } else {
               var LaunchDate = req.body.LaunchDate ? req.body.LaunchDate : '';
               var ProjectName = req.body.ProjectName ? req.body.ProjectName : null,
                   BankLoan = req.body.bankLoan1 ? req.body.bankLoan1 : false;
           }
   
   
           var d = new Date();
           var createDate = 'current_timestamp';
           var properties_obj = [{
            AgentID: req.session.user_id,
            PropertyTypeID: req.body.propertyType,
            Title: req.body.property_title,
            CityID: req.body.CityID ? req.body.CityID : null,
            AreaID: req.body.areaId ? req.body.areaId : null,
            Location: locality,
            Extent: Extent,
            AskingPrice: req.body.asking_price.replace(/\,/g, ""),
            SearchPrice: req.body.search_price.replace(/\,/g, ""),
            //Facing: '',
            AbuttingRoadWidth: AbuttingRoadWidth,
            LandMark: LandMark,
            VideoGallery:gellery_video,
            VideoURL: req.body.VideoUrl ? req.body.VideoUrl : null,
            IsActive: true,
            BrochureURL: BrochureURL,
            PropertyTypeChildID: PropertyTypeChildID,
            DisplayPrice: DisplayPrice,
            SurveryNumber: SurveryNumber,
            ResaleProperty: ResaleProperty,
            PropertyStatusID: 3,
            TotalPrice: parseInt(TotalPrice),
           }];
            
           var where = [{
                ID: EditPropertyID,
                Key: 'ID',
                and: '',
           }];

        async.waterfall([
               function (cb) {
                   commonFunction.updateData('Properties', properties_obj[0], where[0], (err, propertyId) => {
                       if (err) {

                           cb(err, 'Property updation failed. Please try again later.');
                           return;
                       }
                       cb(null, propertyId);
                   });
               },
         
               function (propertyId, cb) {
                   PropertyImages_obj = [];
                   for (var i = 0; i < ImageGallery.length; i++) {
                       if (ImageGallery[i]) {
                           PropertyImages_obj.push({
                              PropertyID: EditPropertyID,
                               ImageURL: ImageGallery[i],
                               DisplayOrderID: i,
                           });
                       }
                   }
                //   console.log(ImageGallery,'ImageGallery');
                   var where = [{
                        ID: EditPropertyID,
                        Key: 'PropertyID',
                        and: '',
                   }];
              //      console.log(PropertyImages_obj,'PropertyImages_obj');
                   if (PropertyImages_obj.length > 0) {
                    commonFunction.deletedata('PropertyImages',  where[0], (err, id) => {
                        if (err) {
                            console.log(err,'during deleted');
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }
                    commonFunction.insertData('PropertyImages', PropertyImages_obj, (err, id) => {
                        if (err) {
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }
                        cb(null, propertyId);
                    });
                });
                } else {
                       cb(null, propertyId);
                    }
            },
            
               function (propertyId, cb) {
                   var PropertyLocations_obj = [{
                        PropertyID: EditPropertyID,
                        LocationUnknown: false,
                   }];

                var where = [{
                    ID: EditPropertyID,
                    Key: 'PropertyID',
                    and: '',
                }]; 
                
                   if (req.body.drawShap) {
                       PropertyLocations_obj[0].Location = req.body.drawShap;
                   } else {
                       PropertyLocations_obj[0].LocationUnknown = true;
                   }
            
                commonFunction.deletedata('PropertyLocations',  where[0], (err, id) => {
                if (err) {
                    console.log(err,'during deleted');
                    cb(err, 'Property updation failed. Please try again later.');
                    return;
                }
                    commonFunction.insertData('PropertyLocations', PropertyLocations_obj, (err, id) => {
                        if (err) {
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }
                        cb(null, propertyId);
                    });
                });




        /*            commonFunction.updateData('PropertyLocations', PropertyLocations_obj[0], where[0], (err, id) => {
                       if (err) {
                           cb(err, 'Property updation failed. Please try again later.');
                           return;
                       }
                       cb(null, propertyId);
                   }); */
               },
            function (propertyId, cb) {
                   var properyDetails_obj = [{
                       PropertyID: EditPropertyID,
                       OwnerName: OwnerName,
                       PropertyDescription: req.body.description,
                       ExtentOfTotalSite: ExtentOfTotalSite,
                       TransactionType: 'white',
                       LegalCheckDone: true,
                       TotalUnits: TotalUnits,
                       TotalFloors: TotalFloors,
                       LaunchDate: LaunchDate,
                       PossessionDate: PossessionDate,
                       ProjectStatusID: ProjectStatusID,
                       BuilderID: 0,
                       IsActive: true,
                       BankLoan: BankLoan,
                       RecentCrop: RecentCrop,
                       SoilTypeID: SoilTypeID,
                       WaterSource: WaterSource,
                       ProjectName: ProjectName,
                       ApprovalNumber: ApprovalNumber,
                       TotalTowers: TotalTowers,
                       RoadAccess: RoadAccess,
                       PlotWidth: PlotWidth,
                       PlotLength: PlotLength,
                       East: East,
                       West: West,
                       North: North,
                       South: South,
                       PlanApprovedBy: PlanApprovedBy,
                       NorthRoadWidth: NorthRoadWidth,
                       EastRoadWidth: EastRoadWidth,
                       SouthRoadWidth: SouthRoadWidth,
                       WestRoadWidth: WestRoadWidth,
                       ExtentOfTotalSiteUnitID: ExtentOfTotalSiteUnitID,
                       RERAApproved: RERAApproved,
                       RERAApprovalNumber: RERAApprovalNumber,
                   }];

                var where = [{
                    ID: EditPropertyID,
                    Key: 'PropertyID',
                    and: '',
                }]; 
                    
                commonFunction.deletedata('PropertyDetails',  where[0], (err, id) => {
                    if (err) {
                        console.log(err,'during deleted');
                        cb(err, 'Property updation failed. Please try again later.');
                        return;
                    }
                    commonFunction.insertData('PropertyDetails', properyDetails_obj, (err, id) => {
                        if (err) {
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }
                        cb(null, propertyId);
                    });
                });

            },
            function (propertyId, cb) {
                   var propertyUnitDetails = [];
                   if (propType == 'residential') {
                
                       for (var i = 0; i < req.body.multiple_option_length; i++) {
                        
                           var UnitTitle = req.body['title_' + i] ? req.body['title_' + i] : '',
                            unitNorth = req.body['north_' + i] ? req.body['north_' + i] : false,
                            unitEast = req.body['east_' + i] ? req.body['east_' + i] : false,
                            unitWest = req.body['west_' + i] ? req.body['west_' + i] : false,
                            unitSouth = req.body['south_' + i] ? req.body['south_' + i] : false,
                            PlinthArea = req.body['plinthArea_' + i] ? req.body['plinthArea_' + i] : null,
                            NumberofBeds = req.body['bedrooms_' + i] ? req.body['bedrooms_' + i] : null,
                            NumberofBath = req.body['bathrooms_' + i] ? req.body['bathrooms_' + i] : null,
                            SuperBuiltUpArea = req.body['buildUpArea_' + i] ? req.body['buildUpArea_' + i] : null,
                            UndividedShare = req.body['undividedShare_' + i] ? req.body['undividedShare_' + i] : null,
                            CarParkingArea = req.body['CarParkingArea_' + i] ? req.body['CarParkingArea_' + i] : null,
                            BalconyArea = req.body['BalconyArea_' + i] ? req.body['BalconyArea_' + i] : null,
                            UnitExtent = req.body['UnitExtent_' + i] ? req.body['UnitExtent_' + i] : null,
                            UnitNumber = req.body['UnitNumber_' + i] ? req.body['UnitNumber_' + i] : null;
                           numberofblaconies = req.body['numberofblaconies_' + i] ? req.body['numberofblaconies_' + i] : null;
                           UnitFloor = req.body['UnitFloor_' + i] ? req.body['UnitFloor_' + i] : null;
                           FloorPlanURL = req.body['FloorPlanURL_' + i] ? req.body['FloorPlanURL_' + i] : null;
                           VideoURL = req.body['VideoURL_' + i] ? req.body['VideoURL_' + i] : null;
                           var obj = {
                               PropertyID: EditPropertyID,
                               NumberofBeds: NumberofBeds,
                               NumberofBath: NumberofBath,
                               SuperBuiltUpArea: SuperBuiltUpArea,
                               PlinthArea: PlinthArea,
                               CarParkingArea: CarParkingArea,
                               BalconyArea: BalconyArea,
                               UndividedShare: UndividedShare,
                               UDSRatio: 0,
                               FloorPlanURL: FloorPlanURL,
                               VideoURL: VideoURL,
                               PlotRoadWidth: 0,
                               UnitNumber: UnitNumber,
                               UnitFloor: UnitFloor,
                               North: unitNorth,
                               East: unitEast,
                               West: unitWest,
                               South: unitSouth,
                               BrochureURL: BrochureURL,
                               UnitTitle: UnitTitle,
                               UnitExtent: UnitExtent,
                            };

     
                           if (UnitTitle) {
                               propertyUnitDetails.push(obj);
                           }
                       }
                   } else if (propType == 'plots') {
           
                 
                       for (var i = 0; i < req.body.multiple_option_length_1; i++) {
                           var UnitTitle = req.body['plotsTitle_' + i],
                               PlotWidth = req.body['PlotWidth_' + i] ? req.body['PlotWidth_' + i] : null,
                               PlotLength = req.body['PlotLength_' + i] ? req.body['PlotLength_' + i] : null,
                               unitNorth = req.body['plotsNorth_' + i] ? req.body['plotsNorth_' + i] : false,
                               unitEast = req.body['plotsEast_' + i] ? req.body['plotsEast_' + i] : false,
                               unitWest = req.body['plotsWest_' + i] ? req.body['plotsWest_' + i] : false,
                               unitSouth = req.body['plotsSouth_' + i] ? req.body['plotsSouth_' + i] : false,
                               UnitExtent = req.body['plotsUnitExtent_' + i] ? req.body['plotsUnitExtent_' + i] : null,
                               UnitNumber = req.body['plotsUnitNumber_' + i] ? req.body['plotsUnitNumber_' + i] : null;
   
                           var obj = {
                               PropertyID: EditPropertyID,
                               PlotLength: PlotLength,
                               PlotWidth: PlotWidth,
                               UnitNumber: UnitNumber,
                               North: unitNorth,
                               East: unitEast,
                               West: unitWest,
                               South: unitSouth,
                               UnitTitle: UnitTitle,
                               UnitExtent: UnitExtent
                           };
                           
                           if (UnitTitle) {
                               propertyUnitDetails.push(obj);
                           }
                       }
                   }
                    else {
                       var PlotWidth = req.body.PlotWidth ? req.body.PlotWidth : null;
                       var PlotLength = req.body.PlotLength ? req.body.PlotLength : null;
                       var obj = {
                           PropertyID: propertyId,
                           PlotWidth:PlotWidth,
                           PlotLength:PlotLength
                       };
   
                       propertyUnitDetails.push(obj);
                   } 
                   var where = [{
                    ID: EditPropertyID,
                    Key: 'PropertyID',
                    and: '',
                }];
              
                   if (propertyUnitDetails.length > 0) {
                    
                       commonFunction.deletedata('PropertyUnitDetails',  where[0], (err, id) => {
                           if (err) {
                               console.log(err,'during deleted');
                               cb(err, 'Property updation failed. Please try again later.');
                               return;
                           }

                     
                        commonFunction.insertData('PropertyUnitDetails', propertyUnitDetails, (err, id) => {

                        if (err) {
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }
                        cb(null, propertyId);
                    });
                });
            } else {
                       cb(null, propertyId);
                   }
            },
            function (propertyId, cb) {
                   var Amenities_obj = [];
                   if (amenities) {
                       for (var i = 0; i < amenities.length; i++) {
                           Amenities_obj.push({
                                PropertyID: EditPropertyID,
                                PropertyUnitID: 0,
                                AmenityID: amenities[i],
                           });
                       }  
                    }

                    var where = [{
                        ID: EditPropertyID,
                        Key: 'PropertyID',
                        and: '',
                    }]; 

                   if (Amenities_obj.length > 0) {
                    commonFunction.deletedata('PropertyAmenities',  where[0], (err, id) => {
                        if (err) {
                            console.log(err,'during deleted');
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }

                  
                     commonFunction.insertData('PropertyAmenities', Amenities_obj, (err, id) => {

                     if (err) {
                         cb(err, 'Property updation failed. Please try again later.');
                         return;
                     }
                     cb(null, propertyId);
                 });
             });


                       /* commonFunction.updateData('PropertyAmenities', Amenities_obj,  where[0], (err, id) => {
                           if (err) {
                               cb(err, 'Property updation failed. Please try again later.')
                               return;
                           }
                           cb(null, propertyId);
                       }); */
                   } else {
                       cb(null, propertyId);
                   }
   
            },
            function (propertyId, cb) {
                var specification_obj = [];
            
                for (var i = 0; i < specification_data.length; i++) {
                    if (req.body.PropertyTypeChildID == specification_data[i].PropertyTypeChildID) {
                        specification_obj.push({
                            PropertyID: EditPropertyID,
                            PropertyUnitID: 0,
                            SpecificationID: specification_data[i].ID,
                            Value: req.body['spec_' + specification_data[i].Specification],
                        });
                    }
                }

            var where = [{
                ID: EditPropertyID,
                Key: 'PropertyID',
                and: '',
            }]; 
                if (specification_obj.length > 0) {
                    commonFunction.deletedata('PropertySpecifications',  where[0], (err, id) => {
                        if (err) {
                            console.log(err,'during deleted');
                            cb(err, 'Property updation failed. Please try again later.');
                            return;
                        }

                  
                     commonFunction.insertData('PropertySpecifications', specification_obj, (err, id) => {

                     if (err) {
                         cb(err, 'Property updation failed. Please try again later.');
                         return;
                     }
                     cb(null, propertyId);
                 });
             });
              /*       commonFunction.updateData('PropertySpecifications', specification_obj[0],  where[0], (err, id) => {
                        if (err) {
                            cb(err, 'Property updation failed. Please try again later.')
                            return;
                        }
                        cb();
                    }); */
                } else {
                    cb();
                }
            }
        ], function (finalError, finalResponse) {
                if (finalError) {
                   console.log('---------------------',finalError);
                var result = {};
                result.status = 'danger';
                result.msg = 'Something went wrong. Please try again';
                res.send(JSON.stringify(result));
                return;
            }
              else {
                var result = {};
                result.status = 'success';
                result.msg = 'Property updated successfully.';
                res.send(JSON.stringify(result));
                return;
            } 
        }); 
    });
});

router.get('/isTitleExists', function (req, res, next) {
    getModel.apiIsTitleExists(req.param("title"), (err, propertyData) => {
        if (propertyData && propertyData.length) {
            res.json({
                status: 200
            });
            return;
        } else {
            res.json({
                status: 500
            });
            return;
        }
    })
});

router.get('/:ID', function (req, res, next) {
    var ID = req.param('ID');
    if (!req.session.user_id) {
        req.session.redirect = '/submit-property';
        if (req.headers.referer) {
            var checkRedirectTo = commonFunction.checkRedirectURL(req.headers.referer);
            if (checkRedirectTo == 0) {
                res.redirect(req.headers.referer + '?redirectTo=submit-property');
            } else if (checkRedirectTo == 1) {
                res.redirect(req.headers.referer + '&redirectTo=submit-property');
            } else {
                res.redirect(req.headers.referer);
            }
        } else {
            res.redirect('/?redirectTo=submit-property');
        }

        return false;
    }
    if (req.session.profile == false) {
        req.session.redirect = '/submit-property';
        res.redirect('/profile');
        return false;
    }

    var async = require('async');
    var seoData = {};
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
                commonFunction.getPropertyCategory((err, propertyCategory) => {
                    if (err) {
                        return;
                    }
                    commonFunction.selectAll('Cities', (err, cities) => {
                        if (err) {
                            return;
                        }
                        commonFunction.selectAll('CityArea', (err, cityArea) => {
                            if (err) {
                                return;
                            }
                            commonFunction.selectAll('AreaLocalities', (err, localities) => {
                                if (err) {
                                    return;
                                }
                                commonFunction.getPopularPost((err, popularPost) => {
                                    if (err) {
                                        return;
                                    }
                                    commonFunction.selectAll('Amenities', (err, Amenities) => {
                                        if (err) {
                                            return;
                                        }
                                        commonFunction.selectAll('Soil', (err, soil) => {
                                            if (err) {
                                                return;
                                            }
                                            commonFunction.selectAll('Specifications', (err, specifications) => {
                                                if (err) {
                                                    return;
                                                }
                                                commonFunction.selectAll('ProjectStatus', (err, ProjectStatus) => {
                                                    if (err) {
                                                        return;
                                                    }
                                                    commonFunction.getTags(req.originalUrl, (tagErr, Tags) => {
                                                        if (err) {
                                                            return;
                                                        }
                                                        commonFunction.selectAll('PlanApprovalAuthority', (err, PlanApprovedby) => {
                                                            if (err) {
                                                                return;
                                                            }
                                                            commonFunction.selectAll('UnitsOfArea', (err, UnitsOfArea) => {
                                                                if (err) {
                                                                    return;
                                                                }
                                                                getModel.getEditpropertiesData(ID, (err, PropertiesData) => {
                                                                    if (err) {
                                                                        return;
                                                                    }

                                                                    getModel.getEditpropertiesDetailData(ID, (err, propertiesDetailData) => {
                                                                        if (err) {
                                                                            return;
                                                                        }

                                                                        getModel.getEditpropertyUnitData('PropertyUnitDetails', ID, (err, UnitDetailData) => {
                                                                            if (err) {
                                                                                return;
                                                                            }
                                                                            getModel.getEditpropertySpecificationData(ID, (err, SpecificationData) => {
                                                                                if (err) {
                                                                                    return;
                                                                                }
                                                                                getModel.getEditpropertyAmenityData(ID, (err, AmenityData) => {
                                                                                    if (err) {
                                                                                        return;
                                                                                    }
                                                                                    getModel.EditImagesdata(ID, (err, Images) => {
                                                                                        if (err) {
                                                                                            return;
                                                                                        }
                                                                                        console.log(PropertiesData[0],PropertiesData.length,'**********')
                                                                                      console.log(UnitDetailData)
                                                                                        res.render('submit-property', {
                                                                                            title: 'Submit Property',
                                                                                            propertyType: propertyType,
                                                                                            propertyCategory: propertyCategory,
                                                                                            sess_val: req.session.user_id,
                                                                                            cityArea: cityArea,
                                                                                            subscribe_email: req.session.email,
                                                                                            type: ' ',
                                                                                            userName: req.session.name,
                                                                                            popularPost: popularPost,
                                                                                            cities: cities,
                                                                                            localities: localities,
                                                                                            Amenities: Amenities,
                                                                                            soil: soil,
                                                                                            specifications: specifications,
                                                                                            ProjectStatus: ProjectStatus,
                                                                                            seoData: seoData,
                                                                                            PlanApprovedby: PlanApprovedby,
                                                                                            UnitsOfArea: UnitsOfArea,
                                                                                            propertyResult: PropertiesData,
                                                                                            EditpropertiesDetailData: propertiesDetailData,
                                                                                            EditUnitDetailData: UnitDetailData,
                                                                                            EditSpecificationData: SpecificationData,
                                                                                            EditImagesdata: Images,
                                                                                            EditAmenityData: AmenityData,
                                                                                            userName: req.session.name,
                                                                                            Tags: Tags,
                                                                                            Meta_tags: './metadata/submit_property_meta',

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

module.exports = router;