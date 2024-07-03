export class AudioManager {
    private static instance: AudioManager
    private bgMusic: Phaser.Sound.WebAudioSound
    private shootMusic: Phaser.Sound.WebAudioSound
    private hitMusic: Phaser.Sound.WebAudioSound
    private isMuted: boolean = false
    
    public static getInstance(scene: Phaser.Scene): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager(scene)
        }
        return AudioManager.instance
    }

    constructor(scene: Phaser.Scene) {
        this.bgMusic = scene.sound.add('bgMusic', {
            loop: true,
            volume: 0.5,
        }) as Phaser.Sound.WebAudioSound
        this.shootMusic = scene.sound.add('shootMusic') as Phaser.Sound.WebAudioSound
        this.hitMusic = scene.sound.add('hitMusic') as Phaser.Sound.WebAudioSound
    }

    public getIsMuted(): boolean {
        return this.isMuted
    }

    public playMusic(): void {
        this.bgMusic.play()
    }

    public stopMusic(): void {
        this.bgMusic.stop()
    }

    public playShoot(): void {
        this.shootMusic.play()
    }

    public playHit(): void {
        this.hitMusic.play()
    }

    public toggleSound(): void {
        this.isMuted = !this.isMuted
        this.isMuted ? this.bgMusic.pause() : this.bgMusic.resume()
    }
}
