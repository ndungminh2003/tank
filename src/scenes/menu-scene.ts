export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
  }

  create(): void {
    // Use the scene's width and height for centering
    const sceneCenterX = window.innerWidth / 2;
    const sceneCenterY = window.innerHeight / 2;



    // Add bitmap text for "PRESS S TO PLAY", centered based on the scene's dimensions
    const pressSText = this.add.bitmapText(
      sceneCenterX + 200,
      sceneCenterY,
      'font',
      'PRESS S TO PLAY',
      30
    );
    pressSText.setOrigin(0.5, 0.5);
    this.bitmapTexts.push(pressSText);

    // Add bitmap text for "TANK", also centered
    const tankText = this.add.bitmapText(
      sceneCenterX + 200,
      sceneCenterY - 100,
      'font',
      'TANK',
      100
    );
    tankText.setOrigin(0.5, 0.5);
    this.bitmapTexts.push(tankText);
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('GameScene');
    }
  }
}
