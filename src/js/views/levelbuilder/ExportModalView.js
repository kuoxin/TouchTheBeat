define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/components/levelexportmodal.html'
], function ($, _, Framework, plainTemplate) {
    var ExportModalView = Framework.View.extend({

        tagName: 'div',

        template: _.template(plainTemplate, {}),

        initialize: function () {
        },

        events: {
        },

        render: function (level) {
            console.log(level);
            this.$el.html(this.template);
            this.$('#exportmodalcontent').html(JSON.stringify(level));
            this.$('#exportmodal').modal('show');

        }
    });

    return ExportModalView;
});