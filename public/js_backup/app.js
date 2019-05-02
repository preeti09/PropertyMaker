$(function () {
    'use strict';

    /* Animate loader off screen */
    jQuery(window).load(function () {
        jQuery('body').addClass('loaded');
    });

    /* niceScroll */
    $(function () {
        $("html").niceScroll({
            scrollspeed: 80,
            mousescrollstep: 80,
            cursorwidth: 6,
            cursorborder: 0,
            cursorcolor: '#6c6c6c', // color
            autohidemode: false,
            zindex: 9999999,
            horizrailenabled: false,
            cursorborderradius: 0,
            autohidemode: "true",
        });
    });
    $("html").mouseover(function () {
        $("html").getNiceScroll().resize();
    });


    // Showing page loader
    $(window).load(function () {
        setTimeout(function () {
            $(".page_loader").fadeOut("fast");
        }, 100)
        $('link[id="style_sheet"]').attr('href', '/css/skins/default.css');
        //        $('.logo img').attr('src', '/img/logos/logo.png');

        // Filterizr initialization
        if ($('.filtr-container').length > 0) {
            $(function () {
                $('.filtr-container').filterizr({
                    delay: 1
                });
            });
        }

        $('.filters-listing-navigation li').click(function () {
            $('.filters-listing-navigation .filtr').removeClass('active');
            $(this).addClass('active');
        });
    });

    // WOW animation library initialization
    var wow = new WOW({
        animateClass: 'animated',
        offset: 100,
        mobile: false
    });
    wow.init();

    // Banner slider
    (function ($) {
        //Function to animate slider captions
        function doAnimations(elems) {
            //Cache the animationend event in a variable
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function () {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function () {
                    $this.removeClass($animationType);
                });
            });
        }

        //Variables on page load
        var $myCarousel = $('#carousel-example-generic')
        var $firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        //Initialize carousel
        $myCarousel.carousel();

        //Animate captions in first slide on page load
        doAnimations($firstAnimatingElems);
        //Pause carousel
        $myCarousel.carousel('pause');
        //Other slides to be animated on carousel slide event
        $myCarousel.on('slide.bs.carousel', function (e) {
            var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
            doAnimations($animatingElems);
        });
        $('#carousel-example-generic').carousel({
            interval: 3000,
            pause: "false"
        });
    })(jQuery);

    // Page scroller initialization.
    $.scrollUp({
        scrollName: 'page_scroller',
        scrollDistance: 300,
        scrollFrom: 'top',
        scrollSpeed: 500,
        easingType: 'linear',
        animation: 'fade',
        animationSpeed: 200,
        scrollTrigger: false,
        scrollTarget: false,
        scrollText: '<i class="fa fa-chevron-up"></i>',
        scrollTitle: false,
        scrollImg: false,
        activeOverlay: false,
        zIndex: 2147483647
    });

    // Counter
    function isCounterElementVisible($elementToBeChecked) {
        var TopView = $(window).scrollTop();
        var BotView = TopView + $(window).height();
        var TopElement = $elementToBeChecked.offset().top;
        var BotElement = TopElement + $elementToBeChecked.height();
        return ((BotElement <= BotView) && (TopElement >= TopView));
    }

    $(window).scroll(function () {
        $(".counter").each(function () {
            var isOnView = isCounterElementVisible($(this));
            if (isOnView && !$(this).hasClass('Starting')) {
                $(this).addClass('Starting');
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 3000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            }
        });
    });

    // Range sliders initialization
    $(".range-slider-ui").each(function () {
        var minRangeValue = $(this).attr('data-min');
        var maxRangeValue = $(this).attr('data-max');
        var minName = $(this).attr('data-min-name');
        var maxName = $(this).attr('data-max-name');
        var unit = $(this).attr('data-unit');

        $(this).append("" +
            "<span class='min-value'></span> " +
            "<span class='max-value'></span>" +
            "<input class='current-min' type='hidden' name='" + minName + "'>" +
            "<input class='current-max' type='hidden' name='" + maxName + "'>"
        );
        $(this).slider({
            range: true,
            min: minRangeValue,
            max: maxRangeValue,
            values: [minRangeValue, maxRangeValue],
            slide: function (event, ui) {
                event = event;
                var currentMin = parseInt(ui.values[0]);
                var currentMax = parseFloat(ui.values[1]);
                $(this).children(".min-value").text(currentMin + " " + unit);
                $(this).children(".max-value").text(currentMax + " " + unit);
                $(this).children(".current-min").val(currentMin);
                $(this).children(".current-max").val(currentMax);
            }
        });

        var currentMin = parseInt($(this).slider("values", 0));
        var currentMax = parseFloat($(this).slider("values", 1));
        $(this).children(".min-value").text(currentMin + " " + unit);
        $(this).children(".max-value").text(currentMax + " " + unit);
        $(this).children(".current-min").val(currentMin);
        $(this).children(".current-max").val(currentMax);
    });

    // Select picket
    $('.selectpicker').selectpicker();

    // Search option's icon toggle
    $('.search-options-btn').click(function () {
        $('.search-contents').toggleClass('show-search-area');
        $('.search-options-btn .fa').toggleClass('fa-chevron-down');
    });

    // Carousel with partner initialization
    (function () {
        $('#ourPartners').carousel({
            interval: 3600
        });
    }());

    (function () {
        $('.our-partners .item').each(function () {
            var itemToClone = $(this);
            for (var i = 1; i < 4; i++) {
                itemToClone = itemToClone.next();
                if (!itemToClone.length) {
                    itemToClone = $(this).siblings(':first');
                }
                itemToClone.children(':first-child').clone()
                    .addClass("cloneditem-" + (i))
                    .appendTo($(this));
            }
        });
    }());

    // Background video playing script
    $(document).ready(function () {
        $(".player").mb_YTPlayer();
    });

    // Multilevel menuus
    $('[data-submenu]').submenupicker();

    // Expending/Collapsing advance search content
    $('.show-more-options').click(function () {
        if ($(this).find('.fa').hasClass('fa-minus-circle')) {
            $(this).find('.fa').removeClass('fa-minus-circle');
            $(this).find('.fa').addClass('fa-plus-circle');
        } else {
            $(this).find('.fa').removeClass('fa-plus-circle');
            $(this).find('.fa').addClass('fa-minus-circle');
        }
    });

    var videoWidth = $('.sidebar-widget').width();
    var videoHeight = videoWidth * .61;
    $('.sidebar-widget iframe').css('height', videoHeight);

    // Dropzone initialization
    Dropzone.autoDiscover = false;

    // Only accept Images
    $(function () {
        $("div#ImageDropZone").dropzone({
            url: "/file-upload/image_upload",
            acceptedFiles: 'image/*',
            maxFiles: 10,
            paramName: 'image_uploads',
            init: function () {
                this.on("complete", function (data) {
                    if (data.xhr) {
                        var image_obj = JSON.parse(data.xhr.responseText)[0];
                        var path = image_obj.location;
                        $('#gellery_images').val($('#gellery_images').val() + ',' + path);
                    }
                });
                this.on("maxfilesexceeded", function (data) {
                    this.removeFile(data);
                });

            }
        });
    });

    $(function () {
        $("div#ImageDropZone_plots_0").dropzone({
            url: "/file-upload/image_upload",
            acceptedFiles: 'image/*',
            maxFiles: 10,
            paramName: 'image_uploads',
            init: function () {
                this.on("complete", function (data) {
                    if (data.xhr) {
                        var image_obj = JSON.parse(data.xhr.responseText)[0];
                        var path = image_obj.location;
                        $('#plot_image_0').val($('#plot_image_0').val() + ',' + path);
                    }
                });
                this.on("maxfilesexceeded", function (data) {
                    this.removeFile(data);
                });

            }
        });
    });
    $(function () {
        $("#brochure").dropzone({
            url: "/file-upload/brochure_upload",
            acceptedFiles: 'image/*',
            maxFiles: 1,
            paramName: 'brochure_uploads',
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
    });

    // Accept Video
    $(function () {
        $("#VideoDropZone").dropzone({
            url: "/file-upload/video_upload",
            acceptedFiles: 'video/*',
            maxFiles: 10,
            paramName: 'video_uploads',
            init: function () {
                this.on("complete", function (data) {
                    if (data.xhr) {
                        var video_obj = JSON.parse(data.xhr.responseText)[0];
                        var path = video_obj.location;
                        $('#gellery_video').val($('#gellery_video').val() + ',' + path);
                    }
                });
                this.on("maxfilesexceeded", function (data) {
                    this.removeFile(data);
                });
            }
        });
    });

    // SO something in mega menu
    jQuery(document).on('click', '.mega-dropdown', function (e) {
        e.stopPropagation()
    })

    // Magnify activation
    $('.property-magnify-gallery').each(function () {
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    $('.portfolio-item').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled: true
        }
    });


    // Modal activation
    $('.property-video').on('click', function () {
        $('#propertyModal').modal('show');
    });


    resizeModalsContent();

    function resizeModalsContent() {
        var winWidth = $(window).width();
        var videoWidth = 450;
        if (winWidth < 992 && winWidth > 767) {
            videoWidth = 600;
        } else if (winWidth <= 768) {
            videoWidth = winWidth - 20;
        }

        var ratio = .6666;
        var videoHeight = videoWidth * ratio;
        $('.modalIframe').css('height', videoHeight);
    }


    function toggleChevron(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".fa")
            .toggleClass('fa-minus fa-plus');
    }

    $('.panel-group').on('shown.bs.collapse', toggleChevron);
    $('.panel-group').on('hidden.bs.collapse', toggleChevron);

    // Switching Color schema
    $('.color-plate').on('click', function () {
        var name = $(this).attr('data-color');
        $('link[id="style_sheet"]').attr('href', '/css/skins/' + name + '.css');
        if (name == 'default') {
            $('.logo img').attr('src', '/img/logos/logo.png');
        } else {
            $('.logo img').attr('src', '/img/logos/' + name + '-logo.png');
        }
    });

    $('.setting-button').on('click', function () {
        $('.option-panel').toggleClass('option-panel-collased');
    });

    $(window).resize(function () {
        resizeModalsContent();
    });
});

