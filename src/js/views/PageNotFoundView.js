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
            $('#alert404').slideDown();
            Framework.history.bind("route", this.updateState);
        },
        updateState: function (router, route) {
            if (route != 'notfound') {
                console.log(route);
                var possiblealert = $('#alert404');
                if (possiblealert !== null) {
                    possiblealert.slideUp();
                }
            }
        }
    });
    return PageNotFoundView;
});