define(['jquery', 'underscore', 'backbone','google-analytics'], function ($, _, Backbone, ga) {


    var analytics = {};

    analytics.trackPageView = function (uri) {
        ga('send', 'pageview', uri);
    };

    analytics.trackAction = function (type, description) {
        ga('send', 'event', type, description);
    };

    ga('create', 'UA-52163376-2', 'coloreddrums.de');


    Backbone.history.bind("route", function (route, router) {
        analytics.trackPageView(window.location.href.split('coloreddrums.de/ttb').pop());
    });

    return analytics;

});