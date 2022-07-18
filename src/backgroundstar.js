class backgroundstar extends character {
    /**
     * @constructor
     */
    constructor() {
        super(0, 0, STAGE_WIDTH, STAGE_HEIGHT, DUMMY_LIFE);
        this.stars = [];
        for (let index = 0; index < BGSTAR_MAX; index++) {
            this.makestar(
                Math.random() * (STAGE_WIDTH - 6),
                Math.random() * STAGE_HEIGHT
            );
        }
        this.starcolor = BGSTAR_COLOR1;
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        if (this.life > 0) {
            for (let index = 0; index < this.stars.length; index++) {
                const element = this.stars[index];
                element.y += element.size;
                if (Math.abs(element.y - STAGE_HEIGHT / 2) < STAGE_HEIGHT / 2) {
                    ctx.fillStyle = this.starcolor;
                    ctx.fillRect(element.x, element.y, element.size, element.size);
                } else {
                    this.stars.splice(index, 1);
                    this.makestar(element.x, 0);
                }
            }
        }
    }
    makestar(x, y) {
        this.stars.push({
            x: x,
            y: y,
            size: Math.random() * 7
        });
    }
}