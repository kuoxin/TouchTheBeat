define([
    'jquery',
    'underscore',
    'backbone',
    '../../../util/levelvalidator',
    'text!templates/levelpanel.html',
    'app'
], function ($, _, Backbone, levelvalidator, LevelPanelTemplate, app) {
    var LevelPanelView = Backbone.View.extend({
        tagName: "a",

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
            'click': 'startlevel'
        },

        startlevel: function (event) {
            event.preventDefault();
            app.startlevel(this.level);
        }
    });
    return LevelPanelView;
});