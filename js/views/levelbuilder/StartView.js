define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/levelbuilder/start.html'
], function ($, _, Backbone, plainTemplate) {
    var StartLevelBuilderView = Backbone.View.extend({

        template: _.template(plainTemplate, {}),

        initialize: function () {
        },

        render: function () {
            this.$el.html(this.template);
        }
    });

    return StartLevelBuilderView;
});