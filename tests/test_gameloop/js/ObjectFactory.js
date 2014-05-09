var ObjectFactory = {};


function TapObject(sprite, timestamp)
{
   var tapobject = new Object();
   tapobject.sprite = sprite;
   tapobject.sprite.inputEnabled = true;
   console.log(tapobject);
   return tapobject;
};

function DragObject(movingsprite, destinationsprite, timestart, timeend)
{
    //use game.physics.overlap() for check and draggable true/false in timing
   var dragobject = new Object();
   dragobject.sprite = movingsprite;
   dragobject.sprite.inputEnabled = true;
   dragobject.sprite.input.enableDrag(true);
   console.log(dragobject);
   return dragobject;
};

