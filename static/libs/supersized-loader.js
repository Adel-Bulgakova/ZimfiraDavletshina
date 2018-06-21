(function ($) {
    $.supersized = function(b) {
            var el = "#supersized"
              , base = this;
            base.$el = $(el);
            base.el = el;
            var vars = $.supersized.vars;
            base.$el.data("supersized", base);
            var api = base.$el.data("supersized");
            var loadSlide, imageLink;
            base.init = function() {
                $.supersized.vars = $.extend($.supersized.vars, $.supersized.themeVars);
                $.supersized.vars.options = $.extend({}, $.supersized.defaultOptions, $.supersized.themeOptions, b);
                base.options = $.supersized.vars.options;
                base._build()
            }
            ;
            base._build = function() {
                var g = 0, k = "", f = "", h, j = "", e;
                while (g <= base.options.slides.length - 1) {
                    switch (base.options.slide_links) {
                    case "num":
                        h = g;
                        break;
                    case "name":
                        h = base.options.slides[g].title;
                        break;
                    case "blank":
                        h = ""
                    }
                    k = k + '<li class="slide-' + g + '"></li>';
                    if (g == base.options.start_slide - 1) {
                        base.options.slide_links && (f = f + '<li class="slide-link-' + g + ' current-slide"><a>' + h + "</a></li>");
                        if (base.options.thumb_links) {
                            base.options.slides[g].thumb ? e = base.options.slides[g].thumb : e = base.options.slides[g].image;
                            j = j + '<li class="thumb' + g + ' current-thumb"><img src="' + e + '"/></li>'
                        }
                    } else {
                        base.options.slide_links && (f = f + '<li class="slide-link-' + g + '" ><a>' + h + "</a></li>");
                        if (base.options.thumb_links) {
                            base.options.slides[g].thumb ? e = base.options.slides[g].thumb : e = base.options.slides[g].image;
                            j = j + '<li class="thumb' + g + '"><img src="' + e + '"/></li>'
                        }
                    }
                    g++
                }
                base.options.slide_links && $(vars.slide_list).html(f);
                base.options.thumb_links && vars.thumb_tray.length && $(vars.thumb_tray).append('<ul id="' + vars.thumb_list.replace("#", "") + '">' + j + "</ul>");
                $(base.el).append(k);
                if (base.options.thumbnail_navigation) {
                    vars.current_slide - 1 < 0 ? prevThumb = base.options.slides.length - 1 : prevThumb = vars.current_slide - 1;
                    $(vars.prev_thumb).show().html($("<img/>").attr("src", base.options.slides[prevThumb].image));
                    vars.current_slide == base.options.slides.length - 1 ? nextThumb = 0 : nextThumb = vars.current_slide + 1;
                    $(vars.next_thumb).show().html($("<img/>").attr("src", base.options.slides[nextThumb].image))
                }
                base._start()
            }
            ;
            base._start = function() {
                base.options.start_slide ? vars.current_slide = base.options.start_slide - 1 : vars.current_slide = Math.floor(Math.random() * base.options.slides.length);
                var w = base.options.new_window ? ' target="_blank"' : "";
                base.options.performance == 3 ? base.$el.addClass("speed") : (base.options.performance == 1 || base.options.performance == 2) && base.$el.addClass("quality");
                if (base.options.random) {
                    arr = base.options.slides;
                    for (var g, k, x = arr.length; x; g = parseInt(Math.random() * x),
                    k = arr[--x],
                    arr[x] = arr[g],
                    arr[g] = k) {}
                    base.options.slides = arr
                }
                if (base.options.slides.length > 1) {
                    if (base.options.slides.length > 2) {
                        var loadPrev;
                        vars.current_slide - 1 < 0 ? loadPrev = base.options.slides.length - 1 : loadPrev = vars.current_slide - 1;
                        var e = base.options.slides[loadPrev].url ? "href='" + base.options.slides[loadPrev].url + "'" : ""
                          , v = $('<img src="' + base.options.slides[loadPrev].image + '"/>')
                          , r = base.el + " li:eq(" + loadPrev + ")";
                        v.appendTo(r).wrap("<a " + e + w + "></a>").parent().parent().addClass("image-loading prevslide");
                        v.on('load', function() {
                            $(this).data("origWidth", $(this).width()).data("origHeight", $(this).height());
                            base.resizeNow()
                        });
                    }
                } else {
                    base.options.slideshow = 0
                }
                e = api.getField("url") ? "href='" + api.getField("url") + "'" : "";
                var p = $('<img src="' + api.getField("image") + '"/>')
                  , j = base.el + " li:eq(" + vars.current_slide + ")";
                p.appendTo(j).wrap("<a " + e + w + "></a>").parent().parent().addClass("image-loading activeslide");
                p.on('load', function() {
                    base._origDim($(this));
                    base.resizeNow();
                    base.launch();
                    typeof theme != "undefined" && typeof theme._init == "function" && theme._init()
                });
                if (base.options.slides.length > 1) {
                    var loadNext;
                    vars.current_slide == base.options.slides.length - 1 ? loadNext = 0 : loadNext = vars.current_slide + 1;
                    e = base.options.slides[loadNext].url ? "href='" + base.options.slides[loadNext].url + "'" : "";
                    var q = $('<img src="' + base.options.slides[loadNext].image + '"/>')
                      , m = base.el + " li:eq(" + loadNext + ")";
                    q.appendTo(m).wrap("<a " + e + w + "></a>").parent().parent().addClass("image-loading");
                    q.on('load', function() {
                        $(this).data("origWidth", $(this).width()).data("origHeight", $(this).height());
                        base.resizeNow()
                    })
                }
                base.$el.css("visibility", "hidden");
                $(".load-item").hide();
            }
            ;
            base.launch = function() {
                base.$el.css("visibility", "visible");
                $("#supersized-loader").remove();
                // typeof theme != "undefined" && typeof theme.beforeAnimation == "function" && theme.beforeAnimation("next");
                $(".load-item").show();
                base.beforeAnimation();
                base.options.keyboard_nav && $(document.documentElement).keyup(function(f) {
                    if (vars.in_animation) {
                        return !1
                    }
                    if (f.keyCode == 37 || f.keyCode == 40) {
                        clearInterval(vars.slideshow_interval);
                        base.prevSlide()
                    } else {
                        if (f.keyCode == 39 || f.keyCode == 38) {
                            clearInterval(vars.slideshow_interval);
                            base.nextSlide()
                        } else {
                            if (f.keyCode == 32 && !vars.hover_pause) {
                                clearInterval(vars.slideshow_interval);
                                base.playToggle()
                            }
                        }
                    }
                });
                base.options.slideshow && base.options.pause_hover && $(base.el).hover(function() {
                    if (vars.in_animation) {
                        return !1
                    }
                    vars.hover_pause = !0;
                    if (!vars.is_paused) {
                        vars.hover_pause = "resume";
                        base.playToggle()
                    }
                }, function() {
                    if (vars.hover_pause == "resume") {
                        base.playToggle();
                        vars.hover_pause = !1
                    }
                });
                base.options.slide_links && $(vars.slide_list + "> li").click(function() {
                    index = $(vars.slide_list + "> li").index(this);
                    targetSlide = index + 1;
                    base.goTo(targetSlide);
                    return !1
                });
                base.options.thumb_links && $(vars.thumb_list + "> li").click(function() {
                    index = $(vars.thumb_list + "> li").index(this);
                    targetSlide = index + 1;
                    api.goTo(targetSlide);
                    return !1
                });
                if (base.options.slideshow && base.options.slides.length > 1) {
                    base.options.autoplay && base.options.slides.length > 1 ? vars.slideshow_interval = setInterval(base.nextSlide, base.options.slide_interval) : vars.is_paused = !0;
                    $(".load-item img").bind("contextmenu mousedown", function() {
                        return !1
                    })
                }
                $(window).resize(function() {
                    base.resizeNow()
                })
            }
            ;
            base.resizeNow = function() {
                return base.$el.each(function() {
                    $("img", base.el).each(function() {
                        function j(i) {
                            if (i) {
                                if (thisSlide.width() < k || thisSlide.width() < base.options.min_width) {
                                    if (thisSlide.width() * g >= base.options.min_height) {
                                        thisSlide.width(base.options.min_width);
                                        thisSlide.height(thisSlide.width() * g)
                                    } else {
                                        e()
                                    }
                                }
                            } else {
                                if (base.options.min_height >= f && !base.options.fit_landscape) {
                                    if (k * g >= base.options.min_height || k * g >= base.options.min_height && g <= 1) {
                                        thisSlide.width(k);
                                        thisSlide.height(k * g)
                                    } else {
                                        if (g > 1) {
                                            thisSlide.height(base.options.min_height);
                                            thisSlide.width(thisSlide.height() / g)
                                        } else {
                                            if (thisSlide.width() < k) {
                                                thisSlide.width(k);
                                                thisSlide.height(thisSlide.width() * g)
                                            }
                                        }
                                    }
                                } else {
                                    thisSlide.width(k);
                                    thisSlide.height(k * g)
                                }
                            }
                        }
                        function e(i) {
                            if (i) {
                                if (thisSlide.height() < f) {
                                    if (thisSlide.height() / g >= base.options.min_width) {
                                        thisSlide.height(base.options.min_height);
                                        thisSlide.width(thisSlide.height() / g)
                                    } else {
                                        j(!0)
                                    }
                                }
                            } else {
                                if (base.options.min_width >= k) {
                                    if (f / g >= base.options.min_width || g > 1) {
                                        thisSlide.height(f);
                                        thisSlide.width(f / g)
                                    } else {
                                        if (g <= 1) {
                                            thisSlide.width(base.options.min_width);
                                            thisSlide.height(thisSlide.width() * g)
                                        }
                                    }
                                } else {
                                    thisSlide.height(f);
                                    thisSlide.width(f / g)
                                }
                            }
                        }
                        var thisSlide = $(this);
                        var g = (thisSlide.data("origHeight") / thisSlide.data("origWidth")).toFixed(2), k = base.$el.width(), f = base.$el.height(), h;
                        base.options.fit_always ? f / k > g ? j() : e() : f <= base.options.min_height && k <= base.options.min_width ? f / k > g ? base.options.fit_landscape && g < 1 ? j(!0) : e(!0) : base.options.fit_portrait && g >= 1 ? e(!0) : j(!0) : k <= base.options.min_width ? f / k > g ? base.options.fit_landscape && g < 1 ? j(!0) : e() : base.options.fit_portrait && g >= 1 ? e() : j(!0) : f <= base.options.min_height ? f / k > g ? base.options.fit_landscape && g < 1 ? j() : e(!0) : base.options.fit_portrait && g >= 1 ? e(!0) : j() : f / k > g ? base.options.fit_landscape && g < 1 ? j() : e() : base.options.fit_portrait && g >= 1 ? e() : j();
                        thisSlide.parents("li").hasClass("image-loading") && $(".image-loading").removeClass("image-loading");
                        base.options.horizontal_center && $(this).css("left", (k - $(this).width()) / 2);
                        base.options.vertical_center && $(this).css("top", (f - $(this).height()) / 2)
                    });
                    base.options.image_protect && $("img", base.el).bind("contextmenu mousedown", function() {
                        return !1
                    });
                    return !1
                })
            }
            ;
            base.nextSlide = function() {
                if (vars.in_animation || !api.options.slideshow) {
                    return !1
                }
                vars.in_animation = !0;
                clearInterval(vars.slideshow_interval);
                var h = base.options.slides
                  , l = base.$el.find(".activeslide");
                $(".prevslide").removeClass("prevslide");
                l.removeClass("activeslide").addClass("prevslide");
                vars.current_slide + 1 == base.options.slides.length ? vars.current_slide = 0 : vars.current_slide++;
                var g = $(base.el + " li:eq(" + vars.current_slide + ")")
                  , j = base.$el.find(".prevslide");
                base.options.performance == 1 && base.$el.removeClass("quality").addClass("speed");
                loadSlide = !1;
                vars.current_slide == base.options.slides.length - 1 ? loadSlide = 0 : loadSlide = vars.current_slide + 1;
                var k = base.el + " li:eq(" + loadSlide + ")";
                if (!$(k).html()) {
                    var f = base.options.new_window ? ' target="_blank"' : "";
                    imageLink = base.options.slides[loadSlide].url ? "href='" + base.options.slides[loadSlide].url + "'" : "";
                    var e = $('<img src="' + base.options.slides[loadSlide].image + '"/>');
                    e.appendTo(k).wrap("<a " + imageLink + f + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
                    e.on('load', function() {
                        base._origDim($(this));
                        base.resizeNow()
                    })
                }
                if (base.options.thumbnail_navigation == 1) {
                    vars.current_slide - 1 < 0 ? prevThumb = base.options.slides.length - 1 : prevThumb = vars.current_slide - 1;
                    $(vars.prev_thumb).html($("<img/>").attr("src", base.options.slides[prevThumb].image));
                    nextThumb = loadSlide;
                    $(vars.next_thumb).html($("<img/>").attr("src", base.options.slides[nextThumb].image))
                }
                // typeof theme != "undefined" && typeof theme.beforeAnimation == "function" && theme.beforeAnimation("next");
                base.beforeAnimation();
                if (base.options.slide_links) {
                    $(".current-slide").removeClass("current-slide");
                    $(vars.slide_list + "> li").eq(vars.current_slide).addClass("current-slide")
                }
                g.css("visibility", "hidden").addClass("activeslide");
                switch (base.options.transition) {
                case 0:
                case "none":
                    g.css("visibility", "visible");
                    vars.in_animation = !1;
                    base.afterAnimation();
                    break;
                case 1:
                case "fade":
                    g.css({
                        opacity: 0,
                        visibility: "visible"
                    }).animate({
                        opacity: 1,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 2:
                case "slideTop":
                    g.css({
                        top: -base.$el.height(),
                        visibility: "visible"
                    }).animate({
                        top: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 3:
                case "slideRight":
                    g.css({
                        left: base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 4:
                case "slideBottom":
                    g.css({
                        top: base.$el.height(),
                        visibility: "visible"
                    }).animate({
                        top: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 5:
                case "slideLeft":
                    g.css({
                        left: -base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 6:
                case "carouselRight":
                    g.css({
                        left: base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    l.animate({
                        left: -base.$el.width(),
                        avoidTransforms: !1
                    }, base.options.transition_speed);
                    break;
                case 7:
                case "carouselLeft":
                    g.css({
                        left: -base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    l.animate({
                        left: base.$el.width(),
                        avoidTransforms: !1
                    }, base.options.transition_speed)
                }
                return !1
            }
            ;
            base.prevSlide = function() {
                if (vars.in_animation || !api.options.slideshow) {
                    return !1
                }
                vars.in_animation = !0;
                clearInterval(vars.slideshow_interval);
                var h = base.options.slides
                  , l = base.$el.find(".activeslide");
                $(".prevslide").removeClass("prevslide");
                l.removeClass("activeslide").addClass("prevslide");
                vars.current_slide == 0 ? vars.current_slide = base.options.slides.length - 1 : vars.current_slide--;
                var g = $(base.el + " li:eq(" + vars.current_slide + ")")
                  , j = base.$el.find(".prevslide");
                base.options.performance == 1 && base.$el.removeClass("quality").addClass("speed");
                loadSlide = vars.current_slide;
                var k = base.el + " li:eq(" + loadSlide + ")";
                if (!$(k).html()) {
                    var f = base.options.new_window ? ' target="_blank"' : "";
                    imageLink = base.options.slides[loadSlide].url ? "href='" + base.options.slides[loadSlide].url + "'" : "";
                    var e = $('<img src="' + base.options.slides[loadSlide].image + '"/>');
                    e.appendTo(k).wrap("<a " + imageLink + f + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
                    e.on('load', function() {
                        base._origDim($(this));
                        base.resizeNow()
                    })
                }
                if (base.options.thumbnail_navigation == 1) {
                    loadSlide == 0 ? prevThumb = base.options.slides.length - 1 : prevThumb = loadSlide - 1;
                    $(vars.prev_thumb).html($("<img/>").attr("src", base.options.slides[prevThumb].image));
                    vars.current_slide == base.options.slides.length - 1 ? nextThumb = 0 : nextThumb = vars.current_slide + 1;
                    $(vars.next_thumb).html($("<img/>").attr("src", base.options.slides[nextThumb].image))
                }
                // typeof theme != "undefined" && typeof theme.beforeAnimation == "function" && theme.beforeAnimation("prev");
                base.beforeAnimation();
                if (base.options.slide_links) {
                    $(".current-slide").removeClass("current-slide");
                    $(vars.slide_list + "> li").eq(vars.current_slide).addClass("current-slide")
                }
                g.css("visibility", "hidden").addClass("activeslide");
                switch (base.options.transition) {
                case 0:
                case "none":
                    g.css("visibility", "visible");
                    vars.in_animation = !1;
                    base.afterAnimation();
                    break;
                case 1:
                case "fade":
                    g.css({
                        opacity: 0,
                        visibility: "visible"
                    }).animate({
                        opacity: 1,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 2:
                case "slideTop":
                    g.css({
                        top: base.$el.height(),
                        visibility: "visible"
                    }).animate({
                        top: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 3:
                case "slideRight":
                    g.css({
                        left: -base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 4:
                case "slideBottom":
                    g.css({
                        top: -base.$el.height(),
                        visibility: "visible"
                    }).animate({
                        top: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 5:
                case "slideLeft":
                    g.css({
                        left: base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    break;
                case 6:
                case "carouselRight":
                    g.css({
                        left: -base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    l.css({
                        left: 0
                    }).animate({
                        left: base.$el.width(),
                        avoidTransforms: !1
                    }, base.options.transition_speed);
                    break;
                case 7:
                case "carouselLeft":
                    g.css({
                        left: base.$el.width(),
                        visibility: "visible"
                    }).animate({
                        left: 0,
                        avoidTransforms: !1
                    }, base.options.transition_speed, function() {
                        base.afterAnimation()
                    });
                    l.css({
                        left: 0
                    }).animate({
                        left: -base.$el.width(),
                        avoidTransforms: !1
                    }, base.options.transition_speed)
                }
                return !1
            }
            ;
            base.playToggle = function() {
                if (vars.in_animation || !api.options.slideshow) {
                    return !1
                }
                if (vars.is_paused) {
                    vars.is_paused = !1;
                    typeof theme != "undefined" && typeof theme.playToggle == "function" && theme.playToggle("play");
                    vars.slideshow_interval = setInterval(base.nextSlide, base.options.slide_interval)
                } else {
                    vars.is_paused = !0;
                    typeof theme != "undefined" && typeof theme.playToggle == "function" && theme.playToggle("pause");
                    clearInterval(vars.slideshow_interval)
                }
                return !1
            }
            ;
            base.goTo = function(e) {
                if (vars.in_animation || !api.options.slideshow) {
                    return !1
                }
                var f = base.options.slides.length;
                e < 0 ? e = f : e > f && (e = 1);
                e = f - e + 1;
                clearInterval(vars.slideshow_interval);
                typeof theme != "undefined" && typeof theme.goTo == "function" && theme.goTo();
                if (vars.current_slide == f - e) {
                    vars.is_paused || (vars.slideshow_interval = setInterval(base.nextSlide, base.options.slide_interval));
                    return !1
                }
                if (f - e > vars.current_slide) {
                    vars.current_slide = f - e - 1;
                    vars.update_images = "next";
                    base._placeSlide(vars.update_images)
                } else {
                    if (f - e < vars.current_slide) {
                        vars.current_slide = f - e + 1;
                        vars.update_images = "prev";
                        base._placeSlide(vars.update_images)
                    }
                }
                if (base.options.slide_links) {
                    $(vars.slide_list + "> .current-slide").removeClass("current-slide");
                    $(vars.slide_list + "> li").eq(f - e).addClass("current-slide")
                }
                if (base.options.thumb_links) {
                    $(vars.thumb_list + "> .current-thumb").removeClass("current-thumb");
                    $(vars.thumb_list + "> li").eq(f - e).addClass("current-thumb")
                }
            }
            ;
            base._placeSlide = function(f) {
                var h = base.options.new_window ? ' target="_blank"' : "";
                loadSlide = !1;
                if (f == "next") {
                    vars.current_slide == base.options.slides.length - 1 ? loadSlide = 0 : loadSlide = vars.current_slide + 1;
                    var e = base.el + " li:eq(" + loadSlide + ")";
                    if (!$(e).html()) {
                        var h = base.options.new_window ? ' target="_blank"' : "";
                        imageLink = base.options.slides[loadSlide].url ? "href='" + base.options.slides[loadSlide].url + "'" : "";
                        var g = $('<img src="' + base.options.slides[loadSlide].image + '"/>');
                        g.appendTo(e).wrap("<a " + imageLink + h + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
                        g.on('load', function() {
                            base._origDim($(this));
                            base.resizeNow()
                        })
                    }
                    base.nextSlide()
                } else {
                    if (f == "prev") {
                        vars.current_slide - 1 < 0 ? loadSlide = base.options.slides.length - 1 : loadSlide = vars.current_slide - 1;
                        var e = base.el + " li:eq(" + loadSlide + ")";
                        if (!$(e).html()) {
                            var h = base.options.new_window ? ' target="_blank"' : "";
                            imageLink = base.options.slides[loadSlide].url ? "href='" + base.options.slides[loadSlide].url + "'" : "";
                            var g = $('<img src="' + base.options.slides[loadSlide].image + '"/>');
                            g.appendTo(e).wrap("<a " + imageLink + h + "></a>").parent().parent().addClass("image-loading").css("visibility", "hidden");
                            g.on('load', function() {
                                base._origDim($(this));
                                base.resizeNow()
                            })
                        }
                        base.prevSlide()
                    }
                }
            }
            ;
            base._origDim = function(f) {
                f.data("origWidth", f.width()).data("origHeight", f.height())
            }
            ;
            base.afterAnimation = function() {
                base.options.performance == 1 && base.$el.removeClass("speed").addClass("quality");
                if (vars.update_images) {
                    vars.current_slide - 1 < 0 ? setPrev = base.options.slides.length - 1 : setPrev = vars.current_slide - 1;
                    vars.update_images = !1;
                    $(".prevslide").removeClass("prevslide");
                    $(base.el + " li:eq(" + setPrev + ")").addClass("prevslide")
                }
                vars.in_animation = !1;
                if (!vars.is_paused && base.options.slideshow) {
                    vars.slideshow_interval = setInterval(base.nextSlide, base.options.slide_interval);
                    base.options.stop_loop && vars.current_slide == base.options.slides.length - 1 && base.playToggle()
                }
                typeof theme != "undefined" && typeof theme.afterAnimation == "function" && theme.afterAnimation();
                return !1
            }
            ;
            base.beforeAnimation = function() {
                $(vars.slide_caption).length && (api.getField("title") ? $(vars.slide_caption).html(api.getField("title")) : $(vars.slide_caption).html(""));
                vars.slide_current.length && $(vars.slide_current).html(vars.current_slide + 1);
            };
            base.getField = function(f) {
                return base.options.slides[vars.current_slide][f]
            }
            ;
            base.init()
        };
    $.supersized.vars = {
            thumb_tray: "#thumb-tray",
            thumb_list: "#thumb-list",
            slide_list: "#slide-list",
            current_slide: 0,
            in_animation: !1,
            is_paused: !1,
            hover_pause: !1,
            slideshow_interval: !1,
            update_images: !1,
            options: {}
        };
    $.supersized.defaultOptions = {
            slideshow: 1,
            autoplay: 1,
            start_slide: 1,
            stop_loop: 0,
            random: 0,
            slide_interval: 5000,
            transition: 1,
            transition_speed: 750,
            new_window: 1,
            pause_hover: 0,
            keyboard_nav: 1,
            performance: 1,
            image_protect: 1,
            fit_always: 0,
            fit_landscape: 0,
            fit_portrait: 1,
            min_width: 0,
            min_height: 0,
            horizontal_center: 1,
            vertical_center: 1,
            slide_links: 1,
            thumb_links: 1,
            thumbnail_navigation: 0
        };
    $.supersized.themeVars = {
        progress_delay: !1,
        thumb_page: !1,
        thumb_interval: !1,
        image_path: "img/",
        play_button: "#pauseplay",
        next_slide: "#nextslide",
        prev_slide: "#prevslide",
        next_thumb: "#nextthumb",
        prev_thumb: "#prevthumb",
        slide_caption: "#slidecaption",
        slide_current: ".slidenumber",
        slide_total: ".totalslides",
        slide_list: "#slide-list",
        thumb_tray: "#thumb-tray",
        thumb_list: "#thumb-list",
        thumb_forward: "#thumb-forward",
        thumb_back: "#thumb-back",
        tray_arrow: "#tray-arrow",
        tray_button: "#tray-button",
        progress_bar: "#progress-bar"
    };
    $.supersized.themeOptions = {progress_bar: 1, mouse_scrub: 0}
    $.fn.supersized = function(options) {
        return this.each(function() {
            new $.supersized(options)
        })
    };
})(jQuery);