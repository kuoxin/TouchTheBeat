define([
    'jquery',
    'underscore',
    'backbone',
    '../util/levelvalidator',
    'text!templates/components/leveltext-input.html',
    'views/LevelPanelView',
    'models/Level'
], function ($, _, Backbone, levelvalidator, Template, LevelPanel, Level) {
    var LevelTextInputView = Backbone.View.extend({
        template: _.template(Template, {}),

        initialize: function (callback) {
            this.callback = callback;
        },

        render: function () {
            this.$el.html(this.template);
            this.containerelement_custom = this.$('.levelcontainer_custom');
            this.inputstatediv = this.$('.inputstatediv');
            return this;
        },

        events: {
            'input .leveljsoninput': 'inputchanged'
        },

        inputchanged: function () {
            var value = this.$('.leveljsoninput').val();

            if (value === '') {
                //value is empty
                this.inputstatediv.removeClass('has-success has-error');
                this.containerelement_custom.slideUp();

                if (this.$(".alert_invalidlevel").is(":visible")) {
                    this.$(".alert_invalidlevel").slideUp();
                }

                if (this.containerelement_custom.is(":visible")) {
                    this.containerelement_custom.slideUp();
                }
            }
            else {
                //value is not empty
                if (levelvalidator.validate(value)) {
                    // input is valid

                    this.inputstatediv.removeClass('has-error').addClass('has-success');
                    if (this.$(".alert_invalidlevel").is(":visible")) {
                        this.$(".alert_invalidlevel").slideUp();
                    }

                    var view = new LevelPanel(this.callback);
                    view.render(new Level(JSON.parse(value), {parse: true}));
                    this.containerelement_custom.html(view.el);

                    if (!this.containerelement_custom.is(":visible")) {
                        this.containerelement_custom.slideDown();
                    }
                }
                else {
                    //input is invalid
                    this.inputstatediv.removeClass('has-success').addClass('has-error');
                    if (this.containerelement_custom.is(":visible")) {
                        this.containerelement_custom.slideUp();
                    }

                    this.$(".alert_invalidlevel").slideDown();

                    if (this.containerelement_custom.is(":visible")) {
                        this.containerelement_custom.slideUp();
                    }
                }
            }
        }

    });
    return LevelTextInputView;
});