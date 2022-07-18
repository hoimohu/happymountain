class shot extends character {
    /**
     * @constructor
     * @param {Number} x ショットの発生x座標
     * @param {Number} y ショットの発生y座標
     * @param {Number} w ショットの幅
     * @param {Number} h ショットの高さ
     * @param {Array<Number>} speed ショットの速さ
     * @param {String} img 画像のURL
     */
    constructor(x, y, w, h, speed, img, gamecanvas) {
        super(x, y, w, h, SHOT_LIFE, img);
        /**
         * @type {Array<Number>}
         */
        this.speed = speed;
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
        this.x += this.speed[0];
        this.y += this.speed[1];
        if (Math.abs(this.y - STAGE_HEIGHT / 2) > STAGE_HEIGHT / 5 * 3 || Math.abs(this.x - STAGE_WIDTH / 2) > STAGE_WIDTH / 2 - this.width / 2) {
            this.life = 0;
        }
        for (let index = 0; index < this.gamecanvas.enemies.length; index++) {
            const element = this.gamecanvas.enemies[index];
            if (this.life > 0 && element.life > 0 && (Math.sqrt((element.x - this.x) ** 2 + (element.y - this.y) ** 2) < this.width / 2 + element.width / 2)) {
                this.gamecanvas.score += 2;
                element.life--;
                this.life--;
            }
        }
        if (this.width >= SHOT_POWERFUL_WIDTH) {
            for (let index = 0; index < this.gamecanvas.characters.length; index++) {
                const element = this.gamecanvas.characters[index];
                if (element.enemyshot != null) {
                    if (this.life > 0 && element.life > 0 && (Math.sqrt((element.x - this.x) ** 2 + (element.y - this.y) ** 2) < this.width / 2 + element.width / 2)) {
                        element.life--;
                        this.gamecanvas.score++;
                    }
                }
            }
        }
        ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}