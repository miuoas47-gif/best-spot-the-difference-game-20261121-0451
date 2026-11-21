// render.js — paints one frame of the Clockmaker's Workshop.
// Header (title, level, found counter, timer, score), the two pictures
// with their found-markers and hint ring, and the footer (found list,
// message, buttons). It reads the game state and draws it; it never
// changes the state.

import {
  BUTTONS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FOOTER_Y,
  HEADER_HEIGHT,
  LEFT_PANEL_X,
  RIGHT_PANEL_X,
  PANEL_GAP,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  PANEL_Y,
  UI,
} from './config.js';
import { differenceCount } from './scenes.js';
import { drawFoundMarker, drawHintRing, drawRoom, drawWrongMark } from './art.js';
import { STATUS } from './game.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHeader(ctx, game) {
  ctx.fillStyle = UI.headerBg;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
  ctx.fillStyle = UI.headerText;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 29px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('The Clockmaker’s Workshop', 40, 36);
  ctx.fillStyle = UI.headerAccent;
  ctx.font = '17px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(game.level.name, 40, 64);

  // Counter pill: how many are found and how many still hide.
  const total = differenceCount(game.level);
  const pillX = 620;
  ctx.fillStyle = UI.pillBg;
  roundRect(ctx, pillX, 16, 320, 52, 12);
  ctx.fill();
  ctx.fillStyle = UI.pillText;
  ctx.font = 'bold 23px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `FOUND ${game.foundCount} / ${total}  ·  ${game.remainingCount} LEFT`,
    pillX + 160,
    51,
  );

  // Timer pill, red and urgent under half a minute.
  const lowTime = game.timeLeft <= 30 && game.status === STATUS.PLAYING;
  ctx.fillStyle = lowTime ? '#e33e2b' : '#f7ead2';
  roundRect(ctx, 955, 16, 120, 52, 12);
  ctx.fill();
  ctx.fillStyle = lowTime ? '#ffffff' : UI.pillText;
  ctx.font = 'bold 24px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`⏱ ${game.timeText}`, 1015, 51);

  // Score pill.
  ctx.fillStyle = '#f7ead2';
  roundRect(ctx, 1090, 16, 150, 52, 12);
  ctx.fill();
  ctx.fillStyle = UI.pillText;
  ctx.font = 'bold 22px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Score ${game.totalScore}`, 1165, 50);
  ctx.textAlign = 'left';
}

function drawPanel(ctx, game, panelX, variant, tag) {
  ctx.save();
  ctx.translate(panelX, PANEL_Y);
  drawRoom(ctx, game.levelIndex, variant);
  for (const diff of game.level.differences) {
    if (game.found.has(diff.id)) drawFoundMarker(ctx, diff.x, diff.y, diff.r);
  }
  const hint = game.hintDifference();
  if (hint) drawHintRing(ctx, hint.x, hint.y, hint.r, performance.now() / 1000);
  ctx.restore();
  ctx.strokeStyle = UI.panelFrame;
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  // Small tag naming the picture, so the pair reads as two pictures.
  ctx.fillStyle = UI.panelFrame;
  ctx.fillRect(panelX, PANEL_Y, 132, 26);
  ctx.fillStyle = UI.headerText;
  ctx.font = 'bold 14px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(tag, panelX + 10, PANEL_Y + 18);
}

function drawButton(ctx, button, label, enabled) {
  ctx.fillStyle = enabled ? UI.buttonBg : UI.buttonDisabledBg;
  roundRect(ctx, button.x, button.y, button.w, button.h, 10);
  ctx.fill();
  ctx.fillStyle = UI.buttonText;
  ctx.font = 'bold 17px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, button.x + button.w / 2, button.y + 35);
  ctx.textAlign = 'left';
}

