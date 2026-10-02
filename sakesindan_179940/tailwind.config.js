// index.html を変更してクラスを追加・変更したら、このフォルダで以下を実行して tailwind.css を作り直してください
//   npx tailwindcss@3 -c tailwind.config.js -o tailwind.css --minify
module.exports = {
    content: ['./index.html'],
    theme: { extend: {} },
    plugins: []
};
