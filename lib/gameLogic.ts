import { BOARD_WIDTH, BOARD_HEIGHT, COLORS, MIN_GROUP, SCORE_BASE, CHAIN_BONUS, SPAWN_X } from './constants';
import type { Board, Cell, Color, Position, PuyoPair, ColoredPosition } from './types';

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<Cell>(BOARD_WIDTH).fill(null));
}

export function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)] as Color;
}

export function randomPair(): [Color, Color] {
  return [randomColor(), randomColor()];
}

export function createPiece(colors: [Color, Color]): PuyoPair {
  return {
    pivot: { x: SPAWN_X, y: 1, color: colors[0] },
    child: { x: SPAWN_X, y: 0, color: colors[1] },
  };
}

function inBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

export function isCellFree(board: Board, x: number, y: number): boolean {
  if (y < 0) return true;
  if (!inBounds(x, y)) return false;
  return board[y][x] === null;
}

export function isPieceValid(board: Board, piece: PuyoPair): boolean {
  return isCellFree(board, piece.pivot.x, piece.pivot.y) &&
         isCellFree(board, piece.child.x, piece.child.y);
}

export function canSpawn(board: Board, colors: [Color, Color]): boolean {
  return isPieceValid(board, createPiece(colors));
}

export function placePiece(board: Board, piece: PuyoPair): Board {
  const next = board.map(row => [...row]);
  const cells: ColoredPosition[] = [piece.pivot, piece.child];
  for (const { x, y, color } of cells) {
    if (y >= 0 && y < BOARD_HEIGHT) next[y][x] = color;
  }
  return next;
}

export function applyGravity(board: Board): Board {
  const next = createBoard();
  for (let x = 0; x < BOARD_WIDTH; x++) {
    let write = BOARD_HEIGHT - 1;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y][x] !== null) {
        next[write][x] = board[y][x];
        write--;
      }
    }
  }
  return next;
}

export function findClearable(board: Board): Position[] {
  const visited = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(false));
  const result: Position[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === null || visited[y][x]) continue;
      const color = board[y][x] as Color;
      const group: Position[] = [];
      const stack: Position[] = [{ x, y }];

      while (stack.length > 0) {
        const pos = stack.pop()!;
        if (pos.x < 0 || pos.x >= BOARD_WIDTH || pos.y < 0 || pos.y >= BOARD_HEIGHT) continue;
        if (visited[pos.y][pos.x] || board[pos.y][pos.x] !== color) continue;
        visited[pos.y][pos.x] = true;
        group.push(pos);
        stack.push({ x: pos.x + 1, y: pos.y }, { x: pos.x - 1, y: pos.y },
                   { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 });
      }

      if (group.length >= MIN_GROUP) result.push(...group);
    }
  }
  return result;
}

export function clearCells(board: Board, cells: Position[]): Board {
  const next = board.map(row => [...row]);
  for (const { x, y } of cells) next[y][x] = null;
  return next;
}

export function calcScore(cleared: number, chainIndex: number): number {
  const bonus = chainIndex < CHAIN_BONUS.length ? CHAIN_BONUS[chainIndex] : CHAIN_BONUS[CHAIN_BONUS.length - 1];
  return cleared * SCORE_BASE * bonus;
}

export function getGhost(board: Board, piece: PuyoPair): PuyoPair {
  let best = piece;
  for (let dy = 1; dy <= BOARD_HEIGHT; dy++) {
    const candidate: PuyoPair = {
      pivot: { ...piece.pivot, y: piece.pivot.y + dy },
      child: { ...piece.child, y: piece.child.y + dy },
    };
    if (!isPieceValid(board, candidate)) break;
    best = candidate;
  }
  return best;
}

function tryMove(board: Board, piece: PuyoPair, dx: number): PuyoPair | null {
  const moved: PuyoPair = {
    pivot: { ...piece.pivot, x: piece.pivot.x + dx },
    child: { ...piece.child, x: piece.child.x + dx },
  };
  return isPieceValid(board, moved) ? moved : null;
}

export function moveLeft(board: Board, piece: PuyoPair): PuyoPair | null {
  return tryMove(board, piece, -1);
}

export function moveRight(board: Board, piece: PuyoPair): PuyoPair | null {
  return tryMove(board, piece, 1);
}

function rotateDelta(dx: number, dy: number, cw: boolean): [number, number] {
  return cw ? [-dy, dx] : [dy, -dx];
}

function tryRotate(board: Board, piece: PuyoPair, cw: boolean): PuyoPair | null {
  const dx = piece.child.x - piece.pivot.x;
  const dy = piece.child.y - piece.pivot.y;
  const [ndx, ndy] = rotateDelta(dx, dy, cw);

  const rotated: PuyoPair = {
    pivot: { ...piece.pivot },
    child: { ...piece.child, x: piece.pivot.x + ndx, y: piece.pivot.y + ndy },
  };

  if (isPieceValid(board, rotated)) return rotated;

  for (const kick of [-1, 1, -2, 2]) {
    const kicked: PuyoPair = {
      pivot: { ...piece.pivot, x: piece.pivot.x + kick },
      child: { ...piece.child, x: piece.pivot.x + ndx + kick, y: piece.pivot.y + ndy },
    };
    if (isPieceValid(board, kicked)) return kicked;
  }
  return null;
}

export function rotateCW(board: Board, piece: PuyoPair): PuyoPair | null {
  return tryRotate(board, piece, true);
}

export function rotateCCW(board: Board, piece: PuyoPair): PuyoPair | null {
  return tryRotate(board, piece, false);
}

export function hardDrop(board: Board, piece: PuyoPair): PuyoPair {
  return getGhost(board, piece);
}
