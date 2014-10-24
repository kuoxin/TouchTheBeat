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
            this.signinview = new SignInView();
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
            this.signinview.render();
            $('#abovecontent').html(this.signinview.el);
        }
    });
    return SignInButtonView;
});