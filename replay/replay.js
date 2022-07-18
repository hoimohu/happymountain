(function () {
    function start(enemymap, replay) {
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
                if (replay[gamecanvas.floor] != null) {
                    if (replay[gamecanvas.floor][gamecanvas.frames] != null) {
                        const e = replay[gamecanvas.floor][gamecanvas.frames];
                        const arr = Object.keys(e);
                        for (let index = 0; index < arr.length; index++) {
                            const element = arr[index];
                            if (element === 'x' || element === 'y') {
                                game_me[element] = e[element];
                            } else if (element === 'powerful') {
                                game_me.shot(element);
                            } else if (element === 'slow') {
                                game_me.isslow = true;
                                const myshot = game_me.shot(game_me.shottype);
                                game_me.isslow = false;
                                for (let index = 0; index < myshot.length; index++) {
                                    const element = myshot[index];
                                    gamecanvas.characters.push(element);
                                }
                            } else {
                                const myshot = game_me.shot(game_me.shottype);
                                for (let index = 0; index < myshot.length; index++) {
                                    const element = myshot[index];
                                    gamecanvas.characters.push(element);
                                }
                            }
                        }
                    }
                }
                gamecanvas.render();
                requestAnimationFrame(loop);
            }
        })();

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

    const fileinput = document.getElementById('fileinput');
    fileinput.addEventListener('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            const replay = JSON.parse(fr.result);
            fetch('/happymountain/src/enemymap.json')
                .then(r => r.json())
                .then(j => start(j, replay));
        };
        fr.readAsText(this.files[0]);
    });
})();