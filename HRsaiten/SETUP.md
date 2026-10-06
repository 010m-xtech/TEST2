# 共有ランキングの準備(Firebase・無料)

同じQRコードから遊んだ人の記録を、全員で同じランキングに並べるための準備です。
Googleの無料サービス「Firebase」の中にある「Firestore」をデータの置き場所に使います。
最初に1回だけ、20分ほどの作業です。料金はかかりません(無料の Spark プランのまま)。

## 1. Firebase のプロジェクトを作る

1. パソコンで https://console.firebase.google.com を開き、お店のGoogleアカウントでログインします。
2. 「プロジェクトを作成」を押し、名前を入れます(例: `happyring`)。
3. Gemini と Googleアナリティクスは「オフ」で大丈夫です。「プロジェクトを作成」を押します。
4. 料金プランは **Spark(無料)** のままにします。クレジットカードは登録しません。

## 2. データの置き場所(Firestore)を作る

1. 左のメニューの「Database と Storage」(または「構築」)→「Firestore」を開き、「データベースを作成」を押します。
2. 場所は `asia-northeast1 (Tokyo)` を選びます(後から変えられません)。
3. 「本番環境モード」を選んで作成します。

## 3. 書き込みのルールを貼る

Firestore の画面の上にある「ルール」タブを開き、中身をすべて消して、下の内容を貼り付けて「公開」を押します。

このルールでできること:
- QRコードやURLからページを開いた人が、ランキングに記録できる
- 記録した本人(同じスマホ)だけが、自分の記録を消せる。他人の記録は書き換えも削除もできない
- 感想は `private` に残り、ページからは誰も読めない(Firebase の画面と、のちのスプレッドシート連携でだけ見られる)
- おかしな形のデータ、大きすぎるデータ、時刻をごまかしたデータは断る

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function d() { return request.resource.data; }

    // ランキング(誰でも見られる)
    match /scores/{id} {
      allow read: if true;
      allow create: if signedIn()
        && d().keys().hasOnly(['name','score','rings','scores','createdAt','hash','day','month','uid'])
        && d().keys().hasAll(['name','score','rings','createdAt','day','month','uid'])
        && d().uid == request.auth.uid
        && existsAfter(/databases/$(database)/documents/private/$(id))
        && d().name is string && d().name.size() >= 1 && d().name.size() <= 12
        && d().score is int && d().score >= 0 && d().score <= 100
        && d().rings is int && d().rings >= 0 && d().rings <= 30
        && (!('scores' in d()) || (d().scores is map && d().scores.size() <= 4))
        && (!('hash' in d()) || (d().hash is string && d().hash.size() <= 64))
        && d().createdAt is int
        && d().createdAt <= request.time.toMillis() + 300000
        && d().createdAt >= request.time.toMillis() - 21600000
        && d().day is string && d().day.size() == 10
        && d().month is string && d().month.size() == 7;
      allow delete: if signedIn() && resource.data.uid == request.auth.uid;
      allow update: if false;
    }

    // お店だけが見る控え(感想)。ページからは読めない・消せない
    match /private/{id} {
      allow create: if signedIn()
        && d().keys().hasOnly(['memo','name','score','createdAt','uid'])
        && d().uid == request.auth.uid
        && d().memo is string && d().memo.size() <= 10
        && d().name is string && d().name.size() <= 12
        && d().score is int && d().createdAt is int;
      allow read, update, delete: if false;
    }

    // ランキングの小さな写真
    match /thumbs/{id} {
      allow read: if true;
      allow create: if signedIn()
        && d().keys().hasOnly(['img','uid'])
        && d().uid == request.auth.uid
        && d().img is string && d().img.size() < 40000
        && d().img.matches('^data:image/jpeg;base64,[A-Za-z0-9+/=]+$')
        && get(/databases/$(database)/documents/scores/$(id)).data.uid == request.auth.uid;
      allow delete: if signedIn() && resource.data.uid == request.auth.uid;
      allow update: if false;
    }
  }
}
```

## 3-2. 匿名ログインをオンにする

「記録した本人だけが消せる」ために、スマホごとに目に見えない番号を配ります(名前もパスワードも不要)。

1. 左のメニューの「セキュリティ」→「Authentication」を開き、「始める」を押します。
2. 「ログイン方法」タブで **「匿名」** を選び、「有効にする」をオンにして「保存」を押します。

## 4. アプリの設定をコピーする

1. プロジェクトの最初の画面(「プロジェクトの概要」)で、プロジェクト名の下にある **「+ アプリを追加」** を押します。
   (左上の「プロジェクトの概要」の横の **歯車** →「プロジェクトの設定」→ 下の「マイアプリ」からでも同じです)
2. **`</>`(ウェブ)** のマークを押し、名前(例: `happyring-web`)を入れて「アプリを登録」を押します。
   「Firebase Hosting も設定する」のチェックは不要です。
3. 表示された `const firebaseConfig = { ... };` の `{` から `}` までをコピーします。

## 5. index.html に貼る

`HRsaiten/index.html` の中にある次の行を探します。

```
const FIREBASE_CONFIG = null;
```

`null` の部分を、コピーした `{ ... }` に置き換えて保存し、GitHubに上げます。

```
const FIREBASE_CONFIG = { apiKey: "AIza...", authDomain: "happyring-xxxx.firebaseapp.com", projectId: "happyring-xxxx", storageBucket: "happyring-xxxx.firebasestorage.app", messagingSenderId: "1234567890", appId: "1:1234567890:web:abcdef" };
```

この設定はパスワードではなく、置き場所の住所のようなものです(Googleも「公開して問題ない」としています)。
守りは手順3のルールと、手順7・8の制限が担当します。

## 6. 初回だけ「インデックス」を作る

1. QRコードのページを開き、ランキング画面を開きます。
2. 「ランキングを読み込めませんでした」と、その下に `https://console.firebase.google.com/...` のリンクが出ます。
3. そのリンクを開き、「インデックスを作成」を押します。
4. 「今日」と「今月」のタブで1回ずつ(合計2回)出ます。どちらも作成してください。
5. 数分待つと、ランキングが表示されるようになります。

