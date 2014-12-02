
define([
    'underscore',
    'Framework',
    'models/User',
    'util/Storage'
], function (_, Framework, User, Storage) {
    /**
     * using parts from https://github.com/alexanderscott/backbone-login (MIT License)
     * and https://github.com/makesites/backbone-session © Makesites.org Initiated by Makis Tracend (@tracend) Distributed through [Makesites.org](http://makesites.org) Released under the [MIT license](http://makesites.org/licenses/MIT)
     * @module models
     * @class Session
     * @extends Model
     * @type {*|void}
     */
    var SessionModel = Framework.Model.extend({

        defaults: {
            /**
             * Triggered when the login state changes.
             * @event change:logged_in
             */
            /**
             * @attribute {boolean} logged_in
             * @default false
             */
            logged_in: false
            /**
             * @attribute {string} hash
             */
            /**
             * @attribute {Number} expireTime
             */
            /**
             * @attribute {User} user
             */
        },

        url: 'session',

        options: {
            persist: false
        },

        /**
         * picks a persistance solution
         * @method initialize
         */
        initialize: function () {
            /**
             * a automatically chosen implementation of a Storage Provider Interface (sessionStorage, localStorage or cookie)
             * @property store
             */
            if (!this.options.persist && typeof sessionStorage != "undefined" && sessionStorage !== null) {
                this.store = Storage.sessionStorage;
            } else if (this.options.persist && typeof localStorage != "undefined" && localStorage !== null) {
                this.store = Storage.localStorage;
            } else {
                this.store = Storage.cookie;
            }
        },

        /**
         * Logs the user in by sending POST Session to the server and triggering cache() on success
         * @method login
         * @param {Object} data contains the data sent to the backend
         * @param {object} [options] contains optional callbacks
         */
        login: function (data, options) {
            "use strict";
            options = options || {};
            var originalOptions = _.clone(options);
            var session = this;
            _.extend(options, {
                success: function (model, response, options) {
                    if (originalOptions.success) {
                        originalOptions.success(model, response, options);
                    }
                    session.set('logged_in', true);
                    session.cache();
                }
            });
            this.save(data, options);

        },

        /**
         * Logs the user out (destroys the session - Source: http://backbonetutorials.com/cross-domain-sessions/ )
         * @method logout
         */
        logout: function () {
            // Do a DELETE to /session and clear the clientside data
            var self = this;
            // delete local version
            this.store.clear("session");
            // notify remote
            this.destroy({
                wait: true,
                success: function (model) {
                    model.clear({silent: true});
                    model.id = null;
                    self.set({logged_in: false});
                },
                error: function (error) {
                    console.error(error);
                }
            });
        },

        /**
         * This method tries to restore a locally cached session by fetching it from the server.
         * If it succeeds, the local cache will be updated and if it fails it will be deleted.
         * @method restore
         */
        restore: function () {
            "use strict";
            if (this.store.check('session')) {
                var session = this;

                var errorCallback = function () {
                    // restoring of local session failed, removing local session
                    session.store.clear("session");
                };

                try {
                    this.set(JSON.parse(this.store.get('session')));
                }
                catch (e) {
                    errorCallback();
                }

                this.fetch({
                    success: function () {
                        // successfully restored local session
                        session.set({
                            logged_in: true
                        });
                        session.cache();
                    },
                    error: errorCallback
                });
            }
        },

        /**
         * removes attributes that should not be sent to the server by whitelist
         */
        sync: function (method, model, options) {
            options.attrs = _.pick(model.attributes, ['email', 'password', 'stay_logged_in']);
            return Framework.sync.call(this, method, model, options);
        },

        parse: function (data, options) {
            "use strict";
            this.clear({silent: true});
            var obj = {};
            for (var k in data) {
                switch (k) {
                    case 'user':
                        obj.user = new User(data[k], {parse: true});
                        break;
                    default:
                        obj[k] = data[k];
                }
            }
            return obj;

        },

        /**
         * Caches a minimal version of the session to a local storage provider as chosen in the method initialize().
         * @method cache
         */
        cache: function () {
            // update the local session
            this.store.set(
                "session",
                JSON.stringify(_.pick(
                    this.toJSON(),
                    'hash',
                    'expireTime'
                ))
            );

        }
    });
    return SessionModel;
});

