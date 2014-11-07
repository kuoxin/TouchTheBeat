/**
 * using parts from https://github.com/alexanderscott/backbone-login (MIT License)
 * and https://github.com/makesites/backbone-session © Makesites.org Initiated by Makis Tracend (@tracend) Distributed through [Makesites.org](http://makesites.org) Released under the [MIT license](http://makesites.org/licenses/MIT)
 */
define([
    'underscore',
    'Backbone',
    'models/User',
    'util/Storage'
], function (_, Backbone, User, Storage) {
    console.log(Backbone);
    var SessionModel = Backbone.Model.extend({

        defaults: {
            logged_in: false,
            user: {},
            id: ''
        },

        url: 'session',

        options: {
            persist: false
        },

        initialize: function () {
            // pick a persistance solution
            if (!this.options.persist && typeof sessionStorage != "undefined" && sessionStorage !== null) {
                this.store = Storage.sessionStorage;
            } else if (this.options.persist && typeof localStorage != "undefined" && localStorage !== null) {
                this.store = Storage.localStorage;
            } else {
                this.store = Storage.cookie;
            }

            // try loading the session
            var localSession = this.store.get("session");
            //
            if (!_.isNull(localSession)) {
                console.info('Restored local session.');
                this.set(JSON.parse(localSession), {silent: true});
                /*
                 The user updateSessionUser method must be called from main module so that the hash can be already accessed by the API.
                 The changed user will trigger the change:logged_in as normal.
                 * */
            }

            // event binders
            this.bind("change:hash", this.update);
            this.bind("error", this.error);
            this.on("logout", this.logout);
        },

        parse: function (data) {
            console.log(data);
            return _.pick(data, 'hash', 'expireTime');
        },

        toJSON: function () {
            return this.parse(this.attributes);
        },

        updateSessionUser: function () {
            var session = this;
            (new User()).fetch({
                success: function (user) {
                    session.set({
                        user: user,
                        logged_in: true
                    });
                },
                error: function () {
                    console.log('getting current user failed: ');
                    console.log(arguments);
                    session.set({
                        logged_in: false
                    });
                }
            });
        },

        reset: function () {
            this.store.clear("session");
            this.clear();
            this.set({logged_in: false});

        },

        update: function () {
            console.log('updated session');
            this.updateSessionUser();
            // caching is triggered after every model update (fetch/set)
            this.cache();
        },

        cache: function () {
            // update the local session
            this.store.set("session", JSON.stringify(this.toJSON()));
            // check if the object has changed locally
            //...
        },
        // Destroy session - Source: http://backbonetutorials.com/cross-domain-sessions/
        logout: function (options) {
            // Do a DELETE to /session and clear the clientside data
            var self = this;
            options = options || {};
            // delete local version
            this.store.clear("session");
            // notify remote
            this.destroy({
                wait: true,
                success: function (model, resp) {
                    model.clear({silent: true});
                    model.id = null;
                    // Set auth to false to trigger a change:auth event
                    // The server also returns a new csrf token so that
                    // the user can relogin without refreshing the page
                    self.set({logged_in: false});
                    if (resp && resp._csrf) self.set({_csrf: resp._csrf});
                    // reload the page if needed
                    if (options.reload) {
                        window.location.reload();
                    }

                },
                error: function (error) {
                    console.error(error);
                }
            });
        }
    });
    return SessionModel;
});

