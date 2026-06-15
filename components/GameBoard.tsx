'use client';

import { useMemo } from 'react';
import type { Board, Position, PuyoPair, Color } from '@/lib/types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/lib/constants';
import { getGhost } from '@/lib/gameLogic';
import PuyoCell from './PuyoCell';

type RenderCell = { color: Color; isClearing: boolean; isGhost: boolean } | null;

function buildGrid(
  board: Board,
  piece: PuyoPair | null,
  clearingCells: Position[],
): RenderCell[][] {
  const clearSet = new Set(clearingCells.map(p => `${p.x},${p.y}`));

  const grid: RenderCell[][] = board.map((row, y) =>
    row.map((color, x) => {
      if (!color) return null;
      return { color, isClearing: clearSet.has(`${x},${y}`), isGhost: false };
    })
  );

  if (!piece) return grid;

  // Ghost
  const ghost = getGhost(board, piece);
  for (const { x, y, color } of [ghost.pivot, ghost.child]) {
    if (y >= 0 && y < BOARD_HEIGHT && !grid[y][x]) {
      grid[y][x] = { color, isClearing: false, isGhost: true };
    }
  }

  // Current piece
  for (const { x, y, color } of [piece.pivot, piece.child]) {
    if (y >= 0 && y < BOARD_HEIGHT) {
      grid[y][x] = { color, isClearing: false, isGhost: false };
    }
  }

  return grid;
}

interface Props {
  board: Board;
  currentPiece: PuyoPair | null;
  clearingCells: Position[];
}

export default function GameBoard({ board, currentPiece, clearingCells }: Props) {
  const grid = useMemo(
    () => buildGrid(board, currentPiece, clearingCells),
    [board, currentPiece, clearingCells],
  );

  return (
    <div
      role="application"
      aria-label="ぷよぷよゲームボード（6列×12行）"
      className="relative rounded-xl overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 50px)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 50px)`,
        width: `${BOARD_WIDTH * 50}px`,
        height: `${BOARD_HEIGHT * 50}px`,
        background: 'rgba(2, 4, 24, 0.88)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(100,60,220,0.18), inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            aria-hidden="true"
            style={{
              borderRight: x < BOARD_WIDTH - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
              borderBottom: y < BOARD_HEIGHT - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
            }}
          >
            {cell && (
              <PuyoCell
                color={cell.color}
                isClearing={cell.isClearing}
                isGhost={cell.isGhost}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
