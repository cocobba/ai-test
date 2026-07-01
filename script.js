/**
 * 사다리와 미끄럼틀 게임 - 기본 맵 UI
 * 100칸 게임판 생성, 지그재그 숫자 배치, 사다리·미끄럼틀 SVG 표시
 */

// DOM 요소 가져오기
const lobbyElement = document.getElementById("lobby");
const settingsScreenElement = document.getElementById("settings-screen");
const gameScreenElement = document.getElementById("game-screen");
const joinButton = document.getElementById("join-btn");
const settingsForm = document.getElementById("settings-form");
const playerNamesListElement = document.getElementById("player-names-list");
const spinDurationInput = document.getElementById("spin-duration");
const spinDurationValueElement = document.getElementById("spin-duration-value");
const settingsBackButton = document.getElementById("settings-back-btn");
const diceSetupScreenElement = document.getElementById("dice-setup-screen");
const diceSetupForm = document.getElementById("dice-setup-form");
const diceSetupProgressElement = document.getElementById("dice-setup-progress");
const diceSetupPlayerElement = document.getElementById("dice-setup-player");
const diceSetupOptionsElement = document.getElementById("dice-setup-options");
const diceSetupErrorElement = document.getElementById("dice-setup-error");
const diceSetupBackButton = document.getElementById("dice-setup-back-btn");
const diceSetupNextButton = document.getElementById("dice-setup-next-btn");
const customMapEnabledInput = document.getElementById("custom-map-enabled");
const customMapPanel = document.getElementById("custom-map-panel");
const customLaddersList = document.getElementById("custom-ladders-list");
const customArrowsList = document.getElementById("custom-arrows-list");
const customMapErrorElement = document.getElementById("custom-map-error");
const boardWrapper = document.querySelector(".board-wrapper");
const boardStack = document.querySelector(".board-stack");
const boardElement = document.getElementById("board");
const startRowElement = document.getElementById("start-row");
const startCellElement = document.getElementById("start-cell");
const overlayElement = document.getElementById("overlay");
const tokensElement = document.getElementById("tokens");
const rollButton = document.getElementById("roll-btn");
const quitButton = document.getElementById("quit-btn");
const diceSlotElement = document.getElementById("dice-slot");
const diceReelElement = document.getElementById("dice-reel");
const turnInfoElement = document.getElementById("turn-info");
const gameMessageElement = document.getElementById("game-message");
const opponentPickerElement = document.getElementById("opponent-picker");
const opponentPickerButtonsElement = document.getElementById("opponent-picker-buttons");

// 슬롯머신 설정
const SLOT_NUMBERS = [1, 2, 3, 4, 5, 6];
const SLOT_VISIBLE_ROWS = 3;
const SLOT_CENTER_ROW = 1;
const SLOT_SPIN_CYCLES = 5;
// 빠르게 감속하되, 끝에서 거의 멈춘 것처럼 보이지 않게 조정
const SLOT_EASING = "cubic-bezier(0.18, 0.78, 0.36, 1)";

// 게임 설정 (설정 화면에서 변경)
const MAX_PLAYERS = 6;
const DEFAULT_PLAYER_NAMES = Array.from({ length: MAX_PLAYERS }, (_, i) => `플레이어 ${i + 1}`);
const DEFAULT_DICE_TYPES = ["normal", "plus1", "normal", "minus1", "gamble", "shield"];

const DICE_TYPES = {
  normal: { shortLabel: "일반 주사위", effect: "굴린 눈 그대로" },
  plus1: { shortLabel: "+1 주사위", effect: "눈+1" },
  minus1: { shortLabel: "-1 주사위", effect: "상대 눈-1" },
  gamble: { shortLabel: "도박 주사위", effect: "1~3→1, 4~6→6" },
  shield: { shortLabel: "방패 주사위", effect: "항상 사다리·미끄럼틀·공격 무시" },
};

const DICE_TYPE_OPTIONS = [
  { value: "normal", label: "일반 주사위", description: "굴린 눈 그대로 이동" },
  { value: "plus1", label: "+1 주사위", description: "굴린 눈 +1칸 이동" },
  { value: "minus1", label: "-1 주사위", description: "상대 1명의 다음 주사위 -1" },
  { value: "gamble", label: "도박 주사위", description: "1~3 → 1칸, 4~6 → 6칸" },
  { value: "shield", label: "방패 주사위", description: "항상 사다리·미끄럼틀·공격 무시" },
];

// 주사위 선택 화면에서 현재 선택 중인 플레이어 인덱스
let diceSetupIndex = 0;

const DEFAULT_SETTINGS = {
  playerCount: 2,
  playerNames: [...DEFAULT_PLAYER_NAMES],
  playerDiceTypes: [...DEFAULT_DICE_TYPES],
  spinDurationMs: 4800,
  mapSize: 100,
  useCustomMap: false,
};

const gameSettings = {
  ...DEFAULT_SETTINGS,
  customMaps: {},
};

// 커스텀 편집기에 표시 중인 맵 크기
let customEditorMapSize = DEFAULT_SETTINGS.mapSize;

// 말 이동 애니메이션 설정
const TOKEN_STEP_MS = 280;
const TOKEN_STEP_TRANSITION = "left 0.22s ease-out, top 0.22s ease-out";
const TOKEN_JUMP_MS = 550;
const TOKEN_JUMP_TRANSITION = "left 0.55s cubic-bezier(0.4, 0, 0.2, 1), top 0.55s cubic-bezier(0.4, 0, 0.2, 1)";
const ARROW_PATH_MIN_MS = 90;
const ARROW_PATH_MAX_MS = 220;

// 시작 칸 번호
const START_POSITION = 0;

// 맵별 설정 (사다리·미끄럼틀 칸은 서로 겹치지 않음)
const MAP_CONFIGS = {
  30: {
    cols: 5,
    rows: 6,
    ladders: [
      [2, 14],
      [8, 23],
      [11, 28],
    ],
    arrows: [
      [26, 4],
      [21, 7],
      [18, 3],
    ],
    resetCells: [10, 24],
  },
  50: {
    cols: 10,
    rows: 5,
    ladders: [
      [4, 22],
      [11, 35],
      [17, 44],
      [7, 31],
    ],
    arrows: [
      [48, 13],
      [42, 9],
      [38, 6],
      [45, 19],
    ],
    resetCells: [25, 39],
  },
  100: {
    cols: 10,
    rows: 10,
    ladders: [
      [4, 25],
      [13, 46],
      [33, 69],
      [50, 91],
      [8, 38],
    ],
    arrows: [
      [27, 5],
      [40, 18],
      [76, 42],
      [99, 54],
      [62, 31],
    ],
    resetCells: [52, 73],
  },
};

// 현재 맵 상태 (applyMapConfig에서 갱신)
let boardCols = 10;
let boardRows = 10;
let winPosition = 100;
let LADDERS = [];
let ARROWS = [];
let LADDER_MAP = {};
let ARROW_MAP = {};
let RESET_CELLS = new Set();
let CONNECT_BOTTOM = new Set();

// 밝은 배경색 4가지 (칸마다 번갈아 사용)
const CELL_COLORS = ["color-1", "color-2", "color-3", "color-4"];

// 화살표마다 다른 밝은 색상
const ARROW_COLORS = ["#ff8fab", "#ff9f1c", "#06d6a0", "#4895ef", "#b5179e"];

// 말 크기 (플레이어 수에 따라 조절)
const TOKEN_SIZE_SCALE = {
  2: 0.5,
  3: 0.46,
  4: 0.42,
  5: 0.38,
  6: 0.35,
};

// 맵이 작을수록 칸이 커지므로 말도 조금 더 크게
const MAP_TOKEN_BOOST = {
  30: 1.22,
  50: 1.08,
  100: 1,
};

// 플레이어 말 정보 (applySettings에서 갱신)
let PLAYERS = [];

