 //   $('.bootstrap-select .dropdown-menu').on("keydown, keyup", function(e) {
 //     e.preventDefault();
 //     console.log('work');

 //     var current = $(".selected");
 //     if (e.which == 38) { console.log('workppp');
 //       // UP KEY
 //       var prev = current.prev("li");
 //       if (prev.length) {
 //         current.removeClass("selected");
 //         prev.addClass("selected");
 //       }
 //     } else if (e.which == 40) { console.log('workjjjjj');
 //       // DOWN KEY
 //       var next = current.next("li");
 //       if (next.length) {
 //         current.removeClass("selected");
 //         next.addClass("selected");
 //       }
 //     }
 //   });

 function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function getCookie(cname) {
    //console.log(cname,'-------------');
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function autocomplete(inp, arr, key) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        var check_inArr = [];
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i][key] !== null && arr[i][key].substr(0, val.length).toUpperCase() == val.toUpperCase() && $.inArray(arr[i][key], check_inArr) == -1) {
                check_inArr.push(arr[i][key]);
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i][key].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i][key].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                if (key == 'Area') {
                    b.innerHTML += "<input type='hidden' areaId='" + arr[i].ID + "' value='" + arr[i][key] + "'>";
                } else {
                    b.innerHTML += "<input type='hidden' areaId='' value='" + arr[i][key] + "'>";
                }

               //  b.style.whiteSpace = 'nowrap';
                var att = document.createAttribute("title");
                att.value = arr[i][key]; // Set the value of the href attribute
                b.setAttributeNode(att);


                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    setCookie('AreaType',this.getElementsByTagName("input")[0].value,1); 
                    if (document.getElementById('areaId') && key == 'Area') {

                        $('#locationIcon').html('<i class="lnr lnr-map-marker"></i>');
                        $('#previewArea').text(this.getElementsByTagName("input")[0].value);

                        document.getElementById('areaId').value = this.getElementsByTagName("input")[0].getAttribute("areaId");
                    }
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function pass_forgot() {

    var modal = '<div class="modal-dialog"><div class="modal-content"><!--ModalHeader--><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel">Forgot Password</h4></div><div class="modal-body"><div id="fPassword_alert"></div><form role="form" id="passF" onkeypress="change_password();return event.keyCode != 13;"><div class="form-group col-sm-12"><label for="forgotpass">Email address</label><input type="email" id="forPass" name="forPass" class="form-control required"></div><div class="col-sm-12"><input type="button" class="btn btn-success" value="Submit" onclick="change_password()" id="btnSave"><i id="refresh" class="fa fa-refresh fa-2 fa-spin" aria-hidden="true" style="font-size:20px;display:none"></i></div></form><div class="clearfix"></div></div>';
    $("#my-modal").html(modal);
    $("#my-modal").modal('show');
}

function change_password() {

    if (!$("#passF").valid()) {
        return false;
    } else {
        $('#refresh').show();
        var email = $('#forPass').val();
        var data = {};
        data.email = email;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/login/changePassword',

            success: function (res) {
          
                //       var res = JSON.parse(res);
                //          $('#refresh').hide();
                $('#fPassword_alert').html('<div class="alert alert-' + res.status + '"><strong>' + res.msg + '</strong></div>');
                $("#fPassword_alert").fadeTo(3000, 500).slideUp(500, function () {
                    $("#my-modal").modal('toggle');
                });
            }
        });
    }
}


// function saveAsFavourite(data) {

//     $.ajax({
//         type: 'POST',
//         data: JSON.stringify(data),
//         contentType: 'application/json',
//         url: '/save-as-favourite',

//         success: function (res) {
//             console.log(res);
//         }
//     });
// }

/* Change Property type select */
 function changePropertyType(val, mn) {
   $('.inputwrap input[type=text]').val('')
   $('.inputwrap input[type=text]').attr('value', '')
   $('.min-dropdown').removeClass('hide'); 
   $('.max-dropdown  ').addClass('hide'); 
   $('.min-max .minVal').text('')
   $('.min-max .maxVal').text('')
   $('.min-max .selected-val .Selecttxt').show()
   $('.parameter-dropdown ul li').removeClass('active');

   TypebySelect(val); 
   if (mn == 2) {
       $("#filterForm").find('input:text, input:password, input:file, select:not(#CityID,#area), textarea').val('');
       $('#Type').val(val);
   }
    var icon = (val == 1) ? '/img/marker/plot-marker.png' : ((val == 2) ? '/img/marker/res-marker.png' : '/img/marker/agri-marker.png');

    if (drawingManager) {
        drawingManager.setOptions({
            markerOptions: {
                draggable: true,
                icon: icon
            }
        });
    }

    $(".propertyCategory, div.additional-info").hide();
    var unit = '';
    var id = '';
    var type = val;
    for (var i = 0; i < propertyType.length; i++) {

        if (propertyType[i].Type == val || propertyType[i].ID == val) {
            unit = propertyType[i].UnitIdentifier;
            id = propertyType[i].ID;
            if (mn == 1) {
                type = propertyType[i].Type;
            }
        }
    }

    
    if (typeof propertyCategory != 'undefined') {
        var html = '<option value="">Select</option>';
        for (var i = 0; i < propertyCategory.length; i++) {
       //    console.log(id)
            if (propertyCategory[i].PropertyTypeID == id) {
                var selected = ''
                if ((typeof propertyResult != 'undefined' && propertyResult.PropertyTypeChildID == propertyCategory[i].ID) || ( typeof query != 'undefined' && query.category == propertyCategory[i].ID ) ) {
                    var EditValue = propertyCategory[i].PropertyTypeChild;
                    selected = 'selected';

                }
                
                html += '<option value="' + propertyCategory[i].ID + '" ' + selected + '>' + (propertyCategory[i].PropertyTypeChild) + '</option>';
            }
        }
        
        $('#PropertyTypeChildID').html(html);

        if (html == '<option value="">Select</option>') {
            $('#PropertyTypeChildID').attr('disabled', true);
        } else {
            $('#PropertyTypeChildID').attr('disabled', false);
        }

        $('.asking_price, .search_price').attr('placeholder', 'INR/' + unit);
        $('#previewUnit').text(unit);
        $('#extentIcon').html('<img src=\'/img/extent.jpg\' Width=\'14\',height=\'16\'>');

        $('#PropertyTypeChildID, #search_price_unit').selectpicker('refresh');

    }
    $('.hideproperty, #specification, #amenities').hide();
    $('#PropertyTypeChildID').trigger('change');
    if (typeof ProjectStatus != "undefined" && typeof soil != "undefined" && typeof PlanApprovedby != "undefined") {
        var content = new EJS({
            url: '/ejstemplates/' + type + '.ejs'
        }).render({
            ProjectStatus: ProjectStatus,
            soil: soil,
            PlanApprovedby: PlanApprovedby,
            UnitsOfArea: UnitsOfArea
        });
        $('.posAbs[data-category="2"]').html(content);
   }
    if(type.split(' ').join('_')){
       $('div.' + type.split(' ').join('_')).show();
    }
    /* if (mn == 2) {
        $("#filterForm").find('input:text, input:password, input:file, select:not(#CityID,#area), textarea').val('');
        $('#Type').val(val);
    } */


    $('[data-toggle="datepicker"]').datepicker({
        autoclose: true,
        zIndex: 2048,
        format: 'yyyy/mm/dd',
        weekStart: 0,
    });
    $('[data-toggle="yearpicker"]').datepicker({
        autoclose: true,
        zIndex: 2048,
        format: 'yyyy',
        weekStart: 0,
        minViewMode: 2
    });
    $('.selectpicker').selectpicker('refresh');

    $("#brochure").dropzone({
        url: "/file-upload/brochure_upload",
        acceptedFiles: 'image/*',
        maxFiles: 1,
        maxFilesize: 5,
        paramName: 'brochure_uploads',
        timeout: 50000,
        parallelUploads: 2,
        uploadMultiple: false,
        addRemoveLinks: true,
        removedfile: function (file) {
            $('#gellery_video').val('');
            var _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;

        },
        init: function () {
            this.on("complete", function (data) {
                if (data.xhr) {
                    var image_obj = JSON.parse(data.xhr.responseText)[0];
                    var path = image_obj.location;
                    $('#brochureUrl').val(path);
                }
            });
        }
    });

    cropingImg(0);

    
       
       
     
       
   
}

