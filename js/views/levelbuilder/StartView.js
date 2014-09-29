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
            'click #edit': 'edit'
        },

        edit: function () {
            var levelbuilderview = app.router.views.levelbuilderview;
            if (app.models.levelEditorModel != null)
                levelbuilderview.setContent(levelbuilderview.contents.gameobjecteditorview);
            else
                levelbuilderview.setContent(levelbuilderview.contents.openlevelview);
            return false;
        },

        render: function () {
            this.$el.html(this.template);
        }
    });

    return StartLevelBuilderView;
});