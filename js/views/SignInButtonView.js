define([
    'jquery',
    'underscore',
    'backbone',
    'views/SignInView',
    'app',
    'bootstrap'
], function ($, _, Backbone, SignInView, app) {
    var SignInButtonView = Backbone.View.extend({
        tagName: 'button',
        className: 'btn navbar-btn',

        render: function () {
            //this.$el.html('Sign In');
            this.$el.html('Sign in');
        },

        events: {
            'click': 'clickedSignInButton'
        },

        clickedSignInButton: function () {
            if (!app.session.get('logged_in')) {
                this.openSignInModal();
            }
        },

        openSignInModal: function () {
            var signinview = new SignInView();
            signinview.render();
            $('#abovecontent').html(signinview.el);
        }
    });
    return SignInButtonView;
});