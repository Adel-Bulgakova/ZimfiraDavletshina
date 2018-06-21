import $ from 'jquery';
import jQuery from 'jquery';

import '../libs/supersized-loader';
import '../libs/lightgallery/js/lightgallery.min';

function footer(a) {
    var d = $("header.main-header");
    var c = d.outerHeight(true);
    $(".content-wrapper").css("padding-top", c);
    if (d.css("position") !== "fixed") {
        $(".content-wrapper").css("margin-top", -c)
    } else {
        $(".content-wrapper").css("margin-top", 0)
    }
    var b = $("footer").outerHeight(true);
    if (a) {
        $(".content-wrapper").css("margin-bottom", -b).css("padding-bottom", b)
    }
}

function collageScrollTo(a) {
    var b = a.offset().top;
    var c = $("header.main-header");
    if (c.css("position") === "fixed") {
        b -= c.outerHeight(true)
    }
    $("html, body").stop().animate({
        scrollTop: b
    })
}

$(document).ready(function() {
    if (typeof images !== 'undefined') {


        $(".header-announcement").append('<div id="supersized-loader"></div><ul id="supersized"></ul>');
        $(".container.outside").css("width", "100%");


        $("body > .main-header").wrap($('<div class="homepage-header-wrapper">').css("height", "100%"));
        $(".content-wrapper").css("min-height", 0);

        $("#supersized").supersized({
            autoplay: true,
            slide_interval: 4000,
            transition: 1,
            new_window: false,
            horizontal_center: 1,
            slides: images,
            slide_links: 'name'
        });

        $(window).on("scroll", function(f) {
            if ($(document).scrollTop() > $(this).height() / 8) {
                $("#view-more-block").fadeOut()
            } else {
                $("#view-more-block").fadeIn()
            }
        });
    }

    if ($("#screen-featured-works").length > 0) {
        var $gallery = $("#screen-featured-works");

        $gallery.lightGallery({
            actualSize: false,
            autoplay: false,
            download: false,
            hash: true,
            googlePlus: false,
            thumbnail: false,
            selector: '.entry',
            subHtmlSelectorRelative: true
        });
    }

    if (!!("ontouchstart" in window)) {
        $("body").addClass("touch-device")
    }
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        $("body").addClass("ios")
    }
    $(window).on("load resize", function() {
        footer();
    });

    if ($("body").hasClass("ios") && $("body").css("background-attachment") === "fixed") {
        $('<div id="iosFakeBackground">').css({
            backgroundColor: $("body").css("background-color"),
            backgroundImage: $("body").css("background-image"),
            backgroundPosition: $("body").css("background-position"),
            backgroundRepeat: $("body").css("background-repeat"),
            backgroundSize: $("body").css("background-size")
        }).prependTo($("body").css("background", "transparent"))
    }

    $("nav.mobile .menu").click(function(f) {
        f.preventDefault();
        $(this).siblings().toggle();
        var slidecaption = $("body").find("#slidecaption");
        slidecaption.hasClass("hidden") ? slidecaption.removeClass("hidden") : slidecaption.addClass("hidden")
    });

    $("#view-more-block a").click(function (f) {
        var d = $($(this).attr("href"));
        if (d.length === 0) {
            return
        }
        f.preventDefault();
        collageScrollTo(d);
    });

    $("#back-to-top").click(function (f) {
        f.preventDefault();
        $("html, body").animate({
            scrollTop: 0
        })
    });

    $(window).scroll(function(f) {
        var d = $("#back-to-top");
        if (d.length === 0) {
            return
        }
        if ($(this).scrollTop() > 100) {
            d.fadeIn()
        } else {
            d.fadeOut()
        }
    });

    $(window).on("load", function() {
        $(this).trigger("resize");
        $(this).trigger("resizeEnd")
    });
    $(window).resize(function() {
        if (this.resizeTO) {
            clearTimeout(this.resizeTO)
        }
        this.resizeTO = setTimeout(function() {
            $(this).trigger("resizeEnd")
        }, 50)
    });

});

import '../css/main.css';