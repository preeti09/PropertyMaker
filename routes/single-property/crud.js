var express = require('express');
var router = express.Router();
const commonFunction = require("../../sql-common-function");
var getModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);
var async = require('async');
router.get('/', function (req, res) {

	getModel.getURLData(req.originalUrl.split('?')[0], (err, results) => {
		if (err) {
			return;
		}

		PropertyID = results[0].PropertyID;
		ShowIndividualProperty(PropertyID, res, req);
	});
});

router.post('/save_single_property', (req, res, next) => {

	var data = [{
		UserID: parseInt(req.body.UserID),
		PropertyID: parseInt(req.body.PropertyID),
		IsActive: true
	}]

	commonFunction.saveFavourite('FavouriteProperties', data, (err, results) => {
		if (err) {
			res.send({
				status: 'danger',
				msg: 'Error in saved favourite.'
			});
			return false;
		} else {
			res.send({
				status: 'success',
				msg: 'Favourite saved successfully.'
			});
			return false;
		}
	})
});


router.get('/:id', function (req, res) {
	ShowIndividualProperty(req.param('id'), res, req);
});

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
		ImageGallery: [],
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
			function (propertyData, cb) {
				getModel.getSinglePropertyDetails(propertyID, (err, singlePropertyResult) => {
					if (singlePropertyResult && singlePropertyResult.length) {
						propertyData.singlePropertyResult = singlePropertyResult[0];
						cb(null, propertyData);
					} else {
						cb(err, propertyData);
					}
				});
			},
			function (propertyData, cb) {
				commonFunction.selectAll("ProjectStatus",(err, ProjectStatus) => {
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
				getModel.getSimilarProperties(propertyID, propertyData.singlePropertyResult.PropertyTypeID, (err, similarProperties) => {
					if (similarProperties && similarProperties.length) {
						propertyData.similarProperties = similarProperties;
						cb(null, propertyData);
					} else {
						cb(err, propertyData);
					}
				});
			},
			function (propertyData, cb) { // GET ALL AMENITIES OF PROPERTY.
				getModel.getAmenities(propertyID, (err, AmenityResult) => {
					if (AmenityResult && AmenityResult.length) {
						propertyData.AmenityResult = AmenityResult;
						cb(null, propertyData);
					} else {
						cb(err, propertyData);
					}
				})
			},
			function (propertyData, cb) { // GET ALL SPECIFICATIONS OF PROPERTY.
				getModel.getSpecification(propertyID, (err, SpecificationResult) => {
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
					commonFunction.getPropertyUnitData(propertyID, (unitErr, unitData) => {
						propertyData.UnitData = unitData;
						commonFunction.selectAll('PropertyType', (err, propertyType) => {
							if (err) {
								return;
							}
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
					title: 'Property Detail',
					sess_val: req.session.user_id,
					cities: propertyData.cities,
					subscribe_email: req.session.email,
					propertyType: propertyType,
					propertyDetails: propertyData.singlePropertyResult,
					imageGallery: propertyData.singlePropertyResult.Images,
					amenities: propertyData.AmenityResult,
					specifications: propertyData.SpecificationResult,
					similarProperties: propertyData.similarProperties,
					priceCalculation: propertyData.UnitData.extent,
					StatusData: propertyData.StatusData,
					similarPropertiesImageGallery: propertyData.ImageGallery,
					UnitData: propertyData.UnitData,
					favoriteData: favoriteData,
					userName: req.session.name,
					getMonthName: commonFunction.getMonthName,
					Tags: propertyData.singlePropertyResult.Tags,
					currencyFormat: commonFunction.currencyFormat,
					YouTubeGetID: commonFunction.YouTubeGetID
				});
			}
		});
	} else {
		res.send("You have not selected any property. Please select a property first!");
	}
}

module.exports = router;