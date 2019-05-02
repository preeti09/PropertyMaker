  /* API Config Start */
  avenueapiconfig = {
    host: {
      url: 'https://propertyshield.in',
      // url: 'http://api.avenue.in',
    },
    nodejsapi: {
      url: 'api/nodejsapi/',
    },
    geoserver: {
      url: 'geoserver',
    }
  }
  var nodejsapi = avenueapiconfig.host.url + '/' + avenueapiconfig.nodejsapi.url;
  var geoserverwmsapi = avenueapiconfig.host.url + '/' + avenueapiconfig.geoserver.url + '/wms';
  /* API Config END */

  function togglesidebarcollapse() {
    $('#sidebar').toggleClass('active');
    map.invalidateSize();
  }


  var layercontroller;

  function drawLayerControl(basemaps, layers) {
    try {
      $('.leaflet-control-layers').remove();
      layercontroller.removeFrom(map);
    } catch (err) {
      console.log(err);
    }
    layercontroller = L.control.layers(
      basemaps,
      layers, {
        collapsed: true,
        autoZIndex: false,
        position: 'topright'
      }
    ).addTo(map);
  }

  function leaflet_removelayer(layer) {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  }





  var map,
    url_params;

  function initmap() {
    map = L.map('mapcanvas', {
      zoomControl: false,
      scrollWheelZoom: true,
      center: [16.5, 80.5],
      zoom: 12,
      maxZoom: 20,
      minZoom: 4,
      //doubleClickZoom: false,
    });

    // Add Basemaps 
    var basemapminzoomlevel = 2
    var google_standard_roadmap_layer = L.tileLayer('https://www.google.co.in/maps/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga', {
      detectRetina: true,
      maxNativeZoom: 24,
      minZoom: basemapminzoomlevel,
      maxZoom: 30,
    }).setZIndex(1).addTo(map);
    var google_satellite_layer = L.tileLayer('https://www.google.co.in/maps/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga', {
      detectRetina: true,
      maxNativeZoom: 24,
      minZoom: basemapminzoomlevel,
      maxZoom: 30
    }).setZIndex(2);
    var google_hybrid_layer = L.tileLayer('https://www.google.co.in/maps/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga', {
      detectRetina: true,
      maxNativeZoom: 24,
      minZoom: basemapminzoomlevel,
      maxZoom: 30
    }).setZIndex(3);
    var google_terrain_layer = L.tileLayer('https://www.google.co.in/maps/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga', {
      detectRetina: true,
      maxNativeZoom: 24,
      minZoom: basemapminzoomlevel,
      maxZoom: 30
    }).setZIndex(4);
    var google_traffic_layer = L.tileLayer('https://www.google.co.in/maps/vt/lyrs=m@221097413,traffic&hl=en&x={x}&y={y}&z={z}&s=Ga', {
      detectRetina: true,
      maxNativeZoom: 24,
      minZoom: basemapminzoomlevel,
      maxZoom: 30
    }).setZIndex(5);
    var blankbasemap = L.tileLayer.wms('').setZIndex(10);
    var basemaps = {
      "Google Standard": google_standard_roadmap_layer,
      "Google Satellite": google_satellite_layer,
      "Google Hybrid": google_hybrid_layer,
      "Google Terrain": google_terrain_layer,
      "Google Transit": google_traffic_layer,
      "Remove Basemap": blankbasemap
    };

    L.control.scale({
      metric: true,
      imperial: false
    }).addTo(map);
    L.control.zoom({ //add zoom control to right side
      position: 'bottomleft',
    }).addTo(map);
    //leaflet_addgeolocation(map);
    drawmode = 0;
    map.on('click', function (e) {
      //clear_search_results();
      if (!(drawmode)) {
        handlemapclick(e);
      }
    });
    map.on('moveend', function (e) {
      //clear_search_results();
      //console.log('Map Zoom Level:', map.getZoom());
    });
    /*map.on('popupopen', function(e) {  //map leaflet popup adjust
      var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
      px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      map.panTo(map.unproject(px),{animate: true}); // pan to new center
    });*/
    //Get Max tiled size
    var fulltileheight = document.getElementById('mapcanvas').clientHeight;
    var fulltilewidth = document.getElementById('mapcanvas').clientWidth;
    var fulltilesize = (Math.ceil(Math.max(fulltileheight, fulltilewidth) / 10) * 10);

    var layers = {};

    district_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_admin_district',
      format: 'image/png',
      transparent: true,
      //version: '1.1.0',
      attribution: "myattribution",
      //crs: L.CRS.EPSG4326,
      maxNativeZoom: 30,
      minZoom: 7,
      tileSize: fulltilesize,
      maxZoom: 30,
      //cql_filter: '1=2',
    }).setZIndex(199).addTo(map);
    layers['district'] = district_layer;

    subdistrict_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_admin_subdistrict',
      format: 'image/png',
      transparent: true,
      //version: '1.1.0',
      attribution: "myattribution",
      //crs: L.CRS.EPSG4326,
      maxNativeZoom: 30,
      minZoom: 10,
      tileSize: fulltilesize,
      maxZoom: 30,
      //cql_filter: '1=2',
    }).setZIndex(198).addTo(map);
    layers['subdistrict'] = subdistrict_layer;

    village_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_admin_village',
      format: 'image/png',
      transparent: true,
      //version: '1.1.0',
      attribution: "myattribution",
      //crs: L.CRS.EPSG4326,
      maxNativeZoom: 30,
      minZoom: 13,
      tileSize: fulltilesize,
      maxZoom: 30,
      //cql_filter: '1=2',
    }).setZIndex(198).addTo(map);
    layers['village'] = village_layer;

    var gis_amravati_roadline_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_amravati_roadline',
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
      //crs: L.CRS.EPSG4326,
      tileSize: 1000,
      minZoom: 10,
      maxZoom: 30,
      maxNativeZoom: 30,
      opacity: 1,
      /*// for layer Control
      opacity: 0.9,
      layercontrol: true,
      layername: "Provinces",
      layertheme: "Administrative",*/
    }).setZIndex(150).addTo(map);
    layers['Road Names'] = gis_amravati_roadline_layer;

    var gis_amaravati_ringroad_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_amaravati_ringroad',
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
      //crs: L.CRS.EPSG4326,
      tileSize: 1000,
      minZoom: 10,
      maxZoom: 30,
      maxNativeZoom: 30,
      opacity: 0.8,
      /*// for layer Control
      opacity: 0.9,
      layercontrol: true,
      layername: "Provinces",
      layertheme: "Administrative",*/
    }).setZIndex(155).addTo(map);
    layers['Ring Road'] = gis_amaravati_ringroad_layer;

    var gis_amaravati_landuse_layer = L.tileLayer.wms(geoserverwmsapi, {
      layers: 'avenue:gis_amaravati_landuse',
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
      //crs: L.CRS.EPSG4326,
      tileSize: fulltilesize,
      minZoom: 10,
      maxZoom: 30,
      maxNativeZoom: 30,
      opacity: 0.7,
      /*// for layer Control
      opacity: 0.9,
      layercontrol: true,
      layername: "Provinces",
      layertheme: "Administrative",*/
      identify_cql_filters: "NOT plot_spe_1 = 'U2'"
    }).setZIndex(145).addTo(map);
    layers['Amaravati Plots'] = gis_amaravati_landuse_layer;

    layertoidentify = gis_amaravati_landuse_layer._leaflet_id;

    drawLayerControl(basemaps, layers);

    let url_params = get_all_url_params(window.location.href);
    if (url_params.plotno) {
      select_autocompleted_plot(url_params.plotno);
    }

  }

  //---------- Click Event on Map Start ---------
  var layertoidentify;
  var identifiedfeaturesids = [];

  function toggle_identify_layer(element) {
    if (element.leafletid) {
      layertoidentify = element.leafletid;
    }
  }

  function handlemapclick(e) {
    //if (drawmode == 0){
    identifyfeatures(e);
    //}
  }

  function clearidentifiedfeatures() {
    if (identifiedfeaturesids.length > 0) {
      var i = 0;
      for (i = 0; i < identifiedfeaturesids.length; i++) {
        var identifiedfeature = map._layers[identifiedfeaturesids[i]];
        if (identifiedfeature) {
          map.removeLayer(identifiedfeature);
        }
      }
      identifiedfeaturesids = [];
    }
  }

  function identifyfeatures(e) {
    clearidentifiedfeatures();
    var layer = map._layers[layertoidentify];
    if (map.hasLayer(layer)) {
      try {
        $('#mapCanvas').css({
          'cursor': 'wait'
        });
        //var popLocation= e.latlng;
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        var params = {
          service: 'WMS',
          version: '1.1.0',
          request: 'GetFeatureInfo',
          layers: layer.options.layers,
          query_layers: layer.options.layers,
          feature_count: 10,
          //info_format: 'text/javascript',
          info_format: 'application/json',
          format_options: 'callback:handleJson',
          //propertyName: 'd_name,m_name,v_name,tank_name,open_land_area,crop_land_area',
          SRS: 'EPSG:4326',
          width: 101,
          height: 101,
          x: 50,
          y: 50,
          bbox: (lng - 0.000001) + ',' + (lat - 0.000001) + ',' + (lng + 0.000001) + ',' + (lat + 0.000001)
        }
        if (layer.options.identify_cql_filters) {
          params['cql_filter'] = layer.options.identify_cql_filters;
        }
        if (layer.options.cql_filter) {
          if (!(params['cql_filter'])) {
            params['cql_filter'] = '';
          }
          params['cql_filter'] += layer.options.cql_filter;
        }
        $.ajax({
          url: layer._url,
          type: 'GET',
          data: params,
          dataType: 'json',
          success: function (data) {
            handlejson(data);
            $('#mapCanvas').css({
              'cursor': 'crosshair'
            });
          }
        });
      } catch (e) {
        console.log(e);
        $('#mapCanvas').css({
          'cursor': 'crosshair'
        });
      }

      function handlejson(data) {
        if (data.features.length > 0) {
          var identifiedFeature = L.geoJSON(data.features[0], {
            style: {
              "color": "#337ab7",
              "weight": 2,
              "opacity": 0.8,
              "fillOpacity": 0.5,
              "fillColor": '#fff'
            },
            /*coordsToLatLng: function (p) {
                p = proj4(EPSG32644, EPSG4326,p);  // reproject each point
                p = [p[1],p[0]]    // swap the values
                return p;        // return the lat/lng pair
            }*/
          }).addTo(map);
          let props = data.features[0].properties;
          let popup_content = get_plot_popupcontent(props, e.latlng);

          identifiedFeature.bindPopup(popup_content).openPopup();
          //map.fitBounds(identifiedFeature.getBounds());
          identifiedfeaturesids.push(identifiedFeature._leaflet_id);
        }
      }
    }
  }
  //---------- Click Event on Map End---------

  function get_plot_popupcontent(props, click_latlng) {
    var facing = "";
    if (props.northfacin > 0) {
      facing = facing + " North";
    }
    if (props.southfacin > 0) {
      facing = facing + " South";
    }
    if (props.eastfacing > 0) {
      facing = facing + " East";
    }
    if (props.westfacing > 0) {
      facing = facing + " West";
    }

    if ((props.plot_spe_1 == "R3") || (props.plot_spe_1 == "C2")) {

      if (props.plot_dev_a == "CRDA") {
        var popup_content =
          "\
        <div id='cus-info-header-container'><img src='/img/logos/logo.png'></div>\
        <div id='cus-info-body-container' class='col-lg-12 mt15'><b>Plot No: </b>" + props.plot_no + "<br><b>Township: </b>" + props.plot_allot + "<br><b>Plot Extent: </b>" + props.extent + " Sq. Yd<br><b>Property Type: <div class='legendIcon " + props.plot_spe_1 + "'></div></b>" + " " + props.plot_gener + "<br></div>\
        <div class='cus-info-button-group text-center'><a href='http://maps.google.com/maps?saddr=my+location&daddr=" + click_latlng + "' target='_blank' ><button type='button' class='button transparent mar10'>Take me there</button></a></div>\
        ";
      } else {
        var phase = 1;
        if (props.phase > 1) {
          phase = props.phase;
        };

        var popup_content =
          "\
        <div id='cus-info-header-container'><img src='/img/logos/logo.png'></div>\
        <div id='cus-info-body-container' class='col-lg-12 mt15'><b>Plot No: </b>" + props.plot_no + "<br><b>Layout: </b>" + props.plot_allot + "<br><b>Plot Extent: </b>" + props.extent + " Sq. Yd<br><b>Property Type: <div class='legendIcon " + props.plot_spe_1 + "'></div></b>" + " " + props.plot_gener + "<br><b>Layout Plot No: </b>" + props.plot_no_la + "<br><b>Plot Phase: </b>" + phase + " Phase<br></div>\
        <div class='cus-info-button-group text-center'><a href='http://maps.google.com/maps?saddr=my+location&daddr=" + click_latlng + "' target='_blank' ><button type='button' class='button transparent mar10'>Take me there</button></a></div>\
        ";
      }

    } else {
      var popup_content =
        "\
      <div id='cus-info-header-container'><img src='/img/logos/logo.png'></div>\
      <div id='cus-info-body-container'><b>Landuse Type: </b>" + props.plot_gener + "<br><b>Landuse Details: </b><div class='legendIcon " + props.plot_spe_1 + "'></div></b>" + " " + props.plot_speci + "<div>\
      ";
    }
    return popup_content;
  }

  function load_plot_popup(data) {
    clearidentifiedfeatures();
    let feature = JSON.parse(data.geometry);
    var plot_layer = L.geoJSON(feature, {
      style: {
        "color": "#f00",
        "weight": 2,
        "opacity": 0.8,
        "fillOpacity": 0.3,
        "fillColor": '#ff3'
      },
      interactive: false,
      /*coordsToLatLng: function (p) {
          p = proj4(EPSG32644, EPSG4326,p);  // reproject each point
          p = [p[1],p[0]]    // swap the values
          return p;        // return the lat/lng pair
      }*/
    }).addTo(map);
    identifiedfeaturesids.push(plot_layer._leaflet_id);

    let layer_center = plot_layer.getBounds().getCenter();
    let popup_content = get_plot_popupcontent(data, layer_center);

    map.removeLayer(plot_layer);
    map.flyTo(layer_center, 19, {
      animate: true,
      duration: 3
    });
    setTimeout(function () {
      L.popup()
        .setLatLng(layer_center)
        .setContent(popup_content)
        .openOn(map);
    }, 250);
    setTimeout(function () {
      map.addLayer(plot_layer);
    }, 3000);


    /*L.popup()
    .setLatLng(layer_center)
    .setContent(popup_content)
    .openOn(map);*/


    //map.fitBounds(plot_layer.getBounds());
  }

  function get_village_list() {
    let url = nodejsapi + '/amaravati/get-villages-list/'
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {

        let sort_logic = function (a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (b.name < a.name) {
            return 1;
          } else {
            return 0;
          }
        }

        data = data.sort(sort_logic);

        var list = '<option value="" >Select</option>';
        for (i in data) {
          var r = data[i];
          list += `
        <option value="${r.bbox}" bbox="${r.bbox}" vil_code="${r.vil_code}">
          ${r.name}
        </option>
        `;
        }
        let listhtml = `
      <select class="selectpicker" name="village_list" data-live-search="true" id="" onchange="zoom_to_village(this.value)">
          ${list}
        </select>
      `;

        document.getElementById('village_list').innerHTML = listhtml;

      })
  }

  function zoom_to_village(bbox) {
    // var bbox = el.getAttribute("bbox");
    bbox = bbox.slice(9).slice(0, -2);
    bbox = bbox.split(',');
    var ll = bbox[0].split(' '); //lower_left
    var ur = bbox[2].split(' '); //upper_right
    extent = [
      [ll[1], ll[0]],
      [ur[1], ur[0]]
    ]
    map.fitBounds(extent);
  }

  function filter_village_list(value) {
    let search_term = value.toLowerCase().trim();

    var villages = document.getElementById('village_list')
      .getElementsByClassName("list-group")[0]
      .getElementsByTagName('a');

    var villages = Array.from(villages);

    if (search_term.length) {
      for (i in villages) {
        let el = villages[i];
        let text = el.text.toLowerCase().trim();
        if (text.includes(search_term)) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      }
    } else {
      for (i in villages) {
        villages[i].style.display = 'block';
      }
    }

  }


  function search_plot() {
    let alert = document.getElementById('plotNoDiv').getElementsByClassName('alert')[0];
    let plotno = document.getElementById('plotNoTextbox').value.trim();
    document.getElementById('autocomplete-plots').style.display = 'none';
    clearidentifiedfeatures();
    map.closePopup();

    // Close Sidebar on mobile
    if (screen.width < 500 & (document.getElementById('sidebar').className.includes('active'))) {
      togglesidebarcollapse();
    }

    if (plotno.length) {
      set_url_query_parameters({
        "plotno": plotno
      });
      let url = nodejsapi + '/amaravati/search-plot?plotno=' + plotno;
      //let url = 'http://127.0.0.1:9010' + '/amaravati/search-plot?plotno=' + plotno;
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.length) {
            load_plot_popup(data[0]);

            alert.outerHTML = `
            <div class="alert alert-success">
              <strong><i class="fa fa-check"></i></strong>
            </div>
          `;
          } else {
            alert.outerHTML = `
          <div class="alert alert-danger">
            <strong>Sorry!</strong> the plot no you have entered does not exist in our database
          </div>
        `;
          }
        })
    } else {
      alert.outerHTML = `
        <div class="alert alert-info">
          Search for plot here
        </div>
      `;
    }
  }

  function autocomplete_plot() {
    let q = document.getElementById('plotNoTextbox').value.trim();
    q = q.trim();
    if (q.length) {
      let url = nodejsapi + '/amaravati/autocomplete-plot?q=' + q;
      //let url = 'http://127.0.0.1:9010' + '/amaravati/autocomplete-plot?q=' + q;
      fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var list = '';
          for (i in data) {
            let d = data[i];
            for (j in d) {
              let r = d[j];
              list += `
                <li>
                  <a class="dropdown-item" href="#" role="option" onclick="javascript:select_autocompleted_plot(this.text)" style="padding: 0.2rem 1rem;">${r.plotno}</a>
                </li>     
                <div class="dropdown-divider"></div>     
              `;
            }
          }

          if (list.length) {
            document.getElementById('autocomplete-plots').innerHTML = list;
            document.getElementById('autocomplete-plots').style.display = 'block';
          } else {
            document.getElementById('autocomplete-plots').style.display = 'none';
          }

        });
    } else {
      document.getElementById('autocomplete-plots').style.display = 'none';
      document.getElementById('plotNoDiv').getElementsByClassName('alert')[0].outerHTML = `
        <div class="alert alert-info">
          Search for plot here
        </div>
      `;
    }
  }

  function handle_plotno_textbox_keyup(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
      search_plot();
    } else {
      autocomplete_plot();
    }
  }

  function select_autocompleted_plot(plotno) {
    document.getElementById('plotNoTextbox').value = plotno;
    search_plot();
  }

  function get_all_url_params(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    
    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];

      // split our query string into its component parts
      var arr = queryString.split('&');

      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {

          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];

          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }

    return obj;
  }

  function set_url_query_parameters(params) {
    var historyState = {};
    var base = window.location.href.split('?')[0];

    var query = [],
      key, value;

    for (key in params) {
      if (!params.hasOwnProperty(key)) continue;
      value = params[key];
      query.push(key + "=" + value);
    }

    let url = base + '?' + query.join("&");

    //Remove hash from URL and replace with desired URL
    if (history && history.pushState) {
      //Only do this if history.pushState is supported by the browser
      history.pushState(historyState, null, url)
    }

  }

  /* Share This URl Support Starts */
  function share_this(url) {
    copyStringToClipboard(url.toString());
    const canonicalElement = document.querySelector('link[rel=canonical]');
    if (canonicalElement !== null) {
      url = canonicalElement.href;
    }
    navigator.share({
      url: url
    });
  }

  function shareThis(x) {
    copyStringToClipboard(x.toString());
    navigator.share({
      url: x
    });
  }

  if (!(navigator.share)) {
    navigator.share = function () {
      alert('copied to clipboard');
    }
  }
  /* Share This URl Support Ends */

  function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {
      position: 'absolute',
      left: '-9999px'
    };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
  }