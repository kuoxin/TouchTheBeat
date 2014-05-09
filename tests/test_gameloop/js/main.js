//(function() {
    var game = new Phaser.Game(1600, 1200, Phaser.AUTO);

    game.state.add('preloader', TTB.Preloader, true);
    game.state.add('mainmenu', TTB.MainMenu);
    game.state.add('game', TTB.Game);

//   })();


// Thanks to Gopherwood Studios and html5rocks.com for this tutorial:
// http://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/
function resizeGamePanel() {
var gamePanel = document.getElementById('gamePanel');
        var widthToHeight = 4 / 3;
        var newWidth = window.innerWidth;
        var newHeight = window.innerHeight;
        var newWidthToHeight = newWidth / newHeight;


        if (newWidthToHeight > widthToHeight) {
                newWidth = newHeight * widthToHeight;
                gamePanel.style.height = newHeight + 'px';
                gamePanel.style.width = newWidth + 'px';
        } else {
                newHeight = newWidth / widthToHeight;
                gamePanel.style.width = newWidth + 'px';
                gamePanel.style.height = newHeight + 'px';
        }
        
        var scalex = newWidth/game.width;
        var scaley = newHeight/game.height;
        
        game.width = newWidth;
        game.height = newHeight;
        game.stage.bounds.width = newWidth;
        game.stage.bounds.height = newHeight;

        if (game.renderType === Phaser.WEBGL)
        {
                game.renderer.resize(newWidth, newHeight);
        }
        
        gamePanel.style.left = window.innerWidth/2 - newWidth/2 +'px';
      //  game.world.getAt(0).forEach(function(item, scalex, scaley) {
      //      item.x *= scalex;
     //       item.y *= scaley;
            
            //TODO better scaling
            //item.scale.setTo(item.scale.x*scalex, item.scale.y*scaley);
        
       // }, this, true, scalex, scaley);
    
    
}	

window.onload = function() {
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
    resizeGamePanel();
};
window.addEventListener('resize', resizeGamePanel, false);
window.addEventListener('orientationchange', resizeGamePanel, false);
