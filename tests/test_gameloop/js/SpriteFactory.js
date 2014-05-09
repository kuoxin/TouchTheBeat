var SpriteFactory = {};

SpriteFactory.RectangleSprite = function (x, y, width, height, color) {
        var bmd = game.add.bitmapData(1, 1);
        bmd.fillStyle(color);
        bmd.fillRect(0, 0, 1, 1);
        bmd.render();
        console.log(game.spritegroup);
        var sprite = game.spritegroup.create(x, y, bmd);
        sprite.scale.setTo(width, height);
        return sprite;
        
    };

