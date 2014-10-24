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
            //this.$el.html('Sign In');
            this.$el.html('<button class="btn navbar-btn btn-primary" style="margin-right: 30px;" id="btn_showsigninmodal">Sign in</button>');
        },

        events: {
            'click #btn_showsigninmodal': 'clickedSignInButton'
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