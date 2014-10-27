define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/signincall.html',
    'app'
], function ($, _, Backbone, plainTemplate, aüü) {
    var SignInCallView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        render: function () {
            this.$el.html(this.template);
        },

        events: {
            'click #btn_showsigninmodal_call': 'clickedSignInButton'
        },

        clickedSignInButton: function () {
            console.log('clicked signinbutton');
            if (!app.session.get('logged_in')) {
                app.getMainView().openSignInModal();
            }
        },

    });

    return SignInCallView;
});

