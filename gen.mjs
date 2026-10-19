// gen.mjs: node gen.mjs [--hs]  ->  banner.svg, grass.svg, index.html
// Pure SVG + CSS keyframes (no JS at runtime) so the files work inside a GitHub README <img>.
// Every sprite is an ASCII grid; 1 grid cell = `s` SVG units; shape-rendering=crispEdges keeps it pixel-sharp.
import { writeFileSync, mkdirSync } from 'node:fs'; mkdirSync('assets',{recursive:true});
const HS = process.argv.includes('--hs'); // static handshake frame, used only for preview PNGs

// ---------- sprite helpers ----------
const sprite = (rows, pal, s, x = 0, y = 0) => rows.map((r, j) => {
  let out = '', i = 0;
  while (i < r.length) {                       // merge horizontal runs -> fewer <rect>s
    const c = r[i]; let k = i; while (r[k + 1] === c) k++;
    if (pal[c]) out += `<rect x="${x + i * s}" y="${y + j * s}" width="${(k - i + 1) * s}" height="${s}" fill="${pal[c]}"/>`;
    i = k + 1;
  } return out;
}).join('');

// ---------- PixelCharacter: front-facing panda (20x26), flat colours, no shading ----------
const PANDA = [
 '..KKKK........KKKK..','.KKKKKKKKKKKKKKKKKK.','.KKKKKWWWWWWWWKKKKK.','..KKKWWWWWWWWWWKKK..',
 '..KWWWWWWWWWWWWWWK..','..KWWWWWWWWWWWWWWK..','..KWWKKKWWWWKKKWWK..','..KWKWKKWWWWKKWKWK..',
 '..KWKKKKWWWWKKKKWK..','..KWWKKWWWWWWKKWWK..','..KWWWWWWKKWWWWWWK..','..KWPPWWWWWWWWPPWK..',
 '...KWWWWWWWWWWWWK...','....KKKKKKKKKKKK....','...KKKWWWWWWWWKKK...','..KKKKWWWWWWWWKKKK..',
 '..KKKKWWWWWWWWKKKK..','..KKKKWWWWWWWWKKKK..','..KKKKWWWWWWWWKKKK..','...KKKWWWWWWWWKKK...',
 '....KWWWWWWWWWWK....','....KWWWWWWWWWWK....','....KKKKK..KKKKK....','....KKKKK..KKKKK....',
 '...KKKKKK..KKKKKK...','...KKKKKK..KKKKKK...'];
const PAL = {
  panda: { K: '#20142e', W: '#f6f6ff', P: '#ff93ab' },
  red:   { K: '#4a2a14', W: '#ffb25a', P: '#ff93ab' },   // palette swap for the 2nd friend
};
const CANE = [ 'g..g','gg.g','.gdg','.Ll.','.Ll.','.Ll.','.Ll.','.DD.','.Ll.','.Ll.','.Ll.','.Ll.','.DD.',
  '.Ll.','.Ll.','.Ll.','.Ll.','.DD.','.Ll.','.Ll.','.Ll.','.Ll.','.DD.','.Ll.','.Ll.','.Ll.','.Ll.' ];
const CANEPAL = { g: '#3c9a4d', d: '#2f7d3e', L: '#8be08f', l: '#4caf50', D: '#2f7d3e' };
const PixelCharacter = (x, y, s, pal) => sprite(PANDA, PAL[pal], s, x, y);

// ---------- PixelBird: 2 wing frames flipped with steps(1) ----------
const BIRD = [['K.......K','KK.....KK','.KK.K.KK.','..KKKKK..','....K....'],
              ['....K....','..KKKKK..','.KK.K.KK.','KK.....KK','K.......K']];
const PixelBird = (y, dur, delay, scale = 4) => `<g class="fly" style="animation-duration:${dur}s;animation-delay:${delay}s"><g transform="translate(0 ${y})">
  <g class="f1">${sprite(BIRD[0], { K: '#2a2d40' }, scale)}</g><g class="f2">${sprite(BIRD[1], { K: '#2a2d40' }, scale)}</g></g></g>`;

