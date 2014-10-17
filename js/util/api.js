define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var getRequestToString = function (method, route) {
        return 'API-Request ' + method + ' ' + route;
    };

    var API = {
        /** has to be a https:// url in production to ensure encrypted communication*/
        base: 'http://localhost/ttb-backend/',

        backendErrorCodes: {},


        /**
         * Does an asynchronous request to the backend.
         * @param opts (optional) options passed to jquery.ajax(), examle [data: {}} for post request
         * @param method GET or POST
         * @param route the backend-route (e.g auth/signin)
         * @param callbacks (optional) a object containing success, error and always functions
         */
        request: function (method, route, callback, opts) {

            // eliminating need to check if callback exists on each function-call
            var syntacticsugar = function () {
            };
            callback = callback || {success: syntacticsugar, error: syntacticsugar, always: syntacticsugar};

            if (method != 'GET' && method != 'POST')
                console.error('Unsupported method used for ' + getRequestToString(method, route));

            opts = _.defaults(opts || {}, {
                type: method,
                dataType: 'json',
                url: API.base + route
                //beforeSend: function(xhr) {
                // Set the CSRF Token in the header for security
                // var token = $('meta[name="csrf-token"]').attr('content');
                // if (token) xhr.setRequestHeader('X-CSRF-Token', token);
                //},
            });

            var handler = {
                success: function (response) {
                    if (response.error) {
                        var error = API.backendErrorCodes[response.error];
                        console.warn(getRequestToString(method, route) + ' return an error: "' + error + '"')
                        callback.error(error);
                    } else {
                        console.info(getRequestToString(method, route) + ' successfull.');
                        callback.success(response.data)
                    }
                },
                error: function (jqXHR) {
                    console.error(getRequestToString(method, route) + ' failed. (' + jqXHR.status + ')');
                    callback.error(jqXHR.status)
                },
                always: function () {
                }
            };

            var request = $.ajax(opts).done(handler.success).fail(handler.error).always(handler.always);
        }


    };


    API.request('GET', 'system/codes', {
        success: function (data) {
            _.extend(API.backendErrorCodes, _.invert(data));
        },
        error: function () {
            console.warn('Loading of  API-Errorcodes failed.');
        }
    });

    return API;
});