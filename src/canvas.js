class stage {
    /**
     * @constructor
     * @param {HTMLCanvasElement} canvas 描画対象のキャンバス
     * @param {Object} enemymap 敵の情報
     */
    constructor(canvas, enemymap) {
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = canvas;
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.context = canvas.getContext('2d');
        /**
         * @type {Object}
         */
        this.enemymap = enemymap;
        /**
         * @type {String}
         */
        this.stagecolor = STAGE_BGCOLOR1;
        /**
         * @type {String}
         */
        this.canvascolor = CANVAS_BGCOLOR;
        /**
         * @type {CanvasImageSource}
         */
        this.rightimg = new Image();
        this.rightimg.src = RIGHTSIDE_IMG;
        /**
         * @type {Number}
         */
        this.rightimgWidth = 0;
        /**
         * @type {Number}
         */
        this.rightimgHeight = 0;
        this.rightimg.onload = (function () {
            this.rightimgWidth = this.rightimg.naturalWidth;
            this.rightimgHeight = this.rightimg.naturalHeight;
        }).bind(this);
        /**
         * @type {Array<character>}
         */
        this.characters = [];
        /**
         * @type {Array<enemy>}
         */
        this.enemies = [];
        /**
         * @type {me}
         */
        this.player;
        /**
         * @type {Number}
         */
        this.floor = 0;
        /**
         * @type {Number}
         */
        this.frames = 0;
        /**
         * @type {Number}
         */
        this.score = 0;
    }
    render() {
        this.context.fillStyle = this.canvascolor;
        this.context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.context.fillStyle = this.stagecolor;
        this.context.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        this.context.drawImage(this.rightimg, 0, 0, this.rightimgWidth, this.rightimgHeight, STAGE_WIDTH, 30, 120, 90)
        this.context.strokeStyle = '#dd8800';
        this.context.lineWidth = 5;
        this.context.lineJoin = 'miter';
        this.context.font = '24px fantasy';
        this.context.strokeText(this.score, STAGE_WIDTH + 150, 115, CANVAS_WIDTH - (STAGE_WIDTH + 150));
        this.context.fillStyle = '#fff';
        this.context.fillText(this.score, STAGE_WIDTH + 150, 115, CANVAS_WIDTH - (STAGE_WIDTH + 150));
        for (let index = 0; index < this.characters.length; index++) {
            const element = this.characters[index];
            if (element.life > 0) {
                element.update(this.context);
            } else {
                element.life = 0;
                this.characters.splice(index, 1);
                if (element instanceof me || (element instanceof enemy && Math.abs(element.y - STAGE_HEIGHT / 2) < STAGE_HEIGHT / 2 && Math.abs(element.x - STAGE_WIDTH / 2) < STAGE_WIDTH / 2)) {
                    this.characters.push(new explosion(element.x, element.y, element.width));
                    if (element instanceof me) {
                        element.die();
                    } else {
                        if (element.speedtype === 'title') {
                            if (element.imagepath === ENEMY_IMG[0]) {
                                element.life = TITLE_RESPAWN;
                                element.turn = 0;
                                element.x = (CANVAS_WIDTH - STAGE_WIDTH) / 2 + STAGE_WIDTH;
                                element.y = CANVAS_HEIGHT - element.width;
                                this.characters.push(element);
                            }
                            this.floor++;
                            this.frames = 0;
                            if (this.floor === 1) {
                                this.characters.push(new notice(NOTICE_IMG3));
                                this.stagecolor = STAGE_BGCOLOR1;
                                for (let index = 0; index < this.characters.length; index++) {
                                    const element2 = this.characters[index];
                                    if (element2 instanceof backgroundstar) {
                                        element2.starcolor = BGSTAR_COLOR1;
                                    }
                                }
                            } else if (this.floor === 2) {
                                this.characters.push(new notice(NOTICE_IMG4));
                                this.stagecolor = STAGE_BGCOLOR2;
                                for (let index = 0; index < this.characters.length; index++) {
                                    const element2 = this.characters[index];
                                    if (element2 instanceof backgroundstar) {
                                        element2.starcolor = BGSTAR_COLOR2;
                                    }
                                }
                            } else if (this.floor === 3) {
                                this.player.shottype = 'strong';
                                this.characters.push(new notice(NOTICE_IMG6));
                                this.stagecolor = STAGE_BGCOLOR3;
                                for (let index = 0; index < this.characters.length; index++) {
                                    const element2 = this.characters[index];
                                    if (element2 instanceof backgroundstar) {
                                        element2.starcolor = BGSTAR_COLOR3;
                                    }
                                }
                            } else if (this.floor === 4) {
                                this.player.shottype = 'strong';
                                this.stagecolor = STAGE_BGCOLOR1;
                                for (let index = 0; index < this.characters.length; index++) {
                                    const element2 = this.characters[index];
                                    if (element2 instanceof backgroundstar) {
                                        element2.starcolor = BGSTAR_COLOR4;
                                    }
                                }
                                const pushnotice = new notice(NOTICE_IMG8);
                                pushnotice.width = NOTICE8_WIDTH;
                                pushnotice.height = NOTICE8_HEIGHT;
                                pushnotice.y = STAGE_HEIGHT / 2;
                                this.characters.push(pushnotice);
                            } else if (this.floor === 7) {
                                this.score += (this.player.powerful * 500 + this.player.player * 500);
                                this.player.replaymap.inhappymountain = 'Congratulations!';
                                this.player.getreplay();
                            }
                        } else if (element.speedtype === 'boss1') {
                            const element2 = this.enemymap.enemytype['8'];
                            const newenemy = new enemy(element2.x, element2.y, element2.w, element2.h, element2.speed, element2.life, ENEMY_IMG[element2.i], this);
                            this.characters.push(newenemy);
                            this.enemies.push(newenemy);
                        } else if (element.speedtype === 'boss2') {
                            const element2 = this.enemymap.enemytype['13'];
                            const newenemy = new enemy(element2.x, element2.y, element2.w, element2.h, element2.speed, element2.life, ENEMY_IMG[element2.i], this);
                            this.characters.push(newenemy);
                            this.enemies.push(newenemy);
                        } else if (element.speedtype === 'boss3') {
                            const element2 = this.enemymap.enemytype['28'];
                            const newenemy = new enemy(element2.x, element2.y, element2.w, element2.h, element2.speed, element2.life, ENEMY_IMG[element2.i], this);
                            this.characters.push(newenemy);
                            this.enemies.push(newenemy);
                            this.stagecolor = STAGE_BGCOLOR1;
                            for (let index = 0; index < this.characters.length; index++) {
                                const element3 = this.characters[index];
                                if (element3 instanceof backgroundstar) {
                                    element3.starcolor = BGSTAR_COLOR1;
                                }
                            }
                        }
                        for (let index2 = 0; index2 < this.enemies.length; index2++) {
                            const element2 = this.enemies[index2];
                            if (element2 === element) {
                                this.enemies.splice(index2, 1);
                                this.score += element.width;
                            }
                        }
                    }
                } else if (element instanceof notice) {
                    if (element.imagepath === NOTICE_IMG6) {
                        this.characters.push(new notice(NOTICE_IMG7));
                    }
                }
            }
        }
    }
    init() {
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context.fillStyle = this.canvascolor;
        this.context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.context.fillStyle = this.stagecolor;
        this.context.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        this.context.drawImage(this.rightimg, 0, 0, this.rightimgWidth, this.rightimgHeight, STAGE_WIDTH, 30, 120, 90)
        this.context.strokeStyle = '#dd8800';
        this.context.lineWidth = 5;
        this.context.lineJoin = 'miter';
        this.context.font = '24px fantasy';
        this.context.strokeText(this.score, STAGE_WIDTH + 150, 115, CANVAS_WIDTH - (STAGE_WIDTH + 150));
        this.context.fillStyle = '#fff';
        this.context.fillText(this.score, STAGE_WIDTH + 150, 115, CANVAS_WIDTH - (STAGE_WIDTH + 150));
    }
}