function drawFooter(ctx, game) {
  ctx.fillStyle = UI.footerBg;
  ctx.fillRect(0, FOOTER_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FOOTER_Y);
  ctx.fillStyle = UI.footerText;
  ctx.textAlign = 'left';

  if (game.status === STATUS.LEVEL_DONE) {
    ctx.font = 'bold 30px Trebuchet MS, Verdana, sans-serif';
    ctx.fillText('Level complete! The workshop ticks on.', 40, 576);
    ctx.font = '19px Trebuchet MS, Verdana, sans-serif';
    ctx.fillStyle = UI.footerMuted;
    ctx.fillText(
      `All ${differenceCount(game.level)} differences found. Level score ${game.levelScore} · Total ${game.totalScore}.`,
      40,
      608,
    );
    drawButton(ctx, BUTTONS.next, BUTTONS.next.label, true);
    drawButton(ctx, BUTTONS.sound, game.sound.enabled ? 'Sound: on' : 'Sound: off', true);
    return;
  }

  if (game.status === STATUS.GAME_DONE) {
    ctx.font = 'bold 30px Trebuchet MS, Verdana, sans-serif';
    ctx.fillText('Workshop complete — every difference found!', 40, 576);
    ctx.font = '19px Trebuchet MS, Verdana, sans-serif';
    ctx.fillStyle = UI.footerMuted;
    const minutes = Math.floor((Date.now() - game.startedAt) / 60000);
    const seconds = Math.floor(((Date.now() - game.startedAt) / 1000) % 60);
    ctx.fillText(
      `Final score ${game.totalScore} · ${game.totalFound} found · ${game.accuracy}% accurate · ${minutes}:${String(seconds).padStart(2, '0')} played.`,
      40,
      608,
    );
    drawButton(ctx, BUTTONS.again, BUTTONS.again.label, true);
    drawButton(ctx, BUTTONS.sound, game.sound.enabled ? 'Sound: on' : 'Sound: off', true);
    return;
  }

  if (game.status === STATUS.TIME_UP) {
    ctx.font = 'bold 30px Trebuchet MS, Verdana, sans-serif';
    ctx.fillText('Out of time!', 40, 576);
    ctx.font = '19px Trebuchet MS, Verdana, sans-serif';
    ctx.fillStyle = UI.footerMuted;
    ctx.fillText(
      `You found ${game.foundCount} of ${differenceCount(game.level)} differences. Try the level again.`,
      40,
      608,
    );
    drawButton(ctx, BUTTONS.retry, BUTTONS.retry.label, true);
    drawButton(ctx, BUTTONS.sound, game.sound.enabled ? 'Sound: on' : 'Sound: off', true);
    return;
  }

  // Playing: the found checklist, the message, and the buttons.
  ctx.font = 'bold 19px Trebuchet MS, Verdana, sans-serif';
  const foundText =
    game.foundCount === 0
      ? 'Found: nothing yet — study both pictures!'
      : `Found (${game.foundCount}): ${game.foundLabels.join(' · ')}`;
  ctx.fillText(foundText, 40, 562);
  ctx.font = '18px Trebuchet MS, Verdana, sans-serif';
  ctx.fillStyle = UI.footerMuted;
  ctx.fillText(game.message, 40, 592);
  ctx.font = '15px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Click a difference in either picture · H hint · R restart level · 1/2/3 change room', 40, 620);
  drawButton(ctx, BUTTONS.hint, `Hint (H) · ${game.hintsLeft} left`, game.hintsLeft > 0);
  drawButton(ctx, BUTTONS.sound, game.sound.enabled ? 'Sound: on' : 'Sound: off', true);
}

export function drawFrame(ctx, game, now) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#1d1712';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHeader(ctx, game);
  drawPanel(ctx, game, LEFT_PANEL_X, 0, 'PICTURE A');
  drawPanel(ctx, game, RIGHT_PANEL_X, 1, 'PICTURE B');
  // Wrong-click marks fade by time; expired ones are dropped.
  game.wrongMarks = game.wrongMarks.filter((mark) => mark.until > now);
  for (const mark of game.wrongMarks) drawWrongMark(ctx, mark.x, mark.y);
  // A short note in the narrow gap between the pictures.
  ctx.fillStyle = UI.headerAccent;
  ctx.font = 'bold 14px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIND', 640, 300);
  ctx.fillText('7', 640, 322);
  ctx.fillText('DIFFS', 640, 344);
  ctx.textAlign = 'left';
  drawFooter(ctx, game);
  void PANEL_GAP;
}
