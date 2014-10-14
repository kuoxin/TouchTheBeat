define([
    'jquery',
    'underscore',
    'backbone',
    'models/GameObject'
], function ($, _, Backbone, GameObject) {
    var GameObjectCollection = Backbone.Collection.extend({
        model: GameObject

        /*
         initialize: function(){
         // debugging purpose
         this.bind('add', function(param){
         console.log(param.toJSON());
         }, this)
         }*/
    });
    return GameObjectCollection;
});