var map = null;
var infowindow = null;
var marker = null;
var geocoder = null;
var markers = [];
var polygon = null;
var polygons = [];
var drawingManager = null;
var all_overlays = [];
var selectedShape;
var chicago = {
    lat: 41.85,
    lng: -87.65
};

var price_data;
var dates = {};
var data_load_status = 0;
var maphit = 0;
var Landuse_Layer;
var price_layer;
var date_price;
var filters;
var f_date_prices;
var popups = [];
var bounds = null;
function initMap() {

    if ($('#map').length == 1) {
        definePopupClass();
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: new google.maps.LatLng(16.5062, 80.6480),
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            streetViewControl: false,
        });
        
        infowindow = new google.maps.InfoWindow({
            zIndex: 1
        });
        bounds = new google.maps.LatLngBounds();
        // Set styles for each polygon
        map.data.setStyle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
       
         
        setTimeout(function () {
             if (typeof geoJson != 'undefined') {
                showPriceTrendsPolygon(geoJson);
            } 
            else {
                if(window.location.pathname.split('/').includes('submit-property')){
                var polyOptions = {
                    strokeWeight: 0,
                    strokeColor: '#FF0000',
                    strokeWeight: 2,
                    fillOpacity: 0,
                    editable: false
                };
            
                drawingManager = new google.maps.drawing.DrawingManager({
                    //drawingMode: 'none',//google.maps.drawing.OverlayType.POLYGON,
                    markerOptions: {
                        draggable: true,
                        //icon: icon
                    },
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT,
                        drawingModes: ['polygon', 'marker']
                    },
                    polygonOptions: polyOptions,
                    map: map
                });
            
            
                google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
                    deleteAllShape();
                    all_overlays.push(e);
                    if (e.type != google.maps.drawing.OverlayType.MARKER) {
                        drawingManager.setDrawingMode(null);
                        var newShape = e.overlay;
                        newShape.type = e.type;
                        google.maps.event.addListener(newShape, 'click', function () {
                            setSelection(newShape);
                        });
                        setSelection(newShape);
            
                        var paths = newShape.getPaths();
                        paths.forEach(function (path, i) {
                            console.log('i ---------- ', i);
                            google.maps.event.addListener(path, "insert_at", function (index, obj) {
                                console.log('insert_at', index, ' ========= ', obj, newShape);
                            });
                            google.maps.event.addListener(path, "set_at", function (index, obj) {
                                console.log('set_at', index, ' ========= ', obj, newShape);
                            });
                            google.maps.event.addListener(path, "remove_at", function (index, obj) {
                                console.log('remove_at ===== ', index, ' ========= ', obj, newShape);
                            });
                        });
            
            
                    } else {
                        var newShape = e.overlay;
                        newShape.type = e.type;
                    }
            
                    google.maps.event.addListener(newShape, 'dragend', function (e) {
                       
                    });
                    $('#nolocation').prop('checked', false);
                    $('#nolocation').prop('disabled', true);
                    
                    $('#drawShap').val(GMapPolygonToWKT(newShape));
            
                });
            
                addAdditoinalButton();
            
                google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
                google.maps.event.addListener(map, 'click', clearSelection);
                
            }
        }

            if (typeof propertyResult != 'undefined') {
                renderGeometry(propertyResult);
            }
        }, 1000);

    }


    
    var input = document.getElementById('searchInput');
    var input1 = document.getElementById('searchInput1');
    if (input) {
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function () {

            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Location not found, Please try again");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (map) {
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
            }
        });
    }

    if(input1){
        var searchBox = new google.maps.places.SearchBox(input1);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input1);

        var addressInputElement = $('#searchInput1');
        // console.log(addressInputElement,'---------',searchBox,'addressInputElement')

        addressInputElement.on('focus', function () {
            var pacContainer = $('.pac-container');
            $(addressInputElement.parent()).append(pacContainer);
        })
        addressInputElement.css({height:'24px',margin:'5px'});

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
  
            if (places.length == 0) {
              return;
            }
  
            // For each place, get the icon, name and location.
            places.forEach(function(place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }
            
              // Create a marker for each place.
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });
        }
    //}
}