// mCustomScrollbar initialization
(function ($) {
    $(window).resize(function () {
        $('#map').css('height', $(this).height() - 110);
        if ($(this).width() > 768) {
            $(".map-content-sidebar").mCustomScrollbar({
                theme: "minimal-dark"
            });
            $('.map-content-sidebar').css('height', $(this).height() - 110);
        } else {
            $('.map-content-sidebar').mCustomScrollbar("destroy"); //destroy scrollbar
            $('.map-content-sidebar').css('height', '100%');
        }
    }).trigger("resize");
})(jQuery);

// Placeholder remove on focus
$('input,textarea').focus(function () {
    $(this).data('placeholder', $(this).attr('placeholder'))
        .attr('placeholder', '');
}).blur(function () {
    $(this).attr('placeholder', $(this).data('placeholder'));
});
$('.show-map').click(function () {
    var sectionTo = $(this).attr('href');
    $('html, body').animate({
        scrollTop: $(sectionTo).offset().top
    }, 1500);
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 200) {
        $(".fixed-top").addClass("darkHeader");
    } else {
        $(".fixed-top").removeClass("darkHeader");

    }
});
// Search option's icon toggle
$('.show-more-options').click(function (e) {
    e.stopImmediatePropagation();
    if ($(this).parents('.map-div').hasClass('col-lg-6')) {
        $(this).html('<i class="fa fa-minus-circle"></i> Less Map');
        setCookie('map_resize', 1, 1);
        $(this).parents('.map-div').removeClass('col-lg-6').addClass('col-lg-9');
        $('.map-content-sidebar').removeClass('col-lg-6').addClass('col-lg-3');
        $('.map-properties-list').addClass('full-width');
        /*$('.map-properties-list').addClass('list').removeClass('grid');
        $('a.change-view-btn').removeClass('active-view-btn');
        $('a.change-view-btn:first-child').addClass('active-view-btn');*/
    } else {
        $(this).html('<i class="fa fa-plus-circle"></i> More Map');
        setCookie('map_resize', 0, 1);
        $(this).parents('.map-div').removeClass('col-lg-9').addClass('col-lg-6');
        $('.map-content-sidebar').removeClass('col-lg-3').addClass('col-lg-6');
        $('.map-properties-list').removeClass('full-width');
        //          $('.map-properties-list').addClass('grid').removeClass('list');
    }
});

