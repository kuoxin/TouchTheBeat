define(['jquery', 'underscore', 'backbone', 'app'], function ($, _, Backbone, app) {
    var initialize = function (host) {
        var ErrorCodeModel = Backbone.Model.extend({
            url: 'system/codes',
            parse: function (data) {
                return _.invert(data);
            }
        });

        var errorCodeModel = new ErrorCodeModel();

        var realajax = Backbone.ajax;
        Backbone.ajax = function (p) {
            var customizedParams = _.clone(p);
            var stringrep = 'API-Request "' + p.type + ' ' + p.url;

            var url = host + p.url;
            if (typeof app.session !== 'undefined' && app.session !== null && app.session.has('hash')) {
                stringrep += ' with session"';// + app.session.get('hash'));
                customizedParams.headers = _.extend(customizedParams.headers || {},
                    {
                        'ttbSession': app.session.get('hash')
                    });
            }
            else{
                stringrep += ' without session"';
            }

            customizedParams.success = function (response, p2, p3) {
                if (response.error) {
                    console.warn(stringrep + ' returned an error: "' + errorCodeModel.get(response.error) + '"');
                    p.error(errorCodeModel.get(response.error) || response.error);
                } else {
                    console.info(stringrep + ' was successfull.');
                    p.success(response.data, p2, p3);
                }
            };

            customizedParams.error = function (jqXHR) {
                console.error(stringrep + ' failed. (' + jqXHR.status + ')');
                p.error(jqXHR.status);
            };

            realajax(url, customizedParams);
            console.info(stringrep + ' raised');
        };

        errorCodeModel.fetch({
            parse: true
        });
    };
    return {
        initialize: initialize
    };

});