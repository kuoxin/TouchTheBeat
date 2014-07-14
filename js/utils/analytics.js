define(['jquery', 'underscore', 'backbone','google-analytics'], function ($, _, Backbone, ga) {


    var analytics = {};

    analytics.trackPageView = function (uri) {
        ga('send', 'pageview', uri);
    };

    analytics.trackAction = function (type, description) {
        ga('send', 'event', type, description);
    };

    ga('create', 'UA-52163376-2', 'auto');


    Backbone.history.bind("route", function (route, router) {
        var url = Backbone.history.getFragment();

        if (!/^\//.test(url) && url != "")
        {
            url = "/" + url;
        }

        analytics.trackPageView(url);
    });

    return analytics;

});