define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/signin.html'
], function ($, _, Backbone, plaintemplate) {
    var SignInView = Backbone.View.extend({
        render: function () {
            this.$el.html(_.template(plaintemplate, {}));
            this.$('#user_modal').modal('show');
        }
    });
    return SignInView;
});