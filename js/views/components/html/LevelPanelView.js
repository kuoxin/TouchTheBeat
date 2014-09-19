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
            var template = _.template(LevelPanelTemplate, {
                levelname: level.name,
                artist: level.track.artist ? level.track.artist : 'Unknown',
                artisturl: '#',
                track: level.track.title ? level.track.title : 'Unknown',
                trackurl: level.audio.permalink_url,
                duration: 'not set',
                author: level.author ? level.author : 'Unknown'
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