function changePropertyCategory(val) {
//    console.log(val,'value');
    var check = ['New_Approved_Layout', 'Apartment', 'Gated_Community', 'Villas'];
    var st = $("input[name='ResaleProperty']:checked").val();
    for (var i = 0; i < propertyCategory.length; i++) {
        if (propertyCategory[i].ID == val) {
            var targID = propertyCategory[i].PropertyTypeChild.split(' ').join('_');
        }
    }
    // console.log(targID,'********')

    $(".propertyCategory, div.additional-info, h4.additional-info, li.additional-info").hide();

    $('.' + targID).show();

    if ($('#CityID').val() == 1 && targID == 'New_Approved_Layout') {
        $('#lpnumber').show();
    } else {
        $('#lpnumber').hide();
    }
    if (st == 'false' && $.inArray(targID, check) > -1) {
        $('.Launch_Possession').show();
    } else {
        $('.Launch_Possession').hide();
    }


  
    if (typeof specifications != 'undefined' && specifications.length > 0) {
  //   console.log(specifications)
        var specification_html = '';
        var specification_html1 = '';
        for (var i = 0; i < specifications.length; i++) {
        
            if (specifications[i].PropertyTypeChildID == parseInt(val)) {
                var value_spc = '';
              
                if (typeof EditSpecificationData != 'undefined') {
                    for (j = 0; j < EditSpecificationData.length; j++) {
                        if (specifications[i].ID == EditSpecificationData[j].SpecificationID) {
                            if (EditSpecificationData[j].Value != '') {
                                value_spc = EditSpecificationData[j].Value;
                            }
                        }
                    }
                }

                specification_html += '<div class="col-sm-12 col-xs-12">\
                   <h4 class="heading">' + specifications[i].Specification + '</h4>\      </div>\
                           <div class="col-sm-6 col-xs-12">\
                           <div class="form-group">\
                           <input type="text" name="spec_' + specifications[i].Specification + '" value = "' + value_spc + '" class="input-text" placeholder="spec_' + specifications[i].Specification + '">\
                       </div>\
                   </div>';

                specification_html1 += '<div class="col-lg-6 col-md-6 col-xs-12 Residential hideproperty">\
                           <h4 class="heading">' + specifications[i].Specification + '</h4>\      </div>\
                           <div class="col-lg-6 col-md-6 col-xs-12 Residential hideproperty">\
                           <div class="form-group">\
                           <option value="' + specifications[i].ID + '">' + specifications[i].Specification + '</option>\
                       </div>\
                   </div>';
            }
        }
        if ($('#specification_PropertyDetail').length > 0) {
           //  console.log(specification_html1)
            $('#specification_PropertyDetail').html(specification_html1);
        }
        $('#specification_PropertyDetail').selectpicker('refresh');
    }

    if (specification_html) {
          // console.log(specification_html)
        $('#specification').html(specification_html).show();
    } else {
        $('#specification').hide();
    }


    if (typeof Amenities != 'undefined' && Amenities.length > 0) {
        var amenities_html = '';
        var amenities_html1 = '';

        for (var i = 0; i < Amenities.length; i++) {
            if (Amenities[i].PropertyTypeChildID == parseInt(val)) {
                var checked_amn = '';
                if (typeof EditAmenityData != 'undefined') {
                    for (j = 0; j < EditAmenityData.length; j++) {
                        if (Amenities[i].ID == EditAmenityData[j].AmenityID) {
                            checked_amn = 'checked';
                        }
                    }
                }
                amenities_html += '<div class="col-md-4 col-sm-6 col-xs-12">\
                   <div class="form-group mt15">\
                   <div class="checkbox">\
                   <input type="checkbox" id="' + Amenities[i].Amenity + '" value="' + Amenities[i].ID + '" name="amenities" ' + checked_amn + '><label for="' + Amenities[i].Amenity + '">' + Amenities[i].Amenity + '</label>\
                   </div>\
                   </div>\
                   </div>';

                amenities_html1 += '<div class="col-md-4 col-sm-6 col-xs-12">\
                   <div class="form-group mt15">\
                   <div class="checkbox">\
                   <option value="' + Amenities[i].ID + '">' + Amenities[i].Amenity + '</option>\
                   </div>\
                   </div>\
                   </div>';
            }
        }
       
        if ($('#amenities_PropertyDetail').length > 0 && amenities_html1.length ) {
           $('#checkAmenities').show(); 
           $('#amenities_PropertyDetail').html(amenities_html1);
        }else{
            $('#checkAmenities').hide();
        }
        $('#amenities_PropertyDetail').selectpicker('refresh');
    }

    if (amenities_html) {
        $('#amenities').html(amenities_html).show();
    } else {
        $('#amenities').hide();
    }
}


function changeCity(val) {

    var area = [];
    var area_html = '';
    for (var i = 0; i < cityArea.length; i++) {
        if (cityArea[i].CityID == val) {
            area_html += '<option value="' + cityArea[i].ID + '">' + cityArea[i].Area + '</option>';
            area.push(cityArea[i]);
        }
    }

    for (var j = 0; j < cities.length; j++) {
       
       if(cities[j].ID == val){
           
        byInCity(cities[j].Name);
        }else if(val == 'All'){
        byInCity(val);
           //$('#city').val('');
        //$('.selectpicker').selectpicker('refresh');    
        }
        if ($('#previewCity').length > 0 && cities[j].ID == val) {
            $('#previewCity').text(', ' + cities[j].Name);
            $('#locationIcon').html('<i class="lnr lnr-map-marker"></i>');
        
           }
    }
   
    if ($('#area').length == 1) {
        $('#area').html(area_html);
        $('#area').selectpicker('refresh');
        autocomplete(document.getElementById("area"), area, 'Area');
    }
}

function changeCountryCode(val) {
    for (var i = 0; i < Countries.length; i++) {
        if (val == Countries[i].ISDCode) {
            $('#Country').val(Countries[i].CountryName).selectpicker('refresh');
            $('#Country1').val(val).selectpicker('refresh');
        }
    }
}

function customLogin(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: '/login',
        type: 'POST',
        data: $("#" + id).serializeArray(),
        success: function (res) {
            var res = JSON.parse(res);
  
            if (res.loginstatus == 'error') {
                $('#login_alertMsg').html('<div class="alert alert-danger"><strong> ' + res.msg + ' </strong></div>').show();
                $('#login_alertMsg').delay(4000).slideUp();
            } else if (res.loginstatus == 'success') {

                if (res.remember_me) {
                    setCookie('username', res.email);
                    setCookie('remember_me', true);

                } else {
                    setCookie('username', '');
                    setCookie('remember_me', false);
                }

                $('#login_alertMsg').html('<div class="alert alert-success"><strong> ' + res.msg + ' </strong></div>').show();
                $('#login_alertMsg').delay(4000).slideUp();


                setTimeout(function () {
                    window.location.href = res.url;
                }, 4100);
            }
        }
    });
}

function rememberMe() {
    var cookieValue = getCookie('username');
    var rememberMe = getCookie('remember_me');

    if (cookieValue && rememberMe) {
        $('#username').val(cookieValue);
        $('#remember_me').attr('checked', 'checked');
    }
}


function sortObjByKey(obj, key) {
    obj.sort(function (a, b) {
        return a[key] - b[key];
    });
    return obj;
}

function goBack() {

    $('#page_scroller').trigger('click');
    var datafilter = parseInt($('.activeClass li.active').find('a').attr('data-filter')) - 1;
    console.log('goback', datafilter);

    // if (datafilter == 1) {
    //     $('.back-step').hide();
    // }
    // if (datafilter < 5) {
    //     $('.next-step').show();
    // }

    $('.filtr-button[data-filter=' + datafilter + ']').trigger('click');
    var valid = true;
    $('div.filtr-item[data-category="' + (parseInt($('.activeClass li.active').find('a').attr('data-filter'))) + '"]').find("input,select").each(function () {
        if (!validator.element(this) && valid) {
            valid = false;
        }
    });
}

function goNext() {
    $('#page_scroller').trigger('click');
    var datafilter = parseInt($('.activeClass li.active').find('a').attr('data-filter')) + 1;
    console.log('gonext', datafilter);

    var valid = true;
    $('div.filtr-item[data-category="' + (parseInt($('.activeClass li.active').find('a').attr('data-filter'))) + '"]').find("input,select").each(function () {

        if (!validator.element(this) && valid) {
            valid = false;
        }
    });

    if (valid) {

        // if (datafilter >= 2) {
        //     $('.back-step').show();
        // }

        // if(datafilter == 5) {
        //     $('.next-step').hide();
        // }

        if (datafilter == 4) {
            var city = '';
            var state = '';
            var district = '';
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].ID == $('#CityID').val()) {
                    city = cities[i].Name;
                    state = cities[i].State;
                    district = cities[i].District;
                }
            }
            var address = '';
            if ($('#surveyNo').val()) {
                address += $('#surveyNo').val() + ' ,';
            }
            if ($('#locality').val()) {
                address += $('#locality').val() + ' ,';
            }
            address += $('#area').val() + ', ' + district + ', ' + city + ' ,' + state;
            geocode(address);
        }
        $('.filtr-button[data-filter=' + datafilter + ']').trigger('click');
    }
}

function saveSearch() {
    //  console.log('saveSearch');
}

function filterProperty() {
  /*   $('.advancedFilter').attr('aria-expanded',false);
    $('.advancedFilter').addClass('collapsed'); */
    $('#advancefilter').show();
   $('.page_loader').show();
    $('.advancedFilter').trigger('click');
    $.ajax({
        type: 'GET',
        data: $('#SearchfilterForm').serialize(),
        contentType: 'application/json',
        url: '/buy/filter',
        success: function (data) {
           propertyHtml(data);
       }
   })
}


/* function loadmore() {
    var ajaxLimit = 5;
    $.ajax({
        type: 'GET',
        data: {ajaxLimit:ajaxLimit},
        contentType: 'application/json',
        url: '/buy/filter',
        success: function (data) {
        console.log($('.property-content').length);
       }
   })
} */

function saveAsFavorite(userId, propId, index) {

    if (!userId) {
        $('#loginPopup').modal('show');
        $('#login_alertMsg').html('<div class="alert alert-danger"><strong> Please login. </strong></div>').show();
        $('#login_alertMsg').delay(4000).slideUp();

    } else {

        $.ajax({
            type: 'POST',
            data: {
                UserID: parseInt(userId),
                PropertyID: parseInt(propId)
            },
            url: '/MyFavorites/saveFavorite',
            success: function (res) {
                if (res.status == 'success') {
                    if ($('#myfavorite' + index).hasClass('active') || $('#myfavorite_' + index).hasClass('active')) {
                        $('#myfavorite' + index).removeClass('active');
                        $('#myfavorite_' + index).removeClass('active');
                    } else {
                        $('#myfavorite' + index).addClass('active');
                        $('#myfavorite_' + index).addClass('active');
                    }
                }
            }
        });
    }
}


  // initfilterize();
function RemoveFavourite(id, userID, index, type) {
    $.ajax({
        type: 'POST',
        data: {
            id: id,
            userID: userID
        },
        url: '/MyFavorites/RemoveFavourite',
        success: function (obj) {
            if (obj.status == 'success' && !type) {
                $('#favorite_' + index).parent().parent().remove();
                initfilterize();
                var filtrContainer = $('.filtr-container div').length;
                if(filtrContainer<1) {
                    var htmlD = '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12  filtr-item b-list-opt" data-category="1"><div class="property"><div class="property-content col-md-7 col-sm-6 col-xs-12 cont-item cont-item1"><h3>No Favorites Added Yet!</h3></div></div></div>';
                    initfilterize();
                    $('.filtr-container').html(htmlD)
                    console.log('in');
                    $()
                }
            } else {
                $('#favSave').attr('onclick', 'saveSingle_Property(' + id + ',' + userID + ')');
                $("#favSave").html('<i class="fa fa-heart" aria-hidden="true"></i> Save')

            }

        }       
    });
}


