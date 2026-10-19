import fs from 'fs';

// ============================================================================
// 1. PIXEL ART COMPILER (Renders 2D ASCII Matrices into Crisp SVG <rect> Runs)
// ============================================================================
function renderMatrix(matrix, palette, scale = 1, offsetX = 0, offsetY = 0) {
  let rects = '';
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      if (char === '.' || char === ' ' || !palette[char]) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === char) {
        run++;
      }
      rects += `<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${run * scale}" height="${scale}" fill="${palette[char]}" />`;
      x += run;
    }
  }
  return rects;
}

// ============================================================================
// 2. SPRITE DEFINITIONS
// ============================================================================

// A. User's Uploaded Pixel Panda (Blue inner ears, heart nose, blush, bamboo)
const pandaPalette = {
  'K': '#14141f', // Black outline & fur
  'D': '#28293d', // Dark charcoal fur highlight
  'W': '#ffffff', // Pure white fur
  'L': '#dce3f2', // Soft blue-grey fur shading
  'B': '#4c6ef5', // Blue inner ears
  'N': '#1864ab', // Dark blue heart nose
  'C': '#4dabf7', // Bright cyan paw pads & nose shine
  'P': '#ffadb0', // Pink cheek blush
  'G': '#2b8a3e', // Dark green bamboo
  'M': '#51cf66', // Mid green bamboo
  'Y': '#b2f2bb'  // Light green bamboo highlight
};

const pandaMatrix = [
  "............K..K.K..............",
  "...........KK.KKKKK.............",
  ".....KKKKK..KKKKKK..KKKKK.......",
  "....KDDDDKKKWWWWWWKKKDDDDK......",
  "...KDDKBBBKKWWWWWWKKBBBKDDK.....",
  "...KDKBBBBBKWWWWWWKBBBBBKDK.....",
  "...KDKBBBBKWWWWWWWWKBBBBKDK.....",
  "....KKKBBKWWWWWWWWWWKBBKKK......",
  ".....KKWWWWWWWWWWWWWWWWKK.......",
  "....KWWWWWWWWWWWWWWWWWWWWK......",
  "....KWWWWKKKKWWWWKKKKWWWWK......",
  "...KWWWWKKKKKKWWKKKKKKWWWWK.....",
  "...KWWWWKKWWKKWWKKWWKKWWWWK.....",
  "...KWWWWKKWKKKNNKKWKKKWWWWK.....",
  "...KWWWWKKKKKNNCNKKKKKWWWWK.....",
  "....KWWWPPWWWWNNWWWWPPWWWK......",
  "....KWWWWWWWKWWKWKWWWWWWWK......",
  ".....KWWWWWWWKKKKWWWWWWWK.......",
  "......KKWWWWWWWWWWWWWWKK........",
  "...KKKKKKKGGGGMMGGGGKKKK........",
  "..KDDDDDDKGGGGYYGGGGKDDDK.......",
  ".KDDDDDDDKMMGGGGKKKKDDDDK.......",
  ".KDDDDDDKKWWWWWWKDDDDDDDK.......",
  "..KKKKKK.KWWWWWWWKKKKGGGGMMK....",
  "........KWWWWWWWWWWWWKGGGGYK....",
  ".......KWWKKKKWWWWWKKKKKKKK.....",
  "......KWWKWKDKWWWWWKDKWKWWK.....",
  "......KWWKKKKKWWWWKKKKKKWWK.....",
  "......KWWKDDDDKWWKDDDDKWWK......",
  ".......KKKDDCCKLLKCCDDKKK.......",
  "........KKDDCCKKKKCCDDKK........",
  ".........KKKKKK..KKKKKK........."
];

