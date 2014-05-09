var TTB = {};

TTB.Preloader = function (game) {

	this.game = game;

};

TTB.Preloader.prototype = {

	preload: function () {


	},

	create: function () {
        this.spritegroup = game.add.group();
		console.log('Preloading finished, going to the main menu');

		this.game.state.start('mainmenu');

	}

}
