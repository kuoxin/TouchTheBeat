/**
 * This module extends the Backbone Framework by multiple features needed in TouchTheBeat.
 * @module framework
 * @class Framework
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
	'framework/CollectionView',
	'lib/backbone.paginator',
	'lib/backbone.select'
], function (_, Backbone, Controller, Model, View, GameObject, Renderer, API, CollectionView, PageableCollection) {

	var Framework = Backbone;

	/**
	 * @property {Controller} Controller
	 */
	Framework.Controller = Controller;

	/**
	 * @property {GameObject} GameObject
	 */
	Framework.GameObject = GameObject;

	/**
	 * @property {Renderer} Renderer
	 */
	Framework.Renderer = Renderer;

	/**
	 * @property {CollectionView} CollectionView
	 */
	Framework.CollectionView = CollectionView;

	/**
	 * @property {PageableCollection} PageableCollection
	 */
	Framework.PageableCollection = PageableCollection;

	/**
	 * @property {API} API
	 */
	Framework.API = API;

	return Framework;
});