function drawingMap(val){
    
}



function renderGeometry(data) {
   // console.log(data)
    if(data.length == undefined){
        data = [data];
    }
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        
        if (data[i].geometry && fromWKT2Json(data[i].geometry).type == 'polygon') {
            var geometry = fromWKT2Json(data[i].geometry).rings[0];
            obj.geometry = geometry;
            obj.city = data[i].city;
            obj.PropertyTypeID = data[i].PropertyTypeID;
            obj.viewPrice = data[i].viewPrice;
            obj.Title = data[i].Title;
            obj.Area = data[i].Area;
            obj.id = data[i].ID;
            obj.URL = data[i].URL;
            obj.unitDetails = data[i].unitDetails;
            obj.data = data[i];
            createPolygons(obj);
            //setBounds();
        }

        if (data[i].geometry && fromWKT2Json(data[i].geometry).type == 'point') {
            var geometry = {
                lat: fromWKT2Json(data[i].geometry).x,
                lng: fromWKT2Json(data[i].geometry).y
            };
            obj.geometry = geometry;
            obj.PropertyTypeID = data[i].PropertyTypeID;
            obj.id = data[i].ID;
            obj.city = data[i].city;
            obj.viewPrice = data[i].viewPrice;
            obj.Title = data[i].Title;
            obj.Area = data[i].Area;
            obj.URL = data[i].URL;
            obj.unitDetails = data[i].unitDetails;
            obj.data = data[i];
            createMarker(obj);
            //setBounds();
        }   
        // setBounds();
    }
    
}

function setBounds(){
    if(map){
        setTimeout(function(){
            map.fitBounds(bounds);
        },1000);
    }
}

function createPolygons(obj) {

   var color = (obj.PropertyTypeID == 1) ? '#FD2222' : ((obj.PropertyTypeID == 2) ? '#4213C4' : '#16A516');
   var icon = (obj.PropertyTypeID == 1) ? '/img/marker/plot-marker.png' : ((obj.PropertyTypeID == 2) ? '/img/marker/res-marker.png' : '/img/marker/agri-marker.png');

    polygon = new google.maps.Polygon({
        paths: obj.geometry,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35
    });

    polygons[obj.id] = polygon;
    polygon.setMap(map);
    setSelection(polygon);
    //Define position of label
    
    for (var i = 0; i < obj.geometry.length; i++) {
        bounds.extend(obj.geometry[i]);
    }
    var myLatlng = bounds.getCenter();
   
    markerPolygon = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
        position: myLatlng,
        icon: document.location.origin + icon
    });
 
    var content = "<div class='info-popup info-pop-contaier' id='info-map-view'><div id='cus-info-header-container'><img src="+document.location.origin+"/img/logos/logo.png></div>\
    <div id='cus-info-body-container' style='padding:5px 0;'>\
    <b style='display: block; margin-bottom: 7px;'>" + obj.Title + "</b>\
    <b style='display: block; margin-bottom: 7px;'><i class='lnr lnr-map-marker'></i>";
    if(obj.Area){
    content += '' + obj.Area + ',';
    }

    content += "&nbsp;" + obj.city + "</b>\
    <b style='margin-bottom: 7px;'>Price: </b>" + obj.viewPrice + "\
    </div>";
 
     if (obj.unitDetails && obj.unitDetails.length > 0) {
         content += "<div id='cus-info-details'><div id='cus-info-details-header'><b style='color:#fff'> Unit Details</b></div></div>";
         for (i = 0; i < obj.unitDetails.length; i++) {
             content +="<div id='menu-group-"+i+"' class='nav menu border-bottom'><div class='item-"+i+" deeper parent active'><a data-toggle='collapse' data-parent='#menu-group-"+i+"' href='#sub-item-"+i+"' class='sign collapsed unitToggle'>\
                         <span><i class='fa fa-minus'></i></span>\
                         <span class='lbl'> "+ obj.unitDetails[i].UnitTitle +"</span>\
                     </a>\
                     <div class='children nav-child unstyled small collapse' id='sub-item-"+i+"' >\
                             <span class='unit-content'>Unit Extent : "+ obj.unitDetails[i].SuperBuiltUpArea+"</span>\
                     </div>\
                 </div>\
             </div>";
         }
     }
     content += "<div class='info-buttons'><a href='"+obj.URL+"' target='_blank'><button type='button' class='button transparent'>Details</button></a>\
    <button type='button' class='button transparent' onclick='iAm_Interested("+JSON.stringify(obj.data)+")'>I am interested</button></div></div>";

    google.maps.event.addListener(polygon, 'click', function (event) {
        infowindow.setContent(content);
        infowindow.setPosition(myLatlng);
        infowindow.open(map);
    });

    google.maps.event.addListener(markerPolygon, 'click', function (event) {
        infowindow.setContent(content);
        infowindow.setPosition(myLatlng);
        infowindow.open(map);
    });
    
}

