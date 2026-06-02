export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type Cell = Color | null;
export type Board = Cell[][];

export interface Position {
  x: number;
  y: number;
}

export interface ColoredPosition extends Position {
  color: Color;
}

export interface PuyoPair {
  pivot: ColoredPosition;
  child: ColoredPosition;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'clearing' | 'gameOver';

export interface GameState {
  board: Board;
  currentPiece: PuyoPair | null;
  nextColors: [Color, Color];
  score: number;
  chain: number;
  maxChain: number;
  level: number;
  totalCleared: number;
  status: GameStatus;
  clearingCells: Position[];
  isFastFalling: boolean;
}
