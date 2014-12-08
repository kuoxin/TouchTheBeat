define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/applicationwithmenu.html',
    'views/MenuView',
    'views/SignInView'
], function ($, _, Framework, awmtemplate, MenuView, SignInView) {
    var ApplicationWithMenuView = Framework.View.extend({
        el: 'body',

        fullscreen: true,

        render: function () {
            var template = _.template(awmtemplate, {});
            this.$el.html(template);

            this.menu = new MenuView();
            this.$('#menu').html(this.menu.render().el);
        },

        setContent: function (el) {
            "use strict";
            this.$('#content').html(el);
        },

        openSignInModal: function () {
            var signinview = new SignInView();
            signinview.render();
            $('#abovecontent').html(signinview.el);
        },
        onClose: function () {
            "use strict";
            this.menu.close();
        }
    });
    return ApplicationWithMenuView;
});