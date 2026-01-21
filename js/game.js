/**
 * 💕 LOVE JOURNEY - Main Game Logic
 * Winding board game with crossing paths
 */

class LoveGameBoard {
    constructor() {
        // Game state
        this.players = [
            { name: 'Anh', position: 0, isPaused: false, lightningStrikes: 0 },
            { name: 'Em', position: 0, isPaused: false, lightningStrikes: 0 },
        ];
        this.currentPlayer = 0;
        this.gamePhase = 'setup';

        // Board renderer
        this.board = new BoardRenderer();
        this.totalTiles = this.board.tilesPerLane;

        // Overlap mechanics
        this.overlapState = {
            waiting: false,
            waitingPlayer: null,
            waitingPosition: null,
            waitAttempts: 0,
            maxAttempts: 3,
        };

        // Modules
        this.dice = new Dice();

        // Timer
        this.questionTimer = null;
        this.timerSeconds = 60;

        // Pending action
        this.pendingAction = null;
        this.currentSpecialType = null;

        // DOM
        this.screens = {
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
        };

        this.modals = {
            question: document.getElementById('question-modal'),
            special: document.getElementById('special-modal'),
            win: document.getElementById('win-modal'),
            overlap: document.getElementById('overlap-modal'),
            couple: document.getElementById('couple-modal'),
            dualMeeting: document.getElementById('dual-meeting-modal'),
            choice: document.getElementById('choice-modal'),
            punishment: document.getElementById('punishment-modal'),
            revenge: document.getElementById('revenge-modal'),
            waitContinue: document.getElementById('wait-continue-modal'),
            lightning: document.getElementById('lightning-modal'),
        };

        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
        document.getElementById('roll-dice-btn').addEventListener('click', () => this.handleDiceRoll());
        document.getElementById('complete-task-btn').addEventListener('click', () => this.completeTask());
        document.getElementById('special-ok-btn').addEventListener('click', () => this.handleSpecialTileComplete());
        document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('overlap-ok-btn')?.addEventListener('click', () => {
            this.closeModal('overlap');
            this.nextTurn();
        });
        document.getElementById('couple-complete-btn')?.addEventListener('click', () => this.completeCoupleActivity());
        document.getElementById('dual-meeting-complete-btn')?.addEventListener('click', () => this.completeDualMeeting());
        document.getElementById('choice-accept-btn')?.addEventListener('click', () => this.handleOverlapChoice(true));
        document.getElementById('choice-refuse-btn')?.addEventListener('click', () => this.handleOverlapChoice(false));
        document.getElementById('punishment-ok-btn')?.addEventListener('click', () => this.completePunishment());
        document.getElementById('revenge-ok-btn')?.addEventListener('click', () => this.completeRevenge());

        // Wait/Continue modal buttons
        document.getElementById('wait-btn')?.addEventListener('click', () => this.handleWaitChoice(true));
        document.getElementById('continue-btn')?.addEventListener('click', () => this.handleWaitChoice(false));

        // Lightning punishment modal buttons
        document.getElementById('lightning-action-btn')?.addEventListener('click', () => this.handleLightningPunishment('action'));
        document.getElementById('lightning-question-btn')?.addEventListener('click', () => this.handleLightningPunishment('question'));

        document.querySelectorAll('#player1-name, #player2-name').forEach(input => {
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.startGame(); });
        });

        // Back to menu button
        document.getElementById('back-to-menu-btn')?.addEventListener('click', () => this.backToMenu());

        // Audio settings handlers
        this.initAudioSettings();
    }

    initAudioSettings() {
        const sfxSlider = document.getElementById('sfx-volume');
        const musicSlider = document.getElementById('music-volume');
        const musicToggle = document.getElementById('music-toggle');
        const sfxValue = document.getElementById('sfx-value');
        const musicValue = document.getElementById('music-value');

        // Load saved settings or use defaults
        this.audioSettings = {
            sfxVolume: parseInt(localStorage.getItem('sfxVolume')) || 70,
            musicVolume: parseInt(localStorage.getItem('musicVolume')) || 50,
            musicEnabled: localStorage.getItem('musicEnabled') !== 'false'
        };

        // Apply saved settings to sliders
        if (sfxSlider) {
            sfxSlider.value = this.audioSettings.sfxVolume;
            sfxValue.textContent = `${this.audioSettings.sfxVolume}%`;
            sfxSlider.addEventListener('input', (e) => {
                this.audioSettings.sfxVolume = parseInt(e.target.value);
                sfxValue.textContent = `${e.target.value}%`;
                localStorage.setItem('sfxVolume', e.target.value);
            });
        }

        if (musicSlider) {
            musicSlider.value = this.audioSettings.musicVolume;
            musicValue.textContent = `${this.audioSettings.musicVolume}%`;
            musicSlider.addEventListener('input', (e) => {
                this.audioSettings.musicVolume = parseInt(e.target.value);
                musicValue.textContent = `${e.target.value}%`;
                localStorage.setItem('musicVolume', e.target.value);
            });
        }

        if (musicToggle) {
            musicToggle.checked = this.audioSettings.musicEnabled;
            musicToggle.addEventListener('change', (e) => {
                this.audioSettings.musicEnabled = e.target.checked;
                localStorage.setItem('musicEnabled', e.target.checked);
            });
        }
    }

    backToMenu() {
        // Confirm before going back if game is in progress
        if (this.gamePhase === 'playing') {
            if (!confirm('Bạn có chắc muốn thoát? Tiến trình sẽ mất!')) {
                return;
            }
        }

        // Reset game state
        this.players.forEach(p => { p.position = 0; p.isPaused = false; p.lightningStrikes = 0; });
        this.overlapState = { waiting: false, waitingPlayer: null, waitingPosition: null, waitAttempts: 0, maxAttempts: 3 };
        this.currentPlayer = 0;
        this.gamePhase = 'setup';

        // Clear any active timers
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }

        // Close all modals
        Object.keys(this.modals).forEach(k => this.closeModal(k));

        // Switch screens
        this.screens.game.classList.remove('active');
        this.screens.setup.classList.add('active');
    }

    startGame() {
        this.players[0].name = document.getElementById('player1-name').value.trim() || 'Anh';
        this.players[1].name = document.getElementById('player2-name').value.trim() || 'Em';

        resetAndShuffleQuestions();

        this.screens.setup.classList.remove('active');
        this.screens.game.classList.add('active');

        // Initialize board
        this.board.init();

        this.updatePlayerDisplay();
        this.gamePhase = 'playing';
        this.updateTurnIndicator();
    }

    updatePlayerDisplay() {
        document.getElementById('p1-display-name').textContent = this.players[0].name;
        document.getElementById('p2-display-name').textContent = this.players[1].name;
        this.updatePositionDisplay();
        this.updatePenaltyDisplay();
    }

    updatePositionDisplay() {
        document.getElementById('p1-position').textContent = `Ô ${this.players[0].position}/${this.totalTiles - 1}`;
        document.getElementById('p2-position').textContent = `Ô ${this.players[1].position}/${this.totalTiles - 1}`;
    }

    updatePenaltyDisplay() {
        const p1 = document.getElementById('p1-penalty');
        const p2 = document.getElementById('p2-penalty');
        if (p1) p1.textContent = `⚡ ${this.players[0].lightningStrikes}`;
        if (p2) p2.textContent = `⚡ ${this.players[1].lightningStrikes}`;
    }

    updateTurnIndicator() {
        document.getElementById('current-player-name').textContent = this.players[this.currentPlayer].name;
        document.querySelector('.p1-card').classList.toggle('active', this.currentPlayer === 0);
        document.querySelector('.p2-card').classList.toggle('active', this.currentPlayer === 1);
    }

    async handleDiceRoll() {
        if (this.gamePhase !== 'playing') return;

        const player = this.players[this.currentPlayer];

        if (player.isPaused) {
            player.isPaused = false;
            this.showNotification(`${player.name} hết nghỉ lượt! 💋`);
            this.nextTurn();
            return;
        }

        const rollBtn = document.getElementById('roll-dice-btn');
        rollBtn.disabled = true;

        const result = await this.dice.roll();

        if (result) {
            if (this.overlapState.waiting && this.overlapState.waitingPlayer !== this.currentPlayer) {
                await this.handleOverlapApproach(result);
            } else {
                await this.handleNormalMovement(result);
            }
        }

        rollBtn.disabled = false;
    }

    async handleNormalMovement(diceResult) {
        const player = this.players[this.currentPlayer];
        const distanceToFinish = (this.totalTiles - 1) - player.position;

        // End-game rule: If within 6 tiles, allow overshoot (finish with any roll >= distance)
        // Otherwise, need exact roll
        if (diceResult > distanceToFinish && distanceToFinish > 6) {
            this.showNotification(`Cần đúng ${distanceToFinish} điểm để về đích! 🎯`);
            this.nextTurn();
            return;
        }

        // Calculate new position (cap at finish if overshooting in end-game)
        const newPosition = Math.min(player.position + diceResult, this.totalTiles - 1);

        // Animate movement
        await this.board.animatePlayerMovement(this.currentPlayer + 1, player.position, newPosition);

        player.position = newPosition;
        this.updatePositionDisplay();
        this.board.highlightTile(this.currentPlayer + 1, newPosition);

        // Check win
        if (player.position >= this.totalTiles - 1) {
            this.handleWin();
            return;
        }

        // Check overlap
        if (this.board.isOverlapTile(newPosition)) {
            await this.handleOverlapTile(newPosition);
            return;
        }

        await this.handleTileEffect(newPosition);
    }
    async handleOverlapTile(position) {
        const otherPlayer = this.players[this.currentPlayer === 0 ? 1 : 0];
        const otherPlayerIndex = this.currentPlayer === 0 ? 1 : 0;

        // Case 1: Other player is AHEAD (already passed this meeting point)
        if (otherPlayer.position > position) {
            // Second player arrived at meeting point - ask first player to return
            this.showChoiceModal(position);
        } else {
            // Case 2: First player arrived - show Wait or Continue choice
            this.pendingAction = {
                type: 'waitContinue',
                overlapPosition: position,
                waitingPlayer: this.currentPlayer
            };
            this.showWaitContinueModal(position);
        }
    }

    showWaitContinueModal(position) {
        const player = this.players[this.currentPlayer];
        document.getElementById('wait-continue-title').textContent = `💑 Điểm Hẹn!`;
        document.getElementById('wait-continue-desc').textContent =
            `${player.name} đã đến Điểm Hẹn! Chờ đợi ${this.players[this.currentPlayer === 0 ? 1 : 0].name} hay tiếp tục?`;
        this.openModal('waitContinue');
    }

    handleWaitChoice(wait) {
        this.closeModal('waitContinue');
        const { overlapPosition, waitingPlayer } = this.pendingAction;

        if (wait) {
            // Player chooses to wait for 3 turns
            this.overlapState = {
                waiting: true,
                waitingPlayer: waitingPlayer,
                waitingPosition: overlapPosition,
                waitAttempts: 0,
                maxAttempts: 3,
            };
            this.showNotification(`${this.players[waitingPlayer].name} sẽ chờ 3 lượt! 💕`);
            this.nextTurn();
        } else {
            // Player chooses to continue - add lightning strike
            this.players[waitingPlayer].lightningStrikes++;
            this.updatePenaltyDisplay();
            this.showNotification(`${this.players[waitingPlayer].name} nhận 1 ⚡!`);

            // Check if >= 2 strikes
            if (this.players[waitingPlayer].lightningStrikes >= 2) {
                this.pendingAction = { type: 'lightningPunishment', punishedPlayer: waitingPlayer };
                this.showLightningPunishmentModal(waitingPlayer);
            } else {
                this.nextTurn();
            }
        }
        this.pendingAction = null;
    }

    showLightningPunishmentModal(playerIndex) {
        const player = this.players[playerIndex];
        const otherPlayer = this.players[playerIndex === 0 ? 1 : 0];
        document.getElementById('lightning-title').textContent = `⚡⚡ Sét Đánh ${player.name}!`;
        document.getElementById('lightning-desc').textContent =
            `${player.name} đã tích đủ 2 sét! ${otherPlayer.name} được quyền phạt!`;
        this.openModal('lightning');
    }

    handleLightningPunishment(type) {
        this.closeModal('lightning');
        const { punishedPlayer } = this.pendingAction;

        // Reset lightning strikes after punishment
        this.players[punishedPlayer].lightningStrikes = 0;
        this.updatePenaltyDisplay();

        if (type === 'action') {
            // Show dare question
            const dare = getNextQuestion('dare');
            document.getElementById('question-category-icon').textContent = '🔥';
            document.getElementById('question-category-name').textContent = 'Thử Thách Phạt';
            document.getElementById('question-text').textContent = dare;
            this.openModal('question');
        } else {
            // Other player asks any question - show notification
            const otherPlayer = this.players[punishedPlayer === 0 ? 1 : 0];
            this.showNotification(`${otherPlayer.name} được hỏi ${this.players[punishedPlayer].name} bất kỳ điều gì! 💬`);
            this.nextTurn();
        }
        this.pendingAction = null;
    }

    async handleOverlapApproach(diceResult) {
        const player = this.players[this.currentPlayer];
        const targetPosition = this.overlapState.waitingPosition;
        const distanceToOverlap = targetPosition - player.position;

        this.overlapState.waitAttempts++;

        // If dice roll reaches or overshoots the meeting point, STOP at meeting point
        if (diceResult >= distanceToOverlap && distanceToOverlap > 0) {
            // Stop exactly at the meeting point (no overshoot)
            await this.board.animatePlayerMovement(this.currentPlayer + 1, player.position, targetPosition);
            player.position = targetPosition;
            this.updatePositionDisplay();
            this.overlapState.waiting = false;
            // Both players complete challenge together
            this.showCoupleActivityModal();
        } else {
            // Normal movement (didn't reach meeting point yet)
            const newPosition = Math.min(player.position + diceResult, this.totalTiles - 1);
            await this.board.animatePlayerMovement(this.currentPlayer + 1, player.position, newPosition);
            player.position = newPosition;
            this.updatePositionDisplay();

            if (this.overlapState.waitAttempts >= this.overlapState.maxAttempts) {
                this.showNotification(`${this.players[this.overlapState.waitingPlayer].name} được đi tiếp!`);
                this.overlapState.waiting = false;
            } else {
                const remaining = this.overlapState.maxAttempts - this.overlapState.waitAttempts;
                this.showNotification(`Còn ${remaining} lần để đến Điểm Hẹn! 💑`);
            }

            await this.handleTileEffect(newPosition);
        }
    }

    showChoiceModal(overlapPosition) {
        const otherPlayerIndex = this.currentPlayer === 0 ? 1 : 0;
        this.pendingAction = { type: 'overlapChoice', overlapPosition, choosingPlayer: otherPlayerIndex };

        document.getElementById('choice-title').textContent = `${this.players[otherPlayerIndex].name}!`;
        document.getElementById('choice-desc').textContent = `${this.players[this.currentPlayer].name} đã đến Điểm Hẹn. Quay lại gặp nhau không?`;

        this.openModal('choice');
    }

    handleOverlapChoice(accept) {
        this.closeModal('choice');
        const { choosingPlayer, overlapPosition } = this.pendingAction;

        if (accept) {
            // First player returns to meeting point
            this.players[choosingPlayer].position = overlapPosition;
            this.board.updatePlayerPosition(choosingPlayer + 1, overlapPosition);
            this.updatePositionDisplay();
            this.showCoupleActivityModal();
        } else {
            // First player refuses - add lightning strike
            this.players[choosingPlayer].lightningStrikes++;
            this.updatePenaltyDisplay();
            this.showNotification(`${this.players[choosingPlayer].name} nhận 1 ⚡!`);

            // Check if >= 2 strikes for punishment
            if (this.players[choosingPlayer].lightningStrikes >= 2) {
                this.pendingAction = { type: 'lightningPunishment', punishedPlayer: choosingPlayer };
                this.showLightningPunishmentModal(choosingPlayer);
            } else {
                this.nextTurn();
            }
        }
        this.pendingAction = null;
    }

    showOverlapWaitingModal() {
        document.getElementById('overlap-title').textContent = "💑 Điểm Hẹn!";
        document.getElementById('overlap-desc').textContent =
            `${this.players[this.currentPlayer].name} đợi ${this.players[this.currentPlayer === 0 ? 1 : 0].name} (3 lần roll)`;
        this.openModal('overlap');
    }

    showCoupleActivityModal() {
        const activity = getRandomCoupleActivity();
        document.getElementById('couple-title').textContent = activity.title;
        document.getElementById('couple-desc').textContent = activity.description;
        document.getElementById('couple-duration').textContent = `⏱️ ${activity.duration}s`;
        this.openModal('couple');
    }

    completeCoupleActivity() {
        this.closeModal('couple');
        // Check if both players are at different overlap tiles
        this.checkDualMeeting();
    }

    /**
     * Check if both players are at DIFFERENT overlap tiles
     * If so, trigger dual meeting modal with 2 activities each
     */
    checkDualMeeting() {
        const p1Pos = this.players[0].position;
        const p2Pos = this.players[1].position;
        const intersections = this.board.intersectionIndices;

        const p1AtOverlap = intersections.includes(p1Pos);
        const p2AtOverlap = intersections.includes(p2Pos);

        if (p1AtOverlap && p2AtOverlap && p1Pos !== p2Pos) {
            this.showDualMeetingModal();
        } else {
            this.nextTurn();
        }
    }

    showDualMeetingModal() {
        // Get 2 activities for the dual meeting
        const activity1 = getRandomCoupleActivity();
        const activity2 = getRandomCoupleActivity();

        document.getElementById('dual-meeting-title').textContent = 'Cả Hai Đều Ở Điểm Hẹn!';
        document.getElementById('dual-meeting-desc').textContent =
            `${this.players[0].name} ở Hẹn ${this.board.intersectionIndices.indexOf(this.players[0].position) + 1}, ` +
            `${this.players[1].name} ở Hẹn ${this.board.intersectionIndices.indexOf(this.players[1].position) + 1}. ` +
            `Mỗi người hoàn thành 2 hoạt động!`;
        document.getElementById('dual-activity-1').textContent = `🔸 ${activity1.title}: ${activity1.description}`;
        document.getElementById('dual-activity-2').textContent = `🔸 ${activity2.title}: ${activity2.description}`;

        this.openModal('dualMeeting');
    }

    completeDualMeeting() {
        this.closeModal('dualMeeting');
        this.nextTurn();
    }

    showPunishmentModal(playerIndex) {
        document.getElementById('punishment-title').textContent = `⚠️ Phạt ${this.players[playerIndex].name}!`;
        document.getElementById('punishment-desc').textContent = getRandomPunishment();
        document.getElementById('punishment-count').textContent = `${this.players[playerIndex].penalties}/3`;
        this.openModal('punishment');
    }

    completePunishment() {
        this.closeModal('punishment');
        this.nextTurn();
    }

    showRevengeModal(playerIndex) {
        document.getElementById('revenge-title').textContent = `🔥 ${this.players[playerIndex].name} PHẢN ĐÒN!`;
        document.getElementById('revenge-desc').textContent = getRandomRevenge();
        this.openModal('revenge');
    }

    completeRevenge() {
        this.closeModal('revenge');
        this.nextTurn();
    }

    async handleTileEffect(position) {
        const type = this.board.getTileType(this.currentPlayer + 1, position);

        if (isSpecialTile(type)) {
            this.showSpecialTileModal(type);
        } else if (type !== 'start' && type !== 'finish' && type !== 'overlap') {
            this.showQuestionModal(type);
        } else {
            this.nextTurn();
        }
    }

    showQuestionModal(type) {
        const info = CATEGORY_INFO[type];
        const question = getNextQuestion(type);

        const header = document.getElementById('modal-header');
        header.className = `modal-header ${type}`;
        document.getElementById('modal-icon').textContent = info.icon;
        document.getElementById('modal-category').textContent = info.name;
        document.getElementById('question-text').textContent = question;

        this.startTimer();
        this.openModal('question');
    }

    startTimer() {
        this.timerSeconds = 60;
        const progress = document.getElementById('timer-progress');
        const text = document.getElementById('timer-text');

        progress.style.width = '100%';
        text.textContent = '60s';

        this.questionTimer = setInterval(() => {
            this.timerSeconds--;
            progress.style.width = `${(this.timerSeconds / 60) * 100}%`;
            text.textContent = `${this.timerSeconds}s`;
            if (this.timerSeconds <= 0) this.completeTask();
        }, 1000);
    }

    completeTask() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
        this.closeModal('question');
        this.nextTurn();
    }

    showSpecialTileModal(type) {
        const info = getSpecialTileInfo(type);
        document.getElementById('special-icon').textContent = info.icon;
        document.getElementById('special-title').textContent = info.title;
        document.getElementById('special-desc').textContent = info.description;
        this.currentSpecialType = type;
        this.openModal('special');
    }

    handleSpecialTileComplete() {
        this.closeModal('special');
        const type = this.currentSpecialType;
        const curr = this.currentPlayer;
        const other = curr === 0 ? 1 : 0;

        switch (type) {
            case 'bonus':
                if (this.players[curr].position < this.totalTiles - 2) {
                    this.players[curr].position++;
                    this.board.updatePlayerPosition(curr + 1, this.players[curr].position);
                    this.updatePositionDisplay();
                }
                break;
            case 'swap':
                const temp = this.players[curr].position;
                this.players[curr].position = this.players[other].position;
                this.players[other].position = temp;
                this.board.updatePlayerPosition(1, this.players[0].position);
                this.board.updatePlayerPosition(2, this.players[1].position);
                this.updatePositionDisplay();
                break;
            case 'pause':
                this.players[curr].isPaused = true;
                break;
            case 'trap_back':
                // Move back 2 tiles
                const newPos = Math.max(0, this.players[curr].position - 2);
                this.players[curr].position = newPos;
                this.board.updatePlayerPosition(curr + 1, newPos);
                this.updatePositionDisplay();
                this.showNotification(`${this.players[curr].name} lùi 2 ô! 🕳️`);
                break;
            case 'trap_skip':
                // Skip next turn
                this.players[curr].isPaused = true;
                this.showNotification(`${this.players[curr].name} nghỉ lượt sau! ⏭️`);
                break;
            case 'trap_spin':
                // Bonus roll - don't switch turns
                this.showNotification(`${this.players[curr].name} được roll lại! 🎰`);
                return; // Exit early without calling nextTurn
        }
        this.nextTurn();
    }

    nextTurn() {
        if (this.overlapState.waiting) {
            this.currentPlayer = this.overlapState.waitingPlayer === 0 ? 1 : 0;
        } else {
            this.currentPlayer = this.currentPlayer === 0 ? 1 : 0;
        }
        this.updateTurnIndicator();
        this.board.highlightTile(this.currentPlayer + 1, this.players[this.currentPlayer].position);

        if (this.players[this.currentPlayer].isPaused) {
            this.showNotification(`${this.players[this.currentPlayer].name} nghỉ lượt! 💋`);
        }
    }

    handleWin() {
        this.gamePhase = 'finished';
        document.getElementById('winner-name').textContent = this.players[this.currentPlayer].name;
        this.createConfetti();
        this.openModal('win');
        this.playWinSound();
    }

    createConfetti() {
        const container = document.getElementById('confetti');
        container.innerHTML = '';
        const colors = ['#ff6b9d', '#c44cff', '#667eea', '#f7b731', '#2ed573', '#ffd700'];

        for (let i = 0; i < 40; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = `${Math.random() * 100}%`;
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(c);
        }
    }

    playWinSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [523.25, 659.25, 783.99].forEach((f, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.frequency.value = f;
                o.type = 'sine';
                g.gain.setValueAtTime(0.1, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                o.start(ctx.currentTime + i * 0.1);
                o.stop(ctx.currentTime + 1);
            });
        } catch (e) { }
    }

    resetGame() {
        this.players.forEach(p => { p.position = 0; p.isPaused = false; p.lightningStrikes = 0; });
        this.overlapState = { waiting: false, waitingPlayer: null, waitingPosition: null, waitAttempts: 0, maxAttempts: 3 };
        this.currentPlayer = 0;
        this.gamePhase = 'setup';
        resetAndShuffleQuestions();
        this.dice.reset();
        Object.keys(this.modals).forEach(k => this.closeModal(k));
        this.screens.game.classList.remove('active');
        this.screens.setup.classList.add('active');
        document.getElementById('player1-name').value = '';
        document.getElementById('player2-name').value = '';
    }

    openModal(name) { this.modals[name]?.classList.add('active'); }
    closeModal(name) { this.modals[name]?.classList.remove('active'); }
    showNotification(msg) { document.getElementById('dice-result').textContent = msg; }
}

document.addEventListener('DOMContentLoaded', () => { window.game = new LoveGameBoard(); });
