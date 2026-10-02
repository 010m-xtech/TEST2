// tailwind.css を index.html の <style id="tailwind">…</style> に埋め込む
const fs = require('fs');
const css = fs.readFileSync('tailwind.css', 'utf8').trim();
const html = fs.readFileSync('index.html', 'utf8');
const out = html.replace(/<style id="tailwind">[\s\S]*?<\/style>/, () => `<style id="tailwind">${css}</style>`);
fs.writeFileSync('index.html', out);
console.log('inlined', css.length, 'bytes');
