/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisibleGround;

var obstaclesGroup, obstacle1;

var score = 0;

var gameOver, restart;

function preload() {
  kangaroo_running = loadAnimation("assets/kangaroo1.png", "assets/kangaroo2.png", "assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");

  jungleImage = loadImage("assets/bg.png");

  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");

  obstacle1 = loadImage("assets/stone.png");

  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400, 100, 400, 20);
  jungle.addImage("jungle", jungleImage);
  jungle.scale = 0.3
  jungle.x = width / 2;

  invisibleGround = createSprite(400, 370, width, 20);
  invisibleGround.visible = false;

  kangaroo = createSprite(50, 310);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collide", kangaroo_collided);
  kangaroo.scale = 0.1;
  kangaroo.setCollider("circle", 0, 0, 300);

  gameOver = createSprite(width / 2, height / 2 - 30);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.visible = false;

  restart = createSprite(width / 2, height / 2 + 30);
  restart.addImage("restart", restartImg);
  restart.scale = 0.1;
  restart.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

}

function draw() {
  background(255);

  kangaroo.x = camera.position.x - 270;

  if (gameState == 1) {
    jungle.velocityX = -4

    if (jungle.x <= 0) {
      jungle.position.x = width / 2
    }

    if (keyDown("space") && kangaroo.y > 270) {
      kangaroo.velocityY = -10;
      jumpSound.play();
    }

    kangaroo.velocityY += 0.5;

    spawnObstacles();
    spawnShrubs();

    if (shrubsGroup.isTouching(kangaroo)) {
      score + 1;
      shrubsGroup.destroyEach();
    }

    if (obstaclesGroup.isTouching(kangaroo)) {
      obstaclesGroup.destroyEach();
      shrubsGroup.destroyEach();

      collidedSound.play();
      gameState = END;
    }
  }

  if (gameState == END) {
    kangaroo.changeAnimation("collide");
    kangaroo.velocityX = 0;

    jungle.velocityX = 0;

    gameOver.visible = true;
    restart.visible = true;
  }

  kangaroo.collide(invisibleGround);


  drawSprites();

}

function spawnShrubs() {
  if (frameCount % 150 == 0) {
    let shrub = createSprite(camera.position.x + 500, 330, 40, 10);

    shrub.velocityX = -(6 + 3 * score / 100)
    shrub.scale = 0.1;

    var rand = Math.round(random(1, 3));
    switch (rand) {
      case 1: shrub.addImage(shrub1);
        break;
      case 2: shrub.addImage(shrub2);
        break;
      case 3: shrub.addImage(shrub3);
        break;
      default: break;
    }

    shrubsGroup.add(shrub);
  }
}

function spawnObstacles() {
  if (frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x + 400, 330, 40, 40);
    obstacle.setCollider("rectangle", 0, 0, 200, 200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3 * score / 100)
    obstacle.scale = 0.15;

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);

  }
}