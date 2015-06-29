// CONSTRUCTORS & EXTENSION METHODS /////////////////////////////////////////////

// NUMBER //
Math.Clamp = function ( num , min , max ) {
    return Math.min(Math.max(num,min),max);
};

Math.ModNearestInt = function( a , b) {
    return a - b * Math.round(a / b);
}

// VECTOR 2 //
function Vector2( x , y ) {
    this.x = x;
    this.y = y;
    var DEGRAD = 0;
};
Vector2.prototype.Zero = function() { return new Vector2(0,0); };
Vector2.prototype.One = function() { return new Vector2(1,1); };
Vector2.prototype.Add = function( vector ) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
};
Vector2.prototype.Subtract = function( vector ) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
};
Vector2.prototype.Multiply = function (vector) {
    return new Vector2(this.x * vector.x, this.y * vector.y);
};
Vector2.prototype.Divide = function (vector) {
    return new Vector2(this.x / vector.x, this.y / vector.y);
};
Vector2.prototype.distance = function (vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};
Vector2.prototype.distanceSqr = function (vector) {
    var deltaX = this.x - vector.x;
    var deltaY = this.y - vector.y;
    return (deltaX * deltaX + deltaY * deltaY);
};
Vector2.prototype.Magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector2.prototype.SqrMagnitude = function () {
    return this.x * this.x + this.y * this.y;
};
Vector2.prototype.normalize = function () {
    var mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (mag === 0) {
        this.x = 0;
        this.y = 0;
    } else {
        this.x = this.x / mag;
        this.y = this.y / mag;
    }
};
Vector2.prototype.getNormalized = function () {
    var mag = Math.sqrt(this.x * this.x + this.y * this.y);
    return new Vector2(this.x / mag, this.y / mag);
};
Vector2.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x) * 180 / Math.PI;
};
Vector2.prototype.degToVec = function (deg) {
    var rad = deg * DEGRAD;
    return new Vector2(Math.cos(rad), Math.sin(rad));
};
Vector2.prototype.radToVec = function (rad) {
    return new Vector2(Math.sin(rad), Math.cos(rad));
};
Vector2.prototype.dot = function (vector) {
    return (this.x * vector.x + this.y * vector.y);
};
Vector2.prototype.rotate = function (deg) {
    var rad = deg * DEGRAD;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    this.x = this.x * cos - this.y * sin;
    this.y = this.y * cos + this.x * sin;
};
Vector2.prototype.perpRight = function () {
    return new Vector2(-this.y, this.x);
};
Vector2.prototype.toString = function () {
    return ("x : " + this.x * 100 / 100 + ", \ty : " + this.y * 100 / 100);
};
Vector2.prototype.Clamp = function( min , max ) {
    this.x = Math.min(Math.max(this.x, min), max);
    this.y = Math.min(Math.max(this.y, min), max);
};
Vector2.prototype.Copy = function() {
    return new Vector2( this.x , this.y );
};

// RECT //
function Rect ( x , y , w , h ) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.IsMouseOver = function () { return IntersectionRectPoint( this, new Vector2(mouse.x, mouse.y) ); }
}

// CIRCLE //
function Circle ( x , y , r ) {
    this.x = x;
    this.y = y;
    this.r = r;
}

// TRANSFORM //
function Transform ( position , rotation ) {
    this.position = position;
    this.rotation = rotation;
    this.scale = new Vector2( 1 , 1 );
    this.Translate = function ( x , y ) {
        this.position.x += x;
        this.position.y += y;
    };
}

// LEVEL //
function Level(name, world, sprites, playerStart, exit) {
    var initialArguments = {
        _name: undefined,
        _world: undefined,
        _sprites: undefined,
        _playerStart: undefined,
        _exit: undefined
    };
    initialArguments._name = name;
    initialArguments._world = [];
    for (var i = 0; i < world.length; i++) { initialArguments._world.push(world[i].Copy()); }
    initialArguments._sprites = [];
    for (var i = 0; i < sprites.length; i++) { initialArguments._sprites.push(sprites[i].Copy()); }
    initialArguments._exit = exit.Copy();
    initialArguments._playerStart = playerStart.Copy();
    //
    this.name = name;
    //
    this.world = world;
    //
    this.sprites = sprites;
    //
    this.playerStartPosition = playerStart;
    //
    this.exit = exit;
    //
    this.isLevelCompleted = false;
    //
    this.Initialize = function () {
        this.name = initialArguments._name;
        //
        this.world = [];
        for (var i = 0; i < initialArguments._world.length; i++) { this.world.push(initialArguments._world[i].Copy()); }
        //
        this.sprites = [];
        for (var i = 0; i < initialArguments._sprites.length; i++) { this.sprites.push(initialArguments._sprites[i].Copy()); }
        //
        this.playerStartPosition = initialArguments._playerStart.Copy();
        this.exit = initialArguments._exit.Copy();
        //console.log(this.initialArguments);
        player.transform.position.x = this.playerStartPosition.x*64;
        player.transform.position.y = this.playerStartPosition.y*64;
    };
    //
    this.IsRectOverWorld = function (rect, ignoreField, isRectCollider) {
        var result = false;
        for (var i = 0; i < this.world.length;i++) {
            var f = this.world[i];
            if (f.image.isCollider ){
                if (f !== ignoreField) {
                    if (IntersectionRects(f.GetRect(), rect)) {
                        if (isRectCollider === true) {
                            if (typeof f.OnCollision === "function") { f.OnCollision(f); }
                        }
                        result = true;
                        break;
                    }
                }
            }
            else {
                if (isRectCollider === true) {
                    if (IntersectionRects(f.GetRect(), rect)) {
                        if (typeof f.OnTrigger === "function") { f.OnTrigger(f); }
                    }
                }
            }
        }
        return result;
    };
    //
    this.IsRectOverExit = function (rect) {
        var result = false;
        for (var i = 0; i < this.exit.length; i++) {
            var d = this.exit[i];
            if (IntersectionRects(d.GetRect(), rect)) {
                result = true;
                break;
            }
        }
        return result;
    };
    //
}