/**
 * 같은 칸에 여러 말이 있을 때 겹치지 않도록 위치를 계산합니다.
 */
function computePlayerOffsets(index, total) {
  if (total <= 1) return { offsetX: 0, offsetY: 0 };

  const radius = total <= 2 ? 0.24 : total <= 4 ? 0.28 : 0.32;
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;

  return {
    offsetX: Math.cos(angle) * radius,
    offsetY: Math.sin(angle) * radius,
  };
}

/**
 * 플레이어 목록을 만듭니다.
 */
function buildPlayers(count, names, diceTypes) {
  return Array.from({ length: count }, (_, index) => {
    const offset = computePlayerOffsets(index, count);

    return {
      id: index + 1,
      name: names[index]?.trim() || `플레이어 ${index + 1}`,
      position: START_POSITION,
      label: String(index + 1),
      offsetX: offset.offsetX,
      offsetY: offset.offsetY,
      diceType: diceTypes[index] || DEFAULT_DICE_TYPES[index % DEFAULT_DICE_TYPES.length],
      rollModifier: 0,
    };
  });
}

PLAYERS = buildPlayers(
  DEFAULT_SETTINGS.playerCount,
  DEFAULT_SETTINGS.playerNames,
  DEFAULT_SETTINGS.playerDiceTypes
);

// 게임 상태
const gameState = {
  hasStarted: false,
  controlsInitialized: false,
  activeMapSize: 100,
  currentPlayerIndex: 0,
  isGameOver: false,
  isRolling: false,
  isMoving: false,
  isPickingOpponent: false,
  lastRoll: null,
  mapConfigKey: "",
};

/**
 * 숫자가 세로로 이어지는 칸 목록을 만듭니다.
 */
function buildConnectBottomSet(cols, total) {
  const set = new Set();
  for (let number = cols + 1; number < total; number += cols) {
    set.add(number);
  }
  return set;
}

/**
 * 선택한 맵 크기 설정을 적용합니다.
 * @param {number} mapSize - 30, 50, 100
 * @param {{ ladders: number[][], arrows: number[][] } | null} customPairs - 커스텀 사다리·미끄럼틀
 */
function applyMapConfig(mapSize, customPairs = null) {
  const config = MAP_CONFIGS[mapSize] || MAP_CONFIGS[100];

  boardCols = config.cols;
  boardRows = config.rows;
  winPosition = boardCols * boardRows;

  if (customPairs) {
    LADDERS = customPairs.ladders.map(([from, to]) => [from, to]);
    ARROWS = customPairs.arrows.map(([from, to]) => [from, to]);
  } else {
    LADDERS = config.ladders.map(([from, to]) => [from, to]);
    ARROWS = config.arrows.map(([from, to]) => [from, to]);
  }

  LADDER_MAP = Object.fromEntries(LADDERS.map(([from, to]) => [from, to]));
  ARROW_MAP = Object.fromEntries(ARROWS.map(([from, to]) => [from, to]));
  RESET_CELLS = new Set(config.resetCells || []);
  CONNECT_BOTTOM = buildConnectBottomSet(boardCols, winPosition);
  gameState.activeMapSize = mapSize;
}

/**
 * 게임판·시작 칸 그리드 레이아웃을 맞춥니다.
 */
function updateBoardLayout() {
  boardWrapper.style.setProperty("--board-cols", boardCols);
  boardWrapper.style.setProperty("--board-rows", boardRows);
  boardElement.style.gridTemplateColumns = `repeat(${boardCols}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${boardRows}, 1fr)`;
  startRowElement.style.gridTemplateColumns = `repeat(${boardCols}, 1fr)`;
  updateCellFontSize();
}

/**
 * 칸 실제 크기에 맞춰 숫자 글자 크기를 조절합니다.
 */
function updateCellFontSize() {
  if (!boardElement.clientWidth) return;

  const cellWidth = boardElement.clientWidth / boardCols;
  const cellHeight = boardElement.clientHeight / boardRows;
  const cellSize = Math.min(cellWidth, cellHeight);
  const mapBoost = MAP_TOKEN_BOOST[gameState.activeMapSize] || 1;

  const fontSize = Math.max(12, Math.min(cellSize * 0.44 * mapBoost, 26));
  const resetLabelSize = Math.max(9, Math.min(cellSize * 0.24 * mapBoost, 15));

  boardWrapper.style.setProperty("--cell-font-size", `${fontSize}px`);
  boardWrapper.style.setProperty("--cell-reset-label-size", `${resetLabelSize}px`);
  startCellElement.style.setProperty("--cell-font-size", `${fontSize}px`);
}

// 초기 맵 설정
applyMapConfig(DEFAULT_SETTINGS.mapSize);

/**
 * 행·열 위치에 해당하는 칸 번호(1~100)를 계산합니다.
 * - 맨 아래 행: 1 → 10
 * - 그 위 행: 20 → 11
 * - 그 위 행: 21 → 30
 * - 행이 올라갈수록 좌→우, 우→좌 방향이 번갈아 바뀝니다.
 *
 * @param {number} row - 위에서부터 0번째 행
 * @param {number} col - 왼쪽에서부터 0번째 열
 */
function getCellNumber(row, col) {
  const rowFromBottom = boardRows - 1 - row;

  if (rowFromBottom % 2 === 0) {
    return rowFromBottom * boardCols + col + 1;
  }

  return (rowFromBottom + 1) * boardCols - col;
}

/**
 * 게임판 칸을 만듭니다.
 */
function createBoard() {
  boardElement.innerHTML = "";
  const totalCells = boardCols * boardRows;
  const bottomRowStart = totalCells - boardCols + 1;

  for (let row = 0; row < boardRows; row += 1) {
    for (let col = 0; col < boardCols; col += 1) {
      const number = getCellNumber(row, col);
      const cell = document.createElement("div");

      cell.className = `cell ${CELL_COLORS[(row + col) % CELL_COLORS.length]}`;
      cell.dataset.number = String(number);

      if (RESET_CELLS.has(number)) {
        cell.classList.add("reset-cell");
        cell.innerHTML = `<span class="cell-num">${number}</span><span class="reset-label">처음으로</span>`;
        cell.setAttribute("aria-label", `${number}번 처음으로 칸`);
      } else {
        cell.textContent = number;
      }

      if (row === 0) cell.classList.add("top-row");
      if (number >= bottomRowStart) cell.classList.add("bottom-row");
      if (CONNECT_BOTTOM.has(number)) cell.classList.add("connect-bottom");

      boardElement.appendChild(cell);
    }
  }
}

/**
 * 특정 번호 칸의 중심 좌표를 게임판 기준으로 구합니다.
 * @param {number} number - 1~100 칸 번호
 * @returns {{ x: number, y: number } | null}
 */
function getCellCenter(number) {
  const rect = getCellRect(number);
  if (!rect) return null;

  return { x: rect.centerX, y: rect.centerY };
}

/**
 * 특정 번호 칸의 위치와 크기를 게임판 기준으로 구합니다.
 * @param {number} number - 0(시작)~100 칸 번호
 */
function getCellRect(number) {
  const cell =
    number === START_POSITION
      ? startCellElement
      : boardElement.querySelector(`[data-number="${number}"]`);
  if (!cell) return null;

  const wrapperRect = boardWrapper.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  return {
    x: cellRect.left - wrapperRect.left,
    y: cellRect.top - wrapperRect.top,
    width: cellRect.width,
    height: cellRect.height,
    centerX: cellRect.left - wrapperRect.left + cellRect.width / 2,
    centerY: cellRect.top - wrapperRect.top + cellRect.height / 2,
  };
}

/**
 * SVG에 선(line) 요소를 추가합니다.
 */
function createLine(x1, y1, x2, y2, className, strokeWidth) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("class", className);
  line.setAttribute("stroke-width", strokeWidth);
  return line;
}