function checkGrid($this) {
    if ($('.map-div').hasClass('col-lg-6')) {
        $('.map-properties-list').removeClass('full-width');
        /*$('.map-properties-list').addClass('grid').removeClass('list');*/
    } else {
        $('.map-properties-list').addClass('full-width');
    }
    if ($this.attr('data-target') == "grid") {
        $('.map-properties-list').addClass('grid').removeClass('list');
    } else {
        $('.map-properties-list').addClass('list').removeClass('grid');
    }
}
$('.change-view-btn').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if ($this.hasClass('active-view-btn')) {
        checkGrid($this);
    } else {
        $('.change-view-btn').removeClass('active-view-btn');
        $this.addClass('active-view-btn');
        checkGrid($this);
    }
});



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
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
            if (arr[i][key].substr(0, val.length).toUpperCase() == val.toUpperCase() && $.inArray(arr[i][key], check_inArr) == -1) {
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

                b.style.whiteSpace = 'nowrap';
                var att = document.createAttribute("title");
                att.value = arr[i][key]; // Set the value of the href attribute
                b.setAttributeNode(att);


                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    if (key == 'Area') {
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
                console.log(res);
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

function saveAsFavourite(data) {

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/save-as-favourite',

        success: function (res) {
            console.log(res);
        }
    });
}
/* Change Property type select */
function changePropertyType(val) {
    
    var unit = '';
    for(var i=0; i < propertyType.length;i++){
        if(propertyType[i].ID == val){
            unit = propertyType[i].UnitIdentifier;
        }
    }
    

    if (typeof propertyCategory != 'undefined') {
        
        var html = '<option value="">Select</option>';
        for (var i = 0; i < propertyCategory.length; i++) {
            if (propertyCategory[i].PropertyTypeID == val) {
                html += '<option value="' + propertyCategory[i].ID + '">' + propertyCategory[i].PropertyTypeChild + '</option>';
            }
        }
        $('#PropertyTypeChildID').html(html);
        if(html == '<option value="">Select</option>'){
            $('#PropertyTypeChildID').attr('disabled',true);
        }else{
            $('#PropertyTypeChildID').attr('disabled',false);
        }

        $('.asking_price, .search_price').attr('placeholder', 'INR/' + unit);

        $('#PropertyTypeChildID, #search_price_unit').selectpicker('refresh');
    }
    
    $(".propertyCategory, div.additional-info, div.amenities, div.specification").hide();
    if(val == 2){
        $('.Residential').show();
    }else{
        $('.Residential').hide();
    }
    $('#UnitDetails').hide();
    $('#facing').show();
    /*$('.amenities').hide();
    $('.specification').hide();*/
    
}

