define([], function () {
    /**
     * This is a sample container for pre-deployment configuration of TouchTheBeat client. The file should be renamed to config.js after you entered your configuration.
     * @class Config.Sample
     * @module src
     */
    return {
        /**
         * Set this option to true in development and false in production.
         * When this option is true, TouchTheBeat logs to the console and and the 'app' object is accessible in the console at window.app
         * @property {boolean} debug
         */
        debug: true,

        backend: {
            /**
             * Specify the backend host url here. https:// should be used in production to ensure encryption.
             * @property {String} host
             */
            host: 'http://localhost/ttb-backend/',

            /**
             * These values define the names of request headers. They need to match the names configured in the backend.
             * @property {Object} headerNames
             */
            headerNames: {
				timestamp: 'ttbTimestamp',
				hash: 'ttbHash',
				session: 'ttbSession',
				token: 'ttbToken'
            },

            /**
             * This function has to be implemented by you and should return the backend-authentification-hash.
             * By implementing a non-trivial procedure and obfuscating the client code before deployment,
             * this should ensure that only your client is able to send valid requests to your backend.
             * Everyone who knows how to generate the access hash will be able to send valid request,
             * so keep it as private as possible!
             *
             * more information: https://github.com/TouchTheBeat/Backend/issues/30
             *
             * @method createAccessHash
             * @param {Object} options
             * the object that will be passed to the jquery ajax() function as settings parameter. It contains many attributes.
             * See http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings for details

             */
            createAccessHash: function () {
                "use strict";
                throw 'createAccessHash method not implemented. Open config.js to do so.';

				/*
				 # Example implementation:

				 return md5.MD5(options.headers.ttbTimestamp+"Your very special salt"+options.headers.ttbToken);

				 # To use md5.MD5() you would need to add 'md5' first argument of the define call and the md5 object
				 # will be the first argument of the top level function.
				 # Of cause you can also use any other hashing module.
				 # See http://requirejs.org/ for details.

				 */
            }
        }
    };
});