/**
 * 두 칸 사이에 사다리 모양을 그립니다.
 * @param {number} from - 아래(낮은 번호) 칸
 * @param {number} to - 위(높은 번호) 칸
 */
function drawLadder(from, to) {
  const start = getCellCenter(from);
  const end = getCellCenter(to);
  if (!start || !end) return null;

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "ladder");

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);

  // 사다리 폭과 선 두께 (게임판 크기에 비례)
  const boardWidth = boardElement.clientWidth;
  const ladderWidth = boardWidth * 0.045;
  const railWidth = Math.max(2, boardWidth * 0.006);
  const rungWidth = Math.max(1.5, boardWidth * 0.004);

  // 진행 방향에 수직인 단위 벡터 (양쪽 세로 막대 위치 계산용)
  const perpX = (-dy / distance) * (ladderWidth / 2);
  const perpY = (dx / distance) * (ladderWidth / 2);

  // 왼쪽·오른쪽 세로 막대
  group.appendChild(
    createLine(
      start.x - perpX,
      start.y - perpY,
      end.x - perpX,
      end.y - perpY,
      "ladder-rail",
      railWidth
    )
  );
  group.appendChild(
    createLine(
      start.x + perpX,
      start.y + perpY,
      end.x + perpX,
      end.y + perpY,
      "ladder-rail",
      railWidth
    )
  );

  // 가로 발판(가로대) 여러 개
  const rungCount = Math.max(4, Math.floor(distance / (boardWidth * 0.05)));
  for (let i = 1; i < rungCount; i += 1) {
    const t = i / rungCount;
    const rungX = start.x + dx * t;
    const rungY = start.y + dy * t;

    group.appendChild(
      createLine(
        rungX - perpX,
        rungY - perpY,
        rungX + perpX,
        rungY + perpY,
        "ladder-rung",
        rungWidth
      )
    );
  }

  // 숫자를 너무 가리지 않도록 투명도 적용
  group.setAttribute("opacity", "0.72");
  return group;
}

/**
 * 화살표 머리(삼각형) 마커를 SVG에 등록합니다.
 */
function ensureArrowMarkers() {
  let defs = overlayElement.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    overlayElement.appendChild(defs);
  }

  const boardWidth = boardElement.clientWidth;
  const markerSize = Math.max(8, boardWidth * 0.018);

  ARROW_COLORS.forEach((color, index) => {
    const markerId = `arrow-head-${index}`;
    const existing = defs.querySelector(`#${markerId}`);
    if (existing) existing.remove();

    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", markerId);
    marker.setAttribute("viewBox", "0 0 12 12");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "6");
    marker.setAttribute("markerWidth", markerSize);
    marker.setAttribute("markerHeight", markerSize);
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "userSpaceOnUse");

    const head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M 0 1 L 10 6 L 0 11 Z");
    head.setAttribute("fill", color);
    head.setAttribute("stroke", "#ffffff");
    head.setAttribute("stroke-width", "1.8");
    marker.appendChild(head);
    defs.appendChild(marker);
  });
}

/**
 * 칸 번호에 해당하는 행·열 위치를 구합니다.
 */
function getCellGridPosition(number) {
  for (let row = 0; row < boardRows; row += 1) {
    for (let col = 0; col < boardCols; col += 1) {
      if (getCellNumber(row, col) === number) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * 숫자를 가리지 않도록 칸 사이 경계선을 따라 화살표 경로를 만듭니다.
 * @param {number} from - 위(높은 번호) 칸
 * @param {number} to - 아래(낮은 번호) 칸
 */
function buildArrowRoute(from, to) {
  const startGrid = getCellGridPosition(from);
  const endGrid = getCellGridPosition(to);
  if (!startGrid || !endGrid) return null;

  const boardWidth = boardElement.clientWidth;
  const boardHeight = boardElement.clientHeight;
  const cellWidth = boardWidth / boardCols;
  const cellHeight = boardHeight / boardRows;
  const inset = Math.max(2, boardWidth * 0.004);

  const useLeftSide = startGrid.col >= endGrid.col;
  const leftCol = Math.min(startGrid.col, endGrid.col);
  const rightCol = Math.max(startGrid.col, endGrid.col);

  // 세로 통로: 칸과 칸 사이 경계선 위에 배치
  const laneX = useLeftSide
    ? leftCol * cellWidth + inset
    : (rightCol + 1) * cellWidth - inset;

  // 출발·도착 y: 각 칸의 아래·위 경계선
  const startY = (startGrid.row + 1) * cellHeight - inset;
  const endY = endGrid.row * cellHeight + inset;

  const startX = useLeftSide
    ? startGrid.col * cellWidth + inset
    : (startGrid.col + 1) * cellWidth - inset;
  const endX = useLeftSide
    ? endGrid.col * cellWidth + inset
    : (endGrid.col + 1) * cellWidth - inset;

  // 가장자리 → 통로 → 가장자리 → 도착 칸 안쪽(화살표가 가리키는 지점)
  const endTipY = endY + cellHeight * 0.3;
  const startTipY = startY - cellHeight * 0.18;

  return {
    points: [
      { x: startX, y: startTipY },
      { x: startX, y: startY },
      { x: laneX, y: startY },
      { x: laneX, y: endY },
      { x: endX, y: endY },
      { x: endX, y: endTipY },
    ],
    startLabel: { x: startX, y: startTipY - cellHeight * 0.12 },
    endTip: { x: endX, y: endTipY },
    endLabel: { x: endX, y: endTipY + cellHeight * 0.14 },
  };
}

/**
 * 화살표 출발·도착 지점에 번호 뱃지를 만듭니다.
 */
function createArrowBadge(x, y, number, color, type) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", `arrow-badge arrow-badge-${type}`);

  const boardWidth = boardElement.clientWidth;
  const fontSize = Math.max(8, boardWidth * 0.028);
  const label = String(number);
  const boxWidth = fontSize * (label.length > 1 ? 1.55 : 1.25);
  const boxHeight = fontSize * 1.35;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - boxWidth / 2);
  rect.setAttribute("y", y - boxHeight / 2);
  rect.setAttribute("width", boxWidth);
  rect.setAttribute("height", boxHeight);
  rect.setAttribute("rx", boxHeight * 0.3);
  rect.setAttribute("fill", type === "start" ? color : "#ffffff");
  rect.setAttribute("stroke", color);
  rect.setAttribute("stroke-width", Math.max(1.5, boardWidth * 0.003));
  rect.setAttribute("opacity", type === "start" ? "0.92" : "0.95");
  group.appendChild(rect);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + fontSize * 0.35);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("class", "arrow-badge-text");
  text.setAttribute("font-size", fontSize);
  text.setAttribute("font-weight", "800");
  text.setAttribute("fill", type === "start" ? "#ffffff" : color);
  text.textContent = label;
  group.appendChild(text);

  return group;
}

/**
 * 화살표가 가리키는 도착 지점 표시(과녁 모양)를 만듭니다.
 */
function createArrowTarget(x, y, color) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "arrow-target");

  const boardWidth = boardElement.clientWidth;
  const outerR = Math.max(5, boardWidth * 0.014);
  const innerR = outerR * 0.55;
  const stroke = Math.max(1.5, boardWidth * 0.003);

  const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  outer.setAttribute("cx", x);
  outer.setAttribute("cy", y);
  outer.setAttribute("r", outerR);
  outer.setAttribute("fill", "none");
  outer.setAttribute("stroke", color);
  outer.setAttribute("stroke-width", stroke);
  group.appendChild(outer);

  const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  inner.setAttribute("cx", x);
  inner.setAttribute("cy", y);
  inner.setAttribute("r", innerR);
  inner.setAttribute("fill", color);
  inner.setAttribute("opacity", "0.9");
  group.appendChild(inner);

  return group;
}