function changePropertyCategory(val) {
    var check = ['New_Approved_Layout', 'Apartment', 'Gated_Community', 'Villas'];
    var st = $("input[name='ResaleProperty']:checked").val();
    for (var i = 0; i < propertyCategory.length; i++) {
        if (propertyCategory[i].ID == val){
            var targID = propertyCategory[i].PropertyTypeChild.split(' ').join('_');
        }
    }
    
    $(".propertyCategory, div.additional-info").hide();
    $('.' + targID).show();
    
    if(st == 'false' && $.inArray(targID,check) > -1){
        $('.Launch_Possession').show();
    }else{
        $('.Launch_Possession').hide();
    }
    
    if (typeof Amenities != 'undefined') {
        var amenities_html = '';
        for (var i = 0; i < Amenities.length; i++) {

            if (Amenities[i].PropertyTypeChildID == parseInt(val)) {

                amenities_html += '<div class="checkbox checkbox-theme checkbox-circle col-lg-3 col-sm-3 col-xs-12">\
                                        <input id="' + Amenities[i].Amenity + '" value="' + Amenities[i].ID + '" type="checkbox" name="amenities">\
                                        <label for="' + Amenities[i].Amenity + '">\
                                            ' + Amenities[i].Amenity + '\
                                        </label>\
                                    </div>'
            }
        }
        if (amenities_html) {
            $('.amenities').show();
            $('#amenities').html(amenities_html);
        } else {
            $('.amenities').hide();
        }
    }
    if (typeof specifications != 'undefined') {
        var specification_html = '';
        for (var i = 0; i < specifications.length; i++) {
            if (specifications[i].PropertyTypeChildID == parseInt(val)) {
                specification_html = '<div class="form-elem">\
                    <div class="form-group">\
                        <label>' + specifications[i].Specification + '</label>\
                        <input type="text" class="input-text" name="spec_' + specifications[i].Specification + '" placeholder="' + specifications[i].Specification + '" >\
                    </div>\
                </div>';
            }
        }
        if (specification_html) {
            $('.specification').show();
            $('#specification').html(specification_html);
        } else {
            $('.specification').hide();
        }
    }

}

function changeCity(val) {
    var area = [];
    var area_html = '<option value="">Select</option>';
    for (var i = 0; i < cityArea.length; i++) {
        if (cityArea[i].CityID == val) {
            area_html += '<option value="' + cityArea[i].ID + '">' + cityArea[i].Area + '</option>';
            area.push(cityArea[i]);
        }
    }
    if($('#area').length == 1){
        autocomplete(document.getElementById("area"),area ,'Area');
    }
    /*$('#areaId').html(area_html);
    $('#areaId').selectpicker('refresh');
*/
}
function changeCountryCode(val){
    for(var i=0; i < Countries.length; i++){
        if(val == Countries[i].ISDCode){
            $('#Country').val(Countries[i].CountryName).selectpicker('refresh');
        }
    }
}

function sortObjByKey(obj, key) {
    obj.sort(function (a, b) {
        return a[key] - b[key];
    });
    return obj;
}
