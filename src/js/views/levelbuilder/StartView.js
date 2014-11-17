define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/levelbuilder/start.html',
    'app'
], function ($, _, Framework, plainTemplate, app) {
    var StartLevelBuilderView = Framework.View.extend({

        template: _.template(plainTemplate, {}),

        initialize: function () {
        },

        events: {
            'click #edit': 'edit',
            'click #new': 'create'
        },

        create: function () {
            console.log('click');
            app.router.views.levelbuilderview.setContent('leveleditor');
            return false;
        },

        edit: function () {
            app.router.views.levelbuilderview.setContent('openlevel');
            return false;
        },

        render: function () {
            this.$el.html(this.template);
        }
    });

    return StartLevelBuilderView;
});