/**
 * 두 칸 사이에 화살표를 그립니다. (높은 번호 → 낮은 번호)
 * @param {number} from - 위(높은 번호) 칸
 * @param {number} to - 아래(낮은 번호) 칸
 * @param {string} color - 화살표 색상
 * @param {number} colorIndex - 마커 색상 인덱스
 */
function drawArrow(from, to, color, colorIndex) {
  const route = buildArrowRoute(from, to);
  if (!route || route.points.length < 2) return null;

  const { points, startLabel, endTip, endLabel } = route;
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "arrow");

  const boardWidth = boardElement.clientWidth;
  const strokeWidth = Math.max(3, boardWidth * 0.006);

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrowPath.setAttribute("d", pathData);
  arrowPath.setAttribute("class", "arrow-path");
  arrowPath.setAttribute("stroke", color);
  arrowPath.setAttribute("stroke-width", strokeWidth);
  arrowPath.setAttribute("fill", "none");
  arrowPath.setAttribute("opacity", "0.92");
  arrowPath.setAttribute("marker-end", `url(#arrow-head-${colorIndex})`);
  group.appendChild(arrowPath);

  // 출발 지점: 번호 뱃지
  group.appendChild(createArrowBadge(startLabel.x, startLabel.y, from, color, "start"));

  // 도착 지점: 과녁 + 번호 뱃지
  group.appendChild(createArrowTarget(endTip.x, endTip.y, color));
  group.appendChild(createArrowBadge(endLabel.x, endLabel.y, to, color, "end"));

  return group;
}

/**
 * 플레이어 말 DOM 요소를 만듭니다.
 */
function createTokens() {
  tokensElement.innerHTML = "";
  tokensElement.dataset.count = String(PLAYERS.length);

  PLAYERS.forEach((player) => {
    const token = document.createElement("div");
    token.className = `token player-${player.id}`;
    token.dataset.playerId = String(player.id);
    token.innerHTML = `
      <div class="token-person" aria-hidden="true">
        <span class="token-person-head">
          <span class="token-label">${player.label}</span>
        </span>
        <span class="token-person-body"></span>
      </div>
    `;
    token.setAttribute(
      "aria-label",
      player.position === START_POSITION
        ? `${player.name}, 시작 칸`
        : `${player.name}, ${player.position}번 칸`
    );
    tokensElement.appendChild(token);
  });
}

/**
 * 말이 놓일 좌표를 계산합니다.
 */
function getTokenCoords(player, position) {
  const rect = getCellRect(position);
  if (!rect) return null;

  return {
    x: rect.centerX + rect.width * player.offsetX,
    y: rect.centerY + rect.height * player.offsetY,
  };
}

/**
 * 말을 지정한 좌표에 놓습니다. (칸 번호는 바꾸지 않음)
 */
function placeTokenAt(player, x, y, { transition = "" } = {}) {
  const token = tokensElement.querySelector(`[data-player-id="${player.id}"]`);
  if (!token) return;

  const boardWidth = boardElement.clientWidth;
  const sizeScale = TOKEN_SIZE_SCALE[PLAYERS.length] || 0.5;
  const mapBoost = MAP_TOKEN_BOOST[gameState.activeMapSize] || 1;
  const tokenSize = (boardWidth / boardCols) * sizeScale * mapBoost;
  const headSize = tokenSize * 0.48;
  const labelSize = Math.max(11, Math.min(headSize * 0.62, 20));

  token.style.width = `${tokenSize}px`;
  token.style.height = `${tokenSize}px`;
  token.style.setProperty("--token-font-size", `${labelSize}px`);
  token.style.transition = transition;
  token.style.left = `${x}px`;
  token.style.top = `${y}px`;
  token.classList.toggle("active", player.id === getCurrentPlayer().id);
}
/**
 * 말 한 개의 위치와 크기를 갱신합니다.
 */
function placeToken(player, { transition = "" } = {}) {
  const coords = getTokenCoords(player, player.position);
  if (!coords) return;

  placeTokenAt(player, coords.x, coords.y, { transition });
  const token = tokensElement.querySelector(`[data-player-id="${player.id}"]`);
  if (!token) return;

  token.setAttribute(
    "aria-label",
    player.position === START_POSITION
      ? `${player.name}, 시작 칸`
      : `${player.name}, ${player.position}번 칸`
  );
}

/**
 * 각 플레이어 말을 현재 칸 위치에 맞게 배치합니다.
 */
function positionTokens() {
  PLAYERS.forEach((player) => {
    placeToken(player);
  });
}

/**
 * 주사위 이동 경로(한 칸씩)를 만듭니다.
 */
function buildStepPath(from, to) {
  const path = [];
  for (let cell = from + 1; cell <= to; cell += 1) {
    path.push(cell);
  }
  return path;
}

/**
 * 지정한 시간만큼 기다립니다.
 */
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 말을 한 칸씩 순서대로 이동시킵니다.
 */
async function animateStepPath(player, path) {
  if (path.length === 0) return;

  for (const cell of path) {
    player.position = cell;
    placeToken(player, { transition: TOKEN_STEP_TRANSITION });
    await wait(TOKEN_STEP_MS);
  }
}

/**
 * 화살표(미끄럼틀) 경로를 따라 말을 내려보냅니다.
 */
async function animateArrowPath(player, from, to) {
  const route = buildArrowRoute(from, to);
  const token = tokensElement.querySelector(`[data-player-id="${player.id}"]`);
  const endCoords = getTokenCoords(player, to);

  if (!route || !token || !endCoords) {
    await animateSpecialJump(player, to);
    return;
  }

  const pathPoints = [...route.points, endCoords];
  token.classList.add("falling");

  const startCoords = getTokenCoords(player, from);
  if (startCoords) {
    placeTokenAt(player, startCoords.x, startCoords.y, { transition: "" });
  }

  for (let i = 0; i < pathPoints.length; i += 1) {
    const prev = i === 0 ? startCoords : pathPoints[i - 1];
    const curr = pathPoints[i];
    if (!prev) continue;

    const distance = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const duration = Math.max(
      ARROW_PATH_MIN_MS,
      Math.min(ARROW_PATH_MAX_MS, distance * 1.4)
    );

    placeTokenAt(player, curr.x, curr.y, {
      transition: `left ${duration}ms ease-in, top ${duration}ms ease-in`,
    });
    await wait(duration);
  }

  player.position = to;
  token.classList.remove("falling");
  placeToken(player);
}

/**
 * 사다리로 한 번에 이동할 때 애니메이션을 재생합니다.
 */
async function animateSpecialJump(player, target) {
  player.position = target;
  placeToken(player, { transition: TOKEN_JUMP_TRANSITION });
  await wait(TOKEN_JUMP_MS);
  placeToken(player);
}

/**
 * SVG 오버레이에 사다리와 화살표를 모두 그립니다.
 */
function drawOverlay() {
  // SVG 크기를 게임판 전체(0번 칸 포함)와 동일하게 맞춤
  const width = boardWrapper.clientWidth;
  const height = boardWrapper.clientHeight;

  overlayElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
  overlayElement.innerHTML = "";

  // 사다리 먼저 그리기
  LADDERS.forEach(([from, to]) => {
    const ladder = drawLadder(from, to);
    if (ladder) overlayElement.appendChild(ladder);
  });

  // 화살표(미끄럼) 그리기
  ensureArrowMarkers();
  ARROWS.forEach(([from, to], index) => {
    const arrow = drawArrow(from, to, ARROW_COLORS[index % ARROW_COLORS.length], index);
    if (arrow) overlayElement.appendChild(arrow);
  });
}

/**
 * 게임판 위 그림(사다리, 화살표, 말)을 모두 다시 그립니다.
 */
function updateBoardVisuals() {
  updateCellFontSize();
  drawOverlay();
  positionTokens();
}

/**
 * 게임판을 만들고 오버레이와 말을 표시합니다.
 */
