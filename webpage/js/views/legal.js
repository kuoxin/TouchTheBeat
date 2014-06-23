define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/legal.html'
], function ($, _, Backbone, legalTemplate) {
    var LegalView = Backbone.View.extend({
        el: '#content',
        render: function () {
            var template = _.template(legalTemplate, {});
            this.$el.html(template);
        }
    });
    return LegalView;
});