function propertyInfowindow(id,url) {
    if($('body').hasClass('mapdata-show')){
        var bounds = new google.maps.LatLngBounds();
        if (markers[id] !== undefined) {
            google.maps.event.trigger(markers[id], 'click');
            var myLatLng = markers[id].position;
            bounds.extend(myLatLng);
            map.fitBounds(bounds);
        } else if (polygons[id]) {
            google.maps.event.trigger(polygons[id], 'click', {});
            var vertex = polygons[id].getPaths().getArray()[0].j;
            for (var i = 0; i < vertex.length; i++) {
                bounds.extend(vertex[i]);
            }
            map.fitBounds(bounds);
        } else {
            alert('No location available for selected property!');
        }
    }else{
        // window.location = url;
            window.open(url);
    }
}

function createMarker(obj) {  
     
    var icon = (obj.PropertyTypeID == 1) ? '/img/marker/plot-marker.png' : ((obj.PropertyTypeID == 2) ? '/img/marker/res-marker.png' : '/img/marker/agri-marker.png');
    
    marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
        position: obj.geometry,
        icon: document.location.origin + icon
    });
    markers[obj.id] = marker;


    var content = "<div class='info-popup info-pop-contaier' id='info-map-view'><div id='cus-info-header-container'><img src="+document.location.origin+"/img/logos/logo.png></div>\
   <div id='cus-info-body-container' style='padding:5px 0;'>\
   <b style='display: block; margin-bottom: 7px;'>" + obj.Title + "</b>\
   <b style='display: block; margin-bottom: 7px;'><i class='lnr lnr-map-marker'></i>";
   if(obj.Area){
    content+=   '' + obj.Area + ',';
    }

   content += "&nbsp;" +obj.city + "</b>\
   <b style='margin-bottom: 7px;'>Price: </b>" + obj.viewPrice + "\
   </div>";

    if (obj.unitDetails && obj.unitDetails && obj.unitDetails.length > 0) {
        content += "<div id='cus-info-details'><div id='cus-info-details-header'><b style='color:#fff'> Unit Details</b></div></div>";
        for (i = 0; i < obj.unitDetails.length; i++) {
            content +="<div id='menu-group-"+i+"' class='nav menu border-bottom'><div class='item-"+i+" deeper parent active'><a data-toggle='collapse' data-parent='#menu-group-"+i+"' href='#sub-item-"+i+"' class='sign collapsed unitToggle'>\
                        <span><i class='fa fa-minus'></i></span>\
                        <span class='lbl'> "+ obj.unitDetails[i].UnitTitle +"</span>\
                    </a>\
                    <div class='children nav-child unstyled small collapse' id='sub-item-"+i+"' >\
                            <span class='unit-content' >Unit Extent : "+ obj.unitDetails[i].SuperBuiltUpArea+"</span>\
                    </div>\
                </div>\
            </div>";
        }
    }


    content += "<a href='"+obj.URL+"' target='_blank'><button type='button' class='button transparent'>Details</button></a>\
    <button type='button' class='button transparent' onclick='iAm_Interested("+JSON.stringify(obj.data)+")'>I am interested</button></div>";
  
    bounds.extend(obj.geometry);


    google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, marker);
        };
    })(marker, content, infowindow));
}


