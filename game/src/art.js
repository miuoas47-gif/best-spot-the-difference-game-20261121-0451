// art.js — draws one picture of the Clockmaker's Workshop.
// drawRoom(ctx, level, variant) paints the room in panel-local coordinates
// (560 x 420). Variant 0 is the left picture, variant 1 the right picture:
// exactly the level's seven differences change between them, everything
// else is painted identically, so the two pictures are truly near-identical.
//
// Every difference is drawn right where scenes.js says it is, so a click
// on the painted change is a click on the difference itself.

import { LEVELS } from './scenes.js';

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function gear(ctx, x, y, r, teeth, fill, dark) {
  ctx.fillStyle = fill;
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillRect(-3, -r - 7, 6, 9);
    ctx.restore();
  }
  circle(ctx, x, y, r, fill);
  circle(ctx, x, y, r * 0.45, dark);
  circle(ctx, x, y, r * 0.16, fill);
}

function wallClock(ctx, p, level, variant) {
  // Big round clock on the wall, centre (300, 90).
  circle(ctx, 300, 90, 57, p.clockRim);
  circle(ctx, 300, 90, 50, p.clockFace);
  ctx.fillStyle = '#2b2118';
  ctx.font = 'bold 13px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12', 300, 50);
  ctx.fillText('3', 341, 90);
  ctx.fillText('6', 300, 130);
  ctx.fillText('9', 259, 90);
  // Hands: ten past ten on the left, eight minutes past on the right.
  // Only the morning level hides a difference here; in the other rooms
  // both pictures keep the same hands, or the hunt would have a phantom.
  const minuteAngle =
    level.id === 'morning' ? (variant === 0 ? -Math.PI / 3 : -Math.PI / 3 + 0.14) : -Math.PI / 3;
  const hourAngle = -Math.PI / 3 - 0.5;
  ctx.strokeStyle = '#2b2118';
  ctx.lineCap = 'round';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(300, 90);
  ctx.lineTo(300 + Math.cos(hourAngle) * 26, 90 + Math.sin(hourAngle) * 26);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 90);
  ctx.lineTo(300 + Math.cos(minuteAngle) * 40, 90 + Math.sin(minuteAngle) * 40);
  ctx.stroke();
  circle(ctx, 300, 90, 4, '#2b2118');
  // Pendulum rod and bob hang below the clock; level 2 swings it over.
  const bobX = level.id === 'tea' && variant === 1 ? 318 : 282;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 142);
  ctx.lineTo(bobX, 164);
  ctx.stroke();
  circle(ctx, bobX, 168, 9, p.gearDark);
}

function windowView(ctx, p, level, variant) {
  // Window on the left wall, with the sky, the sun or moon, and a sill.
  rect(ctx, 30, 30, 140, 140, p.windowFrame);
  rect(ctx, 38, 38, 124, 124, p.sky);
  if (p.skyNight) {
    // Midnight: a full moon on the left, a crescent on the right.
    circle(ctx, 100, 78, 22, '#f7ead2');
    if (variant === 1) circle(ctx, 108, 72, 19, p.sky);
    circle(ctx, 88, 70, 3, '#d8cfae');
    circle(ctx, 106, 88, 2, '#d8cfae');
    // One star hides near (138, 56); two more stars never move.
    if (variant === 0) star(ctx, 138, 56, 7, '#f7ead2');
    star(ctx, 58, 52, 5, '#f7ead2');
    star(ctx, 148, 112, 5, '#f7ead2');
    rect(ctx, 38, 138, 124, 24, '#2c4a2c');
  } else {
    circle(ctx, 100, 78, 20, '#f7d54a');
    ctx.strokeStyle = 'rgba(247, 213, 74, 0.7)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(100 + Math.cos(a) * 25, 78 + Math.sin(a) * 25);
      ctx.lineTo(100 + Math.cos(a) * 31, 78 + Math.sin(a) * 31);
      ctx.stroke();
    }
    rect(ctx, 38, 138, 124, 24, '#5d9b4a');
    circle(ctx, 60, 132, 10, '#4a7d3a');
    circle(ctx, 140, 136, 12, '#4a7d3a');
  }
  // Sill and its visitor: a little bird in the morning, gone by the right.
  rect(ctx, 24, 170, 152, 10, p.windowFrame);
  if (level.id === 'morning' && variant === 0) {
    ellipse(ctx, 100, 156, 12, 9, '#5d7ea6');
    circle(ctx, 110, 148, 6, '#5d7ea6');
    ctx.fillStyle = '#f2b544';
    ctx.beginPath();
    ctx.moveTo(116, 148);
    ctx.lineTo(122, 150);
    ctx.lineTo(116, 152);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#5d7ea6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(92, 164);
    ctx.lineTo(92, 170);
    ctx.moveTo(102, 164);
    ctx.lineTo(102, 170);
    ctx.stroke();
  }
}