function initBoard() {
  applyMapConfig(gameSettings.mapSize);
  updateBoardLayout();
  createBoard();
  createTokens();
  updateBoardVisuals();

  if (!gameState.controlsInitialized) {
    initGameControls();
    gameState.controlsInitialized = true;
  }
}

/**
 * 주사위 종류에 따라 실제 이동 칸 수를 계산합니다.
 */
function resolveDiceByType(rawDice, diceType) {
  switch (diceType) {
    case "plus1":
      return rawDice + 1;
    case "gamble":
      return rawDice <= 3 ? 1 : 6;
    case "normal":
    default:
      return rawDice;
  }
}

/**
 * 플레이어에게 적용된 보정(상대 -1 주사위 등)을 반영한 이동 칸 수를 구합니다.
 */
function getEffectiveDice(rawDice, player) {
  const baseValue = resolveDiceByType(rawDice, player.diceType);
  let modifierApplied = 0;
  let value = baseValue;

  if (player.rollModifier) {
    modifierApplied = player.rollModifier;
    value = Math.max(1, baseValue + player.rollModifier);
    player.rollModifier = 0;
  }

  return { value, baseValue, modifierApplied };
}

/**
 * 주사위 결과 설명 문구를 만듭니다.
 */
function describeDiceRoll(rawDice, diceResult, player) {
  const { value, baseValue, modifierApplied } = diceResult;
  let text = `주사위 ${rawDice}`;

  if (player.diceType === "plus1" && baseValue !== rawDice) {
    text += ` (+1 → ${baseValue}칸)`;
  } else if (player.diceType === "gamble" && baseValue !== rawDice) {
    text += ` (도박 → ${baseValue}칸)`;
  }

  if (modifierApplied) {
    text += ` (상대 눈${modifierApplied} → ${value}칸)`;
  } else if (value !== rawDice && player.diceType !== "plus1" && player.diceType !== "gamble") {
    text += ` → ${value}칸`;
  }

  return text;
}

/**
 * 방패 주사위를 가진 플레이어는 항상 방패 효과가 적용됩니다.
 */
function hasShield(player) {
  return player.diceType === "shield";
}

/**
 * -1 주사위로 상대를 고릅니다.
 */
function pickOpponentForMinus1(attacker) {
  const opponents = PLAYERS.filter((player) => player.id !== attacker.id && !hasShield(player));

  if (opponents.length === 0) return Promise.resolve(null);
  if (opponents.length === 1) return Promise.resolve(opponents[0]);

  return new Promise((resolve) => {
    gameState.isPickingOpponent = true;
    opponentPickerButtonsElement.innerHTML = "";
    opponentPickerElement.classList.remove("is-hidden");
    updateTurnUI();

    opponents.forEach((opponent) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "opponent-pick-btn";
      button.textContent = opponent.name;
      button.addEventListener("click", () => {
        opponentPickerElement.classList.add("is-hidden");
        opponentPickerButtonsElement.innerHTML = "";
        gameState.isPickingOpponent = false;
        resolve(opponent);
      });
      opponentPickerButtonsElement.appendChild(button);
    });
  });
}

/**
 * -1 주사위 효과를 상대에게 적용합니다.
 */
function applyMinus1Debuff(attacker, target) {
  if (!target) {
    const shieldedOnly = PLAYERS.some(
      (player) => player.id !== attacker.id && hasShield(player)
    );
    return shieldedOnly ? " → 방패 상대만 있어 눈-1 적용 불가" : "";
  }

  if (hasShield(target)) {
    return ` → ${target.name}에게 눈-1 시도 (방패로 막힘!)`;
  }

  target.rollModifier -= 1;
  return ` → ${target.name} 다음 주사위 -1!`;
}

/**
 * 시작 칸으로 되돌립니다.
 */
async function sendPlayerToStart(player, fromPosition) {
  player.position = fromPosition;
  placeToken(player);
  await animateSpecialJump(player, START_POSITION);
}

/**
 * 현재 차례인 플레이어를 반환합니다.
 */
function getCurrentPlayer() {
  return PLAYERS[gameState.currentPlayerIndex];
}

/**
 * 1~6 사이 주사위 눈을 무작위로 뽑습니다.
 */
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * 주사위 눈만큼 앞으로 이동한 칸 번호를 계산합니다.
 * 100을 넘으면 이동하지 않습니다.
 */
function calculateMovePosition(currentPosition, dice) {
  const nextPosition = currentPosition + dice;
  if (nextPosition > winPosition) return currentPosition;
  return nextPosition;
}

/**
 * 도착 칸에 사다리나 화살표가 있으면 이동합니다.
 */
function applySpecialTile(position) {
  if (ARROW_MAP[position]) {
    return {
      position: ARROW_MAP[position],
      type: "arrow",
      from: position,
    };
  }

  if (LADDER_MAP[position]) {
    return {
      position: LADDER_MAP[position],
      type: "ladder",
      from: position,
    };
  }

  return { position, type: null, from: position };
}

/**
 * 화면에 현재 차례와 버튼 상태를 갱신합니다.
 */
function updateTurnUI() {
  const player = getCurrentPlayer();
  const diceInfo = DICE_TYPES[player.diceType];

  if (gameState.isGameOver) {
    turnInfoElement.textContent = "게임 종료";
  } else if (gameState.isPickingOpponent) {
    turnInfoElement.textContent = `${player.name}: 상대를 선택하세요`;
  } else {
    turnInfoElement.textContent = diceInfo
      ? `${player.name}의 차례 (${diceInfo.shortLabel})`
      : `${player.name}의 차례입니다`;
  }

  rollButton.disabled =
    gameState.isGameOver ||
    gameState.isRolling ||
    gameState.isMoving ||
    gameState.isPickingOpponent;

  if (quitButton) {
    quitButton.disabled = gameState.isRolling || gameState.isMoving || gameState.isPickingOpponent;
  }
}

/**
 * 슬롯 한 칸의 높이(px)를 가져옵니다.
 */
function getSlotItemHeight() {
  const item = diceReelElement.querySelector(".slot-item");
  if (item) return item.getBoundingClientRect().height;

  const windowHeight = diceSlotElement.querySelector(".slot-window").clientHeight;
  return windowHeight / SLOT_VISIBLE_ROWS;
}

/**
 * 슬롯 릴에 표시할 숫자 목록을 만듭니다. (1→2→3→4→5→6 순서 반복)
 * @param {number} target - 멈출 숫자 (1~6)
 * @param {number} stopIndex - 당첨 숫자가 올 릴 인덱스
 */
function buildSlotStrip(target, stopIndex) {
  const centerIndex = stopIndex + SLOT_CENTER_ROW;
  const totalLength = stopIndex + SLOT_VISIBLE_ROWS;
  // 중앙 칸에 target이 오도록 1~6 순서의 시작 위치를 맞춥니다.
  const startIndex = (((target - 1 - centerIndex) % 6) + 6) % 6;
  const strip = [];

  for (let i = 0; i < totalLength; i += 1) {
    strip.push(SLOT_NUMBERS[(startIndex + i) % 6]);
  }

  return strip;
}

/**
 * 릴 DOM을 숫자 목록으로 채웁니다.
 */
function renderSlotReel(strip) {
  diceReelElement.innerHTML = "";
  strip.forEach((number) => {
    const item = document.createElement("div");
    item.className = "slot-item";
    item.textContent = String(number);
    diceReelElement.appendChild(item);
  });
}

/**
 * 슬롯머신 릴을 돌려 당첨 숫자에서 멈춥니다.
 * @param {number} target - 당첨 숫자 (1~6)
 */
