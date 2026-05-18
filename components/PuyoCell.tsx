'use client';

import type { Color } from '@/lib/types';
import { COLOR_CONFIG } from '@/lib/constants';

interface Props {
  color: Color;
  isClearing?: boolean;
  isGhost?: boolean;
}

function BasketballSeams() {
  return (
    <>
      {/* Vertical center rib */}
      <div className="absolute pointer-events-none" style={{
        left: '46%', top: '6%', width: '8%', height: '88%',
        background: 'rgba(0,0,0,0.45)', borderRadius: '50%',
      }} />
      {/* Upper arc */}
      <div className="absolute pointer-events-none" style={{
        left: '8%', top: '20%', width: '84%', height: '35%',
        border: '2.5px solid rgba(0,0,0,0.45)', borderRadius: '50%',
        background: 'transparent',
        borderColor: 'rgba(0,0,0,0.45) transparent transparent transparent',
      }} />
      {/* Lower arc */}
      <div className="absolute pointer-events-none" style={{
        left: '8%', top: '45%', width: '84%', height: '35%',
        border: '2.5px solid rgba(0,0,0,0.45)', borderRadius: '50%',
        background: 'transparent',
        borderColor: 'transparent transparent rgba(0,0,0,0.45) transparent',
      }} />
    </>
  );
}

function TennisCurve() {
  return (
    <>
      {/* Top-left white arc */}
      <div className="absolute pointer-events-none" style={{
        left: '-12%', top: '20%', width: '60%', height: '60%',
        border: '3px solid rgba(255,255,255,0.85)', borderRadius: '50%',
        background: 'transparent',
        borderColor: 'rgba(255,255,255,0.85) transparent transparent transparent',
        transform: 'rotate(35deg)',
      }} />
      {/* Bottom-right white arc (mirror) */}
      <div className="absolute pointer-events-none" style={{
        right: '-12%', bottom: '20%', width: '60%', height: '60%',
        border: '3px solid rgba(255,255,255,0.85)', borderRadius: '50%',
        background: 'transparent',
        borderColor: 'transparent transparent rgba(255,255,255,0.85) transparent',
        transform: 'rotate(35deg)',
      }} />
    </>
  );
}

function BowlingHoles() {
  return (
    <>
      {/* Thumb hole */}
      <div className="absolute rounded-full pointer-events-none" style={{
        top: '28%', left: '28%', width: '16%', height: '16%',
        background: 'rgba(0,0,0,0.75)',
        boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)',
      }} />
      {/* Ring finger hole */}
      <div className="absolute rounded-full pointer-events-none" style={{
        top: '28%', left: '56%', width: '16%', height: '16%',
        background: 'rgba(0,0,0,0.75)',
        boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)',
      }} />
      {/* Middle finger hole */}
      <div className="absolute rounded-full pointer-events-none" style={{
        top: '50%', left: '42%', width: '16%', height: '16%',
        background: 'rgba(0,0,0,0.75)',
        boxShadow: 'inset 1px 1px 3px rgba(255,255,255,0.15)',
      }} />
    </>
  );
}

function BaseballStitch() {
  return (
    <>
      {/* Left red stitch arc */}
      <div className="absolute pointer-events-none" style={{
        left: '6%', top: '28%', width: '32%', height: '44%',
        border: '2.5px solid #ef4444', borderRadius: '50%',
        background: 'transparent',
        borderColor: '#ef4444 transparent transparent transparent',
        transform: 'rotate(-40deg)',
      }} />
      {/* Right red stitch arc (mirror) */}
      <div className="absolute pointer-events-none" style={{
        right: '6%', top: '28%', width: '32%', height: '44%',
        border: '2.5px solid #ef4444', borderRadius: '50%',
        background: 'transparent',
        borderColor: 'transparent transparent #ef4444 transparent',
        transform: 'rotate(-40deg)',
      }} />
    </>
  );
}

function BallPattern({ color }: { color: Color }) {
  switch (color) {
    case 'red':    return <BasketballSeams />;
    case 'green':  return <TennisCurve />;
    case 'blue':   return <BowlingHoles />;
    case 'yellow': return <BaseballStitch />;
    default:       return null;
  }
}

export default function PuyoCell({ color, isClearing, isGhost }: Props) {
  const { gradient, glow } = COLOR_CONFIG[color];

  return (
    <div className="w-full h-full p-[3px]">
      <div
        className={`w-full h-full rounded-full relative overflow-visible select-none${
          isGhost ? ' opacity-25' : ''
        }${isClearing ? ' puyo-clearing' : ''}`}
        style={{
          background: gradient,
          boxShadow: isGhost
            ? 'none'
            : `0 0 8px 2px ${glow}55, inset -2px -3px 5px rgba(0,0,0,0.28), inset 1px 2px 5px rgba(255,255,255,0.38)`,
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '42%',
            height: '34%',
            top: '9%',
            left: '13%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)',
          }}
        />
        {/* Ball-specific pattern */}
        {!isGhost && <BallPattern color={color} />}
      </div>
    </div>
  );
}
