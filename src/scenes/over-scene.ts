import { Button } from '../button/Button'
import { ScoreManager } from '../manager/ScoreManager'

export class OverScene extends Phaser.Scene {
    private newGameBtn: Button
    private mainMenuBtn: Button
    private overText: Phaser.GameObjects.Text
    private container: Phaser.GameObjects.Image
    private scoreText: Phaser.GameObjects.BitmapText
    private numberText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.BitmapText
    private highScoreNumberText: Phaser.GameObjects.Text

    constructor() {
        super('OverScene')
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

        this.scoreText = this.add.bitmapText(
            width / 2 - 100,
            height / 2 - 100,
            'font',
            'SCORE: ',
            24
        )

        this.numberText = this.add.text(
            width / 2,
            height / 2 - 100,
            ScoreManager.getInstance().getScore().toString(),
            {
                fontSize: '24px',
                color: '#fff',
                fontStyle: 'bold',
            }
        )

        this.highScoreText = this.add.bitmapText(
            width / 2 - 100,
            height / 2 - 50,
            'font',
            'HIGH SCORE: ',
            24
        )
        this.highScoreNumberText = this.add.text(
            width / 2 + 60,
            height / 2 - 50,
            ScoreManager.getInstance().getBestScore().toString(),
            {
                fontSize: '24px',
                color: '#fff',
                fontStyle: 'bold',
            }
        )

        this.newGameBtn = new Button(this, width / 2, height / 2 + 50, 'btn', 'NEW GAME', () => {
            this.popOutEffect(this.newGameBtn, () => {
                this.cameras.main.fadeOut(500, 0, 0, 0, (_camera: any, progress: number) => {
                    if (progress === 1) {
                        this.scene.stop('HUDScene')
                        this.scene.stop('GameScene')
                        this.scene.start('GameScene')
                        this.scene.start('HUDScene')
                        this.scene.stop('PauseScene')
                    }
                })
            })
        })

        this.mainMenuBtn = new Button(this, width / 2, height / 2 + 150, 'btn', 'MAIN MENU', () => {
            this.popOutEffect(this.mainMenuBtn, () => {
                this.cameras.main.fadeOut(500, 0, 0, 0, (_camera: any, progress: number) => {
                    if (progress === 1) {
                        this.scene.stop('HUDScene')
                        this.scene.stop('GameScene')
                        this.scene.stop('PauseScene')
                        this.scene.start('MenuScene')
                    }
                })
            })
        })
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
