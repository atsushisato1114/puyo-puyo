# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT**: This project uses Next.js 16, React 19, and Tailwind CSS v4 — all with breaking changes from prior versions. Read `AGENTS.md` before writing any code, and check `node_modules/next/dist/docs/` for current API docs.

---

## Agents & Skills

このプロジェクトには以下の SubAgents と Skills が設定されています。

### SubAgents (`.claude/agents/`)

| エージェント | 用途 | 起動トリガー |
|---|---|---|
| `code-reviewer` | Next.js/React/TypeScript コードのレビュー・セキュリティ検査 | 新しいコードを書いた / レビュー依頼 |
| `static-site-reviewer` | 静的HTML/CSS/JSサイトのレビュー（WCAG・GitHub Pages・パフォーマンス） | ポートフォリオ・LP・静的サイトを実装した / レビュー依頼 |
| `seo-blog-writer` | SEOブログ記事執筆 | 「記事を書いて」「〇〇文字で」 |
| `claude-code-guide` | ClaudeCode機能（SubAgents/Skills/Commands/Hooks/MCP）の解説 | ClaudeCodeの使い方を聞かれたとき |
| `doc-writer` | ドキュメント・JSDoc 生成 | 「ドキュメントを書いて」 |
| `industry-researcher` | 業界情報のWeb収集・分析・レポート生成 | 「〇〇業界を調べて」「市場動向を分析して」 |
| `differentiation-builder` | 競合との差別化戦略の設計・提案 | 「差別化戦略を考えて」「競合と違うアプローチを提案して」 |
| `text-reviewer` | 文章の構成・誤字脱字・表現の添削 | 「文章を添削して」「誤字脱字を確認して」 |
| `test-runner` | テスト生成・実行 | 「テストを書いて」「テストを実行して」 |

### Skills (`.claude/skills/`)

| スキル | 用途 | 呼び出し |
|---|---|---|
| `char-count` | テキスト文字数を4パターンで計測 | `/char-count` |
| `summarize-url` | URLページを日本語要約 | `/summarize-url` |
| `summarize-file` | ファイルをタイトル・トピック3つ・結論の形式で要約 | `/summarize-file <ファイルパス>` |
| `claudecode-features` | SubAgents/Skills/Commands/Hooks/MCPの構造解説 | `claude-code-guide` エージェント内で使用 |
| `build-and-review` | 業界調査→差別化戦略構築→文章添削を3エージェントで順次実行 | `/build-and-review` |
| `review-driven-build` | 実装前に観点洗い出し→実装→コードレビュー→修正を完結させるワークフロー | 「レビューしながら実装して」`/review-driven-build` |

---

## Commands

```bash
npm run dev      # Dev server → http://localhost:3000 (Turbopack)
npm run build    # Production build (TypeScript checked)
npm run start    # Serve production build
npm run lint     # ESLint
```

## Architecture

**Stack**: Next.js 16 App Router · React 19 · TypeScript (strict) · Tailwind CSS v4

**Tailwind v4 differences**:
- Config lives in CSS, not `tailwind.config.js`
- Use `@import "tailwindcss"` (not `@tailwind` directives)
- Design tokens go in `@theme { }` block in `globals.css`
- Custom CSS classes work alongside Tailwind without `@utility`

**Path alias**: `@/*` maps to the project root (not `app/`). Place shared code in root-level `lib/`, `hooks/`, `components/`.

**Directory layout**:
```
app/                  # Next.js App Router pages/layouts only
  layout.tsx          # Root layout + font setup
  page.tsx            # Entry — renders <PuyoGame />
  globals.css         # Global CSS + animation keyframes

components/           # React client components
hooks/                # Custom React hooks
lib/                  # Pure TypeScript (no React)
```

---

## ぷよぷよ 要件定義

### 1. 目的・背景

ブラウザ上で動作するぷよぷよゲームを実装する。モダンな UI/UX（ダーク宇宙テーマ・ネオングロー・グラスモーフィズム）を採用し、キーボード操作のみでプレイ可能なシングルプレイヤーゲームとして提供する。

---

### 2. 用語定義

