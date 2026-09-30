// =============================================================
//  お店ごとの設定と銘柄データ
//  別のお店で使うときは、このファイルだけを書き換えてください。
// =============================================================

// ---- お店の設定 ----------------------------------------------
const STORE_CONFIG = {
  // ブラウザのタブに出るタイトル
  pageTitle: "味覚マップ & テロワールストーリー",
  // 画面上部のアプリ名とサブタイトル
  appTitle: "あなたの味覚MAP",
  appSubtitle: "〜味覚を巡る1杯〜",
  // 差し色（ボタン・強調・地図の目的地など）。#RRGGBB で指定
  accentColor: "#1F6B4F",
  // 旅の演出の出発地（お店の場所の緯度・経度）
  tripOrigin: { label: "現在地", lat: 35.681, lon: 139.767 }
};

// ---- 銘柄データ ----------------------------------------------
// 【項目の説明】
//   id          : 半角英数字の重複しない名前
//   category    : お酒の種類（日本酒 / ビール / ジン / ワイン など）
//   name        : 銘柄名
//   maker       : つくり手（酒蔵・醸造所・蒸溜所・ワイナリー）
//   origin      : 産地
//       国内のお酒 → { country: "日本", prefecture: "岐阜県", area: "中津川市", lat: 緯度, lon: 経度 }
//                    （prefecture は地図で光らせる県。lat / lon は飛行機の行き先）
//       海外のお酒 → { country: "フランス", area: "ボルドー", lat: 44.84, lon: -0.58 }
//                    （飛行機が日本から飛び立ち、途中で到着カードに切り替わります。
//                      lat / lon は飛んでいく方角に使います。省略すると西北西の方角へ飛びます）
//   taste       : 味わい。5つの要素を 0〜100 で書きます（50 がふつう）
//                   aroma      香りの華やかさ（0 = 控えめ・澄んだ香り ／ 100 = 華やか）
//                   body       コク・濃厚さ  （0 = 軽やか ／ 100 = 濃厚）
//                   sweetness  甘み          （0 = ドライ ／ 100 = 甘い）
//                   acidity    酸味          （0 = まろやか ／ 100 = 酸味が強い）
//                   bitterness 苦味・渋み    （0 = ほとんどない ／ 100 = しっかり）
//                 味覚マップの位置（横 = body、縦 = aroma）と、診断の相性（%）はここから計算されます。
//   description : 説明文。段落ごとに "" で区切って並べます（改行は \n）
//   awards      : 受賞歴（なければ [] か省略）
//   specs       : スペック。{ label: "項目名", value: "内容" } を並べます（なければ [] か省略）
//                 例）日本酒：精米歩合 ／ ビール：スタイル・IBU ／ ジン：ボタニカル ／ ワイン：品種・ヴィンテージ
//   images      : 商品画像（省略できます）
//                 省略すると images フォルダの「id と同じ名前の画像」を自動で使います。
//                   例）id が "sake-enasan" → images/sake-enasan.webp（.jpg / .jpeg / .png でもOK）
//                 複数枚をスライドショーにしたいときだけ ["a.webp", "b.webp"] のように書きます。
//                 1枚目がマップのピンとおすすめカードに使われます。
//   gallery     : 「お酒をめぐる環境」の写真と説明文（省略できます）
//                 { wiki: "馬籠宿" }                … Wikipediaの記事名を書くだけで、写真・説明文・出典を自動表示
//                                                    （記事に写真がなければ Wikimedia Commons で写真を探し、
//                                                      それでもなければ写真の代わりに文字のカードを表示）
//                 { wiki: "恵那山", url: "写真のURL" } … 説明文はWikipedia、写真だけ自分で用意したものを使う
//                 { wiki: "馬籠宿", caption: "…" } … 説明文だけ自分で書く
//                 { url: "写真のURL", caption: "…" } … 自分で用意した写真を使う
//
// ※ 恵那山以外は仮のデータ（画像はUnsplashのイメージ写真）です。
const DRINKS_DATABASE = [
  {
    id: "sake-enasan",
    category: "日本酒",
    name: "恵那山 純米吟醸",
    maker: "はざま酒造",
    origin: { country: "日本", prefecture: "岐阜県", area: "中津川市", lat: 35.487, lon: 137.500 },
    taste: { aroma: 65, body: 30, sweetness: 55, acidity: 40, bitterness: 15 },
    description: [
      "恵那山は穏やかに香るフルーツのような吟醸香。\n口当たりがよく、湧きたつような味わいと米本来の持つ甘みを引き出した中津川の清流を彷彿とさせる軽やかな余韻。味と香りのバランスをお楽しみいただけるお酒です。"
    ],
    awards: ["IWC2016 純米吟醸シルバー", "IWC2018 純米吟醸シルバー", "IWC2019 純米吟醸ブロンズ"],
    specs: [
      { label: "種類", value: "純米吟醸酒 火入れ" },
      { label: "原料米", value: "山田錦" },
      { label: "精米歩合", value: "50％" },
      { label: "アルコール度数", value: "16％" }
    ],
    images: ["恵那山①.webp", "恵那山②.webp", "恵那山③.webp"],
    gallery: [
      { wiki: "恵那山", caption: "恵那山の伏流水を敷地内の井戸から汲み上げて使用。恵那山に降り積もった雨雪が、長い時間をかけて地中に染み込み磨かれてできた水は、日本酒をやわらかい味わいにします。" },
      { wiki: "馬籠宿", caption: "中山道・馬籠宿。石畳が続く歴史ある宿場町は、往時の面影を色濃く残し、訪れる人々をタイムスリップしたかのような気分にさせてくれます。" }
    ]
  },
  {
    id: "gin-roku",
    category: "ジン",
    name: "ROKU GIN (六)",
    maker: "サントリー",
    origin: { country: "日本", prefecture: "大阪府", area: "", lat: 34.693, lon: 135.502 },
    taste: { aroma: 85, body: 25, sweetness: 20, acidity: 50, bitterness: 45 },
    description: [
      "桜花、桜葉、煎茶、玉露、山椒、柚子。日本ならではの6つのボタニカル（植物）を、それぞれ旬の時期に収穫し、別々に蒸溜してブレンドするこだわりの製法。",
      "グラスを傾けると、春の桜の甘い香り、夏の緑茶の清涼感、秋の山椒のスパイシーさ、冬の柚子の爽やかさが、まるで万華鏡のように次々と表情を変えて現れます。日本の自然の豊かさを、一杯のグラスに閉じ込めたようなジンです。"
    ],
    images: [
      "https://images.unsplash.com/photo-1609355655543-9800a75f5bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?w=800&q=80", caption: "最も香りが良くなる「旬」の時期に収穫された素材だけを贅沢に使用しています。" },
      { url: "https://images.unsplash.com/photo-1563514757351-f29e1eb123b3?w=800&q=80", caption: "繊細な日本の職人技が、複雑で調和のとれた香りを作り出します。" }
    ]
  },
  {
    id: "sake-kimoto",
    category: "日本酒",
    name: "大七 純米生酛",
    maker: "大七酒造",
    origin: { country: "日本", prefecture: "福島県", area: "", lat: 37.585, lon: 140.431 },
    taste: { aroma: 30, body: 85, sweetness: 50, acidity: 65, bitterness: 30 },
    description: [
      "江戸時代から続く伝統製法「生酛（きもと）造り」にこだわり抜く大七酒造。自然の乳酸菌の力を借りて、通常の倍以上の時間と手間をかけて酵母を育てます。",
      "その味わいは、一言でいえば「豊潤」。幾重にも重なる奥深いコク、クリーミーな舌触り、そして後から追いかけてくる力強い酸味による鮮やかなキレ。お燗にするとさらに旨味がふくらみ、至福のひとときをもたらします。"
    ],
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      "https://images.unsplash.com/photo-1574621100236-d25089c36209?w=800&q=80",
      "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&q=80"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1574621100236-d25089c36209?w=800&q=80", caption: "空気中の乳酸菌を取り込む、昔ながらの力強い酒造り。" },
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80", caption: "福島の豊かな土壌と気候が、ふくよかな米の旨味を育みます。" }
    ]
  },
  {
    id: "wine-red",
    category: "ワイン",
    name: "シャトー・メルシャン",
    maker: "メルシャン",
    origin: { country: "日本", prefecture: "長野県", area: "", lat: 36.115, lon: 137.953 },
    taste: { aroma: 80, body: 85, sweetness: 25, acidity: 50, bitterness: 70 },
    description: [
      "日本のワイン造りを牽引し続けるシャトー・メルシャン。長野県・桔梗ヶ原をはじめとする冷涼な気候下で育まれた上質なブドウのみを使用しています。",
      "カシスやダークチェリーのような凝縮された黒系果実の香りに、オーク樽由来のバニラやスパイスのニュアンスが溶け込んでいます。しっかりとしたタンニン（渋み）がありながらも、口当たりはビロードのように滑らか。日本ワインのポテンシャルの高さを証明する一本です。"
    ],
    images: [
      "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=800&q=80",
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
      "https://images.unsplash.com/photo-1504675099198-5240aec35728?w=800&q=80"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80", caption: "昼夜の寒暖差が大きい長野の気候が、色の濃い高品質なブドウを育てます。" },
      { url: "https://images.unsplash.com/photo-1523368749929-6b2bf370dbf8?w=800&q=80", caption: "フレンチオーク樽の中で、ワインはゆっくりと複雑な香りをまとっていきます。" }
    ]
  },
  {
    id: "wine-white",
    category: "ワイン",
    name: "甲州 鳥居平畑",
    maker: "中央葡萄酒",
    origin: { country: "日本", prefecture: "山梨県", area: "", lat: 35.662, lon: 138.730 },
    taste: { aroma: 60, body: 30, sweetness: 25, acidity: 80, bitterness: 20 },
    description: [
      "日本固有のブドウ品種「甲州」。その中でも最高のテロワールとされる勝沼の「鳥居平（とりいびら）地区」で栽培されたブドウを使用した、世界に誇る白ワインです。",
      "すだちやカボスといった和柑橘を思わせる清々しい香りと、微かな白胡椒のスパイス感。そして何より、ピュアで伸びやかな酸味が特徴です。出汁の旨味を大切にする和食と、これ以上ないほど見事に寄り添います。"
    ],
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
      "https://images.unsplash.com/photo-1551887196-72e32cb14b09?w=800&q=80",
      "https://images.unsplash.com/photo-1595855761358-0026e64402a5?w=800&q=80"
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80", caption: "急斜面で水はけの良い鳥居平の畑が、凝縮感のあるブドウを生み出します。" },
      { url: "https://images.unsplash.com/photo-1551887196-72e32cb14b09?w=800&q=80", caption: "淡い藤色の果皮を持つ甲州ブドウ。繊細な日本の美意識を体現する味わいです。" }
    ]
  }
];
