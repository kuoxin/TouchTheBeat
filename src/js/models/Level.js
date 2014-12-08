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
    /**
     * @module models
     * @extends Model
     * @class Level
     * @type {*|void}
     */
    var Level = Framework.Model.extend({
        defaults: {
            gameObjects: new GameObjectCollection(),
            tags: [],
            audio: new Track(),
            name: ''
        },

        urlRoot: 'level',

        initialize: function () {
            if (!this.has('owner')) {
                if (_.isUndefined(app.session)) {
                    console.warn('A level without owner was created before the session was initialized.');
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
            return this.get('audio').getDurationString();
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