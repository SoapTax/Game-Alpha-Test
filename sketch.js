var START = 0
var PLAY = 1
var END = 2
var gameState = START
var level = 0
var lives = 3
var lever = 0
var score = 0
var jumps = 5
var totalMonsters = 0
var allMonstersKilled = null

function preload(){
bgImg = loadImage("Space background.jpeg")
startImg = loadImage("startImg.png")
titleImg = loadImage("titleImage.png")
storyImg = loadImage("storyImage.png")
playButtonImg = loadImage("startButton.png")
lifeImg = loadImage("life.gif")
playerStandingImg = loadImage("playerImage.png")
platform1Img = loadImage("platform1.png")
platform2Img = loadImage("platform2.png")
barOutlineImg = loadImage("bar1.png")
lifeBarImg1 = loadAnimation("barFull.png")
lifeBarImg2 = loadAnimation("bar2Full.png")
lifeBarImg3 = loadAnimation("bar3Full.png")
instructionsImg = loadImage("instructions.png")
portalImg = loadImage("portal.gif")
coinImg = loadImage("coin.png")
swordImg = loadImage("sword.png")
swipeImg = loadImage("swipe.png")
monsterImg = loadImage("monster.png")
cannonballImg = loadImage("cannonball.png")
gameoverImg = loadImage("gameover.jpeg")
healthPointImg = loadImage("healthpoint.png")
restartButtonImg = loadImage("restart.png")
cannonshooterImg = loadImage("cannonshooter.png")
bouncepadImg = loadImage("bouncepad.png")
}

function setup(){
  createCanvas(windowWidth, windowHeight)
  bg = createSprite(width/2, height/2)
  bg.addImage(bgImg)
  bg.scale = 0.8
  bg.visible = false

  startbg = createSprite(width/2, height/2)
  startbg.addImage(startImg)
  startbg.scale = 1.7

  title = createSprite(width/2, height/2 -100)
  title.addImage(titleImg)
  title.scale = 1

  story = createSprite(width/2 - 30, height/2 + 230)
  story.addImage(storyImg)
  story.scale = 4

  playButton = createSprite(width/2, height/2 + 230)
  playButton.addImage(playButtonImg)
  playButton.scale = 7

  lifeIndicator = createSprite(width - 270, 90)
  lifeIndicator.addImage(lifeImg)
  lifeIndicator.scale = 2

  player = createSprite(200, height/2)
  player.addImage(playerStandingImg)
  player.scale = 1
  player.setCollider("rectangle", 0, 10, 67, 67)
  player.visible = false

  barOutline = createSprite(width - 200, 100)
  barOutline.addImage(barOutlineImg)
  barOutline.scale = 2.5

  platformGroup = new Group()
  invisplatformGroup = new Group()
  coinGroup = new Group()
  monsterGroup = new Group()
  healthPointGroup = new Group()
  cannonballGroup = new Group()
  bouncePadGroup = new Group()

  lifeBar = createSprite(width - 190, 92)
  lifeBar.addAnimation("full life", lifeBarImg1)
  lifeBar.addAnimation("2/3 life", lifeBarImg2)
  lifeBar.addAnimation("1/3 life", lifeBarImg3)
  lifeBar.changeAnimation("full life")
  lifeBar.scale = 1.1

  gameoverbg = createSprite(width/2, height/2 - 100)
  gameoverbg.addImage(gameoverImg)
  gameoverbg.scale = 1.2
  gameoverbg.visible = false

  instructions = createSprite(width/2, 400)
  instructions.addImage(instructionsImg)
  instructions.scale = 2
  instructions.visible = false

  portal = createSprite(width - 100, height - 300)
  portal.addImage(portalImg)
  portal.scale = 0.2
  portal.visible = false
  portal.setCollider("circle", 0, 0, 400)

  sword = createSprite(player.x, player.y)
  sword.addImage(swordImg)
  sword.visible = false
}

