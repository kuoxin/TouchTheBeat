define(['jquery', 'underscore', 'backbone', 'google-analytics'], function ($, _, Backbone, ga) {


    var analytics = {};

    analytics.trackPageView = function (current) {
        ga('send', 'pageview',  current.fragment == '' ? '/' : current.fragment);
    };

    analytics.trackAction = function (type, description) {
        ga('send', 'event', type, description);
    };

    ga('create', 'UA-52163376-2', 'auto');

    return analytics;

});