// B. 64x64 Grid Anime Characters Doing Handshake (32x32 base scaled 2x = 64x64)
const animePalette = {
  'K': '#12131a', // Crisp GBA Outline
  'S': '#ffcdb2', // Skin Light
  'M': '#e59866', // Skin Shadow
  'H': '#2b2d42', // Left Hero Spiky Dark Hair
  'h': '#4a4e69', // Left Hero Hair Highlight
  'R': '#e63946', // Red Headband & Shoes
  'r': '#9d0208', // Dark Red Shade
  'U': '#1d3557', // Hero Blue Tunic
  'u': '#457b9d', // Hero Tunic Highlight
  'V': '#8d6e63', // Adventurer Vest / Backpack
  'v': '#5d4037', // Vest Shadow
  'G': '#6b705c', // Cargo Pants
  'g': '#3f4238', // Cargo Pants Shadow
  'C': '#00b4d8', // Right Rival Cyan/Teal Hair
  'c': '#90e0ef', // Cyan Hair Highlight
  'A': '#f72585', // Magenta Anime Hair Streak
  'J': '#7209b7', // Rival Tech Jacket
  'j': '#b5179e', // Jacket Highlight
  'Y': '#ffb703', // Gold Trim / Badge
  'T': '#3a0ca3', // Dark Jeans
  'W': '#ffffff'  // Eyes / Shoes Highlight
};

// Left Anime Trainer (Facing Right, extending right arm for handshake)
const leftTrainer32 = [
  "........KK....KKK...............",
  ".......KHHK..KHHHK..............",
  ".....KKHHHHKKHHHHHKK............",
  "....KHHHHHHHHHHHHHHHK...........",
  "..KKHHHHhHHHHHHHHhHHHK..........",
  ".KHHHHHhHHHHHHHHHHhHHK..........",
  "..KKKHHHHHHHHHHHHHHHHKKK........",
  ".KRRRRRRRRRRRRRRRRRRRRRRK.......",
  "KrrrKKKKHHHHHHHHKKKKrrrrK.......",
  "KrrK....KHHHHHHKSSKWK............",
  ".KK.....KHHHHHKSSSSKWK..........",
  "........KHHHHHKSSSSSSK..........",
  "........KHHHHKSSSSSSMK..........",
  ".........KHHK.KSSSSMKK..........",
  "..........KK..KMMMMK............",
  "........KKKKKKKVVVVKKKK.........",
  ".......KvvvvvKVVVVVVUUUK........",
  "......KvvvvvvKVVVVVUUUUUK.......",
  "......KvvvvvvKVVVVVUUUUUK.......",
  "......KvvvvvvKVVVVVVUUUUKKKK....",
  "......KvvvvvvKVVVVVVVUKSSSSSK...",
  ".......KKKKKKKVVVVVVVKKMMMMSSK..",
  ".........KGGGGGGGGGGGGK..KKKK...",
  ".........KGGGGGGGGGGGGK.........",
  "........KGGGGgKKKKGGGGgK........",
  "........KGGGGgK..KGGGGgK........",
  "........KGGGGgK..KGGGGgK........",
  ".......KGGGGggK..KGGGGggK.......",
  ".......KvvvvvK....KvvvvvK.......",
  ".......KvvvvvK....KvvvvvK.......",
  "......KRRRRRRK...KRRRRRRK.......",
  "......KKKKKKKK...KKKKKKKK......."
];

// Right Anime Trainer (Facing Left, extending left arm to clasp hands)
const rightTrainer32 = [
  "..............KKKKKKK...........",
  "............KKCCCCCCCcKK........",
  "...........KCCCCCCCCCCCcK.......",
  "..........KCAACCCCCCAACCCK......",
  ".........KCCAAACCCCAAACCCCK.....",
  "........KCCCCAACCCCAACCCCCK.....",
  "........KCCCCCKKKKKCCCCCCCCK....",
  "........KCCCcKWKSSKCCCCCCCCK....",
  "........KCCCcKWKSSSSKCCCCCCK....",
  ".........KCCCKSSSSSSKCCCCCK.....",
  ".........KCCCKMSSSSSSKCCCK......",
  "..........KCK.KKMSSSSKCCK.......",
  "...........K....KMMMMKCK........",
  "..............KKKJJJJJKK........",
  ".............KJJjJJJJYjJK.......",
  "............KJJjJJJJJYYjJK......",
  "...........KJJjJJJJJJJJjJK......",
  "...KKKK...KJJjJJJJJJJJJJjJK.....",
  "..KSSSSK.KJJjJJJJJJJJJJJjJK.....",
  "..KSSMMMKJJjJJKKKJJJJJJJJJK.....",
  "...KKKK..KKKK...KTTTTTTTTK......",
  "................KTTTTTTTTK......",
  "...............KTTTTKKKKTTK.....",
  "...............KTTTTK..KTTK.....",
  "...............KTTTTK..KTTK.....",
  "..............KTTTTTK..KTTTK....",
  "..............KTTTTTK..KTTTK....",
  "..............KWWWWWK..KWWWWK...",
  ".............KRRRRRRK.KRRRRRRK..",
  ".............KWWWWWWK.KWWWWWWK..",
  ".............KKKKKKKK.KKKKKKKK..",
  "................................"
];

