// main.js — boots the Clockmaker's Workshop in the browser.
// Fits the fixed 1280 x 720 stage to the window, starts the game, and
// turns mouse clicks and keys into game actions. The ?shot= query picks a
// frozen mid-game state for screenshots; without it the game starts fresh.

import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { ClockmakerGame } from './game.js';
import { drawFrame } from './render.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const game = new ClockmakerGame();
window.__game = game;

const params = new URLSearchParams(window.location.search);
applyShot(game, params.get('shot'));

// Keep the 16:9 stage whole inside any window, letterboxed.
function fitStage() {
  const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
  canvas.style.width = `${Math.floor(CANVAS_WIDTH * scale)}px`;
  canvas.style.height = `${Math.floor(CANVAS_HEIGHT * scale)}px`;
}
window.addEventListener('resize', fitStage);
fitStage();

// A click anywhere on the canvas, translated back to stage coordinates.
canvas.addEventListener('pointerdown', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  game.click(x, y);
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') game.useHint();
  else if (key === 'r') {
    if (game.status === 'gameDone') game.restartGame();
    else game.startLevel(game.levelIndex);
  } else if (key === 'n' && game.status === 'levelDone') game.nextLevel();
  else if (key === 'm') game.sound.enabled = !game.sound.enabled;
  else if (key === '1' || key === '2' || key === '3') game.startLevel(Number(key) - 1);
});

function frame(now) {
  game.tick(now);
  drawFrame(ctx, game, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