// FIELD //
function Field(x, y, rotation, image, isMovable, isDestructible, OnCollision, OnTrigger) {
    //
    this.transform = new Transform( new Vector2(x*64,y*64) , rotation );
    //
    this.image = image;
    //
    this.IsMouseOver = function () {
        return this.image.IsMouseOver( this.transform.position.x , this.transform.position.y );
    };
    //
    this.ContainsPoint = function( vec2Point ){
        return IntersectionRectPoint(new Rect(this.transform.position.x + 1, this.transform.position.y + 1, this.image.width - 2, this.image.height - 2), vec2Point);
    };
    //
    this.GetRect = function () { return new Rect(this.transform.position.x + 1, this.transform.position.y + 1, 62, 62); };
    //
    this.isMovable = isMovable;
    if (isMovable !== false && isMovable !== true) { this.isMovable = false; }
    //
    this.direction = Direction.none;
    //
    this.DirectionVector = function () {
        return Direction.toVector(this.direction);
    };
    //
    this.DirectionToCoursor = function () {
        return new Vector2(mouse.x, mouse.y).Subtract(new Vector2(this.transform.position.x + 32, this.transform.position.y + 32));
    };
    //
    this.Draw = function () {
        this.image.DrawRotated(this.transform.position.x, this.transform.position.y, this.transform.rotation);
    }
    //
    this.InPlayersReach = function () {
        if (new Vector2(player.transform.position.x - this.transform.position.x, player.transform.position.y - this.transform.position.y).SqrMagnitude() <= 5000) { return true; }
        else { return false; }
    }
    //
    this.isDestructible = isDestructible;
    if (isDestructible !== false && isDestructible !== true) { this.isDestructible = false; }
    //
    this.OnCollision = OnCollision;
    //
    this.OnTrigger = OnTrigger;
    //
    this.Copy = function () {
        return new Field(x, y, rotation, image, isMovable, isDestructible, OnCollision, OnTrigger);
    };
    //
};

var Direction = { none:0 , right:1 , left:2 , up:3 , down:4 };
Direction.toVector = function( dir ){
    if( dir===this.none ) {return new Vector2(0,0);}
    else if( dir===this.right ) {return new Vector2(1,0);}
    else if (dir === this.left) { return new Vector2(-1, 0); }
    else if (dir === this.up) { return new Vector2(0, -1); }
    else if (dir === this.down) { return new Vector2(0, 1); }
};

// PLAYER //
function Player(x, y) {
    //
    this.transform = new Transform(new Vector2(x * 64, y * 64), 0);
    //
    this.isSelected = false;
    //
    this.direction = Direction.none;
    //
    this.inventory = [];
    //
    this.DirectionVector = function () {
        return Direction.toVector(this.direction);
    };
    //
    this.IsMouseOver = function () {
        return IsMouseOver(this.transform.position.x, this.transform.position.y, 64, 64);
    };
    //
    this.DirectionToCoursor = function() {
        return new Vector2(mouse.x,mouse.y).Subtract( new Vector2( player.transform.position.x+32 , player.transform.position.y+32 ) );
    };
    //
    this.GetCenter = function () {
        return new Vector2(this.transform.position.x + 32, this.transform.position.y + 32);
    };
    //
    this.GetRect = function () {
        return new Rect(this.transform.position.x + 1, this.transform.position.y + 1, 62, 62);
    };
    //
}

// PLAYER EXIT //
function PlayerExit ( x , y ) {
    this.transform = new Transform(new Vector2(x * 64, y * 64), 0);
    this.GetRect = function () { return new Rect(this.transform.position.x + 1, this.transform.position.y + 1, 62, 62); };
    this.Copy = function () { return new PlayerExit(x,y); }
}

// SPRITE //
function Sprite ( image , x , y , rotation , scale ) {
    this.image = image;
    this.Draw = function(){
        this.image.DrawResizedRotated( x-this.image.width*this.transform.scale.x/2 , y-this.image.height*this.transform.scale.y/2 , this.image.width*this.transform.scale.x , this.image.height*this.transform.scale.y , rotation );
    };
    if( rotation instanceof Number===false ){ rotation = 0; }
    this.transform = new Transform(new Vector2(x, y), rotation);
    //
    if( scale instanceof Vector2 === false ){ scale = new Vector2(1,1); }
    this.transform.scale = scale;
    //
    this.IsMouseOver = function () {
        var computedWidth = this.image.width * this.transform.scale.x;
        var computedHeight = this.image.height * this.transform.scale.y;
        return IsMouseOver(this.transform.position.x - computedWidth/2, this.transform.position.y - computedHeight / 2, computedWidth, computedHeight);
    }
    //
    this.Copy = function () {
        return new Sprite(image, x, y, rotation, scale);
    };
    //
}

