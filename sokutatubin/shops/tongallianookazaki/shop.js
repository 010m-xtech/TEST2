// ==================================================================
// ▼ お店の設定：トン・ガリアーノ（1店目の見本） ▼
//
//   このフォルダ（shops/tongalliano/）に、このファイルと写真を入れます。
//   お店を増やすときは、このフォルダをまるごとコピーして名前を変え、
//   中身を書きかえてください（くわしくは sokutatubin/使い方.txt）。
//
//   このお店のページ： …/sokutatubin/?shop=tongalliano
// ==================================================================
window.SHOP_DATA = {

  // お店の名前（マイカードや「〇〇に到着！」に出ます）
  name: 'トン・ガリアーノ',

  // ▼ 途中で通る名所・店長のおすすめ（上から順に走ります。3〜5か所がおすすめ）
  //   spot   … 用意ずみの名所を使う（kyoto 京都 / fuji 富士山 / okazaki 岡崎城 / tsumago 妻籠宿 /
  //             shirakawa 白川郷 / tokyo 東京 / yokohama 横浜 / nagoya 名古屋）。見出し・文・歴史メモ入り
  //   bg     … 背景の景色だけ指定する（上と同じキー）。spot を書かないときに使う
  //   name   … 場所の名前
  //   title  … 見出し　　text … 文　　memo … 歴史メモ ['年や数字', '説明']
  //             （季節ごとに変えたいときは { haru: '…', natsu: '…', aki: '…', fuyu: '…' } と書く）
  //   photo  … ふわっと出す写真（このフォルダに入れたファイル名）
  //   credit … 写真のクレジット（自分たちで撮った写真なら書かなくてOK）
  //   tencho … true にすると「店長のおすすめ」の札がつく
  stops: [
    { spot: 'kyoto' },
    { spot: 'fuji' },
    { spot: 'okazaki', photo: 'okazakijo.webp', credit: 'Evelyn-rose / Wikimedia Commons（CC0）' },
    { bg: 'tsumago', name: '乙川の桜', tencho: true,
      photo: 'otogawa.webp', credit: 'Evelyn-rose / Wikimedia Commons（CC0）',
      title: '店長のおすすめ：乙川の桜',
      text: '（見本）ここに店長のひとことが入ります。例：春は川ぞいが桜でいっぱいになる、好きな景色です。' }
  ],

  // ▼ 最後に着くお店
  //   bg    … お店の景色（tg … トン・ガリアーノの店舗 / izakaya … 街の居酒屋）
  //   logo  … true にするとトン・ガリアーノのロゴ看板を重ねる（トン・ガリアーノ以外は false）
  //   photo … お店の外観写真（あれば、到着したときにふわっと出て、マイカードの写真にもなる）
  goal: {
    bg: 'tg', logo: true,
    title: 'トン・ガリアーノに到着！',
    text: 'ナポリピッツァとワインのお店に、鮮度そのままでお届け。ここからは、おいしく注ぐ番です。'
  }
};