function spinSlotReel(target) {
  return new Promise((resolve) => {
    const stopIndex = SLOT_SPIN_CYCLES * SLOT_NUMBERS.length + Math.floor(Math.random() * 6);
    const strip = buildSlotStrip(target, stopIndex);

    renderSlotReel(strip);
    diceSlotElement.classList.add("is-spinning");

    const itemHeight = getSlotItemHeight();
    const endY = -stopIndex * itemHeight;

    // 멈춰 보이지 않도록 즉시 움직임 시작 (이전 결과 위치에서 바로 회전)
    diceReelElement.style.transition = "none";
    diceReelElement.style.transform = "translateY(0)";
    diceReelElement.getBoundingClientRect();

    requestAnimationFrame(() => {
        diceReelElement.style.transition = `transform ${gameSettings.spinDurationMs}ms ${SLOT_EASING}`;
      diceReelElement.style.transform = `translateY(${endY}px)`;
    });

    const onEnd = (event) => {
      if (event.propertyName !== "transform") return;
      diceReelElement.removeEventListener("transitionend", onEnd);
      diceSlotElement.classList.remove("is-spinning");
      diceSlotElement.setAttribute("aria-label", `주사위 결과 ${target}`);
      resolve();
    };

    diceReelElement.addEventListener("transitionend", onEnd);
  });
}

/**
 * 주사위 결과에 따라 플레이어를 한 칸씩 이동시킵니다.
 */
async function applyDiceMove(rawDice) {
  const player = getCurrentPlayer();
  const diceResult = getEffectiveDice(rawDice, player);
  const effectiveDice = diceResult.value;

  gameState.lastRoll = rawDice;
  gameState.isMoving = true;
  updateTurnUI();

  const fromPosition = player.position;
  const movedPosition = calculateMovePosition(fromPosition, effectiveDice);
  const diceDescription = describeDiceRoll(rawDice, diceResult, player);

  if (movedPosition === fromPosition && fromPosition + effectiveDice > winPosition) {
    let message = `${player.name}: ${diceDescription} → ${winPosition}을 넘어 이동하지 않습니다.`;
    if (player.diceType === "minus1") {
      const target = await pickOpponentForMinus1(player);
      message += applyMinus1Debuff(player, target);
    }
    gameMessageElement.textContent = message;
    await finishTurnAfterMove();
    return;
  }

  const stepPath = buildStepPath(fromPosition, movedPosition);
  gameMessageElement.textContent = `${player.name}: ${diceDescription} → 이동 중...`;

  await animateStepPath(player, stepPath);

  let message = `${player.name}: ${diceDescription} → ${movedPosition}번 칸`;

  if (RESET_CELLS.has(movedPosition)) {
    message += " → 처음으로! 시작 칸으로";
    gameMessageElement.textContent = message;
    await sendPlayerToStart(player, movedPosition);
  } else {
    const special = hasShield(player)
      ? { position: movedPosition, type: null, from: movedPosition }
      : applySpecialTile(movedPosition);

    if (special.type === "ladder") {
      message += ` → 사다리! ${special.from}번 → ${special.position}번`;
      gameMessageElement.textContent = message;
      await animateSpecialJump(player, special.position);
    } else if (special.type === "arrow") {
      message += ` → 화살표! ${special.from}번 → ${special.position}번`;
      gameMessageElement.textContent = message;
      await animateArrowPath(player, special.from, special.position);
    } else if (hasShield(player)) {
      message += " (방패: 특수 칸 무시)";
    }
  }

  if (player.diceType === "minus1") {
    const target = await pickOpponentForMinus1(player);
    message += applyMinus1Debuff(player, target);
  }

  gameMessageElement.textContent = message;
  placeToken(player);

  if (player.position === winPosition) {
    gameState.isGameOver = true;
    gameState.isMoving = false;
    turnInfoElement.textContent = `🎉 ${player.name} 승리!`;
    gameMessageElement.textContent = `${player.name}이(가) ${winPosition}번에 도착했습니다!`;
    rollButton.disabled = true;
    return;
  }

  await finishTurnAfterMove();
}

async function finishTurnAfterMove() {
  gameState.isMoving = false;
  switchTurn();
  updateTurnUI();
}

/**
 * 주사위를 굴려 슬롯 애니메이션 후 플레이어를 이동시킵니다.
 */
async function handleRoll() {
  if (gameState.isGameOver || gameState.isRolling) return;

  const dice = rollDice();
  gameState.isRolling = true;
  updateTurnUI();
  gameMessageElement.textContent = "주사위가 굴러가는 중...";

  await spinSlotReel(dice);

  gameState.isRolling = false;
  await applyDiceMove(dice);
}

/**
 * 다음 플레이어 차례로 넘깁니다.
 */
function switchTurn() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % PLAYERS.length;
  updateTurnUI();
  positionTokens();
}

/**
 * 게임 상태를 초기화합니다.
 */
function resetGameState() {
  PLAYERS.forEach((player) => {
    player.position = START_POSITION;
    player.rollModifier = 0;
  });

  gameState.currentPlayerIndex = 0;
  gameState.isGameOver = false;
  gameState.isRolling = false;
  gameState.isMoving = false;
  gameState.isPickingOpponent = false;
  gameState.lastRoll = null;

  if (opponentPickerElement) {
    opponentPickerElement.classList.add("is-hidden");
  }
  if (opponentPickerButtonsElement) {
    opponentPickerButtonsElement.innerHTML = "";
  }

  gameMessageElement.textContent = "";
  turnInfoElement.textContent = `${PLAYERS[0].name}의 차례입니다`;
  renderSlotReel(buildSlotStrip(1, 0));

  if (gameState.hasStarted) {
    positionTokens();
    updateTurnUI();
  }
}

/**
 * 게임을 종료하고 로비로 돌아갑니다.
 */
function quitGame() {
  if (gameState.isRolling || gameState.isMoving || gameState.isPickingOpponent) return;

  resetGameState();
  gameScreenElement.classList.add("is-hidden");
  diceSetupScreenElement.classList.add("is-hidden");
  settingsScreenElement.classList.add("is-hidden");
  lobbyElement.classList.remove("is-hidden");
}

/**
 * 주사위 버튼에 이벤트를 연결합니다.
 */
function initGameControls() {
  // 시작 화면: 6→1→2 순서로 중앙에 1 표시
  renderSlotReel(buildSlotStrip(1, 0));
  diceSlotElement.setAttribute("aria-label", "주사위 슬롯");
  rollButton.addEventListener("click", handleRoll);
  quitButton.addEventListener("click", quitGame);
  updateTurnUI();
}

/**
 * 설정 화면에서 선택된 맵 크기를 가져옵니다.
 */
function getSelectedMapSize() {
  const mapSizeInput = settingsForm.querySelector('input[name="map-size"]:checked');
  return Number(mapSizeInput ? mapSizeInput.value : DEFAULT_SETTINGS.mapSize);
}

/**
 * 맵 크기별 커스텀 사다리·미끄럼틀 데이터를 가져옵니다.
 */
function getCustomMapForSize(mapSize) {
  if (!gameSettings.customMaps[mapSize]) {
    const config = MAP_CONFIGS[mapSize];
    gameSettings.customMaps[mapSize] = {
      ladders: config.ladders.map(([from, to]) => [from, to]),
      arrows: config.arrows.map(([from, to]) => [from, to]),
    };
  }
  return gameSettings.customMaps[mapSize];
}

/**
 * 커스텀 입력 한 줄을 만듭니다.
 */
function createCustomPairRow(type, index, from, to, maxCell) {
  const row = document.createElement("div");
  row.className = "custom-pair-row";
  row.dataset.type = type;
  row.dataset.index = String(index);

  const label = document.createElement("span");
  label.className = "custom-pair-label";
  label.textContent = type === "ladder" ? `사다리 ${index + 1}` : `미끄럼틀 ${index + 1}`;

  const fromInput = document.createElement("input");
  fromInput.type = "number";
  fromInput.className = "settings-input custom-cell-input";
  fromInput.min = "1";
  fromInput.max = String(maxCell);
  fromInput.value = String(from);
  fromInput.dataset.end = "from";
  fromInput.required = true;

  const arrow = document.createElement("span");
  arrow.textContent = "→";

  const toInput = document.createElement("input");
  toInput.type = "number";
  toInput.className = "settings-input custom-cell-input";
  toInput.min = "1";
  toInput.max = String(maxCell);
  toInput.value = String(to);
  toInput.dataset.end = "to";
  toInput.required = true;

  row.append(label, fromInput, arrow, toInput);
  return row;
}

