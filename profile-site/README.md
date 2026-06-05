# 自己紹介サイト

シンプルな自己紹介ページのサンプルプロジェクトです。

## 構成

```
profile-site/
├── index.html   # メインページ（HTML構造）
├── style.css    # デザイン（ダークテーマ）
├── script.js    # インタラクション（スクロールアニメーション等）
└── README.md    # このファイル
```

## 機能

- **スクロールアニメーション** — カードがスクロールに合わせてフェードイン
- **タグのハイライト** — 趣味タグをクリックすると色が変わる
- **アバターの回転** — アバターをクリックすると一回転する

## 使い方

サーバー不要。`index.html` をブラウザで開くだけで動作します。

```bash
# VS Code の場合は Live Server 拡張でプレビュー
# または直接ファイルを開く
open index.html
```

## カスタマイズ

| 変更したい項目 | 編集場所 |
|---|---|
| 名前・趣味・食べ物 | `index.html` |
| 色・フォント・レイアウト | `style.css` の `:root` 変数 |
| アニメーション動作 | `script.js` |

## 技術スタック

- HTML5
- CSS3（カスタムプロパティ・Flexbox・Grid）
- Vanilla JavaScript（IntersectionObserver API）
