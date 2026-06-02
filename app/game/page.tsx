import type { Metadata } from "next";
import PuyoGame from "@/components/PuyoGame";

export const metadata: Metadata = {
  title: "Puyo Puyo – Play Online",
  description: "ブラウザで遊べるぷよぷよゲーム。Next.js 16 + React 19 + TypeScript 製。",
};

export default function GamePage() {
  return <PuyoGame />;
}
