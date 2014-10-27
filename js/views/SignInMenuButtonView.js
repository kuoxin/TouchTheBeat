define([
    'jquery',
    'underscore',
    'backbone',
    'views/SignInView',
    'app',
    'bootstrap'
], function ($, _, Backbone, SignInView, app) {
    var SignInButtonView = Backbone.View.extend({
        tagName: 'li',

        render: function () {
            this.$el.html('<button class="btn btn-primary navbar-btn" id="btn_showsigninmodal">Sign in</button>');
        },

        events: {
            'click #btn_showsigninmodal': 'clickedSignInButton'
        },

        clickedSignInButton: function () {
            console.log('clicked signinbutton');
            if (!app.session.get('logged_in')) {
                app.getMainView().openSignInModal();
            }
        }

    });
    return SignInButtonView;
});