function saveSingle_Property(propId, userId) {

    if (!userId) {
        $('#loginPopup').modal('show');
        $('#login_alertMsg').html('<div class="alert alert-danger"><strong> Please login. </strong></div>').show();
        $('#login_alertMsg').delay(4000).slideUp();

    } else {
        $.ajax({
            type: 'POST',
            data: {
                UserID: parseInt(userId),
                PropertyID: parseInt(propId)
            },
            url: '/single-property/save_single_property',
            success: function (res) {
                if (res.status == 'success') {
                    $('#favSave').attr('onclick', 'RemoveFavourite(' + propId + ',' + userId + ',"","single")');
                    $("#favSave").html('<i class="fa fa-heart" aria-hidden="true"></i> Remove')
                }
            }
        });
    }
}


function videoModal(mode, VideoURL, VideoGallery, ImageGallery, YouTubeGetID, index) {
    //console.log('mode',mode ,'VideoURL',VideoURL,'VideoGallery',VideoGallery,'ImageGallery',ImageGallery,'YouTubeGetID',YouTubeGetID,'index',index);
    var VideoURL = VideoURL ? VideoURL.split(',') : [];
    var VideoGallery = VideoGallery ? VideoGallery.split(',') : [];
    var ImageGallery = ImageGallery ? ImageGallery.split(',') : [];
    var filteredVideoGallery = VideoGallery.filter(v => v != '' && v != null &&
        v != undefined && v != []);
    var filteredVideoURL = VideoURL.filter(v => v != '' && v != null &&
        v != undefined && v != []);
    var content = new EJS({
        url: '/ejstemplates/properties-detailsModal.ejs'
    }).render({
        mode: mode,
        VideoURL: filteredVideoURL,
        VideoGallery: filteredVideoGallery,
        ImageGallery: ImageGallery,
        YouTubeGetID: YouTubeGetID,
        index: index
    });
    $('#propertyModal').html(content);
    $('#propertyModal').modal('show');
}

function YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}

function removeImage(ID, URL, index) {
    if (ID == 'gellery_video') {
        $('#remove_video' + index).remove();
        var VideoGallery = $('#gellery_video').val();
        var VideoGallery_edit = (VideoGallery).split(',');
        delete VideoGallery_edit[index];
       
        $('#gellery_video').val(VideoGallery_edit.join(','));
   }
    if (ID == 'gellery_images') {
       $('#remove_image' + index).remove();
        var gallery = $('#gellery_images').val();
        var gallery_edit = (gallery).split(',');
        delete gallery_edit[index];
        $('#gellery_images').val(gallery_edit.join(','));
       
   }
}

function iAm_Interested(propertyData, propertyType) {
    $.ajax({
        url: '/iaminterested',
        type: 'POST',
        data: JSON.stringify(propertyData, propertyType),
        success: function (res) {
            var res = JSON.parse(res);
            var obj = {};
            obj.propertyType = propertyType;
            obj.propertyData = propertyData;
            obj.countryData = res.country;
            if (res.status == 'success') {
                obj.userData = res.data;
            }
            var content = new EJS({
                url: '/ejstemplates/iAmInterested.ejs'
            }).render({
                object: obj
            });
            $('#iAmInterestedModal').html(content);
            $('#iAmInterestedModal').modal('show');
            $('.selectpicker').selectpicker('refresh');
            autocomplete(document.getElementById("countryIam"), res.country, 'CountryName');
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.id = "hs-script-loader";
            s.async = "";
            s.defer = "";
            s.src = "//js.hs-scripts.com/3964054.js";
            $("head").append(s);
        }
    });
}

function iAmInterested_submit(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: '/iaminterested/submit',
        type: 'POST',
        data: $('#' + id).serialize(),
        success: function (res) {
            var res = JSON.parse(res);
            $('#msgInterest').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
            $('#msgInterest').delay(4000).slideUp();
            setTimeout(function () {
                if (res.status == 'success') {
                    $('#iAmInterestedModal').modal('hide');
                }
            }, 4100);
        }
    });
}


function ChangeSubmitRequestText() {
    //     console.log($('#BuyOrSell').val());

    if (($('#BuyOrSell').val() == 'sell') || ($('#BuyOrSell').val() == '')) {
        $("#change").text("Price");
        $("#price").attr('placeholder', "Price");
    }
    if ($('#BuyOrSell').val() == 'buy') {
        $("#change").text("Budget");
        $("#price").attr('placeholder', "Budget");
    }
}


function ContactUs_mail(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: 'contact-us/save-ContactUs-details',
        type: 'POST',
        data: $('#' + id).serialize(),
        success: function (res) {
            var res = JSON.parse(res);
            $('#contactmsg').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
            $('#contactmsg').delay(4000).slideUp();
            $("#contactform")[0].reset();
        }
    });
}

function SubmitRequest(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: 'submit-request/save-property-details',
        type: 'POST',
        data: $('#' + id).serialize(),
        success: function (res) {
            var res = JSON.parse(res);
            $('#save-property-details_msg').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
            $('#save-property-details_msg').delay(4000).slideUp();
            $("#save-property-details")[0].reset();
            $('.selectpicker').selectpicker('refresh')
        }
    });
}

function SubmitProperty(id) {

   if (!$('#' + id).valid()) {
  
       return false;
   }
   $.ajax({
       url: 'submit-property/save-property-details',
       type: 'POST',
       data: $('#' + id).serialize(),
       success: function (res) {
        //    console.log(res)
           var res = JSON.parse(res);
           $('#save-property-details_msg').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
           $('#save-property-details_msg').delay(4000).slideUp();
           $('#save-property-details')[0].reset();
           $('.selectpicker').selectpicker('refresh');
           $('.Property-description span').html('');
           $("div .dz-preview").remove()
           $("#ImageDropZone, #VideoDropZone").removeClass('dz-started')
           html = '<div class="carousel-inner"><div class="item active defaultSliderImage"><img src="http://placehold.it/710x473" class="thumb-preview" alt="Chevrolet Impala"></div></div>'
           $(".carousel-inner").html(html);
           html = '<li data-target="#carousel-custom" data-slide-to="0" class="defaultSliderImage"><img src="http://placehold.it/90x60" alt="Chevrolet Impala"></li>';
           $(".carousel-indicators").html(html);
           $("#previewBath, #previewFacing , #previewBed, #previewStatus").attr("style","display:none");
       }
   });
}

function ProfileUpdate(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: '/registration/save',
        type: 'POST',
        data: $('#' + id).serialize(),
        success: function (res) {
            var res = JSON.parse(res);
            $('#ProfileForm_msg').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
            $('#ProfileForm_msg').delay(4000).slideUp();

            setTimeout(function () {
               window.location.href = res.redirect;
           }, 2000);
       }
    });
}

