define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'collections/GameObjectCollection',
    'models/Track'
], function ($, _, Backbone, Validator, GameObjectCollection, Track) {
    var Level = Backbone.Model.extend({
        defaults: {
            gameObjects: new GameObjectCollection(),
            tags: [],
            audio: {},
            owner: {}
        },

        initialize: function () {
            this.on('change', function () {
                console.log(this.toJSON())
            }, this);
        },

        /**
         * @returns {string} the duration of the level in human-readable format, e.g. 3:07 or 0:12
         */
        getDurationString: function () {
            var ms = this.get('audio').duration;
            if (ms) {
                ms = 1000 * Math.round(ms / 1000); // round to nearest second
                var seconds = ((ms % 60000) / 1000);
                return Math.floor(ms / 60000) + ":" + (seconds < 10 ? '0' : '') + seconds;
                //var d = new Date(ms);
                //return d.toTimeString();//d.getUTCMinutes() + ':' + d.getUTCSeconds();
            }
            else {
                return 'unknown';
            }
        },

        parse: function (data) {
            var obj = {};
            for (var k in data) {
                switch (k) {
                    case 'gameObjects':
                        obj['gameObjects'] = new GameObjectCollection(data[k], {parse: true});
                        break;
                    case 'audio':
                        obj['audio'] = (new Track()).set(data[k]);
                        break;
                    default:
                        obj[k] = data[k];
                }
            }
            return obj;
        },

        validate: function (attributes) {
        }
    });


    Level.createFromSoundCloud = function (soundcloudURL) {
        var model = new Level();
        var track = new Track();
        track.fetch({
            data: soundcloudURL,
            success: function soundcloudCallback(data) {
                model.setSoundcloudAudio(data);
            },
            error: function (e) {
                throw e;
            }
        });
        return model;
    };

    return Level;
});