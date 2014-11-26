define([], function () {
    /**
     * This is a sample container for pre-deployment configuration of TouchTheBeat client. The file should be renamed to config.js after you entered your configuration.
     * @class Config.Sample
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
                timestamp: 'ttb-timestamp',
                hash: 'ttb-hash',
                session: 'ttb-session'
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
             */
            createAccessHash: function (options) {
                "use strict";
                throw 'createAccessHash method not implemented. Open config.js to do so.';
            }
        }
    };
});