//Advance Search Starts
function propertyHtml(data) {
    // console.log('propertyHtml ============ propertyHtml');
    PropertyLocations = data.PropertyLocations;
    propertyResult = data.propertyResult;
    recommemdedIds = data.recommemdedIds;
    GalleryImage = data.GalleryImage;
    UnitTableData = data.UnitTableData;
    favoriteData = data.favoriteData;
    UnitIdentifier = data.UnitIdentifier;
  

    if (data.Message) {
       $('#msg').html(+ propertyResult.length + ' ' + data.Message + ' ' + "found").show();
    }

    var recommemdedTab = 0;
    var html = '';
    var gridClass = $('.display-toggle').find('li.active').find('a.toggle').attr('data-displaytoggle');


    if (gridClass == 'map-opt' || gridClass == undefined) {
        gridClass = 'b-list-opt';
        $('body').addClass('mapdata-show');
        setTimeout(function () {
            $(window).trigger('resize');
            $(".filter-content .filtr-container").niceScroll({
                scrollspeed: 80,
                mousescrollstep: 80,
                cursorwidth: 3,
                cursorborder: 0,
                cursorcolor: '#373f47', // color
                autohidemode: false,
                zindex: 9,
                horizrailenabled: false,
                cursorborderradius: 0,
                autohidemode: "true",
            });
        }, 50);
    }

    // Loadmore
    // html += '  <span id="loadMore" class="btn btn-primary" onclick="loadmore();">Load more</span>';



    if (propertyResult && propertyResult.length > 0) {
        for (var i = 0; i < propertyResult.length; i++) {
            var filterImages = [];
            if (GalleryImage[propertyResult[i].ID]) {
                var filterImages = GalleryImage[propertyResult[i].ID].filter(v => v != '');
            }

            var ImageGallery = (filterImages.length) ? filterImages : (propertyResult[i].PropertyTypeID == 1 ? ['/img/Plots.png'] : (propertyResult[i].PropertyTypeID == 2 ? ['/img/Residential.png'] : ['/img/AgriLands.png']));
            var VideoGallery = [];
            var VideoURL = []; 
            if (propertyResult[i].VideoGallery != null) {
                VideoGallery = propertyResult[i].VideoGallery.split(',');
            }
            if (propertyResult[i].VideoURL != null) {
         
                VideoURL = propertyResult[i].VideoURL.split(',');
            }

            var filter = '1';
            // var VideoGallery = propertyResult[i].VideoGallery.split(',');
            // var filter = '1';
            if (recommemdedIds.includes(propertyResult[i].ID)) {
                filter = '2';
                recommemdedTab = 1;
            }
            var TotalPrice = [];
            var Extent = [];
            var SearchPrice = [];
            var NumberofBath = [];
            var NumberofBeds = [];
            var UnitData = []; //UnitTableData[propertyResult[i].ID] ? UnitTableData[propertyResult[i].ID] : [];
           /*  if (UnitTableData[propertyResult[i].ID] && UnitTableData[propertyResult[i].ID].length) {
                for (var u = 0; u < UnitTableData[propertyResult[i].ID].length; u++) {
                    if (propertyResult[i].ID == UnitTableData[propertyResult[i].ID][u].PropertyID) {
                        UnitData.push(UnitTableData[propertyResult[i].ID][u]);
                        if (UnitTableData[propertyResult[i].ID][u].NumberofBath) {
                            NumberofBath.push(UnitTableData[propertyResult[i].ID][u].NumberofBath);
                        }
                        if (UnitTableData[propertyResult[i].ID][u].NumberofBeds) {
                            NumberofBeds.push(UnitTableData[propertyResult[i].ID][u].NumberofBeds);
                        }
                        if (UnitTableData[propertyResult[i].ID][u].UnitExtent) {
                            TotalPrice.push(parseInt(UnitTableData[propertyResult[i].ID][u].UnitExtent) * parseInt(propertyResult[i].SearchPrice));
                            Extent.push(parseInt(UnitTableData[propertyResult[i].ID][u].UnitExtent));
                        } else if (UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea) {
                            TotalPrice.push(parseInt(UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea) * parseInt(propertyResult[i].SearchPrice));
                            Extent.push(parseInt(UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea));
                        } else {
                            TotalPrice.push(parseInt(propertyResult[i].TotalPrice));
                            Extent.push(parseInt(propertyResult[i].Extent));
                        }
                    }
                }
            } else {
                TotalPrice.push(parseInt(propertyResult[i].TotalPrice));
                Extent.push(parseInt(propertyResult[i].Extent));
            }
            propertyResult[i].unitDetails = UnitData; */
          
            if(typeof UnitTableData[propertyResult[i].ID] == 'object' && UnitTableData.length > 0 && UnitTableData[propertyResult[i].ID] != null){

                for(var u = 0; u < UnitTableData[propertyResult[i].ID].length; u++){
                    if(propertyResult[i].ID == UnitTableData[propertyResult[i].ID][u].PropertyID){
                        UnitData.push(UnitTableData[propertyResult[i].ID][u]);
                        if(UnitTableData[propertyResult[i].ID][u].NumberofBeds){
                            NumberofBeds.push(UnitTableData[propertyResult[i].ID][u].NumberofBeds); 
                        }
                        if(UnitTableData[propertyResult[i].ID][u].NumberofBath){
                            NumberofBath.push(UnitTableData[propertyResult[i].ID][u].NumberofBath); 
                        }
                        if(UnitTableData[propertyResult[i].ID][u].UnitExtent){
                            TotalPrice.push(parseInt(UnitTableData[propertyResult[i].ID][u].UnitExtent) * parseInt(propertyResult[i].SearchPrice));
                            Extent.push(parseFloat(UnitTableData[propertyResult[i].ID][u].UnitExtent));
                        }else
                        if(UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea){
                            TotalPrice.push(parseInt(UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea) * parseInt(propertyResult[i].SearchPrice));  
                            Extent.push(parseFloat(UnitTableData[propertyResult[i].ID][u].SuperBuiltUpArea));
                        }
                        else if(propertyResult[i].Extent || propertyResult[i].TotalPrice){
                            if(propertyResult[i].TotalPrice){
                            TotalPrice.push(parseFloat(propertyResult[i].Extent) * parseInt(propertyResult[i].SearchPrice)); 
                            }
                            if(propertyResult[i].Extent){
                            Extent.push(parseFloat(propertyResult[i].Extent));  
                            }
                        }
                    }
                }
            }else{
                TotalPrice.push(parseFloat(propertyResult[i].Extent) * parseInt(propertyResult[i].SearchPrice));
                Extent.push(parseFloat(propertyResult[i].Extent));
            }
            propertyResult[i].unitDetails= UnitData;



          
            html += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12  filtr-item ' + gridClass + '" data-category="' + filter + '">\
                       <div class="property">\
                           <!-- Property img -->\
                           <div class="property-img">';
            var Active = '';
            if (favoriteData.length > 0) {
                if (favoriteData.includes(propertyResult[i].ID))
                    Active = 'active';
            };

            html += '<div class="property-tag alt featured ' + Active + '" id="myfavorite' + i + '">\
                               <a href="javascript:void(0);" onclick="saveAsFavorite(\'' + sessVal + '\',' + propertyResult[i].ID + ',' + i + ')"><i class="fa fa-heart" aria-hidden="true"></i></a></div>';
                              
         if (propertyResult[i].DisplayPrice) {
           html+=    '<div class="property-price">' + propertyResult[i].Title.substring (0, 17);
                           if (propertyResult[i].Title.length > 17) {
                               html += '...';
                           }

                           if (Math.min(...TotalPrice) == Math.max(...TotalPrice)) {
                               propertyResult[i].viewPrice = currencyFormat(Math.max(...TotalPrice));
                               html += '<div>&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' + currencyFormat(propertyResult[i].SearchPrice) + '/ '+UnitIdentifier+' </h5></div>';
                           } else {
                               propertyResult[i].viewPrice = currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice));
                               html += '<div>&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' +currencyFormat(propertyResult[i].SearchPrice )+ '/ '+UnitIdentifier+' </h5></div>';
                           }
           }else {
               html += '<div  class="property-price"> <div>Price On Request </div>\
              </div>';
           }

            html += '</div>\
                               <!-- Facilities List -->\
                               <ul class="facilities-list clearfix">\
                                       <li>';
            if (Extent && Extent.length > 0) {
                html += '<img src="/img/extent.jpg" width="14" ,height="16" style="margin-top:-4px" title="Extent"> ';
                 if(Math.min(...Extent) == Math.max(...Extent)) {
                    html += '</span>' + Math.min(...Extent) + '<span>' + propertyResult[i].UnitIdentifier +'';
                } else {
                    html += '</span>' + Math.min(...Extent) + ' - ' + Math.max(...Extent) + '<span> ' + propertyResult[i].UnitIdentifier +'';
                }
            }

            var facing = '';

            if (propertyResult[i].East || propertyResult[i].West || propertyResult[i].North || propertyResult[i].South) {

                html += ' <img src="/img/facing.jpg" width="14" ,height="16" style="margin-top:-4px"> ';

                if (propertyResult[i].East) {
                    facing += 'E'
                }
                if (propertyResult[i].West) {
                    if (facing) {
                        facing += ' | '
                    }
                    facing += 'W';

                }
                if (propertyResult[i].North) {
                    if (facing) {
                        facing += ' | '
                    }
                    facing += 'N';

                }
                if (propertyResult[i].South) {
                    if (facing) {
                        facing += ' | '
                    }
                    facing += 'S';
                }
                html += '<span>' + facing + '</span>';
            }
            html += '</li>';


            if (NumberofBeds.length > 0) {
                if (NumberofBeds.length == 1) {
                    html += '<li>\
                                       <i class="fa fa-bed"></i>\
                                       </span>' + Math.min(...NumberofBeds) + '<span>';
                } else {
                    html += '<li>\
                                       <i class="fa fa-bed"></i>\
                                       </span>' + Math.min(...NumberofBeds) + ' - ' + Math.max(...NumberofBeds) + '<span>';
                }

            }
            if (NumberofBath.length > 0) {
                if (NumberofBath.length == 1) {
                    html += '<li>\
                                       <i class="flaticon-holidays"></i>\
                                       </span>' + Math.min(...NumberofBath) + '<span>';
                } else {
                    html += '<li>\
                                       <i class="flaticon-holidays"></i>\
                                       </span>' + Math.min(...NumberofBath) + ' - ' + Math.max(...NumberofBath) + '<span>';
                }
            }


            html += '</ul>\
                               <ul class="facilities-list clearfix viewlistdata" >';
            if (ImageGallery) {
                html += '<li>\
                                           <i class="lnr lnr-camera"></i>\
                                           <span>' + ImageGallery.length + '</span>\
                                       </li>';
            }
            if (VideoGallery || VideoURL) {
                var totalVideos = 0;
                if (VideoGallery) {
                   
                    totalVideos += VideoGallery.length
                }
                if (VideoURL) {
                    totalVideos += VideoURL.length
                }
                if (totalVideos > 0) {
                    html += '<li>\
                       <i class="lnr lnr-camera-video"></i>\
                           <span>' + totalVideos + '</span>\
                       </li>';
                }
            }
            html += '</ul>';
            html += '<img src="' + ImageGallery[0] + '" alt="fp" class="img-responsive">\
                                   <div class="property-overlay">\
                                       <a href="' + propertyResult[i].URL + '"    class="overlay-link" target="_blank">\
                                       <i class="fa fa-link"></i>\
                                   </a>';
            if (propertyResult[i].VideoURL || propertyResult[i].VideoGallery) {
                html += '<a class="overlay-link property-video" title=' + propertyResult[i].Title + ' onclick="videoModal(\'Video\' , \'' + propertyResult[i].VideoURL + '\',\'' + propertyResult[i].VideoGallery + '\',\'' + ImageGallery + '\', ' + YouTubeGetID + ', ' + i + ');">\
                                   <i class="fa fa-video-camera"></i>\
                                       </a>';
            }
            for (var j = 0; j < ImageGallery.length; j++) {
                if (j == 0) {
                    html += '<a class="overlay-link property-video" title= ' + propertyResult[i].Title + ' onclick="videoModal(\'Images\' ,\'' + propertyResult[i].VideoURL + '\',\'' + propertyResult[i].VideoGallery + '\',\'' + ImageGallery + '\', ' + YouTubeGetID + ', ' + j + ');">\
                   <i class="fa fa-expand"></i>\
               </a>';
                }
            }

            /*              html += '<div class="property-magnify-gallery">';
                         for (var m = 0; m < ImageGallery.length; m++) {
                             if (m == 0) {
                                 html += '<a href="' + ImageGallery[0] + '" class="overlay-link">\
                                                        <i class="fa fa-expand"></i>\
                                                    </a>';
                             } else {
                                 html += '<a href="' + ImageGallery[m] + '" class="hidden"></a>';
                             }
                         } */
            html += '</div>\
                           </div>\
                           <div class="property-content">\
                               <!-- title -->\
                               <div class="col-md-7 col-sm-6 col-xs-12 cont-item cont-item1">\
                                   <h3 class="title">\
                                       <a href="javascript:void(0);" onclick="propertyInfowindow(' + propertyResult[i].ID + ',\'' + propertyResult[i].URL + '\')" title="' + propertyResult[i].Title + '">' + propertyResult[i].Title.substring(0, 22);
            if (propertyResult[i].Title.length > 22) {
                html += '...';
            }
            html += '</a>\
                                       <span class="titleheart ' + Active + '" id="myfavorite_' + i + '">\
                                           <a href="javascript:void(0);" onclick="saveAsFavorite(\'' + sessVal + '\',' + propertyResult[i].ID + ',' + i + ')"><i class="fa fa-heart" aria-hidden="true"></i></a>\
                                           </span>\
                                   </h3>\
                                   <!-- Property address -->\
                                   <h4 class="property-address">\
                                       <a href="#">\
                                           <i class="lnr lnr-map-marker"></i>';
            if (propertyResult[i].Area) {
                html += '' + propertyResult[i].Area + ', ';
            }
            html += '' + propertyResult[i].city + '\
                                       </a>\
                                   </h4>\
                               </div>\
                               <div class="col-md-7 col-sm-6 col-xs-12 cont-item cont-item2">';
            if (propertyResult[i].ProjectStatusID) {
                html += '<h5>' + PropertyStatus[propertyResult[i].ProjectStatusID] + '</h5>';
            }
            html += '<ul class="facilities-list clearfix">\
                                           <li>';
                                           if (Extent && Extent.length > 0) {
                                            html += '<img src="/img/extent.jpg" width="14" ,height="16" style="margin-top:-4px" title="Extent"> ';
                                             if(Math.min(...Extent) == Math.max(...Extent)) {
                                                html += '</span>' + Math.min(...Extent) + '<span>' + propertyResult[i].UnitIdentifier +'';
                                            } else {
                                                html += '</span>' + Math.min(...Extent) + ' - ' + Math.max(...Extent) + '<span> ' + propertyResult[i].UnitIdentifier +'';
                                            }
                                        }
                            
            html += '</li>';

            if (NumberofBeds.length > 0) {
                if (NumberofBeds.length == 1) {
                    html += '<li>\
                                                   <i class="fa fa-bed"></i>\
                                                   </span>' + Math.min(...NumberofBeds) + '<span>';
                } else {
                    html += '<li>\
                                                   <i class="fa fa-bed"></i>\
                                                   </span>' + Math.min(...NumberofBeds) + ' - ' + Math.max(...NumberofBeds) + '<span>';
                }

            }
            if (NumberofBath.length > 0) {
                if (NumberofBath.length == 1) {
                    html += '<li>\
                                                   <i class="flaticon-holidays"></i>\
                                                   </span>' + Math.min(...NumberofBath) + '<span>';
                } else {
                    html += '<li>\
                                                   <i class="flaticon-holidays"></i>\
                                                   </span>' + Math.min(...NumberofBath) + ' - ' + Math.max(...NumberofBath) + '<span>';
                }

            }

            /* if(unitDetailsData){
                html +='<li>\
                        <i class="fa fa-bed"></i>\
                        <span>'+unitDetailsData.NumberofBeds+'</span>\
                    </li>';
            }if(unitDetailsData){
                html +='<li>\
                        <i class="flaticon-holidays"></i>\
                        <span>'+unitDetailsData.NumberofBath+'</span>\
                    </li>';
            } */

            if (facing) {
                html += '<li><img src="/img/facing.jpg" width="14" ,height="16" style="margin-top:-4px"> ';
                html += '<span>' + facing + '</span></li>';
            }

            html += '</ul>\
                               </div>\
                               <div class="col-md-5 col-sm-6 col-xs-12 cont-item cont-item3">';
            if (propertyResult[i].DisplayPrice) {

           
                if (Math.min(...TotalPrice) == Math.max(...TotalPrice)) {
                    propertyResult[i].viewPrice = currencyFormat(Math.max(...TotalPrice));
                    html += '<div class="property-price">&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' + currencyFormat(propertyResult[i].SearchPrice) + '/ '+UnitIdentifier+' </h5></div>';

                } else {
                  
                    propertyResult[i].viewPrice = currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice));
                    html += '<div  class="property-price">&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' + currencyFormat(propertyResult[i].SearchPrice) + '/ '+UnitIdentifier+' </h5></div>';
                }
            } else {
                html += '<div  class="property-price"><div> Price On Request </div>\
               </div>';
            }


            html +=    '</div>\
                               <div class="col-sm-5 col-xs-12 cont-item cont-item4">';
                               if (propertyResult[i].DisplayPrice) {
                                   if (Math.min(...TotalPrice) == Math.max(...TotalPrice)) {
                                       propertyResult[i].viewPrice = currencyFormat(Math.max(...TotalPrice));
                                       html += '<div class="property-price mapshowprice" style="display:none;">&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' +currencyFormat(propertyResult[i].SearchPrice)+ '/ '+UnitIdentifier+' </h5></div>';
                  
                                   } else {
                                     
                                       propertyResult[i].viewPrice = currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice));
                                       html += '<div  class="property-price mapshowprice" style="display:none;">&#8377; ' + currencyFormat(Math.min(...TotalPrice)) + ' - ' + currencyFormat(Math.max(...TotalPrice)) + '<h5 class = "p-color mt-0 mb-0"> ' + currencyFormat(propertyResult[i].SearchPrice) + '/ '+UnitIdentifier+' </h5></div>';
                                   }
                               } else {
                                   html += '<div  class="property-price mapshowprice" style="display:none;"><div> Price On Request </div>\
                                  </div>';
                               }
           html+=       '<a href="javascript:void(0);" class="button transparent"  id="Iam" onclick=\'iAm_Interested(' + JSON.stringify(propertyResult[i]) + ')\' >I am Interested</a>\
                               </div>\</div>\
                   </div></div>';
        }
    } else {
        html = '<div class="col-lg-12 text-center mb15"><strong>No Record Found.</strong></div>';
        setTimeout(function () {
           $(window).trigger('resize');
       }, 50);
    }
    
    $('.filtr-container').html(html);
    $('#advancefilter').hide();
    initfilterize();
    setTimeout(function(){$(window).trigger('resize'); }, 250);

    clearGeometry();
    renderGeometry(propertyResult);
    if (recommemdedTab == 0) {
        $('.filtr-button[data-filter=2]').hide();
    } else {
        $('.filtr-button[data-filter=2]').show();
    }

    $('.property-magnify-gallery').each(function () {
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });
    $('.page_loader').hide();   
}