// ============================================================================
// 3. GENERATE BANNER.SVG (GBA Title Screen + Uploaded Panda + Looping Text)
// ============================================================================
function generateBanner() {
  const pandaSvg = renderMatrix(pandaMatrix, pandaPalette, 3, 55, 52);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="100%" height="100%" shape-rendering="crispEdges">
  <defs>
    <style>
      .pixel-title {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-weight: 900;
        font-size: 30px;
        fill: #ffd43b;
        letter-spacing: 2px;
      }
      .pixel-title-shadow {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-weight: 900;
        font-size: 30px;
        fill: #1a1b26;
        letter-spacing: 2px;
      }
      .pixel-sub {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 15px;
        fill: #ffffff;
        letter-spacing: 1.5px;
      }
      .gba-badge {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 12px;
        fill: #14141f;
      }
      /* Infinite Looping Typewriter Animations */
      .loop-type-1 {
        clip-path: inset(0 100% 0 0);
        animation: typeLoop1 8s steps(36, end) infinite;
      }
      .loop-type-2 {
        clip-path: inset(0 100% 0 0);
        animation: typeLoop2 8s steps(44, end) infinite;
      }
      @keyframes typeLoop1 {
        0%, 5% { clip-path: inset(0 100% 0 0); }
        35%, 85% { clip-path: inset(0 0% 0 0); }
        95%, 100% { clip-path: inset(0 100% 0 0); }
      }
      @keyframes typeLoop2 {
        0%, 35% { clip-path: inset(0 100% 0 0); }
        65%, 85% { clip-path: inset(0 0% 0 0); }
        95%, 100% { clip-path: inset(0 100% 0 0); }
      }
      /* Panda Bounce & Sparkle Animations */
      .panda-bounce {
        animation: pandaIdle 1.6s steps(2, end) infinite;
      }
      @keyframes pandaIdle {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-4px); }
      }
      .cloud-drift {
        animation: cloudMove 28s steps(120, end) infinite;
      }
      @keyframes cloudMove {
        0% { transform: translateX(0px); }
        100% { transform: translateX(-180px); }
      }
      .blink-cursor {
        animation: blink 0.8s steps(2, end) infinite;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    </style>

    <!-- GBA Dither Pattern -->
    <pattern id="ditherSky" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#3b82f6"/>
      <rect x="0" y="0" width="4" height="4" fill="#60a5fa"/>
      <rect x="4" y="4" width="4" height="4" fill="#60a5fa"/>
    </pattern>
    <pattern id="ditherBand" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#60a5fa"/>
      <rect x="0" y="0" width="4" height="4" fill="#93c5fd"/>
      <rect x="4" y="4" width="4" height="4" fill="#93c5fd"/>
    </pattern>
  </defs>

  <!-- Outer GBA Wood & Gold Pixel Frame -->
  <rect x="0" y="0" width="900" height="240" fill="#14141f"/>
  <rect x="4" y="4" width="892" height="232" fill="#7c4dff"/>
  <rect x="8" y="8" width="884" height="224" fill="#d97706"/>
  <rect x="12" y="12" width="876" height="216" fill="#fef08a"/>
  <rect x="16" y="16" width="868" height="208" fill="#1e293b"/>

  <!-- Sky Background Bands (Pokémon Emerald Horizon) -->
  <rect x="20" y="20" width="860" height="70" fill="#2563eb"/>
  <rect x="20" y="90" width="860" height="16" fill="url(#ditherSky)"/>
  <rect x="20" y="106" width="860" height="50" fill="#60a5fa"/>
  <rect x="20" y="156" width="860" height="16" fill="url(#ditherBand)"/>
  <rect x="20" y="172" width="860" height="32" fill="#93c5fd"/>

  <!-- Distant Pixel Mountains & Trees -->
  <polygon points="20,204 90,140 160,204" fill="#1e3a8a"/>
  <polygon points="120,204 210,120 300,204" fill="#1d4ed8"/>
  <polygon points="680,204 770,130 860,204" fill="#1e3a8a"/>
  <rect x="20" y="196" width="860" height="12" fill="#15803d"/>
  <rect x="20" y="208" width="860" height="12" fill="#166534"/>

  <!-- Drifting Pixel Clouds -->
  <g class="cloud-drift" fill="#ffffff" opacity="0.9">
    <rect x="180" y="38" width="64" height="12"/>
    <rect x="192" y="28" width="40" height="10"/>
    <rect x="520" y="48" width="88" height="14"/>
    <rect x="536" y="36" width="56" height="12"/>
    <rect x="820" y="34" width="60" height="12"/>
    <rect x="832" y="24" width="36" height="10"/>
  </g>

  <!-- GBA Top-Left HUD Status Icons -->
  <g transform="translate(32, 28)">
    <!-- Pixel Heart -->
    <rect x="4" y="0" width="4" height="4" fill="#ef4444"/>
    <rect x="12" y="0" width="4" height="4" fill="#ef4444"/>
    <rect x="0" y="4" width="20" height="4" fill="#ef4444"/>
    <rect x="0" y="8" width="20" height="4" fill="#dc2626"/>
    <rect x="4" y="12" width="12" height="4" fill="#b91c1c"/>
    <rect x="8" y="16" width="4" height="4" fill="#991b1b"/>
    <!-- Lv. 99 Badge -->
    <rect x="30" y="0" width="96" height="20" fill="#14141f"/>
    <rect x="32" y="2" width="92" height="16" fill="#ffd43b"/>
    <text x="40" y="14" class="gba-badge">LV.99 SEN.DEV</text>
  </g>

  <!-- GBA Top-Right Cartridge / Offline Mode Indicator -->
  <g transform="translate(715, 28)">
    <rect x="0" y="0" width="150" height="22" fill="#14141f"/>
    <rect x="2" y="2" width="146" height="18" fill="#10b981"/>
    <rect x="10" y="7" width="8" height="8" fill="#ffffff" class="blink-cursor"/>
    <text x="24" y="15" class="gba-badge">GBA-ROM: OFFLINE</text>
  </g>

  <!-- Left Pedestal & Uploaded Pixel Panda Mascot -->
  <g transform="translate(0, 8)">
    <!-- Grassy Battle Platform under Panda -->
    <rect x="42" y="138" width="122" height="16" fill="#14532d"/>
    <rect x="36" y="132" width="134" height="14" fill="#22c55e"/>
    <rect x="44" y="135" width="118" height="8" fill="#86efac"/>
    <!-- Animated Uploaded Panda -->
    <g class="panda-bounce">
      ${pandaSvg}
    </g>
    <!-- Pixel Sparkles around Panda -->
    <g fill="#fef08a" class="blink-cursor">
      <rect x="42" y="72" width="4" height="12"/>
      <rect x="38" y="76" width="12" height="4"/>
      <rect x="158" y="64" width="4" height="12"/>
      <rect x="154" y="68" width="12" height="4"/>
    </g>
  </g>

  <!-- Right Main Nameplate & Looping Dialogue Box -->
  <g transform="translate(200, 48)">
    <!-- Name Shadow & Crisp Pixel Name -->
    <text x="4" y="44" class="pixel-title-shadow">PANDA // @FIND-SKILLS</text>
    <text x="0" y="40" class="pixel-title">PANDA // @FIND-SKILLS</text>

    <!-- Classic Pokémon Emerald Dialogue Frame -->
    <rect x="0" y="60" width="656" height="86" fill="#14141f"/>
    <rect x="4" y="64" width="648" height="78" fill="#f8fafc"/>
    <rect x="8" y="68" width="640" height="70" fill="#1e293b"/>

    <!-- Corner Gold Rivets -->
    <rect x="8" y="68" width="8" height="8" fill="#ffd43b"/>
    <rect x="640" y="68" width="8" height="8" fill="#ffd43b"/>
    <rect x="8" y="130" width="8" height="8" fill="#ffd43b"/>
    <rect x="640" y="130" width="8" height="8" fill="#ffd43b"/>

    <!-- Looping Typewriter Text Lines -->
    <g class="loop-type-1">
      <text x="26" y="96" class="pixel-sub" fill="#38bdf8">&gt; SENIOR MOTION DESIGNER &amp; FULL-STACK TRAINER</text>
    </g>
    <g class="loop-type-2">
      <text x="26" y="122" class="pixel-sub" fill="#a7f3d0">&gt; PIXEL-PERFECT UI, SHADERS &amp; OPEN-SOURCE TOOLS_</text>
    </g>

    <!-- Blinking GBA Red Next-Page Arrow -->
    <g transform="translate(620, 114)" class="blink-cursor">
      <rect x="0" y="0" width="16" height="4" fill="#ef4444"/>
      <rect x="4" y="4" width="8" height="4" fill="#ef4444"/>
      <rect x="6" y="8" width="4" height="4" fill="#ef4444"/>
    </g>
  </g>
</svg>`;

  fs.writeFileSync('banner.svg', svg, 'utf8');
}

// ============================================================================
// 4. GENERATE ABOUT.SVG (GBA Trainer Status Screen + Looping Bio & Skill Bars)
// ============================================================================
function generateAbout() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" width="100%" height="100%" shape-rendering="crispEdges">
  <defs>
    <style>
      .gba-header {
        font-family: 'Courier New', monospace;
        font-weight: 900;
        font-size: 18px;
        fill: #fef08a;
        letter-spacing: 2px;
      }
      .gba-text {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        font-size: 14px;
        fill: #f1f5f9;
        letter-spacing: 1px;
      }
      .gba-stat-label {
        font-family: 'Courier New', monospace;
        font-weight: 900;
        font-size: 13px;
        fill: #ffd43b;
      }
      /* Looping Typewriter Lines for Trainer Log */
      .bio-loop-1 { animation: bioType1 10s steps(38, end) infinite; }
      .bio-loop-2 { animation: bioType2 10s steps(38, end) infinite; }
      .bio-loop-3 { animation: bioType3 10s steps(38, end) infinite; }
      .bio-loop-4 { animation: bioType4 10s steps(38, end) infinite; }

      @keyframes bioType1 {
        0%, 4% { clip-path: inset(0 100% 0 0); }
        20%, 88% { clip-path: inset(0 0% 0 0); }
        96%, 100% { clip-path: inset(0 100% 0 0); }
      }
      @keyframes bioType2 {
        0%, 20% { clip-path: inset(0 100% 0 0); }
        40%, 88% { clip-path: inset(0 0% 0 0); }
        96%, 100% { clip-path: inset(0 100% 0 0); }
      }
      @keyframes bioType3 {
        0%, 40% { clip-path: inset(0 100% 0 0); }
        60%, 88% { clip-path: inset(0 0% 0 0); }
        96%, 100% { clip-path: inset(0 100% 0 0); }
      }
      @keyframes bioType4 {
        0%, 60% { clip-path: inset(0 100% 0 0); }
        80%, 88% { clip-path: inset(0 0% 0 0); }
        96%, 100% { clip-path: inset(0 100% 0 0); }
      }

      /* Animated GBA HP/EXP Skill Bars */
      .hp-fill-1 { animation: hpPulse 4s steps(8, end) infinite; }
      @keyframes hpPulse {
        0%, 100% { width: 220px; }
        50% { width: 204px; }
      }
    </style>

    <pattern id="pokedexGrid" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="#0f172a"/>
      <rect x="0" y="0" width="16" height="2" fill="#1e293b"/>
      <rect x="0" y="0" width="2" height="16" fill="#1e293b"/>
    </pattern>
  </defs>

  <!-- Outer GBA Pokédex Frame -->
  <rect x="0" y="0" width="900" height="320" fill="#14141f"/>
  <rect x="4" y="4" width="892" height="312" fill="#334155"/>
  <rect x="8" y="8" width="884" height="304" fill="#94a3b8"/>
  <rect x="12" y="12" width="876" height="296" fill="url(#pokedexGrid)"/>

  <!-- Top GBA Menu Header Bar -->
  <rect x="20" y="20" width="860" height="38" fill="#1e1b4b"/>
  <rect x="20" y="54" width="860" height="4" fill="#ffd43b"/>
  <rect x="32" y="30" width="16" height="16" fill="#ef4444"/>
  <rect x="36" y="34" width="8" height="8" fill="#fca5a5"/>
  <text x="60" y="44" class="gba-header">TRAINER PASSPORT // ID NO. 00420</text>
  <text x="650" y="44" class="gba-header" fill="#38bdf8">TIME: 999:59</text>

  <!-- LEFT PANEL: Looping Trainer Bio & Mission Log -->
  <g transform="translate(24, 72)">
    <rect x="0" y="0" width="416" height="220" fill="#14141f"/>
    <rect x="4" y="4" width="408" height="212" fill="#f8fafc"/>
    <rect x="8" y="8" width="400" height="204" fill="#0f172a"/>

    <!-- Subheader -->
    <rect x="16" y="16" width="384" height="28" fill="#1e293b"/>
    <text x="26" y="35" class="gba-stat-label">&gt; ACTIVE QUEST LOG [LOOPING]</text>

    <!-- Looping Typewriter Lines -->
    <g class="bio-loop-1">
      <text x="24" y="74" class="gba-text" fill="#38bdf8">* CLASS: Senior Motion &amp; UI Architect</text>
    </g>
    <g class="bio-loop-2">
      <text x="24" y="106" class="gba-text" fill="#4ade80">* SPECIALTY: 60FPS SVG &amp; Pixel Shaders</text>
    </g>
    <g class="bio-loop-3">
      <text x="24" y="138" class="gba-text" fill="#f472b6">* ENGINE: React, Next.js, Rust, WebGL</text>
    </g>
    <g class="bio-loop-4">
      <text x="24" y="170" class="gba-text" fill="#fde047">* STATUS: Building legendary repos!</text>
    </g>

    <!-- Bottom Badge Strip -->
    <rect x="16" y="184" width="384" height="20" fill="#1e293b"/>
    <text x="26" y="198" class="gba-text" font-size="11" fill="#94a3b8">BADGES: [★1] [★2] [★3] [★4] [★5] [★6] [★7] [★8]</text>
  </g>

  <!-- RIGHT PANEL: GBA Battle Stats & Tech Stack HP Bars -->
  <g transform="translate(456, 72)">
    <rect x="0" y="0" width="420" height="220" fill="#14141f"/>
    <rect x="4" y="4" width="412" height="212" fill="#f8fafc"/>
    <rect x="8" y="8" width="404" height="204" fill="#0f172a"/>

    <rect x="16" y="16" width="388" height="28" fill="#1e293b"/>
    <text x="26" y="35" class="gba-stat-label">&gt; PARTY STATS // TECH MASTERY</text>

    <!-- Stat 1 -->
    <text x="24" y="72" class="gba-stat-label">MOTION / SVG</text>
    <rect x="150" y="58" width="236" height="18" fill="#1e293b"/>
    <rect x="154" y="62" width="220" height="10" fill="#22c55e" class="hp-fill-1"/>
    <text x="342" y="54" class="gba-text" font-size="11" fill="#4ade80">99/99</text>

    <!-- Stat 2 -->
    <text x="24" y="112" class="gba-stat-label">TYPESCRIPT</text>
    <rect x="150" y="98" width="236" height="18" fill="#1e293b"/>
    <rect x="154" y="102" width="212" height="10" fill="#38bdf8"/>
    <text x="342" y="94" class="gba-text" font-size="11" fill="#38bdf8">96/99</text>

    <!-- Stat 3 -->
    <text x="24" y="152" class="gba-stat-label">REACT / NEXT</text>
    <rect x="150" y="138" width="236" height="18" fill="#1e293b"/>
    <rect x="154" y="142" width="216" height="10" fill="#a855f7"/>
    <text x="342" y="134" class="gba-text" font-size="11" fill="#c084fc">98/99</text>

    <!-- Stat 4 -->
    <text x="24" y="192" class="gba-stat-label">UI / PIXEL ART</text>
    <rect x="150" y="178" width="236" height="18" fill="#1e293b"/>
    <rect x="154" y="182" width="228" height="10" fill="#eab308"/>
    <text x="342" y="174" class="gba-text" font-size="11" fill="#fde047">MAX</text>
  </g>
</svg>`;

  fs.writeFileSync('about.svg', svg, 'utf8');
}

