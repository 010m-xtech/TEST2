// =============================================================
//  味覚診断（質問・4つのタイプ・相性％）
//  診断アプリ（index.html）と お品書き（menu.html）の両方で使います。
//  taste-chart.js のあとに読み込んでください。
//
//  使い方：答えを quizAnswers に入れて userProfile = computeUserProfile() で好みを計算し、
//          getMatchPercent(お酒) で相性（％）、getMatchReason(お酒) で理由の文が出ます。
// =============================================================

let quizAnswers = [];   // 選んだ答えの profile を順に入れる

// 4つのタイプ（香り × コク で決まる）
const TASTE_TYPES = {
  aromaticLight: {
    name: '華やか・軽快',
    desc: '香りの華やかさと、軽やかな飲み口を楽しむタイプ。フルーティーで爽やかな一杯が好相性です。'
  },
  aromaticRich: {
    name: '芳醇・リッチ',
    desc: '豊かな香りと、しっかりしたコクの両方を求めるタイプ。飲みごたえと華やかさを兼ね備えた一杯を。'
  },
  crispLight: {
    name: '爽快・キレ',
    desc: 'すっきりとした飲み口と、後に残らないキレを好むタイプ。食事と一緒に楽しむ一杯にぴったりです。'
  },
  deepRich: {
    name: '重厚・コク',
    desc: '深いコクと長い余韻をじっくり味わうタイプ。ゆっくり向き合える、飲みごたえのある一杯がおすすめです。'
  }
};

// 質問：各選択肢の profile は「その答えを選んだ人が好む味わい（0〜100）」
const QUESTIONS = [
  {
    q: "いまの気分に一番フィットする飲み心地は？",
    options: [
      { text: "気分をシャキッとリフレッシュする、爽やかな1杯", profile: { body: 25, acidity: 70, sweetness: 40 } },
      { text: "会話が弾むような、香り立ちの良いワクワクする1杯", profile: { aroma: 85, body: 40 } },
      { text: "ペースを落として、じっくり深く浸れる落ち着いた1杯", profile: { body: 80, aroma: 45 } },
      { text: "ここで一度口内をリセットする、キレ味鋭いクリアな1杯", profile: { aroma: 20, body: 20, sweetness: 20, umami: 30 } }
    ]
  },
  {
    q: "グラスを近づけた時、ふわりと感じたい香りは？",
    options: [
      { text: "果実やお花、柑橘のようなフルーティーで華やかなアロマ", profile: { aroma: 90, sweetness: 60 } },
      { text: "ハーブや山椒、和スパイスのような心地よい清涼感", profile: { aroma: 70, acidity: 55, bitterness: 45 } },
      { text: "自然な甘みや麦の香ばしさ、食事に寄り添う控えめな香り", profile: { aroma: 40, sweetness: 55, body: 55, umami: 70 } },
      { text: "香りは極力主張せず、澄み切ったクリーンな印象", profile: { aroma: 15 } }
    ]
  },
  {
    q: "口に含んだ瞬間の「ボディ感」はどれが理想？",
    options: [
      { text: "水のようにサラリと喉を通る、軽快で雑味のないタッチ", profile: { body: 10 } },
      { text: "ほどよい瑞々しさがあり、重すぎず軽すぎない心地よさ", profile: { body: 40 } },
      { text: "トロッとした舌触りや、口いっぱいに広がる濃密な旨味", profile: { body: 75, sweetness: 65, umami: 80 } },
      { text: "舌の上にズシッと残る、飲みごたえ抜群の濃厚な重厚感", profile: { body: 95 } }
    ]
  },
  {
    q: "味わいで、いちばん惹かれるのは？",
    options: [
      { text: "熟した果実やはちみつのような、やさしい甘み", profile: { sweetness: 85, acidity: 35 } },
      { text: "柑橘や青りんごのような、キリッとした酸味", profile: { acidity: 85, sweetness: 30 } },
      { text: "カカオやコーヒー、ホップのような心地よい苦味", profile: { bitterness: 85, sweetness: 25 } },
      { text: "甘さ控えめの、すっきりドライな味わい", profile: { sweetness: 10, bitterness: 40 } }
    ]
  },
  {
    q: "ゴクリと飲み干したあとの「余韻」はどうしたい？",
    options: [
      { text: "一瞬でスパッと消え去り、次の一口や箸が進むキレ", profile: { body: 25, sweetness: 20, umami: 25 } },
      { text: "鼻腔からフワッと心地よい果実やボタニカルの香りが抜けていく", profile: { aroma: 85 } },
      { text: "喉の奥にじんわりとお酒本来のふくよかな温かみが続く", profile: { body: 65, sweetness: 55, umami: 75 } },
      { text: "何層にも変化する濃厚な深みやビター感を長く味わいたい", profile: { body: 90, bitterness: 70 } }
    ]
  }
];

