define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/home.html'
], function ($, _, Framework, homeTemplate) {
    var HomeView = Framework.View.extend({
        el: '#content',
        render: function () {
            var template = _.template(homeTemplate, {});
            this.$el.html(template);
        }
    });
    return HomeView;
});