// Add Remove Dynamic Div   
function removehtml(e, c) {
    $('.' + c + '-row-' + e).remove();
    // $("#page_scroller").trigger('click');

}

function UpdateUnitDetail(UnitDetails, i) {


    var html = '<div class="col-sm-7">';

    if (UnitDetails[i].UnitExtent) {
        html += '<div><img src="/img/extent.jpg" width="14" height="16"  style="margin-top:-4px">\
                              <span>' + UnitDetails[i].UnitExtent + '</span>';
    }
    html += '</div>';

    if (UnitDetails[i].NumberofBeds) {
        html += '<div><i class="fa fa-bed"></i>\
                                   <span>' + UnitDetails[i].NumberofBeds + '</span>';
    }
    html += '</div>';

    if (UnitDetails[i].NumberofBath) {
        html += '<div><i class="flaticon-holidays"></i>\
                                   <span>' + UnitDetails[i].NumberofBath + '</span>';
    }
    html += '</div>';
    html += '<div class="col-sm-5">\
                                    <ul id="drop-val" class="mb-20">\
                               <li class="dropdown">\
                                   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><span id="floor-val">Ground floor</span>\
                                   <span class="caret"></span></a>\
                                   <ul class="dropdown-menu">';
    for (var j = 0; j < UnitDetails.length; j++) {
        html += '<li onclick="UpdateUnitDetail(' + JSON.stringify(UnitDetails[j]) + ',' + j + ')"> Unit ' + (j + 1) + ' </li>';
    }
    html += '</ul>\
                                        </li>\
                                           </ul>';

    if (UnitDetails[i].FloorPlanURL) {
        html += '<div><img src=' + UnitDetails[i].FloorPlanURL + ' width="14" , height="16" style="margin-top:-4px">';
    }
    html += '</div>';


    if (UnitDetails[i].UndividedShare) {
        html += '<h4>UndividedShare:</h4>';
        html += '<div><span>' + UnitDetails[i].UndividedShare + '</span>'
    }
    html += '</div>\
                           </div>\
                       </div>';



    $('#individualUnitDetail').html(html);

    // var html= '<div class="prop-details">\
    //                 <div class="sidebar-widget col-xs-12 mb-40  pt-30 ">\
    //                     <div class="col-sm-12  pb-30">\
    //                         <div class="row">\
    //                             <div class="col-sm-7" >'
    //             if(UnitDetails[i].UnitExtent) {
    //                      html +='<img src="/img/extent.jpg" width="14" ,                    height="16"  style="margin-top:-4px"> '
    //                         '<span>'+ UnitDetails[i].UnitExtent +'</span>'
    //             }
    //             if(UnitDetails[i].NumberofBeds){
    //                     html +='<i class="fa fa-bed"></i>\
    //                             <span>'+UnitDetails[i].NumberofBeds+'</span>'
    //             }
    //             if(UnitDetails[i].NumberofBath){
    //                     html +='<li><i class="flaticon-holidays"></i>\
    //                         <span>'+UnitDetails[i].NumberofBath+'</span></li>'
    //             }
    //          If(UnitDetails[i].FloorPlanURL){
    //                     html +='<img src='+ UnitDetails[i].FloorPlanURL + 'width="14" ,     height="16" style="margin-top:-4px" title="Extent">';
    //             }
    //             if(UnitDetails[i].UndividedShare){
    //                     html +='<li><span>'+UnitDetails[i].UndividedShare+'</span></li>'
    //             }
    //                 '</div>\
    //             </div>\
    //         </div>\
    //     </div>\
    // </div>';             


}

