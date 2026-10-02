// index.html を変更してクラスを追加・変更したら、このフォルダで以下を実行して CSS を作り直してください
//   npx tailwindcss@3 -c tailwind.config.js -o tailwind.css --minify && node inline-css.js
// （inline-css.js が tailwind.css の中身を index.html の <style id="tailwind"> に埋め込みます）
module.exports = {
    content: ['./index.html'],
    theme: { extend: {} },
    plugins: []
};
