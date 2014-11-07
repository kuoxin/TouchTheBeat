define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/components/errormessagealert.html'
], function ($, _, Backbone, plainTemplate) {
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