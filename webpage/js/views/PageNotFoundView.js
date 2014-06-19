define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/404.html'
], function ($, _, Backbone, pagenotfoundtemplate) {
    var PageNotFoundView = Backbone.View.extend({
        el: '#abovecontent',
        render: function () {
            var template = _.template(pagenotfoundtemplate, {});
            this.$el.html(template);
        }
    });
    return PageNotFoundView;
});