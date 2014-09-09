define([
    'jquery',
    'underscore',
    'backbone',
    'util/levelvalidator',
    'text!templates/leveloverview.html',
    'views/components/html/levelpanel',
    'views/PlayView',
    'levelcontainer'
], function ($, _, Backbone, levelvalidator, LevelOverviewTemplate, LevelPanel, PlayView, levelcontainer) {
    var ChooseLevelView = Backbone.View.extend({
        render: function () {
            Backbone.history.navigate('chooselevel', {trigger: false, replace: true});
            var template = _.template(LevelOverviewTemplate, {});
            this.$el.html(template);
            this.levelpanelviews = [];
            this.containerelement_packaged = $('#levelcontainer_packaged');
            this.containerelement_custom = $('#levelcontainer_custom');
            this.inputstatediv = $('#inputstatediv');
            this.containerelement_packaged.html('');
            for (var i = 0; i < levelcontainer.length; i++) {
                var clevel = levelcontainer[i];
                var view = new LevelPanel();
                view.render(clevel);
                this.containerelement_packaged.append(view.el);
                this.levelpanelviews.push(view);
            }
        },

        events: {
            'input #leveljsoninput': 'inputchanged'
        },

        inputchanged: function () {
            var value = $('#leveljsoninput').val();

            if (value == '') {
                //value is empty
                this.inputstatediv.removeClass('has-success has-error');
                this.containerelement_custom.slideUp();

                if (this.$("#alert_invalidlevel").is(":visible")) {
                    this.$("#alert_invalidlevel").slideUp();
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
                    if (this.$("#alert_invalidlevel").is(":visible")) {
                        this.$("#alert_invalidlevel").slideUp();
                    }

                    var view = new LevelPanel();
                    view.render(JSON.parse(value));
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

                    this.$("#alert_invalidlevel").slideDown();

                    if (this.containerelement_custom.is(":visible")) {
                        this.containerelement_custom.slideUp();
                    }

                }
            }


        }
    });
    return ChooseLevelView;
});