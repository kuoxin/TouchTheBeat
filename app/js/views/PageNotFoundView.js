define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/404.html'
], function ($, _, Framework, pagenotfoundtemplate) {
    var PageNotFoundView = Framework.View.extend({
        render: function () {
            var template = _.template(pagenotfoundtemplate, {});
            this.$el.html(template);
        }
    });
    return PageNotFoundView;
});
