import * as Phaser from 'phaser';

enum ZombieState {
    Idle,
    MovingUp,
    MovingDown,
    MovingLeft,
    MovingRight
}

export class FieldScene extends Phaser.Scene {

    playerSpeed = 400;
    playerStartPosition: Phaser.Math.Vector2;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    endZone: Phaser.GameObjects.Rectangle;
    score: number = 0;
    scoreText: Phaser.GameObjects.Text;
    hasScored: boolean = false;
    zombies: Phaser.Physics.Arcade.Group;
    level: number = 1;
    zombieScaleFactor: number = 1;
    cameraControl: Phaser.Cameras.Controls.FixedKeyControl;
    whistle: Phaser.Sound.BaseSound;
    impactSound: Phaser.Sound.BaseSound;

    //---------------------------------------------------------------
    // Phaser Scene Functions
    //---------------------------------------------------------------

    preload() {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('headstone', 'assets/large_headstone.png');
        this.load.image('jackolatern', 'assets/lackolatern.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('zombieSprite', 'assets/zombie.png', { frameWidth: 400, frameHeight: 548 });

        this.load.audio('impact', ['assets/audio/impactPunch_medium_000.ogg']);
        this.load.audio('whistle', ['assets/audio/fischio_rigore.mp3']);
    }

    create() {
        this.playerStartPosition = new Phaser.Math.Vector2(50, this.game.scale.height / 2);
        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.setSize(400, 300);
        // this.cameraControl = new Phaser.Cameras.Controls.FixedKeyControl({
        //     camera: this.cameras.main,
        //     left: this.cursors.left,
        //     right: this.cursors.right,
        //     speed: 0.25
        // });

        this.createField();
        this.createPlayer();
        this.createZombies();
        this.createObstacles();

        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { 
            fontSize: '24px', 
            color: '#eb4034', 
            stroke: '#eb4034', 
            strokeThickness: 2 
        });

        this.whistle = this.sound.add('whistle', { volume: 0.3 });
        this.impactSound = this.sound.add('impact');
    }

    update(time, delta) {
        this.updatePlayer();
        this.updateZombies();
        //this.cameraControl.update(delta);
    }

    //---------------------------------------------------------------
    // Helper Functions
    //---------------------------------------------------------------

    // Player
    //---------------------------------------------------------------