let userProfile = { ...NEUTRAL_PROFILE };
let userAnswerCounts = {}; // 要素ごとに、何回の回答で好みが分かったか

// 回答の多さに応じた、その要素の確からしさ（0.2〜1）
const getConfidence = key => Math.max(0.2, Math.min(1, (userAnswerCounts[key] || 0) / 2));

// 回答から好みを計算：要素ごとに「選んだ答えの値」の平均（中間値50を少しだけ混ぜて極端になりすぎないようにする）
function computeUserProfile() {
  const PRIOR_WEIGHT = 0.5;
  const profile = {};
  userAnswerCounts = {};
  TASTE_AXES.forEach(({ key }) => {
    let sum = 50 * PRIOR_WEIGHT, weight = PRIOR_WEIGHT;
    quizAnswers.forEach(answer => {
      if(answer[key] != null) { sum += answer[key]; weight += 1; }
    });
    profile[key] = Math.round(sum / weight);
    userAnswerCounts[key] = weight - PRIOR_WEIGHT;
  });
  return profile;
}

// お酒の味わい（taste がなければ旧形式の x / y から換算）
function getDrinkTaste(drink) {
  if(drink.taste) return { ...NEUTRAL_PROFILE, ...drink.taste };
  return { ...NEUTRAL_PROFILE, aroma: 100 - (drink.y ?? 50), body: drink.x ?? 50 };
}

function getTasteTypeKey(taste) {
  if(taste.aroma >= 50) return taste.body >= 50 ? 'aromaticRich' : 'aromaticLight';
  return taste.body >= 50 ? 'deepRich' : 'crispLight';
}

// 相性（%）：6つの要素の差を重み付きで合計し、近いほど高くなる
//   質問でよく分かった要素ほど重く、あまり聞けていない要素は軽く扱う
function getMatchPercent(drink) {
  const taste = getDrinkTaste(drink);
  let sum = 0, max = 0;
  TASTE_AXES.forEach(a => {
    const w = a.weight * getConfidence(a.key);
    sum += w * Math.pow(taste[a.key] - userProfile[a.key], 2);
    max += w * 100 * 100;
  });
  const distance = Math.sqrt(sum / max); // 0（同じ）〜 1（正反対）
  return Math.max(30, Math.min(99, Math.round(100 * (1 - distance * 1.2))));
}

// 相性が良い理由（好みと近く、そのお酒の特徴がはっきりしている要素を最大2つ）
function getMatchReason(drink) {
  const taste = getDrinkTaste(drink);
  const reasons = TASTE_AXES
    .filter(a => getConfidence(a.key) >= 0.5)
    .map(a => ({ a, strength: Math.abs(taste[a.key] - 50), gap: Math.abs(taste[a.key] - userProfile[a.key]) }))
    .filter(r => r.gap <= 20 && r.strength >= 15)
    .sort((p, q) => (q.strength - q.gap) - (p.strength - p.gap))
    .slice(0, 2)
    .map(r => taste[r.a.key] >= 50 ? r.a.high : r.a.low);
  return reasons.length
    ? `「${reasons.join('」と「')}」が、あなたの好みにぴったりです。`
    : 'あなたの好みに近い、バランスのとれた一杯です。';
}

