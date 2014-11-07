define([
    'jquery',
    'underscore',
    'backbone',
    'models/GameObject'
], function ($, _, Backbone, GameObject) {
    var GameObjectCollection = Backbone.Collection.extend({
        model: GameObject,


        initialize: function (models) {
            Backbone.Select.Many.applyTo(this, models);
        }

    });
    return GameObjectCollection;
});