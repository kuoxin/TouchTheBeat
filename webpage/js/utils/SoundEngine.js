define([
  'soundmanager2'
], function (soundManager) {
	console.log(soundManager);
	/*	soundManager.setUp({
		// where to find flash audio SWFs, as needed
		preferFlash: false,
		onready: function () {
			console.log("now ready");
		}
	});
	soundManager.beginDelayedInit();
*/
	var SoundEngine = {
		openSound: function (track) {
			var mySound = soundManager.createSound({
				url: '././assets/mp3/' + track
			});
			return mySound;
		}
	};
	console.log(SoundEngine);
	return SoundEngine;
});