function addhtml(e) {
    //var key = $(e).data('key');

    var i = parseInt($('.input_fields_wrap').data('key'));
    i++;
    // $('.add_field_button-' + key).attr('onclick', 'removehtml(' + key + ',"flore");');

    // $(e).text('Remove');

    var html = '<div class="flore-row-' + i + '" >\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Title</h4>\
                   <div class="form-group">\
                       <input type="text" class="input-text title" name="title_' + i + '" placeholder="Title" >\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Bedrooms</h4>\
                   <select class="selectpicker bedrooms" id="bedrooms_' + i + '" name="bedrooms_' + i + '">\
                   <option value="">Select</option>\
                       <option value="1">1</option>\
                       <option value="2">2</option>\
                       <option value="3">3</option>\
                       <option value="4">4</option>\
                       <option value="5">5</option>\
                       <option value="6">6</option>\
                   </select>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Bathrooms</h4>\
                   <select class="selectpicker bathrooms" id="bathrooms_' + i + '" name="bathrooms_' + i + '">\
                   <option value="">Select</option>\
                       <option value="1">1</option>\
                       <option value="2">2</option>\
                       <option value="3">3</option>\
                       <option value="4">4</option>\
                       <option value="5">5</option>\
                       <option value="6">6</option>\
                   </select>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Number of Balconies</h4>\
                   <select class="selectpicker" onchange="$("#previewBath").text(this.value)" name="numberofblaconies_' + i + '">\
                       <option value="">Select</option>\
                       <option value="1">1</option>\
                       <option value="2">2</option>\
                       <option value="3">3</option>\
                       <option value="4">4</option>\
                       <option value="5">5</option>\
                       <option value="6">6</option>\
                   </select>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Super built up area</h4>\
                   <div class="form-group">\
                       <input type="text" class="input-text buildUpArea" name="buildUpArea_' + i + '" placeholder="Super Built up area" onkeyup="showUnitExtend(\'buildUpArea\')">\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Plinth area</h4>\
                   <div class="form-group">\
                       <input type="text" class="input-text plinthArea" name="plinthArea_' + i + '" placeholder="Plinth Area" >\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Facing</h4>\
                   <div class="form-group">\
                       <div class="checkbox inline">\
                           <input type="checkbox" value="true" name="north_' + i + '" id="north_' + i + '"><label for="north_' + i + '">N</label>\
                       </div>\
                       <div class="checkbox inline">\
                           <input type="checkbox" value="true" name="east_' + i + '" id="east_' + i + '"><label for="east_' + i + '">E</label>\
                       </div>\
                       <div class="checkbox inline">\
                           <input type="checkbox" value="true" name="south_' + i + '" id="south_' + i + '"><label for="south_' + i + '">S</label>\
                       </div>\
                       <div class="checkbox inline">\
                           <input type="checkbox" value="true" name="west_' + i + '" id="west_' + i + '"><label for="west_' + i + '">W</label>\
                       </div>\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Undivided share</h4>\
                   <div class="form-group">\
                       <input type="text" name="undividedShare_' + i + '" class="input-text undividedShare" placeholder="Undivided Share">\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Car parking Area</h4>\
                   <div class="form-group">\
                       <input type="text" name="CarParkingArea_' + i + '" class="input-text" placeholder="car Parking Area">\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Balconies Area</h4>\
                   <div class="form-group">\
                       <input type="text" name="BalconyArea_' + i + '" class="input-text" placeholder="Balconies Area">\
                   </div>\
               </div>\
               <div class="col-sm-6 col-xs-12">\
                   <h4>Apartment Number</h4>\
                   <div class="form-group">\
                       <input type="text" name="UnitNumber_' + i + '" class="input-text" placeholder="Apartment Number">\
                   </div>\
               </div>';
    // <div class="col-sm-6 col-xs-12">\
    //     <h4>Unit Extent</h4>\
    //     <div class="form-group">\
    //         <input type="text" name="UnitExtent_' + i + '" class="input-text" placeholder="Apartment Number">\
    //     </div>\
    // </div>';

    if ($('#Type').val() == 2 && $('#PropertyTypeChildID').val() == 5 || $('#PropertyTypeChildID').val() == 6) {
        html += '<div class="col-sm-6 col-xs-12 Apartment additional-info">\
                   <h4>Floor number</h4>\
                   <div class="form-group">\
                       <input type="text" class="input-text UnitFloor" name="UnitFloor_' + i + '"  placeholder="Floor Number" >\
                   </div>\
               </div>'
    }

    html += '<div class="col-sm-12 col-xs-12">\
                   <h4>Images</h4>\
                   <div id="FloorPlanImage_' + i + '" class="dropzone dropzone-design mb-30">\
                       <div class="dz-default dz-message"><span>Drop files here to upload</span></div>\
                   </div>\
                   <input type="hidden" id="FloorPlanURL_' + i + '" name="FloorPlanURL_' + i + '" value="" >\
               </div>';

    html += '<div class="col-sm-12 col-xs-12 ">\
                   <h4>Add videos</h4>\
                   <div class="form-group">\
                   <input type="text" id="VideoURL_" name="VideoURL_" class="input-text" placeholder="Add a video link">\
               </div>\
               </div>';


    html += '<div class="col-sm-12 text-left mb-30">\
                    <button class="add_field_button-' + i + ' button transparent" type="button"  onclick="removehtml(' + i + ',\'flore\');" data-key="' + i + '">Remove</button>\
               </div>\
           </div>';

    // <div class="col-sm-12 text-left mb-30">\
    //          <button class="add_field_button-' + i + ' button transparent" type="button"  onclick="addhtml(this);" data-key="' + i + '">Add</button>\
    //     </div>\

    $('.input_fields_wrap').append(html);
    $('.input_fields_wrap').data('key', i);
    $('.selectpicker').selectpicker();


    cropingImg(i);

    i++;
    $('#multiple_option_length').val(i);

}

