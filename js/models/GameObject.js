define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var GameObject = Backbone.Model.extend({
        defaults: {
            shape: {
                type: "circle",
                size: "medium"
            }
        },

        initialize: function () {

        }
    });

    return GameObject;
});