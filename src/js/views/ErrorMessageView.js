define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/errormessagealert.html',
    'app'
], function ($, _, Backbone, plainTemplate, app) {
    var ErrorMessageView = Backbone.View.extend({
        initialize: function () {
        },
        events: {
        },
        render: function (message) {
            this.$el.html(_.template(plainTemplate, {
                message: message
            }));
            this.$('#alert').fadeIn();
        }
    });
    return ErrorMessageView;
});