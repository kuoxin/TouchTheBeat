define([
    'jquery',
    'underscore',
    'Framework'
], function ($, _, Framework) {
    /**
     * @module models
     * @class GameObject
     * @extends Model
     * @type {*|void}
     */
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