    createPlayer() {
        this.player = this.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, 'player');
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'tackled',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 24,
        });
    }

    updatePlayer() {
        // Detect touchdown
        if (!this.hasScored && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.endZone.getBounds())) {
            this.touchDown();
        }

        if (this.player.getData('tackled')) {
            if (this.player.anims.currentAnim.key !== 'tackled') {
                this.player.anims.play('tackled', true);
            }
            this.player.setVelocity(0);
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-1 * this.playerSpeed);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-1 * this.playerSpeed);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
        }
        else {
            this.player.setVelocityY(0);
        }
    }

    // Zombies
    //---------------------------------------------------------------

    createZombies() {
        this.zombies = this.physics.add.group();
        this.physics.add.collider(this.zombies, this.player, this.tackled, null, this);

        // Scale the number zombie based in the screen size
        this.zombieScaleFactor = Math.max(Math.floor((this.game.scale.width * this.game.scale.height) / 200000), 0);
        this.addZombies(this.level);

        this.anims.create({
            key: 'zombie-left',
            frames: this.anims.generateFrameNumbers('zombieSprite', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'zombie-turn',
            frames: [{ key: 'zombieSprite', frame: 2 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'zombie-right',
            frames: this.anims.generateFrameNumbers('zombieSprite', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    addZombies(n: number) {
        n = n + this.zombieScaleFactor;
        for (let index = 0; index < n; index++) {
            let x = Phaser.Math.Between(this.playerStartPosition.x + 200, this.endZone.x - this.endZone.width);
            let y = Phaser.Math.Between(50, this.game.scale.height - 50);
            let zombie : Phaser.Physics.Arcade.Sprite = this.zombies.create(x, y, 'zombieSprite');
            zombie.setScale(0.1);
            zombie.setBounce(1);
            zombie.setCollideWorldBounds(true);
            //zombie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));

            zombie.setData('state', this.randomZombieState());
            zombie.setData('lastStateChange', this.game.getTime());
        }
    }

    updateZombies() {
        this.zombies.children.iterate((zombie:Phaser.Physics.Arcade.Sprite) => {
            let currentState:ZombieState = zombie.getData('state');
            switch (currentState) {
                case ZombieState.Idle:
                    zombie.setVelocity(0);
                    zombie.anims.play('zombie-turn', true);
                    break;
                case ZombieState.MovingUp:
                    zombie.setVelocity(0, -100);
                    zombie.anims.play('zombie-left', true);
                    break;
                case ZombieState.MovingDown:
                    zombie.setVelocity(0, 100);
                    zombie.anims.play('zombie-left', true);
                    break;
                case ZombieState.MovingLeft:
                    zombie.setVelocity(-100, 0);
                    zombie.anims.play('zombie-left', true);
                    break;
                case ZombieState.MovingRight:
                    zombie.setVelocity(100, 0);
                    zombie.anims.play('zombie-right', true);
                    break;
                default:
                    break;
            }

            // Change state randomly
            let currentTime = this.game.getTime();
            let lastStateChange:number = Math.round(zombie.getData('lastStateChange'));
            if (currentTime - lastStateChange > 2000) {
                zombie.setData('state', this.randomZombieState());
                zombie.setData('lastStateChange', this.game.getTime());
            }
        });
    }

    randomZombieState():ZombieState {
        let r = Phaser.Math.Between(0, 4);
        switch (r) {
            case 0:
                return ZombieState.Idle;
            case 1:
                return ZombieState.MovingUp;
            case 2:
                return ZombieState.MovingDown;
            case 3:
                return ZombieState.MovingLeft;
            case 4:
                return ZombieState.MovingRight;
            default:
                return ZombieState.Idle;
        }
    }

    // Environment
    //---------------------------------------------------------------

    createField() {
        this.createEndZone();

        // Create 10 yard lines
        let tenYardLineWidth = 200;
        let tenYardLineXPositoin = this.endZone.x - this.endZone.width / 2 - tenYardLineWidth;
        while (tenYardLineXPositoin >= 0) {
            this.add.line(tenYardLineXPositoin, this.game.scale.height / 2, 0, 0, 0, this.game.scale.height, 0xffffff);
            tenYardLineXPositoin -= tenYardLineWidth;
        }

        // Create hash lines
        let hashYardLineWidth = 20;
        let hashYardLineXPositoin = this.endZone.x - this.endZone.width / 2 - hashYardLineWidth;
        while (hashYardLineXPositoin >= 0) {
            
            // Top
            this.add.line(hashYardLineXPositoin, 10, 0, 0, 0, 10, 0xffffff);

            // Top inside
            this.add.line(hashYardLineXPositoin, this.game.scale.height / 3, 0, 0, 0, 30, 0xffffff);

            // Bottom inside
            this.add.line(hashYardLineXPositoin, this.game.scale.height - this.game.scale.height / 3, 0, 0, 0, 30, 0xffffff);

            // Bottom
            this.add.line(hashYardLineXPositoin, this.game.scale.height - 10, 0, 0, 0, 10, 0xffffff);

            hashYardLineXPositoin -= hashYardLineWidth;
        }
    }

    createEndZone() {
        const endZoneWidth = 200;
        this.endZone = this.add.rectangle(this.game.scale.width - endZoneWidth / 2, this.game.scale.height / 2, endZoneWidth, this.game.scale.height, 0x00cf03);

        let endZoneText = this.add.text(this.game.scale.width - 50, 100, 'ENDZONE', { fontSize:'88px' });
        endZoneText.setRotation(Phaser.Math.DegToRad(90));
    }

    createObstacles() {
        let obstacles = this.physics.add.staticGroup();

        let numberOfObstacles = this.zombieScaleFactor + 1;
        for (let index = 0; index < numberOfObstacles; index++) {
            let x = Phaser.Math.Between(this.playerStartPosition.x + 200, this.endZone.x - this.endZone.width);
            let y = Phaser.Math.Between(50, this.game.scale.height - 50);
            obstacles.create(x, y, index % 2 == 0 ? 'headstone' : 'jackolatern');
        }

        this.physics.add.collider(this.player, obstacles);
        this.physics.add.collider(this.zombies, obstacles);
    }

    touchDown() {
        if (this.hasScored) {
            return;
        }

        this.whistle.play();
        this.setScore(this.score + 7);
        this.hasScored = true;

        this.time.delayedCall(2000, this.reset, [this.level + 1], this);
    }

    tackled() {
        if (this.hasScored || this.player.getData('tackled')) {
            return;
        }
        
        this.impactSound.play();
        this.setScore(0);
        this.player.setData('tackled', true);
        this.time.delayedCall(2000, this.reset, [1], this);
        //this.reset(1);
    }

    setScore(score: number) {
        this.score = score;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    reset(level: number) {
        console.log('resetting')
        this.level = level;
        this.player.setPosition(this.playerStartPosition.x, this.playerStartPosition.y);
        this.player.setData('tackled', false);
        this.hasScored = false;

        // Reset zombies
        this.zombies.clear(true, true);
        this.addZombies(this.level);
    }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',
    type: Phaser.AUTO,
    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        },
    },
    parent: 'game',
    backgroundColor: '#065225',
    scene: FieldScene
};

export const game = new Phaser.Game(gameConfig);