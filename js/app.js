$(function () {
    'use strict';
 /* Change Property type select */   
   $("#Type").change ( function () {
        var targID  = ($(this).val()).split(" ");
        $(".propertyCategory, div.additional-info").hide ();
        $('.' + targID[0]).show ();
   });  
/* Animate loader off screen */
    jQuery(window).load(function() {
        jQuery('body').addClass('loaded');
    });
    
    /* niceScroll */
    $(function() {  
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
    });
    

    // Showing page loader
    var fltr ;
    $(window).load(function () {
        // setTimeout(function () {
            $(".page_loader").fadeOut("fast");
        // }, 100)
        $('link[id="style_sheet"]').attr('href', 'css/skins/default.css');
        $('.logo img').attr('src', 'img/logos/logo.png');

        // Filterizr initialization
        if($('.filtr-container').length > 0) {
            $(function () {
                fltr =$('.filtr-container');
                if(fltr.parents('.submiit-property')){
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
                        }
                        
                    );
                    $(".filtr-container .filtr-item").each(
                        function() {
                            if($(this)[0].style.opacity == "1"){
                                $(this).css("z-index", "1");
                            }   
                        }
                    );
                }else{
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
                        }
                        
                    );
                }
            });
        }

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
            //console.log($togopt);
            if($togopt == "grid-opt"){
                //console.log('1');   
                $('.filtr-item').addClass('grid-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 250);
            } 
            else if($togopt == "list-opt"){
                //console.log('2');
                $('.filtr-item').addClass('list-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 250);
            } 
            else if($togopt == "b-list-opt"){
                //console.log('4');
                $('.filtr-item').addClass('b-list-opt');
                setTimeout(function(){$(window).trigger('resize'); }, 250);
            } 
            else if($togopt == "map-opt"){
                //console.log('3');
                $('body').addClass('mapdata-show');
                $('.filtr-item').addClass('b-list-opt');
                setTimeout(function(){
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
        var minRangeValue = $(this).attr('data-min');
        var maxRangeValue = $(this).attr('data-max');
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
                
                $(this).children(".min-value").text( currentMin + " " + unit);
                $(this).children(".max-value").text(currentMax + " " + unit);
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

    // Select picket
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
    var videoHeight = videoWidth * .61;
    $('.sidebar-widget iframe').css('height', videoHeight);

    // Dropzone initialization
    Dropzone.autoDiscover = false;

    // Only accept Images
    $(function () {
        $("div#ImageDropZone").dropzone({
            url: "/file-upload",
            acceptedFiles: 'image/*',
            maxFiles: 10,

            init: function () {
                this.on("complete", function (data) {
                    var res = eval('(' + data.xhr.responseText + ')');
                    $('#newImage').text(res.Message);
                });
                this.on("maxfilesexceeded", function (data) {
                    this.removeFile(data);
                });
            }
        });
    });

    // Accept Video
    $(function () {
        $("#VideoDropZone").dropzone({
            url: "/file-upload",
            acceptedFiles: 'video/*',
            maxFiles: 10,
            // createImageThumbnails:true,
            init: function () {
                this.on("complete", function (data) {
                    var res = eval('(' + data.xhr.responseText + ')');
                    $('#newImage').text(res.Message);
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


    // Modal activation
    $('.property-video').on('click', function () {
        $('#propertyModal').modal('show');
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
            $('.logo img').attr('src', 'img/logos/logo.png');
        }
        else {
            $('.logo img').attr('src', 'img/logos/' + name + '-logo.png');
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
            $(".map-content-sidebar").mCustomScrollbar(
                {theme: "minimal-dark"}
            );
            $('.map-content-sidebar').css('height', $(this).height() - 110);
        } else {
            $('.map-content-sidebar').mCustomScrollbar("destroy"); //destroy scrollbar
            $('.map-content-sidebar').css('height', '100%');
        }
        }).trigger("resize");
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
$(".filtertoggle").click(function(){
    if ($('.filtertoggle').attr("aria-expanded") == "true"){
      $(this).html('show advanced filters <span class="caret"></span>');
    }
    else{
      $(this).html('hide advanced filters <span class="caret"></span>');
      //$toggleheader.removeClass('toggle-fixed');
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
        if (scroll >= 200 ) {
            $(".fixed-top").addClass("darkHeader");
        }else {
            $(".fixed-top").removeClass("darkHeader");
        
        }
    });
}
$("a[data-toggle = modal]").click(function(){
    setTimeout(function(){
        $('body').addClass('modal-open').css('padding-right', '17px') 
    }, 1000); 
});
$(function() {
    $('[data-toggle="datepicker"]').datepicker({
      autoHide: true,
      zIndex: 2048,
      format:'dd/mm/yyyy',
      weekStart:0,
    });
  });
