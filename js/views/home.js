define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.html'
], function ($, _, Backbone, homeTemplate) {
    var HomeView = Backbone.View.extend({
        el: '#content',
        render: function () {
            console.log(this);
            var template = _.template(homeTemplate, {});
            this.$el.html(template);
        }
    });
    return HomeView;
});