// ---------- Wind: pixel streaks that sweep across with steps() ----------
const streak = (w, y) => `<rect x="0" y="${y}" width="${w}" height="4" fill="#fff" opacity=".85"/><rect x="${w}" y="${y - 4}" width="8" height="4" fill="#fff" opacity=".85"/><rect x="${w + 8}" y="${y - 8}" width="8" height="4" fill="#fff" opacity=".85"/>`;
const Wind = () => [[60, 150, 3.6, 0], [90, 195, 4.2, -1.4], [48, 120, 3.2, -2.5], [72, 238, 3.9, -0.8]]
  .map(([w, y, d, dl]) => `<g class="wind" style="animation-duration:${d}s;animation-delay:${dl}s">${streak(w, y)}<rect x="${w + 40}" y="${y + 8}" width="8" height="8" fill="#6fd25a"/></g>`).join(''); // 8x8 leaf rides the gust

// ---------- full 5x7 pixel font (each glyph = 7 rows of 5-bit numbers) ----------
const FONT = {A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[14,17,16,16,16,17,14],D:[30,17,17,17,17,17,30],E:[31,16,16,30,16,16,31],
F:[31,16,16,30,16,16,16],G:[14,17,16,23,17,17,15],H:[17,17,17,31,17,17,17],I:[14,4,4,4,4,4,14],J:[7,2,2,2,2,18,12],K:[17,18,20,24,20,18,17],
L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],N:[17,25,21,19,17,17,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],
Q:[14,17,17,17,21,18,13],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],
W:[17,17,17,21,21,27,17],X:[17,17,10,4,10,17,17],Y:[17,17,10,4,4,4,4],Z:[31,1,2,4,8,16,31],0:[14,17,19,21,25,17,14],1:[4,12,4,4,4,4,14],
2:[14,17,1,2,4,8,31],3:[30,1,1,14,1,1,30],4:[2,6,10,18,31,2,2],5:[31,16,30,1,1,17,14],6:[6,8,16,30,17,17,14],7:[31,1,2,4,8,8,8],
8:[14,17,17,14,17,17,14],9:[14,17,17,15,1,2,12],'.':[0,0,0,0,0,12,12],',':[0,0,0,0,12,4,8],'!':[4,4,4,4,4,0,4],'/':[1,1,2,4,8,16,16],
'&':[12,18,20,8,21,18,13],'-':[0,0,0,31,0,0,0],':':[0,12,12,0,12,12,0],'+':[0,4,4,31,4,4,0],'>':[16,8,4,2,4,8,16],"'":[4,4,8,0,0,0,0],'@':[14,17,23,23,23,16,14]};
const F = Object.fromEntries(Object.entries(FONT).map(([k, v]) => [k, v.map(n => n.toString(2).padStart(5, '0').replace(/1/g, '#').replace(/0/g, '.'))]));
// text(): one <g> per character, typed in one by one (CSS .ty). Works offline, no font files.
const text = (str, x, y, s, fill, t0, step = 0.15) => [...str].map((ch, i) => F[ch]
  ? `<g class="ty" style="animation-delay:${(t0 + i * step).toFixed(2)}s">${sprite(F[ch], { '#': fill }, s, x + i * 6 * s, y)}</g>` : '').join('');

// ---------- shared css ----------
const CSS = `.tw{animation:tw 1s steps(1) infinite}@keyframes tw{50%{opacity:.2}}
.idle{animation:idle 1.2s steps(1) infinite}@keyframes idle{50%{transform:translateY(-4px)}}
.ty{animation:ty var(--p,14s) steps(1) infinite backwards}@keyframes ty{0%{opacity:0}.01%{opacity:1}92%{opacity:1}92.01%{opacity:0}}
.cur{animation:cur 1s steps(1) infinite}@keyframes cur{50%{opacity:0}}
.f1{animation:fl .5s steps(1) infinite}.f2{animation:fl .5s steps(1) infinite reverse}@keyframes fl{0%{opacity:1}50%{opacity:0}}
.fly{animation-name:fly;animation-timing-function:steps(60);animation-iteration-count:infinite}@keyframes fly{from{transform:translateX(-60px)}to{transform:translateX(1000px)}}
.wind{animation-name:wind;animation-timing-function:steps(40);animation-iteration-count:infinite}@keyframes wind{from{transform:translateX(-140px)}to{transform:translateX(1060px)}}
.sway{animation:sw .8s steps(1) infinite}@keyframes sw{50%{transform:translateX(4px)}}
.cloud{animation:cl 80s steps(160) infinite}@keyframes cl{from{transform:translateX(-200px)}to{transform:translateX(1040px)}}`;