// EXTENSION METHODS /////////////////////////////////////////////

Image.prototype.Draw = function ( x , y ) {
    ctx.drawImage( this , x , y , this.width , this.height );
};

Image.prototype.DrawRotated = function ( x , y , degrees ) {
    ctx.save();
    ctx.translate( x+this.width/2 , y+this.height/2 );
    ctx.rotate( Math.PI/180*degrees );
    ctx.drawImage( this , -this.width/2 , -this.height/2 );
    ctx.restore();
};

Image.prototype.DrawResized = function ( x , y , w , h ) {
    ctx.drawImage( this , x , y , w , h );
};

Image.prototype.DrawResizedRotated = function ( x , y , w , h , degrees ) {
    ctx.save();
    ctx.translate( x+w/2 , y+h/2 );
    ctx.rotate( Math.PI/180*degrees );
    ctx.drawImage( this , -w/2 , -h/2 , w , h );
    ctx.restore();
};

IntersectionRectPoint = function (rect, point) {
    if( point.x >= rect.x && point.x <= rect.x + rect.width ){
        if (point.y >= rect.y && point.y <= rect.y + rect.height) { return true; }
        else{ return false; }
    }
    else{ return false; }
};

IntersectionRects = function ( rect1 , rect2 ) {
    //if( margin instanceof Number === false ){ margin = 0; }
    if( rect1.x<rect2.x+rect2.width && rect1.x+rect1.width>rect2.x && rect1.y<rect2.y+rect2.height && rect1.height+rect1.y>rect2.y ){
        //ctx.fillStyle = 'rgb(255,255,255)'; ctx.fillRect( rect1.x , rect1.y , rect1.width , rect1.height );
        return true; }
    else {
        //ctx.fillStyle = 'rgb(0,0,0)'; ctx.fillRect( rect1.x , rect1.y , rect1.width , rect1.height );
        return false; }
};

IntersectionCircles = function ( circle1 , circle2 ) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var dist = Math.sqrt(dx * dx + dy * dy); 
    if( dist<circle1.r+circle2.r ){ return true; }
    else{ return false; }
};

IntersectionCirclePoint = function ( circle1 , point ) {
    var dx = circle1.x - point.x;
    var dy = circle1.y - point.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < circle1.r) { return true; }
    else { return false; }
};

IsMouseOver = function ( x , y , w , h ) {
    if( mouse.x>=x && mouse.x<=x+w ) {
        if( mouse.y>=y && mouse.y<=y+h ) { return true; }
        else{ return false; }
    }
    else{ return false; }
};

Normalize = function ( v ) {//if( v instanceof Vector2 ){}
    var dist = Math.Sqrt( v.x * v.x + v.y * v.y );
    return new Vector2( v.x/dist , v.y/dist );
};

Image.prototype.IsMouseOver = function ( x , y ) {
    return IsMouseOver( x , y , this.width , this.height );
};

// ASSETS /////////////////////////////////////////////////////////////////////

