define([
    'jquery',
    'underscore',
    'backbone',
    'models/Level',
    'levelcontainer'
], function ($, _, Backbone, Level, levelcontainer) {
    var LevelCollection = Backbone.Collection.extend({
        model: Level,

        initialize: function () {
            for (var key in levelcontainer) {
                this.add(levelcontainer[key], {parse: true});
            }
            console.log(this);
        }
    });
    return LevelCollection;
});