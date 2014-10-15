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
            var track = level.get('audio');
            var owner = level.get('owner');
            var template = _.template(LevelPanelTemplate, {
                levelname: level.get('name'),
                artist: track.artist || 'unknown',
                artisturl: '#',
                track: track.title || 'unknown',
                trackurl: track.permalinkUrl,
                duration: level.getDurationString(),
                author: owner.username || 'unknown'
            });
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