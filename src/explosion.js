class explosion extends character {
    /**
     * @constructor
     */
    constructor(x, y, size) {
        super(x, y, size, size, ME_LIFE);
        this.timer = EXPLOSION_TIMER;
        this.piece = [];
        for (let index = 0; index < EXPLOSION_MAX; index++) {
            this.piece.push(
                {
                    x: 0,
                    y: 0,
                    speed: [
                        5 - Math.random() * 10,
                        5 - Math.random() * 10
                    ],
                    size: Math.random() * size
                }
            );
        }
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        if (this.life > 0) {
            this.timer--;
            ctx.save();
            ctx.fillStyle = '#ffffa0';
            if (this.timer < 0) {
                this.timer = 0;
            }
            ctx.globalAlpha = this.timer / 200;
            for (let index = 0; index < this.piece.length; index++) {
                const element = this.piece[index];
                element.x += element.speed[0];
                element.y += element.speed[1];
                if (Math.abs(this.y + element.y - STAGE_HEIGHT / 2) < STAGE_HEIGHT / 2 && Math.abs(this.x + element.x - STAGE_WIDTH / 2) < STAGE_WIDTH / 2 - element.size / 2) {
                    ctx.fillRect(this.x + element.x - element.size / 2, this.y + element.y - element.size / 2, element.size, element.size);
                } else {
                    this.piece.splice(index, 1);
                    if (this.piece.length === 0 || this.timer <= 0) {
                        this.life = 0;
                        this.timer = 0;
                    }
                }
            }
            ctx.restore();
        }
    }
}