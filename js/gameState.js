// gameState.js — 全域遊戲狀態管理

const GameState = {
  hp: 3,
  mp: 10,
  maxMp: 10,
  level: 1,

  grid: [],
  mazeRows: 13,
  mazeCols: 13,

  playerRow: 0,
  playerCol: 0,

  dialogOpen: false,
  deadEndVisited: new Set(),

  mpRecoveryTimer: null,

  // ── HP ──

  setHp(value) {
    this.hp = value;
    this._updateHpDisplay();
    if (this.hp <= 0) {
      this.hp = 0;
      this._updateHpDisplay();
      DialogSystem.showGameOver();
    }
  },

  _updateHpDisplay() {
    const full  = '♥'.repeat(this.hp);
    const empty = '♡'.repeat(Math.max(0, 3 - this.hp));
    document.getElementById('hp-display').textContent = 'HP: ' + full + empty;
  },

  // ── MP ──

  setMp(value) {
    this.mp = Math.max(0, Math.min(this.maxMp, value));
    this._updateMpDisplay();
  },

  _updateMpDisplay() {
    const ratio = this.mp / this.maxMp;
    document.getElementById('mp-bar').style.width = (ratio * 100) + '%';
    document.getElementById('mp-number').textContent = this.mp + '/' + this.maxMp;
  },

  // ── 計時器 ──

  startMpTimer() {
    this.stopMpTimer();
    this.mpRecoveryTimer = setInterval(() => {
      if (this.mp < this.maxMp) {
        this.setMp(this.mp + 1);
      }
    }, 10000);
  },

  stopMpTimer() {
    if (this.mpRecoveryTimer !== null) {
      clearInterval(this.mpRecoveryTimer);
      this.mpRecoveryTimer = null;
    }
  },

  // ── 關卡推進 ──

  advanceLevel() {
    this.level++;
    this.mazeRows = 13 + (this.level - 1) * 3;
    this.mazeCols = 13 + (this.level - 1) * 3;
    this.hp = 3;
    this.mp = 10;
    this.deadEndVisited = new Set();
    this.playerRow = 0;
    this.playerCol = 0;

    document.getElementById('level-display').textContent = '關卡 ' + this.level;
    this._updateHpDisplay();
    this._updateMpDisplay();

    MazeEngine.generate(this.mazeRows, this.mazeCols);
    MazeEngine.render();
    Player.updatePosition();
    this.startMpTimer();
  },

  // ── 完整重置（重新開始）──

  reset() {
    this.stopMpTimer();
    this.level = 1;
    this.mazeRows = 13;
    this.mazeCols = 13;
    this.hp = 3;
    this.mp = 10;
    this.deadEndVisited = new Set();
    this.playerRow = 0;
    this.playerCol = 0;
    this.dialogOpen = false;

    document.getElementById('level-display').textContent = '關卡 1';
    this._updateHpDisplay();
    this._updateMpDisplay();

    MazeEngine.generate(this.mazeRows, this.mazeCols);
    MazeEngine.render();
    Player.updatePosition();
    this.startMpTimer();
  }
};