function shelfAndBooks(ctx, p, level, variant) {
  // Shelf with five standing books; the middle book changes colour.
  rect(ctx, 380, 78, 160, 10, p.shelf);
  const books = [
    { x: 392, w: 18, c: p.bookBlue },
    { x: 412, w: 16, c: p.bookGreen },
    { x: 430, w: 20, c: level.id === 'morning' && variant === 1 ? p.bookBlue : p.bookRed },
    { x: 452, w: 16, c: p.bookGreen },
    { x: 470, w: 18, c: p.bookBlue },
  ];
  for (const b of books) {
    rect(ctx, b.x, 44, b.w, 34, b.c);
    rect(ctx, b.x + 3, 48, b.w - 6, 3, 'rgba(255,255,255,0.35)');
  }
  // A lean-to book on the right end.
  ctx.save();
  ctx.translate(512, 78);
  ctx.rotate(-0.22);
  rect(ctx, -9, -32, 18, 32, p.bookRed);
  ctx.restore();
  // Afternoon tea: a small grey mouse sits on the shelf end — or not.
  if (level.id === 'tea' && variant === 0) {
    ellipse(ctx, 522, 68, 11, 8, '#9a9a9a');
    circle(ctx, 532, 62, 6, '#9a9a9a');
    circle(ctx, 530, 56, 3, '#c9c9c9');
    ctx.strokeStyle = '#9a9a9a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(512, 70);
    ctx.quadraticCurveTo(500, 66, 498, 58);
    ctx.stroke();
  }
}

function pictureFrame(ctx, p, level, variant) {
  // Framed picture on the wall: hills by day, a sailboat by tea-time.
  rect(ctx, 390, 120, 130, 80, p.clockRim);
  rect(ctx, 396, 126, 118, 68, p.pictureSky);
  if (level.id === 'tea' && variant === 1) {
    rect(ctx, 396, 164, 118, 30, '#3d6fb4');
    ctx.fillStyle = '#f7ead2';
    ctx.beginPath();
    ctx.moveTo(440, 164);
    ctx.lineTo(440, 138);
    ctx.lineTo(462, 164);
    ctx.closePath();
    ctx.fill();
    rect(ctx, 436, 164, 30, 5, '#6d4a2f');
    circle(ctx, 486, 140, 8, '#f7d54a');
  } else {
    ellipse(ctx, 430, 194, 46, 22, p.pictureHill);
    ellipse(ctx, 490, 194, 42, 20, '#4a7d3a');
    circle(ctx, 486, 140, 9, '#f7d54a');
  }
  // Midnight: a brass key hangs on its hook beside the picture — or not.
  if (level.id === 'midnight') {
    circle(ctx, 352, 118, 4, p.gearDark);
    if (variant === 0) {
      ctx.strokeStyle = '#c9a86a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(352, 122);
      ctx.lineTo(352, 138);
      ctx.stroke();
      circle(ctx, 352, 144, 6, '#c9a86a');
      ctx.beginPath();
      ctx.moveTo(352, 150);
      ctx.lineTo(352, 158);
      ctx.moveTo(352, 154);
      ctx.lineTo(358, 154);
      ctx.stroke();
    }
  }
}

function wallProp(ctx, p, level, variant) {
  // The wall left of the bench: a hat on a hook, a cuckoo clock, or a
  // framed gear print, depending on the level.
  if (level.id === 'tea') {
    rect(ctx, 62, 196, 86, 66, '#7c4f2c');
    ctx.beginPath();
    ctx.moveTo(58, 196);
    ctx.lineTo(105, 172);
    ctx.lineTo(152, 196);
    ctx.closePath();
    ctx.fillStyle = '#7c4f2c';
    ctx.fill();
    circle(ctx, 105, 226, 20, p.clockFace);
    ctx.fillStyle = '#2b2118';
    ctx.font = 'bold 10px Trebuchet MS, Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('12', 105, 210);
    ctx.fillText('6', 105, 242);
    // The cuckoo pops out of its little door on the right picture only.
    if (variant === 1) {
      rect(ctx, 98, 246, 14, 12, '#2b2118');
      ellipse(ctx, 105, 240, 9, 7, '#3d6fb4');
      circle(ctx, 111, 234, 5, '#3d6fb4');
      ctx.fillStyle = '#f2b544';
      ctx.beginPath();
      ctx.moveTo(116, 234);
      ctx.lineTo(121, 236);
      ctx.lineTo(116, 238);
      ctx.closePath();
      ctx.fill();
    } else {
      rect(ctx, 98, 246, 14, 12, '#5d3d27');
    }
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(92, 262);
    ctx.lineTo(92, 280);
    ctx.moveTo(118, 262);
    ctx.lineTo(118, 280);
    ctx.stroke();
  } else if (level.id === 'morning') {
    circle(ctx, 105, 210, 4, p.gearDark);
    ctx.strokeStyle = '#6d4a2f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(105, 214);
    ctx.lineTo(105, 224);
    ctx.stroke();
    ellipse(ctx, 105, 236, 34, 10, '#5d7ea6');
    ellipse(ctx, 105, 222, 20, 14, '#5d7ea6');
    rect(ctx, 88, 226, 34, 6, '#f2b544');
  } else {
    rect(ctx, 66, 196, 78, 70, p.clockRim);
    rect(ctx, 72, 202, 66, 58, p.clockFace);
    gear(ctx, 105, 231, 16, 8, p.gear, p.gearDark);
  }
}

