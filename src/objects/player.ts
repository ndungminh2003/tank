import { Bullet } from './bullet'
import { IImageConstructor } from '../interfaces/image.interface'
import { ScoreManager } from '../manager/ScoreManager'
import { AudioManager } from '../manager/AudioManager'

export class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private lastShoot: number
    private speed: number

    // children
    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics

    // game objects
    private bullets: Phaser.GameObjects.Group

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private isShooting: boolean = false
    private leftKey: Phaser.Input.Keyboard.Key
    private rightKey: Phaser.Input.Keyboard.Key
    private upKey: Phaser.Input.Keyboard.Key
    private downKey: Phaser.Input.Keyboard.Key
    private emitter1: Phaser.GameObjects.Particles.ParticleEmitter
    private emitter2: Phaser.GameObjects.Particles.ParticleEmitter

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage() {
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = 350

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(0)
        this.angle = 90

        this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue')
        this.barrel.setOrigin(0.5, 1)
        this.barrel.setDepth(1)
        this.barrel.angle = 180

        // // emitters
        // this.emitter1 = this.scene.add.particles(0, 0, '', {
        //     x: this.x,
        //     y: this.y + this.height / 2,
        //     speedX: { min: -10, max: 10 },
        //     speedY: { min: -10, max: 10 },
        //     lifespan: 1000,
        //     scale: { start: 0.5, end: 0 },
        //     tint: Phaser.Display.Color.HSVColorWheel()[0].color, // black color
        //     blendMode: 'ADD',
        //     frequency: 50,
        //     color: [0xff0000, 0x0000ff],
        // })

        // this.emitter2 = this.scene.add.particles(0, 0, '', {
        //     x: this.x,
        //     y: this.y - this.height / 2,
        //     speedX: { min: -10, max: 10 },
        //     speedY: { min: -10, max: 10 },
        //     lifespan: 1000,
        //     scale: { start: 0.5, end: 0 },
        //     tint: Phaser.Display.Color.HSVColorWheel()[0].color, // black color
        //     blendMode: 'ADD',
        //     frequency: 50,
        //     color: [0xff0000, 0x0000ff],
        // })

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // input
        this.cursors = this.scene.input.keyboard!.createCursorKeys()

        this.leftKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.rightKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.upKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.downKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        this.scene.input.on('pointermove', (pointer: any) => {
            this.barrel.rotation =
                Phaser.Math.Angle.Between(
                    this.barrel.x,
                    this.barrel.y,
                    pointer.worldX,
                    pointer.worldY
                ) +
                Math.PI / 2
        })

        this.scene.input.on('pointerdown', this.handleDown, this)
        this.scene.input.on('pointerup', this.handleUp, this)

        // physics
        this.scene.physics.world.enable(this)
    }

    update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            this.handleShooting()
            // this.emitter1.setPosition(this.x, this.y + this.height / 2)
            // this.emitter2.setPosition(this.x, this.y - this.height / 2)
            if (ScoreManager.getInstance().getScore() == 1400) {
                this.scene.scene.launch('WinScene')
                ScoreManager.getInstance().writeBestScore()
                this.active = false
            }
        } else {
            this.destroy()
            this.barrel.destroy()
            this.lifeBar.destroy()
        }
    }

    private handleDown() {
        this.isShooting = true
    }

    private handleUp() {
        this.isShooting = false
    }

    private handleInput() {
        if (this.upKey.isDown && this.leftKey.isDown) {
            this.angle = -45
            this.scene.physics.velocityFromAngle(-135, this.speed, this.body.velocity)
        } else if (this.upKey.isDown && this.rightKey.isDown) {
            this.angle = 45
            this.scene.physics.velocityFromAngle(-45, this.speed, this.body.velocity)
        } else if (this.downKey.isDown && this.leftKey.isDown) {
            this.angle = -135
            this.scene.physics.velocityFromAngle(135, this.speed, this.body.velocity)
        } else if (this.downKey.isDown && this.rightKey.isDown) {
            this.angle = 135
            this.scene.physics.velocityFromAngle(45, this.speed, this.body.velocity)
        } else if (this.upKey.isDown) {
            this.angle = 0
            this.scene.physics.velocityFromAngle(-90, this.speed, this.body.velocity)
        } else if (this.downKey.isDown) {
            this.angle = 180
            this.scene.physics.velocityFromAngle(90, this.speed, this.body.velocity)
        } else if (this.leftKey.isDown) {
            this.angle = -90
            this.scene.physics.velocityFromAngle(180, this.speed, this.body.velocity)
        } else if (this.rightKey.isDown) {
            this.angle = 90
            this.scene.physics.velocityFromAngle(0, this.speed, this.body.velocity)
        } else {
            this.body.setVelocity(0, 0)
        }
    }

    private handleShooting(): void {
        if (this.isShooting && this.scene.time.now > this.lastShoot) {
            AudioManager.getInstance(this.scene).playShoot()

            this.scene.cameras.main.shake(20, 0.005)
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.bullets.getLength() < 10) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletBlue',
                    })
                )

                this.lastShoot = this.scene.time.now + 80
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15)
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
        this.lifeBar.setDepth(1)
    }

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05
            this.redrawLifebar()
        } else {
            this.health = 0
            this.active = false
            ScoreManager.getInstance().writeBestScore()
            this.scene.scene.launch('OverScene')
        }
    }
}
