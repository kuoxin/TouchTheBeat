define(['jquery', 'underscore', 'Framework', 'app'], function ($, _, Framework, app) {
    var initialize = function (host) {
        var ErrorCodeModel = Framework.Model.extend({
            url: 'system/codes',
            parse: function (data) {
                return _.invert(data);
            }
        });

        var errorCodeModel = new ErrorCodeModel();

        var realajax = Framework.ajax;
        Framework.ajax = function (p) {
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
                if (typeof response.data !== 'undefined' && response.data !== null && !response.error) {
                    console.info(stringrep + ' was successfull.');
                    p.success(response.data, p2, p3);
                } else {
                    console.warn(stringrep + ' returned an error: "' + errorCodeModel.get(response.error) + '"');
                    p.error(errorCodeModel.get(response.error) || response.error);
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