define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/legal.html'
    //'gameclasses/ShapeFactory'
], function ($, _, Framework, legalTemplate/*, ShapeFactory*/) {
    var LegalView = Framework.View.extend({
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