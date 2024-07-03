import { Button } from '../button/Button'

export class WinScene extends Phaser.Scene {
    private newGameBtn: Button
    private mainMenuBtn: Button
    private container: Phaser.GameObjects.Image
    private winText: Phaser.GameObjects.BitmapText
    private confetti: Phaser.GameObjects.Particles.ParticleEmitter

    constructor() {
        super('WinScene')
    }

    create() {
        const { width, height } = this.cameras.main
        const graphics = this.add.graphics()

        graphics.fillStyle(0x000000, 0.7)
        graphics.fillRect(0, 0, width, height)

        this.container = this.add.image(0, 0, 'container')
        this.container.setOrigin(0.5)
        Phaser.Display.Align.In.Center(
            this.container,
            this.add.zone(width / 2, height / 2, width, height)
        )

        this.winText = this.add
            .bitmapText(width / 2, height / 2 - 50, 'font', ' YOU WIN! ', 40)
            .setOrigin(0.5)

        this.newGameBtn = new Button(this, width / 2, height / 2 + 50, 'btn', 'NEW GAME', () => {
            this.popOutEffect(this.newGameBtn, () => {
                this.scene.stop('HUDScene')
                this.scene.stop('GameScene')
                this.scene.start('GameScene')
                this.scene.start('HUDScene')
                this.scene.stop('PauseScene')
            })
        })

        this.mainMenuBtn = new Button(this, width / 2, height / 2 + 150, 'btn', 'MAIN MENU', () => {
            this.popOutEffect(this.mainMenuBtn, () => {
                this.scene.stop('HUDScene')
                this.scene.stop('GameScene')
                this.scene.stop('PauseScene')
                this.scene.start('MenuScene')
            })
        })

        this.createConfetti()
    }

    private createConfetti() {
        this.confetti = this.add
            .particles(0, window.innerHeight - 300, 'confetti', {
                frame: [
                    '1.png',
                    '2.png',
                    '3.png',
                    '4.png',
                    '5.png',
                    '6.png',
                    '7.png',
                    '8.png',
                    '9.png',
                    '10.png',
                ],
                alpha: { min: 0.8, max: 1 },
                lifespan: 3000,
                rotate: {
                    onEmit: () => Phaser.Math.RND.between(0, 360),
                    onUpdate: (_particle: any, _key: any, t: number, value: number) =>
                        value + t * 4,
                },
                angle: { min: -60, max: -30 },
                speed: {
                    onEmit: (particle) => {
                        let num = -particle!.angle * 2 - 800
                        return Phaser.Math.RND.between(num - 200, num + 200)
                    },
                },
                scale: { start: 0.3, end: 0 },
                accelerationX: {
                    onEmit: () => -1000,
                    onUpdate: (particle: { velocityX: number }) =>
                        particle.velocityX >= 100 ? -1000 : 0,
                },
                accelerationY: {
                    onEmit: () => 1200,
                    onUpdate: (particle: { velocityY: number }) =>
                        particle.velocityY <= -100 ? 1200 : 0,
                },
                quantity: 1, // Set to 0 to avoid continuous emission
                gravityY: 600,
            })
            .setDepth(100)

        this.confetti.explode(50)
    }

    popOutEffect(button: Button, callback: Function) {
        this.tweens.add({
            targets: button,
            scale: 1.2,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                callback()
            },
        })
    }
}
