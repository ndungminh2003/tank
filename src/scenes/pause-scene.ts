import { IconButton } from '../button/IconButton'
import { AudioManager } from '../manager/AudioManager'

export class PauseScene extends Phaser.Scene {
    private replayBtn: IconButton
    private resumeBtn: IconButton
    private homeBtn: IconButton
    private soundBtn: IconButton
    private pauseText: Phaser.GameObjects.Text
    private container: Phaser.GameObjects.Image

    constructor() {
        super('PauseScene')
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

        this.pauseText = this.add.text(width / 2, height / 2 - 50, 'PAUSE', {
            fontSize: '48px',
            color: '#fff',
            fontStyle: 'bold',
        })
        this.pauseText.setOrigin(0.5)

        this.resumeBtn = new IconButton(
            this,
            width / 2 - 50,
            height / 2 + 50,
            'btnSquare',
            'iconPlay',
            () => {
                this.popOutEffect(this.resumeBtn, () => {
                    this.scene.wake('HUDScene')
                    this.scene.resume('GameScene')
                    this.scene.stop('PauseScene')
                })
            }
        )

        this.replayBtn = new IconButton(
            this,
            width / 2 + 50,
            height / 2 + 50,
            'btnSquare',
            'iconReplay',
            () => {
                this.popOutEffect(this.replayBtn, () => {
                    this.scene.stop('HUDScene')
                    this.scene.stop('GameScene')
                    this.scene.start('GameScene')
                    this.scene.start('HUDScene')
                    this.scene.stop('PauseScene')
                })
            }
        )

        this.homeBtn = new IconButton(
            this,
            width / 2 - 50,
            height / 2 + 150,
            'btnSquare',
            'iconHome',
            () => {
                this.popOutEffect(this.homeBtn, () => {
                    this.scene.stop('HUDScene')
                    this.scene.stop('GameScene')
                    this.scene.start('MenuScene')
                    this.scene.stop('PauseScene')
                })
            }
        )

        this.soundBtn = new IconButton(
            this,
            width / 2 + 50,
            height / 2 + 150,
            'btnSquare',
            'iconSoundOn',
            () => {
                this.popOutEffect(this.soundBtn, () => {
                    AudioManager.getInstance(this).toggleSound()

                    this.soundBtn
                        .getIcon()
                        .setTexture(
                            AudioManager.getInstance(this).getIsMuted()
                                ? 'iconSoundOff'
                                : 'iconSoundOn'
                        )
                })
            }
        )
    }

    popOutEffect(button: IconButton, callback: Function) {
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
