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
            this.html = _.template(legalTemplate, {});
            app.setContent(this);
        }
    });
    return LegalView;
});