| 用語 | 定義 |
|------|------|
| ぷよ | ゲームの基本単位。色を持つ球体オブジェクト |
| ツモ | 落下中の 2 個 1 組のぷよペア |
| ピボット | ツモの回転軸となるぷよ（下側・スポーン時） |
| チャイルド | ピボットの周囲を回転するぷよ（上側・スポーン時） |
| ゴースト | ツモが着地する位置を示す半透明プレビュー |
| チェイン | 消去後の落下によって連鎖的に発生する追加消去 |
| 消去グループ | 同色の連結ぷよの集合（4 個以上で消去対象） |

---

### 3. システム概要

```
ブラウザ (Next.js 16 / React 19)
  ├─ ゲームロジック層 (lib/gameLogic.ts)   — 純粋関数、副作用なし
  ├─ 状態管理層 (hooks/usePuyoGame.ts)     — useReducer + useEffect
  └─ 描画層 (components/)                 — React Server/Client Components
```

---

### 4. 機能要件

#### 4-1. ゲームボード

| 項目 | 仕様 |
|------|------|
| 列数 | 6 列（0〜5） |
| 行数 | 12 行（0 = 最上段、11 = 最下段） |
| セルサイズ | 50×50 px |
| ボードサイズ | 300×600 px |
| スポーン列 | 列 2（中央寄り左） |
| スポーン行 | チャイルド = 行 0、ピボット = 行 1 |

ボードは `Cell[][]`（`Cell = Color | null`）の 2 次元配列で表現する。行 0 が上端。

#### 4-2. ツモ（PuyoPair）

- ピボットとチャイルドの 2 個で構成される。
- スポーン時の配置: チャイルドが上（行 0）、ピボットが下（行 1）。
- 使用色: **4 色**（赤・緑・青・黄）— バランス調整のため紫は除外。
- 次のツモは NEXT パネルに常時表示する。

#### 4-3. 操作仕様

| キー | 動作 | 処理タイミング |
|------|------|---------------|
| `←` | 左移動 | keydown（キーリピートあり） |
| `→` | 右移動 | keydown（キーリピートあり） |
| `↑` または `X` | 時計回り回転 | keydown |
| `Z` | 反時計回り回転 | keydown |
| `↓`（長押し） | ソフトドロップ | keydown→keyup |
| `Space` | ハードドロップ（即着地） | keydown |
| `P` | ポーズ / 再開トグル | keydown |

**回転仕様:**
- 時計回り: `(dx, dy) → (−dy, dx)`
- 反時計回り: `(dx, dy) → (dy, −dx)`
- 壁キック: 回転後に境界外・占有セルと重なる場合、ピボットを `[−1, +1, −2, +2]` オフセットして再判定。すべて失敗した場合は回転不可。

#### 4-4. 落下・着地・重力

| フェーズ | 処理 |
|---------|------|
| 自動落下 | `setInterval` で TICK を発行、ピボット/チャイルドの Y を +1 |
| 落下不可判定 | 移動先セルが盤外または占有済み |
| 着地 | ツモを盤面に書き込み → チェイン判定へ |
| 重力 | 消去後、各列を下詰めで再配置（`applyGravity`） |

落下速度:
```
fallMs = max(150, 700 − (level − 1) × 50)   [ms/行]
softDropMs = 40 [ms/行]（固定）
```

#### 4-5. チェイン（連鎖）判定

1. 着地後、`findClearable` で同色連結グループを幅優先探索。
2. サイズ ≥ 4 のグループを消去対象としてマーク（`clearingCells`）。
3. CSS アニメーション（0.55 秒）でぷよを光らせて消える演出を表示。
4. アニメーション完了後: セルを削除 → 重力適用 → 再度 1. へ。
5. 消去対象がなくなったら次のツモをスポーン。
6. 各ループ 1 回 = チェイン +1。チェイン数はボード上に「N CHAIN!」と表示。

```
チェインフロー:
着地 → 消去あり → [clearing] → CLEAR_DONE → 消去あり → [clearing] → ...
                                             → 消去なし → [playing] (次ツモ)
```

