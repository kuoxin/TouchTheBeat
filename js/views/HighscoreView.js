define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/highscore.html',
    'app',
    'util/analytics',
    'bootstrap'
], function ($, _, Backbone, highscoreTemplate, app, analytics) {
    var HighScoreView = Backbone.View.extend({
        el: '#content',
        events: {
            'click #btn_gotoChooseLevelView': 'gotoChooseLevelView',
            'click #btn_playagain': 'playagain'
        },
        render: function (game) {
            Backbone.history.navigate('highscore', false);

            this.game = game;
            var template = _.template(highscoreTemplate, {highscore: this.game.highscore, levelname: this.game.level.get('name')});
            this.$el.html(template);
        },

        gotoChooseLevelView: function () {
            analytics.trackAction('highscoreview', 'click button', 'gotoChooseLevelview');
            Backbone.history.navigate('chooselevel', true);
        },

        playagain: function () {
            analytics.trackAction('highscoreview', 'click button', 'playagain');
            console.log(this.game);
            app.startlevel(this.game.level);
        }


    });
    return HighScoreView;
});