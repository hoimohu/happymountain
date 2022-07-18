class nowloading extends character {
    /**
     * @constructor
     */
    constructor(gamecanvas) {
        super(NLDG_X, NLDG_Y, NLDG_WIDTH, NLDG_HEIGHT, DUMMY_LIFE, NLDG_IMG);
        /**
         * @type {stage}
         */
        this.gamecanvas = gamecanvas;
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        if (this.life > 0) {
            ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }
}