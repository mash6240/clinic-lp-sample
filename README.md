# Clair Bloom Skin Clinic — Sample LP

架空の美容皮膚科クリニックを想定した、ランディングページのコーディングサンプルです。
クリニック名・医師・料金・住所などはすべて架空のものです。

## 使用技術

- HTML5（セマンティックなマークアップ、WAI-ARIAによるアクセシビリティ対応）
- CSS / Sass（SCSS）… FLOCSS風のディレクトリ構成、BEM命名、`@use` によるモジュール分割
- JavaScript（バニラJS、ライブラリ不使用）

## 実装内容

- レスポンシブ対応（PC / タブレット / スマートフォン）
- ハンバーガーメニュー（Escキー・リンククリックで閉じる）
- スクロールに応じたフェードイン（IntersectionObserver）
- 料金表のタブ切り替え（矢印キー操作に対応）
- FAQアコーディオン（Web Animations API）
- 予約フォームの入力チェック（未入力・電話番号・メール形式）
- スマートフォン用の追従CTAボタン、ページトップボタン
- `prefers-reduced-motion` への配慮

## ディレクトリ構成

```
├── index.html
├── css/style.css        … コンパイル後のCSS
├── scss/
│   ├── style.scss
│   ├── foundation/      … 変数・mixin・リセット
│   ├── layout/          … コンテナ・セクション
│   ├── components/      … ボタン・見出し
│   └── project/         … 各セクション
└── js/main.js
```

## Sassのコンパイル

```bash
npm install
npx sass scss/style.scss css/style.css --style=expanded --no-source-map
```

## 備考

医療広告ガイドラインを意識し、ビフォーアフター写真・「No.1」等の表現は使用せず、
料金は税込表示、自由診療である旨とリスク・副作用を併記しています。
