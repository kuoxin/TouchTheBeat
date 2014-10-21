define(['jquery', 'underscore', 'backbone', 'app'], function ($, _, Backbone, app) {
    var initialize = function () {
        var getRequestToString = function (method, route) {
            return 'API-Request ' + method + ' ' + route;
        };

        var ErrorCodeModel = Backbone.Model.extend({
            url: 'system/codes',
            parse: function (data) {
                return _.invert(data);
            }
        });

        var errorCodeModel = new ErrorCodeModel();

        Backbone.sync = _.wrap(Backbone.sync, function (f, method, obj, opts) {
            var customopts = _.omit(opts, 'success', 'error', 'headers');
            if (app.session != undefined && app.session != null && app.session.has('hash')) {
                console.info(getRequestToString(method, obj.url) + ' requesting with authorization key');// + app.session.get('hash'));
                customopts.headers = _.extend(opts.headers || {},
                    {
                        'ttbSession': app.session.get('hash')
                    });
            }
            else {
                console.info(getRequestToString(method, obj.url) + ' requesting without authorization key');
            }

            customopts.url = 'http://localhost/ttb-backend/' + obj.url;

            customopts.success = function (response) {
                if (response.error) {
                    console.warn(getRequestToString(method, obj.url) + ' return an error: "' + errorCodeModel.get(response.error) + '"')
                    opts.error(errorCodeModel.get(response.error));
                } else {
                    console.info(getRequestToString(method, obj.url) + ' successfull.');
                    opts.success(response.data);
                }
            };

            customopts.error = function (jqXHR) {
                console.error(getRequestToString(method, obj.url) + ' failed. (' + jqXHR.status + ')');
                opts.error(jqXHR.status);
            };

            f(method, obj, customopts);
        });

        errorCodeModel.fetch({parse: true});
    };
    return {
        initialize: initialize
    };

});