function clearGeometry() {
    if (markers) {
        for (var i = 0; i < polygons.length; i++) {
            if (polygons[i]) {
                polygons[i].setMap(null)
            }
        }
    }
    if (markers) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i]) {
                markers[i].setMap(null)
            }
        }
    }
}

function addAdditoinalButton() {
    var centerControlDiv = document.createElement('div');
    var goCenterUI = document.createElement('div');
    goCenterUI.id = 'goCenterUI';
    goCenterUI.title = 'Clear Selection';
    centerControlDiv.appendChild(goCenterUI);
    var goCenterText = document.createElement('div');
    goCenterText.id = 'goCenterText';
    goCenterText.innerHTML = 'clear';
    goCenterUI.appendChild(goCenterText);
    centerControlDiv.index = 1;
    centerControlDiv.style['padding-top'] = '5px';

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    goCenterUI.addEventListener('click', deleteSelectedShape);
}

function clearSelection() {
    if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
    }
}

function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    var a = shape.setEditable(true);
    console.log(a);
}

function deleteSelectedShape() {
    $('#nolocation').prop('disabled', false);
    $('#drawShap').val('');
    if (selectedShape) {
        selectedShape.setMap(null);
    }
}

function deleteAllShape() {
    $('#nolocation').prop('disabled', false);
    $('#drawShap').val('');
    for (var i = 0; i < all_overlays.length; i++) {
        all_overlays[i].overlay.setMap(null);
    }
    all_overlays = [];
}


function getCurrentLocation() {
   // console.log($('#surveyNo').val()); return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            reverseGeocode(pos);
            marker = new google.maps.Marker({
                map: map,
                anchorPoint: new google.maps.Point(0, -29),
                position: pos
            });
        }, function () {
            handleLocationError(true, infowindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
    }
}


function geocode(address) {
   console.log(address,'------')
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        console.log('----results',results,status)
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
           /*  $('#searchInput').val(address);
            $('#searchInput1').val(address); */
            $('#searchInput').val(results[0].formatted_address);
            $('#searchInput1').val(results[0].formatted_address);
            // $('#searchInput').val(address);
            map.fitBounds(results[0].geometry.bounds);
        } else {
            $('#searchInput').val(address);
            // $('#searchInput1').val(address);
            $('#searchInput1').val(results[0].formatted_address);
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function reverseGeocode(pos) {
    geocoder.geocode({
        'location': pos
    }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                jQuery('#searchInput').val(results[0].formatted_address);
                jQuery('#searchInput1').val(results[0].formatted_address);
            } else {
                console.log('No results found');
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    });
}


function GMapPolygonToWKT(poly) {
    if (poly instanceof google.maps.Polygon) {
        var wkt = "POLYGON(";
        var paths = poly.getPaths();
        for (var i = 0; i < paths.getLength(); i++) {
            var path = paths.getAt(i);
            wkt += "(";
            for (var j = 0; j < path.getLength(); j++) {
                wkt += path.getAt(j).lng().toString() + " " + path.getAt(j).lat().toString() + ",";
            }
            wkt += path.getAt(0).lng().toString() + " " + path.getAt(0).lat().toString() + "),";
        }

        wkt = wkt.substring(0, wkt.length - 1) + ")";
    } else if (poly instanceof google.maps.Marker) {
        wkt = "POINT(" + poly.position.lat() + " " + poly.position.lng() + ")";
    }
    return wkt;
}

