class enemy extends character {
    /**
     * @constructor
     * @param {Number} x 敵の発生x座標
     * @param {Number} y 敵の発生y座標
     * @param {Number} w 敵の幅
     * @param {Number} h 敵の高さ
     * @param {Array<Function>} speed 敵の動き
     * @param {Number} life 体力
     * @param {String} img 画像のURL
     * @param {stage} gamecanvas stageクラスのインスタンス
     */
    constructor(x, y, w, h, speed, life, img, gamecanvas) {
        super(x, y, w, h, life, img);
        /**
         * @type {stage}
         */
        this.gamecanvas = gamecanvas;
        /**
         * @type {String}
         */
        this.speedtype = speed;
        /**
         * @type {Array<Function>}
         */
        this.speed = ENEMY_SPEED[speed];
        /**
         * @type {Number}
         */
        this.timer = -20;
        /**
         * @type {(Number | Boolean)}
         */
        this.turn = false;
        /**
         * @type {Number}
         */
        this.form = 0;
        /**
         * @type {Number}
         */
        this.shotinterval = 100 - this.width;
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        if (this.life <= ENEMY_BOSS1_FORM1 && this.form === 0 && (this.speedtype === 'boss1' || this.speedtype === 'boss2')) {
            this.form = 1;
            this.shotinterval = 24;
            this.gamecanvas.characters.push(new notice(NOTICE_IMG1));
            if (this.speedtype === 'boss2') {
                this.gamecanvas.player.shottype = 'right';
                this.shotinterval = 24;
            }
        } else if (this.speedtype === 'boss3') {
            if (this.life <= 500 && this.form !== 2) {
                this.shotinterval = 15;
                this.form = 2;
                this.gamecanvas.characters.push(new notice(NOTICE_IMG10));
            } else if (this.life <= 1000 && this.form !== 1 && this.form !== 2) {
                this.shotinterval = 21;
                this.form = 1;
                this.gamecanvas.characters.push(new notice(NOTICE_IMG9));
            }
        }
        this.timer++;
        this.x += this.speed[0](this);
        this.y += this.speed[1](this);
        if (Math.abs(this.y - STAGE_HEIGHT / 2) > STAGE_HEIGHT / 5 * 3 || Math.abs(this.x - STAGE_WIDTH / 2) > STAGE_WIDTH / 2 - this.width / 2 && this.speedtype !== 'title') {
            this.life = 0;
        }
        if (this.speedtype === 'boss3') {
            ctx.fillStyle = BGSTAR_COLOR4;
            if (this.life > 0) {
                if (this.life % 500 === 0) {
                    ctx.fillRect(25, 10, STAGE_WIDTH - 50, 10);
                } else {
                    ctx.fillRect(25, 10, (STAGE_WIDTH - 50) * (this.life % 500) / 500, 10);
                }
            }
        }
        ctx.save();
        if (this.turn !== false) {
            this.turn += 0.005;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.turn);
            ctx.translate(-this.x, -this.y);
        }
        if (this.life > 0) {
            ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            if (this.timer % this.shotinterval === 0 && this.speedtype !== 'title') {
                const myshot = this.shot(this.speedtype);
                for (let index = 0; index < myshot.length; index++) {
                    const element = myshot[index];
                    this.gamecanvas.characters.push(element);
                }
            }
        }
        ctx.restore();
    }
    shot(type) {
        const playerXY = [
            this.gamecanvas.player.x,
            this.gamecanvas.player.y
        ];
        switch (type) {
            case 'normal':
                return [new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, playerXY, SHOT_NORMAL_IMG2, this.gamecanvas)];
            case 'stay':
                return [new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, playerXY, SHOT_NORMAL_IMG2, this.gamecanvas)];
            case 'slanting':
            case 'stay2':
                return [new enemyshot(this.x + 20, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, playerXY, SHOT_NORMAL_IMG2, this.gamecanvas),
                new enemyshot(this.x - 20, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, playerXY, SHOT_NORMAL_IMG2, this.gamecanvas)];
            case 'boss1':
                if (this.form === 0) {
                    return [
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x - STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x + STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas)
                    ];
                } else {
                    return [
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [SHOT_NORMAL_WIDTH / 2, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 2, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 3, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 4, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 5, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 6, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 7, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 8, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH / 10 * 9, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, [STAGE_WIDTH - SHOT_NORMAL_WIDTH / 2, STAGE_HEIGHT / 2], SHOT_BOSS1_IMG, this.gamecanvas)
                    ];
                }
            case 'boss2':
                if (this.form === 0) {
                    return [new enemyshot(this.x, STAGE_HEIGHT / 4 * Math.sin(this.timer), SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_NORMAL_SPEED, playerXY, SHOT_BOSS2_IMG, this.gamecanvas)];
                } else {
                    return [
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x - STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS2_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BOSS2_SPEED, playerXY, SHOT_BOSS2_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x + STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS2_IMG, this.gamecanvas)
                    ];
                }
            case 'strong':
                return [new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_BIG_SPEED, playerXY, SHOT_NORMAL_IMG3, this.gamecanvas)];
            case 'strongstay':
                return [
                    new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, playerXY, SHOT_NORMAL_IMG3, this.gamecanvas),
                    new enemyshot(STAGE_WIDTH - SHOT_BIG_WIDTH, STAGE_HEIGHT - SHOT_BIG_WIDTH * 4, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BOSS2_SPEED, playerXY, SHOT_NORMAL_IMG3, this.gamecanvas),
                    new enemyshot(STAGE_WIDTH - SHOT_BIG_WIDTH, STAGE_HEIGHT - SHOT_BIG_WIDTH, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BOSS2_SPEED, playerXY, SHOT_NORMAL_IMG3, this.gamecanvas)
                ];
            case 'bluenormal':
                return [new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, playerXY, SHOT_NORMAL_IMG3, this.gamecanvas)];
            case 'boss3':
                if (this.form === 0) {
                    return [
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x - STAGE_WIDTH / 4 * 2, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x - STAGE_WIDTH / 4 * 1, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x + STAGE_WIDTH / 4 * 1, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_BIG_WIDTH, SHOT_BIG_HEIGHT, SHOT_BIG_SPEED, [this.x + STAGE_WIDTH / 4 * 2, STAGE_HEIGHT], SHOT_BOSS1_IMG, this.gamecanvas)
                    ];
                } else if (this.form === 1) {
                    return [
                        new enemyshot(SHOT_BIG_WIDTH, STAGE_HEIGHT * (this.timer % 100 / 100), SHOT_BIG_WIDTH * 3, SHOT_BIG_HEIGHT * 3, SHOT_BOSS3_SPEED, [STAGE_WIDTH * 1.5, STAGE_HEIGHT * (this.timer % 100 / 100)], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(STAGE_WIDTH / 3, 0, STAGE_WIDTH / 3 * 2, STAGE_WIDTH / 3 * 2, SHOT_BIG_SPEED, [STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS3_IMG, this.gamecanvas)
                    ];
                } else if (this.form === 2) {
                    return [
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_BOSS3_SPEED2, [this.x - (STAGE_HEIGHT - this.y) / 4, STAGE_HEIGHT], SHOT_BOSS3_IMG2, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_BOSS3_SPEED2, [this.x, STAGE_HEIGHT], SHOT_BOSS3_IMG2, this.gamecanvas),
                        new enemyshot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_BOSS3_SPEED2, [this.x + (STAGE_HEIGHT - this.y) / 4, STAGE_HEIGHT], SHOT_BOSS3_IMG2, this.gamecanvas),
                        new enemyshot(SHOT_BIG_WIDTH, STAGE_HEIGHT * (this.timer % 100 / 100), SHOT_BIG_WIDTH * 3, SHOT_BIG_HEIGHT * 3, SHOT_BOSS3_SPEED, [STAGE_WIDTH * 1.5, STAGE_HEIGHT * (this.timer % 100 / 100)], SHOT_BOSS1_IMG, this.gamecanvas),
                        new enemyshot(STAGE_WIDTH / 3, 0, STAGE_WIDTH / 3 * 2, STAGE_WIDTH / 3 * 2, SHOT_BIG_SPEED, [STAGE_WIDTH / 3, STAGE_HEIGHT], SHOT_BOSS3_IMG, this.gamecanvas)
                    ];
                }
        }
    }
}