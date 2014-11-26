/**
 This module extends the Backbone Framework by multiple features needed in TouchTheBeat
 */
define([
	'underscore',
	'backbone',
	'framework/Controller',
	'framework/Model',
	'framework/View',
	'framework/GameObject',
	'framework/Renderer',
	'framework/API',
	'lib/backbone.select'
], function (_, Backbone, Controller, Model, View, GameObject, Renderer, API) {
	var Framework = Backbone;
	Framework.Controller = Controller;
	Framework.GameObject = GameObject;
	Framework.Renderer = Renderer;
	return Framework;
});