function draw() {
background(0)
if(gameState === START){
    if(mousePressedOver(playButton)){
        gameState = PLAY
        level = 1
        lever = 1
    }
}

if(gameState === PLAY){
    if(lives === 0){
        lifeBar.visible = false
        gameState = END
    }
    gameoverbg.visible = false
    startbg.visible = false
    playButton.visible = false
    title.visible = false
    story.visible = false
    bg.visible = true
    player.visible = true
    player.collide(invisplatformGroup)
    player.velocityY += 3
    portal.visible = true
    sword.visible = true
    handleCoin()
    handleHealthPoint()
    sword.x = player.x + 50
    sword.y = player.y

    if(player.y > height){
        die()
    }

    if(player.isTouching(monsterGroup)){
        die()
    }

    if(keyWentDown("space")){
        swipe = createSprite(player.x + 80, player.y)
        swipe.addImage(swipeImg)
        swipe.scale = 3
        swipe.lifetime = 10
        swipe.setCollider("rectangle", 10, 0, 20, 40)
        swipe.overlap(monsterGroup, function(collecter, collected){
                totalMonsters -= 1
                collected.remove()
                score += 1
            })
    }

    if(keyIsDown(LEFT_ARROW)){
        player.x -= 15
    }
    if(keyIsDown(RIGHT_ARROW)){
        player.x += 15
    }
    if(keyWentDown(UP_ARROW)&&jumps>0){
        player.velocityY = -20
        jumps -= 1
    }

    if(level === 1 && lever === 1){
        jumps = 5
        spawnPlatform(200, height/2 + 100)
        spawnPlatform(650, height/2 + 50)
        spawnPlatform(1250, height/2 + 250)
        spawnPlatform(650, height/2 + 50)
        spawnSmallPlatform(1000, height/2 + 150)
        spawnCoins(width/2, height/2 - 100)
        spawnMonster(width/2, height/2)
        spawnHealthPoint(width - 300, 550)
        instructions.visible = true
        lever = 2
    }
    if(level === 1){
        if(player.isTouching(portal)){
            if(totalMonsters === 0){
                coinGroup.destroyEach()
                monsterGroup.destroyEach()
                platformGroup.destroyEach()
                invisplatformGroup.destroyEach()
                level = 2
                allMonstersKilled = null
            } else {
                allMonstersKilled = false
            }
        }
    }
    if(level === 2 && lever === 2){
        jumps = 5
        player.y = height/2
        player.x = 200
        spawnPlatform(200, height/2 + 100)
        spawnCoins(width/2, height/2 - 100)
        spawnCoins(width/2, height/2 - 100)
        spawnCoins(width/2, height/2 - 100)
        spawnCoins(width/2, height/2 - 100)
        portal.y = height - 100
        instructions.visible = false
        lever = 3
    }
    if(level === 2){
        if(player.isTouching(portal)){
            if(totalMonsters === 0){
                coinGroup.destroyEach()
                monsterGroup.destroyEach()
                platformGroup.destroyEach()
                invisplatformGroup.destroyEach()
                level = 3
                allMonstersKilled = null
            } else {
                allMonstersKilled = false
            }
        }
    }
    if(level === 3 && lever === 3){
        jumps = 5
        player.y = height/2
        player.x = 200
        spawnPlatform(200, height/2 + 100)
        spawnPlatform(width/2, height - 100)
        spawnHealthPoint(width/2, height - 150)
        spawnMonster(width/2 + 75, height - 150)
        spawnMonster(width/2 - 75, height - 150)
        spawnMonster(width/2, height - 150)
        spawnMonster(width/2 + 125, height - 150)
        spawnMonster(width/2 - 125, height - 150)
        spawnSmallPlatform(550, height/2 + 250)
        spawnSmallPlatform(1250, height/2 + 150)
        spawnMonster(1225, height/2 + 115)
        spawnSmallPlatform(1250, height/2 - 100)
        spawnMonster(1225, height/2 - 115)
        portal.y = 300
        instructions.visible = false
        lever = 4
    }
    if(level === 3){
        if(player.isTouching(portal)){
            if(totalMonsters === 0){
                coinGroup.destroyEach()
                monsterGroup.destroyEach()
                platformGroup.destroyEach()
                invisplatformGroup.destroyEach()
                level = 4
                allMonstersKilled = null
            } else {
                allMonstersKilled = false
            }
        }
    }
    if(level === 4 && lever === 4){
        jumps = 5
        player.y = height/2
        player.x = 200
        spawnPlatform(200, height/2 + 100)
        spawnPlatform(width/2, height - 100)
        spawnHealthPoint(width/2, height - 150)
        spawnMonster(width/2 - 125, height - 150)
        spawnMonster(1225, height/2 + 115)
        spawnSmallPlatform(1250, height/2 - 100)
        spawnMonster(1225, height/2 - 115)
        spawnCannonShooter(width/2,height/2)
        spawnBouncePad(width/2, 300)
        portal.y = 300
        instructions.visible = false
        lever = 5
    }
    if(level === 4){
        if(player.isTouching(portal)){
            if(totalMonsters === 0){
                coinGroup.destroyEach()
                monsterGroup.destroyEach()
                platformGroup.destroyEach()
                invisplatformGroup.destroyEach()
                level = 5
                allMonstersKilled = null
            } else {
                allMonstersKilled = false
            }
        }
    }
}

if(gameState === END){
    player.x = width/2
    player.y = height/2
    player.visible = false
    coinGroup.destroyEach()
    monsterGroup.destroyEach()
    platformGroup.destroyEach()
    invisplatformGroup.destroyEach()
    sword.visible = false
    gameoverbg.visible = true
    score = 0
    instructions.visible = false
    portal.visible = false
    healthPointGroup.destroyEach()
    restartbutton = createSprite(width/2 - 50,height/2 + 150);
    restartbutton.addImage(restartButtonImg)
    if(mousePressedOver(restartbutton)){
        location.reload()
    }
}

drawSprites()

fill("white")
textSize(40)
text(lives, width - 170, 110)
text("Score:" + score, 170, 110)
text("Jumps:" + jumps, 170, 160)
text("Level:" + level, 170, 210)
text("TotalMonsters:" + totalMonsters, 170, 260)
if(allMonstersKilled === false){
    fill("blue")
    textSize(40)
    text("You Need to Kill all the Monsters", width/2 - 300, 250)
}
}

