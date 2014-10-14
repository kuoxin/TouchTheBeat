define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var GameObject = Backbone.Model.extend({
        defaults: {
            shape: {
                type: "circle",
                size: "medium"
            }
        },

        parse: function (data) {
            var obj = {};
            for (var k in data) {
                switch (k) {
                    case 'tapTime':
                        obj['tapTime'] = data[k];
                        break;
                    default:
                        obj[k] = data[k];
                }
            }
            return obj;
        }
    });

    return GameObject;
});