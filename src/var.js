let GAME_RUN = true;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CANVAS_BGCOLOR = '#384D98';

const STAGE_WIDTH = 450;
const STAGE_HEIGHT = 600;
const STAGE_BGCOLOR1 = '#000';
const STAGE_BGCOLOR2 = 'olivedrab';
const STAGE_BGCOLOR3 = '#6495ED';

const ME_IMG1 = '/happymountain/src/img/me.png';
const ME_STARTX = STAGE_WIDTH / 2;
const ME_STARTY = STAGE_HEIGHT;
const ME_WIDTH = 30;
const ME_HEIGHT = 40;
const ME_POWERFUL_WIDTH = 300;
const ME_POWERFUL_HEIGHT = 400;
const ME_LIFE = 1;
const ME_RESPAWN = 1000000000;
const ME_SPEED = 5;
const ME_SPEEDDOWN = 3;

let ARROWKEY_SPEED = {
    x: 0,
    y: 0
};

const SHOT_DEFAULT_COUNT = -3;
const SHOT_LIFE = 1;

const SHOT_NORMAL_IMG1 = '/happymountain/src/img/shot1.png';
const SHOT_NORMAL_IMG2 = '/happymountain/src/img/shot2.png';
const SHOT_NORMAL_IMG3 = '/happymountain/src/img/shot6.png';
const SHOT_NORMAL_WIDTH = 30;
const SHOT_NORMAL_HEIGHT = 30;
const SHOT_NORMAL_SPEED = [0, -16];
const SHOT_RIGHT_SPEED = [16, 0];
const SHOT_STRONG_IMG = '/happymountain/src/img/shot5.png';
const SHOT_STRONG_SPEED1 = [-4, -16];
const SHOT_STRONG_SPEED2 = [4, -16];
const SHOT_POWERFUL_WIDTH = STAGE_WIDTH / 2;
const SHOT_POWERFUL_HEIGHT = STAGE_WIDTH / 2;
const SHOT_POWERFUL_SPEED = [0, -2];
const SHOT_POWERFULRIGHT_SPEED = [2, 0];

const SHOT_BIG_WIDTH = 60;
const SHOT_BIG_HEIGHT = 60;
const SHOT_BIG_SPEED = [0, -32];
const SHOT_BOSS2_SPEED = [8, 0, true];
const SHOT_BOSS3_SPEED = [-32, 0, true];

const SHOT_BOSS3_SPEED2 = [0, -48];

const SHOT_BOSS1_IMG = '/happymountain/src/img/shot3.png';
const SHOT_BOSS2_IMG = '/happymountain/src/img/shot4.png';
const SHOT_BOSS3_IMG = '/happymountain/src/img/shot7.png';
const SHOT_BOSS3_IMG2 = '/happymountain/src/img/shot8.png';

const ENEMY_SPEED = {
    normal: [
        function () { return 0; },
        function () { return 1.5; }
    ],
    stay: [
        function () { return 0; },
        function (t) {
            if (t.timer < 20) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    stay2: [
        function () { return 0; },
        function (t) {
            if (t.timer < 60) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    title: [
        function () { return 0; },
        function (t) {
            if (t.timer < 45) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    slanting: [
        function (t) {
            return Math.cos(t.timer / 20) * t.timer / 30;
        },
        function (t) {
            return Math.sin(t.timer / 200) * t.timer / 20;
        }
    ],
    boss1: [
        function (t) {
            if (t.form === 1) {
                t.x = Math.round(t.x);
                if (t.x !== 225) {
                    return (225 - t.x) / 20;
                } else {
                    t.form = 2;
                    t.timer = 0;
                    return 0;
                }
            } else {
                return Math.cos(t.timer / 80) * 1.5;
            }
        },
        function (t) {
            if (t.timer < 20) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    boss2: [
        function (t) {
            if (t.form === 1) {
                t.x = Math.round(t.x);
                if (t.x !== 225) {
                    return (225 - t.x) / 20;
                } else {
                    t.form = 2;
                    t.timer = 0;
                    return 0;
                }
            } else {
                return Math.cos(t.timer / 80) * 1.5;
            }
        },
        function (t) {
            if (t.timer < 20) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    strong: [
        function () { return 0; },
        function () { return 3; }
    ],
    strongstay: [
        function (t) {
            return Math.cos(t.timer / 80) * 1.5;
        },
        function (t) {
            if (t.timer < 20) {
                return 2;
            } else {
                return 0;
            }
        }
    ],
    bluenormal: [
        function () { return 0; },
        function () { return 1.5; }
    ],
    boss3: [
        function (t) {
            if (t.timer === 1) {
                t.shotinterval = 6;
            }
            return Math.cos(t.timer / 80) * 1.5;
        },
        function (t) {
            if (t.timer < 20) {
                return 2;
            } else {
                return 0;
            }
        }
    ]
};

const ENEMY_IMG = [
    '/happymountain/src/img/title.png',
    '/happymountain/src/img/enemy1.png',
    '/happymountain/src/img/boss.png',
    '/happymountain/src/img/tale1.png',
    '/happymountain/src/img/boss2.png',
    '/happymountain/src/img/tale2.png',
    '/happymountain/src/img/enemy2.png',
    '/happymountain/src/img/warning.png',
    '/happymountain/src/img/boss3.png',
    '/happymountain/src/img/tale3.png',
    '/happymountain/src/img/tale4.png',
    '/happymountain/src/img/staff.png',
];

const ENEMY_LIFE = 1;

const BGSTAR_MAX = 50;
const BGSTAR_COLOR1 = '#00ffff';
const BGSTAR_COLOR2 = 'olive';
const BGSTAR_COLOR3 = '#4169E1';
const BGSTAR_COLOR4 = '#ff00e5';

const DUMMY_LIFE = 1;

const EXPLOSION_MAX = 20;
const EXPLOSION_TIMER = 200;

const NLDG_IMG = '/happymountain/src/img/loading.png';
const NLDG_WIDTH = 100;
const NLDG_HEIGHT = 50;
const NLDG_X = STAGE_WIDTH - NLDG_WIDTH / 2;
const NLDG_Y = STAGE_HEIGHT - NLDG_HEIGHT / 2;

const RIGHTSIDE_IMG = '/happymountain/src/img/rightside.png';
const STAR_IMG = '/happymountain/src/img/star.png';
const COUNTDOWN_IMG = '/happymountain/src/img/countdown.png';

const TITLE_RESPAWN = 1000000;

const NOTICE_WIDTH = 160;
const NOTICE_HEIGHT = 120;
const NOTICE_STARTX = -NOTICE_WIDTH / 2;
const NOTICE_STARTY = NOTICE_HEIGHT / 2;
const NOTICE_IMG1 = '/happymountain/src/img/bosspowerful.png';
const NOTICE_IMG2 = '/happymountain/src/img/mepowerful.png';
const NOTICE_IMG3 = '/happymountain/src/img/floor1.png';
const NOTICE_IMG4 = '/happymountain/src/img/floor2.png';
const NOTICE_IMG5 = '/happymountain/src/img/boss2powerful.png';
const NOTICE_IMG6 = '/happymountain/src/img/floor3.png';
const NOTICE_IMG7 = '/happymountain/src/img/message.png';
const NOTICE_IMG8 = '/happymountain/src/img/boss3appear.png';
const NOTICE_IMG9 = '/happymountain/src/img/boss3powerful1.png';
const NOTICE_IMG10 = '/happymountain/src/img/boss3powerful2.png';

const NOTICE8_WIDTH = 300;
const NOTICE8_HEIGHT = 500;

const ENEMY_BOSS1_FORM1 = 200;