define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/start.html',
    'app'
], function ($, _, Backbone, plainTemplate, app) {
    var StartLevelBuilderView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        initialize: function () {
        },

        events: {
            'click #edit': 'edit',
            'click #new': 'create'
        },

        create: function () {
            console.log('click');
            app.createLevelEditorModel();
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