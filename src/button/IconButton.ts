export class IconButton extends Phaser.GameObjects.Container {
    private button: Phaser.GameObjects.Image
    private icon: Phaser.GameObjects.Image
    private callback: Function

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        btnKey: string,
        iconKey: string,
        callback: Function
    ) {
        super(scene, x, y)

        // create button image
        this.button = this.scene.add.image(0, 0, btnKey)
        this.add(this.button)

        this.callback = callback

        // create icon image
        this.icon = this.scene.add.image(0, 0, iconKey)
        Phaser.Display.Align.In.Center(this.icon, this.button)
        this.add(this.icon)

        // Add this container to the scene
        this.scene.add.existing(this)

        // Enable input and set up event listeners
        this.button.setInteractive()
        this.button.on('pointerdown', this.onDown, this)
        this.button.on('pointerup', this.onUp, this)
        this.button.on('pointerover', this.onOver, this)
        this.button.on('pointerout', this.onOut, this)
    }

    private onDown() {
        this.button.setTint(0x999999)
    }

    private onUp() {
        this.button.clearTint()
        this.callback()
    }

    private onOver() {
        this.button.setTint(0xcccccc)
    }

    private onOut() {
        this.button.clearTint()
    }

    public getIcon(): Phaser.GameObjects.Image {
        return this.icon
    }
}