//
var images = {};
//
images.background = new Image();
images.background.src = 'mpibp_data/images/background.gif';
//
images.uiBarBottom = new Image();
images.uiBarBottom.src = 'mpibp_data/images/foreground.gif';
//
images.coursor = new Image();
images.coursor.src = 'mpibp_data/images/coursor.png';
images.coursor.rotation = 0;
//
images.player = new Image();
images.player.src = 'mpibp_data/images/player-0.gif';
images.player.rotation = 0;
images.player.rotationTarget = 0;
//
images.playerSelected = new Image();
images.playerSelected.src = 'mpibp_data/images/player-0_selected.gif';
//
images.playerSteps = new Image();
images.playerSteps.src = 'mpibp_data/images/player-steps.gif';
images.playerSteps.rotation = 0;
//
images.playerStepsStop = new Image();
images.playerStepsStop.src = 'mpibp_data/images/player-steps-stop.gif';
images.playerStepsStop.rotation = 0;
//
images.objectSteps = new Image();
images.objectSteps.src = 'mpibp_data/images/object-steps.gif';
images.objectSteps.rotation = 0;
//
images.buttonRestart = new Image();
images.buttonRestart.src = 'mpibp_data/images/button-restart.gif';
images.buttonRestart.rect = new Rect(128, 385, 64, 32);
//
images.buttonRestartMouseOver = new Image();
images.buttonRestartMouseOver.src = 'mpibp_data/images/button-restart_mouseover.gif';
//
images.stairs = new Image();
images.stairs.src = 'mpibp_data/images/stairs.gif';
//
images.stairs_onmouseover = new Image();
images.stairs_onmouseover.src = 'mpibp_data/images/stairs_mouseover.gif';
//
images.entrance = new Image();
images.entrance.src = 'mpibp_data/images/entrance.gif';
//
images.entranceActive = new Image();
images.entranceActive.src = 'mpibp_data/images/entrance-active.gif';
//
images.flowers1 = new Image();
images.flowers1.src = 'mpibp_data/images/flowers-1.gif';
//
images.flowers2 = new Image();
images.flowers2.src = 'mpibp_data/images/flowers-2.gif';
//
images.wallMockup = new Image();
images.wallMockup.src = 'mpibp_data/images/mockup-wall.gif';
images.wallMockup.isCollider = true;
//
images.wall1I = new Image();
images.wall1I.src = 'mpibp_data/images/wall-1-I.gif';
images.wall1I.isCollider = true;
//
images.wall1L = new Image();
images.wall1L.src = 'mpibp_data/images/wall-1-L.gif';
images.wall1L.isCollider = true;
//
images.wall1L2 = new Image();
images.wall1L2.src = 'mpibp_data/images/wall-1-L2.gif';
images.wall1L2.isCollider = true;
//
images.wall1T = new Image();
images.wall1T.src = 'mpibp_data/images/wall-1-T.gif';
images.wall1T.isCollider = true;
//
images.wall1T2 = new Image();
images.wall1T2.src = 'mpibp_data/images/wall-1-T2.gif';
images.wall1T2.isCollider = true;
//
images.wall1Gap = new Image();
images.wall1Gap.src = 'mpibp_data/images/wall-1-gap.gif';
images.wall1Gap.isCollider = false;
//
images.wall1End = new Image();
images.wall1End.src = 'mpibp_data/images/wall-1-end.gif';
images.wall1End.isCollider = false;
//
images.wall1End2 = new Image();
images.wall1End2.src = 'mpibp_data/images/wall-1-end2.gif';
images.wall1End2.isCollider = false;
//
images.doorInaccessible = new Image();
images.doorInaccessible.src = 'mpibp_data/images/door-inaccessible.gif';
images.doorInaccessible.isCollider = true;
//
images.stoneBig1 = new Image();
images.stoneBig1.src = 'mpibp_data/images/stone-big-1.gif';
images.stoneBig1.isCollider = true;
//
images.pathI = new Image();
images.pathI.src = 'mpibp_data/images/path-I.png';
images.pathI.isCollider = false;
//
images.pathL = new Image();
images.pathL.src = 'mpibp_data/images/path-L.png';
images.pathL.isCollider = false;
//
images.pathT = new Image();
images.pathT.src = 'mpibp_data/images/path-T.png';
images.pathT.isCollider = false;
//
images.pathEnd = new Image();
images.pathEnd.src = 'mpibp_data/images/path-end.png';
images.pathEnd.isCollider = false;
//
images.itemKey = new Image();
images.itemKey.src = 'mpibp_data/images/item-key-1.gif';
images.itemKey.isCollider = false;
//
images.tree1 = new Image();
images.tree1.src = 'mpibp_data/images/tree-1.gif';
images.tree1.isCollider = false;
//
images.shadowRadial = new Image();
images.shadowRadial.src = 'mpibp_data/images/shadow-radial-1.png';
//
images.woodenBarrel1 = new Image();
images.woodenBarrel1.src = 'mpibp_data/images/wooden-barrel-1.gif';
images.woodenBarrel1.isCollider = true;
//
images.decoPond1 = new Image();
images.decoPond1.src = 'mpibp_data/images/deco-pond-1.gif';
//
images.trap1 = new Image();
images.trap1.src = 'mpibp_data/images/trap-1.gif';
images.trap1.isCollider = true;
//
images.trap1Disarmed = new Image();
images.trap1Disarmed.src = 'mpibp_data/images/trap-1-disarmed.gif';
images.trap1Disarmed.isCollider = false;
//
images.woodenBox1 = new Image();
images.woodenBox1.src = 'mpibp_data/images/wooden-box-1.gif';
images.woodenBox1.isCollider = true;
//
images.woodenBarrel1 = new Image();
images.woodenBarrel1.src = 'mpibp_data/images/wooden-barrel-1.gif';
images.woodenBarrel1.isCollider = true;
//
images.movableObject = new Image();
images.movableObject.src = 'mpibp_data/images/movable-object.gif';
//
images.movableObjectMouseOver = new Image();
images.movableObjectMouseOver.src = 'mpibp_data/images/movable-object_mouseover.gif';
//
images.destructibleObject = new Image();
images.destructibleObject.src = 'mpibp_data/images/destructible-object.gif';
//
images.destructibleObjectMouseOver = new Image();
images.destructibleObjectMouseOver.src = 'mpibp_data/images/destructible-object_mouseover.gif';
//
images.destroyedWoodenStuff1 = new Image();
images.destroyedWoodenStuff1.src = 'mpibp_data/images/destroyed-wooden-stuff-1.gif';
//
images.blockedPathWood1 = new Image();
images.blockedPathWood1.src = 'mpibp_data/images/blocked-path-wood-1.gif';
images.blockedPathWood1.isCollider = true;

// ACTIONS ///////////////////////////////////////////////

function actionOnItemKeyCollected() {
    player.inventory.push(images.itemKey); this.transform.position.y = 1000;
};

function actionOnDoorOpen() {
    if (player.inventory.indexOf(images.itemKey) !== -1) {
        this.transform.position.y = 1000;
    }
};

// MAPS ///////////////////////////////////////////////