function cropingImg(i) {
    $("div#FloorPlanImage_" + i).dropzone({
        url: "/file-upload/image_upload",
        acceptedFiles: 'image/*',
        maxFiles: 10,
        maxFilesize: 5,
        paramName: 'image_uploads',
        timeout: 50000,
        resizeHeight: 400,
        resizeWidth: 400,
        parallelUploads: 2,
        uploadMultiple: false,
        addRemoveLinks: true,
        removedfile: function (file) {
            $('#FloorPlanURL_' + i).val('');
            var _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
        init: function () {
            this.on("complete", function (data) {
                if (data.xhr) {
                    var image_obj = JSON.parse(data.xhr.responseText)[0];
                    var path = image_obj.location;
                  /*   if ($('#FloorPlanURL_' + (i - 1)).val()) {
                        $('#FloorPlanURL_' + (i - 1)).val($('#FloorPlanURL_' + (i - 1)).val() + ',' + path);
                    } else {
                        $('#FloorPlanURL_' + (i - 1)).val(path);
                    } */

                    //Oth  index issue at unit detail image
                    if ($('#FloorPlanURL_' + (i)).val()) {
                        $('#FloorPlanURL_' + (i)).val($('#FloorPlanURL_' + (i)).val() + ',' + path);
                    } else {
                        $('#FloorPlanURL_' + (i)).val(path);
                    }
                }
            });
            this.on("maxfilesexceeded", function (data) {
                this.removeFile(data);
            });

        },
        /* transformFile: function (file, done) {
            var myDropZone = this;
            // Create the image editor overlay
            var editor = document.createElement('div');
            //var cancelCrop = document.getElementsByClassName("cancelCrop")
            var confirm = document.getElementById('crop');
            confirm.addEventListener('click', function () {
                // Get the canvas with image data from Cropper.js
                var canvas = cropper.getCroppedCanvas({
                    width: 256,
                    height: 256
                });
                // Turn the canvas into a Blob (file object without a name)
                canvas.toBlob(function (blob) {
                    // Update the image thumbnail with the new image data
                    myDropZone.createThumbnail(
                        blob,
                        myDropZone.options.thumbnailWidth,
                        myDropZone.options.thumbnailHeight,
                        myDropZone.options.thumbnailMethod,
                        false,
                        function (dataURL) {
                            // Update the Dropzone file thumbnail
                            myDropZone.emit('thumbnail', file, dataURL);
                            // Return modified file to dropzone
                            done(blob);
                        }
                    );
                });
                // Remove the editor from view
                $('.img-container').children('div').remove()
                $('#modalCrop').modal('hide');
            });
            $(".cancelCrop").each(function () {
                $(this).on("click", function () {
                    $('.img-container').children('div').remove()
                    myDropZone.removeFile(file);
                });
            });
            //editor.appendChild(confirm);
            // Load the image
            var image = new Image();
            image.src = URL.createObjectURL(file);
            editor.appendChild(image);
            // Append the editor to the page
            $('#modalCrop').modal('show');
            $('#modalCrop .img-container').append(editor);
            // Create Cropper.js and pass image
            var cropper = new Cropper(image, {
                dragMode: 'move',
                aspectRatio: 2 / 1,
                strict: false,
                autoCropArea: 0,
                restore: false,
                zoomable: true,
                guides: false,
                center: true,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                toggleDragModeOnDblclick: false,
                zoomOnWheel: true
            });

        } */
    });
}

function addPlotsUnitDetails(e) {

    var key = $(e).data('key');

    var i = parseInt($('.input_plots_wrap').data('key'));
    i++;
    /* $('.add_plots_button-' + key).attr('onclick', 'removehtml(' + key + ',"plots");');

    $(e).text('Remove'); */

    var html = '<div class="plots-row-' + i + '" >\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Title</h4>\
                       <div class="form-group">\
                           <input type="text" class="input-text title" name="plotsTitle_' + i + '" placeholder="Title" >\
                       </div>\
                   </div>\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Width</h4>\
                       <div class="form-group">\
                           <input type="text" class="input-text" name="PlotWidth_' + i + '"  placeholder="Width" >\
                       </div>\
                   </div>\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Length</h4>\
                       <div class="form-group">\
                           <input type="text" class="input-text" name="PlotLength_' + i + '"  placeholder="Plot Length" >\
                       </div>\
                   </div>\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Plot Extent</h4>\
                       <div class="form-group">\
                           <input type="text" class="input-text plotsUnitExtent" name="plotsUnitExtent_' + i + '"  placeholder="Plot Extent" onkeyup="showUnitExtend(\'plotsUnitExtent\')" >\
                       </div>\
                   </div>\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Unit Number</h4>\
                       <div class="form-group">\
                           <input type="text" class="input-text" name="plotsUnitNumber_' + i + '"  placeholder="Unit Number" >\
                       </div>\
                   </div>\
                   <div class="col-sm-6 col-xs-12">\
                       <h4>Facing</h4>\
                       <div class="form-group">\
                           <div class="checkbox inline">\
                               <input type="checkbox" value="true" name="plotsNorth_' + i + '" id="plotsNorth_' + i + '"><label for="plotsNorth_' + i + '">N</label>\
                           </div>\
                           <div class="checkbox inline">\
                               <input type="checkbox" value="true" name="plotsEast_' + i + '" id="plotsEast_' + i + '"><label for="plotsEast_' + i + '">E</label>\
                           </div>\
                           <div class="checkbox inline">\
                               <input type="checkbox" value="true" name="plotsSouth_' + i + '" id="plotsSouth_' + i + '"><label for="plotsSouth_' + i + '">S</label>\
                           </div>\
                           <div class="checkbox inline">\
                               <input type="checkbox" value="true" name="plotsWest_' + i + '" id="plotsWest_' + i + '"><label for="plotsWest_' + i + '">W</label>\
                           </div>\
                       </div>\
                   </div>\
                       <div class="col-sm-12 text-left mb-30">\
                       <button class="add_field_button-' + i + ' button transparent" type="button"  onclick="removehtml(' + i + ',\'plots\');" data-key="' + i + '">Remove</button>\
                       </div>\
               </div>';

    $('.input_plots_wrap').append(html);
    $('.input_plots_wrap').data('key', i);
    $('.selectpicker').selectpicker();
    i++;
    $('#multiple_option_length_1').val(i);

}

function byInCity(val) {
    setCookie('byInCity', val, 1);
    //$('#CityID').val(val);
   //  changeCity(val);
    $('#selectedCity').val(val);
    $('#byInCity').val(val);
    $('#city').val(val);
     $('#byPropertyINcity').val(val);
    $('.selectpicker').selectpicker('refresh');
    $('.nav-tabs a[href="#' + val + '"]').trigger('click');
    setArea();
}

function TypebySelect(val) {
    setCookie('propertyType',val,1);
    $('#Type').val(val);
    $('#type').val(val);
    $('.selectpicker').selectpicker('refresh');
}

function AreaSelect(val) {
   setCookie('AreaType',val,1);
  // $('#myInput').val(val);
   $('.selectpicker').selectpicker('refresh');
}

function Refresh() {
    $("#SearchfilterForm")[0].reset();
    $('.selectpicker').selectpicker('refresh')
    $('.inputwrap input[type=text]').val('')
    $('.inputwrap input[type=text]').attr('value', '')
    $('.min-dropdown').removeClass('hide'); 
    $('.max-dropdown  ').addClass('hide'); 
    $('.min-max .minVal').text('')
    $('.min-max .maxVal').text('')
    $('.min-max .selected-val .Selecttxt').show()
    $('.parameter-dropdown ul li').removeClass('active');
}

function changeTab(event) {
   // console.log($(event).attr('href').replace("#", ""),'changeTab');
    $(event).tab('show');
    $(event).attr('href');
    setCookie('byInCity', $(event).attr('href').replace("#", ""), 1);

    $('#byPropertyINcity').val($(event).attr('href').replace("#", ""));
    $('.selectpicker').selectpicker('refresh');
    $('#selectedCity').val($(event).attr('href').replace("#", ""));
    setArea();
}

function setArea() {
    var checkCity = cities.map(function (item) {
        if (item.Name.toUpperCase() == getCookie('byInCity').toUpperCase()) {
            return item.ID;
        }
    });
    if (typeof cityArea != 'undefined') {
      // console.log(cityArea)
        var area = [];
        var option = '';
        for (var i = 0; i < cityArea.length; i++) {
            if ($.inArray(cityArea[i].CityID, checkCity) > -1 || getCookie('byInCity') == 'All') {
                area.push(cityArea[i]);
                option += '<option value="' + cityArea[i].ID + '">' + cityArea[i].Area + '</option>'
            }
        }

   
        if ($('#myInput').length == 1) {
            autocomplete(document.getElementById("myInput"), area, 'Area');
        }
        if ($('#area_id').length > 0) {
            $('#area_id').html(option);
            $('.selectpicker').selectpicker('refresh');
        }
    }
}

function changePropertyText(val) {
    if (typeof propertyCategory != 'undefined') {
        var propertyIds = propertyType.map(function (item) {
            if (item.Type == val) {
                return item.ID;
            }
        });

        var html = '<option value="">Property Type Child</option>';
        for (var i = 0; i < propertyCategory.length; i++) {
            $.inArray(parseInt(propertyCategory[i].PropertyTypeID), propertyIds);
            if ($.inArray(parseInt(propertyCategory[i].PropertyTypeID), propertyIds) > -1) {
                html += '<option value="' + propertyCategory[i].PropertyTypeChild + '">' + propertyCategory[i].PropertyTypeChild + '</option>';
            }
        }
        $('#category').html(html);
        $('.selectpicker').selectpicker('refresh');

    }
}

function showHideDate(st) {

    var val = $('#PropertyTypeChildID').val();
    var check = ['New_Approved_Layout', 'Apartment', 'Gated_Community', 'Villas'];
    for (var i = 0; i < propertyCategory.length; i++) {
        if (propertyCategory[i].ID == val) {
            var targID = propertyCategory[i].PropertyTypeChild.split(' ').join('_');
        }
    }

    if (st == false && $.inArray(targID, check) > -1) {
        $('.Launch_Possession').show();
    } else {
        $('.Launch_Possession').hide();
    }

}

function sortProperty(val, id) {
    // initfilterize(val);
    $('#' + id).val(val).selectpicker('refresh');
    if (val == 1) {
        propertyResult.sort(function (a, b) {
            return b.TotalPrice - a.TotalPrice
        });
    } else if (val == 2) {
        propertyResult.sort(function (a, b) {
            return a.TotalPrice - b.TotalPrice
        });
    } else if (val == 3) {
        propertyResult.sort(function (a, b) {
            return b.ID - a.ID
        });
    } else if (val == 4) {
        propertyResult.sort(function (a, b) {
            return a.ID - b.ID
        });
    }

    var data = {
        propertyResult: propertyResult,
        PropertyLocations: PropertyLocations,
        recommemdedIds: recommemdedIds,
        GalleryImage: GalleryImage,
        UnitTableData: UnitTableData,
        favoriteData: favoriteData,
        UnitIdentifier: UnitIdentifier,
   }

    propertyHtml(data);
}

function openLogin() {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    sessionStorage.redirectTo = '';
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == 'redirectTo') {
            sessionStorage.redirectTo = urlparam[1];
        }
    }
    if (sessionStorage.redirectTo != '') {
        $('#loginPopup').modal('show');
    }
}

function changeStatus(event) {
    //<span class="lnr lnr-checkmark-circle" ></span>
    /* if (val == 'complete') {
        $('#previewStatus').html('ready to move in');
    } else {
        $('#previewStatus').html('Under Construction');
    } */
}

function numberFormat(event) {
    // console.log('---------',event)
    var selection = window.getSelection().toString();
    if (selection !== '') {
        return;
    }
    if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return;
    }
    var $this = $(event);
    var input = $this.val();
    var input = input.replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;
    $this.val(function () {
        return (input === 0) ? "" : input.toLocaleString("en-IN");
    });
}


function currencyFormat(input) {
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
            p += '.'+a[1];
        }
        p += ' K';
    }else{
        p = input;
    }
    return p;
}

function getInTouch() {
    var valid = true;
    $("#getInTouchFrom").find('input,textarea').each(function () {
        if (!getInTouchValidate.element(this) && valid) {
            valid = false;
        }
    });

    if (!valid) {
        return false;
    } else {
        $('#refresh').show();
        var data = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/getInTouch',
            success: function (res) {
                $('#getInTouchMessage').html('<div class="alert alert-' + res.status + '"><strong>' + res.message + '</strong></div>');
                $("#getInTouchMessage").fadeTo(6000, 500).slideUp(500);
                $("#getInTouchFrom")[0].reset();
            }
        });
    }
}

function facingChange() {
    var temp = [$('#north').is(':checked') ? 'North' : '',
        $('#east').is(':checked') ? 'East' : '',
        $('#south').is(':checked') ? 'South' : '',
        $('#west').is(':checked') ? 'West' : ''
    ];
    var str = '';
    for (var i = 0; i < temp.length; i++) {
        if (temp[i]) {
            str += ' ' + temp[i] + ' |';
        }
    }

    if (str) {
        str = str.slice(0, -2);
        $('#previewFacing').html('<img src="/img/facing.jpg" width="16" height="16">' + str);
    } else {
        $('#previewFacing').html('');
    }
}

$('.check_box').change(function(){
   if($('.check_box:checked').length==0){
       $('.additional-info .checkbox .input-text').hide();
   }else{
       $('.additional-info .checkbox .input-text').hide();
       $('.check_box:checked').each(function(){
           $('#'+$(this).attr('data-ptag')).show();
       });
   } 
});

if($('header .advancedFilter').length==0) {
   $('header').addClass('no-advanceFilter')
}

function formValidation(id) {
    return $("#" + id).validate({
        showErrors: function (errorMap, errorList) {
            $.each(this.validElements(), function (index, element) {
                var $element = $(element);
                if ($element.is("select")) {
                    var id = $element.attr("id");
                    $element = $('.dropdown-toggle[data-id="' + $element.attr("id") + '"]')
                }
                $element.data("title", "")
                    .removeClass("error")
                    .tooltip("destroy");
            });

            $.each(errorList, function (index, error) {
                var $element = $(error.element);
                var msg = error.message;
                if ($element.is("select")) {
                    var id = $element.attr("id");
                    $element = $('.dropdown-toggle[data-id="' + $element.attr("id") + '"]')
                }

                $element.tooltip("destroy")
                    .data("title", msg)
                    .addClass("error")
                    .tooltip();
                if ($element.is("button")) {
                    $element.attr('data-original-title', msg);
                }
            });
        }
    });
}

function showUnitExtend(c) {
    var temp = [];
    $('.' + c).each(function () {
        temp.push($(this).val());
    });
    var extent = '';
    if (Math.min(...temp) == Math.max(...temp)) {
        extent = Math.min(...temp);
    } else {
        extent = Math.min(...temp) + '-' + Math.max(...temp);
    }

    $('#previewExtent').text(extent);
    $('#extentIcon').html('<img src=\'/img/extent.jpg\' Width=\'14\',height=\'16\'>')
}

function showHideModal(showModal, hideModal) {
    $(hideModal).modal('hide');
    setTimeout(function () {
        $(showModal).modal('show');
    }, 500);

}


function subscribeUser(id) {
    if (!$('#' + id).valid()) {
        return false;
    }
    $.ajax({
        url: '/subscribe',
        type: 'POST',
        data: $('#' + id).serialize(),
        success: function (res) {
            $('#subscribemsg').html('<div class="alert alert-' + res.status + '">' + res.msg + '</div>').show();
            $('#subscribemsg').delay(4000).slideUp();
            setTimeout(function () {
                if (res.status == 'success') {
                    $('#iAmInterestedModal').modal('hide');
                }
            }, 4100);
        }
    });
}

