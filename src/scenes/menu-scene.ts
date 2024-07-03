import { Button } from '../button/Button'
import { AudioManager } from '../manager/AudioManager'

export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
    private background: Phaser.GameObjects.Image
    private startButton: Button
    private settingsButton: Button

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        this.startKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
    }

    create(): void {
        AudioManager.getInstance(this).playMusic()

        this.background = this.add.image(0, 0, 'bg')
        this.background.setOrigin(0.5, 0.5)
        this.background.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2)

        // Add start button
        this.startButton = new Button(
            this,
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'btn',
            'START',
            () => {
                this.popOutEffect(this.startButton, () => {
                    this.scene.start('GameScene').start('HUDScene')
                })
            }
        )

        // Add bitmap text for "TANK", also centered
        const tankText = this.add.bitmapText(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 180,
            'font',
            'TANK',
            80
        )
        tankText.setOrigin(0.5, 0.5)
        this.bitmapTexts.push(tankText)
    }

    update(): void {}

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
}