function fromWKT2Json(WKTstr) {
    var mods = {};
    var convertToPointArray = function (ptArrayString) {
        var points = [],
            ptStringArray = ptArrayString.replace(/\)|\(/gi, "").split(",");
        ptStringArray.forEach(function (pt) {
            var splitpt = pt.trim().split(" "),
                y = parseFloat(splitpt[0], 10),
                x = parseFloat(splitpt[1], 10);
            points[points.length] = {
                lat: x,
                lng: y
            };
        });

        // console.log('points===',points);
        return points;
    };

    mods.POINT = function (tailStr) {
        ///point should be in the following format:
        //    (xxxx yyyy)
        var point = tailStr.replace(/\)|\(/gi, "").trim().split(" ");
        return {
            type: 'point',
            x: parseFloat(point[0], 10),
            y: parseFloat(point[1], 10)
        };
    };
    mods.MULTILINESTRING = function (tailStr) {
        //should be in the following format:
        //    MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
        ///strip outermost parenthesis
        tailStr = tailStr.replace(/(\(\()|(\)\))/gi, '');
        //split on tailing parenthesis and comma
        var paths = [],
            pathsRaw = tailStr.split("),"); ///show now have ['(x1 y1, x2 y2,....)','(x1 y1, x2 y2,....)',...]

        pathsRaw.forEach(function (p) {
            paths[paths.length] = convertToPointArray(p);

        });
        return {
            type: 'polyline',
            paths: paths
        };
    };

    mods.POLYGON = function (tailStr) {
        var ml = mods.MULTILINESTRING(tailStr);
        ///DIFFERENCES BETWEEN THIS AND MULTILINE IS THAT THE PATHS ARE RINGS 
        return {
            type: 'polygon',
            rings: ml.paths
        };
    };
    mods.MULTIPOLYGON = function (tailStr) {
        console.error('MULTIPOLYGON - not implemented');
    };
    mods.MULTIPOINT = function (tailStr) {
        return {
            type: 'multipoint',
            points: convertToPointArray(tailStr)
        };
    };
    mods.LINESTRING = function (tailStr) {
        //only close translation is multipoint
        return mods.MULTIPOINT(tailStr);

    };
    //chunk up the incoming geometry WKT  string
    var geoArray = WKTstr.split("("),
        head = geoArray.shift().trim(), ///head should be the geometry type
        tail = '(' + (geoArray.join("(").trim()); ///reconstitute the body

    return mods[head](tail);
}

function showPriceTrendsPolygon(data) {
    price_layer = map.data.addGeoJson(data);
    var bounds = new google.maps.LatLngBounds();
    map.data.forEach(function (feature) {
        feature.getGeometry().forEachLatLng(function (latlng) {
            bounds.extend(latlng);
        });
    });
    map.fitBounds(bounds);
    map.setZoom(12);
    loadmap(data);
}

