import type { Color } from './types';

export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 12;
export const SPAWN_X = 2;

export const COLORS: readonly Color[] = ['red', 'green', 'blue', 'yellow'] as const;

export const MIN_GROUP = 4;
export const BASE_FALL_MS = 700;
export const FAST_FALL_MS = 40;
export const CLEAR_ANIM_MS = 550;
export const LEVEL_UP_CLEARED = 30;
export const SPEED_REDUCTION_MS = 50;
export const MIN_FALL_MS = 150;

export const SCORE_BASE = 10;
export const CHAIN_BONUS = [1, 2, 4, 8, 16, 32, 64, 128, 256];

export const COLOR_CONFIG: Record<Color, { gradient: string; glow: string; darkStop: string }> = {
  // Basketball (orange)
  red:    { gradient: 'radial-gradient(circle at 35% 30%, #ffb347, #e85d04 52%, #7c2d12)', glow: '#f97316', darkStop: '#7c2d12' },
  // Tennis ball (fluorescent yellow-green)
  green:  { gradient: 'radial-gradient(circle at 33% 28%, #f0f9a0, #84cc16 52%, #365314)', glow: '#bef264', darkStop: '#365314' },
  // Bowling ball (deep purple-blue)
  blue:   { gradient: 'radial-gradient(circle at 33% 28%, #c4b5fd, #4c1d95 52%, #1e1035)', glow: '#7c3aed', darkStop: '#1e1035' },
  // Baseball (cream/off-white)
  yellow: { gradient: 'radial-gradient(circle at 33% 28%, #fffbf0, #fef3c7 52%, #d4a76a)', glow: '#fde68a', darkStop: '#d4a76a' },
  purple: { gradient: 'radial-gradient(circle at 33% 28%, #e9d5ff, #9333ea 52%, #4c1d95)', glow: '#c084fc', darkStop: '#4c1d95' },
};
