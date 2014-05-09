TTB.MainMenu = function (game) {

	//	Our main menu
	this.game = game;

};

TTB.MainMenu.prototype = {

	create: function () {
        this.spritegroup = game.add.group();
        button = this.game.add.button(this.game.world.centerX, 400, 'button', this.startGame, this, 2, 1, 0);
        button.anchor.setTo(0.5, 0.5);
        this.startGame();
        

	},

	startGame: function () {

		console.log('lets play');
		this.game.state.start('game');

	}

}