function benchAndTools(ctx, p, level, variant) {
  // The workbench and everything standing on it.
  rect(ctx, 250, 300, 290, 16, p.benchTop);
  rect(ctx, 262, 316, 14, 52, p.bench);
  rect(ctx, 514, 316, 14, 52, p.bench);
  rect(ctx, 250, 352, 290, 6, p.bench);

  // Lamp (levels 1–2) or lantern (level 3) at the bench's left end.
  const lit = !(level.id === 'midnight' && variant === 1);
  if (lit) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    circle(ctx, 272, 238, 46, p.lampGlow);
    ctx.restore();
  }
  rect(ctx, 268, 296, 8, 10, p.gearDark);
  ctx.strokeStyle = '#2b2118';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(272, 296);
  ctx.lineTo(272, 252);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(250, 252);
  ctx.lineTo(294, 252);
  ctx.lineTo(286, 218);
  ctx.lineTo(258, 218);
  ctx.closePath();
  ctx.fillStyle = level.id === 'morning' && variant === 1 ? '#3d8b4f' : p.lampShade;
  ctx.fill();
  if (lit) circle(ctx, 272, 236, 7, '#fff3c9');

  // Teapot with steam: three curls on the left, one lonely curl on the right
  // in the morning only; the other rooms steam the same on both sides.
  ellipse(ctx, 330, 286, 24, 15, p.teapot);
  circle(ctx, 330, 272, 9, p.teapot);
  ctx.strokeStyle = p.teapot;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(352, 282);
  ctx.quadraticCurveTo(362, 272, 354, 264);
  ctx.stroke();
  ctx.strokeStyle = p.steam;
  ctx.lineWidth = 3;
  const curls =
    level.id === 'morning' ? (variant === 0 ? [318, 330, 342] : [330]) : [324, 336];
  for (const cx of curls) {
    ctx.beginPath();
    ctx.moveTo(cx, 262);
    ctx.quadraticCurveTo(cx - 6, 250, cx, 240);
    ctx.quadraticCurveTo(cx + 6, 230, cx, 222);
    ctx.stroke();
  }

  // Teacup (level 2), a stack of plates (levels 1 and 3).
  if (level.id === 'tea') {
    if (variant === 0) {
      rect(ctx, 380, 276, 26, 14, '#f7ead2');
      ellipse(ctx, 393, 276, 13, 4, '#b8452f');
      ctx.strokeStyle = '#f7ead2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(408, 283, 6, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.translate(393, 292);
      ctx.rotate(Math.PI / 2);
      rect(ctx, -7, -13, 14, 26, '#f7ead2');
      ctx.restore();
      ellipse(ctx, 410, 290, 10, 3, '#b8452f');
    }
  } else {
    ellipse(ctx, 393, 296, 16, 4, '#f7ead2');
    ellipse(ctx, 393, 290, 14, 4, '#e8dcc0');
    ellipse(ctx, 393, 284, 12, 4, '#f7ead2');
  }

  // Magnifier (level 3) or a wrench (levels 1 and 2) beside the teapot.
  if (level.id === 'midnight' && variant === 0) {
    ctx.strokeStyle = '#2b2118';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(438, 300);
    ctx.lineTo(424, 312);
    ctx.stroke();
    circle(ctx, 428, 288, 15, '#c9a86a');
    ctx.save();
    ctx.globalAlpha = 0.35;
    circle(ctx, 428, 288, 12, '#a8d8f0');
    ctx.restore();
  } else if (level.id !== 'midnight') {
    ctx.strokeStyle = p.gearDark;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(420, 296);
    ctx.lineTo(440, 276);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(440, 276);
    ctx.lineTo(448, 268);
    ctx.moveTo(440, 276);
    ctx.lineTo(434, 266);
    ctx.stroke();
  }

  // Gear on the bench: present, or missing, or short of teeth.
  if (level.id === 'morning' && variant === 1) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ellipse(ctx, 470, 296, 22, 5, '#000000');
    ctx.restore();
  } else if (level.id === 'midnight') {
    gear(ctx, 470, 290, 17, variant === 0 ? 8 : 5, p.gear, p.gearDark);
  } else {
    gear(ctx, 470, 290, 17, 8, p.gear, p.gearDark);
  }

  // Candle (level 2) or a little jar (levels 1 and 3) at the bench's end.
  if (level.id === 'tea') {
    rect(ctx, 506, 272, 12, 28, '#f7ead2');
    if (variant === 0) {
      ctx.beginPath();
      ctx.moveTo(512, 270);
      ctx.quadraticCurveTo(506, 260, 512, 254);
      ctx.quadraticCurveTo(518, 260, 512, 270);
      ctx.fillStyle = '#f2b544';
      ctx.fill();
    } else {
      ctx.strokeStyle = 'rgba(200,200,200,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(512, 270);
      ctx.quadraticCurveTo(516, 260, 512, 252);
      ctx.stroke();
    }
  } else {
    rect(ctx, 504, 276, 16, 24, '#7ba05b');
    rect(ctx, 502, 272, 20, 6, '#5d7a44');
  }
}

