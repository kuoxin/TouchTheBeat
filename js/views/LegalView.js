define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/legal.html',
    'app'
], function ($, _, Backbone, legalTemplate, app) {
    var LegalView = Backbone.View.extend({
        el: '#content',
        render: function () {
            var template = _.template(legalTemplate, {});
            this.$el.html(template);
        }
    });
    return LegalView;
});