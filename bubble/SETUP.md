# BUBBLE 思い出メーター 設定まとめ

どこに・何を貼る／設定するかの一覧です。上から順に進めれば動きます。

| # | 場所 | やること | 使うファイル |
|---|---|---|---|
| 1 | GitHub | `bubble/` フォルダにファイルを置く | `index.html` ほか |
| 2 | Firebase | 匿名ログインをオン・ルールを貼る・TTL を設定 | `firestore.rules` |
| 3 | Google ドライブ | 写真の保存先フォルダ（作成済み） | — |
| 4 | Google スプレッドシート | Apps Script を貼ってウェブアプリとして公開 | `sheet-apps-script.gs` |
| 5 | GitHub（もう一度） | `index.html` に Apps Script の URL を貼る | `index.html` |
| 6 | 動作確認 | テスト投稿・演出の確認 | — |

---

## 1. GitHub（`010m-xtech/TEST2` の `bubble/` フォルダ）

| ファイル | 中身 | 必須？ |
|---|---|---|
| `index.html` | アプリ本体（最新版で上書き） | 必須 |
| `haikei.mp4` | 背景動画（今あるものをそのまま） | 必須 |
| `firestore.rules` | Firebase のルール（控え。Firebase 側に貼るもの） | 控え |
| `sheet-apps-script.gs` | スプレッドシート用コード（控え。Apps Script 側に貼るもの） | 控え |
| `SETUP.md` | この設定まとめ | 控え |
| `intro1.mp4` `intro2.mp4` `intro3.mp4` | オープニング3枠の実写動画（縦向き・2〜3秒・音なし） | 任意。置くと自動で差し替わる |

アップロード方法：GitHub で `bubble` フォルダを開く →「Add file」→「Upload files」→ ファイルをドラッグ →「Commit changes」。

---

## 2. Firebase（プロジェクト `beer-94458`）

### 2-1. 匿名ログインをオンにする
Firebase コンソール →「Authentication」→「Sign-in method」→「匿名」を **有効** にして保存。
（お客さんは名前もメールも入力せずに参加できます。オフだと写真が保存されません）

### 2-2. セキュリティルールを貼る
「Firestore Database」→「ルール」タブ → 中身を下のコードに置き換えて「公開」。

> ⚠️ 同じ Firebase プロジェクトを他のアプリ（ほかのフォルダのページ）でも使っている場合は、
> 丸ごと置き換えると他のアプリが動かなくなることがあります。その場合は既存のルールを消さずに、
> `match /artifacts/...` の3ブロックだけを既存の `match /databases/{database}/documents { }` の中に追加してください。

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // メーターの状態（今何枚か・何発目か・演出の種類・乾杯数）
    match /artifacts/{appId}/public/data/meter/state {
      allow read, write: if request.auth != null;
    }

    // お客さんの写真と一言（演出が終わると消える）
    match /artifacts/{appId}/public/data/memories/{memoryId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.img is string
        && request.resource.data.img.size() < 900000
        && request.resource.data.caption is string
        && request.resource.data.caption.size() <= 10;
      allow update: if false;
      allow delete: if request.auth != null;
    }

    // 旧バージョンの写真（自動で片付けるために読み取り・削除だけ許可）
    match /artifacts/{appId}/public/data/bubbles/{bubbleId} {
      allow read, delete: if request.auth != null;
    }
  }
}
```

### 2-3. TTL（消し忘れ防止の自動削除）を設定する

> ⚠️ **TTL は課金を有効にしたプロジェクト（Blaze プラン）でしか使えません。**
> 無料プランのままだと「403: Project beer-94458 has billing disabled」と出ます。
> **無料プランなら、この 2-3 は飛ばして OK** です（演出後の削除・放置時の片付けはアプリ側で行います）。
> 使う場合は Firebase コンソール左下「アップグレード」→ Blaze に切り替え、予算アラート（例：月500円）も設定してください。
TTL は Firebase の画面ではなく **Google Cloud コンソール** で設定します。
1. Firestore の画面上部「Google Cloud のその他の機能」→ Google Cloud コンソールで開く
   （直接開く場合：https://console.cloud.google.com/firestore/databases/-default-/ttl?project=beer-94458 ）
2. 左メニューの「TTL（有効期間）」を開く →「ポリシーを作成」
   - コレクション グループ：`memories`
   - タイムスタンプ フィールド：`expireAt`
3. 「作成」。状態が「処理中」→「有効」になれば完了（数分かかることがあります）

データがまだ空でも、先にポリシーを作っておけます。

→ 作成。投稿から3時間を過ぎた写真が、Firebase 側で自動削除されます（削除は期限後、多くの場合1日以内）。
演出直後の削除はアプリが行うので、こちらは保険です。

---

## 3. Google ドライブ
写真の保存先：**マイドライブ ＞ BUBBLE写真**（作成済み・設定済み）
- フォルダID：`1g8FXyKlrWO18LmPwES98w_t5KDB8AXMH`
- 同じ名前のフォルダは1つだけにしておく（ID が合わない時は名前で探すため）

---

## 4. Google スプレッドシート（Apps Script）

1. 記録用のスプレッドシートを新しく作る（名前は自由。例：「BUBBLE 思い出記録」）
2. 「拡張機能」→「Apps Script」→ 最初からある `function myFunction() {}` を消して、
   **`sheet-apps-script.gs` の中身を丸ごと** 貼り付けて 💾 保存
3. 関数選択で `checkFolder` →「▶ 実行」→ 許可画面で「詳細」→「（安全ではないページ）に移動」→「許可」
   → 実行ログに「写真の保存先: BUBBLE写真」と出れば OK
4. `testInsert` を実行 →「思い出」シートに行が1つ増えれば OK（確認後、その行とテスト画像は削除して大丈夫）
5. 右上「デプロイ」→「新しいデプロイ」→ ⚙ で「ウェブアプリ」
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員**
   →「デプロイ」→ 表示された **ウェブアプリの URL**（`https://script.google.com/macros/s/…/exec`）をコピー