function loadmap(data) {
    if (price_data && data_load_status == 1) {
        //filter_price_layer(price_data);
    } else {
        price_data = data;
        data_load_status = 1;

        $.each(price_data.features, function (i, option) {

            $.each(option.properties.prices, function (i, option) {

                if (!(dates[option.date])) {

                    dates[option.date] = {
                        'date': option.date,
                        'residential': [0, 0],
                        'commercial': [0, 0],
                        'average': [0, 0]
                    };
                }
                if (option.residential[0] && ((dates[option.date]['residential'][0] > option.residential[0]) || (dates[option.date]['residential'][0] < 1))) {
                    dates[option.date]['residential'][0] = option.residential[0];
                }
                if (option.residential[1] && ((dates[option.date]['residential'][1] < option.residential[1]))) {
                    dates[option.date]['residential'][1] = option.residential[1];
                }
                if (option.commercial[0] && ((dates[option.date]['commercial'][0] > option.commercial[0]) || (dates[option.date]['commercial'][0] < 1))) {
                    dates[option.date]['commercial'][0] = option.commercial[0];
                }
                if (option.commercial[1] && ((dates[option.date]['commercial'][1] < option.commercial[1]))) {
                    dates[option.date]['commercial'][1] = option.commercial[1];
                }
                if (option.average[0] && ((dates[option.date]['average'][0] > option.average[0]) || (dates[option.date]['average'][0] < 1))) {
                    dates[option.date]['average'][0] = option.average[0];
                }
                if (option.average[1] && ((dates[option.date]['average'][1] < option.average[1]))) {
                    dates[option.date]['average'][1] = option.average[1];
                }
            })
        })

        datetable = document.createElement("table");
        datetable.setAttribute("id", "datetable");
        datetable.setAttribute("class", "filtertable myList1 table table-hover");
        var dates_sorted = [];
        for (var key in dates) {
            dates_sorted.push(key);
        }
        dates_sorted = dates_sorted.reverse();
        $.each(dates_sorted, function (i, option) {
            row = datetable.insertRow(-1);
            cell = row.insertCell();
            var i;
            // cell.innerHTML = '<label><input class="mapsfilter" type="radio" Value="' + option + '" name="date">' + format_date(option) + '</label>'; //&nbsp;<span id="C" class="badge landuse">0</span>';
            cell.innerHTML = '<div class="radio  inline"><input id="date_'+i+'" class="mapsfilter" type="radio" Value="' + option + '" name="date"><label for="date_'+i+'" checked>' + format_date(option) + '</label></div>'; //&nbsp;<span id="C" class="badge landuse">0</span>';
            // <div class="radio  inline"><input class="mapsfilter" type="radio" Value="' + option + '" name="date"><label for="Residential" checked>Residential</label></div>
        
        });

        $("#datefilter").append(datetable);
        $("#datetable tr:first input").prop("checked", true);
        triggers();
        filter_price_layer(price_data);
    }
}

function triggers() {
    $("table.filtertable td").on('click', function (e) {
        infowindow.close();
        var chk = $(this).find("input:radio")[0].click();
        filters = {
            'landuse': $('#landusetable.filtertable input:checked').val(),
            'date': $('#datetable.filtertable input:checked').val()
        };

        f_date_prices = '' //feature.prices[filters.date]; 
        if (!(f_date_prices)) {
            f_date_prices = {};
        }
        date_price = dates[filters.date][filters.landuse];
        map.data.setStyle(style_price_layer);
        createLabel();

    });
    //map controls
    $("#fullzoom.mapcontrol").on('click', function (e) { //zoom to layer function
        if (price_layer) {
            var bounds = new google.maps.LatLngBounds();
            map.data.forEach(function (feature) {
                feature.getGeometry().forEachLatLng(function (latlng) {
                    bounds.extend(latlng);
                });
            });
            map.fitBounds(bounds);
        }
    })
    $("#reset.mapcontrol").on('click', function (e) { //reset function
        location.reload();
    })
};

function format_date(date) {
    var parseTime = d3.timeParse("%Y-%m-%d"),
        locale = "en-us",
        date = new Date(parseTime(date));
    return date.toLocaleString(locale, {
        month: "long",
        year: "numeric"
    });
}

function clearbadges() {
    $('span.badge.layout').html(0); // layouts badges
    $('span.badge.landuse').html(0); // landuse badges
    $('span.badge.facing').html(0); // facing badges
}

function createLabel() {
    clearPopup();
    map.data.forEach(function (e) {
        var feature = e.l;
        f_date_prices = feature.prices[filters.date];
        if (!(f_date_prices)) {
            f_date_prices = {};
        }
        var tooltiptext = "<div class='text-center infoWindowToolTip'><b>" + feature.v_name + "</b><br>\
            " + f_date_prices_curr_lu() + "</div>";
        var location = polygonCenter(e.getGeometry().getArray()[0]['j']);
        var contant = document.createElement('div');
        contant.innerHTML = tooltiptext;
        popup = new Popup(location, contant);
        popup.setMap(map);
        popups.push(popup);
    })

}

