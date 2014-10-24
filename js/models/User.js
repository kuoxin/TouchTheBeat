define([
    'jquery',
    'underscore',
    'backbone',
    'md5'
], function ($, _, Backbone, md5) {
    var User = Backbone.Model.extend({
        defaults: {
            username: 'unknown'
        },

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

        parse: function (data) {
            return _.pick(data, 'username', 'homepage')
        },

        validate: function (attributes) {
        }
    });

    return User;
});