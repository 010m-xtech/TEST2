<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>名産地MAP ～美味しいを巡る食道楽～</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@500;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --paper: #F4EFE4;
    --ink: #1F1B16;
    --muted: #776E62;
    --line: #DED5C4;
    --accent: #B8322A;
    --gold: #B88A2E;
    --radius: 18px;
  }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; height: 100%; overflow: hidden; background: var(--paper); color: var(--ink);
    font-family: "Noto Sans JP", sans-serif; }
  .mincho { font-family: "Shippori Mincho", serif; }
  button { font: inherit; color: inherit; cursor: pointer; }

  .screen { position: fixed; inset: 0; transition: opacity .6s ease, transform .6s ease; }
  .screen.hidden { opacity: 0; pointer-events: none; }

  /* ---------- 地図画面 ---------- */
  #map-screen { display: flex; flex-direction: column;
    background:
      radial-gradient(circle at 20% 15%, rgba(255,255,255,.7), transparent 40%),
      repeating-linear-gradient(0deg, rgba(120,100,70,.025) 0 2px, transparent 2px 5px),
      var(--paper); }
  .map-head { padding: max(18px, env(safe-area-inset-top)) 20px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; z-index: 2; }
  .logo { font-size: 30px; font-weight: 800; letter-spacing: .12em; line-height: 1.1; margin: 0; }
  .logo small { display: block; font-family: "Shippori Mincho", serif; font-size: 13px; font-weight: 700; letter-spacing: .12em; color: var(--muted); margin-top: 6px; }
  .stamp-count { flex-shrink: 0; text-align: center; border: 2px solid var(--accent); color: var(--accent); border-radius: 50%;
    width: 68px; height: 68px; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: rotate(-8deg); background: rgba(255,255,255,.5); }
  .stamp-count b { font-family: "Shippori Mincho", serif; font-size: 20px; line-height: 1; }
  .stamp-count span { font-size: 9px; letter-spacing: .1em; margin-top: 2px; }
  .store-badge { margin-top: 10px; display: inline-block; font-size: 12px; font-weight: 700; line-height: 1.6;
    background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 5px 12px; }
  .store-badge:empty { display: none; }
  .store-badge b { color: var(--accent); }
  #map-wrap { position: relative; flex: 1; min-height: 0; }
  #japan { width: 100%; height: 100%; display: block; }
  #japan path.pref { stroke: var(--paper); stroke-width: 1.2; vector-effect: non-scaling-stroke; cursor: pointer;
    transition: filter .2s, opacity .4s; }
  #japan path.pref:hover { filter: brightness(1.08) drop-shadow(0 3px 4px rgba(0,0,0,.2)); }
  #japan.zooming path.pref:not(.active) { opacity: .25; }
  #japan .visited-mark { pointer-events: none; }
  #japan path.pref.visited:not(.gold) { filter: saturate(1.5) brightness(.9); }
  #japan path.pref.gold { stroke: #FFF6D8; animation: goldGlow 2.4s ease-in-out infinite alternate; }
  @keyframes goldGlow { from { filter: drop-shadow(0 0 2px rgba(233,180,60,.5)); } to { filter: drop-shadow(0 0 9px rgba(255,200,70,.95)); } }
  .map-hint { position: absolute; left: 50%; bottom: max(22px, env(safe-area-inset-bottom)); transform: translateX(-50%);
    background: var(--ink); color: #fff; font-size: 13px; padding: 10px 18px; border-radius: 999px; white-space: nowrap;
    box-shadow: 0 8px 20px rgba(0,0,0,.18); letter-spacing: .05em; pointer-events: none; }
  .region-back { position: absolute; top: 8px; left: 16px; border: 1px solid var(--line); background: #fff; border-radius: 999px;
    padding: 8px 14px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,.08); opacity: 0; pointer-events: none; transition: opacity .3s; }
  .region-back.show { opacity: 1; pointer-events: auto; }
  #japan.in-region path.pref.other { opacity: .3; }
  #pref-tip { position: absolute; pointer-events: none; background: #fff; border: 1px solid var(--line); border-radius: 10px;
    padding: 6px 10px; font-size: 13px; font-weight: 700; box-shadow: 0 6px 16px rgba(0,0,0,.12); opacity: 0; transition: opacity .15s; white-space: nowrap; }

  /* ---------- 街画面 ---------- */
  #town-screen { background: #000; }
  #town-scroll { position: absolute; inset: 0; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; overscroll-behavior: contain; }
  #town-scroll::-webkit-scrollbar { display: none; }
  #town-svg { height: 100%; display: block; }
  .town-top { position: absolute; top: 0; left: 0; right: 0; padding: max(14px, env(safe-area-inset-top)) 16px 30px;
    display: flex; align-items: flex-start; gap: 12px; pointer-events: none;
    background: linear-gradient(rgba(0,0,0,.35), transparent); color: #fff; }
  .town-top > * { pointer-events: auto; }
  .back-btn { width: 42px; height: 42px; border-radius: 50%; border: 0; background: rgba(255,255,255,.92); color: var(--ink);
    font-size: 20px; display: grid; place-items: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
  .town-title { flex: 1; min-width: 0; text-shadow: 0 2px 8px rgba(0,0,0,.35); }
  .town-title .region { font-size: 11px; letter-spacing: .3em; opacity: .9; }
  .town-title h2 { margin: 2px 0 0; font-size: 28px; font-weight: 800; letter-spacing: .1em; line-height: 1.1; }
  .time-switch { display: flex; background: rgba(255,255,255,.92); border-radius: 999px; padding: 3px; box-shadow: 0 4px 12px rgba(0,0,0,.2); }
  .time-switch button { border: 0; background: none; width: 34px; height: 34px; border-radius: 50%; font-size: 16px; opacity: .45; transition: .2s; }
  .time-switch button.on { background: var(--ink); opacity: 1; }
  .town-hint { position: absolute; left: 50%; bottom: max(20px, env(safe-area-inset-bottom)); transform: translateX(-50%);
    display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.95); color: var(--ink); border: 0;
    padding: 12px 20px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 8px 24px rgba(0,0,0,.25); white-space: nowrap; }
  .town-hint .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: blink 1.2s infinite; }
  @keyframes blink { 50% { opacity: .2; } }

  /* 街のアニメーション */
  .cloud { animation: drift linear infinite; }
  @keyframes drift { from { transform: translateX(-300px); } to { transform: translateX(1900px); } }
  .walker { animation: walk linear infinite; }
  @keyframes walk { from { transform: translateX(var(--from)); } to { transform: translateX(var(--to)); } }
  .bob { animation: bob .5s ease-in-out infinite alternate; }
  @keyframes bob { to { transform: translateY(-2px); } }
  .smoke { animation: smoke 4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes smoke { 0% { transform: translate(0,0) scale(.6); opacity: 0; } 20% { opacity: .7; } 100% { transform: translate(30px,-90px) scale(1.8); opacity: 0; } }
  .twinkle { animation: blink 2.4s ease-in-out infinite; }
  .pin { animation: pin 1.1s ease-in-out infinite; }
  @keyframes pin { 50% { transform: translateY(-10px); } }
  .ripple { animation: ripple 1.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes ripple { from { transform: scale(.4); opacity: .9; } to { transform: scale(1.6); opacity: 0; } }
  .sway { animation: sway 3s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: top center; }
  @keyframes sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
  .wave { animation: wave 6s ease-in-out infinite alternate; }
  @keyframes wave { to { transform: translateX(-40px); } }
  .brewery { cursor: pointer; }
  .brewery:hover .kura-body { filter: brightness(1.06); }

  /* ---------- ジオラマ（画像）表示 ---------- */
  #diorama { position: absolute; inset: 0; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: background 1s; }
  #diorama[hidden] { display: none; }
  #diorama.morning { background: radial-gradient(circle at 50% 40%, #FFF6EA, #E9DCCB 70%); }
  #diorama.day     { background: radial-gradient(circle at 50% 40%, #F4F8FB, #D5E3EE 70%); }
  #diorama.evening { background: radial-gradient(circle at 50% 40%, #FBD9C0, #B9849A 75%); }
  #diorama.night   { background: radial-gradient(circle at 50% 40%, #2A3466, #0B1026 75%); }
  .dio-stage { position: relative; width: min(92vw, 58vh, 600px); aspect-ratio: 1; perspective: 1200px; margin-top: 40px; }
  .dio-float { position: absolute; inset: 0; animation: dioFloat 6s ease-in-out infinite; }
  @keyframes dioFloat { 50% { transform: translateY(-10px); } }
  .dio-tilt { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform .35s cubic-bezier(.2,.8,.3,1); --inv: 1; }
  .dio-tilt.dragging { transition: none; }
  #diorama { touch-action: none; cursor: grab; }
  #diorama:active { cursor: grabbing; }
  .dio-pin { scale: var(--inv); transform-origin: 50% 100%; }
  .dio-scene, .dio-part { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; transition: opacity .6s; }
  .dio-scene { opacity: 0; filter: drop-shadow(0 18px 24px rgba(0,0,0,.2)); }
  #dio-img { transition: opacity .6s; }
  .dio-flash { position: absolute; inset: 0; pointer-events: none; opacity: 0; mix-blend-mode: screen;
    -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
  .dio-night { display: none !important; }
  /* 季節ごとの背景 */
  #diorama.day[data-season="spring"] { background: radial-gradient(circle at 50% 40%, #FFF4F6, #F1DCE2 72%); }
  #diorama.day[data-season="summer"] { background: radial-gradient(circle at 50% 35%, #F2FAFF, #CFE6F2 72%); }
  #diorama.day[data-season="autumn"] { background: radial-gradient(circle at 50% 40%, #FFF4E6, #EED6BC 72%); }
  #diorama.day[data-season="winter"] { background: radial-gradient(circle at 50% 40%, #F7FAFD, #DCE4EE 72%); }
  #diorama.night { background: radial-gradient(circle at 50% 30%, #1E2A55, #070B1C 75%) !important; }
  #diorama.night .dio-cloud, #diorama.night .bird { display: none; }
  #diorama.night .dio-clock { color: rgba(255,255,255,.8); }
  #diorama.night .dio-shadow { background: rgba(255,190,110,.18); }
  #diorama.fallback.night img { filter: brightness(.45) saturate(.8) hue-rotate(10deg); }
  .dio-sky, .dio-fireworks { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .dio-sky .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff; animation: blink 3.5s ease-in-out infinite; }
  .dio-sky .moon { position: absolute; width: 54px; height: 54px; border-radius: 50%; background: #FFF6DA;
    filter: drop-shadow(0 0 14px rgba(255,240,200,.7)) drop-shadow(0 0 40px rgba(255,240,200,.25)); }
  .dio-sky .moon.half { background: linear-gradient(90deg, transparent 50%, #FFF6DA 50%); }
  .dio-sky .moon.crescent { background: transparent; box-shadow: inset -13px 5px 0 0 #FFF6DA; }
  .dio-modes { position: absolute; left: 14px; bottom: max(84px, calc(env(safe-area-inset-bottom) + 76px)); display: flex; flex-direction: column; gap: 6px; z-index: 3;
    background: rgba(255,255,255,.9); border-radius: 999px; padding: 5px; box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .dio-modes button { width: 34px; height: 34px; border-radius: 50%; border: 0; background: none; font-family: "Shippori Mincho", serif; font-weight: 800; font-size: 15px; color: var(--muted); }
  .dio-modes button.on { background: var(--ink); color: #fff; }
  .dio-modes .night-btn { font-size: 16px; border-top: 1px solid var(--line); border-radius: 50%; }
  .dio-stage { z-index: 1; }
  .dio-water { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .dio-cloud { position: absolute; inset: 0; pointer-events: none; opacity: .5;
    background: radial-gradient(ellipse 22% 14% at 30% 40%, rgba(40,50,70,.55), transparent 70%),
                radial-gradient(ellipse 18% 11% at 75% 65%, rgba(40,50,70,.45), transparent 70%);
    background-size: 200% 200%; animation: cloudMove 26s linear infinite;
    -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; mix-blend-mode: multiply; }
  @keyframes cloudMove { from { background-position: 120% -20%; } to { background-position: -120% 120%; } }
  .dio-tools { position: absolute; right: 14px; bottom: max(84px, calc(env(safe-area-inset-bottom) + 76px)); display: flex; flex-direction: column; gap: 8px; z-index: 3; }
  .dio-tools button { width: 42px; height: 42px; border-radius: 50%; border: 0; background: rgba(255,255,255,.94); font-size: 18px; font-weight: 800; color: var(--ink);
    box-shadow: 0 4px 12px rgba(0,0,0,.18); }
  .dio-tools button:active { transform: scale(.92); }
  .help-btn { width: 42px; height: 42px; border-radius: 50%; border: 0; background: rgba(255,255,255,.92); color: var(--ink); font-size: 18px; font-weight: 800;
    box-shadow: 0 4px 12px rgba(0,0,0,.2); flex-shrink: 0; }
  .dio-tilt img { width: 100%; height: 100%; object-fit: contain; display: block; transition: filter 1s; user-select: none; -webkit-user-drag: none;
    filter: drop-shadow(0 18px 24px rgba(0,0,0,.18)); }
  #diorama.morning img { filter: sepia(.12) saturate(1.1) brightness(1.03) drop-shadow(0 18px 24px rgba(0,0,0,.18)); }
  #diorama.evening img { filter: sepia(.35) saturate(1.35) hue-rotate(-12deg) brightness(.88) drop-shadow(0 18px 24px rgba(0,0,0,.25)); }
  #diorama.night img   { filter: brightness(.42) saturate(.75) hue-rotate(12deg) contrast(1.1) drop-shadow(0 0 30px rgba(120,150,255,.25)); }
  .dio-night { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 1s; }
  #diorama.night .dio-night, #diorama.evening .dio-night { opacity: 1; }
  #diorama.evening .dio-night { opacity: .55; }
  .dio-night i { position: absolute; width: 18%; aspect-ratio: 1; margin: -9% 0 0 -9%; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,200,110,.75), rgba(255,200,110,0) 65%); mix-blend-mode: screen; animation: flicker 3s ease-in-out infinite alternate; }
  @keyframes flicker { 50% { opacity: .75; } }
  .dio-shadow { position: absolute; left: 14%; right: 14%; bottom: -2%; height: 8%; border-radius: 50%; background: rgba(0,0,0,.25); filter: blur(14px);
    animation: dioShadow 6s ease-in-out infinite; }
  @keyframes dioShadow { 50% { transform: scale(.92); opacity: .7; } }
  .dio-fx { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .dio-fx .puff { position: absolute; width: 5%; aspect-ratio: 1; border-radius: 50%; background: rgba(255,255,255,.85); filter: blur(2px);
    animation: puff 4.5s ease-out infinite; }
  @keyframes puff { 0% { transform: translate(-50%,-50%) scale(.4); opacity: 0; } 15% { opacity: .9; } 100% { transform: translate(60%,-420%) scale(2.6); opacity: 0; } }
  .dio-fx .bird { position: absolute; font-size: 12px; color: #333; opacity: .7; animation: fly linear infinite; }
  @keyframes fly { from { transform: translate(-10vw, 0); } to { transform: translate(110vw, -40px); } }
  .dio-pin { position: absolute; width: 48px; height: 60px; margin: -60px 0 0 -24px; border: 0; background: none; padding: 0; animation: pin 1.1s ease-in-out infinite; }
  .dio-pin .mark { position: absolute; inset: 0 0 12px; display: grid; place-items: center; color: #fff; font-size: 20px; font-weight: 800;
    background: #B8322A; border: 3px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 6px 14px rgba(0,0,0,.3); }
  .dio-pin .mark b { transform: rotate(45deg); line-height: 1; }
  .dio-pin.food { animation-delay: -.55s; }
  .dio-pin.food .mark { background: #2F7A55; }
  .dio-pin[hidden] { display: none; }
  .pin-chip { position: absolute; left: 50%; top: -30px; transform: translateX(-50%); white-space: nowrap; background: rgba(255,255,255,.95); color: var(--ink);
    font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; box-shadow: 0 3px 10px rgba(0,0,0,.2); pointer-events: none; }
  .pin-chip:empty { display: none; }
  /* お店の産地の県：ジオラマのまわりに金色のきらめき */
  .dio-sparkle { position: absolute; inset: -6%; pointer-events: none; display: none; }
  #diorama.gold .dio-sparkle { display: block; }
  .dio-sparkle i { position: absolute; width: 10px; height: 10px; background: #FFE08A; clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
    filter: drop-shadow(0 0 4px #FFC940); animation: sparkle 2.6s ease-in-out infinite; }
  @keyframes sparkle { 0%, 100% { transform: scale(0) rotate(0); opacity: 0; } 50% { transform: scale(1.3) rotate(90deg); opacity: 1; } }
  #diorama.gold .dio-shadow { background: rgba(214,160,40,.55); }
  .gold-ribbon { position: absolute; top: max(78px, calc(env(safe-area-inset-top) + 64px)); left: 50%; transform: translateX(-50%); white-space: nowrap;
    background: linear-gradient(90deg, #B07F22, #F3D27A, #B07F22); color: #3A2A08; font-size: 12px; font-weight: 800; letter-spacing: .1em;
    padding: 6px 16px; border-radius: 999px; box-shadow: 0 4px 14px rgba(176,127,34,.4); pointer-events: none; }
  .gold-ribbon[hidden] { display: none; }
  .dio-pin .ring { position: absolute; left: 50%; bottom: -6px; width: 56px; height: 20px; margin-left: -28px; border-radius: 50%; border: 3px solid #fff;
    animation: ripple 1.8s ease-out infinite; }
  .dio-info { padding: 0 62px; margin: 28px 0 70px; display: flex; flex-direction: column; align-items: center; gap: 8px; pointer-events: none; }
  .dio-clock { font-size: 13px; letter-spacing: .1em; color: rgba(31,27,22,.7); font-weight: 700; }
  #diorama.night .dio-clock, #diorama.evening .dio-clock { color: rgba(255,255,255,.8); }
  .dio-spots { background: rgba(31,27,22,.55); color: #fff; font-size: 13px; padding: 8px 14px; border-radius: 999px; backdrop-filter: blur(6px); max-width: 90vw; text-align: center; }
  .dio-spots:empty { display: none; }

  /* ---------- オープニング ---------- */
  .head-right { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .help-btn.small { width: 34px; height: 34px; font-size: 15px; border: 1px solid var(--line); box-shadow: none; }
  #intro { position: fixed; inset: 0; z-index: 80; background: radial-gradient(circle at 50% 35%, #FFF8EC, #EADFCB); display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: max(20px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom)); }
  #intro[hidden] { display: none; }
  .intro-bars { position: absolute; top: max(14px, env(safe-area-inset-top)); left: 16px; right: 100px; display: flex; gap: 6px; }
  .intro-bars i { flex: 1; height: 4px; border-radius: 4px; background: rgba(31,27,22,.15); overflow: hidden; }
  .intro-bars b { display: block; height: 100%; width: 0; background: var(--accent); }
  .intro-bars i.done b { width: 100%; }
  .intro-bars i.now b { animation: bar 2.5s linear forwards; }
  @keyframes bar { to { width: 100%; } }
  .intro-skip { position: absolute; top: max(6px, env(safe-area-inset-top)); right: 12px; border: 0; background: none; font-size: 13px; font-weight: 700; color: var(--muted); padding: 8px; }
  .intro-stage { position: relative; width: min(86vw, 52vh, 460px); aspect-ratio: 1; }
  .intro-scene { position: absolute; inset: 0; opacity: 0; transition: opacity .35s; }
  .intro-scene.on { opacity: 1; }
  .intro-map { width: 100%; height: 100%; }
  .intro-map path { stroke: #F4EFE4; stroke-width: 2; }
  .intro-map.dim path:not(.gold) { opacity: .35; }
  .intro-finger { position: absolute; font-size: 44px; filter: drop-shadow(0 4px 6px rgba(0,0,0,.25)); opacity: 0; }
  .intro-scene.on .intro-finger { animation: fingerTap 2.5s ease-in-out forwards; }
  @keyframes fingerTap { 0% { opacity: 0; transform: translate(60px, 80px); } 30% { opacity: 1; transform: translate(0, 0); }
    45% { transform: translate(0, 0) scale(.85); } 55% { transform: translate(0, 0) scale(1); } 100% { opacity: 1; } }
  .intro-dio { position: absolute; inset: 6%; width: 88%; height: 88%; object-fit: contain; opacity: 0; transform: scale(.3); }
  .intro-scene.on .intro-dio { animation: dioPop 2.5s ease forwards; }
  @keyframes dioPop { 0%, 48% { opacity: 0; transform: scale(.25) translateY(30px); } 70% { opacity: 1; transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); } }
  .intro-dio.still { opacity: 1; transform: none; animation: none !important; }
  .intro-pin { position: absolute; left: 50%; top: 40%; width: 46px; height: 46px; margin: -46px 0 0 -23px; background: #B8322A; color: #fff; border: 3px solid #fff;
    border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: grid; place-items: center; font-family: "Shippori Mincho", serif; font-weight: 800; font-size: 19px;
    box-shadow: 0 6px 14px rgba(0,0,0,.3); }
  .intro-pin::first-line { line-height: 1; }
  .intro-finger.tap3 { left: 50%; top: 38%; }
  .intro-card { position: absolute; left: 8%; right: 8%; bottom: 2%; background: #fff; border-radius: 18px; padding: 14px 16px; box-shadow: 0 -6px 24px rgba(0,0,0,.18);
    display: flex; flex-direction: column; gap: 4px; opacity: 0; transform: translateY(40px); }
  .intro-scene.on .intro-card { animation: cardUp 2.5s ease forwards; }
  @keyframes cardUp { 0%, 52% { opacity: 0; transform: translateY(50px); } 72%, 100% { opacity: 1; transform: none; } }
  .intro-card small { color: var(--accent); font-weight: 700; font-size: 11px; letter-spacing: .15em; }
  .intro-card b { font-size: 20px; }
  .intro-card span { font-size: 13px; color: var(--muted); }
  .intro-cap { min-height: 3.2em; margin: 22px 0 10px; font-size: 18px; font-weight: 800; text-align: center; line-height: 1.6; letter-spacing: .04em; }
  .intro-start { visibility: hidden; border: 0; background: var(--accent); color: #fff; font-weight: 800; font-size: 16px; padding: 14px 44px; border-radius: 999px;
    box-shadow: 0 8px 20px rgba(184,50,42,.3); }
  .intro-start.show { visibility: visible; animation: stampIn .4s both; }

  #particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .flake { position: absolute; top: -20px; border-radius: 50%; background: #fff; opacity: .85; animation: fall linear infinite; }
  .leaf { position: absolute; top: -20px; width: 10px; height: 7px; border-radius: 10px 0; animation: fall linear infinite; }
  @keyframes fall { to { transform: translate(var(--dx), 110vh) rotate(540deg); } }

  /* 画面切り替え用の幕 */
  #curtain { position: fixed; inset: 0; background: var(--paper); opacity: 0; pointer-events: none; transition: opacity .45s ease; z-index: 50; }
  #curtain.show { opacity: 1; }

  /* ---------- お酒シート ---------- */
  #sheet-bg { position: fixed; inset: 0; background: rgba(20,15,10,.45); opacity: 0; pointer-events: none; transition: opacity .35s; z-index: 60; }
  #sheet-bg.show { opacity: 1; pointer-events: auto; }
  #sheet { position: fixed; left: 50%; bottom: 0; width: min(560px, 100%); max-height: 92vh; overflow-y: auto;
    transform: translate(-50%, 105%); transition: transform .5s cubic-bezier(.2,.9,.25,1); z-index: 61;
    background: var(--paper); border-radius: 26px 26px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,.25);
    padding: 10px 22px max(24px, env(safe-area-inset-bottom)); }
  #sheet.show { transform: translate(-50%, 0); }
  .grip { width: 44px; height: 5px; border-radius: 9px; background: var(--line); margin: 0 auto 14px; }
  .sheet-close { position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: #fff; font-size: 16px; }
  .sake-hero { display: flex; gap: 18px; align-items: flex-end; }
  .bottle { width: 110px; flex-shrink: 0; filter: drop-shadow(0 10px 14px rgba(0,0,0,.18)); }
  .sake-hero .eyebrow { font-size: 12px; color: var(--accent); font-weight: 700; letter-spacing: .2em; }
  .sake-name { font-size: 34px; font-weight: 800; margin: 4px 0 6px; line-height: 1.15; letter-spacing: .04em; }
  .sake-brew { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .tag { display: inline-block; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: var(--ink); color: #fff; margin-top: 8px; }
  .sake-note { font-size: 15px; line-height: 1.9; margin: 18px 0; padding: 14px 16px; background: #fff; border-radius: var(--radius); border: 1px solid var(--line); }
  .sake-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cell { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 14px; }
  .cell h4 { margin: 0 0 6px; font-size: 11px; color: var(--muted); letter-spacing: .15em; font-weight: 700; }
  .cell p { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.5; }
  .taste { grid-column: 1 / -1; }
  .taste-map { position: relative; height: 150px; margin-top: 6px; border-radius: 12px;
    background: linear-gradient(90deg, #FBE7D5, #fff 50%, #DCEAF5); }
  .taste-map::before, .taste-map::after { content: ""; position: absolute; background: var(--line); }
  .taste-map::before { left: 50%; top: 8px; bottom: 8px; width: 1px; }
  .taste-map::after { top: 50%; left: 8px; right: 8px; height: 1px; }
  .axis { position: absolute; font-size: 11px; color: var(--muted); font-weight: 700; }
  .taste-dot { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%; background: var(--accent);
    border: 3px solid #fff; box-shadow: 0 3px 10px rgba(184,50,42,.5); transition: left .6s .2s, top .6s .2s; z-index: 1; }
  /* お店のこだわり食材 */
  .store-eyebrow { font-size: 12px; color: var(--accent); font-weight: 700; letter-spacing: .15em; }
  .store-heading { font-size: 21px; font-weight: 800; margin: 4px 0 16px; line-height: 1.4; }
  .item-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; display: flex; gap: 14px; }
  .item-icon { width: 54px; height: 54px; flex-shrink: 0; border-radius: 16px; display: grid; place-items: center; font-size: 28px;
    background: color-mix(in srgb, var(--accent) 10%, #fff); }
  .item-kind { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .1em; }
  .item-name { font-size: 19px; font-weight: 800; margin: 2px 0; }
  .item-from { font-size: 13px; color: var(--muted); }
  .item-note { font-size: 14px; line-height: 1.8; margin: 8px 0 0; }
  .item-menu { display: inline-flex; gap: 6px; align-items: center; margin-top: 10px; font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 999px;
    background: var(--ink); color: #fff; }
  .item-season { font-size: 12px; color: var(--accent); font-weight: 700; margin-left: 8px; }
  .item-list { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 4px 16px; margin-bottom: 12px; }
  .item-row { display: grid; grid-template-columns: 28px 1fr auto; gap: 10px; align-items: baseline; padding: 12px 0; border-bottom: 1px dashed var(--line); }
  .item-row:last-child { border-bottom: 0; }
  .item-row .r-name { font-weight: 800; }
  .item-row .r-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .item-row .r-menu { font-size: 12px; font-weight: 700; text-align: right; }
  .section-title { font-size: 13px; font-weight: 700; color: var(--muted); letter-spacing: .15em; margin: 22px 0 10px; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ""; flex: 1; height: 1px; background: var(--line); }
  .pairing { margin-top: 14px; padding: 14px 16px; border-radius: var(--radius); background: var(--ink); color: #fff; font-size: 14px; line-height: 1.7; }
  .pairing b { color: #F2C76E; }
  .disclaimer { font-size: 11px; color: var(--muted); margin: 14px 0 0; line-height: 1.6; }
  .stamped { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding: 12px 14px; border: 2px dashed var(--accent); border-radius: var(--radius); color: var(--accent); font-weight: 700; font-size: 14px; }
  .stamped .seal { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--accent); display: grid; place-items: center; font-family: "Shippori Mincho", serif; font-size: 18px; transform: rotate(-10deg); animation: stampIn .5s .3s both cubic-bezier(.3,1.6,.5,1); }
  @keyframes stampIn { from { transform: scale(2.2) rotate(-10deg); opacity: 0; } }

  @media (min-width: 900px) {
    .logo { font-size: 38px; }
    .map-head { padding: 28px 40px 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; transition-duration: 0.001s !important; }
  }
</style>
</head>
<body>

<!-- ===== 1. 日本地図 ===== -->
<section id="map-screen" class="screen">
  <header class="map-head">
    <div>
      <h1 class="logo mincho">名産地MAP<small>～美味しいを巡る食道楽～</small></h1>
      <div class="store-badge" id="store-badge"></div>
    </div>
    <div class="head-right">
      <div class="stamp-count" title="訪れた県"><b id="stamp-num">0</b><span>/ 47 県</span></div>
      <button class="help-btn small" id="map-help" aria-label="遊び方">？</button>
    </div>
  </header>
  <div id="map-wrap">
    <svg id="japan" viewBox="0 0 1640 1490" preserveAspectRatio="xMidYMid meet" aria-label="日本地図">
      <defs>
        <!-- お店の産地の県：金色にきらめく -->
        <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="260" spreadMethod="reflect">
          <stop offset="0" stop-color="#B07F22"/><stop offset=".35" stop-color="#E9C35A"/><stop offset=".5" stop-color="#FFF3C4"/>
          <stop offset=".65" stop-color="#E9C35A"/><stop offset="1" stop-color="#B07F22"/>
          <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="520 520" dur="5s" repeatCount="indefinite"/>
        </linearGradient>
      </defs>
      <g id="prefs"></g>
      <g id="okinawa"></g>
      <g id="marks"></g>
      <g id="labels" style="pointer-events:none"></g>
      <g id="flight" style="pointer-events:none"></g>
    </svg>
    <div id="pref-tip"></div>
    <button class="region-back" id="region-back">← 全国</button>
    <div class="map-hint" id="map-hint">県をタップして、街へ出かけよう</div>
  </div>
</section>

<!-- ===== 2. 街並み ===== -->
<section id="town-screen" class="screen hidden">
  <!-- ジオラマ画像がある県はこちらで表示 -->
  <div id="diorama" hidden>
    <div class="dio-sky" id="dio-sky"></div>
    <canvas class="dio-fireworks" id="dio-fireworks" width="800" height="900"></canvas>
    <div class="dio-modes" id="dio-modes">
      <button data-season="spring">春</button>
      <button data-season="summer">夏</button>
      <button data-season="autumn">秋</button>
      <button data-season="winter">冬</button>
      <button data-act="night" class="night-btn" aria-label="昼と夜を切り替え">🌙</button>
    </div>
    <div class="dio-stage" id="dio-stage">
      <div class="dio-float">
        <div class="dio-tilt" id="dio-tilt">
          <img id="dio-img" alt="" draggable="false">
          <canvas class="dio-scene" id="dio-scene" width="1024" height="1024"></canvas>
          <canvas class="dio-water" id="dio-water" width="1024" height="1024"></canvas>
          <div class="dio-cloud" id="dio-cloud"></div>
          <canvas class="dio-part" id="dio-part" width="1024" height="1024"></canvas>
          <div class="dio-flash" id="dio-flash"></div>
          <div class="dio-night" id="dio-night"></div>
          <div class="dio-fx" id="dio-fx"></div>
          <div class="dio-sparkle" id="dio-sparkle"></div>
          <button class="dio-pin sake" id="dio-pin" aria-label="お酒のおすすめを見る"><span class="ring"></span><span class="mark mincho"><b>酒</b></span><span class="pin-chip" id="dio-pin-chip"></span></button>
          <button class="dio-pin food" id="dio-pin-food" aria-label="フードのおすすめを見る"><span class="ring"></span><span class="mark mincho"><b>食</b></span><span class="pin-chip" id="dio-food-chip"></span></button>
        </div>
      </div>
      <div class="dio-shadow"></div>
    </div>
    <div class="dio-tools" id="dio-tools">
      <button data-act="rotl" aria-label="左に回す">⟲</button>
      <button data-act="out" aria-label="縮小">－</button>
      <button data-act="reset" aria-label="元に戻す">◎</button>
      <button data-act="in" aria-label="拡大">＋</button>
      <button data-act="rotr" aria-label="右に回す">⟳</button>
    </div>
    <div class="dio-info">
      <div class="dio-clock" id="dio-clock"></div>
      <div class="dio-spots" id="dio-spots"></div>
    </div>
  </div>
  <div id="town-scroll"><svg id="town-svg" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMax slice"></svg></div>
  <div id="particles"></div>
  <div class="town-top">
    <button class="back-btn" id="back-btn" aria-label="地図にもどる">←</button>
    <div class="town-title">
      <div class="region" id="town-region"></div>
      <h2 class="mincho" id="town-name"></h2>
    </div>
    <button class="help-btn" id="town-help" aria-label="遊び方">？</button>
  </div>
  <div class="gold-ribbon" id="gold-ribbon" hidden></div>
  <button class="town-hint" id="town-hint"><span class="dot"></span><span id="town-hint-text">ピンをタップしてみよう</span></button>
</section>

<div id="curtain"></div>

<!-- ===== オープニング：遊び方（3コマ × 2.5秒） ===== -->
<div id="intro" hidden>
  <div class="intro-bars"><i><b></b></i><i><b></b></i><i><b></b></i></div>
  <button class="intro-skip" id="intro-skip">スキップ</button>
  <div class="intro-stage">
    <!-- 1. 地図 -->
    <div class="intro-scene" data-n="0">
      <svg class="intro-map" id="intro-map" viewBox="0 0 1640 1490"></svg>
      <div class="intro-finger" id="intro-finger">👆</div>
    </div>
    <!-- 2. 飛行機 → ジオラマ -->
    <div class="intro-scene" data-n="1">
      <svg class="intro-map dim" id="intro-map2" viewBox="0 0 1640 1490"></svg>
      <img class="intro-dio" id="intro-dio" alt="">
    </div>
    <!-- 3. ピン → おすすめ -->
    <div class="intro-scene" data-n="2">
      <img class="intro-dio still" id="intro-dio2" alt="">
      <div class="intro-pin">酒</div>
      <div class="intro-finger tap3">👆</div>
      <div class="intro-card"><small>当店のこだわり</small><b class="mincho">地酒 × 港町の牡蠣</b><span>🍽 焼き牡蠣と一緒にどうぞ</span></div>
    </div>
  </div>
  <p class="intro-cap mincho" id="intro-cap"></p>
  <button class="intro-start" id="intro-start">はじめる</button>
</div>

<!-- ===== 3. おすすめのお酒 ===== -->
<div id="sheet-bg"></div>
<article id="sheet" aria-modal="true" role="dialog">
  <div class="grip"></div>
  <button class="sheet-close" id="sheet-close" aria-label="閉じる">✕</button>
  <div id="sheet-body"></div>
</article>

<script>
  // うまく表示されないときに原因が分かるよう、エラーを画面に出す
  window.addEventListener('error', function (e) {
    var box = document.getElementById('load-error') || document.body.appendChild(Object.assign(document.createElement('pre'), { id: 'load-error' }));
    box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:999;background:#fff3f3;color:#a00;border:1px solid #e99;border-radius:10px;padding:10px;font-size:12px;white-space:pre-wrap;max-height:40vh;overflow:auto';
    var where = e.target && e.target.src ? '読み込めないファイル: ' + e.target.src : (e.message + '  (' + (e.filename || '').split('/').pop() + ':' + e.lineno + ')');
    box.textContent += '⚠ ' + where + '\n';
  }, true);
</script>
<script src="japan-map.js"></script>
<script src="sake-data.js"></script>
<script src="diorama-data.js"></script>
<script src="store.js"></script>
<script src="motion-data.js"></script>
<script src="look.js"></script>
<script>
/* =========================================================
   共通
   ========================================================= */
const $ = id => document.getElementById(id);
const VISITED_KEY = 'sakemachi-visited';
let visited = new Set();
try { visited = new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || '[]')); } catch (e) {}
function saveVisited() { try { localStorage.setItem(VISITED_KEY, JSON.stringify([...visited])); } catch (e) {} }

const shortPref = p => p === '北海道' ? '北海道' : p.replace(/[都府県]$/, '');
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a, b, t) => a + (b - a) * t;

function seededRandom(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/* =========================================================
   1. 日本地図
   ========================================================= */
const FULL_VIEW = [0, 0, 1640, 1490];
// 沖縄県は本土の地図データに無いので、右下に枠で表示
const OKINAWA_PATH = "M1342,1418 1352,1402 1366,1394 1374,1380 1392,1368 1402,1350 1418,1342 1428,1326 1446,1316 1452,1300 1466,1296 1472,1306 1462,1318 1450,1334 1436,1346 1424,1362 1404,1376 1390,1392 1376,1404 1362,1420 1348,1428Z";

function renderMap() {
  const prefs = Object.entries(JAPAN_PREFECTURE_PATHS).map(([name, d]) => {
    const t = SAKE_BY_PREF[name];
    const gold = storeItems(name).length > 0;
    return `<path class="pref${gold ? ' gold' : ''}" d="${d}" data-pref="${name}" fill="${gold ? 'url(#gold)' : REGION_COLORS[t ? t.region : '中部']}"></path>`;
  }).join('');
  $('prefs').innerHTML = prefs;
  $('okinawa').innerHTML = `
    <rect x="1290" y="1270" width="220" height="190" rx="14" fill="none" stroke="#C9BEA9" stroke-dasharray="6 6" stroke-width="2"/>
    <text x="1300" y="1296" font-size="20" fill="#9A8F7E" font-family="Noto Sans JP">沖縄</text>
    <path class="pref${storeItems('沖縄県').length ? ' gold' : ''}" d="${OKINAWA_PATH}" data-pref="沖縄県" fill="${storeItems('沖縄県').length ? 'url(#gold)' : REGION_COLORS['九州']}"></path>`;
  renderMarks();
}

// お店の設定を画面に反映
const storeItems = pref => (STORE.items && STORE.items[pref]) || [];
// その県で出すピン（お酒・フード）
function pinsFor(pref) {
  const items = storeItems(pref);
  return {
    sake: items.some(i => i.kind === 'sake') || STORE.showDefaultSake === true,
    food: items.some(i => i.kind !== 'sake'),
    foodIcon: (KINDS[(items.find(i => i.kind !== 'sake') || {}).kind] || KINDS.other).icon,
    foodName: (items.find(i => i.kind !== 'sake') || {}).name || '',
    sakeName: (items.find(i => i.kind === 'sake') || {}).name || ''
  };
}

function applyStore() {
  if (STORE.accent) document.documentElement.style.setProperty('--accent', STORE.accent);
  const prefs = Object.keys(STORE.items || {}).filter(p => storeItems(p).length);
  $('store-badge').innerHTML = STORE.name ? `${STORE.name}｜こだわりの産地 <b>${prefs.length}</b> 県` : '';
}

function renderMarks() {
  const svg = $('japan');
  let marks = '';
  svg.querySelectorAll('path.pref').forEach(p => {
    const name = p.dataset.pref;
    const items = storeItems(name);
    if (!visited.has(name)) return;
    const b = p.getBBox();
    // 一番大きな塊の中心に近い所にスタンプ
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const r = Math.max(5, Math.min(12, Math.min(b.width, b.height) * .2));
    p.classList.add('visited');
    marks += `<g class="visited-mark" transform="translate(${cx},${cy - r * 1.4}) rotate(-12)">
      <circle r="${r}" fill="rgba(255,255,255,.85)" stroke="#B8322A" stroke-width="2.5"/>
      <text text-anchor="middle" dominant-baseline="central" font-size="${r * 1.05}" fill="#B8322A" font-family="Shippori Mincho" font-weight="800">酒</text></g>`;
  });
  $('marks').innerHTML = marks;
  $('stamp-num').textContent = visited.size;
}

function setupMapEvents() {
  const svg = $('japan'), tip = $('pref-tip'), wrap = $('map-wrap');
  svg.addEventListener('pointermove', e => {
    const p = e.target.closest('path.pref');
    if (!p || e.pointerType !== 'mouse') { tip.style.opacity = 0; return; }
    const t = SAKE_BY_PREF[p.dataset.pref];
    const r = wrap.getBoundingClientRect();
    tip.innerHTML = `${p.dataset.pref}<span style="font-weight:400;color:#776E62;margin-left:8px">${t ? t.name : ''}</span>`;
    tip.style.left = (e.clientX - r.left + 14) + 'px';
    tip.style.top = (e.clientY - r.top + 14) + 'px';
    tip.style.opacity = 1;
  });
  svg.addEventListener('pointerleave', () => tip.style.opacity = 0);
  svg.addEventListener('click', e => {
    const p = e.target.closest('path.pref');
    if (!p || busy) return;
    // スマホでは「地方 → 県」の2段階で選ぶ（県が小さくて押しにくいため）
    const region = SAKE_BY_PREF[p.dataset.pref].region;
    if (SMALL_SCREEN.matches && regionView !== region && p.dataset.pref !== '沖縄県') zoomRegion(region);
    else openPrefecture(p);
  });
  $('region-back').addEventListener('click', () => !busy && zoomRegion(null));
}

const SMALL_SCREEN = matchMedia('(max-width: 700px)');
let regionView = null;

// 表示エリアの縦横比に合わせて、箱がちょうど収まる viewBox を作る
function fitBox(x, y, w, h, pad) {
  const r = $('japan').getBoundingClientRect();
  const aspect = r.width / r.height;
  w += pad * 2; h += pad * 2; x -= pad; y -= pad;
  if (w / h < aspect) { const nw = h * aspect; x -= (nw - w) / 2; w = nw; }
  else { const nh = w / aspect; y -= (nh - h) / 2; h = nh; }
  return [x, y, w, h];
}

async function zoomRegion(region) {
  busy = true;
  regionView = region;
  const svg = $('japan');
  svg.classList.toggle('in-region', !!region);
  svg.querySelectorAll('path.pref').forEach(p => p.classList.toggle('other', !!region && SAKE_BY_PREF[p.dataset.pref].region !== region));
  $('region-back').classList.toggle('show', !!region);
  $('map-hint').textContent = region ? `${region}地方｜県をタップして街へ` : '地方をタップして、街へ出かけよう';
  let view = FULL_VIEW;
  if (region) {
    let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
    svg.querySelectorAll('path.pref').forEach(p => {
      if (SAKE_BY_PREF[p.dataset.pref].region !== region || p.dataset.pref === '沖縄県') return;
      const b = p.getBBox();
      x1 = Math.min(x1, b.x); y1 = Math.min(y1, b.y); x2 = Math.max(x2, b.x + b.width); y2 = Math.max(y2, b.y + b.height);
    });
    view = fitBox(x1, y1, x2 - x1, y2 - y1, 30);
  }
  // 地方を拡大したときは県名を表示
  const fsz = view[2] / $('japan').getBoundingClientRect().width * 12;
  let labels = '';
  if (region) svg.querySelectorAll('path.pref').forEach(p => {
    if (SAKE_BY_PREF[p.dataset.pref].region !== region || p.dataset.pref === '沖縄県') return;
    const b = p.getBBox();
    labels += `<text x="${b.x + b.width / 2}" y="${b.y + b.height / 2}" text-anchor="middle" dominant-baseline="central" font-size="${fsz}" font-weight="700"
      fill="#1F1B16" stroke="#fff" stroke-width="${fsz / 4}" paint-order="stroke" font-family="Noto Sans JP">${p.dataset.pref.replace(/[都府県]$/, '')}</text>`;
  });
  $('labels').innerHTML = '';
  setTimeout(() => $('labels').innerHTML = labels, 650);
  await animateViewBox(view, 700);
  busy = false;
}

let busy = false;
function animateViewBox(to, ms) {
  const svg = $('japan');
  const from = svg.getAttribute('viewBox').split(/\s+/).map(Number);
  return new Promise(res => {
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / ms), k = ease(t);
      svg.setAttribute('viewBox', from.map((v, i) => lerp(v, to[i], k)).join(' '));
      t < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// 県の中心（地図上の座標）
function prefCenter(name) {
  const p = $('japan').querySelector(`path.pref[data-pref="${name}"]`);
  if (!p) return null;
  const b = p.getBBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
}

// 出発地から目的の県まで、飛行機が弧を描いて飛ぶ
function flyPlane(to) {
  const from = prefCenter(STORE.origin || '東京都');
  if (!from || !to) return Promise.resolve();
  const dx = to[0] - from[0], dy = to[1] - from[1], dist = Math.hypot(dx, dy);
  if (dist < 30) return Promise.resolve();          // 出発地と同じ県なら飛ばない
  const vb = $('japan').getAttribute('viewBox').split(/\s+/).map(Number);
  const u = vb[2] / 1640;                           // 表示の拡大率に合わせて大きさを変える
  // 弧の頂点（進行方向の左側＝上側にふくらませる）
  let nx = -dy / dist, ny = dx / dist; if (ny > 0) { nx = -nx; ny = -ny; }
  const lift = Math.min(260, dist * 0.35);
  const c = [(from[0] + to[0]) / 2 + nx * lift, (from[1] + to[1]) / 2 + ny * lift];
  const at = t => [(1-t)*(1-t)*from[0] + 2*(1-t)*t*c[0] + t*t*to[0], (1-t)*(1-t)*from[1] + 2*(1-t)*t*c[1] + t*t*to[1]];
  const g = $('flight');
  g.innerHTML = `
    <circle cx="${from[0]}" cy="${from[1]}" r="${7*u}" fill="#B8322A" stroke="#fff" stroke-width="${2.5*u}"/>
    <path id="fl-trail" fill="none" stroke="#B8322A" stroke-width="${3.5*u}" stroke-dasharray="${10*u} ${8*u}" stroke-linecap="round" opacity=".8"/>
    <g id="fl-target" transform="translate(${to[0]} ${to[1]})" opacity="0">
      <circle r="${26*u}" fill="none" stroke="#B8322A" stroke-width="${3*u}"><animate attributeName="r" values="${10*u};${34*u}" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite"/></circle>
      <circle r="${7*u}" fill="#B8322A" stroke="#fff" stroke-width="${2.5*u}"/></g>
    <g id="fl-shadow" opacity=".22"><ellipse rx="${28*u}" ry="${10*u}" fill="#000"/></g>
    <g id="fl-plane"><g transform="scale(${2.6*u})">
      <path d="M22,0 L14,-3 L2,-3 L-6,-17 L-11,-17 L-6,-3 L-14,-3 L-18,-9 L-21,-9 L-19,0 L-21,9 L-18,9 L-14,3 L-6,3 L-11,17 L-6,17 L2,3 L14,3 Z"
        fill="#fff" stroke="#1F1B16" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M14,-3 Q24,0 14,3" fill="#B8322A"/></g></g>`;
  const plane = $('fl-plane'), shadow = $('fl-shadow'), trail = $('fl-trail'), target = $('fl-target');
  const ms = Math.min(1900, 900 + dist * 1.4);
  return new Promise(res => {
    const start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / ms), k = ease(t);
      const [x, y] = at(k), [x2, y2] = at(Math.min(1, k + 0.01));
      const ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
      const alt = Math.sin(Math.PI * k);           // 離陸→上昇→着陸
      plane.setAttribute('transform', `translate(${x} ${y - alt * 18 * u}) rotate(${ang}) scale(${0.8 + alt * 0.5})`);
      shadow.setAttribute('transform', `translate(${x + alt * 10 * u} ${y + alt * 8 * u}) scale(${1 - alt * 0.4})`);
      let d = `M${from[0]},${from[1]}`;
      for (let i = 1; i <= 24; i++) { const [px, py] = at(k * i / 24); d += ` L${px},${py}`; }
      trail.setAttribute('d', d);
      target.setAttribute('opacity', Math.min(1, t * 3));
      t < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
}

async function openPrefecture(path) {
  busy = true;
  const name = path.dataset.pref;
  const svg = $('japan');
  $('pref-tip').style.opacity = 0;
  path.classList.add('active');
  $('labels').innerHTML = '';
  await flyPlane(prefCenter(name));
  svg.classList.add('zooming');
  const b = path.getBBox();
  const size = Math.max(b.width, b.height) * 1.6 + 40;
  await animateViewBox([b.x + b.width / 2 - size / 2, b.y + b.height / 2 - size / 2, size, size], 900);
  $('curtain').classList.add('show');
  await wait(450);
  showTown(SAKE_BY_PREF[name]);
  $('map-screen').classList.add('hidden');
  $('town-screen').classList.remove('hidden');
  $('curtain').classList.remove('show');
  busy = false;
}

async function backToMap() {
  if (busy) return;
  busy = true;
  closeSheet();
  $('curtain').classList.add('show');
  await wait(450);
  $('town-screen').classList.add('hidden');
  $('map-screen').classList.remove('hidden');
  $('particles').innerHTML = '';
  $('flight').innerHTML = '';
  stopWater(); LookFX.stop();
  renderMarks();
  $('curtain').classList.remove('show');
  if (regionView) {
    $('japan').classList.remove('zooming');
    $('japan').querySelectorAll('.active').forEach(p => p.classList.remove('active'));
    busy = false;
    return zoomRegion(regionView);
  }
  await animateViewBox(FULL_VIEW, 800);
  const svg = $('japan');
  svg.classList.remove('zooming');
  svg.querySelectorAll('.active').forEach(p => p.classList.remove('active'));
  busy = false;
}

/* =========================================================
   2. 街並み（SVG で描く）
   ========================================================= */
const W = 1600, H = 800, G = 640;          // G = 地面の高さ
const BX = 820, BW = 380;                   // 酒蔵の位置と幅

const TIMES = {
  morning: { skyA: '#86BDE6', skyB: '#FCE1BF', far: '#A7B6C8', near: '#8099A9', sea: '#86BAD2', tint: '#FFF1E2', sun: '#FFE8A6', light: 0.0, cloud: '#FFF6EC' },
  day:     { skyA: '#3C8ED8', skyB: '#C3E5F6', far: '#9BB3C8', near: '#6F9480', sea: '#3E8EC0', tint: '#FFFFFF', sun: '#FFF6C8', light: 0.0, cloud: '#FFFFFF' },
  evening: { skyA: '#2F3B78', skyB: '#F59A62', far: '#806786', near: '#4E4062', sea: '#C87F72', tint: '#F4BFA6', sun: '#FFB36B', light: 0.75, cloud: '#F7B79A' },
  night:   { skyA: '#060B22', skyB: '#29356A', far: '#1E2749', near: '#141A33', sea: '#1A2A50', tint: '#424B80', sun: '#FFF4CF', light: 1.0, cloud: '#3A4472' }
};

let current = null, currentTime = 'day';

function defaultTime() {
  return 'morning';     // 時間帯は「朝」に固定
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return 'morning';
  if (h >= 9 && h < 16) return 'day';
  if (h >= 16 && h < 19) return 'evening';
  return 'night';
}

function showTown(town) {
  current = town;
  $('town-name').textContent = town.pref;
  $('town-region').textContent = town.region + '地方';
  // 街を訪れたらスタンプ
  visited.add(town.pref); saveVisited();
  const pins = pinsFor(town.pref);
  const any = pins.sake || pins.food;
  $('town-hint').style.display = '';
  $('town-hint-text').textContent = any ? (pins.sake && pins.food ? 'お酒とフードのピンをタップ' : pins.food ? 'フードのピンをタップ' : 'お酒のピンをタップ')
    : 'ドラッグで回す・ピンチで拡大';
  const gold = storeItems(town.pref).length > 0;
  $('gold-ribbon').hidden = !gold;
  $('gold-ribbon').textContent = `✦ ${STORE.name || 'このお店'}の産地 ✦`;
  const dio = DIORAMAS[town.pref];
  dioMode = !!(dio && dio.img);
  $('diorama').hidden = !dioMode;
  $('town-scroll').style.display = dioMode ? 'none' : '';
  if (dioMode) setupDiorama(town, dio);
  setTime(defaultTime());
  // 酒蔵が画面の真ん中あたりに来るようにスクロール
  requestAnimationFrame(() => {
    const sc = $('town-scroll'), svg = $('town-svg');
    const scale = svg.clientHeight / H;
    // ピンが見える位置へ（酒だけ→酒蔵、食だけ→食ピン、両方→その間）
    const cx = pins.sake && pins.food ? (470 + BX + BW / 2) / 2 : pins.food ? 470 : BX + BW / 2;
    sc.scrollLeft = cx * scale - sc.clientWidth / 2;
  });
  makeParticles(town);
}

function setTime(t) {
  currentTime = t;
  document.querySelectorAll('#time-switch button').forEach(b => b.classList.toggle('on', b.dataset.time === t));
  if (dioMode) { $('diorama').classList.toggle('gold', storeItems(current.pref).length > 0); LookFX.render(); return; }
  const svg = $('town-svg');
  svg.innerHTML = drawTown(current, TIMES[t], t);
  svg.style.width = (svg.clientHeight * W / H) + 'px';
  const pins = pinsFor(current.pref);
  if (pins.sake) svg.querySelector('.brewery').addEventListener('click', () => openSheet(current, 'sake'));
  const fp = svg.querySelector('.foodpin');
  if (fp) fp.addEventListener('click', () => openSheet(current, 'food'));
}

function drawTown(town, C, time) {
  const rnd = seededRandom(town.pref);
  const f = new Set(town.features);
  const R = (a, b) => a + rnd() * (b - a);
  const midLights = [], frontLights = [];   // 夜に光る窓
  let lights = midLights;
  const autumn = [9, 10, 11].includes(new Date().getMonth() + 1);
  const night = time === 'night';
  let s = '';

  // ---- 空 ----
  s += `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skyA}"/><stop offset="1" stop-color="${C.skyB}"/></linearGradient>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sea}"/><stop offset="1" stop-color="${C.sea}" stop-opacity=".7"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient>
    <radialGradient id="sunGlow"><stop offset="0" stop-color="${C.sun}" stop-opacity=".8"/><stop offset="1" stop-color="${C.sun}" stop-opacity="0"/></radialGradient>
    <pattern id="namako" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="22" height="22" fill="#2E3238"/><rect x="0" y="0" width="22" height="3" fill="#E9E4D8"/><rect x="0" y="0" width="3" height="22" fill="#E9E4D8"/></pattern>
    <pattern id="tiles" width="12" height="10" patternUnits="userSpaceOnUse">
      <rect width="12" height="10" fill="#3B4048"/><rect x="0" width="2" height="10" fill="#2C3036"/></pattern>
    <filter id="tint" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <feFlood flood-color="${C.tint}"/><feComposite in2="SourceAlpha" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
  </defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;

  if (night) {
    for (let i = 0; i < 90; i++) {
      s += `<circle class="${i % 3 ? '' : 'twinkle'}" style="animation-delay:${R(0, 2)}s" cx="${R(0, W)}" cy="${R(0, 380)}" r="${R(.6, 2)}" fill="#fff" opacity="${R(.4, 1)}"/>`;
    }
  }
  // 太陽・月
  const sunPos = { morning: [260, 400, 46], day: [1250, 130, 40], evening: [1380, 470, 62], night: [1240, 140, 34] }[time];
  s += `<circle cx="${sunPos[0]}" cy="${sunPos[1]}" r="${sunPos[2] * 3}" fill="url(#sunGlow)"/>`;
  if (night) {
    s += `<circle cx="${sunPos[0]}" cy="${sunPos[1]}" r="${sunPos[2]}" fill="${C.sun}"/><circle cx="${sunPos[0] + 14}" cy="${sunPos[1] - 8}" r="${sunPos[2] * .9}" fill="${C.skyA}"/>`;
  } else {
    s += `<circle cx="${sunPos[0]}" cy="${sunPos[1]}" r="${sunPos[2]}" fill="${C.sun}"/>`;
  }
  // 雲
  for (let i = 0; i < 5; i++) {
    const y = R(60, 300), sc = R(.6, 1.3), dur = R(70, 140);
    s += `<g class="cloud" style="animation-duration:${dur}s;animation-delay:-${R(0, dur)}s" opacity="${night ? .5 : .9}">
      <g transform="translate(0 ${y}) scale(${sc})" fill="${C.cloud}">
        <ellipse cx="0" cy="0" rx="70" ry="22"/><ellipse cx="-30" cy="-12" rx="34" ry="24"/><ellipse cx="22" cy="-18" rx="40" ry="30"/></g></g>`;
  }

  // ---- 遠くの山 ----
  s += mountains(rnd, f.has('alps') ? 260 : 150, 470, C.far, f.has('alps'), f.has('snow') || f.has('alps'));
  if (f.has('fuji')) {
    s += `<path d="M300,${G - 60} L560,250 L620,250 L900,${G - 60}Z" fill="${C.far}"/>
      <path d="M520,305 L560,250 L620,250 L665,310 L640,300 L620,318 L598,300 L578,322 L556,302 L540,316Z" fill="#fff" opacity="${night ? .55 : .95}"/>`;
  }
  if (f.has('volcano')) s += volcano(1240, C, rnd);
  s += mountains(rnd, 70, 560, C.near, false, false);

  // ---- 海・湖 ----
  if (f.has('sea')) {
    s += `<rect x="0" y="${G - 95}" width="${W}" height="95" fill="url(#seaG)"/>`;
    for (let i = 0; i < 26; i++) {
      const x = R(0, W), y = R(G - 88, G - 10);
      s += `<path class="wave" style="animation-delay:-${R(0, 6)}s" d="M${x},${y} q10,-4 20,0 t20,0" stroke="#fff" stroke-width="2" fill="none" opacity="${night ? .25 : .5}"/>`;
    }
  }

  // ---- ここから建物（時間帯の色をまとめてかける） ----
  let t = '';
  // 名所
  const lm = town.features.find(x => LANDMARKS[x] && x !== 'volcano');
  if (lm) t += `<g transform="translate(320 ${G - 40}) scale(1.05)">${LANDMARKS[lm](rnd, f, lights, 320, G - 40, 1.05)}</g>`;
  if (lm === 'lighthouse' && night) lights.push({ beam: true, x: 320, y: G - 40 - 168 });

  // 中景の街
  for (let x = -20; x < W; x += R(40, 80)) {
    if (lm && x > 180 && x < 460) continue;
    const h = R(40, 110), w = R(36, 70);
    t += `<rect x="${x}" y="${G - 40 - h}" width="${w}" height="${h}" fill="#B8B3AA" opacity=".85"/>`;
    for (let wy = G - 40 - h + 10; wy < G - 50; wy += 16)
      for (let wx = x + 6; wx < x + w - 8; wx += 12) if (rnd() < .35) lights.push({ x: wx, y: wy, w: 5, h: 6, o: .7 });
  }
  t += `<rect x="0" y="${G - 40}" width="${W}" height="40" fill="#A39C8F"/>`;
  s += `<g filter="url(#tint)">${t}</g>` + drawLights(midLights, C.light, night, rnd);
  t = '';
  lights = frontLights;

  // 手前の家並み
  let x = -10;
  while (x < W) {
    const w = R(90, 160);
    if (x + w > BX - 30 && x < BX + BW + 30) { x = BX + BW + 30; continue; }
    t += house(x, w, rnd, f, lights);
    x += w + R(4, 18);
  }
  // 木
  for (let i = 0; i < 7; i++) {
    const tx = R(0, W);
    if (tx > BX - 40 && tx < BX + BW + 40) continue;
    t += tree(tx, G, rnd, autumn, f.has('snow'));
  }
  // 酒蔵
  const brew = brewery(town, f, lights, night);
  // 道
  t += `<rect x="0" y="${G}" width="${W}" height="${H - G}" fill="#9C9284"/>
        <rect x="0" y="${G}" width="${W}" height="14" fill="#BDB2A1"/>
        <rect x="0" y="${G + 14}" width="${W}" height="3" fill="#7F7669"/>`;
  for (let i = 0; i < 40; i++) t += `<rect x="${R(0, W)}" y="${R(G + 26, H - 10)}" width="${R(18, 40)}" height="2" fill="#8B8174" opacity=".6"/>`;
  if (f.has('snow')) {
    t += `<rect x="0" y="${G}" width="${W}" height="12" fill="#fff" opacity=".9"/>`;
    for (let i = 0; i < 30; i++) t += `<ellipse cx="${R(0, W)}" cy="${R(G + 20, H - 6)}" rx="${R(20, 60)}" ry="4" fill="#fff" opacity=".7"/>`;
  }
  // 街灯
  for (let lx = 140; lx < W; lx += 360) {
    t += `<rect x="${lx - 3}" y="${G - 110}" width="6" height="124" fill="#3A3A3E"/><rect x="${lx - 12}" y="${G - 124}" width="24" height="16" rx="4" fill="#3A3A3E"/><rect x="${lx - 8}" y="${G - 120}" width="16" height="8" fill="#FFF3D1"/>`;
    lights.push({ lamp: true, x: lx, y: G - 116 });
  }

  s += `<g filter="url(#tint)">${t}${brew.body}</g>` + drawLights(frontLights, C.light, night, rnd);
  s += brew.top();
  // フードのピン（お店の食材がある県だけ）
  const fpins = pinsFor(town.pref);
  if (fpins.food) {
    const fx = 470, fy = G - 250;
    s += `<g class="foodpin" style="cursor:pointer" role="button" aria-label="フードのおすすめを見る">
      <rect x="${fx - 60}" y="${fy - 70}" width="120" height="330" fill="transparent"/>
      <g class="pin"><g transform="translate(${fx} ${fy})">
        <path d="M0,40 L-12,20 A24,24 0 1 1 12,20Z" fill="#2F7A55" stroke="#fff" stroke-width="3"/>
        <text x="0" y="5" text-anchor="middle" font-size="20" font-family="Shippori Mincho" font-weight="800" fill="#fff">食</text></g></g>
      <circle class="ripple" cx="${fx}" cy="${fy}" r="40" fill="none" stroke="#fff" stroke-width="3" style="animation-delay:-.6s"/>
      <g transform="translate(${fx} ${fy - 50})"><rect x="-70" y="-16" width="140" height="28" rx="14" fill="#fff" opacity=".95"/>
        <text x="0" y="4" text-anchor="middle" font-size="14" font-weight="700" fill="#1F1B16" font-family="Noto Sans JP">${fpins.foodIcon} ${fpins.foodName}</text></g>
    </g>`;
  }

  // ---- 人と猫 ----
  s += walkers(rnd, night);
  return s;
}

// 夜や夕方に、窓・街灯・提灯を光らせる（時間帯の色はかけない）
function drawLights(list, lv, night, rnd) {
  if (lv <= 0) return '';
  let l = '';
  list.forEach(p => {
    if (p.beam) l += `<path d="M${p.x},${p.y} L${p.x - 420},${p.y - 60} L${p.x - 420},${p.y + 40}Z" fill="#FFF3C0" opacity=".25"/>`;
    else if (p.lamp) l += `<circle cx="${p.x}" cy="${p.y}" r="60" fill="url(#glow)" opacity="${lv}"/><ellipse cx="${p.x}" cy="${G + 34}" rx="90" ry="18" fill="url(#glow)" opacity="${.45 * lv}"/>`;
    else if (rnd() < (night ? .7 : .35)) l += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="#FFD27A" opacity="${(p.o || 1) * lv}"/>`;
  });
  return `<g style="pointer-events:none">${l}</g>`;
}

function mountains(rnd, amp, base, color, jagged, snowcap) {
  let d = `M0,${G} L0,${base}`;
  const pts = [];
  for (let x = 0; x <= W + 100; x += jagged ? 110 : 160) {
    const y = base - (jagged ? (rnd() < .5 ? amp * (.6 + rnd() * .4) : amp * rnd() * .4) : amp * (.3 + rnd() * .7));
    pts.push([x, y]);
  }
  pts.forEach(([x, y], i) => {
    if (jagged || i === 0) d += ` L${x},${y}`;
    else { const [px, py] = pts[i - 1]; d += ` Q${(px + x) / 2},${Math.min(py, y) - 20} ${x},${y}`; }
  });
  d += ` L${W + 100},${G} Z`;
  let s = `<path d="${d}" fill="${color}"/>`;
  if (snowcap && jagged) {
    pts.forEach(([x, y]) => { if (y < base - amp * .55) s += `<path d="M${x - 34},${y + 44} L${x},${y} L${x + 34},${y + 44} L${x + 16},${y + 34} L${x},${y + 46} L${x - 16},${y + 34}Z" fill="#fff" opacity=".9"/>`; });
  }
  return s;
}

function volcano(cx, C, rnd) {
  let s = `<path d="M${cx - 300},${G - 40} L${cx - 70},${300} L${cx + 60},${300} L${cx + 300},${G - 40}Z" fill="${C.near}"/>
    <path d="M${cx - 70},300 Q${cx - 5},315 ${cx + 60},300" stroke="#3a2f2f" stroke-width="6" fill="none"/>`;
  for (let i = 0; i < 4; i++) s += `<circle class="smoke" style="animation-delay:${i}s" cx="${cx - 5}" cy="285" r="24" fill="#E6E2DC" opacity=".7"/>`;
  return s;
}

/* ---- 名所（基準点 0,0 が地面。上がマイナス） ---- */
const LANDMARKS = {
  castle: () => `
    <path d="M-110,0 L-90,-60 L90,-60 L110,0Z" fill="#8C8A84"/>
    ${[...Array(5)].map((_, i) => `<path d="M${-104 + i * 4},${-i * 12} h${208 - i * 8}" stroke="#7A7871" stroke-width="2"/>`).join('')}
    <rect x="-80" y="-110" width="160" height="50" fill="#F5F2EA"/>
    <path d="M-104,-108 Q0,-124 104,-108 L84,-128 L-84,-128Z" fill="#3E4650"/>
    <rect x="-58" y="-162" width="116" height="36" fill="#F5F2EA"/>
    <path d="M-80,-160 Q0,-174 80,-160 L62,-178 L-62,-178Z" fill="#3E4650"/>
    <path d="M-30,-178 L0,-196 L30,-178Z" fill="#3E4650"/>
    <rect x="-38" y="-206" width="76" height="30" fill="#F5F2EA"/>
    <path d="M-60,-204 Q0,-216 60,-204 L36,-226 L-36,-226Z" fill="#3E4650"/>
    <path d="M-36,-226 L-36,-232 L36,-232 L36,-226Z" fill="#3E4650"/>
    <path d="M-40,-234 l-8,-12 l6,2Z M40,-234 l8,-12 l-6,2Z" fill="#D4A72C"/>
    ${[-50, -20, 10, 40].map(x => `<rect x="${x}" y="-100" width="12" height="16" fill="#2E2E30"/>`).join('')}
    ${[-30, 10].map(x => `<rect x="${x}" y="-152" width="12" height="14" fill="#2E2E30"/>`).join('')}`,
  pagoda: () => {
    let s = `<rect x="-3" y="-300" width="6" height="70" fill="#5B5045"/>`;
    for (let i = 0; i < 9; i++) s += `<ellipse cx="0" cy="${-292 + i * 7}" rx="7" ry="2" fill="#B08A3E"/>`;
    for (let i = 0; i < 5; i++) {
      const y = -i * 46, w = 70 - i * 9;
      s += `<rect x="${-w / 2}" y="${y - 30}" width="${w}" height="30" fill="#9B3C2C"/>
        <rect x="${-w / 2 + 6}" y="${y - 26}" width="${w - 12}" height="18" fill="#6E2A1F"/>
        <path d="M${-w / 2 - 34},${y - 28} Q0,${y - 40} ${w / 2 + 34},${y - 28} L${w / 2 + 6},${y - 46} L${-w / 2 - 6},${y - 46}Z" fill="#3A3431"/>`;
    }
    return s;
  },
  torii: () => `
    <rect x="-66" y="-170" width="14" height="170" fill="#D4462E"/><rect x="52" y="-170" width="14" height="170" fill="#D4462E"/>
    <rect x="-80" y="-140" width="160" height="12" fill="#D4462E"/>
    <path d="M-104,-176 Q0,-168 104,-176 L110,-192 Q0,-182 -110,-192Z" fill="#2E2A28"/>
    <rect x="-96" y="-176" width="192" height="10" fill="#D4462E"/>
    <rect x="-6" y="-166" width="12" height="28" fill="#D4462E"/>`,
  tower: () => {
    let s = `<path d="M-80,0 L-12,-300 L12,-300 L80,0 L58,0 L6,-260 L-6,-260 L-58,0Z" fill="#E2582F"/>`;
    for (let i = 1; i < 8; i++) {
      const y = -i * 36, hw = 80 - (68 * i * 36 / 300);
      s += `<path d="M${-hw},${y} L${hw},${y}" stroke="${i % 2 ? '#fff' : '#E2582F'}" stroke-width="6"/>`;
      s += `<path d="M${-hw},${y} L${hw - 8},${y - 36} M${hw},${y} L${-hw + 8},${y - 36}" stroke="#E2582F" stroke-width="2.5"/>`;
    }
    s += `<rect x="-34" y="-150" width="68" height="18" fill="#fff"/><rect x="-22" y="-232" width="44" height="12" fill="#fff"/>
      <rect x="-2" y="-360" width="4" height="62" fill="#E2582F"/>`;
    return s;
  },
  bridge: () => {
    let s = '';
    for (let i = 0; i < 3; i++) {
      const x = -240 + i * 160;
      s += `<path d="M${x},-40 Q${x + 80},-110 ${x + 160},-40" stroke="#7A5332" stroke-width="12" fill="none"/>
        <path d="M${x},-34 Q${x + 80},-96 ${x + 160},-34" stroke="#5C3E25" stroke-width="4" fill="none"/>
        <rect x="${x - 10}" y="-46" width="20" height="46" fill="#8C8578"/>`;
      for (let k = 1; k < 8; k++) s += `<rect x="${x + k * 20 - 1}" y="${-40 - 70 * Math.sin(Math.PI * k / 8) * .82}" width="3" height="14" fill="#5C3E25"/>`;
    }
    s += `<rect x="230" y="-46" width="20" height="46" fill="#8C8578"/>`;
    return s;
  },
  lighthouse: () => `
    <path d="M-30,0 L-18,-150 L18,-150 L30,0Z" fill="#FBFAF6"/>
    <path d="M-27,-40 L-24,-70 L24,-70 L27,-40Z" fill="#D9473A"/>
    <path d="M-21,-110 L-19,-130 L19,-130 L21,-110Z" fill="#D9473A"/>
    <rect x="-24" y="-156" width="48" height="8" fill="#3A3A3E"/>
    <rect x="-14" y="-178" width="28" height="22" fill="#FFF3C0" stroke="#3A3A3E" stroke-width="3"/>
    <path d="M-18,-178 L0,-196 L18,-178Z" fill="#D9473A"/>
    <rect x="-6" y="-30" width="12" height="30" fill="#5A5A60"/>`,
  gassho: (rnd, f) => `
    <rect x="-86" y="-60" width="172" height="60" fill="#7B5A3C"/>
    ${[-60, -20, 20, 50].map(x => `<rect x="${x}" y="-46" width="16" height="20" fill="#3B2C20"/>`).join('')}
    <path d="M-104,-56 L0,-220 L104,-56Z" fill="#9C7E52"/>
    <path d="M-80,-92 L0,-220 L80,-92" fill="none" stroke="#7E6440" stroke-width="3"/>
    <rect x="-14" y="-150" width="28" height="24" fill="#3B2C20"/>
    ${f.has('snow') ? '<path d="M-110,-54 L0,-226 L110,-54 L92,-60 L0,-206 L-92,-60Z" fill="#fff"/>' : ''}`,
  belltower: () => `
    <rect x="-22" y="-210" width="44" height="210" fill="#4A3A2C"/>
    <path d="M-50,-200 L50,-200 L30,-226 L-30,-226Z" fill="#2E2A28"/>
    <rect x="-16" y="-260" width="32" height="34" fill="#4A3A2C"/>
    <path d="M-36,-256 L36,-256 L0,-284Z" fill="#2E2A28"/>
    <path d="M-40,-120 L40,-120 L26,-138 L-26,-138Z" fill="#2E2A28"/>
    <path d="M-8,-250 Q0,-236 8,-250 L6,-232 L-6,-232Z" fill="#B08A3E"/>`,
  church: () => `
    <rect x="-90" y="-110" width="180" height="110" fill="#F2EEE4"/>
    <path d="M-100,-106 L0,-170 L100,-106Z" fill="#5B6670"/>
    <rect x="-24" y="-230" width="48" height="130" fill="#F2EEE4"/>
    <path d="M-30,-226 L0,-280 L30,-226Z" fill="#5B6670"/>
    <rect x="-2" y="-310" width="4" height="34" fill="#D4A72C"/><rect x="-11" y="-300" width="22" height="4" fill="#D4A72C"/>
    <circle cx="0" cy="-190" r="12" fill="#4F7FB0"/>
    <path d="M-12,0 L-12,-46 Q0,-62 12,-46 L12,0Z" fill="#6B4A32"/>
    ${[-64, -40, 40, 64].map(x => `<path d="M${x - 6},-40 L${x - 6},-70 Q${x},-80 ${x + 6},-70 L${x + 6},-40Z" fill="#4F7FB0"/>`).join('')}`,
  onsen: () => {
    let s = `<rect x="-90" y="-80" width="180" height="80" fill="#8A6A48"/>
      <path d="M-110,-76 L0,-120 L110,-76Z" fill="#3E4650"/>
      <rect x="-30" y="-58" width="60" height="58" fill="#3B2C20"/>
      <rect x="-26" y="-58" width="52" height="30" fill="#2E5A8C"/>
      <text x="0" y="-36" text-anchor="middle" font-size="20" fill="#fff">♨</text>`;
    for (let i = 0; i < 6; i++) s += `<circle class="smoke" style="animation-delay:${i * .7}s" cx="${-160 + (i % 3) * 30}" cy="-10" r="22" fill="#fff" opacity=".7"/><circle class="smoke" style="animation-delay:${i * .7 + .3}s" cx="${140 + (i % 3) * 30}" cy="-10" r="22" fill="#fff" opacity=".7"/>`;
    return s;
  },
  volcano: () => ''    // 背景の山として描くので、ここでは何もしない
};

function house(x, w, rnd, f, lights) {
  const h = 80 + rnd() * 70;
  const top = G - h;
  const kind = rnd();
  let s = '';
  if (kind < .5) {
    // 町家（木造・瓦屋根）
    const wall = ['#6E4B33', '#5A3E2B', '#7C5A3E'][Math.floor(rnd() * 3)];
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;
    s += `<rect x="${x + 6}" y="${top + h * .45}" width="${w - 12}" height="${h * .45}" fill="#3B2A1E"/>`;
    for (let k = x + 10; k < x + w - 8; k += 7) s += `<rect x="${k}" y="${top + h * .45}" width="2" height="${h * .45}" fill="#8A6A4C"/>`;
    lights.push({ x: x + 8, y: top + h * .47, w: w - 16, h: h * .4, o: .55 });
    // 2階の窓
    s += `<rect x="${x + w * .2}" y="${top + 12}" width="${w * .6}" height="${h * .22}" fill="#2E2620"/>`;
    for (let k = x + w * .2 + 6; k < x + w * .8; k += 8) s += `<rect x="${k}" y="${top + 12}" width="2" height="${h * .22}" fill="#9B7B58"/>`;
    lights.push({ x: x + w * .2 + 2, y: top + 14, w: w * .6 - 4, h: h * .22 - 4, o: .8 });
    s += `<path d="M${x - 12},${top + 4} L${x + w + 12},${top + 4} L${x + w - 8},${top - 26} L${x + 8},${top - 26}Z" fill="url(#tiles)"/>`;
    s += `<path d="M${x - 8},${top + h * .42} L${x + w + 8},${top + h * .42} L${x + w},${top + h * .34} L${x},${top + h * .34}Z" fill="#3B4048"/>`;
    if (f.has('snow')) s += `<path d="M${x - 14},${top + 2} L${x + w + 14},${top + 2} L${x + w - 8},${top - 30} L${x + 8},${top - 30}Z" fill="#fff" opacity=".95"/>`;
    if (rnd() < .4) s += `<g class="sway"><rect x="${x + w / 2 - 22}" y="${top + h * .42}" width="44" height="26" fill="${['#2E4A7A', '#7A2E2E', '#3E5A3A'][Math.floor(rnd() * 3)]}"/><rect x="${x + w / 2 - 1}" y="${top + h * .42 + 8}" width="2" height="18" fill="${f.has('snow') ? '#ddd' : '#F4EFE4'}"/></g>`;
  } else if (kind < .8) {
    // 白壁の家
    const wall = ['#EFE8DA', '#E6DCC8', '#F2EBDF'][Math.floor(rnd() * 3)];
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;
    s += `<path d="M${x - 10},${top + 2} L${x + w / 2},${top - 40} L${x + w + 10},${top + 2}Z" fill="${['#5B6670', '#7A4A3A', '#3E4650'][Math.floor(rnd() * 3)]}"/>`;
    if (f.has('snow')) s += `<path d="M${x - 12},${top} L${x + w / 2},${top - 44} L${x + w + 12},${top} L${x + w - 4},${top - 6} L${x + w / 2},${top - 34} L${x + 4},${top - 6}Z" fill="#fff"/>`;
    for (let k = 0; k < 2; k++) {
      const wx = x + w * (.18 + k * .42), wy = top + 18;
      s += `<rect x="${wx}" y="${wy}" width="${w * .22}" height="${h * .22}" fill="#56697A"/>`;
      lights.push({ x: wx, y: wy, w: w * .22, h: h * .22 });
    }
    s += `<rect x="${x + w * .4}" y="${G - 46}" width="${w * .2}" height="46" fill="#6B4A32"/>`;
  } else {
    // お店（ひさしつき）
    const wall = ['#D8CDB8', '#CFC2A8'][Math.floor(rnd() * 2)];
    s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;
    s += `<rect x="${x}" y="${top - 8}" width="${w}" height="10" fill="#7C7468"/>`;
    s += `<rect x="${x + 8}" y="${G - 56}" width="${w - 16}" height="56" fill="#4F6170"/>`;
    lights.push({ x: x + 10, y: G - 54, w: w - 20, h: 52 });
    const c = ['#C8473A', '#2F6B57', '#D99A2B'][Math.floor(rnd() * 3)];
    for (let k = 0; k < w; k += 16) s += `<path d="M${x + k},${G - 74} h16 l-2,16 h-12z" fill="${(k / 16) % 2 ? '#fff' : c}"/>`;
    s += `<rect x="${x + w * .2}" y="${top + 14}" width="${w * .6}" height="${h * .2}" fill="#56697A"/>`;
    lights.push({ x: x + w * .2, y: top + 14, w: w * .6, h: h * .2 });
  }
  return s;
}

function tree(x, base, rnd, autumn, snow) {
  const h = 70 + rnd() * 50;
  const colors = autumn ? ['#D9572B', '#E58A2B', '#C9402F', '#E2B13C'] : ['#4E8A4A', '#3F7A46', '#5C9650'];
  const c = colors[Math.floor(rnd() * colors.length)];
  let s = `<rect x="${x - 4}" y="${base - h * .5}" width="8" height="${h * .5}" fill="#5A3E2B"/>
    <circle cx="${x}" cy="${base - h * .6}" r="${h * .3}" fill="${c}"/><circle cx="${x - h * .18}" cy="${base - h * .5}" r="${h * .22}" fill="${c}"/><circle cx="${x + h * .18}" cy="${base - h * .5}" r="${h * .22}" fill="${c}"/>`;
  if (snow) s += `<ellipse cx="${x}" cy="${base - h * .82}" rx="${h * .2}" ry="${h * .06}" fill="#fff"/>`;
  return s;
}

/* ---- 酒蔵 ---- */
function brewery(town, f, lights, night) {
  const x = BX, top = G - 190;
  // 実在の銘柄名・酒蔵名は建物に書かない（商標への配慮）
  const chars = ['清', '酒'];
  const fs = 28;
  const signText = `${shortPref(town.pref)}の酒蔵`;
  let b = `<g class="brewery" role="button" aria-label="酒蔵のおすすめを見る">`;
  b += `<rect x="${x - 10}" y="${G - 360}" width="${BW + 20}" height="380" fill="transparent"/>`;
  // 煙突
  b += `<rect x="${x + 4}" y="${G - 340}" width="44" height="340" fill="#8A4B3A"/>`;
  for (let y = G - 330; y < G; y += 60) b += `<rect x="${x}" y="${y}" width="52" height="6" fill="#5E3226"/>`;
  b += chars.map((c, i) => `<text x="${x + 26}" y="${G - 300 + i * (fs + 4)}" text-anchor="middle" font-size="${fs}" font-family="Shippori Mincho" font-weight="800" fill="#FBF6EA">${c}</text>`).join('');
  // 横の小屋
  b += `<rect x="${x + 48}" y="${G - 110}" width="70" height="110" fill="#E9E2D2"/>
        <rect x="${x + 48}" y="${G - 40}" width="70" height="40" fill="url(#namako)"/>
        <path d="M${x + 40},${G - 106} L${x + 126},${G - 106} L${x + 116},${G - 128} L${x + 50},${G - 128}Z" fill="url(#tiles)"/>`;
  // 母屋（土蔵）
  b += `<g class="kura-body">
    <rect x="${x + 110}" y="${top}" width="${BW - 110}" height="190" fill="#F4EFE4"/>
    <rect x="${x + 110}" y="${G - 70}" width="${BW - 110}" height="70" fill="url(#namako)"/>
    <rect x="${x + 110}" y="${G - 74}" width="${BW - 110}" height="6" fill="#3B4048"/>
    <rect x="${x + 140}" y="${top + 16}" width="30" height="30" fill="#2E3238" stroke="#3B4048" stroke-width="6"/>
    <rect x="${x + BW - 60}" y="${top + 16}" width="30" height="30" fill="#2E3238" stroke="#3B4048" stroke-width="6"/>
    <path d="M${x + 92},${top + 4} L${x + BW + 18},${top + 4} L${x + BW - 10},${top - 46} L${x + 120},${top - 46}Z" fill="url(#tiles)"/>
    <rect x="${x + 112}" y="${top - 52}" width="${BW - 116}" height="10" rx="4" fill="#2C3036"/>
    <circle cx="${x + 116}" cy="${top - 48}" r="9" fill="#2C3036"/><circle cx="${x + BW - 4}" cy="${top - 48}" r="9" fill="#2C3036"/>
    ${f.has('snow') ? `<path d="M${x + 88},${top + 2} L${x + BW + 22},${top + 2} L${x + BW - 8},${top - 54} L${x + 118},${top - 54}Z" fill="#fff" opacity=".95"/>` : ''}
    <!-- ひさし -->
    <path d="M${x + 104},${G - 86} L${x + BW + 10},${G - 86} L${x + BW},${G - 102} L${x + 114},${G - 102}Z" fill="url(#tiles)"/>
    <!-- 看板 -->
    <rect x="${x + 150}" y="${top + 58}" width="${BW - 200}" height="34" fill="#2A1E16" stroke="#B88A2E" stroke-width="2"/>
    <text x="${x + 150 + (BW - 200) / 2}" y="${top + 82}" text-anchor="middle" font-size="${Math.min(20, (BW - 220) / [...signText].length)}" font-family="Shippori Mincho" font-weight="800" fill="#E9C46A">${signText}</text>
    <!-- 入口とのれん -->
    <rect x="${x + 190}" y="${G - 84}" width="100" height="84" fill="#2A1E16"/>
    <g class="sway"><rect x="${x + 190}" y="${G - 84}" width="100" height="48" fill="#23395B"/>
      <rect x="${x + 222}" y="${G - 76}" width="2" height="40" fill="#F4EFE4" opacity=".5"/><rect x="${x + 256}" y="${G - 76}" width="2" height="40" fill="#F4EFE4" opacity=".5"/>
      <text x="${x + 240}" y="${G - 50}" text-anchor="middle" font-size="24" font-family="Shippori Mincho" font-weight="800" fill="#F4EFE4">酒</text></g>
    <!-- 酒樽 -->
    ${[0, 1].map(i => `<g transform="translate(${x + 130 + i * 30} ${G - 34})"><rect width="26" height="34" rx="4" fill="#D9C7A0"/><rect y="6" width="26" height="3" fill="#7A5332"/><rect y="25" width="26" height="3" fill="#7A5332"/><rect x="8" y="12" width="10" height="10" fill="#B8322A"/></g>`).join('')}
  </g>`;
  // 提灯
  [x + 172, x + 308].forEach(lx => {
    b += `<g class="sway"><rect x="${lx - 1}" y="${G - 88}" width="2" height="8" fill="#333"/><ellipse cx="${lx}" cy="${G - 64}" rx="11" ry="16" fill="#D9473A"/><rect x="${lx - 7}" y="${G - 82}" width="14" height="4" fill="#222"/><rect x="${lx - 7}" y="${G - 50}" width="14" height="4" fill="#222"/></g>`;
    lights.push({ lamp: true, x: lx, y: G - 64 });
  });
  lights.push({ x: x + 194, y: G - 34, w: 92, h: 32, o: .9 });
  // 杉玉
  const sx = x + 348, sy = G - 120;
  b += `<g class="sway"><rect x="${sx - 1}" y="${G - 148}" width="2" height="8" fill="#333"/>
    <circle cx="${sx}" cy="${sy}" r="20" fill="${night ? '#4F5E2E' : '#6E7F3A'}"/>
    ${[...Array(14)].map((_, i) => { const a = i / 14 * Math.PI * 2; return `<path d="M${sx},${sy} l${Math.cos(a) * 22},${Math.sin(a) * 22}" stroke="#56652C" stroke-width="2"/>`; }).join('')}
  </g>`;
  b += `</g>`;

  // 色をかけない上のレイヤー：目印
  const pins = pinsFor(town.pref);
  const top2 = () => !pins.sake ? '' : `<g class="brewery" style="pointer-events:none">
      <g class="pin" transform="translate(0 0)">
        <g transform="translate(${x + 240} ${top - 110})">
          <path d="M0,40 L-12,20 A24,24 0 1 1 12,20Z" fill="#B8322A" stroke="#fff" stroke-width="3"/>
          <text x="0" y="5" text-anchor="middle" font-size="20" font-family="Shippori Mincho" font-weight="800" fill="#fff">酒</text>
        </g>
      </g>
      <circle class="ripple" cx="${x + 240}" cy="${top - 110}" r="40" fill="none" stroke="#fff" stroke-width="3"/>
    </g>`;
  return { body: b, top: top2 };
}

function walkers(rnd, night) {
  let s = '';
  const colors = ['#2E4A7A', '#B8322A', '#3E5A3A', '#D99A2B', '#5B4B8A', '#333'];
  for (let i = 0; i < 6; i++) {
    const dir = rnd() < .5 ? 1 : -1, dur = 30 + rnd() * 30, y = G + 30 + rnd() * 90;
    const c = colors[i % colors.length];
    const from = dir > 0 ? -60 : W + 60, to = dir > 0 ? W + 60 : -60;
    s += `<g class="walker" style="--from:${from}px;--to:${to}px;animation-duration:${dur}s;animation-delay:-${rnd() * dur}s">
      <g transform="translate(0 ${y})"><g class="bob" opacity="${night ? .85 : 1}">
        <ellipse cx="0" cy="2" rx="12" ry="3" fill="#000" opacity=".15"/>
        <rect x="-6" y="-24" width="4" height="24" fill="#2B2B30"/><rect x="2" y="-24" width="4" height="24" fill="#2B2B30"/>
        <rect x="-9" y="-54" width="18" height="32" rx="6" fill="${c}"/>
        <circle cx="0" cy="-64" r="10" fill="#F1D3B5"/><path d="M-10,-66 a10,10 0 0 1 20,0 z" fill="#2B2420"/>
        ${night && i % 2 === 0 ? `<circle cx="${dir * 14}" cy="-36" r="5" fill="#FFD27A"/><circle cx="${dir * 14}" cy="-36" r="16" fill="url(#glow)"/>` : ''}
      </g></g></g>`;
  }
  // 猫
  s += `<g transform="translate(${BX - 60} ${G + 8})"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#E59A4A"/><circle cx="14" cy="-8" r="8" fill="#E59A4A"/>
    <path d="M9,-14 l2,-7 l4,5Z M16,-14 l3,-7 l3,6Z" fill="#E59A4A"/><path class="sway" d="M-16,0 q-12,-4 -10,-18" stroke="#E59A4A" stroke-width="4" fill="none"/></g>`;
  return s;
}

/* ---- ジオラマ画像モード ---- */
let dioMode = false;
let clockTimer = null;

function setupDiorama(town, d) {
  const img = $('dio-img');
  img.onerror = () => {             // 画像が無いときは手描きの街にもどす
    dioMode = false;
    $('diorama').hidden = true;
    $('town-scroll').style.display = '';
    setTime(currentTime);
  };
  const key = d.img.split('/').pop().replace(/\.\w+$/, '');
  img.onload = () => LookFX.load(img, key);
  img.src = d.img;
  if (img.complete && img.naturalWidth) LookFX.load(img, key);
  img.alt = `${town.pref}のジオラマ`;
  const cl = $('dio-cloud'); cl.style.webkitMaskImage = cl.style.maskImage = `url("${d.img}")`;
  const fl = $('dio-flash'); fl.style.webkitMaskImage = fl.style.maskImage = `url("${d.img}")`;
  resetView();
  const [px, py] = d.pin;
  const pins = pinsFor(town.pref);
  Object.assign($('dio-pin').style, { left: px + '%', top: py + '%' });
  $('dio-pin').hidden = !pins.sake;
  $('dio-pin-chip').textContent = pins.sakeName ? '🍶 ' + pins.sakeName : '';
  const [foodX, foodY] = d.food || [Math.min(85, px + 25), py + 6];
  Object.assign($('dio-pin-food').style, { left: foodX + "%", top: foodY + "%" });
  $('dio-pin-food').hidden = !pins.food;
  $('dio-food-chip').textContent = pins.food ? pins.foodIcon + ' ' + pins.foodName : '';
  $('dio-pin-food').querySelector('b').textContent = '食';
  // 金色のきらめき
  let sp = '';
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2, r = 44 + (i % 3) * 4;
    sp += `<i style="left:${50 + Math.cos(a) * r}%;top:${50 + Math.sin(a) * r * .8}%;animation-delay:-${(i * .37).toFixed(2)}s;transform:scale(0)"></i>`;
  }
  $('dio-sparkle').innerHTML = sp;
  // 夜に灯る明かり（酒蔵の入口＋画像ごとの指定）
  $('dio-night').innerHTML = [[px, py + 6], ...(d.lights || [])]
    .map(([x, y], i) => `<i style="left:${x}%;top:${y}%;animation-delay:-${i * .7}s"></i>`).join('');
  // 煙突の湯気と、空を横切る鳥
  let fx = '';
  if (d.smoke) for (let i = 0; i < 4; i++) fx += `<span class="puff" style="left:${d.smoke[0]}%;top:${d.smoke[1]}%;animation-delay:${i * 1.1}s"></span>`;
  for (let i = 0; i < 3; i++) fx += `<span class="bird" style="top:${6 + i * 5}%;animation-duration:${14 + i * 4}s;animation-delay:-${i * 5}s">︶</span>`;
  $('dio-fx').innerHTML = fx;
  $('dio-spots').textContent = d.spots ? '📍 ' + d.spots : '';
  const tick = () => {
    const n = new Date();
    $('dio-clock').textContent = n.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }) + '  ' + n.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  clearInterval(clockTimer);
  clockTimer = setInterval(tick, 20000);
}

// ジオラマの操作：ドラッグで回転、ピンチ・ホイール・＋－で拡大、拡大中はドラッグで移動、ダブルタップで拡大／戻す
const view = { zoom: 1, x: 0, y: 0, rx: 0, ry: 0 };
function applyView(animate = true) {
  const tilt = $('dio-tilt'), size = tilt.offsetWidth || 1;
  view.zoom = Math.max(1, Math.min(3, view.zoom));
  const lim = size * (view.zoom - 1) / 2 + 40;
  view.x = Math.max(-lim, Math.min(lim, view.x)); view.y = Math.max(-lim, Math.min(lim, view.y));
  view.rx = Math.max(-28, Math.min(28, view.rx)); view.ry = Math.max(-40, Math.min(40, view.ry));
  tilt.classList.toggle('dragging', !animate);
  tilt.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.zoom}) rotateX(${view.rx}deg) rotateY(${view.ry}deg)`;
  tilt.style.setProperty('--inv', (1 / view.zoom).toFixed(3));
}
function resetView() { Object.assign(view, { zoom: 1, x: 0, y: 0, rx: 0, ry: 0 }); applyView(); }
function zoomAt(f, cx, cy) {
  // (cx, cy)：ステージ中心からの位置。その点を中心に拡大する
  const z0 = view.zoom, z1 = Math.max(1, Math.min(3, z0 * f)), k = z1 / z0;
  view.x = cx - (cx - view.x) * k; view.y = cy - (cy - view.y) * k; view.zoom = z1;
  if (z1 === 1) { view.x = 0; view.y = 0; }
}

function setupTilt() {
  const stage = $('diorama'), box = $('dio-stage');
  const pts = new Map(); let last = null, moved = 0, pinch = null, lastTap = 0;
  const center = e => { const r = box.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, [e.clientX, e.clientY]); last = [e.clientX, e.clientY]; moved = 0;
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: view.zoom }; }
  });
  stage.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2 && pinch) {
      const [a, b] = [...pts.values()];
      const mid = center({ clientX: (a[0] + b[0]) / 2, clientY: (a[1] + b[1]) / 2 });
      zoomAt(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d / view.zoom, mid[0], mid[1]);
      moved = 99; applyView(false); return;
    }
    const dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY]; moved += Math.abs(dx) + Math.abs(dy);
    if (view.zoom > 1.05) { view.x += dx; view.y += dy; }          // 拡大中は移動
    else { view.ry += dx * 0.35; view.rx -= dy * 0.25; }           // 通常はくるっと回す
    applyView(false);
  });
  const up = e => {
    pts.delete(e.pointerId); if (pts.size < 2) pinch = null;
    if (pts.size === 0 && moved < 6 && !e.target.closest('button')) {   // タップ
      const now = Date.now();
      if (now - lastTap < 320) { const c = center(e); view.zoom > 1.05 ? resetView() : (zoomAt(2.2, c[0], c[1]), applyView()); lastTap = 0; }
      else lastTap = now;
    }
    if (pts.size === 0) applyView();
  };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', e => { e.preventDefault(); const c = center(e); zoomAt(Math.exp(-e.deltaY * 0.0015), c[0], c[1]); applyView(false); }, { passive: false });
  $('dio-tools').addEventListener('click', e => {
    const act = e.target.closest('button')?.dataset.act; if (!act) return;
    if (act === 'in') zoomAt(1.4, 0, 0);
    if (act === 'out') zoomAt(1 / 1.4, 0, 0);
    if (act === 'rotl') view.ry -= 20;
    if (act === 'rotr') view.ry += 20;
    if (act === 'reset') return resetView();
    applyView();
  });
  $('dio-pin').addEventListener('click', e => { e.stopPropagation(); openSheet(current, 'sake'); });
  $('dio-pin-food').addEventListener('click', e => { e.stopPropagation(); openSheet(current, 'food'); });
}

/* ---- ジオラマの動き：水面のゆらぎ・波頭・船の航跡 ---- */
const waterFx = { raf: 0, layer: null, cells: [], wakes: [] };
function startWater(key, source) {
  cancelAnimationFrame(waterFx.raf);
  const cv = $('dio-water'), ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  const code = typeof WATER_MASKS !== 'undefined' && WATER_MASKS[key];
  const img = source || $('dio-img');
  if (!code || (!source && (!img.complete || !img.naturalWidth))) return;
  const N = 96, S = cv.width;
  // マスクを復元
  const bytes = Uint8Array.from(atob(code), c => c.charCodeAt(0));
  const m = document.createElement('canvas'); m.width = m.height = N;
  const mc = m.getContext('2d'), md = mc.createImageData(N, N);
  waterFx.cells = [];
  for (let i = 0; i < N * N; i++) {
    const on = (bytes[i >> 3] >> (7 - (i & 7))) & 1;
    md.data[i * 4 + 3] = on ? 255 : 0;
    if (on) waterFx.cells.push([(i % N + .5) / N * S, (Math.floor(i / N) + .5) / N * S]);
  }
  mc.putImageData(md, 0, 0);
  // 水面だけを切り出した絵
  const layer = document.createElement('canvas'); layer.width = layer.height = S;
  const lc = layer.getContext('2d');
  lc.drawImage(img, 0, 0, S, S);
  lc.globalCompositeOperation = 'destination-in';
  lc.filter = 'blur(6px)'; lc.imageSmoothingEnabled = true;
  lc.drawImage(m, 0, 0, S, S); lc.drawImage(m, 0, 0, S, S);
  waterFx.layer = layer;
  const inWater = (x, y) => { const i = Math.floor(y / S * N) * N + Math.floor(x / S * N); return x > 0 && y > 0 && x < S && y < S && ((bytes[i >> 3] >> (7 - (i & 7))) & 1); };
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  // 船の航跡（等角の向きに進む）
  const dirs = [[0.88, 0.47], [-0.88, 0.47], [0.88, -0.47], [-0.88, -0.47]];
  const newWake = () => { const [x, y] = rnd(waterFx.cells); const d = rnd(dirs); return { x, y, d, life: 0, max: 280 + Math.random() * 260 }; };
  waterFx.wakes = waterFx.cells.length > 60 ? [newWake(), newWake()] : [];
  const glints = Array.from({ length: Math.min(26, waterFx.cells.length) }, () => ({ p: rnd(waterFx.cells), ph: Math.random() * 6.3, sp: .8 + Math.random() * 1.6 }));
  let lastT = 0;
  const frame = t => {
    waterFx.raf = requestAnimationFrame(frame);
    if (t - lastT < 33) return; lastT = t;               // 約30コマ/秒
    const s = t / 1000;
    ctx.clearRect(0, 0, S, S);
    // ゆらぎ：横に細く切って少しずつずらす
    for (let y = 0; y < S; y += 3) {
      const off = Math.sin(y * 0.085 + s * 1.7) * 1.8 + Math.sin(y * 0.027 - s * 0.9) * 1.2;
      ctx.drawImage(layer, 0, y, S, 3, off, y, S, 3);
    }
    // 波頭のきらめき
    ctx.globalCompositeOperation = 'lighter';
    for (const g of glints) {
      const a = Math.max(0, Math.sin(s * g.sp + g.ph)) ** 6;
      if (a < .02) { if (Math.random() < .01) g.p = rnd(waterFx.cells); continue; }
      const gr = ctx.createRadialGradient(g.p[0], g.p[1], 0, g.p[0], g.p[1], 7);
      gr.addColorStop(0, `rgba(255,255,255,${.75 * a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gr; ctx.fillRect(g.p[0] - 7, g.p[1] - 7, 14, 14);
    }
    ctx.globalCompositeOperation = 'source-over';
    // 花火の光が水面に映る
    const fc = LookFX.flashColor();
    if (fc) { ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = fc.a; ctx.fillStyle = fc.col; ctx.fillRect(0, 0, S, S); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    // 航跡：白い小さな船首と、うしろに広がる波
    for (let i = 0; i < waterFx.wakes.length; i++) {
      const w = waterFx.wakes[i]; w.life++;
      w.x += w.d[0] * 0.55; w.y += w.d[1] * 0.55;
      if (w.life > w.max || !inWater(w.x + w.d[0] * 14, w.y + w.d[1] * 14)) { waterFx.wakes[i] = newWake(); continue; }
      const fade = Math.min(1, w.life / 40, (w.max - w.life) / 40);
      for (let k = 1; k <= 14; k++) {
        const bx = w.x - w.d[0] * k * 3.2, by = w.y - w.d[1] * k * 3.2, spread = k * 0.9;
        ctx.fillStyle = `rgba(255,255,255,${(0.5 - k * 0.032) * fade})`;
        ctx.fillRect(bx - w.d[1] * spread - 1, by + w.d[0] * spread - 1, 2, 2);
        ctx.fillRect(bx + w.d[1] * spread - 1, by - w.d[0] * spread - 1, 2, 2);
      }
      ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
      ctx.beginPath(); ctx.ellipse(w.x, w.y, 4.5, 2.6, Math.atan2(w.d[1], w.d[0]), 0, 7); ctx.fill();
    }
  };
  waterFx.raf = requestAnimationFrame(frame);
}
function stopWater() { cancelAnimationFrame(waterFx.raf); }

function makeParticles(town) {
  const box = $('particles');
  box.innerHTML = '';
  if (dioMode) return;               // ジオラマでは、季節の舞いをジオラマの中で描く
  const snow = town.features.includes('snow');
  const autumn = [9, 10, 11].includes(new Date().getMonth() + 1);
  if (!snow && !autumn) return;
  const n = snow ? 60 : 16;
  let html = '';
  for (let i = 0; i < n; i++) {
    const left = Math.random() * 100, dur = (snow ? 6 : 9) + Math.random() * 6, delay = -Math.random() * dur, dx = (Math.random() * 80 - 40) + 'px';
    if (snow) {
      const sz = 2 + Math.random() * 5;
      html += `<i class="flake" style="left:${left}%;width:${sz}px;height:${sz}px;animation-duration:${dur}s;animation-delay:${delay}s;--dx:${dx}"></i>`;
    } else {
      const c = ['#D9572B', '#E58A2B', '#C9402F', '#E2B13C'][i % 4];
      html += `<i class="leaf" style="left:${left}%;background:${c};animation-duration:${dur}s;animation-delay:${delay}s;--dx:${dx}"></i>`;
    }
  }
  box.innerHTML = html;
}

/* =========================================================
   3. おすすめのお酒
   ========================================================= */
function bottleSVG(t) {
  const shochu = /焼酎|泡盛/.test(t.type);
  const glass = shochu ? '#3B2A1E' : (/大吟醸/.test(t.type) ? '#2F5A3A' : /吟醸/.test(t.type) ? '#3E6B8A' : '#5A3E1E');
  // ラベルは実在商品に似せず、県名だけの架空デザインにする
  const chars = [...shortPref(t.pref), 'の', '酒'];
  const fs = Math.min(24, 110 / chars.length);
  return `<svg class="bottle" viewBox="0 0 110 260">
    <path d="M44,6 h22 v40 q0,16 22,34 q12,10 12,30 v130 q0,14 -14,14 h-62 q-14,0 -14,-14 v-130 q0,-20 12,-30 q22,-18 22,-34z" fill="${glass}"/>
    <rect x="42" y="2" width="26" height="14" rx="3" fill="#C9A24A"/>
    <path d="M34,40 q-4,30 -20,48" stroke="#fff" stroke-width="4" opacity=".25" fill="none" stroke-linecap="round"/>
    <rect x="18" y="104" width="74" height="130" rx="4" fill="#F7F2E6"/>
    <rect x="22" y="108" width="66" height="122" rx="2" fill="none" stroke="#B8322A" stroke-width="1.5"/>
    ${chars.map((c, i) => `<text x="55" y="${132 + i * (fs + 2)}" text-anchor="middle" font-size="${fs}" font-family="Shippori Mincho" font-weight="800" fill="#1F1B16">${c}</text>`).join('')}
    <circle cx="74" cy="218" r="7" fill="#B8322A"/>
  </svg>`;
}

function sakeCardHTML(t, id) {
  return `
    <div class="sake-hero">
      ${bottleSVG(t)}
      <div>
        <div class="eyebrow">${t.pref} の地酒</div>
        <h3 class="sake-name mincho">${t.name}</h3>
        <div class="sake-brew">${t.brewery}<br>${t.pref} ${t.city}</div>
        <span class="tag">${t.type}</span>
      </div>
    </div>
    <p class="sake-note mincho">${t.note}</p>
    <div class="sake-grid">
      <div class="cell"><h4>おすすめの飲み方</h4><p>${t.temp}</p></div>
      <div class="cell"><h4>合わせたい一品</h4><p>${t.pair}</p></div>
      ${tasteHTML(id)}
    </div>`;
}
function tasteHTML(id) {
  return `<div class="cell taste"><h4>味わいの目安</h4>
    <div class="taste-map">
      <span class="axis" style="left:10px;top:50%;transform:translateY(-50%)">甘口</span>
      <span class="axis" style="right:10px;top:50%;transform:translateY(-50%)">辛口</span>
      <span class="axis" style="left:50%;top:6px;transform:translateX(-50%)">濃醇</span>
      <span class="axis" style="left:50%;bottom:6px;transform:translateX(-50%)">淡麗</span>
      <span class="taste-dot" id="${id}" style="left:50%;top:50%"></span>
    </div></div>`;
}

// お店の食材 1つ分
function itemHTML(it, i) {
  const k = KINDS[it.kind] || KINDS.other;
  const hasTaste = it.kind === 'sake' && it.dry != null && it.rich != null;
  if (STORE.layout === 'list') return `
    <div class="item-row"><span>${k.icon}</span>
      <div><div class="r-name">${it.name}</div><div class="r-sub">${it.from || ''}${it.season ? '・' + it.season : ''}</div></div>
      <div class="r-menu">${it.menu || ''}</div></div>`;
  return `
    <div class="item-card"><div class="item-icon">${k.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="item-kind">${k.label}${it.season ? `<span class="item-season">${it.season}</span>` : ''}</div>
        <div class="item-name mincho">${it.name}</div>
        <div class="item-from">${it.from || ''}</div>
        ${it.note ? `<p class="item-note">${it.note}</p>` : ''}
        ${it.menu ? `<span class="item-menu">🍽 ${it.menu}</span>` : ''}
        ${hasTaste ? `<div class="sake-grid" style="margin-top:12px">${tasteHTML('taste-item-' + i)}</div>` : ''}
      </div></div>`;
}

// mode: 'sake'（お酒のピン）/ 'food'（フードのピン）
function openSheet(t, mode = 'sake') {
  $('town-hint').style.display = 'none';
  const all = storeItems(t.pref);
  const sakes = all.filter(i => i.kind === 'sake'), foods = all.filter(i => i.kind !== 'sake');
  const useDefault = STORE.showDefaultSake === true && !sakes.length;
  const dots = [];   // [id, 辛さ, 濃さ]
  const list = arr => { const body = arr.map(it => itemHTML(it, all.indexOf(it))).join(''); return STORE.layout === 'list' ? `<div class="item-list">${body}</div>` : body; };
  const mini = arr => `<div class="item-list">${arr.map(it => { const k = KINDS[it.kind] || KINDS.other;
    return `<div class="item-row"><span>${k.icon}</span><div><div class="r-name">${it.name}</div><div class="r-sub">${it.from || ''}</div></div><div class="r-menu">${it.menu || ''}</div></div>`; }).join('')}</div>`;
  let html = `<div class="store-eyebrow">${STORE.name || ''}</div>
    <h3 class="store-heading mincho">${(mode === 'food' ? (STORE.foodHeading || '{pref}から届く、当店の食材') : (STORE.heading || '{pref}のお酒')).replace('{pref}', t.pref)}</h3>`;

  if (mode === 'sake') {
    if (sakes.length) {
      html += list(sakes);
      sakes.forEach(it => { if (it.dry != null) dots.push(['taste-item-' + all.indexOf(it), it.dry, it.rich]); });
    } else if (useDefault) {
      html += sakeCardHTML(t, 'taste-default');
      dots.push(['taste-default', t.dry, t.rich]);
    }
    if (foods.length) {
      html += `<div class="section-title">いっしょに味わいたい ${shortPref(t.pref)}の食材</div>` + mini(foods);
      const f = foods.find(i => i.menu), sk = sakes[0] ? sakes[0].name : (useDefault ? t.name : '');
      if (f && sk) html += `<div class="pairing">🍶 × ${(KINDS[f.kind] || KINDS.other).icon}　同じ${shortPref(t.pref)}生まれの組み合わせ。<br><b>${sk}</b> と <b>${f.menu}</b> を一緒にどうぞ。</div>`;
    }
  } else {
    html += list(foods);
    if (sakes.length || useDefault) {
      html += `<div class="section-title">合わせたい ${shortPref(t.pref)}のお酒</div>`;
      html += sakes.length ? mini(sakes) : `<div class="item-list"><div class="item-row"><span>🍶</span><div><div class="r-name">${t.name}</div><div class="r-sub">${t.type}・${t.brewery}</div></div><div class="r-menu">${t.temp}</div></div></div>`;
    }
  }

  html += `<div class="stamped"><span class="seal">酒</span>${t.pref}のスタンプ（${visited.size} / 47）</div>
    <p class="disclaimer">${useDefault && mode === 'sake' ? '※ 地酒は県ごとの代表的な銘柄の一例です。味わいは目安です。' : ''}${STORE.note || ''}</p>`;
  $('sheet-body').innerHTML = html;
  $('sheet-bg').classList.add('show');
  $('sheet').classList.add('show');
  $('sheet').scrollTop = 0;
  requestAnimationFrame(() => requestAnimationFrame(() => dots.forEach(([id, dry, rich]) => {
    const dot = $(id);
    if (dot) { dot.style.left = (50 + dry * 20) + '%'; dot.style.top = (50 - rich * 20) + '%'; }
  })));
}
function closeSheet() {
  $('sheet-bg').classList.remove('show');
  $('sheet').classList.remove('show');
}

/* =========================================================
   オープニング：遊び方（3コマ × 2.5秒）
   ========================================================= */
const INTRO_KEY = 'meisan-map-intro-seen';
const INTRO_CAPS = [
  '① 金色に光る県が<br>お店のこだわりの産地',
  '② タップすると飛行機でひとっ飛び<br>その県の街へ',
  '③ ピンをタップすると<br>おすすめのお酒と料理'
];
let introTimer = null;
function buildIntro() {
  const golds = Object.keys(STORE.items || {}).filter(p => storeItems(p).length);
  const sample = golds.find(p => DIORAMAS[p] && DIORAMAS[p].img) || '宮城県';
  const paths = Object.entries(JAPAN_PREFECTURE_PATHS).map(([n, d]) => {
    const g = golds.includes(n);
    return `<path d="${d}" class="${g ? 'gold' : ''}" data-p="${n}" fill="${g ? 'url(#gold)' : REGION_COLORS[(SAKE_BY_PREF[n] || {}).region] || '#ddd'}"/>`;
  }).join('');
  const defs = document.querySelector('#japan defs').outerHTML;
  $('intro-map').innerHTML = defs + paths;
  $('intro-map2').innerHTML = defs + paths + '<g id="intro-flight"></g>';
  const img = (DIORAMAS[sample] || {}).img || '';
  $('intro-dio').src = img; $('intro-dio2').src = img;
  // 指は金色の県の上へ
  const tgt = $('intro-map').querySelector(`path[data-p="${sample}"]`);
  return { tgt, sample };
}
function playIntro() {
  const intro = $('intro'); intro.hidden = false;
  const { tgt, sample } = buildIntro();
  const scenes = intro.querySelectorAll('.intro-scene'), bars = intro.querySelectorAll('.intro-bars i');
  requestAnimationFrame(() => {
    if (tgt) {
      const b = tgt.getBBox(), r = $('intro-map').getBoundingClientRect(), st = intro.querySelector('.intro-stage').getBoundingClientRect();
      const k = Math.min(r.width / 1640, r.height / 1490), ox = (r.width - 1640 * k) / 2, oy = (r.height - 1490 * k) / 2;
      Object.assign($('intro-finger').style, { left: (ox + (b.x + b.width / 2) * k - 14) + 'px', top: (oy + (b.y + b.height / 2) * k - 6) + 'px' });
      // 2コマ目：東京から金色の県へ飛ぶ線
      const from = $('intro-map').querySelector(`path[data-p="${STORE.origin || '東京都'}"]`);
      if (from) {
        const fb = from.getBBox(), f = [fb.x + fb.width / 2, fb.y + fb.height / 2], t = [b.x + b.width / 2, b.y + b.height / 2];
        const c = [(f[0] + t[0]) / 2, Math.min(f[1], t[1]) - 220];
        $('intro-flight').innerHTML = `<path d="M${f[0]},${f[1]} Q${c[0]},${c[1]} ${t[0]},${t[1]}" fill="none" stroke="#B8322A" stroke-width="7" stroke-dasharray="18 14" class="intro-route"/>
          <text font-size="150" fill="#1F1B16" stroke="#fff" stroke-width="6" paint-order="stroke" dy="50" text-anchor="middle" class="intro-plane">✈<animateMotion dur="1.2s" fill="freeze" rotate="auto" path="M${f[0]},${f[1]} Q${c[0]},${c[1]} ${t[0]},${t[1]}"/></text>`;
      }
    }
  });
  let n = -1;
  const show = i => {
    scenes.forEach((s, j) => s.classList.toggle('on', j === i));
    bars.forEach((b, j) => { b.classList.toggle('done', j < i); b.classList.toggle('now', j === i); });
    $('intro-cap').innerHTML = INTRO_CAPS[i];
    if (i === 1) { const fl = $('intro-flight'); if (fl) fl.innerHTML = fl.innerHTML; }   // 飛行機のアニメを最初から
    $('intro-start').classList.toggle('show', i === 2);
  };
  const next = () => { n++; if (n > 2) { clearInterval(introTimer); return; } show(n); };
  clearInterval(introTimer); next(); introTimer = setInterval(next, 2500);
}
function closeIntro() {
  clearInterval(introTimer); $('intro').hidden = true;
  try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) {}
}

/* =========================================================
   はじめる
   ========================================================= */
(function checkFiles() {
  const need = { 'japan-map.js': typeof JAPAN_PREFECTURE_PATHS, 'sake-data.js': typeof SAKE_TOWNS, 'diorama-data.js': typeof DIORAMAS, 'store.js': typeof STORE };
  const missing = Object.keys(need).filter(k => need[k] === 'undefined');
  if (missing.length) throw new Error('次のファイルが読み込めていません: ' + missing.join(', ') + '\nindex.html と同じフォルダに置いてください。');
})();
applyStore();
renderMap();
setupMapEvents();
setupTilt();
$('dio-modes').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  e.stopPropagation();
  if (b.dataset.season) LookFX.setSeason(b.dataset.season);
  if (b.dataset.act === 'night') LookFX.toggleNight();
});
$('dio-modes').addEventListener('pointerdown', e => e.stopPropagation());
$('intro-skip').addEventListener('click', closeIntro);
$('intro-start').addEventListener('click', closeIntro);
$('map-help').addEventListener('click', playIntro);
$('town-help').addEventListener('click', playIntro);
(function () { let seen = false; try { seen = localStorage.getItem(INTRO_KEY); } catch (e) {} if (!seen) playIntro(); })();
if (SMALL_SCREEN.matches) $('map-hint').textContent = '地方をタップして、街へ出かけよう';
$('back-btn').addEventListener('click', backToMap);
$('sheet-close').addEventListener('click', closeSheet);
$('sheet-bg').addEventListener('click', closeSheet);
$('town-hint').addEventListener('click', () => {
  const p0 = pinsFor(current.pref); if (!p0.sake && !p0.food) return;
  const mode = pinsFor(current.pref).sake ? 'sake' : 'food';
  if (!dioMode) {
    const sc = $('town-scroll'), scale = $('town-svg').clientHeight / H;
    sc.scrollTo({ left: (mode === 'sake' ? BX + BW / 2 : 470) * scale - sc.clientWidth / 2, behavior: 'smooth' });
  }
  openSheet(current, mode);
});
document.querySelectorAll('#time-switch button').forEach(b => b.addEventListener('click', () => setTime(b.dataset.time)));
addEventListener('keydown', e => { if (e.key === 'Escape') { $('sheet').classList.contains('show') ? closeSheet() : (!$('town-screen').classList.contains('hidden') && backToMap()); } });
addEventListener('resize', () => { if (current && !$('town-screen').classList.contains('hidden')) $('town-svg').style.width = ($('town-svg').clientHeight * W / H) + 'px'; });
</script>
</body>
</html>
