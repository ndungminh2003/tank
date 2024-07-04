import { Bullet } from './../objects/bullet'
import { Player } from '../objects/player'
import { Enemy } from '../objects/enemy'
import { Obstacle } from '../objects/obstacles/obstacle'
import { ScoreManager } from '../manager/ScoreManager'
import { AudioManager } from '../manager/AudioManager'

export class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    private layer: Phaser.Tilemaps.TilemapLayer

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group
    private miniMapCamera: Phaser.Cameras.Scene2D.Camera
    private miniMapBorder: Phaser.GameObjects.Graphics

    private target: Phaser.Math.Vector2

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {}

    create(): void {
        // create tilemap from tiled JSON

        ScoreManager.getInstance().resetScore()
        this.map = this.make.tilemap({ key: 'levelMap' })

        this.tileset = this.map.addTilesetImage('tiles') as Phaser.Tilemaps.Tileset
        this.layer = this.map.createLayer(
            'tileLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer
        this.layer.setCollisionByProperty({ collide: true })

        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            /*classType: Enemy*/
        })
        this.convertObjects()

        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer)
        this.physics.add.collider(this.player, this.obstacles)

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            (bullet) => this.bulletHitLayer(bullet as Bullet),
            undefined,
            this
        )

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            (bullet, obstacle) => this.bulletHitObstacles(bullet as Bullet, obstacle as Obstacle),
            undefined,
            this
        )

        this.enemies.getChildren().forEach((enemy: any) => {
            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                (bullet, enemy) => this.playerBulletHitEnemy(bullet as Bullet, enemy as Enemy),
                undefined,
                this
            )
            this.physics.add.overlap(
                enemy.getBullets(),
                this.player,
                (bullet, player) => this.enemyBulletHitPlayer(bullet as Bullet, player as Player),
                undefined
            )

            this.physics.add.collider(
                enemy.getBullets(),
                this.obstacles,
                (bullet, obstacle) =>
                    this.bulletHitObstacles(bullet as Bullet, obstacle as Obstacle),
                undefined
            )
            this.physics.add.collider(
                enemy.getBullets(),
                this.layer,
                (bullet) => this.bulletHitLayer(bullet as Bullet),
                undefined
            )
        }, this)

        // Thiết lập giới hạn cho camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        // Theo dõi người chơi với camera
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5)
        this.cameras.main.setZoom(0.6)

        this.createMiniMap()
    }

    private createMiniMap(): void {
        this.miniMapCamera = this.cameras
            .add(this.cameras.main.width - 310, this.cameras.main.height - 250, 300, 300)
            .setZoom(0.1)
            .setName('miniMap')
            .startFollow(this.player, true, 0.5, 0.5)
            .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.createMiniMapBorder()

        this.miniMapCamera.ignore(this.miniMapBorder)
    }

    private createMiniMapBorder(): void {
        this.miniMapBorder = this.add.graphics()
        this.miniMapBorder.lineStyle(10, 0xffffff, 1) // white border with thickness 4
        this.miniMapBorder
            .strokeRect(this.cameras.main.width - 120, this.cameras.main.height - 165, 510, 412)
            .setScrollFactor(0)
    }

    update(): void {
        this.player.update()

        this.enemies.getChildren().forEach((enemy: any) => {
            enemy.update()
            if (this.player.active && enemy.active) {
                var angle = Phaser.Math.Angle.Between(
                    enemy.body.x,
                    enemy.body.y,
                    this.player.body.x,
                    this.player.body.y
                )

                enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }
        }, this)
    }

    private convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const objects = (this.map.getObjectLayer('objects') as Phaser.Tilemaps.ObjectLayer).objects

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x!,
                    y: object.y!,
                    texture: 'tankBlue',
                })
            } else if (object.type === 'enemy') {
                let enemy = new Enemy({
                    scene: this,
                    x: object.x!,
                    y: object.y!,
                    texture: 'tankRed',
                })

                this.enemies.add(enemy)
            } else {
                let obstacle = new Obstacle({
                    scene: this,
                    x: object.x!,
                    y: object.y! - 40,
                    texture: object.type,
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    private bulletHitLayer(bullet: Bullet): void {
        bullet.destroy()
    }

    private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
        bullet.destroy()
    }

    private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
        AudioManager.getInstance(this).playHit()
        bullet.destroy()
        player.updateHealth()
    }

    private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
        AudioManager.getInstance(this).playHit()
        bullet.destroy()
        enemy.updateHealth()
    }
}
