var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	this.count = 0;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
		this.count++;
        if (this.loop) 
			this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


function Zomb(game) {
    this.animation = new Animation(AM.getAsset("./img/Zomb.png"), 192, 192, 4, 0.35, 4, true, 1.5);
	this.animationDown = new Animation(AM.getAsset("./img/ZombDown.png"), 192, 192, 5, 0.35, 5, false, 1.5);
	this.animationEat = new Animation(AM.getAsset("./img/ZombEat.png"), 192, 192, 4, 0.3, 4, true, 1.5);
	this.animationLook = new Animation(AM.getAsset("./img/ZombLook.png"), 192, 192, 4, 0.5, 4, false, 1.5);
	this.animationRun = new Animation(AM.getAsset("./img/ZombRun.png"), 192, 192, 4, 0.25, 4, true, 1.5);
	this.animationFinal = new Animation(AM.getAsset("./img/final.png"), 993, 1024, 1, 0.45, 1, true, 1);
	this.eat = false;
	this.look = false;
	this.run = false;
    this.speed = 80;
    this.ctx = game.ctx;
    Entity.call(this, game, -200, 230);
}

Zomb.prototype = new Entity();
Zomb.prototype.constructor = Zomb;

Zomb.prototype.update = function () {
	if(this.run && this.y <= 750)
		this.y += this.game.clockTick * this.speed * 3;
	else if (this.animationLook.elapsedTime >= this.animationLook.totalTime - this.animationDown.frameDuration / 5)
		this.run = true;
	else if (this.animationEat.count >= 7)
		this.look = true;
	else if (this.animationDown.elapsedTime >= this.animationDown.totalTime - this.animationDown.frameDuration / 5)
		this.eat = true;
    else if (this.animation.elapsedTime > this.animation.totalTime - this.animation.frameDuration * 2 
	&& this.x < 330)
        this.x += this.game.clockTick * this.speed;
}
Zomb.prototype.draw = function () {
	if (this.y >= 750)
		this.animationFinal.drawFrame(this.game.clockTick, this.ctx, 0, 0);
	else if (this.run)
		this.animationRun.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	else if (this.look)
		this.animationLook.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	else if (this.eat)
		this.animationEat.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	else if(this.x >= 330)
		this.animationDown.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
	else
		this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


function Bird(game, spritesheet) {
    this.animation = new Animation(spritesheet, 96, 96, 6, 0.30, 12, true, 1);
    this.speed = 80;
    this.ctx = game.ctx;
    Entity.call(this, game, -1000, 100);
}

Bird.prototype = new Entity();
Bird.prototype.constructor = Bird;

Bird.prototype.update = function () {
	var base = 100;
	var jumpDistance = this.animation.elapsedTime / (this.animation.totalTime/2);
	var totalHeight = 60;
	
	if (this.animation.elapsedTime > this.animation.frameDuration * 6 ) {
		jumpDistance = (this.animation.elapsedTime - this.animation.frameDuration * 6) / (this.animation.totalTime/2);
		reverse = -1;
		if (this.animation.elapsedTime > this.animation.frameDuration * 9 ) {
			jumpDistance = 1 - jumpDistance;
		}
		var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
		this.y = base + height;
	}
	else {
		if (this.animation.elapsedTime > this.animation.frameDuration * 3 ) {
			jumpDistance = 1 - jumpDistance;
		}
		var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
		this.y = base - height;
	}
	
	this.x += this.game.clockTick * this.speed;
    if (this.x > 1000) 
		this.x = -1000;
}


Bird.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Food(game, spritesheet) {
    this.animation = new Animation(spritesheet, 32, 32, 3, 0.35, 3, true, 2);
    this.speed = 80;
    this.ctx = game.ctx;
    Entity.call(this, game, 500, 427);
}

Food.prototype = new Entity();
Food.prototype.constructor = Food;

Food.prototype.update = function () {
}
Food.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/Zomb.png");
AM.queueDownload("./img/ZombDown.png");
AM.queueDownload("./img/ZombEat.png");
AM.queueDownload("./img/ZombLook.png");
AM.queueDownload("./img/ZombRun.png");
AM.queueDownload("./img/final.png");
AM.queueDownload("./img/Bird.png");
AM.queueDownload("./img/Food.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Bird(gameEngine, AM.getAsset("./img/Bird.png")));
	gameEngine.addEntity(new Food(gameEngine, AM.getAsset("./img/Food.png")));
	gameEngine.addEntity(new Zomb(gameEngine));

    console.log("All Done!");
});