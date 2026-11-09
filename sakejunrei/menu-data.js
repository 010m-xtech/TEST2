// =============================================================
//  今日のお品書き（menu.html）のデータ
//  入れ替えのときは、このファイルの TODAY_MENU だけを書き換えます。
//  ・出さないお酒は  soldOut: true  にするか、行ごと消す
//  ・残りわずかは    fewLeft: true
// =============================================================

const MENU_CONFIG = {
  storeName: "かごや",
  title: "今日のお品書き",
  // お品書きの種類タブ（この順に並びます）。お酒の category と同じ名前にします
  categories: ["日本酒", "ワイン"]
};

// ---- 銘柄 ----------------------------------------------------
//   taste    : 味わいの六角形チャート（taste-chart.js の6項目を 0〜100、50 がふつう）
//                aroma 香り / sweetness 甘み / acidity 酸味 / body コク / bitterness 苦味 / umami 旨み
//              ここから自動で決まるもの
//                ・甘・旨・辛の丸印 … 甘み 60以上 → 甘、40以下 → 辛、そのあいだ → 旨
//                  （お店の判断で変えたいときだけ  type: "辛"  のように書きます）
//                ・「甘口／辛口」「すっきり／重め」の絞り込み … 甘み・コクの値
//                ・好み診断のおすすめと相性（％） … 6項目すべて
//                ・「これが好きなら、こちらも」… 六角形の形が近いお酒
//   category : お品書きの種類（MENU_CONFIG.categories のどれか）
//   prefecture : 産地（県名。海外のお酒は国名）
//   comment  : お店のひとこと（手書きボードの文）
//   special  : true にすると「限定・おすすめ」の枠に大きく出ます
//   tags     : 「夏限定」「飲食店限定」など自由に
//   image    : 瓶の写真（省略できます）。例）"images/enasan.webp"
//              白い背景の写真がきれいになじみます（背景を切り抜かなくてOK）
//              瓶が写真のまん中にないときは imagePosition: "60% 50%" のように左右・上下の位置を指定
//              写真がないときは、images/ の瓶の写真（sake-green など）にラベルを重ねて、名前を書いて見せます
//   color    : 写真がないときの瓶の色
//                日本酒 … "green"（緑の瓶） / "brown"（茶色の瓶）
//                ワイン … "red"（赤ワイン） / "white"（白・泡） / "rose"（ロゼ）
//   label    : 写真がないときのラベルの紙の色（#RRGGBB。省略すると生成り色）
//   kana     : 読み。日本酒はひらがな、ワインはカタカナで（ワインのラベルと一覧に出ます）
// ※ 「要確認」と書いた銘柄は、写真が小さく読み取りきれなかったものです。
// ※ taste の数値は、メニューの説明文からの仮の値です。お店のチャートに合わせて直してください。
const TODAY_MENU = [
  // ===== かごやの限定日本酒（2枚目の写真） =====
  {
    category: "日本酒",
    id: "im-sake-rock", special: true,
    name: "アイ ム サケ ロック", kana: "あいむさけろっく",
    grade: "山廃純米原酒", maker: "", prefecture: "",          // 要確認：つくり手・産地
    taste: { aroma: 30, sweetness: 25, acidity: 65, body: 80, bitterness: 30, umami: 85 },
    comment: "濃い目の味わいを前面に出した辛口原酒。氷を浮かべてロックで。",
    tags: ["ロック推し"], color: "brown", label: "#1F3A5F"
  },
  {
    category: "日本酒",
    id: "jokigen-summer", special: true,
    name: "上喜元", kana: "じょうきげん",
    grade: "純米吟醸 フォーシーズン夏", maker: "酒田酒造", prefecture: "山形",
    taste: { aroma: 65, sweetness: 55, acidity: 50, body: 35, bitterness: 15, umami: 50 },
    comment: "爽やかな香り、ほんの少しきれいな甘み。軽快な味わいが特長。",
    tags: ["夏限定"], color: "green", label: "#F2C230"
  },
  {
    category: "日本酒",
    id: "nifudazake", special: true,
    name: "荷札酒", kana: "にふだざけ",
    grade: "純米大吟醸 越淡麗", maker: "加茂錦酒造", prefecture: "新潟",
    taste: { aroma: 55, sweetness: 50, acidity: 40, body: 40, bitterness: 15, umami: 65 },
    comment: "柔らかい口当たりと米の豊かな旨み。食事の邪魔をしないスッキリとした後味。",
    tags: [], color: "green", label: "#FFFFFF"
  },
  {
    category: "日本酒",
    id: "kudokijozu-gokutsubushi", special: true,
    name: "くどき上手", kana: "くどきじょうず",
    grade: "純米大吟醸 穀潰し", maker: "亀の井酒造", prefecture: "山形",
    taste: { aroma: 90, sweetness: 70, acidity: 35, body: 45, bitterness: 10, umami: 55 },
    comment: "酒米を限界まで磨き上げた、華やかな香りと優しい旨みを持つ贅沢な純米大吟醸酒。",
    specs: ["日本酒度 −5", "酸度 1.3"],
    tags: ["贅沢な1杯"], color: "brown", label: "#FFFFFF"
  },

  // ===== 手書きボードの銘柄（4枚目の写真） =====
  {
    category: "日本酒",
    id: "sake-enasan", name: "恵那山", kana: "えなさん", grade: "純米吟醸",
    maker: "はざま酒造", prefecture: "岐阜",
    taste: { aroma: 65, sweetness: 55, acidity: 40, body: 40, bitterness: 15, umami: 60 },
    comment: "洋梨のような穏やかな吟醸香。米の甘みと、中津川の清流のような軽やかな余韻。",
    specs: ["山田錦", "精米歩合 50％", "IWC 受賞"],
    tags: ["写真あり"], image: "images/恵那山①.webp", imagePosition: "54% 50%", color: "green", label: "#3D5A2A"
  },
  {
    category: "日本酒",
    id: "ohmine-summer", name: "大嶺 3粒", kana: "おおみね", grade: "夏ver.",
    maker: "大嶺酒造", prefecture: "山口",
    taste: { aroma: 75, sweetness: 70, acidity: 60, body: 30, bitterness: 15, umami: 40 },
    comment: "果実のような香り。ぐびぐび飲める夏のお酒。",
    tags: ["夏限定"], color: "green", label: "#E8E3D8"
  },
  {
    category: "日本酒",
    id: "kinoene", name: "甲子", kana: "きのえね", grade: "",
    maker: "飯沼本家", prefecture: "千葉",
    taste: { aroma: 70, sweetness: 65, acidity: 45, body: 40, bitterness: 20, umami: 55 },
    comment: "バナナのような香りと甘み。キレもあって飲みやすい。",
    tags: [], color: "green", label: "#2B2B2B"
  },
  {
    category: "日本酒",
    id: "yamagata-karakuchi", name: "山形の超辛口", kana: "", grade: "（銘柄 要確認）",
    maker: "", prefecture: "山形",
    taste: { aroma: 35, sweetness: 10, acidity: 50, body: 45, bitterness: 35, umami: 45 },
    comment: "キレッキレの超辛口。",
    tags: [], color: "green", label: "#F4EFE4"
  },
  {
    category: "日本酒",
    id: "fukushima-amakuchi", name: "（銘柄 要確認）", kana: "", grade: "",
    maker: "", prefecture: "福島",
    taste: { aroma: 50, sweetness: 65, acidity: 40, body: 50, bitterness: 20, umami: 65 },
    comment: "まろやかな甘みとやさしい香り。",
    tags: [], color: "brown", label: "#F4EFE4"
  },
  {
    category: "日本酒",
    id: "manrei", name: "万齢", kana: "まんれい", grade: "",
    maker: "小松酒造", prefecture: "佐賀",
    taste: { aroma: 35, sweetness: 25, acidity: 55, body: 55, bitterness: 30, umami: 70 },
    comment: "超辛口なのにしっかり旨い。キレのある1杯。",
    tags: [], color: "green", label: "#F4EFE4"
  },
  {
    category: "日本酒",
    id: "utashiro", name: "雅楽代", kana: "うたしろ", grade: "",
    maker: "天領盃酒造", prefecture: "新潟",
    taste: { aroma: 60, sweetness: 65, acidity: 55, body: 35, bitterness: 15, umami: 50 },
    comment: "やさしい甘みで、すいすい飲める。",
    tags: [], color: "green", label: "#FFFFFF"
  },
  {
    category: "日本酒",
    id: "zaku-waetsu", name: "作 和悦", kana: "ざく わえつ", grade: "",
    maker: "清水清三郎商店", prefecture: "三重",
    taste: { aroma: 55, sweetness: 50, acidity: 45, body: 45, bitterness: 20, umami: 60 },
    comment: "みずみずしくて、すっきり旨い。",
    tags: ["飲食店限定"], color: "green", label: "#FFFFFF"
  },
  {
    category: "日本酒",
    id: "hakurakusei", name: "伯楽星", kana: "はくらくせい", grade: "",
    maker: "新澤醸造店", prefecture: "宮城",
    taste: { aroma: 40, sweetness: 30, acidity: 45, body: 30, bitterness: 25, umami: 50 },
    comment: "キレが良くて、揚げ物・刺身・魚料理に合う究極の食中酒。",
    tags: ["食中酒"], color: "green", label: "#FFFFFF"
  },
  {
    category: "日本酒",
    id: "natsu-doburokku", name: "夏どぶろっく", kana: "なつどぶろっく", grade: "どぶろく",
    maker: "", prefecture: "",                                   // 要確認
    taste: { aroma: 40, sweetness: 80, acidity: 70, body: 85, bitterness: 10, umami: 70 },
    comment: "シュワっと夏のどぶろく。乳酸のやさしい甘酸っぱさ。",
    tags: ["夏限定", "にごり"], color: "green", label: "#E05A47"
  },
  {
    category: "日本酒",
    id: "aomori", name: "（銘柄 要確認）", kana: "", grade: "",
    maker: "", prefecture: "青森",
    taste: { aroma: 55, sweetness: 60, acidity: 45, body: 45, bitterness: 20, umami: 55 },
    comment: "みずみずしくて、おいしい。",
    tags: [], color: "green", label: "#F4EFE4"
  },
  {
    category: "日本酒",
    id: "oze-no-yukidoke", name: "尾瀬の雪どけ", kana: "おぜのゆきどけ", grade: "純米大吟醸",
    maker: "龍神酒造", prefecture: "群馬",
    taste: { aroma: 75, sweetness: 55, acidity: 45, body: 40, bitterness: 15, umami: 55 },
    comment: "フルーティー！ 香りも旨みもバランスよく。",
    tags: [], color: "green", label: "#FFFFFF"
  },
  {
    category: "日本酒",
    id: "takachiyo", name: "たかちよ", kana: "たかちよ", grade: "",
    maker: "高千代酒造", prefecture: "新潟",
    taste: { aroma: 65, sweetness: 70, acidity: 45, body: 50, bitterness: 25, umami: 65 },
    comment: "大葉のような香りが心地よい甘み。じゅわっと広がる。",
    tags: [], color: "brown", label: "#E9DFC8"
  },

  // ===== ワイン（診断アプリ drinks.js と同じ2本） =====
  {
    category: "ワイン",
    id: "wine-red", name: "シャトー・メルシャン", kana: "シャトー・メルシャン",
    grade: "桔梗ヶ原メルロー（赤）", maker: "メルシャン", prefecture: "長野",
    taste: { aroma: 75, sweetness: 20, acidity: 50, body: 80, bitterness: 65, umami: 60 },
    comment: "カシスやダークチェリーの香りに、樽由来のバニラ。しっかりしたタンニンなのに、口当たりはなめらか。",
    tags: ["フルボディ"], color: "red", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-white", name: "グレイス 甲州", kana: "グレイス・コウシュウ",
    grade: "鳥居平畑（白）", maker: "中央葡萄酒", prefecture: "山梨",
    taste: { aroma: 65, sweetness: 15, acidity: 55, body: 45, bitterness: 25, umami: 35 },
    comment: "すだちやカボスのような清々しい香り。伸びやかな酸味で、和食にぴったり。",
    tags: ["和食に合う"], color: "white", label: "#F6F1E6"
  },

  // ===== デモ用のワイン（銘柄名は一般的な呼び名。お店のワインに差し替えてください） =====
  {
    category: "ワイン",
    id: "wine-sparkling", name: "カヴァ ブリュット", kana: "カヴァ・ブリュット", grade: "スパークリング（白）",
    maker: "", prefecture: "スペイン",
    taste: { aroma: 55, sweetness: 25, acidity: 70, body: 25, bitterness: 20, umami: 25 },
    comment: "きめ細かい泡と、青りんごのような爽やかさ。乾杯の1杯にどうぞ。",
    tags: ["泡", "乾杯に"], color: "white", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-chablis", name: "シャブリ", kana: "シャブリ", grade: "白・辛口",
    maker: "", prefecture: "フランス",
    taste: { aroma: 45, sweetness: 15, acidity: 75, body: 35, bitterness: 25, umami: 40 },
    comment: "石のようなミネラル感と、キリッとした酸。牡蠣やお刺身と好相性。",
    tags: ["白", "魚介に"], color: "white", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-sauvignon", name: "ソーヴィニヨン・ブラン", kana: "ソーヴィニヨン・ブラン", grade: "白・辛口",
    maker: "", prefecture: "ニュージーランド",
    taste: { aroma: 85, sweetness: 25, acidity: 70, body: 35, bitterness: 25, umami: 25 },
    comment: "パッションフルーツやハーブの弾ける香り。サラダや天ぷらに。",
    tags: ["白", "香り華やか"], color: "white", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-riesling", name: "リースリング", kana: "リースリング", grade: "白・やや甘口",
    maker: "", prefecture: "ドイツ",
    taste: { aroma: 75, sweetness: 65, acidity: 70, body: 30, bitterness: 10, umami: 25 },
    comment: "白桃や蜂蜜のやさしい甘みを、きれいな酸が引き締める。ワインが初めての方にも。",
    tags: ["白", "甘口"], color: "white", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-rose", name: "プロヴァンス ロゼ", kana: "プロヴァンス・ロゼ", grade: "ロゼ・辛口",
    maker: "", prefecture: "フランス",
    taste: { aroma: 60, sweetness: 30, acidity: 60, body: 35, bitterness: 15, umami: 35 },
    comment: "いちごや柑橘の軽やかな香り。和食にも洋食にも合わせやすい万能選手。",
    tags: ["ロゼ"], color: "rose", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-pinot", name: "ピノ・ノワール", kana: "ピノ・ノワール", grade: "赤・ミディアム",
    maker: "", prefecture: "フランス",
    taste: { aroma: 70, sweetness: 25, acidity: 60, body: 45, bitterness: 35, umami: 55 },
    comment: "ラズベリーやすみれの香り。渋みはおだやかで、焼き鳥（タレ）にも。",
    tags: ["赤", "軽めの赤"], color: "red", label: "#F6F1E6"
  },
  {
    category: "ワイン",
    id: "wine-cabernet", name: "カベルネ・ソーヴィニヨン", kana: "カベルネ・ソーヴィニヨン", grade: "赤・フルボディ",
    maker: "", prefecture: "チリ",
    taste: { aroma: 65, sweetness: 25, acidity: 45, body: 85, bitterness: 75, umami: 55 },
    comment: "カシスと樽のバニラ、しっかりした渋み。お肉料理と一緒にどっしりと。",
    tags: ["赤", "お肉に"], color: "red", label: "#F6F1E6"
  }
];
