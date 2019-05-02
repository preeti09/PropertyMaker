$(function () {
    'use strict';
    $('.js-filter-btn').on('click', function(e){
        if ($(this).next('.js-dd').hasClass('open')){
            $('.js-dd').removeClass('open');
            $('.js-filter-btn').removeClass('activated');
        }else{
            $('.js-dd').removeClass('open');
            $('.js-filter-btn').removeClass('activated');
            $(this).next('.js-dd').addClass('open');
            $(this).addClass('activated');
        }
    });
    $('.inputwrap input').on('focus', function(e){
        $(this).parents('.parameter-dropdown').find('.range-toggle-in').addClass('hide');
        $(this).parents('.inputwrap').next('.range-toggle-in').removeClass('hide');
        $(this).parents('.inputwrap').next('.range-toggle-in').removeClass('hided');
    })
    // $(window).scroll(function() {
    //     $('.mob-filter-wrap').addClass('hideMobFilter');
    //     setTimeout(function() {
    //         $('.mob-filter-wrap').removeClass('hideMobFilter');
    //     }, 3000)
    // })
      //----------------- UI Functions Start --------------------
		$('.filter-toggle').on('click', function(){
			if ($(this).hasClass('filter-open')){
				$('.filter-toggle.filter-close').removeClass('hidden');
				$('.filter-toggle.filter-open').addClass('hidden');
				$('#filterwrapper').removeClass('active');
			} else {
				$('.filter-toggle.filter-close').addClass('hidden');
				$('.filter-toggle.filter-open').removeClass('hidden');
				$('#filterwrapper').addClass('active');
			}
        });
        if($(window).width() < 768){
        // if($(window).width() < 768 && $('.filterwrapper').hasClass('amplots')){
            $('.filterwrapper.mobHide').remove();
            $('.map-options.mobHide').remove();
        }else{
            $('.filterwrapper.tabHide').remove();
            $('.map-options.tabHide').remove();
        }
 /* Change Property type select */   
   /* $("#Type").change ( function () {
        var targID  = ($(this).val()).split(" ");
        $(".propertyCategory, div.additional-info").hide ();
        $('.' + targID[0]).show ();
   }); */  
/* Animate loader off screen */
    jQuery(window).load(function() {
        jQuery('body').addClass('loaded');
    });
    
    /* niceScroll */
   /* $(function() {  
          $("html").niceScroll({
            scrollspeed: 80,
            mousescrollstep: 80,
            cursorwidth: 6,
            cursorborder: 0,
            cursorcolor: '#373f47', // color
            autohidemode: false,
            zindex: 9999999,
            horizrailenabled: false,
            cursorborderradius: 0,
            autohidemode:"true",
          });
      }); 
    $("html").mouseover(function() {
      $("html").getNiceScroll().resize();
    });*/
    

    // Showing page loader
    var fltr ;
    $(window).load(function () {
        setTimeout(function () {
            $(".page_loader").fadeOut("fast");
        }, 100)

        $('link[id="style_sheet"]').attr('href', 'css/skins/default.css');
        $('.logo img').attr('src', '/img/logos/logo.png');

        // Filterizr initialization
        initfilterize();
        // $('.destroy-filtr-container').filterizr('destroy')

        $('.activeClass li').click(function() {
            $(this).parents(".activeClass").children().removeClass('active');
            $(this).addClass('active');
            if($('.filtr-container').length > 0) {
                $(".filtr-container .filtr-item").each(
                    function() {
                        $(this).css("z-index", "").addClass('posAbs');
                        if($(this)[0].style.opacity == "1"){
                            $(this).css("z-index", "1");
                            $(this).css("z-index", "").removeClass('posAbs');
                            if($(this).data("category") == 4){
                                $(".onmaphiden").hide();
                            }else{
                                $(".onmaphiden").show();
                            } 
                        }  
                    }
                );
            }
        });
        $('.display-toggle li a').click(function(e) {
            e.preventDefault();
            var $togopt = $(this).data("displaytoggle");

            $('.filtr-item').removeClass('grid-opt list-opt b-list-opt map-opt');
            $('body').removeClass('mapdata-show');
            $(".filter-content .filtr-container").getNiceScroll().remove();
            
            //hide filter when change property display start
            if ($('.filtertoggle').attr("aria-expanded") == "true"){
              $('.filtertoggle').trigger('click');
            }
            //hide filter when change property display end
            if($togopt == "grid-opt"){
                //console.log('1');   
                $('.filtr-item').addClass('grid-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 350);
            } 
            else if($togopt == "list-opt"){
                //console.log('2');
                $('.filtr-item').addClass('list-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 350);
            } 
            else if($togopt == "b-list-opt"){
                //console.log('4');
                $('.filtr-item').addClass('b-list-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 350);
            } 
            else if($togopt == "map-opt"){

                $('body').addClass('mapdata-show');
                $('.filtr-item').addClass('b-list-opt');
    
                setTimeout(function(){
                    $(window).trigger('resize'); 
                    $(".filter-content .filtr-container").niceScroll({
                        scrollspeed: 180,
                        mousescrollstep: 80,
                        cursorwidth: 3,
                        cursorborder: 0,
                        cursorcolor: '#373f47', // color
                        autohidemode: false,
                        zindex: 9,
                        horizrailenabled: false,
                        cursorborderradius: 0,
                        autohidemode:"true",
                      });

                }, 250);
            }
        });
    });

    // WOW animation library initialization
    var wow = new WOW(
        {
            animateClass: 'animated',
            offset: 100,
            mobile: false
        }
    );
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
        scrollText: '<i class="lnr lnr-arrow-up"></i>',
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
        var minRangeValue = (parseInt($(this).attr('data-min')));
        var maxRangeValue = (parseInt($(this).attr('data-max')));
        var minName = $(this).attr('data-min-name');
        var maxName = $(this).attr('data-max-name');
        var unit = $(this).attr('data-unit');
        $(this).append("" +
            "<span class='min-value'></span> " +
            "<span class='max-value'></span>" +
            "<input class='current-min' type='hidden' name='"+minName+"'>" +
            "<input class='current-max' type='hidden' name='"+maxName+"'>"
        );
        
        
        $(this).slider({
            range: true,
            step: 1000000,
            min: minRangeValue,
            max: maxRangeValue,
            values: [minRangeValue, maxRangeValue],
            slide: function (event, ui) {
                event = event;
                var currentMin = parseInt(ui.values[0]);
                var currentMax = parseFloat(ui.values[1]);
                var currentMin1 = parseInt(ui.values[0]) + " " + unit;
                var currentMax1 = parseFloat(ui.values[1]) + " " + unit;
            
                $(this).children(".min-value").text(currencyFormat(currentMin));
                $(this).children(".max-value").text(currencyFormat(currentMax));
                $(this).children(".current-min").val(currentMin);
                $(this).children(".current-max").val(currentMax);
            }
        });

        var currentMin = parseInt($(this).slider("values", 0));
        var currentMax = parseFloat($(this).slider("values", 1));
        $(this).children(".min-value").text(currencyFormat(currentMin));
        $(this).children(".max-value").text(currencyFormat(currentMax));
        $(this).children(".current-min").val(currentMin);
        $(this).children(".current-max").val(currentMax);
        
    });

    //Plot Slider
    $(".range").each(function () {
        var minRangeValue = (parseInt($(this).attr('data-min')));
        var maxRangeValue = (parseInt($(this).attr('data-max')));
        var minName = $(this).attr('data-min-name');
        var maxName = $(this).attr('data-max-name');
        var unit = $(this).attr('data-unit');
        $(this).append("" +
            "<span class='min-value'></span> " +
            "<span class='max-value'></span>" +
            "<input class='current-min' type='hidden' name='"+minName+"'>" +
            "<input class='current-max' type='hidden' name='"+maxName+"'>"
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
                var currentMin1 = parseInt(ui.values[0]) + " " + unit;
                var currentMax1 = parseFloat(ui.values[1]) + " " + unit;
                $(this).children(".min-value").text( currentMin1);
                $(this).children(".max-value").text(currentMax1);
                $(this).children(".current-min").val(currentMin);
                $(this).children(".current-max").val(currentMax);
            }
        });

        var currentMin = parseInt($(this).slider("values", 0));
        var currentMax = parseFloat($(this).slider("values", 1));
        $(this).children(".min-value").text( currentMin + " " + unit);
        $(this).children(".max-value").text(currentMax + " " + unit);
        $(this).children(".current-min").val(currentMin);
        $(this).children(".current-max").val(currentMax);
    });



    // Select picker
    $('.selectpicker').selectpicker();

    // Search option's icon toggle
    $('.search-options-btn').click(function () {
        $('.search-contents').toggleClass('show-search-area');
        $('.search-options-btn .fa').toggleClass('fa-chevron-down');
    });

    // Carousel with partner initialization
    (function () {
        $('#ourPartners').carousel({interval: 3600});
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
    // var videoHeight = videoWidth * .61;
    // $('.sidebar-widget iframe').css('height', videoHeight);

    // Dropzone initialization
    Dropzone.autoDiscover = false;

    // Only accept Images
    $(function () {
        $("div#ImageDropZone").dropzone({
            url: "/file-upload/image_upload",
            acceptedFiles: 'image/*',
            maxFiles: 10,
            maxFilesize: 5,
            timeout: 50000,
            resizeHeight: 400,
            resizeWidth: 400,
            thumbnailWidth:400,
            thumbnailHeight:400,
            parallelUploads: 1,
            uploadMultiple: false,
            paramName: 'image_uploads',
            addRemoveLinks: true,
            removedfile: function (file) {
                $('#gellery_images').val('');
                var _ref;
                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
            },
            init: function () {
                this.on("complete", function (data) {
                    if (data.xhr) {
                        var image_obj = JSON.parse(data.xhr.responseText)[0];
                        var path = image_obj.location;
                        $('.defaultSliderImage').remove();
                        $('.carousel-inner').find('.active').removeClass('active');
                        $('.carousel-inner').append('<div class="item active">\
                                    <img src="'+path+'" class="thumb-preview" alt="Chevrolet Impala">\
                                    </div>');
                        $('.carousel-indicators').append('<li data-target="#carousel-custom" data-slide-to="0" class=""><img src="'+path+'" alt="Chevrolet Impala"></li>');
                        
                        $('#gellery_images').val($('#gellery_images').val() + ',' + path);
                    }
                });
                this.on("maxfilesexceeded", function (data) {
                    this.removeFile(data);
                });
            },
           /*  transformFile: function(file, done) {
                var myDropZone = this;
                // Create the image editor overlay
                var editor = document.createElement('div');
                //var cancelCrop = document.getElementsByClassName("cancelCrop")
                var confirm = document.getElementById('crop');
                confirm.addEventListener('click', function() {
                    // Get the canvas with image data from Cropper.js
                    var canvas = cropper.getCroppedCanvas({
                        width: 256,
                        height: 256
                    });
                    // Turn the canvas into a Blob (file object without a name)
                    canvas.toBlob(function(blob) {
                        // Update the image thumbnail with the new image data
                        myDropZone.createThumbnail(
                            blob,
                            myDropZone.options.thumbnailWidth,
                            myDropZone.options.thumbnailHeight,
                            myDropZone.options.thumbnailMethod,
                            false, 
                            function(dataURL) {
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
                $( ".cancelCrop" ).each(function() {
                    $(this).on("click", function(){
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
                    zoomOnWheel:true
                });
        
            } */
        });
    });

    $(function () {
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
                $('#brochureUrl').val('');
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
    });

    // Accept Video
    $(function () {
        $("#VideoDropZone").dropzone({
            url: "/file-upload/video_upload",
            acceptedFiles: 'video/*',
            maxFiles: 10,
            maxFilesize: 50,
            paramName: 'video_uploads',
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
    jQuery(document).on('click', '.mega-dropdown', function(e) {
        e.stopPropagation()
    })

    // Magnify activation
    $('.property-magnify-gallery').each(function() {
        $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery:{enabled:true}
        });
    });

    $('.portfolio-item').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery:{enabled:true}
    });



    resizeModalsContent();
    function resizeModalsContent() {
        var winWidth = $(window).width();
        var videoWidth = 450;
        if(winWidth < 992 && winWidth > 767) {
            videoWidth = 600;
        } else if(winWidth <= 768) {
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
        $('link[id="style_sheet"]').attr('href', 'css/skins/' + name + '.css');
        if (name == 'default') {
            $('.logo img').attr('src', '/img/logos/logo.png');
        }
        else {
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

function initfilterize(){

    if($('.filtr-container').length > 0) {
        /* fltr =$('.filtr-container');
        if(fltr.parents('.submiit-property')){
            fltr.filterizr();
        }else{
            fltr.filterizr();                    
        } */
        $(function () {
            fltr =$('.filtr-container');
          //  console.log(fltr.parents('#save-property-details'));
            if(fltr.parents('#save-property-details').length){
                fltr.filterizr(
                {
                    delay: 1,
                    callbacks: {
                              onFilteringStart: function() {
                                // console.log("onFilteringStart")
                              },
                        onFilteringEnd: function() {
                                   // console.log('onFilteringEnd')
                                  }
                     },
                    filter: '1',
                });
                $(".filtr-container .filtr-item").each(
                    function() {
                        if($(this)[0].style.opacity == "1"){
                            $(this).css("z-index", "1");
                        }   
                    }
                );
            }else{
                
                fltr.filterizr({
                    delay: 1,
                    callbacks: {
                        onFilteringStart: function() {
                    //         console.log("onFilteringStart")
                        },
                        onFilteringEnd: function() {
                            // console.log('onFilteringEnd')
                        }
                    },
                    filter: 'all'
                });
            }
        });
    }

}

// mCustomScrollbar initialization
(function ($) {
    $(window).resize(function () {
        // $('#map').css('height', $(this).height() - 110);
        // if ($(this).width() > 768) {
        //     $(".map-content-sidebar").mCustomScrollbar(
        //         {theme: "minimal-dark"}
        //     );
        //     $('.map-content-sidebar').css('height', $(this).height() - 110);
        // } else {
        //     $('.map-content-sidebar').mCustomScrollbar("destroy"); //destroy scrollbar
        //     $('.map-content-sidebar').css('height', '100%');
        // }
        });
})(jQuery);

// Placeholder remove on focus
$('input,textarea').focus(function(){
   $(this).data('placeholder',$(this).attr('placeholder'))
          .attr('placeholder','');
}).blur(function(){
   $(this).attr('placeholder',$(this).data('placeholder'));
});
$('.show-map').click(function() {
    var sectionTo = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(sectionTo).offset().top
    }, 1500);
});

// Search option's icon toggle
    $('.show-more-options').click(function (e) {
        e.stopImmediatePropagation();
        if($(this).parents('.map-div').hasClass('col-lg-6')){
          $(this).html('<i class="fa fa-minus-circle"></i> Less Map');    
          $(this).parents('.map-div').removeClass('col-lg-6').addClass('col-lg-9');
          $('.map-content-sidebar').removeClass('col-lg-6').addClass('col-lg-3');
          $('.map-properties-list').addClass('full-width');
          /*$('.map-properties-list').addClass('list').removeClass('grid');
          $('a.change-view-btn').removeClass('active-view-btn');
          $('a.change-view-btn:first-child').addClass('active-view-btn');*/
        }
        else{
          $(this).html('<i class="fa fa-plus-circle"></i> More Map');
          $(this).parents('.map-div').removeClass('col-lg-9').addClass('col-lg-6');
          $('.map-content-sidebar').removeClass('col-lg-3').addClass('col-lg-6');
            $('.map-properties-list').removeClass('full-width');
//          $('.map-properties-list').addClass('grid').removeClass('list');
        }     
    });
function checkGrid($this){
    if($('.map-div').hasClass('col-lg-6')){
            $('.map-properties-list').removeClass('full-width');
            /*$('.map-properties-list').addClass('grid').removeClass('list');*/
        }
        else{
            $('.map-properties-list').addClass('full-width');
    }
    if($this.attr('data-target') == "grid"){
        $('.map-properties-list').addClass('grid').removeClass('list');
    }
    else{
       $('.map-properties-list').addClass('list').removeClass('grid');
    }
}
$('.change-view-btn').click(function (e) {
    e.preventDefault();
    $this = $(this);
    if($this.hasClass('active-view-btn')){   
      checkGrid($this);
    }
    else{
        $('.change-view-btn').removeClass('active-view-btn');
        $this.addClass('active-view-btn');
        checkGrid($this);
        /*if($('.map-div').hasClass('col-lg-6')){
          checkGrid($this);
          $('.change-view-btn').removeClass('active-view-btn');
          $this.addClass('active-view-btn');
            console.log('work4');
        }*/
    }     
});
// var $toggleheader = $('.toggle-header');
// var $toggleheaderpos = $toggleheader[0].offsetTop - ($('header').height() + 50);
$(".advancedFilter").click(function(){
    if ($(this).attr("aria-expanded") == "true"){
      $(this).html('show advanced filters <span class="caret"></span>');
    }
    else{
      $(this).html('hide advanced filters <span class="caret"></span>');
    }
});
// function checkposfilter(){
//     var scroll = $(window).scrollTop();
//     if ($('.filtertoggle').attr("aria-expanded") == "true"){
//         if(scroll >= $toggleheaderpos){
//             $toggleheader.addClass('toggle-fixed');  
//         }else{
//             $toggleheader.removeClass('toggle-fixed');
//         }
//     }else{
//             if(scroll >= 0){
//                 $toggleheader.addClass('toggle-fixed');  
//             }else{
//                 $toggleheader.removeClass('toggle-fixed');
//             }       
//     }
// }
$(window).scroll(function() {    
    //checkposfilter();
});

if ($('header').hasClass('innerpage')) {
    $(".fixed-top").addClass("darkHeader");
}else{
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();
        if (scroll >= 90 ) {
            $(".fixed-top").addClass("darkHeader");
        }else {
            $(".fixed-top").removeClass("darkHeader");
        
        }
    });
}
$('.modal').on("shown.bs.modal", function() {
    setTimeout(function(){
        $('body').addClass('modal-open').css('padding-right', '17px') 
    }, 1000); 
});
$(function() {
    $('[data-toggle="datepicker"]').datepicker({
        autoclose: true,
      zIndex: 2048,
      format:'dd/mm/yyyy',
      weekStart:0,
    });
    $('[data-toggle="yearpicker"]').datepicker({
        autoclose: true,
        zIndex: 2048,
        format:'yyyy',
        weekStart:0,
        minViewMode: 2
    });
});

$(document).ready(function(){ 
    $("#drop-val").on('click','.dropdown-menu a',function (){
        var floor = $(this).html();
        $('#floor-val ').text(floor)
    });
    /* $("#properyTitle").change(function(){
        $.ajax({url: "/submit-property/isTitleExists?title="+$(this).val(), success: function(result){
            console.log("result -------",result);
            if(result.status == 200){
                $(".properyTitleMsg").css({"display": "block"});
                $(".submit-button").prop("disabled", true);
            }else{
                $(".properyTitleMsg").css({"display": "none"});
                $(".submit-button").prop("disabled", false);
            }
        }});
    }); */
    
    $("#users-email").change(function(){ // CHECK EMAIL IS ALREADY EXISTS OT NOT
        $.ajax({url: "/login/checkEmailAvailability/?email="+$(this).val(), success: function(result){
            if(result.status == 200){
                $(".emailCheckMsg").css({"display": "block"});
                $(".submit-button").prop("disabled", true);
            }else{
                $(".emailCheckMsg").css({"display": "none"});
                $(".submit-button").prop("disabled", false);
            }
        }});
    });
    
    /*$(".confirm-password-match").change(function(){ // MATCH PASSWORD & CONFIRM PASSWORD
        var password = $("#mPassword").val()
        var confirmPassword = $("#confirm-password").val();
        if( (password && confirmPassword) && (password != confirmPassword) ){
            $(".confirmPasswordMsg").css({"display": "block"});
            $(".submit-button").prop("disabled", true);
        }else{
            $(".confirmPasswordMsg").css({"display": "none"});
            $(".submit-button").prop("disabled", false);
        }
    });*/
    $("body").on("click", function(e){
        if($(e.target).is("a[data-target = slidemenu]")) {
            e.preventDefault();
            if($(e.target).next('.slidemenu').hasClass('slide-down')){
                $('.slidemenu').removeClass('slide-down');
            }
            else{
                $('.slidemenu').removeClass('slide-down');
                $(e.target).next('.slidemenu').addClass('slide-down');
                $('.dropdown-menu-right').on('hide.bs.dropdown', function () {
                    return false;
                });
            }
        }else{
            $('.dropdown-menu-right').removeClass('open');
            $('.slidemenu').removeClass('slide-down');
        }                
   });
//    $('.property-video').on('click', function () {
//         $('#propertyModal').modal('show');
//   });
//   $(window).bind('orientationchange', function(event) {
//       console.log('yes');
//       if($(window).width() > 767 && $('body').hasClass("modal-open")){
//         console.log('working');
//         $('#filtertab').modal('hide');
//         $('#filtertoggle').attr("aria-expanded","false")
//         setTimeout(function(){ $(".advancedFilter").trigger('click') }, 2000);
//       }
//   });
});

