class enemyshot extends shot {
    /**
     * @constructor
     * @param {Number} x ショットの発生x座標
     * @param {Number} y ショットの発生y座標
     * @param {Number} w ショットの幅
     * @param {Number} h ショットの高さ
     * @param {Array<Number>} speed ショットの速さ
     * @param {Array<Number>} target ショットの目標x,y
     * @param {String} img 画像のURL
     */
    constructor(x, y, w, h, speed, target, img, gamecanvas) {
        super(x, y, w, h, speed, img);
        /**
         * @type {stage}
         */
        this.gamecanvas = gamecanvas;
        if (speed[2] != null) {
            this.speed = [
                -speed[0] / 5,
                (target[1] - this.y) / ((target[0] - this.y) / (-speed[0] / 5))
            ];
        } else {
            this.speed = [
                (target[0] - this.x) / ((target[1] - this.y) / (-speed[1] / 5)),
                -speed[1] / 5
            ];
        }
        /**
         * @type {Boolean}
         */
        this.enemyshot = true;
        if (img === SHOT_NORMAL_IMG3) {
            /**
             * @type {Number}
             */
            this.angle = 0;
            if (Math.sign(target[0] - x) === 1) {
                if (Math.sign(target[1] - y) === -1) {
                    this.angle = 0.5 * Math.PI + Math.atan((target[1] - y) / (target[0] - x));
                } else {
                    this.angle = 0.5 * Math.PI + Math.atan((target[1] - y) / (target[0] - x));
                }
            } else {
                if (Math.sign(target[1] - y) === -1) {
                    this.angle = -(0.5 * Math.PI - Math.atan((target[1] - y) / (target[0] - x)));
                } else {
                    this.angle = -(0.5 * Math.PI - Math.atan((target[1] - y) / (target[0] - x)));
                }
            }
        }
    }
    /**
     * キャラクターを更新する(shotのupdateを上書き)
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        this.x += this.speed[0];
        this.y += this.speed[1];
        if (this.x < -this.width || this.x > STAGE_WIDTH - this.width / 2 || this.y < -this.height || this.y > this.height + STAGE_HEIGHT) {
            this.life = 0;
        }
        if (this.life > 0 && this.gamecanvas.player.life > 0 && (Math.sqrt((this.gamecanvas.player.x - this.x) ** 2 + (this.gamecanvas.player.y - this.y) ** 2) < this.width / 2)) {
            this.gamecanvas.player.life--;
            this.life--;
        } else if (this.life > 0 && this.gamecanvas.player.life > 0 && (Math.sqrt((this.gamecanvas.player.x - this.x) ** 2 + (this.gamecanvas.player.y - this.y) ** 2) < this.width)) {
            this.gamecanvas.score++;
        }
        ctx.save();
        if (this.angle != null) {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.translate(-this.x, -this.y);
        }
        if (this.life > 0) {
            ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        ctx.restore();
    }
}