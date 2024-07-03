import { Button } from '../button/Button'
import { ScoreManager } from '../manager/ScoreManager'

export class HUDScene extends Phaser.Scene {
    private pauseButton: Button
    private scoreText: Phaser.GameObjects.BitmapText
    private numberText: Phaser.GameObjects.Text
    private highScoreText: Phaser.GameObjects.BitmapText
    private highScoreNumberText: Phaser.GameObjects.Text

    constructor() {
        super({
            key: 'HUDScene',
        })
    }

    init(): void {}

    popOutEffect(button: Button, callback: Function) {
        this.tweens.add({
            targets: button,
            scale: 1.2,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                callback()
            },
        })
    }

    create(): void {
        this.scoreText = this.add.bitmapText(10, 10, 'font', 'SCORE: ', 24)

        this.numberText = this.add.text(
            this.scoreText.width + 10,
            10,
            ScoreManager.getInstance().getScore().toString(),
            {
                fontSize: '24px',
                color: '#fff',
                fontStyle: 'bold',
            }
        )

        this.highScoreText = this.add.bitmapText(10, 40, 'font', 'HIGH SCORE: ', 24)
        this.highScoreNumberText = this.add.text(
            this.highScoreText.width + 10,
            40,
            ScoreManager.getInstance().getBestScore().toString(),
            {
                fontSize: '24px',
                color: '#fff',
                fontStyle: 'bold',
            }
        )

        this.pauseButton = new Button(this, 0, 0, 'btnPause', '', () => {
            this.popOutEffect(this.pauseButton, () => {
                this.scene.pause('GameScene')
                this.scene.sleep('HUDScene')
                this.scene.launch('PauseScene')
            })
        })

        Phaser.Display.Align.In.TopRight(
            this.pauseButton,
            this.add.zone(this.cameras.main.width - 10, 10, 0, 0)
        )
    }

    update(): void {
        this.numberText.setText(ScoreManager.getInstance().getScore().toString())
        this.highScoreNumberText.setText(ScoreManager.getInstance().getBestScore().toString())
    }
}