> コードを後で直したときは「デプロイ」→「デプロイを管理」→ 鉛筆 →「バージョン：新しいバージョン」→「デプロイ」。
> URL は変わりません。

---

## 5. GitHub（もう一度）：index.html に URL を貼る
`index.html` の中で `SHEET_WEBHOOK_URL` を検索し、4-5 でコピーした URL を貼る。

```javascript
// 変更前
const SHEET_WEBHOOK_URL = '';

// 変更後
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/ここにコピーしたID/exec';
```

すぐ下の `SHEET_SECRET = 'kanpai-memories'` は Apps Script の `SECRET` と同じなので、そのままで OK。
（変える場合は両方を同じ文字に）

GitHub で `bubble/index.html` を開く → 鉛筆マーク（Edit）で直接書き換えて「Commit changes」でも OK。

---

## 6. 動作確認
1. スマホで QR（ページの URL）を開く → オープニング3枠 → トップ画面
2. 「思い出を撮ってメーターに溜める」で1枚投稿
   - メーターが 1/5 になる
   - スプレッドシートに1行増え、BUBBLE写真フォルダに写真が1枚入る
3. 演出の確認だけしたいとき（スタッフ用）：URL の最後に付けると演出が固定されます
   - `?show=willow` … 黄金の大輪しだれ柳
   - `?show=beer` … ビア・フォール
   - `?show=rainbow` … 虹のスターマイン
   - `?season=spring|summer|autumn|winter` … 季節を固定（普段は月で自動：3〜5月 春・6〜8月 夏・9〜11月 秋・12〜2月 冬）
   - 2つ同時に付けるときは `?show=willow&season=winter` のように `&` でつなぐ
4. 5枚投稿 → 王冠ポン → 演出 → 終了後、Firestore の `memories` が空になることを確認

---

## 保存されるもの・場所（まとめ）

| 場所 | 中身 | 消える？ |
|---|---|---|
| Firestore `…/memories` | 写真・一言（演出用） | 演出終了で即削除／保険で3時間後に TTL 削除 |
| Firestore `…/meter/state` | メーターの数字・演出の種類・乾杯数 | 1件を上書き（消えない・軽い） |
| スプレッドシート「思い出」シート | 日時・一言・写真（小）・保存先リンク・何発目 | 消えない |
| ドライブ「BUBBLE写真」 | 写真の元データ（加工後） | 消えない |
