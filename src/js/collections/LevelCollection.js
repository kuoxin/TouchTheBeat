define([
    'jquery',
    'underscore',
    'backbone',
    'models/Level',
    'levelcontainer'
], function ($, _, Backbone, Level, levelcontainer) {
    var LevelCollection = Backbone.Collection.extend({
        model: Level,

        url: 'levels',

        initialize: function () {
            //for (var key in levelcontainer) {
            //    this.add(levelcontainer[key], {parse: true});
            //}
        }
    });
    return LevelCollection;
});