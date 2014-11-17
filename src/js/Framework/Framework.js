/**
 This module extends the Backbone Framework by multiple features needed in TouchTheBeat
 */
define([
    'backbone',
    'framework/Controller',
    'framework/Model',
    'framework/View',
    'framework/GameObject',
    'framework/Renderer',
    'lib/backbone.select'
], function (Backbone, Controller, Model, View, GameObject, Renderer) {
    var Framework = Backbone;
    Framework.Controller = Controller;
    Framework.GameObject = GameObject;
    Framework.Renderer = Renderer;
    return Framework;
});