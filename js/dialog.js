// dialog.js — 對話框系統

const DialogSystem = {
  _overlay: null,
  _catEl:   null,
  _msgEl:   null,
  _btnsEl:  null,

  init() {
    this._overlay = document.getElementById('dialog-overlay');
    this._catEl   = document.getElementById('dialog-cat');
    this._msgEl   = document.getElementById('dialog-message');
    this._btnsEl  = document.getElementById('dialog-buttons');
  },

  _open() {
    GameState.dialogOpen = true;
    this._overlay.classList.remove('hidden');
  },

  _close() {
    GameState.dialogOpen = false;
    this._overlay.classList.add('hidden');
    this._catEl.className = '';
    this._catEl.textContent = '';
    this._msgEl.textContent = '';
    this._btnsEl.innerHTML = '';
  },

  // ── A. 玳瑁貓 ──

  showTortoiseshellCat(cell) {
    this._catEl.innerHTML = '<img src="assets/mix.png" style="width:80px;height:80px;object-fit:contain;">';
    this._catEl.style.background = 'none';
    this._msgEl.textContent = '喵～你好！\n我是玳瑁貓。\n要給我 4 點乾乾嗎？';

    const giveBtn   = this._makeButton('給予 4 乾乾', 'btn-give');
    const refuseBtn = this._makeButton('拒絕', 'btn-refuse');

    giveBtn.onclick = () => {
      if (GameState.mp >= 4) {
        GameState.setMp(GameState.mp - 4);
        this._showCatReaction('💕', '喵～謝謝你！\n（愛心）', 'cat-love');
      } else {
        // 乾乾不足，視為拒絕
        this._msgEl.textContent = '乾乾不足！\n貓咪很不高興…';
        this._doRefuse(cell);
        return;
      }
      cell.catInteracted = true;
      MazeEngine.rerenderCell(cell.row, cell.col);
      setTimeout(() => this._close(), 900);
    };

    refuseBtn.onclick = () => {
      this._doRefuse(cell);
    };

    this._btnsEl.innerHTML = '';
    this._btnsEl.appendChild(giveBtn);
    this._btnsEl.appendChild(refuseBtn);
    this._open();
  },

  _doRefuse(cell) {
    this._showCatReaction('😾', '貓咪生氣了！\nHP -1', 'cat-angry');
    cell.catInteracted = true;
    MazeEngine.rerenderCell(cell.row, cell.col);
    GameState.setHp(GameState.hp - 1);
    setTimeout(() => {
      if (GameState.dialogOpen) this._close();
    }, 900);
  },

  _showCatReaction(emoji, msg, cssClass) {
    this._catEl.textContent = emoji;
    this._catEl.className = cssClass;
    this._msgEl.textContent = msg;
    this._btnsEl.innerHTML = '';
  },

  // ── B. 橘貓（死路）──

  showOrangeCat() {
    this._catEl.textContent = '🐈';
    this._catEl.className = 'cat-love';
    this._msgEl.textContent = '你走進了死路！\n橘貓搶走了你所有的乾乾！\n💕';

    const continueBtn = this._makeButton('繼續', 'btn-continue');
    continueBtn.onclick = () => {
      GameState.setMp(0);
      this._close();
    };

    this._btnsEl.innerHTML = '';
    this._btnsEl.appendChild(continueBtn);
    this._open();
  },

  // ── C. Game Over ──

  showGameOver() {
    GameState.stopMpTimer();

    this._catEl.textContent = '🐱🐱';
    this._catEl.className = '';
    this._msgEl.textContent = '你的 HP 歸零了…\n兩隻貓把你吃掉了！';

    const restartBtn = this._makeButton('重新開始', 'btn-restart');
    restartBtn.onclick = () => {
      this._close();
      GameState.reset();
    };

    this._btnsEl.innerHTML = '';
    this._btnsEl.appendChild(restartBtn);
    this._open();
  },

  // ── D. 過關提示 ──

  showLevelClear(level) {
    this._catEl.textContent = '🎉';
    this._catEl.className = '';
    this._msgEl.textContent = `關卡 ${level} 完成！\n進入下一關！`;

    const nextBtn = this._makeButton('前進', 'btn-continue');
    nextBtn.onclick = () => {
      this._close();
      GameState.advanceLevel();
    };

    this._btnsEl.innerHTML = '';
    this._btnsEl.appendChild(nextBtn);
    this._open();
  },

  _makeButton(label, cssClass) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = cssClass;
    return btn;
  }
};