#### 4-6. スコアリング

```
加算スコア = 消去数 × 10 × CHAIN_BONUS[chainIndex]

CHAIN_BONUS = [1, 2, 4, 8, 16, 32, 64, 128, 256]
              (1チェイン目〜9チェイン目以降)
```

スコアは累積加算し、GAME OVER まで保持する。最高チェイン数（maxChain）も記録。

#### 4-7. レベルシステム

```
level = floor(totalCleared / 30) + 1
```

レベルが上がるごとに落下速度が増加（最速 150 ms）。レベルに上限なし。

#### 4-8. ゲームオーバー判定

次のツモをスポーンしようとしたとき、スポーン位置（列 2、行 0〜1）が既存のぷよと重なる場合、ゲームオーバー。GAME OVER オーバーレイを表示し、RETRY ボタンでリスタート。

---

### 5. 非機能要件

| カテゴリ | 要件 |
|---------|------|
| パフォーマンス | ゲームループ中のレイアウト再計算を最小化。描画は React の差分更新に依存 |
| アクセシビリティ | キーボードのみで全操作可能。マウス/タッチ操作は対象外 |
| レスポンシブ | デスクトップ優先。ボード幅 300 px 固定 |
| ブラウザ対応 | モダンブラウザ（Chrome / Firefox / Edge 最新版） |
| 状態管理 | 外部ライブラリ不使用。`useReducer` + `useEffect` のみ |
| アニメーション | CSS アニメーションのみ（JavaScript アニメーションループ不使用） |
| サウンド | スコープ外（未実装） |

---

### 6. 画面仕様

```
┌──────────────────────────────────────────┐
│              PUYO PUYO (タイトル)           │
│  ┌──────────┐  ┌──────────────┐          │
│  │ SCORE    │  │              │          │
│  │ LEVEL    │  │  ゲームボード  │          │
│  │ CHAIN    │  │   6 × 12     │          │
│  │ NEXT     │  │              │          │
│  └──────────┘  └──────────────┘          │
│              操作説明（フッター）            │
└──────────────────────────────────────────┘
```

**オーバーレイ（ボード上に表示）:**

| 状態 | 表示内容 |
|------|---------|
| `idle` | START ボタン + 操作説明 |
| `paused` | PAUSED + RESUME ボタン |
| `clearing` | `N CHAIN!`（チェイン数 ≥ 1 のとき） |
| `gameOver` | GAME OVER + スコア + 最高チェイン + RETRY ボタン |

---

### 7. ゲーム状態遷移

```
idle
 └─ START ──────────────────────► playing
                                     │
                          ┌──────────┴──────────┐
                     TICK落下可                TICK落下不可
                          │                       │
                       playing             消去あり?
                                          /        \
                                        YES         NO
                                         │           │
                                      clearing    playing
                                         │       (次ツモ)
                                    CLEAR_DONE
                                     /      \
                               消去あり    消去なし
                                  │            │
                               clearing     playing
                                          (次ツモ)
                                               │
                                          スポーン失敗
                                               │
                                           gameOver
```

---

### 8. 制約・前提条件

- シングルプレイヤーのみ（対戦モードはスコープ外）
- セーブ機能・ハイスコア永続化はスコープ外（メモリ上のみ）
- おじゃまぷよはスコープ外
- モバイル対応はスコープ外

---

### 9. 技術スタック対応表

| ゲーム要素 | 対応実装 |
|-----------|---------|
| ボード状態 | `GameState.board: Cell[][]` |
| ツモ管理 | `GameState.currentPiece: PuyoPair` |
| 落下タイマー | `useEffect` + `setInterval` |
| 消去タイマー | `useEffect` + `setTimeout` |
| 純粋ロジック | `lib/gameLogic.ts`（副作用なし） |
| 状態遷移 | `hooks/usePuyoGame.ts`（`useReducer`） |
| ぷよ描画 | `components/PuyoCell.tsx`（CSS グラデーション） |
| チェイン演出 | `globals.css`（`@keyframes chain-bounce`） |
| 消去演出 | `globals.css`（`@keyframes puyo-clear`） |
