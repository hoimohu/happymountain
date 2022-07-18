class notice extends character {
    constructor(img) {
        super(NOTICE_STARTX, NOTICE_STARTY, NOTICE_WIDTH, NOTICE_HEIGHT, DUMMY_LIFE, img);
        this.timer = 0;
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        if (this.timer > 400) {
            this.life = 0;
        }
        if (this.life > 0) {
            this.timer++;
            this.x += this.timer / 50 * (2 - this.timer / 100);
            ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }
}