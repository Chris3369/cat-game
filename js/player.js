// player.js — 玩家移動與事件觸發

const Player = {
  _element: null,

  init() {
    this._element = document.getElementById('player');
    this.updatePosition();
  },

  updatePosition() {
    const r = GameState.playerRow;
    const c = GameState.playerCol;
    // 置中於格子
    const offset = (CELL_SIZE - 28) / 2;   // (格寬 - emoji 大小) / 2
    this._element.style.top  = (r * CELL_SIZE + offset) + 'px';
    this._element.style.left = (c * CELL_SIZE + offset) + 'px';
  },

  move(dir) {
    if (GameState.dialogOpen) return;

    const r = GameState.playerRow;
    const c = GameState.playerCol;
    const cell = GameState.grid[r][c];

    if (cell.walls[dir]) return;  // 有牆，不能移動

    const dirMap = {
      top:    [-1,  0],
      bottom: [ 1,  0],
      left:   [ 0, -1],
      right:  [ 0,  1]
    };
    const [dr, dc] = dirMap[dir];
    GameState.playerRow = r + dr;
    GameState.playerCol = c + dc;

    this.updatePosition();
    this._checkEvents();
  },

  _checkEvents() {
    const r    = GameState.playerRow;
    const c    = GameState.playerCol;
    const cell = GameState.grid[r][c];
    const key  = r + ',' + c;

    // 1. 玳瑁貓
    if (cell.hasCat && !cell.catInteracted) {
      DialogSystem.showTortoiseshellCat(cell);
      return;
    }

    // 2. 死路
    if (cell.isDeadEnd && !GameState.deadEndVisited.has(key)) {
      GameState.deadEndVisited.add(key);
      DialogSystem.showOrangeCat();
      return;
    }

    // 3. 出口
    if (cell.isExit && GameState.hp > 0) {
      DialogSystem.showLevelClear(GameState.level);
    }
  }
};
