import { BootScene } from './scenes/boot-scene'
import { GameScene } from './scenes/game-scene'
import { MenuScene } from './scenes/menu-scene'
import { OverScene } from './scenes/over-scene'
import { PauseScene } from './scenes/pause-scene'
import { HUDScene } from './scenes/hud-scene'
import { WinScene } from './scenes/win-scene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Tank',
    type: Phaser.AUTO, // Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, Phaser.WEBGL
    width: 1200,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT, // Phaser.Scale.NONE, Phaser.Scale.FIT, Phaser.Scale.ENVELOP, Phaser.Scale.RESIZE
        autoCenter: Phaser.Scale.CENTER_BOTH, // Phaser.Scale.CENTER_BOTH, Phaser.Scale.CENTER_HORIZONTALLY, Phaser.Scale.CENTER_VERTICALLY
    },

    scene: [BootScene, MenuScene, GameScene, OverScene, PauseScene, HUDScene, WinScene],
    input: {
        keyboard: true,
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true,
        },
    },
}
