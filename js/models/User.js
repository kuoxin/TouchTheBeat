define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'collections/GameObjectCollection',
    'util/SoundcloudLoader'
], function ($, _, Backbone, Validator, GameObjectCollection, SoundcloudLoader) {
    var User = Backbone.Model.extend({
        defaults: {},

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