/**
 * 커스텀 사다리·미끄럼틀 입력 UI를 그립니다.
 */
function renderCustomMapEditor(mapSize = getSelectedMapSize()) {
  customEditorMapSize = mapSize;
  const custom = getCustomMapForSize(mapSize);

  customLaddersList.innerHTML = "";
  const ladderTitle = document.createElement("span");
  ladderTitle.className = "custom-section-title";
  ladderTitle.textContent = "사다리";
  customLaddersList.appendChild(ladderTitle);

  custom.ladders.forEach(([from, to], index) => {
    customLaddersList.appendChild(createCustomPairRow("ladder", index, from, to, mapSize));
  });

  customArrowsList.innerHTML = "";
  const arrowTitle = document.createElement("span");
  arrowTitle.className = "custom-section-title";
  arrowTitle.textContent = "미끄럼틀";
  customArrowsList.appendChild(arrowTitle);

  custom.arrows.forEach(([from, to], index) => {
    customArrowsList.appendChild(createCustomPairRow("arrow", index, from, to, mapSize));
  });
}

/**
 * 커스텀 입력값을 gameSettings에 저장합니다.
 */
function readCustomMapFromForm(mapSize = customEditorMapSize) {
  const custom = getCustomMapForSize(mapSize);

  custom.ladders = Array.from(customLaddersList.querySelectorAll('[data-type="ladder"]')).map(
    (row) => [
      Number(row.querySelector('[data-end="from"]').value),
      Number(row.querySelector('[data-end="to"]').value),
    ]
  );

  custom.arrows = Array.from(customArrowsList.querySelectorAll('[data-type="arrow"]')).map(
    (row) => [
      Number(row.querySelector('[data-end="from"]').value),
      Number(row.querySelector('[data-end="to"]').value),
    ]
  );
}

/**
 * 커스텀 사다리·미끄럼틀 설정이 올바른지 검사합니다.
 */
function validateCustomMap(mapSize, custom) {
  const errors = [];
  const usedCells = new Set();

  custom.ladders.forEach(([from, to], index) => {
    const label = `사다리 ${index + 1}`;

    if (!Number.isFinite(from) || !Number.isFinite(to) || from < 1 || to < 1 || from > mapSize || to > mapSize) {
      errors.push(`${label}: 칸 번호는 1~${mapSize} 사이여야 합니다.`);
      return;
    }
    if (from >= to) {
      errors.push(`${label}: 시작 칸(${from})이 도착 칸(${to})보다 작아야 합니다.`);
    }
    if (usedCells.has(from) || usedCells.has(to)) {
      errors.push(`${label}: 이미 사용된 칸 번호가 있습니다.`);
    }
    usedCells.add(from);
    usedCells.add(to);
  });

  custom.arrows.forEach(([from, to], index) => {
    const label = `미끄럼틀 ${index + 1}`;

    if (!Number.isFinite(from) || !Number.isFinite(to) || from < 1 || to < 1 || from > mapSize || to > mapSize) {
      errors.push(`${label}: 칸 번호는 1~${mapSize} 사이여야 합니다.`);
      return;
    }
    if (from <= to) {
      errors.push(`${label}: 시작 칸(${from})이 도착 칸(${to})보다 커야 합니다.`);
    }
    if (usedCells.has(from) || usedCells.has(to)) {
      errors.push(`${label}: 이미 사용된 칸 번호가 있습니다.`);
    }
    usedCells.add(from);
    usedCells.add(to);
  });

  return errors;
}

function showCustomMapError(message) {
  customMapErrorElement.textContent = message;
  customMapErrorElement.classList.remove("is-hidden");
}

function hideCustomMapError() {
  customMapErrorElement.textContent = "";
  customMapErrorElement.classList.add("is-hidden");
}

/**
 * 맵 구성(기본/커스텀)을 비교하기 위한 키를 만듭니다.
 */
function buildMapConfigKey(mapSize, customPairs) {
  if (!customPairs) return `${mapSize}-default`;
  return `${mapSize}-${JSON.stringify(customPairs)}`;
}

function toggleCustomMapPanel() {
  const enabled = customMapEnabledInput.checked;
  gameSettings.useCustomMap = enabled;
  customMapPanel.classList.toggle("is-hidden", !enabled);

  if (enabled) {
    hideCustomMapError();
    renderCustomMapEditor();
  }
}

function onMapSizeChange() {
  if (customMapEnabledInput.checked) {
    readCustomMapFromForm(customEditorMapSize);
    hideCustomMapError();
    renderCustomMapEditor(getSelectedMapSize());
  }
}

/**
 * 설정 화면에서 선택된 플레이어 수를 가져옵니다.
 */
function getSelectedPlayerCount() {
  const countInput = settingsForm.querySelector('input[name="player-count"]:checked');
  return Number(countInput ? countInput.value : DEFAULT_SETTINGS.playerCount);
}

/**
 * 플레이어 이름 입력칸을 그립니다.
 */
function renderPlayerNameFields(count = getSelectedPlayerCount()) {
  playerNamesListElement.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const field = document.createElement("label");
    field.className = "settings-field";

    const title = document.createElement("span");
    title.className = "settings-label";
    title.textContent = `플레이어 ${index + 1} 이름`;

    const input = document.createElement("input");
    input.className = "settings-input player-name-input";
    input.type = "text";
    input.maxLength = 12;
    input.dataset.playerIndex = String(index);
    input.value = gameSettings.playerNames[index] || `플레이어 ${index + 1}`;

    field.append(title, input);
    playerNamesListElement.appendChild(field);
  }
}

/**
 * 플레이어 이름 입력값을 읽습니다.
 */
function readPlayerNamesFromForm() {
  const names = [...gameSettings.playerNames];

  playerNamesListElement.querySelectorAll(".player-name-input").forEach((input) => {
    const index = Number(input.dataset.playerIndex);
    names[index] = input.value.trim() || `플레이어 ${index + 1}`;
  });

  return names;
}

function onPlayerCountChange() {
  gameSettings.playerNames = readPlayerNamesFromForm();
  renderPlayerNameFields(getSelectedPlayerCount());
}

/**
 * 설정 화면의 굴리는 시간 표시를 갱신합니다.
 */
function updateSpinDurationLabel() {
  spinDurationValueElement.textContent = `${spinDurationInput.value}초`;
}

/**
 * 설정 폼 내용을 gameSettings에 저장합니다.
 */
function readSettingsForm() {
  gameSettings.playerCount = getSelectedPlayerCount();
  gameSettings.playerNames = readPlayerNamesFromForm();
  gameSettings.spinDurationMs = Math.round(Number(spinDurationInput.value) * 1000);

  const mapSizeInput = settingsForm.querySelector('input[name="map-size"]:checked');
  gameSettings.mapSize = Number(mapSizeInput ? mapSizeInput.value : DEFAULT_SETTINGS.mapSize);
  gameSettings.useCustomMap = customMapEnabledInput.checked;

  if (gameSettings.useCustomMap) {
    readCustomMapFromForm();
  }
}

/**
 * gameSettings를 플레이어 정보에 반영합니다.
 */
function applySettings() {
  PLAYERS = buildPlayers(
    gameSettings.playerCount,
    gameSettings.playerNames.slice(0, gameSettings.playerCount),
    gameSettings.playerDiceTypes.slice(0, gameSettings.playerCount)
  );

  if (gameState.hasStarted) {
    createTokens();
    positionTokens();
    updateTurnUI();
  }
}

/**
 * 설정 화면에 현재 설정값을 채웁니다.
 */
