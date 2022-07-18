class character {
    /**
     * @constructor
     * @param {Number} x キャラクターのx座標
     * @param {Number} y キャラクターのy座標
     * @param {Number} w キャラクターの幅
     * @param {Number} h キャラクターの高さ
     * @param {Number} life キャラクターの体力
     * @param {Number} speed キャラクターの早さ
     * @param {String} img キャラクターの画像パス
     */
    constructor(x, y, w, h, life, img) {
        /**
         * @type {Boolean}
         */
        this.loaded = false;
        /**
         * @type {Number}
         */
        this.life = life;
        /**
         * @type {Number}
         */
        this.x = x;
        /**
         * @type {Number}
         */
        this.y = y;
        /**
         * @type {Number}
         */
        this.width = w;
        /**
         * @type {Number}
         */
        this.height = h;
        if (img != null) {
            /**
             * @type {CanvasImageSource}
             */
            this.image = new Image();
            this.image.src = img;
            this.image.onload = (function () {
                /**
                 * @type {Number}
                 */
                this.imageWidth = this.image.naturalWidth;
                /**
                 * @type {Number}
                 */
                this.imageHeight = this.image.naturalHeight;

                this.loaded = true;
            }).bind(this);
        }
        this.imagepath = img;
    }
}