var levels = [

    new Level("Just swipe right to complete.", [
        new Field(0, 1, 180, images.wall1L), new Field(1, 1, 180, images.wall1I), new Field(2, 1, 180, images.wall1I), new Field(3, 1, 180, images.wall1I), new Field(4, 1, 270, images.wall1L),
        new Field(0, 2, 90, images.wall1Gap), new Field(0, 2, 0, images.doorInaccessible), new Field(1, 2, 0, images.pathEnd), new Field(2, 2, 180, images.pathEnd), new Field(4, 2, 270, images.wall1I),
        new Field(0, 3, 90, images.wall1L), new Field(1, 3, 0, images.wall1I), new Field(2, 3, 0, images.wall1I), new Field(3, 3, 0, images.wall1I), new Field(4, 3, 0, images.wall1L)
        ],[
            new Sprite(images.tree1, 160, 40, 0, new Vector2(0.5, 0.5)), new Sprite(images.tree1, 270, 22, 44, new Vector2(0.5, 0.5)), new Sprite(images.tree1, 170, 332, 344, new Vector2(0.45, 0.45)), new Sprite(images.tree1, 264, 352, 310, new Vector2(0.55, 0.55)), new Sprite(images.tree1, 370, 292, 344, new Vector2(0.7, 0.7)), new Sprite(images.tree1, 370, 92, 11, new Vector2(0.7, 0.7))
        ], new Vector2(1,2) , new PlayerExit(3,2) ),

    new Level("Go right. Clear obstacle. Go down, right to complete.", [
        new Field(0,0,180,images.wall1L),new Field(1,0,180,images.wall1I),new Field(2,0,180,images.wall1I),new Field(3,0,270,images.wall1L),
        new Field(0,1,90,images.wall1I),new Field(1,1,0,images.pathEnd),new Field(2,1,0,images.pathL),new Field(3,1,270,images.wall1I),
        new Field(0,2,90,images.wall1L),new Field(1,2,270,images.wall1T),new Field(2,2,90,images.pathI),new Field(2,3,90,images.pathI),new Field(2,2,0,images.wall1Gap),new Field(3,2,0,images.wall1T2),
        new Field(1,3,90,images.wall1I),new Field(3,3,90,images.wall1L2),new Field(4,3,270,images.wall1L),
        new Field(1,4,90,images.wall1I),new Field(2,4,270,images.pathEnd),new Field(4,4,270,images.wall1I),
        new Field(1, 5, 90, images.wall1L), new Field(2, 5, 0, images.wall1I), new Field(3, 5, 0, images.wall1I), new Field(4, 5, 0, images.wall1L),

        new Field(2, 2, 0, images.blockedPathWood1 ,false,true)
    ],[
        new Sprite(images.entrance, 96, 32, 0, new Vector2(1, 1))
    ], new Vector2(1, 1), new PlayerExit(3, 4)),

    new Level("Use movable object to complete.", [
        new Field(0, 0, 180, images.wall1L), new Field(1, 0, 180, images.wall1I), new Field(2, 0, 180, images.wall1I), new Field(3, 0, 180, images.wall1I), new Field(4, 0, 270, images.wall1L),
        new Field(0, 1, 90, images.wall1I), new Field(1, 1, 0, images.pathEnd), new Field(2, 1, 0, images.pathI), new Field(3, 1, 0, images.pathL), new Field(4, 1, 270, images.wall1I),
        new Field(0, 2, 90, images.wall1L),new Field(3,2,90,images.pathI), new Field(1, 2, 0, images.wall1I), new Field(2, 2, 270, images.wall1L2), new Field(4, 2, 270, images.wall1I),
        new Field(0, 3, 0, images.pathEnd), new Field(1, 3, 0, images.pathL), new Field(2, 3, 90, images.wall1I), new Field(3, 3, 90, images.pathI), new Field(4, 3, 270, images.wall1I),
        new Field(1, 4, 270, images.pathEnd),new Field(2, 4, 90, images.wall1End), new Field(3, 4, 180, images.pathT), new Field(4, 4, 0, images.pathI), new Field(4, 4, 90, images.wall1End2),
        new Field(3, 5, 270, images.pathEnd),new Field(4, 5, 270, images.wall1End),

        new Field(0, 4, 0, images.woodenBarrel1, false, true), new Field(0, 5, 0, images.woodenBarrel1, false, true), new Field(1, 3, 0, images.woodenBox1, true)
    ],[
        
    ], new Vector2(4, 4), new PlayerExit(1, 1)),

    new Level("Find a way in.", [
        new Field(2, 2, 180, images.wall1L2),new Field(4, 2, 0, images.wall1I),new Field(3, 2, 0, images.wall1I),
        new Field(1, 3, 0, images.pathEnd), new Field(2, 3, 0, images.pathI), new Field(3, 3, 0, images.pathL), new Field(2, 3, 270, images.wall1Gap),
        new Field(3, 4, 270, images.pathEnd), new Field(2, 4, 180, images.wall1T), new Field(3, 4, 0, images.wall1Gap), new Field(4, 4, 0, images.wall1I),
        new Field(2, 5, 270, images.wall1I),

        new Field(1, 4, 0, images.woodenBarrel1, false, true), new Field(0, 2, 0, images.woodenBarrel1, false, true), new Field(2, 0, 0, images.woodenBarrel1, false, true), new Field(3, 1, 0, images.woodenBarrel1, false, true), new Field(4, 0, 0, images.woodenBarrel1, false, true), new Field(4, 1, 0, images.woodenBox1, true), new Field(3, 0, 0, images.woodenBox1, true), new Field(2, 1, 0, images.woodenBox1, true), new Field(2, 3, 90, images.blockedPathWood1, false, true), new Field(3, 4, 0, images.blockedPathWood1, false, true)
],[
    
], new Vector2(1, 5), new PlayerExit(3, 5)),
    
    new Level("Find a way out.", [
        new Field(0, 0, 0, images.wall1L2), new Field(4, 0, 90, images.wall1L2),
        new Field(0, 3, 270, images.wall1End2), new Field(4, 3, 270, images.wall1End),
        new Field(0, 4, 90, images.wall1L), new Field(1, 4, 0, images.wall1I), new Field(2, 4, 0, images.wall1Gap), new Field(3, 4, 0, images.wall1I), new Field(4, 4, 0, images.wall1L),

        new Field(2, 0, 0, images.itemKey, false, false, undefined, actionOnItemKeyCollected), new Field(2, 4, 0, images.woodenBarrel1, false, true), new Field(1, 2, 0, images.woodenBox1, true), new Field(3, 5, 0, images.doorInaccessible, false, false, actionOnDoorOpen),
    ], [

    ], new Vector2(0, 1), new PlayerExit(4, 5))

];

