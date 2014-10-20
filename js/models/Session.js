/**
 * using parts from https://github.com/alexanderscott/backbone-login (MIT License)
 * and https://github.com/makesites/backbone-session © Makesites.org Initiated by Makis Tracend (@tracend) Distributed through [Makesites.org](http://makesites.org) Released under the [MIT license](http://makesites.org/licenses/MIT)
 */


define([
    "models/User",
    'util/Storage'
], function (User, Storage) {

    var DEBUG = true;

    var SessionModel = Backbone.Model.extend({

        // Initialize with negative/empty defaults
        // These will be overriden after the initial checkAuth
        defaults: {
            logged_in: false,
            user: ''
        },

        url: 'session',

        options: {
            local: true,
            remote: true,
            persist: false,
            host: ""
        },

        initialize: function () {
            //_.bindAll(this);

            // Singleton user object
            // Access or listen on this throughout any module with app.session.user
            this.user = new User({ });

            this.on('change:user', function () {
                console.log(this.user)
            })

            // pick a persistance solution
            if (!this.options.persist && typeof sessionStorage != "undefined" && sessionStorage !== null) {
                // choose localStorage
                this.store = Storage.sessionStorage;
            } else if (this.options.persist && typeof localStorage != "undefined" && localStorage !== null) {
                // choose localStorage
                this.store = Storage.localStorage;
            } else {
                // otherwise we need to store data in a cookie
                this.store = Storage.cookie;
            }

            // try loading the session
            var localSession = this.store.get("session");
            console.log('local session: ' + localSession);
            //
            if (_.isNull(localSession)) {
                // - no valid local session, try the server
                this.fetch();
            } else {
                this.set(JSON.parse(localSession));
                // reset the updated flag
                this.set({ updated: 0 });
                // sync with the server
                this.save();
            }

            // event binders
            this.bind("change", this.update);
            this.bind("error", this.error);
            this.on("logout", this.logout);


        },


        // Fxn to update user attributes after recieving API response
        updateSessionUser: function (userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults)));
        },

        update: function () {
            console.log('changed session');
            console.log(arguments);
            // set a trigger
            if (!this.state) {
                this.state = true;
                this.trigger("loaded");
            }
            ;
            // caching is triggered after every model update (fetch/set)
            if (this.get("updated") || !this.options["remote"]) {
                this.cache();
            }
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
                    model.clear();
                    model.id = null;
                    // Set auth to false to trigger a change:auth event
                    // The server also returns a new csrf token so that
                    // the user can relogin without refreshing the page
                    self.set({auth: false});
                    if (resp && resp._csrf) self.set({_csrf: resp._csrf});
                    // reload the page if needed
                    if (options.reload) {
                        window.location.reload();
                    }
                }
            });
        },
        // if data request fails request offline mode.
        error: function (model, req, options, error) {
            // consider redirecting based on statusCode
        },

        // Helpers
        // - Creates a unique id for identification purposes
        generateUid: function (separator) {

            var delim = separator || "-";

            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
        },


        /*
         * Check for session from API
         * The API will parse client cookies using its secret token
         * and return a user object if authenticated
         */
        checkAuth: function (callback, args) {
            var self = this;
            this.fetch({                                                                          // Check if there are tokens in localstorage
                success: function (mod, res) {
                    if (!res.error && res.user) {
                        self.updateSessionUser(res.user);
                        self.set({ logged_in: true });
                        if ('success' in callback) callback.success(mod, res);
                    } else {
                        self.set({ logged_in: false });
                        if ('error' in callback) callback.error(mod, res);
                    }
                }, error: function (mod, res) {
                    self.set({ logged_in: false });
                    if ('error' in callback) callback.error(mod, res);
                }
            }).complete(function () {
                if ('complete' in callback) callback.complete();
            });
        },


        // Methods

        signin: function (opts, callback, args) {
            this.postAuth(_.extend(opts, { method: 'signin' }), callback);
        },

        // logout: function(opts, callback, args){
        //     this.postAuth(_.extend(opts, { method: 'logout' }), callback);
        //},

        signup: function (opts, callback, args) {
            this.postAuth(_.extend(opts, { method: 'signup' }), callback);
        }

        // removeAccount: function(opts, callback, args){
        //      this.postAuth(_.extend(opts, { method: 'remove_account' }), callback);
        // }


    });


    return new SessionModel;
});

