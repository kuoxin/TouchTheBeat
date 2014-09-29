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
                artist: track.artist || 'Unknown',
                artisturl: '#',
                track: track.title || 'Unknown',
                trackurl: track.permalinkUrl,
                duration: 'not set',
                author: owner.username || 'Unknown'
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