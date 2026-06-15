'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-white"
      style={{ background: '#02040f' }}
    >
      <p className="text-red-400 text-xl font-bold">エラーが発生しました</p>
      <p className="text-white/40 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-full text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        もう一度試す
      </button>
    </div>
  );
}
