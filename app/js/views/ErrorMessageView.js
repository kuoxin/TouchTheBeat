define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/components/errormessagealert.html'
], function ($, _, Framework, plainTemplate) {
    var ErrorMessageView = Framework.View.extend({
        render: function (message) {
            this.$el.html(_.template(plainTemplate, {
                message: message
            }));
            this.$('#alert').fadeIn();
        }
    });
    return ErrorMessageView;
});