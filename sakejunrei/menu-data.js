// =============================================================
//  今日のお品書き（menu.html）のデータ
//  入れ替えのときは、このファイルの TODAY_MENU だけを書き換えます。
//  ・出さないお酒は  soldOut: true  にするか、行ごと消す
//  ・残りわずかは    fewLeft: true
// =============================================================

const MENU_CONFIG = {
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
//   ---- 商品ページ（お品書きを押したときのページ）に出る中身。省略すると味わいから自動で作ります ----
//   catch    : キャッチコピー（ひとことで）
//   keywords : 味わいのキーワード（3つくらい）
//   points   : 「ここがおいしい」壱・弐・参（3つ）
//   matching : 合わせたい肴（料理の名前を並べる）
//   trivia   : 豆知識（タップでひらく）
//   theme    : 商品ページの色（#RRGGBB）。省略すると、日本酒は甘・旨・辛の色、ワインは赤・白・ロゼの色
// ※ 「要確認」と書いた銘柄は、写真が小さく読み取りきれなかったものです。
// ※ taste の数値は、メニューの説明文からの仮の値です。お店のチャートに合わせて直してください。
const TODAY_MENU = [
  // ===== 限定・店主のおすすめ =====
  {
    category: "日本酒",
    id: "im-sake-rock", special: true,
    name: "アイ ム サケ ロック", kana: "あいむさけろっく",
    grade: "山廃純米原酒", maker: "", prefecture: "",          // 要確認：つくり手・産地
    taste: { aroma: 30, sweetness: 25, acidity: 65, body: 80, bitterness: 30, umami: 85 },
    comment: "濃い目の味わいを前面に出した辛口原酒。氷を浮かべてロックで。",
    tags: ["ロック推し"], color: "brown", label: "#1F3A5F",
    catch: "氷に負けない、骨太の辛口原酒",
    keywords: ["山廃", "原酒", "ロックで"],
    points: [
      "山廃仕込みならではの、厚みのある旨み",
      "原酒の力強さで、氷が溶けても味が薄まらない",
      "キリッと辛口で、揚げ物の油をすっきり流す"
    ],
    matching: ["唐揚げ", "もつ煮", "焼き鳥（タレ）"],
    trivia: "山廃は「山卸（やまおろし）廃止酛」の略。自然の乳酸菌の力で時間をかけて酒母を育てる、昔ながらの造り方です。"
  },
  {
    category: "日本酒",
    id: "jokigen-summer", special: true,
    name: "上喜元", kana: "じょうきげん",
    grade: "純米吟醸 フォーシーズン夏", maker: "酒田酒造", prefecture: "山形",
    taste: { aroma: 65, sweetness: 55, acidity: 50, body: 35, bitterness: 15, umami: 50 },
    comment: "爽やかな香り、ほんの少しきれいな甘み。軽快な味わいが特長。",
    tags: ["夏限定"], color: "green", label: "#F2C230",
    catch: "夏の夕暮れに、すっと寄り添う1杯",
    keywords: ["爽やかな香り", "きれいな甘み", "軽快"],
    points: [
      "ふわっと立つ、爽やかな吟醸の香り",
      "ほんの少しの、きれいな甘み",
      "すいすい進む、軽快な後口"
    ],
    matching: ["冷奴", "枝豆", "白身の刺身"],
    trivia: "上喜元は山形県酒田市・酒田酒造の銘柄。季節ごとに表情を変える限定酒も人気です。"
  },
  {
    category: "日本酒",
    id: "nifudazake", special: true,
    name: "荷札酒", kana: "にふだざけ",
    grade: "純米大吟醸 越淡麗", maker: "加茂錦酒造", prefecture: "新潟",
    taste: { aroma: 55, sweetness: 50, acidity: 40, body: 40, bitterness: 15, umami: 65 },
    comment: "柔らかい口当たりと米の豊かな旨み。食事の邪魔をしないスッキリとした後味。",
    tags: [], color: "green", label: "#FFFFFF",
    catch: "食事の邪魔をしない、やわらかな純米大吟醸",
    keywords: ["やわらか", "米の旨み", "スッキリ"],
    points: [
      "口当たりのやわらかさ",
      "新潟の酒米・越淡麗の、豊かな旨み",
      "すっと消える、きれいな後味"
    ],
    matching: ["お刺身", "だし巻き玉子", "焼き魚"],
    trivia: "荷札酒は新潟県加茂市・加茂錦酒造の銘柄。荷札のようなラベルが目印です。越淡麗は新潟県で生まれた酒米です。"
  },
  {
    category: "日本酒",
    id: "kudokijozu-gokutsubushi", special: true,
    name: "くどき上手", kana: "くどきじょうず",
    grade: "純米大吟醸 穀潰し", maker: "亀の井酒造", prefecture: "山形",
    taste: { aroma: 90, sweetness: 70, acidity: 35, body: 45, bitterness: 10, umami: 55 },
    comment: "酒米を限界まで磨き上げた、華やかな香りと優しい旨みを持つ贅沢な純米大吟醸酒。",
    specs: ["日本酒度 −5", "酸度 1.3"],
    tags: ["贅沢な1杯"], color: "brown", label: "#FFFFFF",
    catch: "限界まで磨いた、贅沢な香りの1杯",
    keywords: ["華やかな香り", "やさしい甘み", "贅沢"],
    points: [
      "メロンのような、華やかな吟醸香",
      "やさしく広がる、上品な甘み",
      "特別な日に選びたい、贅沢な味わい"
    ],
    matching: ["カルパッチョ", "フルーツ", "白身魚の昆布締め"],
    trivia: "くどき上手は山形県鶴岡市・亀の井酒造の銘柄。華やかな香りの吟醸酒で知られる蔵です。"
  },

  // ===== 手書きボードの銘柄（4枚目の写真） =====
  {
    category: "日本酒",
    id: "sake-enasan", name: "恵那山", kana: "えなさん", grade: "純米吟醸",
    maker: "はざま酒造", prefecture: "岐阜",
    taste: { aroma: 65, sweetness: 55, acidity: 40, body: 40, bitterness: 15, umami: 60 },
    comment: "洋梨のような穏やかな吟醸香。米の甘みと、中津川の清流のような軽やかな余韻。",
    specs: ["山田錦", "精米歩合 50％", "IWC 受賞"],
    tags: [], image: "images/恵那山①.webp", imagePosition: "54% 50%", color: "green", label: "#3D5A2A",
    catch: "洋梨のように香る、中津川の清流の1杯",
    keywords: ["洋梨の香り", "米の甘み", "軽やかな余韻"],
    points: [
      "穏やかに香る、フルーツのような吟醸香",
      "山田錦の、ふくよかな米の甘み",
      "清流を思わせる、軽やかな余韻"
    ],
    matching: ["鮎の塩焼き", "五平餅", "冷奴"],
    trivia: "恵那山の伏流水を、蔵の敷地内の井戸から汲み上げて仕込みに使っています。IWC（インターナショナル・ワイン・チャレンジ）で受賞歴もあります。"
  },
  {
    category: "日本酒",
    id: "ohmine-summer", name: "大嶺 3粒", kana: "おおみね", grade: "夏ver.",
    maker: "大嶺酒造", prefecture: "山口",
    taste: { aroma: 75, sweetness: 70, acidity: 60, body: 30, bitterness: 15, umami: 40 },
    comment: "果実のような香り。ぐびぐび飲める夏のお酒。",
    tags: ["夏限定"], color: "green", label: "#E8E3D8",
    catch: "ぐびぐびいける、果実みたいな夏酒",
    keywords: ["果実の香り", "甘酸っぱい", "夏限定"],
    points: [
      "果実のような、みずみずしい香り",
      "甘みと酸味の、ちょうどいいバランス",
      "冷やして、ワイングラスで楽しみたい"
    ],
    matching: ["生ハム", "トマトのおひたし", "カプレーゼ"],
    trivia: "大嶺は山口県美祢市・大嶺酒造の銘柄。ラベルの3つの米粒が「3粒」の名前の由来です。"
  },
  {
    category: "日本酒",
    id: "kinoene", name: "甲子", kana: "きのえね", grade: "",
    maker: "飯沼本家", prefecture: "千葉",
    taste: { aroma: 70, sweetness: 65, acidity: 45, body: 40, bitterness: 20, umami: 55 },
    comment: "バナナのような香りと甘み。キレもあって飲みやすい。",
    tags: [], color: "green", label: "#2B2B2B",
    catch: "バナナのように香る、やさしい甘口",
    keywords: ["バナナの香り", "やさしい甘み", "キレ"],
    points: [
      "ふんわり香る、バナナのような香り",
      "口に広がる、やさしい甘み",
      "甘いのに、最後はすっとキレる"
    ],
    matching: ["チーズ", "ポテトサラダ", "鶏の照り焼き"],
    trivia: "甲子（きのえね）は千葉県酒々井町・飯沼本家の銘柄。十干十二支の最初の組み合わせで、縁起のよい名前です。"
  },
  {
    category: "日本酒",
    id: "yamagata-karakuchi", name: "山形の超辛口", kana: "", grade: "（銘柄 要確認）",
    maker: "", prefecture: "山形",
    taste: { aroma: 35, sweetness: 10, acidity: 50, body: 45, bitterness: 35, umami: 45 },
    comment: "キレッキレの超辛口。",
    tags: [], color: "green", label: "#F4EFE4",
    catch: "キレッキレの、超辛口",
    keywords: ["超辛口", "キレ", "食中酒"],
    points: [
      "甘さを抑えた、シャープな飲み口",
      "後に残らない、鋭いキレ",
      "どんな料理にも合わせやすい"
    ],
    matching: ["お刺身", "天ぷら", "漬物"],
    trivia: "山形県は、県全体で日本酒の品質を高める取り組みを続けている「吟醸王国」として知られています。"
  },
  {
    category: "日本酒",
    id: "fukushima-amakuchi", name: "（銘柄 要確認）", kana: "", grade: "",
    maker: "", prefecture: "福島",
    taste: { aroma: 50, sweetness: 65, acidity: 40, body: 50, bitterness: 20, umami: 65 },
    comment: "まろやかな甘みとやさしい香り。",
    tags: [], color: "brown", label: "#F4EFE4",
    catch: "まろやかに甘い、ほっとする1杯",
    keywords: ["まろやか", "やさしい甘み", "米の旨み"],
    points: [
      "角のない、まろやかな口当たり",
      "じんわり広がる、やさしい甘み",
      "お米の旨みで、食事にもなじむ"
    ],
    matching: ["煮物", "焼き鳥（塩）", "いかの塩辛"],
    trivia: "福島県は全国新酒鑑評会で金賞の数が何度も日本一になった、日本酒どころです。"
  },
  {
    category: "日本酒",
    id: "manrei", name: "万齢", kana: "まんれい", grade: "",
    maker: "小松酒造", prefecture: "佐賀",
    taste: { aroma: 35, sweetness: 25, acidity: 55, body: 55, bitterness: 30, umami: 70 },
    comment: "超辛口なのにしっかり旨い。キレのある1杯。",
    tags: [], color: "green", label: "#F4EFE4",
    catch: "超辛口なのに、しっかり旨い",
    keywords: ["超辛口", "旨み", "キレ"],
    points: [
      "辛口なのに、お米の旨みがしっかり",
      "後口のキレのよさ",
      "燗にしてもおいしい"
    ],
    matching: ["呼子のイカ", "おでん", "焼き魚"],
    trivia: "万齢は佐賀県唐津市・小松酒造の銘柄。玄界灘の海の幸と合わせたい1本です。"
  },
  {
    category: "日本酒",
    id: "utashiro", name: "雅楽代", kana: "うたしろ", grade: "",
    maker: "天領盃酒造", prefecture: "新潟",
    taste: { aroma: 60, sweetness: 65, acidity: 55, body: 35, bitterness: 15, umami: 50 },
    comment: "やさしい甘みで、すいすい飲める。",
    tags: [], color: "green", label: "#FFFFFF",
    catch: "すいすい飲める、やさしい甘み",
    keywords: ["やさしい甘み", "すっきり", "飲みやすい"],
    points: [
      "やさしく、上品な甘み",
      "重さを感じない、すっきりした飲み口",
      "日本酒が初めての方にも"
    ],
    matching: ["白和え", "茶碗蒸し", "フルーツ"],
    trivia: "雅楽代（うたしろ）は新潟県佐渡島・天領盃酒造の銘柄。若い蔵元が手がける、新しい佐渡のお酒です。"
  },
  {
    category: "日本酒",
    id: "zaku-waetsu", name: "作 和悦", kana: "ざく わえつ", grade: "",
    maker: "清水清三郎商店", prefecture: "三重",
    taste: { aroma: 55, sweetness: 50, acidity: 45, body: 45, bitterness: 20, umami: 60 },
    comment: "みずみずしくて、すっきり旨い。",
    tags: ["飲食店限定"], color: "green", label: "#FFFFFF",
    catch: "みずみずしく、すっきり旨い",
    keywords: ["みずみずしい", "すっきり", "飲食店限定"],
    points: [
      "果実のような、みずみずしさ",
      "すっきりとした旨み",
      "飲食店でしか出会えない限定品"
    ],
    matching: ["お刺身", "白身の焼き魚", "湯豆腐"],
    trivia: "作（ざく）は三重県鈴鹿市・清水清三郎商店の銘柄。伊勢志摩サミットで提供されたことでも知られます。"
  },
  {
    category: "日本酒",
    id: "hakurakusei", name: "伯楽星", kana: "はくらくせい", grade: "",
    maker: "新澤醸造店", prefecture: "宮城",
    taste: { aroma: 40, sweetness: 30, acidity: 45, body: 30, bitterness: 25, umami: 50 },
    comment: "キレが良くて、揚げ物・刺身・魚料理に合う究極の食中酒。",
    tags: ["食中酒"], color: "green", label: "#FFFFFF",
    catch: "料理を引き立てる、究極の食中酒",
    keywords: ["食中酒", "キレ", "すっきり"],
    points: [
      "料理の味を邪魔しない、控えめな香り",
      "揚げ物の後に、口をさっぱりさせるキレ",
      "最後の1杯まで飲み飽きない"
    ],
    matching: ["唐揚げ", "お刺身", "焼き魚"],
    trivia: "伯楽星は宮城県・新澤醸造店の銘柄。「究極の食中酒」を目指して造られています。"
  },
  {
    category: "日本酒",
    id: "natsu-doburokku", name: "夏どぶろっく", kana: "なつどぶろっく", grade: "どぶろく",
    maker: "", prefecture: "",                                   // 要確認
    taste: { aroma: 40, sweetness: 80, acidity: 70, body: 85, bitterness: 10, umami: 70 },
    comment: "シュワっと夏のどぶろく。乳酸のやさしい甘酸っぱさ。",
    tags: ["夏限定", "にごり"], color: "green", label: "#E05A47",
    catch: "シュワっと甘酸っぱい、夏のどぶろく",
    keywords: ["にごり", "甘酸っぱい", "シュワっと"],
    points: [
      "お米の粒感が残る、とろりとした口当たり",
      "乳酸のやさしい甘酸っぱさ",
      "微発泡で、夏にぴったり"
    ],
    matching: ["キムチ", "スパイスの効いた料理", "デザートとして"],
    trivia: "どぶろくは、もろみを搾らずにそのまま楽しむお酒。お米の粒感やとろみが残るのが魅力です。"
  },
  {
    category: "日本酒",
    id: "aomori", name: "（銘柄 要確認）", kana: "", grade: "",
    maker: "", prefecture: "青森",
    taste: { aroma: 55, sweetness: 60, acidity: 45, body: 45, bitterness: 20, umami: 55 },
    comment: "みずみずしくて、おいしい。",
    tags: [], color: "green", label: "#F4EFE4",
    catch: "みずみずしくて、おいしい",
    keywords: ["みずみずしい", "やさしい甘み", "まろやか"],
    points: [
      "みずみずしい口当たり",
      "ほどよい甘みと旨み",
      "冷やしても常温でも"
    ],
    matching: ["帆立のバター焼き", "せんべい汁", "焼き魚"],
    trivia: "青森県は、海の幸と合わせたい、やさしい味わいのお酒が多い地域です。"
  },
  {
    category: "日本酒",
    id: "oze-no-yukidoke", name: "尾瀬の雪どけ", kana: "おぜのゆきどけ", grade: "純米大吟醸",
    maker: "龍神酒造", prefecture: "群馬",
    taste: { aroma: 75, sweetness: 55, acidity: 45, body: 40, bitterness: 15, umami: 55 },
    comment: "フルーティー！ 香りも旨みもバランスよく。",
    tags: [], color: "green", label: "#FFFFFF",
    catch: "フルーティーで、バランスのいい1杯",
    keywords: ["フルーティー", "華やかな香り", "バランス"],
    points: [
      "フルーティーで華やかな香り",
      "香りと旨みのバランスのよさ",
      "冷やしてワイングラスで"
    ],
    matching: ["生春巻き", "カルパッチョ", "焼きとうもろこし"],
    trivia: "尾瀬の雪どけは群馬県館林市・龍神酒造の銘柄です。"
  },
  {
    category: "日本酒",
    id: "takachiyo", name: "たかちよ", kana: "たかちよ", grade: "",
    maker: "高千代酒造", prefecture: "新潟",
    taste: { aroma: 65, sweetness: 70, acidity: 45, body: 50, bitterness: 25, umami: 65 },
    comment: "大葉のような香りが心地よい甘み。じゅわっと広がる。",
    tags: [], color: "brown", label: "#E9DFC8",
    catch: "じゅわっと広がる、個性派の甘口",
    keywords: ["じゅわっと", "甘み", "個性的な香り"],
    points: [
      "ハーブのような、個性的な香り",
      "じゅわっと広がる甘み",
      "1杯目より、2杯目で好きになる"
    ],
    matching: ["チーズ", "生ハムとメロン", "鴨ロース"],
    trivia: "たかちよは新潟県南魚沼市・高千代酒造の銘柄。ひらがなラベルのシリーズは、搾ったままの味わいを楽しむお酒です。"
  },

  // ===== ワイン（診断アプリ drinks.js と同じ2本） =====
  {
    category: "ワイン",
    id: "wine-red", name: "シャトー・メルシャン", kana: "シャトー・メルシャン",
    grade: "桔梗ヶ原メルロー（赤）", maker: "メルシャン", prefecture: "長野",
    taste: { aroma: 75, sweetness: 20, acidity: 50, body: 80, bitterness: 65, umami: 60 },
    comment: "カシスやダークチェリーの香りに、樽由来のバニラ。しっかりしたタンニンなのに、口当たりはなめらか。",
    tags: ["フルボディ"], color: "red", label: "#F6F1E6",
    catch: "なめらかで深い、日本の赤",
    keywords: ["カシス", "樽のバニラ", "なめらか"],
    points: [
      "カシスやダークチェリーの凝縮した香り",
      "樽由来のバニラとスパイス",
      "しっかりした渋みなのに、なめらか"
    ],
    matching: ["ローストビーフ", "すき焼き", "ビーフシチュー"],
    trivia: "桔梗ヶ原は長野県塩尻市の産地。日本でメルローを育てるのに適した土地として知られています。"
  },
  {
    category: "ワイン",
    id: "wine-white", name: "グレイス 甲州", kana: "グレイス・コウシュウ",
    grade: "鳥居平畑（白）", maker: "中央葡萄酒", prefecture: "山梨",
    taste: { aroma: 65, sweetness: 15, acidity: 55, body: 45, bitterness: 25, umami: 35 },
    comment: "すだちやカボスのような清々しい香り。伸びやかな酸味で、和食にぴったり。",
    tags: ["和食に合う"], color: "white", label: "#F6F1E6",
    catch: "和食に寄り添う、日本の白",
    keywords: ["和柑橘", "伸びやかな酸", "甲州"],
    points: [
      "すだちやカボスのような清々しい香り",
      "ピュアで伸びやかな酸味",
      "出汁の旨みと好相性"
    ],
    matching: ["天ぷら", "お寿司", "出汁巻き玉子"],
    trivia: "甲州は日本固有のぶどう品種。山梨県勝沼の鳥居平は、急な斜面で水はけのよい銘醸地です。"
  },

  // ===== デモ用のワイン（銘柄名は一般的な呼び名。お店のワインに差し替えてください） =====
  {
    category: "ワイン",
    id: "wine-sparkling", name: "カヴァ ブリュット", kana: "カヴァ・ブリュット", grade: "スパークリング（白）",
    maker: "", prefecture: "スペイン",
    taste: { aroma: 55, sweetness: 25, acidity: 70, body: 25, bitterness: 20, umami: 25 },
    comment: "きめ細かい泡と、青りんごのような爽やかさ。乾杯の1杯にどうぞ。",
    tags: ["泡", "乾杯に"], color: "white", label: "#F6F1E6",
    catch: "まずはこれで、乾杯！",
    keywords: ["きめ細かい泡", "青りんご", "辛口"],
    points: [
      "きめ細かく、長く続く泡",
      "青りんごのような爽やかさ",
      "すっきり辛口で、どんな料理にも"
    ],
    matching: ["フライドポテト", "生ハム", "アヒージョ"],
    trivia: "カヴァはスペインのスパークリングワイン。シャンパーニュと同じく、瓶の中でもう一度発酵させて泡を生みます。"
  },
  {
    category: "ワイン",
    id: "wine-chablis", name: "シャブリ", kana: "シャブリ", grade: "白・辛口",
    maker: "", prefecture: "フランス",
    taste: { aroma: 45, sweetness: 15, acidity: 75, body: 35, bitterness: 25, umami: 40 },
    comment: "石のようなミネラル感と、キリッとした酸。牡蠣やお刺身と好相性。",
    tags: ["白", "魚介に"], color: "white", label: "#F6F1E6",
    catch: "キリッと冷たい、ミネラルの白",
    keywords: ["ミネラル", "キリッとした酸", "辛口"],
    points: [
      "石のようなミネラル感",
      "キリッと引き締まった酸",
      "魚介の旨みを引き立てる"
    ],
    matching: ["生牡蠣", "お刺身", "白身魚のムニエル"],
    trivia: "シャブリはフランス・ブルゴーニュ地方の北にある産地。シャルドネというぶどうから造られます。"
  },
  {
    category: "ワイン",
    id: "wine-sauvignon", name: "ソーヴィニヨン・ブラン", kana: "ソーヴィニヨン・ブラン", grade: "白・辛口",
    maker: "", prefecture: "ニュージーランド",
    taste: { aroma: 85, sweetness: 25, acidity: 70, body: 35, bitterness: 25, umami: 25 },
    comment: "パッションフルーツやハーブの弾ける香り。サラダや天ぷらに。",
    tags: ["白", "香り華やか"], color: "white", label: "#F6F1E6",
    catch: "弾けるように香る、爽快な白",
    keywords: ["パッションフルーツ", "ハーブ", "爽快"],
    points: [
      "パッションフルーツのような弾ける香り",
      "青草やハーブの爽やかさ",
      "キリッとした酸で、後口すっきり"
    ],
    matching: ["サラダ", "天ぷら", "山菜"],
    trivia: "ニュージーランドのマールボロ地方は、香り高いソーヴィニヨン・ブランで世界的に有名な産地です。"
  },
  {
    category: "ワイン",
    id: "wine-riesling", name: "リースリング", kana: "リースリング", grade: "白・やや甘口",
    maker: "", prefecture: "ドイツ",
    taste: { aroma: 75, sweetness: 65, acidity: 70, body: 30, bitterness: 10, umami: 25 },
    comment: "白桃や蜂蜜のやさしい甘みを、きれいな酸が引き締める。ワインが初めての方にも。",
    tags: ["白", "甘口"], color: "white", label: "#F6F1E6",
    catch: "甘くて、きれいな、はじめてのワイン",
    keywords: ["白桃", "蜂蜜", "やや甘口"],
    points: [
      "白桃や蜂蜜のようなやさしい甘み",
      "甘さを引き締める、きれいな酸",
      "アルコール度数が低めで飲みやすい"
    ],
    matching: ["豚の角煮", "エスニック料理", "フルーツタルト"],
    trivia: "リースリングはドイツを代表するぶどう品種。辛口から極甘口まで、さまざまなワインが造られます。"
  },
  {
    category: "ワイン",
    id: "wine-rose", name: "プロヴァンス ロゼ", kana: "プロヴァンス・ロゼ", grade: "ロゼ・辛口",
    maker: "", prefecture: "フランス",
    taste: { aroma: 60, sweetness: 30, acidity: 60, body: 35, bitterness: 15, umami: 35 },
    comment: "いちごや柑橘の軽やかな香り。和食にも洋食にも合わせやすい万能選手。",
    tags: ["ロゼ"], color: "rose", label: "#F6F1E6",
    catch: "どんな料理にも合う、桜色の万能選手",
    keywords: ["いちご", "柑橘", "辛口"],
    points: [
      "いちごや柑橘の軽やかな香り",
      "すっきり辛口で、食事を選ばない",
      "見た目も華やか"
    ],
    matching: ["サーモンのマリネ", "焼き鳥（塩）", "ピザ"],
    trivia: "フランスのプロヴァンス地方は、淡い色の辛口ロゼワインの一大産地です。"
  },
  {
    category: "ワイン",
    id: "wine-pinot", name: "ピノ・ノワール", kana: "ピノ・ノワール", grade: "赤・ミディアム",
    maker: "", prefecture: "フランス",
    taste: { aroma: 70, sweetness: 25, acidity: 60, body: 45, bitterness: 35, umami: 55 },
    comment: "ラズベリーやすみれの香り。渋みはおだやかで、焼き鳥（タレ）にも。",
    tags: ["赤", "軽めの赤"], color: "red", label: "#F6F1E6",
    catch: "軽やかで華やか、和食に合う赤",
    keywords: ["ラズベリー", "すみれ", "おだやかな渋み"],
    points: [
      "ラズベリーやすみれの華やかな香り",
      "渋みがおだやかで飲みやすい",
      "醤油やタレの味とも合う"
    ],
    matching: ["焼き鳥（タレ）", "鴨肉", "マグロの赤身"],
    trivia: "ピノ・ノワールは、フランス・ブルゴーニュ地方の赤ワインに使われる繊細なぶどう品種です。"
  },
  {
    category: "ワイン",
    id: "wine-cabernet", name: "カベルネ・ソーヴィニヨン", kana: "カベルネ・ソーヴィニヨン", grade: "赤・フルボディ",
    maker: "", prefecture: "チリ",
    taste: { aroma: 65, sweetness: 25, acidity: 45, body: 85, bitterness: 75, umami: 55 },
    comment: "カシスと樽のバニラ、しっかりした渋み。お肉料理と一緒にどっしりと。",
    tags: ["赤", "お肉に"], color: "red", label: "#F6F1E6",
    catch: "どっしり重め、お肉のための赤",
    keywords: ["カシス", "しっかりした渋み", "フルボディ"],
    points: [
      "カシスと樽のバニラの香り",
      "しっかりした渋みとコク",
      "脂ののったお肉と好相性"
    ],
    matching: ["ステーキ", "ハンバーグ", "スペアリブ"],
    trivia: "チリは、カベルネ・ソーヴィニヨンの名産地。日照に恵まれ、果実味の豊かなワインが造られます。"
  }
];
