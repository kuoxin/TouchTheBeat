define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator'
], function ($, _, Backbone, Validator) {
    var Level = Backbone.Model.extend({
        defaults: {},

        initialize: function () {

        },

        validate: function (attributes) {

        }
    });

    return Level;
});