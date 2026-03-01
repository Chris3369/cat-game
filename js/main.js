// main.js — 遊戲進入點

document.addEventListener('DOMContentLoaded', () => {
  // 初始化子系統
  DialogSystem.init();
  Player.init();

  // 生成第一關迷宮
  MazeEngine.generate(GameState.mazeRows, GameState.mazeCols);
  MazeEngine.render();
  Player.updatePosition();

  // 啟動 MP 恢復計時器
  GameState.startMpTimer();

  // 鍵盤輸入
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); Player.move('top');    break;
      case 'ArrowDown':  e.preventDefault(); Player.move('bottom'); break;
      case 'ArrowLeft':  e.preventDefault(); Player.move('left');   break;
      case 'ArrowRight': e.preventDefault(); Player.move('right');  break;
      case 'w': case 'W': Player.move('top');    break;
      case 's': case 'S': Player.move('bottom'); break;
      case 'a': case 'A': Player.move('left');   break;
      case 'd': case 'D': Player.move('right');  break;
    }
  });
});
