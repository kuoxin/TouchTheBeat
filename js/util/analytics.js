define(['jquery', 'underscore', 'backbone', 'google-analytics'], function ($, _, Backbone, ga) {

    var analytics = {};

    analytics.trackPageView = function (current) {
        ga('send', 'pageview', current.fragment == '' ? '/' : current.fragment);
    };

    analytics.trackAction = function (category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    };

    //TODO: make local, sometimes it is not loaded yet
    ga('create', 'UA-52163376-2', 'auto');

    return analytics;

});
