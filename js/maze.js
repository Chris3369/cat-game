// maze.js — 迷宮生成、死路標記、玳瑁貓配置、Canvas 渲染

const CELL_SIZE = 48;
const WALL_WIDTH = 2;
const WALL_COLOR = '#4a3728';
const START_COLOR = '#d4edda';
const EXIT_COLOR  = '#cce5ff';

const CAT_IMAGE = new Image();
CAT_IMAGE.src = 'assets/mix.png';

const MazeEngine = {
  grid: [],
  rows: 0,
  cols: 0,

  // ── 生成迷宮 ──

  generate(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    // 初始化 grid，每格四面均有牆
    this.grid = [];
    for (let r = 0; r < rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < cols; c++) {
        this.grid[r][c] = {
          row: r, col: c,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
          isStart: false,
          isExit: false,
          isDeadEnd: false,
          hasCat: false,
          catInteracted: false
        };
      }
    }

    // Recursive Backtracking
    this._recursiveBacktrack(0, 0);

    // 設定起點 / 出口
    this.grid[0][0].isStart = true;
    this.grid[rows - 1][cols - 1].isExit = true;

    // 標記死路
    this._markDeadEnds();

    // 放置玳瑁貓
    this._placeCats();

    // 同步到 GameState
    GameState.grid = this.grid;
  },

  _recursiveBacktrack(r, c) {
    this.grid[r][c].visited = true;
    const dirs = this._shuffleDirs(['top', 'right', 'bottom', 'left']);

    for (const dir of dirs) {
      const [nr, nc] = this._neighbor(r, c, dir);
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols
          && !this.grid[nr][nc].visited) {
        this._removeWall(r, c, nr, nc, dir);
        this._recursiveBacktrack(nr, nc);
      }
    }
  },

  _neighbor(r, c, dir) {
    if (dir === 'top')    return [r - 1, c];
    if (dir === 'right')  return [r, c + 1];
    if (dir === 'bottom') return [r + 1, c];
    if (dir === 'left')   return [r, c - 1];
  },

  _removeWall(r, c, nr, nc, dir) {
    this.grid[r][c].walls[dir] = false;
    const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
    this.grid[nr][nc].walls[opposite[dir]] = false;
  },

  _shuffleDirs(dirs) {
    const a = [...dirs];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  _markDeadEnds() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.isStart || cell.isExit) continue;
        const open = ['top', 'right', 'bottom', 'left']
          .filter(d => !cell.walls[d]).length;
        if (open === 1) cell.isDeadEnd = true;
      }
    }
  },

  _placeCats() {
    // 收集候選格子：非起點、非出口、非死路
    const candidates = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (!cell.isStart && !cell.isExit && !cell.isDeadEnd) {
          candidates.push(cell);
        }
      }
    }

    // 約 5%，至少 1 隻
    const count = Math.max(1, Math.floor(candidates.length * 0.05));

    // 隨機抽取
    for (let i = candidates.length - 1; i > 0 && count > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    for (let i = 0; i < count && i < candidates.length; i++) {
      candidates[i].hasCat = true;
    }
  },

  // ── 渲染 ──

  render() {
    const canvas = document.getElementById('maze-canvas');
    canvas.width  = this.cols * CELL_SIZE + WALL_WIDTH;
    canvas.height = this.rows * CELL_SIZE + WALL_WIDTH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 填充格子背景
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        if (cell.isStart) {
          ctx.fillStyle = START_COLOR;
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 1, CELL_SIZE - 1);
        } else if (cell.isExit) {
          ctx.fillStyle = EXIT_COLOR;
          ctx.fillRect(x + 1, y + 1, CELL_SIZE - 1, CELL_SIZE - 1);
          ctx.fillStyle = '#1a5276';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('OUT', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }

        // 玳瑁貓
        if (cell.hasCat && !cell.catInteracted) {
          const pad = 4;
          ctx.drawImage(CAT_IMAGE, x + pad, y + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2);
        }
      }
    }

    // 繪製牆壁
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth   = WALL_WIDTH;
    ctx.lineCap     = 'square';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        ctx.beginPath();
        if (cell.walls.top) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + CELL_SIZE, y);
        }
        if (cell.walls.right) {
          ctx.moveTo(x + CELL_SIZE, y);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
        if (cell.walls.bottom) {
          ctx.moveTo(x, y + CELL_SIZE);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
        }
        if (cell.walls.left) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + CELL_SIZE);
        }
        ctx.stroke();
      }
    }
  },

  // 只重繪單一格子（貓消失後用）
  rerenderCell(r, c) {
    const canvas = document.getElementById('maze-canvas');
    const ctx = canvas.getContext('2d');
    const cell = this.grid[r][c];
    const x = c * CELL_SIZE;
    const y = r * CELL_SIZE;

    // 清除格子內部
    ctx.clearRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    ctx.fillStyle = '#f5f0e8';
    ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // 重新繪製牆壁（該格的四面）
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth   = WALL_WIDTH;
    ctx.lineCap     = 'square';
    ctx.beginPath();
    if (cell.walls.top)    { ctx.moveTo(x, y); ctx.lineTo(x + CELL_SIZE, y); }
    if (cell.walls.right)  { ctx.moveTo(x + CELL_SIZE, y); ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE); }
    if (cell.walls.bottom) { ctx.moveTo(x, y + CELL_SIZE); ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE); }
    if (cell.walls.left)   { ctx.moveTo(x, y); ctx.lineTo(x, y + CELL_SIZE); }
    ctx.stroke();
  }
};
