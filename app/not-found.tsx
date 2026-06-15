import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-white"
      style={{ background: '#02040f' }}
    >
      <p className="text-white/50 text-6xl font-black tracking-widest">404</p>
      <p className="text-white/40 text-sm">ページが見つかりません</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
