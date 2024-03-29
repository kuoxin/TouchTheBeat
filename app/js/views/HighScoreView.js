define([
    'jquery',
    'underscore',
    'Framework',
    'text!templates/highscore.html',
    'app',
    'util/analytics',
    'lib/bootstrap'
], function ($, _, Framework, highscoreTemplate, app, analytics) {
    var HighScoreView = Framework.View.extend({
        events: {
            'click #btn_gotoChooseLevelView': 'gotoChooseLevelView',
            'click #btn_playagain': 'playagain'
        },
        render: function (game) {
            Framework.history.navigate('highscore', false);

            this.game = game;
            var template = _.template(highscoreTemplate, {highscore: this.game.highscore, levelname: this.game.level.get('name')});
            this.$el.html(template);
        },

        gotoChooseLevelView: function () {
            analytics.trackAction('highscoreview', 'click button', 'gotoChooseLevelview');
			app.showAppContent('chooselevel');
        },

        playagain: function () {
            analytics.trackAction('highscoreview', 'click button', 'playagain');
			app.startLevel(this.game.level);
        }


    });
    return HighScoreView;
});
