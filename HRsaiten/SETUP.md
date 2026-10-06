# 共有ランキングの準備(Firebase・無料)

同じQRコードから遊んだ人の記録を、全員で同じランキングに並べるための準備です。
Googleの無料サービス「Firebase」の中にある「Firestore」をデータの置き場所に使います。
最初に1回だけ、15分ほどの作業です。料金はかかりません(無料枠の範囲)。

## 1. Firebase のプロジェクトを作る

1. パソコンで https://console.firebase.google.com を開き、お店のGoogleアカウントでログインします。
2. 「プロジェクトを作成」を押し、名前を入れます(例: `happyring`)。
3. Googleアナリティクスは「オフ」で大丈夫です。「プロジェクトを作成」を押します。

## 2. データの置き場所(Firestore)を作る

1. 左のメニューの「構築」→「Firestore Database」を開き、「データベースを作成」を押します。
2. 場所は `asia-northeast1 (東京)` を選びます。
3. 「本番環境モード」を選んで作成します。

## 3. 書き込みのルールを貼る

Firestore の画面の上にある「ルール」タブを開き、中身をすべて消して、下の内容を貼り付けて「公開」を押します。
このルールで、記録の追加と閲覧だけができ、他人の記録を書き換えたり消したりはできなくなります。

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name','memo','score','rings','scores','comment','createdAt','hash','day','month'])
        && request.resource.data.name is string && request.resource.data.name.size() <= 12
        && (!('memo' in request.resource.data) || (request.resource.data.memo is string && request.resource.data.memo.size() <= 10))
        && request.resource.data.score is int && request.resource.data.score >= 0 && request.resource.data.score <= 100
        && request.resource.data.rings is int && request.resource.data.rings >= 0 && request.resource.data.rings <= 30
        && request.resource.data.createdAt is int
        && request.resource.data.day is string && request.resource.data.day.size() == 10
        && request.resource.data.month is string && request.resource.data.month.size() == 7;
      allow update, delete: if false;
    }
    match /thumbs/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['img'])
        && request.resource.data.img is string && request.resource.data.img.size() < 40000
        && exists(/databases/$(database)/documents/scores/$(id));
      allow update, delete: if false;
    }
  }
}
```

## 4. アプリの設定をコピーする

1. 左上の歯車 →「プロジェクトの設定」を開きます。
2. 下の「マイアプリ」で `</>`(ウェブ)のマークを押し、名前(例: `happyring-web`)を入れて「アプリを登録」を押します。
   「Firebase Hosting」のチェックは不要です。
3. 表示された `const firebaseConfig = { ... };` の `{` から `}` までをコピーします。

## 5. index.html に貼る

`HRsaiten/index.html` の中にある次の行を探します。

```
const FIREBASE_CONFIG = null;
```

`null` の部分を、コピーした `{ ... }` に置き換えて保存し、GitHubに上げます。

```
const FIREBASE_CONFIG = { apiKey: "AIza...", authDomain: "happyring-xxxx.firebaseapp.com", projectId: "happyring-xxxx", storageBucket: "happyring-xxxx.appspot.com", messagingSenderId: "1234567890", appId: "1:1234567890:web:abcdef" };
```

この設定はページに書いても問題ありません(パスワードではなく、置き場所の住所のようなものです)。守りは手順3のルールが担当します。

## 6. 初回だけ「インデックス」を作る

1. QRコードのページを開き、ランキング画面を開きます。
2. 「ランキングを読み込めませんでした」と、その下に `https://console.firebase.google.com/...` のリンクが出ます。
3. そのリンクを開き、「インデックスを作成」を押します。
4. 「今日」と「今月」のタブで1回ずつ(合計2回)出ます。どちらも作成してください。
5. 数分待つと、ランキングが表示されるようになります。

## 知っておいてほしいこと

- **無料枠**: 1日あたり読み込み5万回・書き込み2万回まで無料です。1日に数百人が遊ぶくらいなら十分に収まります。
- **「今日」の区切り**: 朝5時で切り替わります。閉店が日付をまたいでも、その晩は同じ「今日」です。
- **記録を消したいとき**: アプリからは消せません(いたずら防止のため)。Firebase の画面の「Firestore Database」→「データ」→ `scores` から、消したい記録を選んで削除してください。
- **点数のごまかし**: 採点はお客さんのスマホの中で行うため、詳しい人がその気になれば、うその点数を送ることはできてしまいます。気になる記録は上の方法で消してください。