リンクが出ないときは、Firestore の「インデックス」タブ →「複合」→「インデックスを作成」で、次の2つを作ります。

| コレクション | フィールド1 | フィールド2 |
|---|---|---|
| `scores` | `day`(昇順) | `score`(降順) |
| `scores` | `month`(昇順) | `score`(降順) |

## 7. 鍵(APIキー)を、お店のページ専用にする(強くおすすめ)

設定の中の `apiKey` を、お店のページ以外からは使えないようにします。

1. https://console.cloud.google.com/apis/credentials を開き、上のプロジェクト選択で Firebase と同じプロジェクトを選びます。
2. 「APIキー」の一覧にある **「Browser key (auto created by Firebase)」** を開きます。
3. **「アプリケーションの制限」** で「ウェブサイト」を選び、次を追加します。
   - `https://010m-xtech.github.io/*`(GitHub Pages のアドレス。違うアドレスで公開している場合はそのアドレス)
4. **「API の制限」** で「キーを制限」を選び、**Cloud Firestore API**・**Identity Toolkit API**・**Token Service API**・**Firebase App Check API** にチェックを入れます(匿名ログインに後ろの3つが必要です)。
5. 「保存」を押します(反映まで数分かかります)。

## 8. App Check で、お店のページ以外からの書き込みを断る(任意・さらに強く)

1. https://www.google.com/recaptcha/admin/create を開き、種類は **reCAPTCHA v3**、ドメインに `010m-xtech.github.io` を入れて作成します。
   「サイトキー」と「シークレットキー」が表示されます。
2. Firebase の左メニュー「セキュリティ」→「App Check」→「アプリ」タブで、ウェブアプリを選び「reCAPTCHA」を登録します。ここに **シークレットキー** を貼ります。
3. `index.html` の `const APPCHECK_SITE_KEY = null;` の `null` を、**サイトキー**(`"6Le..."` のように "" で囲む)に置き換えてGitHubに上げます。
   **シークレットキーは index.html に書かないでください。**
4. 1日ほど遊んでもらって、App Check の画面で「確認済みのリクエスト」が増えていたら、「API」タブの **Cloud Firestore** で「適用」を押します。
   これで、このページ以外からの読み書きは断られるようになります。

## GitHub で「シークレットが見つかりました」と警告が出たとき

GitHub は `AIza` で始まる文字を見つけると、念のため警告を出すことがあります。
Firebase のウェブ用の `apiKey` は、ページに書いて公開する前提のもので、手順3のルールと手順7の制限で守られています。
手順7を済ませたうえで、警告の画面で **「Close as」→「Won't fix」**(または「False positive」)を選んで閉じて大丈夫です。
**サービスアカウントの鍵(JSONファイル)や、reCAPTCHA のシークレットキーは、絶対に GitHub に上げないでください。**

## お店のQRコードを作る

ページのアドレス(例: `https://010m-xtech.github.io/TEST2/HRsaiten/`)を、そのままQRコードにします。

## 知っておいてほしいこと

- **無料枠**: 1日あたり読み込み5万回・書き込み2万回まで無料です。1日に数百人が遊ぶくらいなら十分に収まります。
  Spark(無料)プランのままなら、枠を超えても請求は来ません(その日は止まるだけです)。
- **「今日」の区切り**: 朝5時で切り替わります。閉店が日付をまたいでも、その晩は同じ「今日」です。
- **記録を消したいとき**: 記録した本人は、同じスマホのランキング画面の「自分の記録を消す」で消せます。お店が消すときは、Firebase の画面の「Firestore」→「データ」→ `scores` から削除してください(感想の控え `private` は残ります)。
- **点数のごまかし**: 採点はお客さんのスマホの中で行うため、詳しい人がその気になれば、うその点数を送ることはできてしまいます。気になる記録は上の方法で消してください。
- **GitHub リポジトリを触れる人**: リポジトリの「Settings」→「Collaborators」に載っている人だけが書き換えられます。知らない人が入っていないか、ときどき確認してください。
