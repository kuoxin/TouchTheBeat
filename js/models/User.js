define([
    'jquery',
    'underscore',
    'backbone',
    'md5'
], function ($, _, Backbone, md5) {
    var User = Backbone.Model.extend({
        defaults: {},

        url: 'user',

        initialize: function () {
            this.on('change', function () {
                console.log(this.toJSON())

            }, this);
        },

        createGravatarURL: function () {
            //documentation: https://en.gravatar.com/site/implement/images/
            var email = this.get("email") || '';
            return '//gravatar.com/avatar/' + md5.MD5(email.toLowerCase()).toString() + '?d=mm&s=200';
        },

        validate: function (attributes) {
        }
    });

    return User;
});