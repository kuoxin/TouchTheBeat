/**
 * using parts from https://github.com/alexanderscott/backbone-login (MIT License)
 */
define([
    "models/User",
    "util/api"
], function (User, API) {

    var DEBUG = true;

    var SessionModel = Backbone.Model.extend({

        // Initialize with negative/empty defaults
        // These will be overriden after the initial checkAuth
        defaults: {
            logged_in: false,
            user: ''
        },

        initialize: function () {
            //_.bindAll(this);

            // Singleton user object
            // Access or listen on this throughout any module with app.session.user
            this.user = new User({ });

            this.on('change:user', function () {
                console.log(this.user)
            })
        },


        // Fxn to update user attributes after recieving API response
        updateSessionUser: function (userData) {
            this.user.set(_.pick(userData, _.keys(this.user.defaults)));
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


        /*
         * Abstracted fxn to make a POST request to the auth endpoint
         * This takes care of the CSRF header for security, as well as
         * updating the user and session after receiving an API response
         */
        postAuth: function (opts, callback) {
            var self = this;
            var postData = _.omit(opts, 'method');
            if (DEBUG) console.log(postData);

            API.request('POST', 'auth/' + opts.method, {
                success: function (data) {
                    return;
                    if (_.indexOf(['signin', 'signup'], opts.method) !== -1) {
                        self.updateSessionUser(res.user || {});
                        self.set({ user_id: res.user.id, logged_in: true });
                    } else {
                        self.set({ logged_in: false });
                    }
                    if (callback && 'success' in callback)
                        callback.success(res);

                },
                error: function (error) {
                    if (callback && 'error' in callback)
                        callback.error(error);
                },
                always: function () {
                    if (callback && 'complete' in callback) callback.complete(res);
                }
            }, {data: _.omit(opts, 'method')});
        },


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

