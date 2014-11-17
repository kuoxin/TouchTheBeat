define([
    'jquery',
    'underscore',
    'Framework',
    'util/levelvalidator',
    'collections/GameObjectCollection',
    'models/Track',
    'models/User',
    'app'
], function ($, _, Framework, Validator, GameObjectCollection, Track, User, app) {
    var LevelDraft = Framework.Model.extend({
        defaults: {
            gameObjects: new GameObjectCollection(),
            tags: [],
            audio: new Track(),
            name: ''
        },

        urlRoot: function(){
            return 'user/'+app.session.get('user').id+'/draft';
        },

        initialize: function () {
            if (!this.has('owner')) {
                if (typeof app.session === 'undefined') {
                    console.warn('A level-draft without owner was created before the session was initialized.');
                }
                else {
                    this.set('owner', app.session.get('user'));
                }
            }
        },

        /**
         * @returns {string} the duration of the level in human-readable format, e.g. 3:07 or 0:12
         */
        getDurationString: function () {
            var ms = this.get('audio').get('duration');
            if (ms) {
                ms = 1000 * Math.round(ms / 1000); // round to nearest second
                var seconds = ((ms % 60000) / 1000);
                return Math.floor(ms / 60000) + ":" + (seconds < 10 ? '0' : '') + seconds;
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
                        obj.gameObjects = new GameObjectCollection(data[k], {parse: true});
                        break;
                    case 'owner':
                        obj.owner = new User(data[k], {parse: true});
                        break;
                    case 'audio':
                        obj.audio = (new Track()).set(data[k]);
                        break;
                    default:
                        obj[k] = data[k];
                }
            }

            return obj;
        }
    });


    LevelDraft.createFromSoundCloud = function (soundcloudURL) {
        var model = new LevelDraft();
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

    return LevelDraft;
});