function clearPopup() {
    for (var i = 0; i < popups.length; i++) {
        popups[i].setMap(null);
    }
    popups = [];
}

function polygonCenter(vertices) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [];
    //vertices = poly.getPath();

    for (var i = 0; i < vertices.length; i++) {
        lngs.push(vertices[i].lng());
        lats.push(vertices[i].lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx - lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
}

function filter_price_layer(price_data) {
    filters = {
        'landuse': $('#landusetable.filtertable input:checked').val(),
        'date': $('#datetable.filtertable input:checked').val()
    };
    date_price = dates[filters.date][filters.landuse];

    map.data.setStyle(style_price_layer);
    createLabel();

    map.data.addListener('click', function (event) {
        filters = {
            'landuse': $('#landusetable.filtertable input:checked').val(),
            'date': $('#datetable.filtertable input:checked').val()
        };
        date_price = dates[filters.date][filters.landuse];
        var price_geojson = price_data;
        var feature = event.feature.l;
        /* if($("input:radio[name='date']:checked").val() == feature )
        console.log(event); */
        f_date_prices = feature.prices[filters.date];
        if (!(f_date_prices)) {
            f_date_prices = {};
        }



        var currentpricetable = document.createElement("table");

        currentpricetable.setAttribute("class", "table table-hover nomargin");

        var row = currentpricetable.insertRow(-1);
        row.insertCell().innerHTML = "<b>Commercial: </b>";
        row.insertCell().innerHTML = feature_price(f_date_prices.commercial);
        var row = currentpricetable.insertRow(-1);
        row.insertCell().innerHTML = "<b>Residential: </b>";
        row.insertCell().innerHTML = feature_price(f_date_prices.residential);



        var frag = document.createElement("div");
        frag.setAttribute("class", "pricechart");

        var margin = {
                top: 10,
                right: 20,
                bottom: 50,
                left: 50
            },
            width = 260 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        var parseTime = d3.timeParse("%Y-%m-%d");

        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var valueline_commercial = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.commercial);
            });

        var valueline_residential = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.residential);
            });


        function make_x_gridlines() {
            return d3.axisBottom(x)
        }


        function make_y_gridlines() {
            return d3.axisLeft(y).ticks(5)
        }


        var svg = d3.select(frag).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var data_in = feature.prices;
        var data = [];
        for (var key in feature.prices) {
            var row = {
                'date': parseTime(data_in[key].date),
                'commercial': +(data_in[key].commercial[0] + data_in[key].commercial[1]) / 2,
                'residential': +(data_in[key].residential[0] + data_in[key].residential[1]) / 2
            };
            data.push(row);
        };

        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([d3.min(data, function (d) {
            return Math.min(d.residential, d.commercial);
        }), d3.max(data, function (d) {
            return Math.max(d.residential, d.commercial);
        })]);


        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
            )


        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            )


        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline_commercial);


        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "orange")
            .attr("d", valueline_residential);


        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");


        svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        var popup_content = function () {
            return "<div style='font-size:12px'><div id='cus-info-header-container'><img src='http://avenuein.wpengine.netdna-cdn.com/wp-content/uploads/2015/11/Logo-Avenue-Caption-White.png'></div>\
            <div id='cus-info-body-container' style='padding:5px;'>\
            <b>" + titleCase(feature.v_name) + "</b>\
            <b>, Mandal-</b>" + titleCase(feature.m_name) + "\
            <b>, Dist-</b>" + titleCase(feature.d_name) + "\
            </div>\
            <div id='cus-info-details'><div id='cus-info-details-header'><b style='color:#fff'>Prices as on " + format_date(filters.date) + "</b></div>\
            " + currentpricetable.outerHTML + "\
            </div>\
            <div id='cus-info-details'><div id='cus-info-details-header'><b style='color:#fff;'>Prices Over The Time</b></div>\
            <div id='pastpricechart' style='max-height: 300px; overflow: auto;'>" + frag.outerHTML + "</div>\
            </div><div>";
        }

        infowindow.setContent(popup_content());
        infowindow.setPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
        infowindow.setOptions({
            pixelOffset: new google.maps.Size(0, -30)
        });
        infowindow.open(map);
    });

    if (!$('#overlay').hasClass('hidden')) {
        $('#overlay').addClass('hidden');
    }
}

