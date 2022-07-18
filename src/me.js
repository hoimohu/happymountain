class me extends character {
    /**
     * @constructor
     */
    constructor(gamecanvas) {
        super(ME_STARTX, ME_STARTY, ME_WIDTH, ME_HEIGHT, ME_LIFE, ME_IMG1);
        /**
         * @type {stage}
         */
        this.gamecanvas = gamecanvas;
        /**
         * @type {Number}
         */
        this.player = 3;
        /**
         * @type {Number}
         */
        this.powerful = 3;
        /**
         * @type {CanvasImageSource}
         */
        this.starimg = new Image();
        this.starimg.src = STAR_IMG;
        /**
         * @type {Number}
         */
        this.starimgWidth = 0;
        /**
         * @type {Number}
         */
        this.starimgHeight = 0;
        this.starimg.onload = (function () {
            this.starimgWidth = this.starimg.naturalWidth;
            this.starimgHeight = this.starimg.naturalHeight;
        }).bind(this);
        /**
         * @type {CanvasImageSource}
         */
        this.countdownimg = new Image();
        this.countdownimg.src = COUNTDOWN_IMG;
        /**
         * @type {Number}
         */
        this.countdownWidth = 0;
        /**
         * @type {Number}
         */
        this.countdownHeight = 0;
        this.countdownimg.onload = (function () {
            this.countdownimgWidth = this.countdownimg.naturalWidth;
            this.countdownimgHeight = this.countdownimg.naturalHeight;
        }).bind(this);
        /**
         * @type {Number}
         */
        this.count = -1;
        /**
         * @type {Boolean}
         */
        this.ispowerful = false;
        /**
         * @type {String}
         */
        this.shottype = 'normal';
        /**
         * @type {Boolean}
         */
        this.isslow = false;
        /**
         * @type {Object}
         */
        this.replaymap = {};
    }
    /**
     * キャラクターを更新する
     * @param {CanvasRenderingContext2D} ctx 描画先キャンバスの2Dコンテキスト
     */
    update(ctx) {
        const beforeX = this.x;
        const beforeY = this.y;
        this.x = Math.min(Math.max(ME_WIDTH / 2, this.x + ARROWKEY_SPEED.x), STAGE_WIDTH - ME_WIDTH / 2);
        this.y = Math.min(Math.max(ME_HEIGHT / 2, this.y + ARROWKEY_SPEED.y), STAGE_HEIGHT - ME_HEIGHT / 2);
        if (ARROWKEY_SPEED.x !== 0 && Math.min(Math.max(ME_WIDTH / 2, beforeX + ARROWKEY_SPEED.x), STAGE_WIDTH - ME_WIDTH / 2) === this.x) {
            if (this.replaymap[this.gamecanvas.floor] == null) {
                this.replaymap[this.gamecanvas.floor] = {};
            }
            if (this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] == null) {
                this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] = {};
            }
            this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].x = this.x;
        }
        if (ARROWKEY_SPEED.y !== 0 && Math.min(Math.max(ME_HEIGHT / 2, beforeY + ARROWKEY_SPEED.y), STAGE_HEIGHT - ME_HEIGHT / 2) === this.y) {
            if (this.replaymap[this.gamecanvas.floor] == null) {
                this.replaymap[this.gamecanvas.floor] = {};
            }
            if (this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] == null) {
                this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] = {};
            }
            this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].y = this.y;
        }
        ctx.save();
        if (this.life > 1) {
            ctx.globalAlpha = 0.5;
        }
        ctx.save();
        if (this.shottype === 'right') {
            ctx.translate(this.x, this.y);
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(-this.x, -this.y);
        }
        if (this.life > 0) {
            ctx.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
        ctx.restore();
        if (this.player > 0) {
            ctx.drawImage(this.starimg, 0, 0, this.player * 50, 50, STAGE_WIDTH + 150, 30, this.player * 30, 30);
            ctx.drawImage(this.starimg, 0, 0, this.powerful * 50, 50, STAGE_WIDTH + 150, 60, this.powerful * 30, 30);
        }
        ctx.restore();
        if (this.count > -1) {
            if (this.ispowerful) {
                this.width = ME_POWERFUL_WIDTH;
                this.height = ME_POWERFUL_HEIGHT;
            }
            if (this.count < 60) {
                this.life = ME_RESPAWN;
                ctx.drawImage(this.countdownimg, 0, 0, 50, 50, STAGE_WIDTH / 2 - 50, CANVAS_HEIGHT / 3, 100, 100);
                this.count++;
            } else if (this.count < 120) {
                this.life = ME_RESPAWN;
                ctx.drawImage(this.countdownimg, 50, 0, 50, 50, STAGE_WIDTH / 2 - 50, CANVAS_HEIGHT / 3, 100, 100);
                this.count++;
            } else if (this.count < 180) {
                this.life = ME_RESPAWN;
                ctx.drawImage(this.countdownimg, 100, 0, 50, 50, STAGE_WIDTH / 2 - 50, CANVAS_HEIGHT / 3, 100, 100);
                this.count++;
            } else if (this.count === 180) {
                this.life = 1;
                this.ispowerful = false;
                this.width = ME_WIDTH;
                this.height = ME_HEIGHT;
                ctx.drawImage(this.countdownimg, 150, 0, 50, 50, STAGE_WIDTH / 2 - 50, CANVAS_HEIGHT / 3, 100, 100);
                this.count++;
            } else if (this.count < 240) {
                ctx.drawImage(this.countdownimg, 150, 0, 50, 50, STAGE_WIDTH / 2 - 75, CANVAS_HEIGHT / 3, 150, 150);
                this.count++;
            } else {
                this.count = -1;
            }
        }
    }
    shot(type) {
        if (this.replaymap[this.gamecanvas.floor] == null) {
            this.replaymap[this.gamecanvas.floor] = {};
        }
        if (this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] == null) {
            this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames] = {};
        }
        switch (type) {
            case 'normal':
                this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].s = 1;
                if (this.ispowerful) {
                    return [new shot(STAGE_WIDTH / 3, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas),
                    new shot(STAGE_WIDTH / 3 * 2, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas)];
                } else {
                    return [new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas)];
                }
            case 'right':
                this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].s = 1;
                if (this.ispowerful) {
                    return [new shot(STAGE_WIDTH / 3, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFULRIGHT_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas),
                    new shot(STAGE_WIDTH / 3 * 2, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFULRIGHT_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas)];
                } else {
                    return [new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_RIGHT_SPEED, SHOT_NORMAL_IMG1, this.gamecanvas)];
                }
            case 'strong':
                if (this.ispowerful) {
                    this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].s = 1;
                    return [
                        new shot(STAGE_WIDTH / 3, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                        new shot(STAGE_WIDTH / 3 * 2, this.y, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                        new shot(STAGE_WIDTH / 3, this.y - 5, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                        new shot(STAGE_WIDTH / 3 * 2, this.y - 5, SHOT_POWERFUL_WIDTH, SHOT_POWERFUL_HEIGHT, SHOT_POWERFUL_SPEED, SHOT_STRONG_IMG, this.gamecanvas)
                    ];
                } else {
                    if (this.isslow) {
                        this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].slow = true;
                        return [
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, SHOT_STRONG_IMG, this.gamecanvas)
                        ];
                    } else {
                        this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames].s = 1;
                        return [
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_STRONG_SPEED1, SHOT_STRONG_IMG, this.gamecanvas),
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_NORMAL_SPEED, SHOT_STRONG_IMG, this.gamecanvas),
                            new shot(this.x, this.y, SHOT_NORMAL_WIDTH, SHOT_NORMAL_HEIGHT, SHOT_STRONG_SPEED2, SHOT_STRONG_IMG, this.gamecanvas)
                        ];
                    }
                }
            case 'powerful':
                if (this.powerful > 0) {
                    this.powerful--;
                    this.ispowerful = true;
                    this.count = 0;
                    this.gamecanvas.characters.push(new notice(NOTICE_IMG2));
                    this.replaymap[this.gamecanvas.floor][this.gamecanvas.frames][type] = true;
                }
                break;
        }
    }
    die() {
        this.player--;
        this.gamecanvas.score -= 1000;
        if (this.player > 0) {
            this.count = 0;
            this.life = ME_RESPAWN;
            this.gamecanvas.characters.splice(1, 0, this);
        } else {
            this.getreplay();
        }
    }
    getreplay() {
        this.replaymap.score = this.gamecanvas.score;
        const blob = new Blob([JSON.stringify(this.replaymap)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'replay' + Date.now() + '.json'
        a.innerText = 'リプレイをダウンロード';
        a.className = 'download';
        document.body.appendChild(a);
    }
}