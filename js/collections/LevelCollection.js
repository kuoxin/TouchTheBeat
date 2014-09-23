define([
    'jquery',
    'underscore',
    'backbone',
    'models/Level'
], function ($, _, Backbone, Level) {
    var LevelCollection = Backbone.Collection.extend({
        model: Level
    });
    return LevelCollection;
});