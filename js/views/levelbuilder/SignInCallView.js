define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/signincall.html',
    'app'
], function ($, _, Backbone, plainTemplate, app) {
    var SignInCallView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        route: 'levelbuilder/signin',

        render: function () {
            this.$el.html(this.template);
            var originalRoute = Backbone.history.fragment;
            if (originalRoute != this.route) {
                app.router.navigate('levelbuilder/signin', {replace: true});
                this.listenTo(app.session, 'change:logged_in', function (session) {
                    if (session.get('logged_in')) {
                        app.router.navigate(originalRoute, {trigger: true, replace: true});
                    }
                });
            }
        },

        events: {
            'click #btn_showsigninmodal_call': 'clickedSignInButton'
        },

        clickedSignInButton: function () {
            console.log('clicked signinbutton');
            if (!app.session.get('logged_in')) {
                app.getMainView().openSignInModal();
            }
        }

    });

    return SignInCallView;
});