// ============================================================================
// 5. GENERATE GRASS.SVG (64x64 Anime Characters Handshake Facing Each Other)
// ============================================================================
function generateGrass() {
  // 32x32 matrices rendered at scale=2 => True 64x64 Pixel Anime Sprites!
  // Positioned so their extended hands clasp at (448, 150)
  const leftHeroSvg = renderMatrix(leftTrainer32, animePalette, 2, 390, 110);
  const rightRivalSvg = renderMatrix(rightTrainer32, animePalette, 2, 444, 112);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 280" width="100%" height="100%" shape-rendering="crispEdges">
  <defs>
    <style>
      .battle-text {
        font-family: 'Courier New', monospace;
        font-weight: 900;
        font-size: 15px;
        fill: #ffffff;
        letter-spacing: 1px;
      }
      .hud-label {
        font-family: 'Courier New', monospace;
        font-weight: 900;
        font-size: 12px;
        fill: #14141f;
      }
      /* Subtle GBA Trainer Breathing & Handshake Motion */
      .trainer-left {
        animation: bobLeft 1.2s steps(2, end) infinite;
      }
      .trainer-right {
        animation: bobRight 1.2s steps(2, end) infinite;
      }
      @keyframes bobLeft {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
      }
      @keyframes bobRight {
        0%, 100% { transform: translateY(-2px); }
        50% { transform: translateY(0px); }
      }
      /* Handshake Spark Burst Animation */
      .handshake-spark {
        animation: sparkPulse 0.8s steps(2, end) infinite;
      }
      @keyframes sparkPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.25; }
      }
      /* Looping Battle Dialogue Text */
      .battle-loop-1 {
        animation: bType1 7s steps(42, end) infinite;
      }
      .battle-loop-2 {
        animation: bType2 7s steps(42, end) infinite;
      }
      @keyframes bType1 {
        0%, 5% { clip-path: inset(0 100% 0 0); }
        35%, 85% { clip-path: inset(0 0% 0 0); }
        95%, 100% { clip-path: inset(0 100% 0 0); }
      }
      @keyframes bType2 {
        0%, 35% { clip-path: inset(0 100% 0 0); }
        65%, 85% { clip-path: inset(0 0% 0 0); }
        95%, 100% { clip-path: inset(0 100% 0 0); }
      }
    </style>

    <!-- GBA Tall Grass Tile Pattern -->
    <pattern id="tallGrass" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="#16a34a"/>
      <rect x="2" y="4" width="4" height="10" fill="#15803d"/>
      <rect x="8" y="2" width="4" height="12" fill="#15803d"/>
      <rect x="4" y="2" width="2" height="6" fill="#4ade80"/>
      <rect x="10" y="0" width="2" height="6" fill="#4ade80"/>
    </pattern>
  </defs>

  <!-- Outer GBA Frame -->
  <rect x="0" y="0" width="900" height="280" fill="#14141f"/>
  <rect x="4" y="4" width="892" height="272" fill="#d97706"/>
  <rect x="8" y="8" width="884" height="264" fill="#fef08a"/>

  <!-- Pokémon Emerald Route 101 Meadow Sky & Grass Backdrop -->
  <rect x="12" y="12" width="876" height="100" fill="#38bdf8"/>
  <rect x="12" y="92" width="876" height="24" fill="#7dd3fc"/>
  <rect x="12" y="112" width="876" height="90" fill="#4ade80"/>
  <rect x="12" y="136" width="876" height="66" fill="#22c55e"/>

  <!-- Left & Right Stylized GBA Cliff Terraces -->
  <g fill="#78350f">
    <rect x="12" y="88" width="150" height="48"/>
    <rect x="738" y="88" width="150" height="48"/>
  </g>
  <g fill="#a16207">
    <rect x="16" y="92" width="142" height="40"/>
    <rect x="742" y="92" width="142" height="40"/>
  </g>
  <g fill="#15803d">
    <rect x="12" y="80" width="154" height="12"/>
    <rect x="734" y="80" width="154" height="12"/>
  </g>

  <!-- Tall Grass Patches Flanking the Center Arena -->
  <rect x="24" y="140" width="230" height="48" fill="url(#tallGrass)"/>
  <rect x="646" y="140" width="230" height="48" fill="url(#tallGrass)"/>

  <!-- Pixel Wildflowers -->
  <g>
    <rect x="280" y="150" width="6" height="6" fill="#f43f5e"/>
    <rect x="282" y="152" width="2" height="2" fill="#fef08a"/>
    <rect x="610" y="156" width="6" height="6" fill="#f43f5e"/>
    <rect x="612" y="158" width="2" height="2" fill="#fef08a"/>
    <rect x="320" y="172" width="6" height="6" fill="#fef08a"/>
    <rect x="570" y="170" width="6" height="6" fill="#fef08a"/>
  </g>

  <!-- Center Dirt & Grass Handshake Arena -->
  <rect x="350" y="164" width="200" height="18" fill="#15803d"/>
  <rect x="362" y="160" width="176" height="18" fill="#86efac"/>
  <rect x="374" y="163" width="152" height="12" fill="#fde68a"/>

  <!-- GBA Floating Nameplates Above Both Trainers -->
  <!-- Left Trainer HUD -->
  <g transform="translate(220, 26)">
    <rect x="0" y="0" width="176" height="36" fill="#14141f"/>
    <rect x="3" y="3" width="170" height="30" fill="#fef3c7"/>
    <text x="12" y="17" class="hud-label">DEV_HERO   Lv99</text>
    <rect x="12" y="22" width="146" height="6" fill="#14141f"/>
    <rect x="14" y="24" width="142" height="2" fill="#22c55e"/>
  </g>

  <!-- Right Trainer HUD -->
  <g transform="translate(504, 26)">
    <rect x="0" y="0" width="176" height="36" fill="#14141f"/>
    <rect x="3" y="3" width="170" height="30" fill="#fef3c7"/>
    <text x="12" y="17" class="hud-label">OPEN_SRC   Lv99</text>
    <rect x="12" y="22" width="146" height="6" fill="#14141f"/>
    <rect x="14" y="24" width="142" height="2" fill="#22c55e"/>
  </g>

  <!-- ================================================================== -->
  <!-- 64x64 ANIME CHARACTERS FACING EACH OTHER DOING HANDSHAKE           -->
  <!-- ================================================================== -->
  <g class="trainer-left">
    ${leftHeroSvg}
  </g>
  <g class="trainer-right">
    ${rightRivalSvg}
  </g>

  <!-- Pixel Handshake Impact Burst Rays (Centered on Clasped Hands) -->
  <g class="handshake-spark" fill="#ffd43b">
    <rect x="448" y="132" width="4" height="8"/>
    <rect x="448" y="164" width="4" height="8"/>
    <rect x="434" y="136" width="6" height="4"/>
    <rect x="460" y="136" width="6" height="4"/>
    <rect x="434" y="160" width="6" height="4"/>
    <rect x="460" y="160" width="6" height="4"/>
  </g>

  <!-- Bottom Pokémon GBA Battle Dialogue Box (Looping Text) -->
  <g transform="translate(12, 196)">
    <rect x="0" y="0" width="876" height="72" fill="#14141f"/>
    <rect x="4" y="4" width="868" height="64" fill="#f8fafc"/>
    <rect x="8" y="8" width="860" height="56" fill="#1e293b"/>

    <!-- Looping Battle Prompts -->
    <g class="battle-loop-1">
      <text x="28" y="32" class="battle-text" fill="#fde047">* DEV_HERO and OPEN_SRC formed an unstoppable alliance!</text>
    </g>
    <g class="battle-loop-2">
      <text x="28" y="54" class="battle-text" fill="#ffffff">* Ready to collaborate on high-impact projects? Let's connect! ▼</text>
    </g>
  </g>
</svg>`;

  fs.writeFileSync('grass.svg', svg, 'utf8');
}

// Run all generators
generateBanner();
generateAbout();
generateGrass();

// Clean up unused index.html if it exists
if (fs.existsSync('index.html')) {
  fs.unlinkSync('index.html');
  console.log('Removed unused index.html');
}

console.log('✅ Successfully generated GBA Pixel SVGs (banner.svg, about.svg, grass.svg)!');
