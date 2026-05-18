'use client';

import type { Color } from '@/lib/types';
import { COLOR_CONFIG } from '@/lib/constants';
import PuyoCell from './PuyoCell';

interface Props {
  score: number;
  chain: number;
  maxChain: number;
  level: number;
  nextColors: [Color, Color];
}

function StatBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 border border-white/[0.07]"
      style={{ background: 'rgba(8, 6, 32, 0.82)' }}
    >
      <div className="text-[10px] font-semibold tracking-widest uppercase text-purple-400/70 mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

export default function SidePanel({ score, chain, maxChain, level, nextColors }: Props) {
  const [pivotColor, childColor] = nextColors;

  return (
    <div className="flex flex-col gap-3 w-[120px]">
      <StatBox label="Score">
        <div className="text-xl font-black text-white tabular-nums leading-tight">
          {score.toLocaleString()}
        </div>
      </StatBox>

      <StatBox label="Level">
        <div className="text-xl font-black text-cyan-300">{level}</div>
      </StatBox>

      <StatBox label="Chain">
        <div
          className="text-xl font-black tabular-nums"
          style={{
            color: chain > 0 ? COLOR_CONFIG.yellow.glow : 'rgba(255,255,255,0.25)',
            textShadow: chain > 2 ? `0 0 12px ${COLOR_CONFIG.yellow.glow}` : 'none',
          }}
        >
          {chain > 0 ? `${chain}×` : '—'}
        </div>
        <div className="text-[10px] text-white/30 mt-0.5">Best {maxChain}×</div>
      </StatBox>

      <StatBox label="Next">
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <div className="w-10 h-10">
            <PuyoCell color={childColor} />
          </div>
          <div className="w-10 h-10">
            <PuyoCell color={pivotColor} />
          </div>
        </div>
      </StatBox>
    </div>
  );
}
