'use client';

import { useReducer, useEffect, useRef } from 'react';
import type { GameState, GameStatus, Color } from '@/lib/types';
import {
  BASE_FALL_MS, FAST_FALL_MS, CLEAR_ANIM_MS,
  LEVEL_UP_CLEARED, SPEED_REDUCTION_MS, MIN_FALL_MS,
} from '@/lib/constants';
import {
  createBoard, randomPair, createPiece, placePiece, applyGravity,
  findClearable, clearCells, calcScore, moveLeft, moveRight,
  rotateCW, rotateCCW, hardDrop, isPieceValid, canSpawn,
} from '@/lib/gameLogic';

type Action =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE_CW' }
  | { type: 'ROTATE_CCW' }
  | { type: 'HARD_DROP' }
  | { type: 'SET_FAST'; value: boolean }
  | { type: 'CLEAR_DONE' };

const initial: GameState = {
  board: createBoard(),
  currentPiece: null,
  nextColors: ['red', 'blue'] as [Color, Color],
  score: 0,
  chain: 0,
  maxChain: 0,
  level: 1,
  totalCleared: 0,
  status: 'idle',
  clearingCells: [],
  isFastFalling: false,
};

function spawnNext(state: GameState): GameState {
  const nextColors = randomPair();
  const piece = createPiece(state.nextColors);
  if (!canSpawn(state.board, state.nextColors)) {
    return { ...state, currentPiece: null, status: 'gameOver' };
  }
  return {
    ...state,
    currentPiece: piece,
    nextColors,
    status: 'playing',
    clearingCells: [],
  };
}

function landPiece(state: GameState): GameState {
  if (!state.currentPiece) return state;
  let board = placePiece(state.board, state.currentPiece);
  board = applyGravity(board);
  const cells = findClearable(board);

  if (cells.length > 0) {
    return { ...state, board, currentPiece: null, status: 'clearing', clearingCells: cells, chain: 0 };
  }
  return spawnNext({ ...state, board, currentPiece: null, chain: 0 });
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return spawnNext({
        ...initial,
        nextColors: randomPair(),
        maxChain: state.maxChain,
      });

    case 'PAUSE':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state;

    case 'RESUME':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state;

    case 'TICK': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const moved = {
        pivot: { ...state.currentPiece.pivot, y: state.currentPiece.pivot.y + 1 },
        child: { ...state.currentPiece.child, y: state.currentPiece.child.y + 1 },
      };
      if (isPieceValid(state.board, moved)) {
        return { ...state, currentPiece: moved };
      }
      return landPiece(state);
    }

    case 'MOVE_LEFT': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const moved = moveLeft(state.board, state.currentPiece);
      return moved ? { ...state, currentPiece: moved } : state;
    }

    case 'MOVE_RIGHT': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const moved = moveRight(state.board, state.currentPiece);
      return moved ? { ...state, currentPiece: moved } : state;
    }

    case 'ROTATE_CW': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const rotated = rotateCW(state.board, state.currentPiece);
      return rotated ? { ...state, currentPiece: rotated } : state;
    }

    case 'ROTATE_CCW': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const rotated = rotateCCW(state.board, state.currentPiece);
      return rotated ? { ...state, currentPiece: rotated } : state;
    }

    case 'HARD_DROP': {
      if (state.status !== 'playing' || !state.currentPiece) return state;
      const dropped = hardDrop(state.board, state.currentPiece);
      return landPiece({ ...state, currentPiece: dropped });
    }

    case 'SET_FAST':
      return { ...state, isFastFalling: action.value };

    case 'CLEAR_DONE': {
      if (state.status !== 'clearing') return state;
      const chain = state.chain + 1;
      const maxChain = Math.max(state.maxChain, chain);
      const totalCleared = state.totalCleared + state.clearingCells.length;
      const level = Math.floor(totalCleared / LEVEL_UP_CLEARED) + 1;
      const score = state.score + calcScore(state.clearingCells.length, chain - 1);

      let board = clearCells(state.board, state.clearingCells);
      board = applyGravity(board);

      const cells = findClearable(board);
      if (cells.length > 0) {
        return { ...state, board, score, chain, maxChain, totalCleared, level, clearingCells: cells };
      }

      return spawnNext({ ...state, board, score, chain: 0, maxChain, totalCleared, level, currentPiece: null });
    }

    default:
      return state;
  }
}

export function usePuyoGame() {
  const [state, dispatch] = useReducer(reducer, initial);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Fall timer
  useEffect(() => {
    if (state.status !== 'playing') return;
    const ms = state.isFastFalling
      ? FAST_FALL_MS
      : Math.max(MIN_FALL_MS, BASE_FALL_MS - (state.level - 1) * SPEED_REDUCTION_MS);
    const id = setInterval(() => dispatch({ type: 'TICK' }), ms);
    return () => clearInterval(id);
  }, [state.status, state.isFastFalling, state.level]);

  // Clearing animation timer
  useEffect(() => {
    if (state.status !== 'clearing') return;
    const id = setTimeout(() => dispatch({ type: 'CLEAR_DONE' }), CLEAR_ANIM_MS);
    return () => clearTimeout(id);
  }, [state.status, state.clearingCells]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':  e.preventDefault(); dispatch({ type: 'MOVE_LEFT' }); break;
        case 'ArrowRight': e.preventDefault(); dispatch({ type: 'MOVE_RIGHT' }); break;
        case 'ArrowUp':    e.preventDefault(); dispatch({ type: 'ROTATE_CW' }); break;
        case 'ArrowDown':  e.preventDefault(); dispatch({ type: 'SET_FAST', value: true }); break;
        case 'x': case 'X': dispatch({ type: 'ROTATE_CW' }); break;
        case 'z': case 'Z': dispatch({ type: 'ROTATE_CCW' }); break;
        case ' ':
          e.preventDefault();
          dispatch({ type: 'HARD_DROP' });
          break;
        case 'p': case 'P':
          if (stateRef.current.status === 'playing') dispatch({ type: 'PAUSE' });
          else if (stateRef.current.status === 'paused') dispatch({ type: 'RESUME' });
          break;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') dispatch({ type: 'SET_FAST', value: false });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return {
    state,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    resume: () => dispatch({ type: 'RESUME' }),
  };
}