// =====================  BANNER  =====================
const Banner = () => {
  const bands = ['#0a0f2a', '#0b1030', '#101a45', '#162458', '#1d2f6b']
    .map((c, i) => `<rect y="${i * 56}" width="960" height="64" fill="${c}"/>`).join('');
  const stars = Array.from({ length: 26 }, (_, i) => `<rect class="tw" style="animation-delay:${(i % 5) * .2}s" x="${(i * 211) % 960}" y="${(i * 97) % 200}" width="4" height="4" fill="${i % 4 ? '#fff' : '#f8e878'}"/>`).join('');
  const planet = sprite(['..BBBB..','.BBGGBB.','BBGGBBBB','BGGBBBGB','BBBBBGGB','BBBGGGBB','.BBBBBB.','..BBBB..'], { B: '#3d8fd6', G: '#4caf50' }, 6, 816, 20);
  const frame = `<rect x="24" y="28" width="688" height="234" fill="#bcd0ff"/><rect x="28" y="32" width="680" height="226" fill="#0b1030"/>`;
  // typewriter lines. NOTE: no "open to collab", no "press start".
  const txt = text('SUMAN NAYAK', 64, 72, 8, '#ff8a1f', 0.3) + text('AI/ML STUDENT & BUILDER', 64, 156, 4, '#bcd0ff', 2.2)
    + `<rect class="cur" x="632" y="156" width="12" height="28" fill="#ff8a1f"/>`;
  const grass = `<rect y="288" width="960" height="32" fill="#2f7d3e"/><rect y="288" width="960" height="8" fill="#4caf50"/>`;
  const px = 790, py = 288 - 26 * 6 + 8;
  const panda = `<g class="idle">${PixelCharacter(px, py, 6, 'panda')}${sprite(CANE, CANEPAL, 6, px + 17 * 6, py - 2 * 6 + 6)}
    ${sprite(['KKK','KKK'], PAL.panda, 6, px + 16 * 6, py + 17 * 6)}</g>`;   // paw drawn over the cane = "holding" it
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 320" width="960" height="320" shape-rendering="crispEdges" role="img" aria-label="Suman Nayak - pixel banner with a panda holding sugarcane"><style>${CSS}</style>${bands}${stars}${planet}${frame}${txt}${grass}${panda}</svg>`;
};

