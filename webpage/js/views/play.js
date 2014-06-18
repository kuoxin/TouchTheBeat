define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/play.html',
  'snap',
  'utils/SoundEngine',
  'views/applicationwithmenu',
  'gameclasses/Surface',
  'gameclasses/TapObject',
  'utils/RequestAnimationFrame',

], function ($, _, Backbone, playTemplate, Snap, SoundEngine, ApplicationWithMenuView, Surface,TapObject) {
	var PlayView = Backbone.View.extend({
		el: '#body',
		time: 0,
		endtime: 0,
		gameobjects: [],
		stopped: true,

		render: function (level, returntoview) {
			this.level = level;
			var template = _.template(playTemplate, {});
			this.$el.html(template);
			this.returntoview = returntoview;

			this.surface = new Surface(this);

			for (var i = 1; i < 5; i++) {
				this.gameobjects.push(new TapObject(this.surface, i*1000));
			}

			console.log(this.gameobjects);

			this.start();

		},

		start: function () {
			this.starttime =  new Date().getTime();
			this.endtime = this.starttime + 5000;
			this.stopped = false;
			console.log('now running');

			this.updateinterval = setInterval(this.update.bind(this), 1000 / 60);
			//this.updateView();
		},

		getTimeDelta : function(){
			return new Date().getTime() - this.starttime;
		},


		update: function () {
			if (this.getTimeDelta()+this.starttime >= this.endtime) {
				this.stop();
			}

			for (var i = 0; i < this.gameobjects.length; i++) {
				this.gameobjects[i].update(this.getTimeDelta());
			}


		},

/*		updateView: function () {
			if (!this.stopped) {
				for (var i = 0; i < this.gameobjects.length; i++) {
					gameobjects[i].updateView(this.getTimeDelta());
				}
				requestAnimationFrame(this.updateView.bind(this));
			}
		},*/

		stop: function () {
			clearInterval(this.updateinterval);
			this.stopped = true;
			console.log("now stopped");
			console.log('length: '+this.getTimeDelta());
			console.log(this);
			$('#svg').fadeOut(1000);

			//for now
			this.close();
		},

		calculateHighScore: function () {
			return '100%';
		},

		close : function (){
			Backbone.history.navigate('chooselevel');
			window.location.reload();
		}



	});
	return PlayView;
});