function fillSettingsForm() {
  const playerCountInput = settingsForm.querySelector(
    `input[name="player-count"][value="${gameSettings.playerCount}"]`
  );
  if (playerCountInput) playerCountInput.checked = true;

  renderPlayerNameFields(gameSettings.playerCount);
  spinDurationInput.value = gameSettings.spinDurationMs / 1000;
  updateSpinDurationLabel();

  const mapSizeInput = settingsForm.querySelector(
    `input[name="map-size"][value="${gameSettings.mapSize}"]`
  );
  if (mapSizeInput) mapSizeInput.checked = true;

  customMapEnabledInput.checked = gameSettings.useCustomMap;
  customMapPanel.classList.toggle("is-hidden", !gameSettings.useCustomMap);
  hideCustomMapError();

  if (gameSettings.useCustomMap) {
    renderCustomMapEditor(gameSettings.mapSize);
  }
}

/**
 * 로비에서 설정 화면을 엽니다.
 */
function openSettings() {
  fillSettingsForm();
  lobbyElement.classList.add("is-hidden");
  gameScreenElement.classList.add("is-hidden");
  diceSetupScreenElement.classList.add("is-hidden");
  settingsScreenElement.classList.remove("is-hidden");
}

/**
 * 설정 화면에서 로비로 돌아갑니다.
 */
function backToLobby() {
  settingsScreenElement.classList.add("is-hidden");
  diceSetupScreenElement.classList.add("is-hidden");
  lobbyElement.classList.remove("is-hidden");
}

/**
 * 설정 화면의 커스텀 맵이 유효한지 검사합니다.
 */
function validateSettingsCustomMap() {
  if (!gameSettings.useCustomMap) return true;

  const custom = gameSettings.customMaps[gameSettings.mapSize];
  const errors = validateCustomMap(gameSettings.mapSize, custom);

  if (errors.length > 0) {
    showCustomMapError(errors.join(" "));
    customMapPanel.classList.remove("is-hidden");
    customMapEnabledInput.checked = true;
    return false;
  }

  hideCustomMapError();
  return true;
}

function hideDiceSetupError() {
  diceSetupErrorElement.textContent = "";
  diceSetupErrorElement.classList.add("is-hidden");
}

function showDiceSetupError(message) {
  diceSetupErrorElement.textContent = message;
  diceSetupErrorElement.classList.remove("is-hidden");
}

/**
 * 현재 플레이어용 주사위 선택 화면을 그립니다.
 */
function renderDiceSetupScreen() {
  const playerName = gameSettings.playerNames[diceSetupIndex] || `플레이어 ${diceSetupIndex + 1}`;
  const savedDice = gameSettings.playerDiceTypes[diceSetupIndex];

  diceSetupProgressElement.textContent = `${diceSetupIndex + 1} / ${gameSettings.playerCount}`;
  diceSetupPlayerElement.textContent = `${playerName}님, 주사위를 선택하세요`;
  diceSetupNextButton.textContent =
    diceSetupIndex >= gameSettings.playerCount - 1 ? "게임 시작" : "다음 플레이어";

  diceSetupOptionsElement.innerHTML = "";

  DICE_TYPE_OPTIONS.forEach((option) => {
    const label = document.createElement("label");
    label.className = "dice-setup-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "dice-type";
    input.value = option.value;
    input.className = "dice-setup-option-input";
    if (savedDice === option.value) input.checked = true;

    const body = document.createElement("span");
    body.className = "dice-setup-option-body";

    const title = document.createElement("span");
    title.className = "dice-setup-option-title";
    title.textContent = option.label;

    const desc = document.createElement("span");
    desc.className = "dice-setup-option-desc";
    desc.textContent = option.description;

    body.append(title, desc);
    label.append(input, body);
    diceSetupOptionsElement.appendChild(label);
  });

  hideDiceSetupError();
}

/**
 * 설정 완료 후 주사위 선택 화면을 엽니다.
 */
function openDiceSetup() {
  diceSetupIndex = 0;
  gameSettings.playerDiceTypes = Array.from({ length: MAX_PLAYERS }, () => "");

  settingsScreenElement.classList.add("is-hidden");
  gameScreenElement.classList.add("is-hidden");
  diceSetupScreenElement.classList.remove("is-hidden");
  renderDiceSetupScreen();
}

/**
 * 설정 화면에서 주사위 선택으로 넘어갑니다.
 */
function proceedFromSettings() {
  readSettingsForm();

  if (!validateSettingsCustomMap()) return;

  openDiceSetup();
}

/**
 * 주사위 선택을 확정하고 다음 플레이어 또는 게임을 시작합니다.
 */
function confirmDiceSetup() {
  const selected = diceSetupForm.querySelector('input[name="dice-type"]:checked');

  if (!selected) {
    showDiceSetupError("주사위를 하나 선택해 주세요.");
    return;
  }

  gameSettings.playerDiceTypes[diceSetupIndex] = selected.value;
  hideDiceSetupError();

  if (diceSetupIndex >= gameSettings.playerCount - 1) {
    diceSetupScreenElement.classList.add("is-hidden");
    startGame();
    return;
  }

  diceSetupIndex += 1;
  renderDiceSetupScreen();
}

function backFromDiceSetup() {
  hideDiceSetupError();

  if (diceSetupIndex > 0) {
    diceSetupIndex -= 1;
    renderDiceSetupScreen();
    return;
  }

  diceSetupScreenElement.classList.add("is-hidden");
  settingsScreenElement.classList.remove("is-hidden");
}

/**
 * 설정을 적용하고 게임을 시작합니다.
 */
function startGame() {
  let customPairs = null;

  if (gameSettings.useCustomMap) {
    const custom = gameSettings.customMaps[gameSettings.mapSize];
    customPairs = {
      ladders: custom.ladders.map(([from, to]) => [from, to]),
      arrows: custom.arrows.map(([from, to]) => [from, to]),
    };
  }

  const mapChanged =
    gameState.hasStarted && gameState.mapConfigKey !== buildMapConfigKey(gameSettings.mapSize, customPairs);

  applyMapConfig(gameSettings.mapSize, customPairs);
  gameState.mapConfigKey = buildMapConfigKey(gameSettings.mapSize, customPairs);
  applySettings();
  resetGameState();

  settingsScreenElement.classList.add("is-hidden");
  diceSetupScreenElement.classList.add("is-hidden");
  gameScreenElement.classList.remove("is-hidden");

  if (!gameState.hasStarted || mapChanged) {
    initBoard();
    gameState.hasStarted = true;
  } else {
    updateBoardLayout();
    updateBoardVisuals();
  }
}

/**
 * 로비·설정 버튼에 이벤트를 연결합니다.
 */
function initLobby() {
  joinButton.addEventListener("click", openSettings);
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    proceedFromSettings();
  });
  settingsBackButton.addEventListener("click", backToLobby);
  diceSetupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmDiceSetup();
  });
  diceSetupBackButton.addEventListener("click", backFromDiceSetup);
  spinDurationInput.addEventListener("input", updateSpinDurationLabel);
  customMapEnabledInput.addEventListener("change", toggleCustomMapPanel);

  settingsForm.querySelectorAll('input[name="player-count"]').forEach((radio) => {
    radio.addEventListener("change", onPlayerCountChange);
  });

  settingsForm.querySelectorAll('input[name="map-size"]').forEach((radio) => {
    radio.addEventListener("change", onMapSizeChange);
  });
}

// 페이지 로드 시 로비 표시
renderPlayerNameFields(DEFAULT_SETTINGS.playerCount);
initLobby();

// 게임 시작 후 창 크기가 바뀌면 다시 그립니다.
window.addEventListener("resize", () => {
  if (gameState.hasStarted) updateBoardVisuals();
});

if ("ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(() => {
    if (gameState.hasStarted) updateBoardVisuals();
  });
  resizeObserver.observe(boardStack);
}
