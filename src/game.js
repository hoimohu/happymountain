(function () {
    function start(enemymap) {
        const gamecanvas = new stage(document.getElementById('maincanvas'), enemymap);
        gamecanvas.init();
        const game_backgroundstar = new backgroundstar(gamecanvas);
        gamecanvas.characters.push(game_backgroundstar);
        const game_me = new me(gamecanvas);
        gamecanvas.characters.push(game_me);
        gamecanvas.player = game_me;

        let shotCount = SHOT_DEFAULT_COUNT;
        let ispressZ = false;
        let ispressX = false;
        (function loop() {
            if (GAME_RUN) {
                gamecanvas.frames++;
                if (enemymap[gamecanvas.floor][gamecanvas.frames] != null) {
                    const element = enemymap.enemytype[enemymap[gamecanvas.floor][gamecanvas.frames]];
                    const newenemy = new enemy(element.x, element.y, element.w, element.h, element.speed, element.life, ENEMY_IMG[element.i], gamecanvas);
                    gamecanvas.characters.push(newenemy);
                    gamecanvas.enemies.push(newenemy);
                }
                if (shotCount < 0) {
                    shotCount++;
                } else if (ispressZ) {
                    if (game_me.ispowerful) {
                        shotCount = SHOT_DEFAULT_COUNT / 2;
                    } else {
                        shotCount = SHOT_DEFAULT_COUNT;
                    }
                    if (game_me.life > 0) {
                        const myshot = game_me.shot(game_me.shottype);
                        for (let index = 0; index < myshot.length; index++) {
                            const element = myshot[index];
                            gamecanvas.characters.push(element);
                        }
                    }
                }
                if (ispressX && game_me.ispowerful !== true) {
                    game_me.shot('powerful');
                }
                gamecanvas.render();
                requestAnimationFrame(loop);
            }
        })();

        window.onkeydown = function (e) {
            let speedratio = 1;
            if (e.shiftKey || e.ctrlKey) {
                speedratio = ME_SPEEDDOWN;
                game_me.isslow = true;
            } else {
                game_me.isslow = false;
            }
            switch (e.key) {
                case 'ArrowLeft':
                    ARROWKEY_SPEED.x = -ME_SPEED / speedratio;
                    break;
                case 'ArrowRight':
                    ARROWKEY_SPEED.x = ME_SPEED / speedratio;
                    break;
                case 'ArrowUp':
                    ARROWKEY_SPEED.y = -ME_SPEED / speedratio;
                    break;
                case 'ArrowDown':
                    ARROWKEY_SPEED.y = ME_SPEED / speedratio;
                    break;
                case 'Shift':
                case 'Control':
                    if (Math.abs(ARROWKEY_SPEED.x) === ME_SPEED) {
                        ARROWKEY_SPEED.x /= ME_SPEEDDOWN;
                        game_me.isslow = true;
                    }
                    if (Math.abs(ARROWKEY_SPEED.y) === ME_SPEED) {
                        ARROWKEY_SPEED.y /= ME_SPEEDDOWN;
                        game_me.isslow = true;
                    }
                    break;
                case 'z':
                case 'Z':
                    ispressZ = true;
                    break;
                case 'x':
                case 'X':
                    ispressX = true;
                    break;
            }
        };
        window.onkeyup = function (e) {
            switch (e.key) {
                case 'ArrowLeft':
                    if (ARROWKEY_SPEED.x < 0) {
                        ARROWKEY_SPEED.x = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (ARROWKEY_SPEED.x > 0) {
                        ARROWKEY_SPEED.x = 0;
                    }
                    break;
                case 'ArrowUp':
                    if (ARROWKEY_SPEED.y < 0) {
                        ARROWKEY_SPEED.y = 0;
                    }
                    break;
                case 'ArrowDown':
                    if (ARROWKEY_SPEED.y > 0) {
                        ARROWKEY_SPEED.y = 0;
                    }
                    break;
                case 'Shift':
                case 'Control':
                    if (Math.abs(ARROWKEY_SPEED.x) === ME_SPEED / ME_SPEEDDOWN) {
                        ARROWKEY_SPEED.x *= ME_SPEEDDOWN;
                        game_me.isslow = false;
                    }
                    if (Math.abs(ARROWKEY_SPEED.y) === ME_SPEED / ME_SPEEDDOWN) {
                        ARROWKEY_SPEED.y *= ME_SPEEDDOWN;
                        game_me.isslow = false;
                    }
                    break;
                case 'z':
                case 'Z':
                    ispressZ = false;
                    break;
                case 'x':
                case 'X':
                    ispressX = false;
                    break;
            }
        };
        function resize() {
            if (innerWidth / 4 * 3 < innerHeight) {
                gamecanvas.canvas.className = 'wideheight';
            } else {
                gamecanvas.canvas.className = 'widewidth';
            }
        }
        window.onresize = resize;
        window.onorientationchange = resize;
        resize();
    }

    fetch('/happymountain/src/enemymap.json')
        .then(r => r.json())
        .then(start);
})();