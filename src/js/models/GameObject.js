define([
    'jquery',
    'underscore',
    'Framework'
], function ($, _, Framework) {
    var GameObject = Framework.Model.extend({
        defaults: {
            shape: {
                type: "circle",
                size: "medium"
            }
        },

        initialize: function () {
            Framework.Select.Me.applyTo(this);
        }
    });

    return GameObject;
});