// VARIABLES /////////////////////////////////////////////

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
//
var mouse = { x:-100 , y:-100 , over:false , down:false , downPosition:{x:0,y:0} , upPosition:{x:0,y:0} , GetPositionVector:function() { return new Vector2(this.x,this.y); } };
//
var levelIndex = 0;
//
var player = new Player( -1 , -1 );
//
var CurrentLevel = function(){ return levels[levelIndex]; };
//
var selectedField = null;
//


// EVENTY /////////////////////////////////////////////

canvas.addEventListener('mousemove', function(e) { OnMouseMove(e); } , false);
canvas.addEventListener('mousedown', function(e) { OnMouseDown(e); } , false);
canvas.addEventListener('mouseup', function(e) { OnMouseUp(e); } , false);
canvas.addEventListener('mouseout', function(e) { OnMouseOut(e); } , false);

window.addEventListener('load', function(){ OnLoad(); } , false );

// ON LOAD /////////////////////////////////////////////

var OnLoad = function() {
    setInterval(Update, 1000 / 60);
    levelIndex = 0;
    CurrentLevel().Initialize();
};

// UPDATE /////////////////////////////////////////////

var Update = function () {
    
    //draw background:
    images.background.Draw( 0 , 0 );

    //draw exit:
    {
        var d = CurrentLevel().exit;
        if( images.stairs.IsMouseOver(d.transform.position.x,d.transform.position.y)===true ){
            images.stairs_onmouseover.Draw( d.transform.position.x , d.transform.position.y );
        }
        else {
            images.stairs.Draw( d.transform.position.x , d.transform.position.y );
        }
    }

    //DRAW MAP'S FIELDS:
    {
        for (var i = 0; i < CurrentLevel().world.length ; i++) {
            var f = CurrentLevel().world[i];
            if (f instanceof Field) {
                //draw:
                if (f.image instanceof Image) { f.Draw(); }
                else { console.log("ERROR: map element is not Image") }
                //address is movable:
                if (f.isMovable) {
                    //translations:
                    if (f.direction !== Direction.none) {
                        //test world collisions:
                        if (IntersectionRects(f.GetRect(), player.GetRect()) || CurrentLevel().IsRectOverWorld(f.GetRect(), f)) {
                            if (f.transform.position.x % 64 !== 0) { f.transform.position.x -= 4 * f.DirectionVector().x; }
                            if (f.transform.position.y % 64 !== 0) { f.transform.position.y -= 4 * f.DirectionVector().y; }
                            f.direction = Direction.none;
                        }
                        else {
                            f.transform.position.x += 4 * f.DirectionVector().x;
                            f.transform.position.y += 4 * f.DirectionVector().y;
                        }
                        //test end of screen:
                        if (f.transform.position.x < 0) { f.transform.position.x = 0; f.direction = Direction.none; }
                        if (f.transform.position.y < 0) { f.transform.position.y = 0; f.direction = Direction.none; }
                        if (f.transform.position.x > 256) { f.transform.position.x = 256; f.direction = Direction.none; }
                        if (f.transform.position.y > 320) { f.transform.position.y = 320; f.direction = Direction.none; }
                    }
                    //draw gui icon:
                    if (f.InPlayersReach()) {
                        if (f.IsMouseOver()) { images.movableObjectMouseOver.Draw(f.transform.position.x + 32, f.transform.position.y + 32); }
                        else { images.movableObject.Draw(f.transform.position.x + 32, f.transform.position.y + 32); }
                    }
                }
                else if (f.isDestructible) {
                    //draw gui icon:
                    if (f.InPlayersReach()) {
                        if (f.IsMouseOver()) { images.destructibleObjectMouseOver.Draw(f.transform.position.x + 32, f.transform.position.y + 32); }
                        else { images.destructibleObject.Draw(f.transform.position.x + 32, f.transform.position.y + 32); }
                    }
                }
            }
            else { console.log("ERROR: map element is not Field") }
        };
    }

    //draw sprites:
    for( var i = 0 ; i < CurrentLevel().sprites.length ; i++ ) {
        CurrentLevel().sprites[i].Draw();
    }
    
    //visualise player moving direction:
    if (mouse.down && player.isSelected) {
        var dirRaw = player.DirectionToCoursor();
        if (dirRaw.Magnitude() > 22) {
            //determine move direction:
            var dir = new Vector2(0, 0);
            if (Math.abs(dirRaw.x) >= Math.abs(dirRaw.y)) {
                if (dirRaw.x >= 0) { dir.x = 1; images.playerSteps.rotation = 0; images.player.rotationTarget = 270; }
                else { dir.x = -1; images.playerSteps.rotation = 180; images.player.rotationTarget = 90; }
            }
            else {
                if (dirRaw.y >= 0) { dir.y = 1; images.playerSteps.rotation = 90; images.player.rotationTarget = 0; }
                else { dir.y = -1; images.playerSteps.rotation = 270; images.player.rotationTarget = 180; }
            }
            //draw steps:
            for (var i = 1 ; i < 6 ; i++) {
                if (CurrentLevel().IsRectOverWorld(new Rect(player.transform.position.x + 64 * i * dir.x, player.transform.position.y + 64 * i * dir.y, 64, 64))) {
                    /* world collision detected */
                    images.playerStepsStop.DrawRotated(player.transform.position.x + 64 * i * dir.x, player.transform.position.y + 64 * i * dir.y, images.playerSteps.rotation);
                    break;
                }
                else if (IntersectionRectPoint(new Rect(32, 32, 256, 320), new Vector2(player.transform.position.x + 64 * i * dir.x + 32, player.transform.position.y + 64 * i * dir.y + 32)) === false) {
                    /* screen edge detected */
                    images.playerStepsStop.DrawRotated(player.transform.position.x + 64 * i * dir.x - 12 * dir.x, player.transform.position.y + 64 * i * dir.y - 12 * dir.y, images.playerSteps.rotation);
                    break;
                }
                else if ( CurrentLevel().IsRectOverExit(new Rect(player.transform.position.x + 64 * i * dir.x, player.transform.position.y + 64 * i * dir.y, 64, 64)) ) {
                    /* exit detected */
                    images.playerStepsStop.DrawRotated(player.transform.position.x + 64 * i * dir.x + 52 * dir.x, player.transform.position.y + 64 * i * dir.y + 52 * dir.y, images.playerSteps.rotation);
                    break;
                }
                else {
                    /*no collision*/
                    images.playerSteps.DrawRotated(player.transform.position.x + 64 * i * dir.x, player.transform.position.y + 64 * i * dir.y, images.playerSteps.rotation);
                }
            }
        }
    }

    //visualize movable object moving direction:
    if (mouse.down && selectedField instanceof Field) {
        var dirRaw = selectedField.DirectionToCoursor();
        if (dirRaw.Magnitude() > 22) {
            //determine move direction:
            var dir = new Vector2(0, 0);
            if (Math.abs(dirRaw.x) >= Math.abs(dirRaw.y)) {
                if (dirRaw.x >= 0) { dir.x = 1; images.objectSteps.rotation = 0; images.player.rotationTarget = 270; }
                else { dir.x = -1; images.objectSteps.rotation = 180; images.player.rotationTarget = 90; }
            }
            else {
                if (dirRaw.y >= 0) { dir.y = 1; images.objectSteps.rotation = 90; images.player.rotationTarget = 0; }
                else { dir.y = -1; images.objectSteps.rotation = 270; images.player.rotationTarget = 180; }
            }
            //draw steps:
            for (var i = 1 ; i < 6 ; i++) {
                fRect = selectedField.GetRect();
                if (IntersectionRects(new Rect(fRect.x + 64 * i * dir.x, fRect.y + 64 * i * dir.y, 64, 64), player.GetRect()) || CurrentLevel().IsRectOverWorld(new Rect(selectedField.transform.position.x + 64 * i * dir.x, selectedField.transform.position.y + 64 * i * dir.y, 64, 64))) {
                    /* world collision detected */
                    images.playerStepsStop.DrawRotated(selectedField.transform.position.x + 64 * i * dir.x - 8 * dir.x, selectedField.transform.position.y + 64 * i * dir.y - 8 * dir.y, images.objectSteps.rotation);
                    break;
                }
                else if (IntersectionRectPoint(new Rect(32, 32, 256, 320), new Vector2(selectedField.transform.position.x + 64 * i * dir.x + 32, selectedField.transform.position.y + 64 * i * dir.y + 32)) === false) {
                    /* screen edge detected */
                    images.playerStepsStop.DrawRotated(selectedField.transform.position.x + 64 * i * dir.x - 8 * dir.x, selectedField.transform.position.y + 64 * i * dir.y - 8 * dir.y, images.objectSteps.rotation);
                    break;
                }
                else {
                    /*no collision*/
                    images.objectSteps.DrawRotated(selectedField.transform.position.x + 64 * i * dir.x, selectedField.transform.position.y + 64 * i * dir.y, images.objectSteps.rotation);
                }
            }
        }
    }

    //player move translations:
    if (player.direction !== Direction.none) {
        //test world collisions:
        if( CurrentLevel().IsRectOverWorld( player.GetRect(),undefined,true ) ){
            if (player.transform.position.x % 64 !== 0) { player.transform.position.x -= 4 * player.DirectionVector().x; }
            if (player.transform.position.y % 64 !== 0) { player.transform.position.y -= 4 * player.DirectionVector().y; }
            player.direction = Direction.none;
        }
        else {
            player.transform.position.x += 4*player.DirectionVector().x;
            player.transform.position.y += 4*player.DirectionVector().y;
        }
        //test end of screen:
        if (player.transform.position.x < 0) { player.transform.position.x = 0; player.direction = Direction.none; }
        if (player.transform.position.y < 0) { player.transform.position.y = 0; player.direction = Direction.none; }
        if (player.transform.position.x > 256) { player.transform.position.x = 256; player.direction = Direction.none; }
        if (player.transform.position.y > 320) { player.transform.position.y = 320; player.direction = Direction.none; }
    }
    
    //rotate player:
    {
        var playerRotationStepThisFrame = Math.ModNearestInt(images.player.rotationTarget - images.player.rotation, 360.0) / 6;
        if (player.isSelected) { playerRotationStepThisFrame /= 4; }
        images.player.rotation += playerRotationStepThisFrame;
    }

    //draw player:
    images.shadowRadial.Draw(player.transform.position.x, player.transform.position.y);
    if (player.isSelected) { images.playerSelected.DrawRotated(player.transform.position.x, player.transform.position.y, images.player.rotation); }
    else { images.player.DrawRotated(player.transform.position.x, player.transform.position.y, images.player.rotation); }
    
    //draw coursor:
    if( mouse.over===true ) {
        images.coursor.rotation = (images.coursor.rotation+1)%360;
        images.coursor.DrawRotated( mouse.x-18 , mouse.y-17 , images.coursor.rotation );
    }
    
    //evaluate if exit was reched:
    if (CurrentLevel().isLevelCompleted === false) {
        if (IntersectionRectPoint(new Rect(CurrentLevel().exit.transform.position.x, CurrentLevel().exit.transform.position.y, 64, 64), player.GetCenter())) {
            CurrentLevel().isLevelCompleted = true;
            player.direction = Direction.none;
            setTimeout(function () {
                if (levelIndex < levels.length - 1) {
                    levelIndex++;
                    CurrentLevel().Initialize();
                }
            }, 300);
        }
    }

    //draw UI:
    images.uiBarBottom.Draw(0, 352);

    //draw restart button:
    if (images.buttonRestart.rect.IsMouseOver()) { images.buttonRestartMouseOver.Draw(images.buttonRestart.rect.x, images.buttonRestart.rect.y); }
    else { images.buttonRestart.Draw(images.buttonRestart.rect.x, images.buttonRestart.rect.y); }

    //draw inventory:
    for (var i = 0; i < player.inventory.length; i++) {
        player.inventory[i].Draw(10+i*32,360);
    }

};

