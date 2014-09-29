define([
    'jquery',
    'underscore',
    'backbone',
    'models/GameObject'
], function ($, _, Backbone, GameObject) {
    var GameObjectCollection = Backbone.Collection.extend({
        model: GameObject
    });
    return GameObjectCollection;
});