// =====================  GRASS SCENE  =====================
const GrassScene = () => {
  const sky = ['#6ec1f2', '#86cdf6', '#9ed9f9', '#b5e3fb', '#cdeefd'].map((c, i) => `<rect y="${i * 50}" width="960" height="50" fill="${c}"/>`).join(''); // no sun
  const cloud = (x, y, d) => `<g class="cloud" style="animation-duration:${d}s;animation-delay:${-d * x / 1240}s"><g transform="translate(0 ${y})">${sprite(['..WWWW....','.WWWWWWW..','WWWWWWWWWW'], { W: '#fff' }, 8)}</g></g>`;
  const hills = Array.from({ length: 60 }, (_, i) => { const h = 40 + Math.round(18 * Math.sin(i / 5) + 10 * Math.sin(i / 2.3)); return `<rect x="${i * 16}" y="${240 - h}" width="16" height="${h + 30}" fill="#7fcf84"/>`; }).join('');
  const ground = `<rect y="268" width="960" height="52" fill="#4caf50"/><rect y="296" width="960" height="24" fill="#2f7d3e"/>`;
  const blades = `<g class="sway">${Array.from({ length: 80 }, (_, i) => `<rect x="${i * 12 + 2}" y="${252 + (i * 7) % 3 * 4}" width="4" height="${12 + (i * 5) % 3 * 4}" fill="${i % 2 ? '#6fd25a' : '#3a8c32'}"/>`).join('')}</g>`;
  const s = 6, gy = 288 - 26 * s;
  const L = 350, R = 490, hy = gy + 15 * s;                                // sprite x positions, hand height
  const friend = (x, pal, cls) => `<g class="${cls}"><g class="idle">${PixelCharacter(x, gy, s, pal)}</g></g>`;
  const arm = (x0, dir, pal) => `<g class="arm" style="transform-origin:${x0}px ${hy}px"><rect x="${dir > 0 ? x0 : x0 - 30}" y="${hy}" width="30" height="12" fill="${PAL[pal].K}"/><rect x="${dir > 0 ? x0 + 24 : x0 - 36}" y="${hy}" width="12" height="12" fill="#ff93ab"/></g>`;
  const birds = PixelBird(40, 16, -2) + PixelBird(80, 21, -9, 3) + PixelBird(24, 26, -15, 3);
  const css = CSS + `
.walkL{animation:wl 20s steps(13) infinite}@keyframes wl{0%{transform:translateX(-300px)}20%,100%{transform:translateX(0)}}
.walkR{animation:wr 20s steps(13) infinite}@keyframes wr{0%{transform:translateX(300px)}20%,100%{transform:translateX(0)}}
.arm{animation:arm 20s steps(3) infinite}@keyframes arm{0%,30%{transform:scaleX(0)}34%,88%{transform:scaleX(1)}90%,100%{transform:scaleX(0)}}
/* smooth camera: continuous eased scale, NOT steps(), GPU-composited -> no lag */
.cam{transform-origin:480px ${hy}px;will-change:transform;animation:cam 20s infinite}
@keyframes cam{0%,28%{transform:scale(1);animation-timing-function:cubic-bezier(.45,0,.2,1)}42%,82%{transform:scale(1.8);animation-timing-function:cubic-bezier(.45,0,.2,1)}95%,100%{transform:scale(1)}}`;
  const camAttr = HS ? ` transform="translate(480 ${hy}) scale(1.8) translate(-480 -${hy})"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 320" width="960" height="320" shape-rendering="crispEdges" role="img" aria-label="Two pixel pandas face the viewer and shake hands on a windy field"><style>${HS ? css.replace(/\.cam\{[^}]*\}/, '') : css}</style>
<g class="cam"${camAttr}>${sky}${cloud(120, 24, 80)}${cloud(620, 64, 95)}${hills}${ground}${blades}
${friend(L, 'panda', 'walkL')}${friend(R, 'red', 'walkR')}<g class="walkL">${arm(L + 17 * s, 1, 'panda')}</g><g class="walkR">${arm(R + 3 * s, -1, 'red')}</g>
${Wind()}${birds}</g></svg>`;
};