// ON MOUSE DOWN /////////////////////////////////////////////

var OnMouseDown = function ( e ) {
    mouse.down = true;
    //test player selection:
    if (CurrentLevel().isLevelCompleted === false && player.direction === Direction.none && player.IsMouseOver()) {
        player.isSelected = true;
    }
    //test player inveractions:
    for (var i = 0; i < CurrentLevel().world.length; i++) {
        var f = CurrentLevel().world[i];
        if ((f.isMovable || f.isDestructible) && f.IsMouseOver() && f.InPlayersReach() && player.direction === Direction.none) {
            if (f.isDestructible) {
                f.image = images.destroyedWoodenStuff1;
                f.isDestructible = false;
                f.isMovable = false;
            }
            else { selectedField = f; }
        }
    }
    // test restart button:
    if ( images.buttonRestart.rect.IsMouseOver() ) {
        player.direction = Direction.none;
        player.inventory = [];
        CurrentLevel().Initialize();
    }
};

// ON MOUSE UP /////////////////////////////////////////////

var OnMouseUp = function (e) {
    mouse.down = false;
    //
    mouse.upPosition.x = mouse.x;
    mouse.upPosition.y = mouse.y;
    
    //test player inveractions
    if( player.isSelected ) {
        var dir = player.DirectionToCoursor();
        if( dir.Magnitude()>22 ){
            if( Math.abs(dir.x)>Math.abs(dir.y) ) {
                if( dir.x>0 ){
                    player.direction = Direction.right;
                    images.player.rotationTarget = 270;
                }
                else {
                    player.direction = Direction.left;
                    images.player.rotationTarget = 90;
                }
            }
            else {
                if( dir.y>0 ){
                    player.direction = Direction.down;
                    images.player.rotationTarget = 0;
                }
                else {
                    player.direction = Direction.up;
                    images.player.rotationTarget = 180;
                }
            }
        }
        
        //unselect:
        player.isSelected = false;
    }

    //object interactions:
    if (selectedField instanceof Field) {
        var dir = selectedField.DirectionToCoursor();
        if (dir.Magnitude() > 22) {
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                if (dir.x > 0) { selectedField.direction = Direction.right; }
                else { selectedField.direction = Direction.left; }
            }
            else {
                if (dir.y > 0) { selectedField.direction = Direction.down; }
                else { selectedField.direction = Direction.up; }
            }
            selectedField = null;
        }
    }

};

// ON MOUSE MOVE /////////////////////////////////////////////

var OnMouseMove = function (e) {
    mouse.over = true;
    //
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX-rect.left;
    mouse.y = e.clientY-rect.top;
    //
    
};

// ON MOUSE OUT /////////////////////////////////////////////

var OnMouseOut = function (e) {
    mouse.over = false;
    //
    if( mouse.down===true ) {
        mouse.upPosition.x = mouse.x;
        mouse.upPosition.y = mouse.y;
    }
};
