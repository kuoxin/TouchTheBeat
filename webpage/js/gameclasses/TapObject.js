define([
  'jquery',
  'underscore',
  'backbone',
  'snap'
], function ($, _, Backbone, Snap) {
	
	function TapObject (surface, timestamp) {
		var x = surface.getRandomInteger(0, surface.width);
		var y = surface.getRandomInteger(0, surface.height);
		this.surfaceref = surface;
		this.snapobject = surface.snap.circle(x,y,this.radius)
		this.snapobject.attr({
				fill: "#EEEEEE",
				stroke: "#ffffff",
				strokeWidth: this.borderradius
			});

		this.timestamp = timestamp;
		
		this.snapobject.touchend(this.handleTap.bind(this));

		this.snapobject.click(this.handleTap.bind(this));

	};

	TapObject.prototype = {
		highscorevalue : 0,
		highscoremax : 10,
		startborder : -500,
		accepttapfrom: -200,
		accepttapto: 200,
		isActive : true,
		radius : 100,
		borderradius : 10, 

		markMissed : function(){
			console.log('missed');
			this.isActive = false;
			
			this.snapobject.attr({
					fill: "#990000"
				});
			
		},

		markHit: function(){
			console.log('hit');
			this.isActive = false;

			this.snapobject.attr({
				fill: "#bada55"
			});

		},

		handleTap : function(){
			if (this.isActive) {
				var timediff = this.surfaceref.getTime() - this.timestamp;
				console.log(timediff);
				if (timediff > this.accepttapfrom && timediff < this.accepttapto){
					this.markHit();
				}
				else{
					this.markMissed();
				}
			}
				
		},

		markUpcoming: function(percentage){
			this.snapobject.attr({
					strokeWidth: this.borderradius * percentage
				});
		},

		update : function(time){

			if (this.isActive) {

				var timediff =  time - this.timestamp;

				if (time >= (this.timestamp + this.accepttapto)){
					this.markMissed();
				}

				if ( timediff < 0 && timediff >= this.startborder){

						var percentage = timediff/this.startborder;
						if (percentage > 1) {
							percentage = 1;
						}
						if (percentage <0){
							percentage = 0;
						}
						this.markUpcoming(percentage);
				}
			}

		}
	};

	return TapObject;
});