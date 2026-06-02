import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AI Portfolio – Claude Code Projects",
  description: "Claude / Claude Code を使ったAIツール・マルチエージェントシステムの開発実績",
  openGraph: {
    title: "AI Portfolio – Claude Code Projects",
    description: "Claude / Claude Code を使ったAIツール・マルチエージェントシステムの開発実績",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <body>{children}</body>
    </html>
  );
}
