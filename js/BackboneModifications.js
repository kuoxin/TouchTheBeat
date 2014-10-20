define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    _.extend(Backbone.View.prototype, {
        dispose: function () {
            //Will unbind all events this view has bound to
            //_.each(this.bindings, function (binding) {
            //     binding.model.unbind(binding.ev, binding.callback);
            // });

            // This will unbind all listeners to events from this view
            //this.unbind();
            //this.undelegateEvents();

            //this.bindings = [];

            this.remove();
            // Uses the default Backbone.View.remove() method which
            // removes this.el from the DOM and removes DOM events.
        }
    });

    var DEBUGDEEPCOPY = false;
    _.extend(Backbone.Model.prototype, {
        toJSON: function () {
            return this.deepcopy(this.attributes);
        },

        deepcopy: function (copyof) {
            var obj = (copyof instanceof Array) ? [] : {};

            for (var k in copyof) {
                if (typeof copyof[k] == "object" && copyof[k] !== null) {
                    if (DEBUGDEEPCOPY) console.log('found ' + typeof copyof[k] + ' ' + k);


                    if (typeof copyof[k].toJSON == "function") {
                        if (DEBUGDEEPCOPY) console.info('.toJSON() method used for nested model/collection ' + k);
                        obj[k] = copyof[k].toJSON();
                    }
                    else {
                        obj[k] = this.deepcopy(copyof[k]);
                    }
                }

                else {
                    if (DEBUGDEEPCOPY) console.log('copied leaf ' + k);
                    obj[k] = copyof[k];
                }
            }
            return obj;
        }
    });

    //console.log('customizing ajax');

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
        var customopts = _.omit(opts, 'success', 'error');

        customopts.success = function (response) {
            if (response.error) {
                console.warn(getRequestToString(method, obj.url) + ' return an error: "' + errorCodeModel.get(response.error) + '"')
                opts.error(errorCodeModel.get(response.error));
            } else {
                console.info(getRequestToString(method, obj.url) + ' successfull.');
                console.log(response.data);
                opts.success(response.data);
            }
        };

        customopts.error = function (jqXHR) {
            console.error(getRequestToString(method, obj.url) + ' failed. (' + jqXHR.status + ')');
            opts.error(jqXHR.status);
        };

        f(method, obj, customopts);
    });

    Backbone.ajax = _.wrap(Backbone.ajax, function (f, params) {
        params.url = 'http://localhost/ttb-backend/' + params.url;
        f(params);
    });

    errorCodeModel.fetch({parse: true});

});