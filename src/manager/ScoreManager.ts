export class ScoreManager {
    private static instance: ScoreManager
    private score: number = 0
    private bestScore: number

    public static getInstance(): ScoreManager {
        if (!ScoreManager.instance) {
            ScoreManager.instance = new ScoreManager()
        }
        return ScoreManager.instance
    }

    constructor() {
        this.bestScore = parseInt(localStorage.getItem('BEST_SCORE')!) || 0
    }

    public getScore(): number {
        return this.score
    }

    public getBestScore(): number {
        return this.bestScore
    }

    public resetScore(): void {
        this.score = 0
    }

    public increaseScore(value: number): void {
        this.score += value
    }

    public writeBestScore(): void {
        console.log(this.score, this.bestScore)
        if (this.score > this.bestScore) {
            this.bestScore = this.score
            localStorage.setItem('BEST_SCORE', this.bestScore.toString())
        }
    }
}