function rugAndCat(ctx, p, level, variant) {
  // Round rug with stripes, and the workshop cat asleep on it.
  ellipse(ctx, 170, 366, 125, 34, p.rug);
  ellipse(ctx, 170, 366, 105, 26, p.rugStripe);
  ellipse(ctx, 170, 366, 82, 19, p.rug);
  if (level.id === 'tea' && variant === 1) {
    ellipse(ctx, 170, 366, 105, 26, p.rug);
    ellipse(ctx, 170, 366, 82, 19, p.rugStripe);
  }
  // Morning, right picture: the cat has wandered off entirely.
  if (level.id === 'morning' && variant === 1) return;
  ellipse(ctx, 150, 348, 34, 18, p.cat);
  circle(ctx, 178, 332, 14, p.cat);
  ctx.beginPath();
  ctx.moveTo(168, 322);
  ctx.lineTo(170, 310);
  ctx.lineTo(178, 320);
  ctx.closePath();
  ctx.fillStyle = p.cat;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(182, 320);
  ctx.lineTo(188, 309);
  ctx.lineTo(190, 322);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = p.cat;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(120, 350);
  ctx.quadraticCurveTo(100, 340, 104, 322);
  ctx.stroke();
  // Midnight: the cat's eyes are shut on the left, open on the right.
  if (level.id === 'midnight' && variant === 1) {
    circle(ctx, 174, 330, 2, '#f7ead2');
    circle(ctx, 182, 330, 2, '#f7ead2');
  } else {
    ctx.strokeStyle = p.catDark;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(174, 331, 3, Math.PI, 0);
    ctx.arc(182, 331, 3, Math.PI, 0);
    ctx.stroke();
  }
  ctx.fillStyle = '#e8b48a';
  ctx.beginPath();
  ctx.moveTo(190, 336);
  ctx.lineTo(194, 338);
  ctx.lineTo(190, 340);
  ctx.closePath();
  ctx.fill();
}

export function drawRoom(ctx, levelIndex, variant) {
  const level = LEVELS[levelIndex];
  const p = level.palette;
  rect(ctx, 0, 0, 560, 300, p.wall);
  rect(ctx, 0, 290, 560, 10, p.wallLower);
  rect(ctx, 0, 300, 560, 120, p.floor);
  ctx.fillStyle = p.floorDark;
  for (let y = 322; y < 420; y += 24) ctx.fillRect(0, y, 560, 2);
  windowView(ctx, p, level, variant);
  wallClock(ctx, p, level, variant);
  shelfAndBooks(ctx, p, level, variant);
  pictureFrame(ctx, p, level, variant);
  wallProp(ctx, p, level, variant);
  benchAndTools(ctx, p, level, variant);
  rugAndCat(ctx, p, level, variant);
}

// A red ring around a difference the player has found, on both pictures.
export function drawFoundMarker(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = '#e33e2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(227, 62, 43, 0.10)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r - 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// A pulsing gold ring: the hint points at one difference still hiding.
export function drawHintRing(ctx, x, y, r, phase) {
  ctx.save();
  const pulse = 1 + 0.18 * Math.sin(phase * 6);
  ctx.strokeStyle = '#f2b544';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(242, 181, 68, 0.18)';
  ctx.fill();
  ctx.restore();
}

// A red X where a click found nothing.
export function drawWrongMark(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#e33e2b';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}
