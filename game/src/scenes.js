// scenes.js — the three rooms of the Clockmaker's Workshop.
// Each level is one cosy room drawn twice: the left picture is the original
// and the right picture changes exactly seven small things. Every difference
// carries its label (shown in the footer checklist) and its spot on the
// picture in panel-local coordinates, so the art and the click test agree.
//
// The rooms share one layout — window, wall clock, shelf, picture, bench,
// rug and cat — and each level re-dresses it with its own light, colours
// and props, so the hunt stays fair: you learn the room, then study it.

export const LEVELS = [
  {
    id: 'morning',
    name: 'Level 1 — Morning in the Workshop',
    subtitle: 'Sunlight, fresh tea, and seven small changes. Find them all!',
    palette: {
      wall: '#f6d9a0', wallLower: '#eec27e', floor: '#9a6b43', floorDark: '#86592f',
      sky: '#a8d8f0', skyNight: false, windowFrame: '#6d4a2f',
      clockFace: '#fff8e6', clockRim: '#6d4a2f', shelf: '#7a5230',
      bench: '#8a5a33', benchTop: '#a9743f', rug: '#b8452f', rugStripe: '#f2b544',
      cat: '#e8823a', catDark: '#c96a28', lampShade: '#f2b544', lampGlow: 'rgba(242, 181, 68, 0.35)',
      bookRed: '#c0392b', bookBlue: '#2e6fb0', bookGreen: '#3d8b4f',
      gear: '#8f9aa5', gearDark: '#6d7780', teapot: '#3d6fb4', steam: 'rgba(255,255,255,0.9)',
      pictureSky: '#a8d8f0', pictureHill: '#5d9b4a',
    },
    differences: [
      { id: 'hands', label: 'Clock hands moved', x: 300, y: 90, r: 26 },
      { id: 'cat', label: 'Cat on the rug', x: 150, y: 335, r: 30 },
      { id: 'steam', label: 'Teapot steam', x: 330, y: 232, r: 24 },
      { id: 'book', label: 'Red book on the shelf', x: 440, y: 61, r: 26 },
      { id: 'gear', label: 'Gear on the bench', x: 470, y: 292, r: 26 },
      { id: 'bird', label: 'Bird at the window', x: 100, y: 152, r: 24 },
      { id: 'lamp', label: 'Lamp shade colour', x: 272, y: 238, r: 24 },
    ],
  },
  {
    id: 'tea',
    name: 'Level 2 — The Cuckoo’s Tea Break',
    subtitle: 'Afternoon tea while the cuckoo keeps time. Seven changes hide here.',
    palette: {
      wall: '#f2c9b8', wallLower: '#e5a98d', floor: '#8a5f3d', floorDark: '#75502f',
      sky: '#f7c873', skyNight: false, windowFrame: '#5d3d27',
      clockFace: '#fff3d6', clockRim: '#5d3d27', shelf: '#6d4526',
      bench: '#7c4f2c', benchTop: '#9c6a38', rug: '#3d6fb4', rugStripe: '#f7ead2',
      cat: '#8a7a68', catDark: '#6d5f50', lampShade: '#e8823a', lampGlow: 'rgba(232, 130, 58, 0.30)',
      bookRed: '#c0392b', bookBlue: '#2e6fb0', bookGreen: '#3d8b4f',
      gear: '#8f9aa5', gearDark: '#6d7780', teapot: '#b8452f', steam: 'rgba(255,255,255,0.9)',
      pictureSky: '#f7c873', pictureHill: '#b8452f',
    },
    differences: [
      { id: 'cuckoo', label: 'Cuckoo out of its clock', x: 105, y: 232, r: 24 },
      { id: 'cup', label: 'Teacup on the bench', x: 392, y: 286, r: 22 },
      { id: 'picture', label: 'Picture on the wall', x: 455, y: 160, r: 30 },
      { id: 'pendulum', label: 'Clock pendulum swung', x: 300, y: 152, r: 22 },
      { id: 'mouse', label: 'Mouse on the shelf', x: 520, y: 66, r: 20 },
      { id: 'rug', label: 'Stripe on the rug', x: 170, y: 366, r: 30 },
      { id: 'candle', label: 'Candle flame', x: 512, y: 272, r: 22 },
    ],
  },
  {
    id: 'midnight',
    name: 'Level 3 — Midnight Repairs',
    subtitle: 'Moonlight, lamplight and a deadline. The hardest seven yet.',
    palette: {
      wall: '#4a4a72', wallLower: '#3d3d60', floor: '#54402c', floorDark: '#463522',
      sky: '#1d2440', skyNight: true, windowFrame: '#2b2118',
      clockFace: '#e8e2c8', clockRim: '#2b2118', shelf: '#3a2c1c',
      bench: '#4a3520', benchTop: '#5d4526', rug: '#5d2f45', rugStripe: '#c9a86a',
      cat: '#3a3a3a', catDark: '#262626', lampShade: '#c9a86a', lampGlow: 'rgba(242, 181, 68, 0.45)',
      bookRed: '#8e2f24', bookBlue: '#24486e', bookGreen: '#2c5f38',
      gear: '#a8b2bc', gearDark: '#7d8892', teapot: '#5d6e8c', steam: 'rgba(220,225,255,0.85)',
      pictureSky: '#1d2440', pictureHill: '#2c4a2c',
    },
    differences: [
      { id: 'moon', label: 'Moon in the window', x: 100, y: 78, r: 28 },
      { id: 'stars', label: 'Stars in the sky', x: 138, y: 56, r: 20 },
      { id: 'lantern', label: 'Lantern glow', x: 272, y: 238, r: 24 },
      { id: 'lens', label: 'Magnifier on the bench', x: 428, y: 292, r: 24 },
      { id: 'teeth', label: 'Teeth on the gear', x: 470, y: 292, r: 26 },
      { id: 'eyes', label: 'Cat’s eyes', x: 172, y: 332, r: 24 },
      { id: 'key', label: 'Key on its hook', x: 352, y: 132, r: 20 },
    ],
  },
];

// How many differences a level hides. The counter in the header reads it.
export function differenceCount(level) {
  return level.differences.length;
}
