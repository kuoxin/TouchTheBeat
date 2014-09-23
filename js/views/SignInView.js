define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/signin.html'
], function ($, _, Backbone, gapi, plaintemplate) {
    var SignInView = Backbone.View.extend({
        el: '#content',
        render: function () {
            this.$el.html(_.template(plaintemplate, {}));
        }
    });
    return SignInView;
});
220