function die(){
    if(lives > 0){
        lives -= 1
        jumps = 5
        player.velocityY = 0
    }
    if(lives >= 1){
        player.y = height/2
        player.x = 200
    if(lives === 2){
            lifeBar.changeAnimation("2/3 life")
    }
    if(lives === 1){
            lifeBar.changeAnimation("1/3 life")
    }
    if(lives === 0){
            lifeBar.visible = false
    }
  }
}

function spawnCoins(x, y){
    var coin = createSprite(x, y)
    coin.addImage(coinImg)
    coinGroup.add(coin)
    coin.setCollider("circle", -9, -3, 25)
}

function handleCoin(){
    player.overlap(coinGroup, function(collecter, collected){
        score += 1
        collected.remove()
    })
}

function spawnBouncePad(x, y){
    var bouncePad = createSprite(x, y)
    bouncePad.addImage(bouncepadImg)
    bouncePad.scale = 4
    bouncePadGroup.add(bouncePad)
}

function spawnMonster(x,y){
    monster = createSprite(x,y)
    monster.addImage(monsterImg)
    monster.scale = 2
    monster.setCollider("rectangle", 0, 0, 30, 30)
    monsterGroup.add(monster)
    totalMonsters += 1
}

function spawnCannonShooter(x,y){
    cannonShooter = createSprite(x,y)
    cannonShooter.addImage(cannonshooterImg)
    cannonShooter.scale = 4
if(frameCount % 60 === 0){
    spawnCannonBall(x,y)
}
}

function spawnCannonBall(x, y){
    cannonball = createSprite(x,y)
    cannonball.addImage(cannonballImg)
    cannonball.scale = 4
    cannonball.velocityX = -5 
    cannonballGroup.add(cannonball)
    cannonball.debug = true
    cannonball.lifetime = 150
}

function spawnHealthPoint(x, y){
    var healthPoint = createSprite(x, y)
    healthPoint.addImage(healthPointImg)
    healthPoint.scale = 1.5
    healthPointGroup.add(healthPoint)
}

function handleHealthPoint(){
    player.overlap(healthPointGroup, function(collecter, collected){
        lives += 1
        if(lives === 2){
            lifeBar.changeAnimation("2/3 life")
        }
        if(lives === 3){
            lifeBar.changeAnimation("full life")
        }
        collected.remove()
    })
}

function spawnPlatform(x, y){
    var platform = createSprite(x, y)
        platform.addImage(platform1Img)
        platform.scale = 4
        platformGroup.add(platform)
    var invisPlatform = createSprite(x, y, 340, 50)
        invisPlatform.visible = false
        invisPlatform.setCollider("rectangle", 0, 0, 340, 35)
        invisplatformGroup.add(invisPlatform)
        platform.depth = player.depth
        player.depth += 1
}

function spawnSmallPlatform(x, y){
    var smallPlatform = createSprite(x, y)
        smallPlatform.addImage(platform2Img)
        smallPlatform.scale = 3
        platformGroup.add(smallPlatform)
        invisSmallPlatform = createSprite(x - 25, y + 35, 80, 50)
        invisSmallPlatform.visible = false
        smallPlatform.depth = player.depth
        player.depth += 1
        invisplatformGroup.add(invisSmallPlatform)
}