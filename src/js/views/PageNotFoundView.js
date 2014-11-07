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
            $('#alert404').slideDown();
            Backbone.history.bind("route", this.updateState);
        },
        updateState: function (router, route) {
            if (route != 'notfound') {
                console.log(route);
                var possiblealert = $('#alert404');
                if (possiblealert !== null)
                    possiblealert.slideUp();
            }
        }
    });
    return PageNotFoundView;
});