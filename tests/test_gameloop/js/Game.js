TTB.Game = function (game) {

	this.game = game;
        this.level = null;
        this.spritegroup = null;

};

TTB.Game.prototype = {

	preload: function () {
            this.game.load.text('level', 'level.json');
	},

	create: function () {
                console.info("creating game");
                this.level = JSON.parse(this.game.cache.getText('level'));
                console.log(this.level);
                this.timer = new Phaser.Timer(this.game, false);
                this.spritegroup = this.game.add.group();
                this.text = this.game.add.text(10, 10, "", {
                    font: "20px Arial",
                    fill: "#FFFFFF",
                    align: "left"
                });
                
                
                
		this.game.input.onDown.add(this.quitToMenu, this);
//                var currentgo = null;
//                for(var i = 0; i < this.level.GameObjects.length; i++)
//                {
//                    currentgo = this.level.GameObjects[i];
//                    this.game.time.events.add(currentgo.time, this.showTapObject, this, currentgo);
//                }
                
                this.timer.start();
	},
        
        showTapObject: function(tapobject)
        {
            console.log("showing tap object "+tapobject.id+" with a delay of  "+(this.timer.seconds()*1000-tapobject.time)+" ms.");
            var bmd = this.game.add.bitmapData(1, 1);
            bmd.fillStyle(tapobject.spritedata.color);
            bmd.fillRect(0, 0, 1, 1);
            bmd.render();
            var sprite = this.spritegroup.create(tapobject.spritedata.x, tapobject.spritedata.y, bmd);
            sprite.scale.setTo(tapobject.spritedata.width, tapobject.spritedata.height);
            console.log(sprite);
        },
        
        update: function() {
            this.text.setText(this.timer.seconds());
            
            this.updateGameObjects();
            
            
        },
        
        updateGameObjects : function() {
            var currentgo = null;
            for(var i = 0; i < this.level.GameObjects.length; i++)
            {
               currentgo = this.level.GameObjects[i];
               if (typeof currentgo.finished == 'undefined')
               {
                   console.log("new GameObject");
                   currentgo.finished = false;
                   continue;
               }
               
               if (currentgo.finished == false)
               {
                   if(currentgo.time <= this.timer.seconds()*1000)
                   {
                       this.showTapObject(currentgo);
                       currentgo.finished = true;
                   }
               }
            }
        },

	quitToMenu: function () {

		console.log('going back to main menu');

		this.game.state.start('mainmenu');

	}

}
