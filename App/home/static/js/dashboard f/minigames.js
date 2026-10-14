// static/js/minigames.js
export function initMiniGames() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return; // Если вкладка еще не активна или холст не найден, выходим

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let currentMode = 0;
    let gameState = 'playing';

    // Игроки для Режима 1
    const p1 = { x: 100, y: 340, width: 32, height: 48, vx: 0, vy: 0, speed: 4, jumpPower: -10, isGrounded: false, hp: 100, facing: 1, color: '#0055ff', shotsLeft: 4, reloadTimer: 0 };
    const p2 = { x: 650, y: 340, width: 32, height: 48, vx: 0, vy: 0, speed: 4, jumpPower: -10, isGrounded: false, hp: 100, facing: -1, color: '#cc0000', shotsLeft: 4, reloadTimer: 0 };

    let bullets = [];
    const gravity = 0.5;
    const keys = {};

    // Для Режима 2
    let spawnTimer = 0;
    let randomDelay = 0;
    let mode2Triggered = false;
    let mode2StartTime = 0;

    // Для Режима 3 (Тир)
    let targets = [];
    let currentTargetIndex = 0;
    let tirStartTime = 0;
    let tirTotalTime = 0;
    let targetCount = 10;
    let misses = 0;
    let countdownValue = 0;
    let countdownTimer = null;

    // Для Режима 4
    let mode4TotalSteps = 20;

    const itemsP1 = [
        { code: 'KeyW', symbol: 'W' },
        { code: 'KeyA', symbol: 'A' },
        { code: 'KeyC', symbol: 'C' },
        { code: 'KeyD', symbol: 'D' }
    ];

    const itemsP2 = [
        { code: 'ArrowUp', symbol: '↑' },
        { code: 'ArrowLeft', symbol: '←' },
        { code: 'ArrowDown', symbol: '↓' },
        { code: 'ArrowRight', symbol: '→' }
    ];

    let mode4P1 = { step: 0, currentTargetCode: '', currentTargetSymbol: '', hits: 0, misses: 0, startTime: 0, totalTime: 0, finished: false };
    let mode4P2 = { step: 0, currentTargetCode: '', currentTargetSymbol: '', hits: 0, misses: 0, startTime: 0, totalTime: 0, finished: false };

    // Функция запуска режима игры
    function startMode(mode) {
        currentMode = mode;
        const mainMenu = document.getElementById('mainMenu');
        const gameContainer = document.getElementById('gameContainer');
        if (mainMenu) mainMenu.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'block';

        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }

        bullets = [];
        p1.x = 100; p1.y = 340; p1.hp = 100; p1.shotsLeft = 4; p1.reloadTimer = 0; p1.facing = 1;
        p2.x = 650; p2.y = 340; p2.hp = 100; p2.shotsLeft = 4; p2.reloadTimer = 0; p2.facing = -1;

        if (mode === 1) {
            gameState = 'playing';
            document.getElementById('hintText').innerHTML = "Игрок 1 (Синий): A/D — движение, W — прыжок, Пробел — стрельба.<br>Игрок 2 (Красный): Стрелки Влево/Вправо — движение, Вверх — прыжок, Стрелка Вниз — стрельба.<br><b>Особенности:</b> 4 выстрела, пули летят в 2 раза медленнее, откат 4 секунды!";
            document.getElementById('statusText').innerText = "Режим 1: Дуэль. Здоровье П1: 100 | П2: 100";
        } else if (mode === 2) {
            gameState = 'waiting_spawn';
            spawnTimer = 0;
            randomDelay = Math.random() * 2000 + 1500;
            mode2Triggered = false;
            document.getElementById('hintText').innerHTML = "Игрок 1: Пробел | Игрок 2: Стрелка Вниз. Кто быстрее нажмет, когда весь экран станет красным!<br><b>Shift</b> — рестарт текущего режима!";
            document.getElementById('statusText').innerText = "Режим 2: Ждите смены цвета экрана...";
        } else if (mode === 3) {
            gameState = 'countdown';
            countdownValue = 3;
            document.getElementById('hintText').innerHTML = "Кликайте мышкой точно по появляющимся красным мишеням как можно быстрее!<br><b>Shift</b> — рестарт текущего режима!";
            document.getElementById('statusText').innerText = `Старт через: ${countdownValue}`;

            countdownTimer = setInterval(() => {
                countdownValue--;
                if (countdownValue > 0) {
                    document.getElementById('statusText').innerText = `Старт через: ${countdownValue}`;
                } else {
                    clearInterval(countdownTimer);
                    countdownTimer = null;
                    gameState = 'playing_tir';
                    currentTargetIndex = 0;
                    misses = 0;
                    targets = [];
                    for (let i = 0; i < targetCount; i++) {
                        targets.push({
                            x: Math.random() * 700 + 50,
                            y: Math.random() * 300 + 50,
                            radius: 20
                        });
                    }
                    tirStartTime = Date.now();
                    document.getElementById('statusText').innerText = `Мишень: 1 / ${targetCount} | Промахи: 0`;
                }
            }, 1000);
        } else if (mode === 4) {
            gameState = 'playing_mode4';
            let now = Date.now();
            mode4P1 = { step: 0, currentTargetCode: '', currentTargetSymbol: '', hits: 0, misses: 0, startTime: now, totalTime: 0, finished: false };
            mode4P2 = { step: 0, currentTargetCode: '', currentTargetSymbol: '', hits: 0, misses: 0, startTime: now, totalTime: 0, finished: false };

            nextMode4Step(mode4P1, itemsP1);
            nextMode4Step(mode4P2, itemsP2);

            document.getElementById('hintText').innerHTML = "<b>Игрок 1:</b> W, A, C, D (Левый экран) | <b>Игрок 2:</b> Стрелки (Правый экран). Нажимайте именно то, что показывается на экране!";
            document.getElementById('statusText').innerText = "Режим 4: Пройдите 20 шагов быстрее соперника!";
        }
    }

    function returnToMenu() {
        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('gameContainer').style.display = 'none';
        currentMode = 0;
    }

    // Привязываем обработчики кликов по кнопкам меню внутри контейнера мини-игры
    const minigamesPane = document.getElementById('minigames');
    if (minigamesPane) {
        minigamesPane.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = parseInt(btn.getAttribute('data-mode'));
                startMode(mode);
            });
        });

        const backBtn = document.getElementById('backToMenuBtn');
        if (backBtn) {
            backBtn.addEventListener('click', returnToMenu);
        }
    }

    function nextMode4Step(playerObj, items) {
        if (playerObj.step >= mode4TotalSteps) {
            if (!playerObj.finished) {
                playerObj.finished = true;
                playerObj.totalTime = Date.now() - playerObj.startTime;
            }
            return;
        }
        playerObj.step++;
        let randomItem = items[Math.floor(Math.random() * items.length)];
        playerObj.currentTargetSymbol = randomItem.symbol;
        playerObj.currentTargetCode = randomItem.code;
    }

    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;

        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            if (currentMode > 0) {
                startMode(currentMode);
                return;
            }
        }

        if (currentMode === 4 && gameState === 'playing_mode4') {
            let validP1Codes = itemsP1.map(i => i.code);
            let validP2Codes = itemsP2.map(i => i.code);

            if (validP1Codes.includes(e.code) && !mode4P1.finished) {
                e.preventDefault();
                if (e.code === mode4P1.currentTargetCode) { mode4P1.hits++; } else { mode4P1.misses++; }
                nextMode4Step(mode4P1, itemsP1);
            } else if (validP2Codes.includes(e.code) && !mode4P2.finished) {
                e.preventDefault();
                if (e.code === mode4P2.currentTargetCode) { mode4P2.hits++; } else { mode4P2.misses++; }
                nextMode4Step(mode4P2, itemsP2);
            }
            return;
        }

        if (currentMode === 1 && gameState === 'playing') {
            if (e.code === 'KeyW' && p1.isGrounded) { p1.vy = p1.jumpPower; p1.isGrounded = false; }
            if (e.code === 'Space') { e.preventDefault(); tryShoot(p1); }

            if (e.code === 'ArrowUp' && p2.isGrounded) { p2.vy = p2.jumpPower; p2.isGrounded = false; }
            if (e.code === 'ArrowDown') { e.preventDefault(); tryShoot(p2); }
        }

        if (currentMode === 2) {
            if (gameState === 'waiting_spawn') {
                if (e.code === 'Space') endReactionGame('Игрок 1 сфальстартил!');
                if (e.code === 'ArrowDown') endReactionGame('Игрок 2 сфальстартил!');
            } else if (gameState === 'ready_to_shoot') {
                let time = Date.now() - mode2StartTime;
                if (e.code === 'Space') endReactionGame(`Победил Игрок 1! Время: ${time} мс`);
                if (e.code === 'ArrowDown') endReactionGame(`Победил Игрок 2! Время: ${time} мс`);
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    canvas.addEventListener('click', (e) => {
        if (currentMode === 3 && gameState === 'playing_tir') {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let target = targets[currentTargetIndex];
            let dist = Math.hypot(mouseX - target.x, mouseY - target.y);

            if (dist <= target.radius) {
                currentTargetIndex++;
                if (currentTargetIndex >= targetCount) {
                    tirTotalTime = Date.now() - tirStartTime;
                    gameState = 'game_over';
                    document.getElementById('statusText').innerText = `ПОБЕДА! Время: ${tirTotalTime} мс | Промахи: ${misses} (Нажмите Shift для рестарта)`;
                } else {
                    document.getElementById('statusText').innerText = `Мишень: ${currentTargetIndex + 1} / ${targetCount} | Промахи: ${misses}`;
                }
            } else {
                misses++;
                document.getElementById('statusText').innerText = `Мишень: ${currentTargetIndex + 1} / ${targetCount} | Промахи: ${misses}`;
            }
        }
    });

    function tryShoot(player) {
        if (player.shotsLeft > 0) {
            bullets.push({
                x: player.facing > 0 ? player.x + 35 : player.x - 10,
                y: player.y + 20,
                vx: player.facing * 5,
                owner: player
            });
            player.shotsLeft--;
            if (player.shotsLeft === 0) { player.reloadTimer = 240; }
        }
    }

    function endReactionGame(text) {
        gameState = 'game_over';
        mode2Triggered = false;
        document.getElementById('statusText').innerText = text + " (Нажмите Shift для рестарта)";
    }

    let clouds = [{ x: 100, y: 50, speed: 0.5 }, { x: 500, y: 80, speed: 0.3 }];
    function drawScene() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        clouds.forEach(c => {
            c.x -= c.speed;
            if (c.x < -60) c.x = canvas.width + 20;
            ctx.fillRect(c.x, c.y, 48, 16);
        });
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 400, canvas.width, 100);
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(0, 400, canvas.width, 10);
    }

    function drawSoldier(p) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x + 8, p.y + 16, 16, 24);
        ctx.fillStyle = '#ffccaa';
        ctx.fillRect(p.x + 10, p.y + 4, 12, 12);
        ctx.fillStyle = p.color === '#0055ff' ? '#0022aa' : '#880000';
        ctx.fillRect(p.x + 8, p.y + 2, 16, 6);
        ctx.fillStyle = '#333';
        let gunX = p.facing > 0 ? p.x + 20 : p.x - 10;
        ctx.fillRect(gunX, p.y + 20, 20, 6);
    }

    let lastTime = performance.now();
    function update(currentTime) {
        let dt = currentTime - lastTime;
        lastTime = currentTime;

        if (currentMode > 0) {
            if (currentMode !== 4 && currentMode !== 2) {
                drawScene();
            } else if (currentMode !== 2) {
                ctx.fillStyle = '#111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            if (currentMode === 1 && gameState === 'playing') {
                [p1, p2].forEach(p => {
                    if (p.reloadTimer > 0) {
                        p.reloadTimer--;
                        if (p.reloadTimer === 0) { p.shotsLeft = 4; }
                    }
                });

                p1.vx = 0;
                if (keys['KeyA']) { p1.vx = -p1.speed; p1.facing = -1; }
                if (keys['KeyD']) { p1.vx = p1.speed; p1.facing = 1; }

                p2.vx = 0;
                if (keys['ArrowLeft']) { p2.vx = -p2.speed; p2.facing = -1; }
                if (keys['ArrowRight']) { p2.vx = p2.speed; p2.facing = 1; }

                [p1, p2].forEach(p => {
                    p.x += p.vx;
                    p.vy += gravity;
                    p.y += p.vy;
                    if (p.y > 340) { p.y = 340; p.vy = 0; p.isGrounded = true; }
                    if (p.x < 0) p.x = 0;
                    if (p.x > canvas.width - p.width) p.x = canvas.width - p.width;
                });

                ctx.fillStyle = '#000000';
                for (let i = bullets.length - 1; i >= 0; i--) {
                    let b = bullets[i];
                    b.x += b.vx;
                    ctx.fillRect(b.x, b.y, 6, 3);

                    if (b.owner === p1 && b.x >= p2.x && b.x <= p2.x + p2.width && b.y >= p2.y && b.y <= p2.y + p2.height) {
                        p2.hp -= 20;
                        bullets.splice(i, 1);
                    } else if (b.owner === p2 && b.x >= p1.x && b.x <= p1.x + p1.width && b.y >= p1.y && b.y <= p1.y + p1.height) {
                        p1.hp -= 20;
                        bullets.splice(i, 1);
                    } else if (b.x < 0 || b.x > canvas.width) {
                        bullets.splice(i, 1);
                    }
                }

                document.getElementById('statusText').innerText = `ЗДОРОВЬЕ -> Синий (П1): ${Math.max(0, p1.hp)} [Патроны: ${p1.shotsLeft}] | Красный (П2): ${Math.max(0, p2.hp)} [Патроны: ${p2.shotsLeft}]`;

                if (p1.hp <= 0 || p2.hp <= 0) {
                    gameState = 'game_over';
                    let winner = p1.hp <= 0 ? "Игрок 2 (Красный)" : "Игрок 1 (Синий)";
                    document.getElementById('statusText').innerText = `ИГРА ОКОНЧЕНА! Победил ${winner}! (Нажмите Shift для рестарта)`;
                }

                drawSoldier(p1);
                drawSoldier(p2);
            }
            else if (currentMode === 2) {
                if (gameState === 'waiting_spawn') {
                    spawnTimer += dt;
                    if (spawnTimer >= randomDelay) {
                        gameState = 'ready_to_shoot';
                        mode2Triggered = true;
                        mode2StartTime = Date.now();
                        document.getElementById('statusText').innerText = "ЦВЕТ ИЗМЕНИЛСЯ! НАЖИМАЙТЕ!";
                    }
                }
                ctx.fillStyle = mode2Triggered ? '#ff0000' : '#111111';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            else if (currentMode === 3 && gameState === 'playing_tir') {
                let t = targets[currentTargetIndex];
                ctx.fillStyle = '#cc0000';
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();

                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.radius / 3, 0, Math.PI * 2);
                ctx.fill();
            }
            else if (currentMode === 4) {
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(400, 0);
                ctx.lineTo(400, 500);
                ctx.stroke();

                // Игрок 1
                ctx.fillStyle = '#1b1b2f';
                ctx.fillRect(0, 0, 398, 500);
                ctx.fillStyle = '#0055ff';
                ctx.font = 'bold 18px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText("ИГРОК 1 (W, A, C, D)", 200, 35);

                if (!mode4P1.finished) {
                    ctx.font = '20px Courier New';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Шаг: ${mode4P1.step} / ${mode4TotalSteps}`, 200, 100);
                    ctx.font = 'bold 60px Courier New';
                    ctx.fillStyle = '#00ffcc';
                    ctx.fillText(`${mode4P1.currentTargetSymbol}`, 200, 220);
                    ctx.font = '15px Courier New';
                    ctx.fillText(`Попаданий: ${mode4P1.hits} | Промахов: ${mode4P1.misses}`, 200, 320);
                } else {
                    ctx.font = 'bold 22px Courier New';
                    ctx.fillStyle = '#00ffcc';
                    ctx.fillText("ГОТОВО!", 200, 200);
                    ctx.font = '16px Courier New';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Время: ${mode4P1.totalTime} мс`, 200, 240);
                    ctx.fillText(`Попаданий: ${mode4P1.hits}`, 200, 280);
                    ctx.fillText(`Промахов: ${mode4P1.misses}`, 200, 310);
                }

                // Игрок 2
                ctx.fillStyle = '#2f1b1b';
                ctx.fillRect(402, 0, 398, 500);
                ctx.fillStyle = '#cc0000';
                ctx.font = 'bold 18px Courier New';
                ctx.fillText("ИГРОК 2 (Стрелки)", 600, 35);

                if (!mode4P2.finished) {
                    ctx.font = '20px Courier New';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Шаг: ${mode4P2.step} / ${mode4TotalSteps}`, 600, 100);
                    ctx.font = 'bold 60px Courier New';
                    ctx.fillStyle = '#ff5555';
                    ctx.fillText(`${mode4P2.currentTargetSymbol}`, 600, 220);
                    ctx.font = '15px Courier New';
                    ctx.fillText(`Попаданий: ${mode4P2.hits} | Промахов: ${mode4P2.misses}`, 600, 320);
                } else {
                    ctx.font = 'bold 22px Courier New';
                    ctx.fillStyle = '#ff5555';
                    ctx.fillText("ГОТОВО!", 600, 200);
                    ctx.font = '16px Courier New';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`Время: ${mode4P2.totalTime} мс`, 600, 240);
                    ctx.fillText(`Попаданий: ${mode4P2.hits}`, 600, 280);
                    ctx.fillText(`Промахов: ${mode4P2.misses}`, 600, 310);
                }
            }
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}