var f_date_prices_curr_lu = function () {
    var string_to_return = 'Sorry No Data Available !';
    try {
        string_to_return = feature_price(f_date_prices[filters.landuse]);
    } catch (e) {};
    return string_to_return;
};
var feature_price = function (price_array) {
    var string_to_return = 'Sorry No Data Available !';
    try {

        if (price_array[1] > 0) {
            string_to_return = "<i class='fa fa-inr' aria-hidden='true' style='color:#cc6a26;'></i>&nbsp;" + price_array[0] + " - <i class='fa fa-inr' aria-hidden='true' style='color:#cc6a26;'></i>&nbsp;" + price_array[1];
        }
    } catch (e) {
        console.log(e);
    }
    return string_to_return;
}

function style_price_layer(feature) {
    var weight = 2;
    var opacity = 1;
    var color = 'white';
    var dashArray = '5';
    var fillOpacity = .8;
    var fillColor = 'hsl(0, 50%, 40%)';
    try {
        if (feature.l.prices[filters.date][filters.landuse][1] > 0) {
            var feature_price = feature.l.prices[filters.date][filters.landuse];
            var heat = Math.round(((feature_price[0] + feature_price[1]) / 2 - date_price[0]) * 100 / (date_price[1] - date_price[0]));
            fillColor = 'hsl(215, ' + heat + '%, 40%)';
        }
    } catch (e) {
        console.log(e);
    }
    return {
        weight: weight,
        strokeColor: 'white',
        opacity: opacity,
        color: color,
        dashArray: dashArray,
        fillOpacity: fillOpacity,
        fillColor: fillColor,
        strokeWeight: 2
    };
}

function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

/** Defines the Popup class. */
function definePopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    Popup = function (position, content) {
        this.position = position;

        content.classList.add('popup-bubble-content');

        var pixelOffset = document.createElement('div');
        pixelOffset.classList.add('popup-bubble-anchor');
        pixelOffset.appendChild(content);

        this.anchor = document.createElement('div');
        this.anchor.classList.add('popup-tip-anchor');
        this.anchor.appendChild(pixelOffset);

        // Optionally stop clicks, etc., from bubbling up to the map.
        this.stopEventPropagation();
    };
    // NOTE: google.maps.OverlayView is only defined once the Maps API has
    // loaded. That is why Popup is defined inside initMap().
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);

    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function () {
        this.getPanes().floatPane.appendChild(this.anchor);
    };

    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function () {
        if (this.anchor.parentElement) {
            this.anchor.parentElement.removeChild(this.anchor);
        }
    };

    /** Called when the popup needs to draw itself. */
    Popup.prototype.draw = function () {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
        // Hide the popup when it is far out of view.
        var display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
            'block' :
            'none';

        if (display === 'block') {
            this.anchor.style.left = divPosition.x + 'px';
            this.anchor.style.top = divPosition.y + 'px';
        }
        if (this.anchor.style.display !== display) {
            this.anchor.style.display = display;
        }
    };

    /** Stops clicks/drags from bubbling up to the map. */
    Popup.prototype.stopEventPropagation = function () {
        var anchor = this.anchor;
        anchor.style.cursor = 'auto';

        ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
            'pointerdown'
        ]
        .forEach(function (event) {
            anchor.addEventListener(event, function (e) {
                e.stopPropagation();
            });
        });
    };
}