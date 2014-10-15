define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'collections/GameObjectCollection',
    'util/SoundcloudLoader'
], function ($, _, Backbone, Validator, GameObjectCollection, SoundcloudLoader) {
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

        setSoundcloudAudio: function (data) {
            this.set({
                audio: {
                    streamUrl: data.stream_url,
                    permalinkUrl: data.permalink_url,
                    artist: data.user.username,
                    title: data.title,
                    duration: data.duration,
                    artworkUrl: data.artwork_url,
                    avatarUrl: data.avatar_url,
                    artistUrl: data.user.permalink_url
                }
            }, {silent: true});
            this.trigger('change:audio');
            // the change:audio event is triggered manually, because in AudioPanelView it is expected to be also triggered when the audio property gets set with the same values that it already had.

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
                    default:
                        obj[k] = data[k];
                }
            }
            return obj;
        },

        toJSON: function () {
            return this.deepcopy(this.attributes);
        },

        deepcopy: function (copyof) {
            var obj = (copyof instanceof Array) ? [] : {};

            for (var k in copyof) {
                if (typeof copyof[k] == "object" && copyof[k] !== null) {
                    console.log('found ' + typeof copyof[k] + ' ' + k);


                    if (typeof copyof[k].toJSON == "function") {
                        console.info('.toJSON() method used for nested model/collection ' + k);
                        obj[k] = copyof[k].toJSON();
                    }
                    else {
                        obj[k] = this.deepcopy(copyof[k]);
                    }
                }

                else {
                    console.log('copied leaf ' + k);
                    obj[k] = copyof[k];
                }
            }
            return obj;
        },

        validate: function (attributes) {
        }
    });


    Level.createFromSoundCloud = function (soundcloudURL) {
        var model = new Level();
        var callback = function soundcloudCallback(data) {
            model.setSoundcloudAudio(data);
        };
        SoundcloudLoader.loadStream(soundcloudURL, callback, function (e) {
            throw e;
        });
        return model;
    };

    return Level;
});