//  Overlay

var overlayInter= setInterval(() => {
   if($('.custom-col .bootstrap-select').length>0){
       $('.custom-col.onclick .bootstrap-select').click(function(e){
           e.preventDefault();
           $(this).parent().toggleClass('z-ind')
           var Classhide = $('.js-overlay').hasClass('hide');
           if(!Classhide){
                $('.js-overlay').addClass('hide')
             }else {
               $('.js-overlay').removeClass('hide')
             }
       })

      $('.filter-more .js-filter-btn').click(function(){
       // $('.more-dd.Agriculture_Lands').removeClass('open')
       $(this).parent().toggleClass('z-ind')
       var activated = $('.selected-val.js-filter-btn ').hasClass('activated');
       var Classhide = $('.js-overlay').hasClass('hide');
       if(!Classhide){
           $('.js-overlay').addClass('hide')
       }else {
           $('.js-overlay').removeClass('hide')
       }
       
         if( activated){
            $('.selected-val.js-filter-btn').addClass('activated')
            $('.more-dd.Agriculture_Lands').addClass('open')
         }
       })


    $(".min-max .selected-val").on("click", function(event){
        $(this).toggleClass('activate');
        $(this).parent().parent().toggleClass('z-ind')
        $(this).siblings('.dropMax').toggleClass('open')
        var Classhide = $('.js-overlay').hasClass('hide');
           if(!Classhide){
               $('.js-overlay').addClass('hide')
           }else {
               $('.js-overlay').removeClass('hide')
           }
        // $(".menu").toggle();
        event.stopPropagation();
    });
    if($(window).width() > 1199) {    
        $(".custom-col h4 , .budget .dropMax, .extent .dropdown-menu").on("click", function(event){
            event.stopPropagation();
        });
    }
    
    $(document).on("click", function(event){
        $('selected-val').toggleClass('activate');
        $('.min-max').parent('.custom-col').removeClass('z-ind')
        $('.dropMax').removeClass('open')
    });

       $('.js-overlay').click(function(){

           $('.custom-col, .filter-tab.filter-more').removeClass('z-ind')
           $('.more-dd.Agriculture_Lands').removeClass('open')
           $('.selected-val.js-filter-btn').removeClass('activated')
           $('.min-max .selected-val').removeClass('activate')
           $('.dropMax').removeClass('open')
           $('.min-max .selected-val').parent().parent().removeClass('z-ind')
           $(this).addClass('hide');
       })


       $('.select-1 ul li').click(function(){
           $(this).parents('.min-max ').find('.Selecttxt').hide();
           var liValmin = $(this).find('.text').text()
           $(this).parents('.min-max ').find('.minVal').html(liValmin + ' - ' )
           $(this).parents('.parameter-dropdown').find('.max').focus()
           $(this).siblings().removeClass('active');
           $(this).addClass('active');
           $(this).parents('.parameter-dropdown').find('.max-dropdown').removeClass('hide')
       })
       $('.select-2 ul li').click(function(){
           var liValMax = $(this).find('.text').text()
           $(this).parents('.min-max ').find('.maxVal').html(liValMax)
           $(this).siblings().removeClass('active');
           $(this).addClass('active');
       })
   
   
       $('.parameter-dropdown ul li').on('click',function(){
           var content= $(this).text();
           $(this).parent().parent().find('input[type=text]').val(content)
       
       });
       
       clearInterval((overlayInter))
   }
}, 1000);


function minVal(e){
   if ($(e).attr('name')=='extentMin'){
       $(e).parents('.extent').find('.Selecttxt').hide();
       var liValmin = $(e).parents('.extent').find('select option:selected').text();
    //    console.log($(e).parents('.min-max ').find('.minVal').html(liValmin + ' - ' ));
       $(e).parents('.min-max ').find('.minVal').html(liValmin)

       
       $(e).parents('.parameter-dropdown').find('.max-dropdown').removeClass('hide')
   }

   var text= $('select[name="extentMin"]').find('option:selected').text();

   var maxtext=$('select[name="extentMax"]').find('option:selected').text();
       if(maxtext=='Max'){
           maxtext='';
       }
       else{
           text+=' - ';
       }
       
       $('select[name="extentMin"]').parents('.min-max ').find('.minVal').html(text);
       $('select[name="extentMax"]').parents('.min-max ').find('.maxVal').html(maxtext);
}


$('.parameter-dropdown .range-toggle-in li').click(function (){
   var valueX = $(this).attr("data-value")
//    console.log(valueX);
   $(this).parent().parent().find('input[type=text]').attr('value', valueX); 
   $(this).parent().parent().find('input[type=hidden]').val(valueX);
   HideMax(this, valueX)
})

$(document).ready(function(){
    if($(window).width() > 1199){
    $('.filter-cntrl').show('slow');
    }
})

/* setValue function for plotsize and budget */

function setValue(html,id){
    customval = $(html).attr('name');
    val = $(html).val();
    var Int = '';
    // $('#'+id).val(val);
   if(val){
       var string =  val.match(/[a-z]+|\d+/ig);
        if(string.length == 1 ){
            if(isNaN(parseInt(string[0]))){
                Int =  ((id == 'Plotbudget_min')) ? '1000000' : '200000000' ;
            }else{
                Int = string[0];
            }
        }
        else{
            if(string[1] == 'K' || string[1] ==  'k')  {;
                string[0] += '000'
            }  else if(string[1] == 'L' || string[1] ==  'l')  {
                string[0] += '00000'
            }  else if(string[1] == 'Cr' || string[1] ==  'cr')  {
                string[0] += '0000000'
            }
            Int =  (isNaN(parseInt(string[0]))) ? '200000000' : string[0] ;
        }
        $('input[name='+ customval+']').val(currencyFormat(Int));
        $('#'+id).val(Int);
   }
  

    

    HideMax(html, Int)
}

function checkPlotsize(html, id){
    val=$(html).val();
    console.log(val,id,'0000000000000');
    if (val ){
    var string =  val.match(/[a-z]+|\d+/ig);
    // console.log(string,string[0],'strin')
        var customval = string[0];
        $('#'+id).val(customval);
        HideMax(html, customval)   
    }

}

function HideMax(html, Int) {
    // $(this).parents('.parameter-dropdown').find('input[type=text]').attr('value', '');
    // $(html).parents('.parameter-dropdown').find('.max-dropdown li').each(function(key, value){
    // // console.log(key, value)
    //     if ( parseInt($(value).attr('data-value')) < parseInt(Int) ) {
    //     //  console.log(valueX);
    //         // console.log($(value).attr('data-value'));
    //         $(value).hide();
    //     }else {
    //         $(value).show();
    //     }
    // })
}
$(".custom-col .bootstrap-select").on("click", function(event){
    event.stopPropagation();
});

if($(window).width() < 1199) {

    $('.custom-col').on('click', function(){
        $('span.selected-val').toggleClass('activate');
        $('.min-max').parent('.custom-col').removeClass('z-ind')
        $('.dropMax').removeClass('open')
        $('.innerBudget').find('.range-toggle-in').addClass('hided');
    })
    $('.custom-col .min-max span.selected-val').on('click', function() {
        // $('.bootstrap-select  div.dropdown-menu').removeClass('open');
        $('.btn-group.bootstrap-select ').removeClass('open');
        $('.innerBudget').find('.range-toggle-in').addClass('hided');
    })




    $('.advFinlt a, .more-inner-col').on('click', function() {
        console.log($('.innerBudget ul.min-dropdown'));
        $('.innerBudget ul.range-toggle-in').addClass('hided');
    })

    $('.innerBudget .inputwrap input').on('focus', function(){
        $(this).parents('.parameter-dropdown').find('.range-toggle-in').addClass('hided');
        $(this).parents('.inputwrap').next('.range-toggle-in').removeClass('hided');
        $(this).parents('.inputwrap').next('.range-toggle-in').removeClass('hided');
        $('.btn-group.bootstrap-select ').removeClass('open');
        $('.min-max').parent('.custom-col').removeClass('z-ind')
        $('.dropMax').removeClass('open')
     });
    //  $('.innerBudget .inputwrap input').on('blur', function(){
    //     $(this).parents('.parameter-dropdown').find('.range-toggle-in').addClass('hided');
    // })

    $(".custom-col h4 , .budget .dropMax, .innerBudget.more-inner-col .parameter-dropdown").on("click", function(event){
        event.stopPropagation();
    });

     $('.max-parameter ul li').on('click', function(){
         $(this).parent().addClass('hided')
     })
     $(".innerBudget .budget .dropMax").on("click", function(event){
        event.stopPropagation();
    });

     $(document, '.custom-col, .custom-col h4').on('click', function(){
        $('.innerBudget').find('.range-toggle-in').addClass('hide');
     })
}

$('.videoSection .owl-carousel').owlCarousel({
    autoplay: false,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    loop:($(".owl-carousel .item").length > 4) ? true: false,
    margin: 20,
    responsiveClass: true,
    nav: true,
    lazyLoad: true,
    singleItem: true,
    responsive: {
      0: {
        items: 1,
        loop:($(".owl-carousel .item").length > 1) ? true: false,
      },
      568: {
        items: 2,
        loop:($(".owl-carousel .item").length > 2) ? true: false,
      },
      600: {
        items: 3,
        loop:($(".owl-carousel .item").length > 3) ? true: false,
      },
      1000: {
        items: 4
      }
    }
  })
  $(document).ready(function() {
    $('.popup-youtube').magnificPopup({
      disableOn: 320,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: true,
      gallery: {
        enabled: true
      }
    });
    // $('.popup-youtube').click(function(e){
    //     e.preventDefault();
    //     $('#vidModal').modal('show');
    //   });
  });



//load
/* document.onreadystatechange = function () {
    var state = document.readyState
    if (state == 'interactive') {
         document.getElementById('contents').style.visibility="hidden";
    } else if (state == 'complete') {
        setTimeout(function(){
           document.getElementById('interactive');
           document.getElementById('load').style.visibility="hidden";
           document.getElementById('contents').style.visibility="visible";
        },1000);
    }
  } */