const out = HS ? 'hs_' : '';
writeFileSync('assets/' + out + 'banner.svg', Banner());
writeFileSync('assets/' + out + 'grass.svg', GrassScene());
if (!HS) {
// =====================  README ASSETS (GBA dialog style)  =====================
const svgDoc = (w, h, body, label, p = 14) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges" role="img" aria-label="${label}" style="--p:${p}s"><style>${CSS}</style>${body}</svg>`;
const notch = (x, y, w, h, c) => `<rect x="${x + 4}" y="${y}" width="${w - 8}" height="${h}" fill="${c}"/><rect x="${x}" y="${y + 4}" width="${w}" height="${h - 8}" fill="${c}"/>`; // corner-notched box
function dialog(w, lines, s = 3, label = '') {                       // Pokemon-style text box, text typed per character
  const step = 0.04, lh = 7 * s + 12, h = 28 + lines.length * lh + 8; let t = 0.3;
  let b = notch(0,0,w,h,'#383838') + notch(4,4,w-8,h-8,'#f8f8f8') + notch(8,8,w-16,h-16,'#5a6ad0') + notch(12,12,w-24,h-24,'#f8f8f8');
  lines.forEach((l, i) => { const [str, fill = '#383838'] = Array.isArray(l) ? l : [l], y = 24 + i * lh;
    b += text(str, 29, y + 3, s, '#b8b8c8', t, step) + text(str, 26, y, s, fill, t, step); t += str.length * step; }); // grey shadow + text
  b += `<g class="cur">${sprite(['#####', '.###.', '..#..'], { '#': '#e04040' }, 4, w - 48, h - 40)}</g>`;   // blinking "next" arrow
  return svgDoc(w, h, b, label || lines.map(l => [].concat(l)[0]).join('. '), Math.ceil((t + 4) / 0.92));
}
const A = (n, s) => writeFileSync(`assets/${n}.svg`, s);
A('h-about', dialog(960, ['ABOUT ME'], 4));            A('h-stack', dialog(960, ['TECH STACK'], 4));
A('h-projects', dialog(960, ['PROJECTS'], 4));          A('h-analytics', dialog(960, ['GITHUB ANALYTICS'], 4));
A('h-graph', dialog(960, ['CONTRIBUTION GRAPH'], 4));   A('h-connect', dialog(960, ["LET'S CONNECT"], 4));
A('trainer', dialog(960, [['TRAINER: SUMAN NAYAK', '#d9650a'], 'CLASS: AI/ML STUDENT AND BUILDER', 'FAVOURITE MOVES: CV, GEN AI, LLMS'], 3, 'Trainer card'));
A('about', dialog(960, ['BE IN AI & ML AT HKBK COLLEGE OF ENGINEERING', 'FOCUS: COMPUTER VISION, GENERATIVE AI, LLMS',
  'BUILDING: MEMORYMATE, MOBILE APP - IN PROGRESS', 'GOAL: AI/ML ENGINEER - CV AND GEN AI PRODUCTS'], 3, 'About me'));
A('p-orbital', dialog(960, [['ORBITAL-EYE', '#d9650a'], 'REAL-TIME 3D SATELLITE TRACKING - TEAM OF 3', 'FASTAPI  POSTGRESQL  REACT'], 3));
A('p-vallet', dialog(960, [['VALLET', '#d9650a'], 'AI REMITTANCE COMPARATOR', 'PYTHON  FASTAPI  POSTGRESQL  REACT'], 3));
A('p-memorymate', dialog(960, [['MEMORYMATE', '#d9650a'], 'MOBILE APP - IN PROGRESS', 'REACT NATIVE  EXPO  FIREBASE'], 3));
A('b-linkedin', dialog(232, ['LINKEDIN'], 3)); A('b-instagram', dialog(232, ['INSTAGRAM'], 3)); A('b-github', dialog(232, ['GITHUB'], 3));
A('footer', dialog(960, ['SEE YOU IN THE NEXT COMMIT!'], 4));
const TILES = [['PYTHON','#3776ab'],['FASTAPI','#05998b'],['REACT','#61dafb'],['JS','#f7df1e'],['POSTGRES','#336791'],
               ['FIREBASE','#ffca28'],['DOCKER','#2496ed'],['GIT','#f05032'],['GITHUB','#181717'],['VSCODE','#007acc']];
A('stack', svgDoc(960, 116, TILES.map(([n, c], i) => { const x = (i % 5) * 198, y = Math.floor(i / 5) * 64;
  return notch(x,y,168,52,'#383838') + notch(x+4,y+4,160,44,'#f8f8f8') + `<rect x="${x+14}" y="${y+14}" width="24" height="24" fill="${c}"/>` + text(n, x+46, y+19, 2, '#383838', .3 + i * .5, .05);
}).join(''), 'Tech stack: Python, FastAPI, React, JS, Postgres, Firebase, Docker, Git, GitHub, VS Code', 10));
}
console.log('done');
