# Street Fighter 6 ○×クイズ

ストリートファイター6のキャラクター性能に関する○×クイズアプリケーションです。

### 主な機能

- 複数のクイズコース（テーマ別）
- 対戦格闘ゲーム風の体力ゲージ演出
- 全問正解時の特別演出
- レスポンシブデザイン（PC・モバイル対応）
- 結果画面での詳細確認機能

## 📁 プロジェクト構成

```
marubatu/
├── index.html              # メインHTMLファイル
├── script.js               # クイズロジック
├── style.css               # スタイルシート
├── data/                   # クイズデータフォルダ
│   ├── quizMenu.js         # コース一覧定義
│   ├── questionsData1.js   # コース1のデータ
│   ├── questionsData2.js   # コース2のデータ
│   └── questionsData3.js   # コース3のデータ（テスト用）
└── images/                 # 画像フォルダ
    ├── icon/               # ○×アイコン
    ├── sf6icon_a/          # キャラクターアイコンA
    ├── sf6icon_b/          # キャラクターアイコンB
    └── system/             # システム画像（数字、タイトル、結果など）
```

## 🚀 使い方

### ローカルで実行

1. プロジェクトをダウンロード
2. `index.html` をブラウザで開く

## ➕ 新しいコースの追加方法

### 1. 問題データファイルを作成

`data/questionsData4.js` を作成：

```javascript
const questionsData4 = {
  question: "コース全体で共通の問題文（例: 〇〇の技がある）",
  characters: [
    {
      answer: true, // または false
      images: ["sf6icon_a/ken.png"], // 相対パスは images/ からの指定
      explanation: "解説文（任意）",
    },
    {
      answer: false,
      images: ["sf6icon_a/ryu.png"],
      explanation: "解説文",
    },
    // ... 他のキャラクター
  ],
};

// グローバルに登録（必須）
window.questionsData4 = questionsData4;
```

**重要なポイント:**

- ファイル名と変数名を対応させる（`questionsData4.js` → `questionsData4`）
- `question` はコース全体で1つ（全キャラクター共通の問い）
- 画像パスは `images/` フォルダからの相対パス
- 最後に `window.questionsDataX = questionsDataX;` で登録（必須）

### 2. quizMenu.js にコースを追加

`data/quizMenu.js` を編集：

```javascript
const quizCourses = [
  // ... 既存のコース
  {
    id: "new-course",
    title: "新しいコースのタイトル",
    description: "コースの説明文",
    dataFile: "questionsData4.js",
  },
];
```

これだけで新しいコースが自動的に読み込まれ、トップページに表示されます。

## 🎮 ゲージ演出について

クイズ進行中、画面上部のゲージが変化します：

- **左（赤）のバー**: 不正解で減少
- **右（青）のバー**: 正解で減少
- **中央の数字**: 残り問題数（2桁表示）

全問正解すると特別な演出が表示されます。

## 🎨 画像素材について

### 使用している素材

- **キャラクターアイコン**: とりあか様 ([@ft_toriaka](https://twitter.com/ft_toriaka)) の素材を使用
- **システム画像**: オリジナル

### 画像フォルダ構成

- `images/icon/`: ○×のアイコン（`maru.png`, `batu.png`）
- `images/system/`: システム画像（数字0-9.png, title.png, result.png, perfect.png）
- `images/sf6icon_a/`, `images/sf6icon_b/`: キャラクターアイコン

## 🛠️ 技術仕様

### 使用技術

- HTML5
- CSS3（フレックスボックス、CSS アニメーション）
- Vanilla JavaScript（フレームワーク不使用）

### 対応ブラウザ

- Chrome（推奨）
- Firefox
- Safari
- Edge

モバイルブラウザにも対応しています。

## 免責事項

### 非公式性について

本プロジェクトは、個人による非公式のファン活動であり、株式会社カプコンおよび『ストリートファイター6』公式とは一切関係ありません。

### 著作権および素材について

本ツールで使用しているキャラクター画像素材は、とりあか様 (@ft_toriaka) が制作・配布されている二次創作イラストを使用させていただいております。
素材の著作権は制作者様に帰属します。本ツール以外での素材の再配布や二次利用はご遠慮ください。

### 無保証について

本ツールの利用によって生じた不具合や損害、および作成された画像の投稿によるトラブル等について、制作者は一切の責任を負いかねます。あらかじめご了承ください。
