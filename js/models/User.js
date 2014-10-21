define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var User = Backbone.Model.extend({
        defaults: {},

        url: 'user',

        initialize: function () {
            this.on('change', function () {
                console.log(this.toJSON())
            }, this);
        },

        /*
         parse: function (data) {
         var obj = {};
         for (var k in data) {
         switch (k) {
         default:
         obj[k] = data[k];
         }
         }
         return obj;
         },
         */
        validate: function (attributes) {
        }
    });

    return User;
});