jQuery.validator.addMethod("city", function(value, element) {
        return (value != '');
    }, "City is missing.");
    jQuery.validator.addMethod("property_title", function(value, element) {
        return (value != '');
    }, "Property Title is missing.");
    jQuery.validator.addMethod("areaId", function(value, element) {
        return (value != '');
    }, "Area is missing.");
    jQuery.validator.addMethod("propertyType", function(value, element) {
        return (value != '');
    }, "Property type is missing.");
    
    jQuery.validator.addMethod("PropertyTypeChildID", function(value, element) {
        return (value != '');
    }, "Property Category is missing.");
    jQuery.validator.addMethod("PropertySaleTypeID", function(value, element) {
        return (value != '');
    }, "Property sale type is missing.");
    
    jQuery.validator.addMethod("extent", function(value, element) {
        return (value != '');
    }, "Extent is missing.");
    jQuery.validator.addMethod("extent", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Extent should be numeric.");
    jQuery.validator.addMethod("asking_price", function(value, element) {
        return (value != '');
    }, "Asking Price is missing.");
    jQuery.validator.addMethod("asking_price", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Asking Price should be numeric.");
    jQuery.validator.addMethod("search_price", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Search Price should be numeric.");
    jQuery.validator.addMethod("displayPrice", function(value, element) {
        return (value != '');
    }, "Display Price is missing.");
    jQuery.validator.addMethod("geoLocation", function(value, element) {
        return (value != '');
    }, "GeoLocation is missing.");
    
    
    jQuery.validator.addMethod("abuttingRoadWidth", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Abutting Road Width should be numeric.");
    
    
    jQuery.validator.addMethod("description", function(value, element) {
        return (value != '');
    }, "Description is missing.");
    jQuery.validator.addMethod("plotsNo", function(value, element) {
        return (value != '');
    }, "Plots No is missing.");
    
    
    
    jQuery.validator.addMethod("Landmark", function(value, element) {
        return (value != '');
    }, "Plots Nearby is missing.");
    jQuery.validator.addMethod("layoutArea", function(value, element) {
        return (value != '');
    }, "Layout Area is missing.");
    jQuery.validator.addMethod("noOfPlots", function(value, element) {
        return (value != '');
    }, "No Of Plots is missing.");
    jQuery.validator.addMethod("bankLoan", function(value, element) {
        return (value != '');
    }, "Bank Loan is missing.");
    jQuery.validator.addMethod("compoundWall", function(value, element) {
        return (value != '');
    }, "Compound Wall is missing.");
    jQuery.validator.addMethod("overheadTank", function(value, element) {
        return (value != '');
    }, "Overhead Tank is missing.");
    jQuery.validator.addMethod("AvenuePlantation", function(value, element) {
        return (value != '');
    }, "Avenue Plantation is missing.");
    jQuery.validator.addMethod("nameboard", function(value, element) {
        return (value != '');
    }, "Name board is missing.");
    jQuery.validator.addMethod("crop", function(value, element) {
        return (value != '');
    }, "Crop is missing.");
    jQuery.validator.addMethod("bore", function(value, element) {
        return (value != '');
    }, "Bore is missing.");
    jQuery.validator.addMethod("noOfBore", function(value, element) {
        return (value != '');
    }, "No of bore is missing.");
  
    jQuery.validator.addMethod("landsNearby", function(value, element) {
        return (value != '');
    }, "Lands Nearby is missing.");
    
    jQuery.validator.addMethod("totalUnits", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Total Units should be numeric.");
    jQuery.validator.addMethod("totalFloors", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Total Floors should be numeric.");
    jQuery.validator.addMethod("totalTowers", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Total Towers should be numeric.");
    
    jQuery.validator.addMethod("cupboards", function(value, element) {
        return (value != '');
    }, "Cupboards is missing.");
    
    jQuery.validator.addMethod("doorMain", function(value, element) {
        return (value != '');
    }, "Main door is missing.");
    jQuery.validator.addMethod("doorInternal", function(value, element) {
        return (value != '');
    }, "Internal door is missing.");
    jQuery.validator.addMethod("kitchen", function(value, element) {
        return (value != '');
    }, "Kitchen is missing.");
    jQuery.validator.addMethod("bankLoan", function(value, element) {
        return (value != '');
    }, "BankLoan is missing.");
    jQuery.validator.addMethod("living", function(value, element) {
        return (value != '');
    }, "Living is missing.");
    jQuery.validator.addMethod("dining", function(value, element) {
        return (value != '');
    }, "Dining is missing.");
    jQuery.validator.addMethod("master", function(value, element) {
        return (value != '');
    }, "Master is missing.");
    jQuery.validator.addMethod("bedroom", function(value, element) {
        return (value != '');
    }, "Bedroom is missing.");
    jQuery.validator.addMethod("otherBedroom", function(value, element) {
        return (value != '');
    }, "Other Bedroom is missing.");
    jQuery.validator.addMethod("toilets", function(value, element) {
        return (value != '');
    }, "Toilet is missing.");
    jQuery.validator.addMethod("brickWalls", function(value, element) {
        return (value != '');
    }, "Brick Wall is missing.");
    jQuery.validator.addMethod("exteriorWalls", function(value, element) {
        return (value != '');
    }, "Exterior Wall is missing.");
    jQuery.validator.addMethod("toiletWalls", function(value, element) {
        return (value != '');
    }, "Toilet Wall is missing.");
    jQuery.validator.addMethod("kitchenWalls", function(value, element) {
        return (value != '');
    }, "Kitchen Wall is missing.");
    jQuery.validator.addMethod("windows", function(value, element) {
        return (value != '');
    }, "Window is missing.");
    jQuery.validator.addMethod("frameStructure", function(value, element) {
        return (value != '');
    }, "Frame Structure is missing.");
    jQuery.validator.addMethod("wiring", function(value, element) {
        return (value != '');
    }, "Wiring is missing.");
    jQuery.validator.addMethod("switches", function(value, element) {
        return (value != '');
    }, "Switches are missing.");
    jQuery.validator.addMethod("kitchenCounter", function(value, element) {
        return (value != '');
    }, "Kitchen Counter is missing.");
    jQuery.validator.addMethod("cupboardsMaterialType", function(value, element) {
        return (value != '');
    }, "Cupboards Material Type is missing.");
    jQuery.validator.addMethod("kitchenFittings", function(value, element) {
        return (value != '');
    }, "Kitchen Fittings is missing.");
    jQuery.validator.addMethod("toiletsFittings", function(value, element) {
        return (value != '');
    }, "Toilets Fittings is missing.");
    jQuery.validator.addMethod("layoutsPlotSize", function(value, element) {
        return (value != '');
    }, "Layouts Plot Size is missing.");
    jQuery.validator.addMethod("layoutsFacing", function(value, element) {
        return (value != undefined);
    }, "Layouts Facing is missing.");
    jQuery.validator.addMethod("layoutsWidth", function(value, element) {
        return (value != '');
    }, "Layouts Width is missing.");
    jQuery.validator.addMethod("layoutsDepth", function(value, element) {
        return (value != '');
    }, "Layouts Depth is missing.");
    jQuery.validator.addMethod("layoutsRoadWidth", function(value, element) {
        return (value != '');
    }, "Layouts Road Width is missing.");
    jQuery.validator.addMethod("layoutsAvenuePlantation", function(value, element) {
        return (value != '');
    }, "Layouts Avenue Plantation is missing.");
    jQuery.validator.addMethod("buildingName", function(value, element) {
        return (value != '');
    }, "Building Name is missing.");
    jQuery.validator.addMethod("aboutBuilder", function(value, element) {
        return (value != '');
    }, "About Builder is missing.");
    jQuery.validator.addMethod("experience", function(value, element) {
        return (value != '');
    }, "Experience is missing.");
    jQuery.validator.addMethod("totalProjects", function(value, element) {
        return (value != '');
    }, "Total Projects is missing.");
    jQuery.validator.addMethod("ongoingProjects", function(value, element) {
        return (value != '');
    }, "Ongoing Projects is missing.");
    jQuery.validator.addMethod("ExtentOfTotalSite", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Site area should be numeric.");


//Unit detail validation
    jQuery.validator.addMethod("title", function(value, element) {
        return (value != '');
    }, "Title is missing.");
    jQuery.validator.addMethod("buildUpArea", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Super Built Up Area should be numeric.");
    jQuery.validator.addMethod("plinthArea", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Plinth Area should be numeric.");
    jQuery.validator.addMethod("undividedShare", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Undivided Share should be numeric.");
    jQuery.validator.addMethod("CarParkingArea", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Balcony Area should be numeric.");
    jQuery.validator.addMethod("BalconyArea", function(value, element) {
        return ($.isNumeric(value) != false);
    }, "Balcony Area should be numeric.");
    jQuery.validator.addMethod("UnitFloor", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Floor No should be numeric.");
jQuery.validator.addMethod("UnitExtent", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Unit Extent should be numeric.");
jQuery.validator.addMethod("PlotLength", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Plots length should be numeric.");
jQuery.validator.addMethod("PlotWidth", function(value, element) {
        return ($.isNumeric(value) != false || value == '');
    }, "Plots Width should be numeric.");
//requirement form validation

jQuery.validator.addMethod("MinExtent", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Min Extent should be numeric.");
jQuery.validator.addMethod("MaxExtent", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Max Extent should be numeric.");
jQuery.validator.addMethod("MinPrice", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Min Price should be numeric.");
jQuery.validator.addMethod("MaxPrice", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Max Price should be numeric.");
jQuery.validator.addMethod("MinBedrooms", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Min Bedrooms should be numeric.");
jQuery.validator.addMethod("MaxBedrooms", function(value, element) {
    return ($.isNumeric(value) != false);
}, "Max Bedrooms should be numeric.");

//registration form validation

jQuery.validator.addMethod("phonedigitonly", function(value, element) {
    return this.optional(element) || /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/.test(value);
}, "Please insert valid phone number.");

