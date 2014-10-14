define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/legal.html',
    //'gameclasses/ShapeFactory'
], function ($, _, Backbone, legalTemplate/*, ShapeFactory*/) {
    var LegalView = Backbone.View.extend({
        el: '#content',
        render: function () {
            var template = _.template(legalTemplate, {});
            this.$el.html(template);
            // can be used for temporaly creation of shape css rules:
            //ShapeFactory.setCSSRules();
        }
    });
    return LegalView;
});