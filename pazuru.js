const container = document.getElementById('puzzle-container');
const shuffleBtn = document.getElementById('shuffle-btn');
const solveBtn = document.getElementById('solve-btn');
const resetBtn = document.getElementById('reset-btn');
const timeDisplay = document.getElementById('time');
const moveCountDisplay = document.getElementById('moves');
const levelSelect = document.getElementById('level');
const themeToggle = document.getElementById('theme-toggle');
let size = 5;
let tiles = [];
let timerInterval, startTime, moveCount = 0;
let draggedTile = null; // ドラッグ中のタイル

// タイル初期化
function initTiles() {
    size = parseInt(levelSelect.value);
    tiles = Array.from({ length: size * size }, (_, i) => i + 1);
    tiles[size * size - 1] = 0;
    moveCount = 0;
    updateDisplays();
    renderTiles();
    resetTimer();
}

// タイル描画
function renderTiles() {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile';
        div.draggable = tile !== 0;
        div.dataset.index = index;
        if (tile) div.style.backgroundImage = `url('b.png')`;
        div.style.backgroundPosition = `${-((tile - 1) % size) * 100}px ${-Math.floor((tile - 1) / size) * 100}px`;

        // ドラッグイベントの追加
        div.addEventListener('dragstart', handleDragStart);
        div.addEventListener('dragend', handleDragEnd);
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', (e) => handleDrop(e, index));

        // クリックでもタイルを交換
        div.addEventListener('click', () => swapTiles(index));

        container.appendChild(div);
    });
}

// ドラッグ開始
function handleDragStart(e) {
    draggedTile = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.style.opacity = 1; // ドラッグ中のタイルの透明度を変更
}

// ドラッグ終了
function handleDragEnd(e) {
    draggedTile.style.opacity = 1; // タイルの透明度を元に戻す
    draggedTile = null;
}

// タイルの上でドラッグ
function handleDragOver(e) {
    e.preventDefault(); // ドロップを可能にする
}

// ドロップ処理
function handleDrop(e, targetIndex) {
    e.preventDefault();
    if (draggedTile) {
        const draggedIndex = draggedTile.dataset.index;
        swapTiles(draggedIndex, targetIndex);
    }
}

// タイル交換
function swapTiles(index1, index2) {
    index1 = parseInt(index1);
    index2 = parseInt(index2);
    if (isAdjacent(index1, index2)) {
        [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
        moveCount++;
        updateDisplays();
        renderTiles();
        checkWin();
    }
}

// 隣接確認
function isAdjacent(index1, index2) {
    const [row1, col1] = [Math.floor(index1 / size), index1 % size];
    const [row2, col2] = [Math.floor(index2 / size), index2 % size];
    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// 勝利判定
function checkWin() {
    if (tiles.join('') === [...Array(size * size - 1)].map((_, i) => i + 1).concat(0).join('')) {
        clearInterval(timerInterval);
        alert(`おめでとう！所要時間: ${Math.floor((Date.now() - startTime) / 1000)}秒, 動き: ${moveCount}回`);
    }
}

// タイマー更新
function resetTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    timeDisplay.textContent = '0';
    timerInterval = setInterval(() => timeDisplay.textContent = Math.floor((Date.now() - startTime) / 1000), 1000);
}

// 更新表示
function updateDisplays() {
    moveCountDisplay.textContent = moveCount;
}

// シャッフル
function shuffleTiles() {
    tiles.sort(() => Math.random() - 0.5);
    renderTiles();
    resetTimer();
}

// 解決ボタン
function solvePuzzle() { alert("解決手順未実装"); }

// リセットボタン
function resetPuzzle() { initTiles(); }

// テーマ切替
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
shuffleBtn.addEventListener('click', shuffleTiles);
solveBtn.addEventListener('click', solvePuzzle);
resetBtn.addEventListener('click', resetPuzzle);
levelSelect.addEventListener('change', initTiles);

// 初期化
initTiles();
