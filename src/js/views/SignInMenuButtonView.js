define([
    'jquery',
    'underscore',
    'Framework',
    'views/SignInView',
    'app',
    'lib/bootstrap'
], function ($, _, Framework, SignInView, app) {
    var SignInButtonView = Framework.View.extend({
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
                app.getMainView().getAppView().openSignInModal();
            }
        }

    });
    return SignInButtonView;
});