define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/levelpanel.html'
], function ($, _, Backbone, LevelPanelTemplate) {
    var LevelPanelView = Backbone.View.extend({
        tagName: "a",

        initialize: function (callback) {
            this.callback = callback;
        },

        attributes: {
            class: 'list-group-item',
            href: '#'
        },

        render: function (level) {
            var template = _.template(LevelPanelTemplate, _.extend(level.toJSON(), {
                duration: level.getDurationString()
            }));
            this.$el.html(template);
            this.level = level;
        },
        events: {
            'click': 'triggercallback'
        },

        triggercallback: function (event) {
            event.preventDefault();
            this.callback(this.level);
        }
    });
    return LevelPanelView;
});