'use client';

import { usePuyoGame } from '@/hooks/usePuyoGame';
import GameBoard from './GameBoard';
import SidePanel from './SidePanel';

const STARS = Array.from({ length: 120 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 53.208) % 100,
  size: ((i * 7) % 3) + 1,
  opacity: 0.15 + ((i * 11) % 10) * 0.06,
}));

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center rounded-xl z-10"
      style={{ background: 'rgba(1, 2, 18, 0.93)', backdropFilter: 'blur(4px)' }}
    >
      {children}
    </div>
  );
}

function GlowButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full font-black text-white text-lg tracking-wide transition-all duration-200 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
        boxShadow: '0 0 20px rgba(124,58,237,0.5), 0 4px 15px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </button>
  );
}

export default function PuyoGame() {
  const { state, start, resume } = usePuyoGame();
  const { status, board, currentPiece, clearingCells, nextColors, score, chain, maxChain, level } = state;

  const isPieceVisible = status === 'playing' || status === 'paused';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -10%, #120030 0%, #02040f 55%, #000008 100%)' }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          />
        ))}
      </div>

      {/* Title */}
      <h1
        className="relative z-10 text-5xl font-black tracking-[0.18em] mb-7"
        style={{
          background: 'linear-gradient(130deg, #c084fc 0%, #818cf8 40%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 24px rgba(192,132,252,0.45))',
        }}
      >
        PUYO PUYO
      </h1>

      {/* Game area */}
      <div className="relative z-10 flex items-start gap-5">
        <SidePanel score={score} chain={chain} maxChain={maxChain} level={level} nextColors={nextColors} />

        <div className="relative">
          <GameBoard
            board={board}
            currentPiece={isPieceVisible ? currentPiece : null}
            clearingCells={clearingCells}
          />

          {/* Chain flash */}
          {status === 'clearing' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <span
                key={chain}
                className="chain-pop text-5xl font-black"
                style={{
                  color: '#fbbf24',
                  textShadow: '0 0 20px #f59e0b, 0 0 50px #d97706, 0 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                {chain + 1} CHAIN!
              </span>
            </div>
          )}

          {/* Idle overlay */}
          {status === 'idle' && (
            <Overlay>
              <GlowButton onClick={start}>START</GlowButton>
              <div
                aria-label="操作方法: 左右矢印で移動、上矢印またはXで時計回り回転、Zで反時計回り回転、下矢印でファストドロップ、スペースでハードドロップ、Pでポーズ"
                className="mt-6 text-white/30 text-xs text-center leading-6"
              >
                ← → Move &nbsp;·&nbsp; ↑ / X Rotate CW<br />
                Z Rotate CCW &nbsp;·&nbsp; ↓ Fast Drop<br />
                Space Hard Drop &nbsp;·&nbsp; P Pause
              </div>
            </Overlay>
          )}

          {/* Paused overlay */}
          {status === 'paused' && (
            <Overlay>
              <div className="text-white text-4xl font-black tracking-widest mb-5">PAUSED</div>
              <GlowButton onClick={resume}>RESUME</GlowButton>
            </Overlay>
          )}

          {/* Game over overlay */}
          {status === 'gameOver' && (
            <Overlay>
              <div role="alert" aria-live="assertive" className="flex flex-col items-center">
              <div
                className="text-4xl font-black tracking-wider mb-1"
                style={{ color: '#f87171', textShadow: '0 0 20px rgba(239,68,68,0.6)' }}
              >
                GAME OVER
              </div>
              <div className="text-white/50 text-sm mb-6">
                Score: <span className="text-white font-bold">{score.toLocaleString()}</span>
                {maxChain > 0 && (
                  <> &nbsp;·&nbsp; Best Chain: <span className="text-yellow-400 font-bold">{maxChain}×</span></>
                )}
              </div>
              <GlowButton onClick={start}>RETRY</GlowButton>
              </div>
            </Overlay>
          )}
        </div>
      </div>

      <p className="relative z-10 mt-5 text-white/15 text-xs tracking-wide">
        ←→ Move · ↑/X Rotate CW · Z Rotate CCW · ↓ Fast · Space Hard Drop · P Pause
      </p>
    </div>
  );
}
