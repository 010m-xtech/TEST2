// ==================================================================
// ▼ お店の設定：トン・ガリアーノ（1店目の見本） ▼
//
//   このフォルダ（shops/tongallianookazaki/）に、このファイルと写真を入れます。
//   お店を増やすときは、このフォルダをまるごとコピーして名前を変え、
//   中身を書きかえてください（くわしくは sokutatubin/使い方.txt）。
//
//   このお店のページ： …/sokutatubin/?shop=tongallianookazaki （?shop= を付けないときも、このお店）
// ==================================================================
window.SHOP_DATA = {

  // お店の名前（マイカードや「〇〇に到着！」に出ます）
  name: 'トン・ガリアーノ',

  // ▼ 途中で通る場所（上から順に走ります）。写真（photos）がある場所では、トラックが止まって思い出がふわっと出ます
  //   spot   … 用意ずみの名所の文を使う（okazaki 岡崎城）。見出し・文・歴史メモ入り
  //   bg     … 背景の景色（nagoya / tokyo / yokohama / fuji / kyoto / shirakawa / tsumago / okazaki）
  //             bg だけ書いた所は、紹介文なしで流れていきます
  //   name   … 場所の名前　　title … 見出し　　text … 文　　memo … 歴史メモ ['年や数字', '説明']
  //             （季節ごとに変えたいときは { haru: '…', natsu: '…', aki: '…', fuyu: '…' } と書く）
  //   photos … 思い出のようにふわっと出す写真（何枚でも。1枚ずつ順番に出ます）
  //             { photo: 'ファイル名', caption: '写真の下の文字', credit: 'クレジット' }
  //             photo  … このフォルダに入れた写真のファイル名
  //             credit … 写真のクレジット（自分たちで撮った写真なら書かなくてOK）
  stops: [
    { bg: 'nagoya', name: '出発', title: '速達生ビール、配達中！',
      text: 'できたての生ビールを積んで出発！ 工場出荷から2〜3日以内にお届けします。' },
    // ↓ 景色だけ（bg だけ書く）。止まらずに流れていきます（紹介文は出ません）
    { bg: 'tokyo' }, { bg: 'yokohama' }, { bg: 'fuji' }, { bg: 'kyoto' }, { bg: 'shirakawa' },
    // ↓ 写真（photos）がある所は、トラックが止まって思い出がふわっと出ます
    { spot: 'okazaki',
      photos: [{ photo: 'okazakijo.webp', caption: '岡崎城', credit: 'Evelyn-rose / Wikimedia Commons（CC0）' }] },
    { bg: 'tsumago', name: '乙川の桜', title: '乙川の桜', text: '岡崎の春をいろどる、川ぞいの桜並木。',
      photos: [{ photo: 'otogawa.webp', caption: '乙川の桜', credit: 'Evelyn-rose / Wikimedia Commons（CC0）' }] }
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
