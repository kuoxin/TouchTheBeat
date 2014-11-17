define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/components/levelpanel.html'
], function ($, _, Framework, LevelPanelTemplate) {
    var LevelPanelView = Framework.View.extend({
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