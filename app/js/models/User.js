define([
    'jquery',
    'underscore',
    'Framework',
    'md5'
], function ($, _, Framework, md5) {
    var User = Framework.Model.extend({
        defaults: {
            username: 'unknown'
        },

        urlRoot: 'user',

        initialize: function () {
            this.on('change', function () {
                console.log(this.toJSON());
            }, this);
        },

        createGravatarURL: function () {
            //documentation: https://en.gravatar.com/site/implement/images/
            var email = this.get("email") || '';
            return '//gravatar.com/avatar/' + md5.MD5(email.toLowerCase()).toString() + '?d=mm&s=200';
        },

        parse: function (data) {
            if (data === true) {
                return {};
            }
            else {
                return data;
            }
        }
    });

    return User;
});