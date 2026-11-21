// game.js — the rules and the state of the Clockmaker's Workshop.
// It owns the level, the found differences, the timer, the score and the
// hints, and answers one question for the renderer: what should the screen
// show right now? It never draws anything itself and never touches the DOM
// except through the sound effects.

import {
  BUTTONS,
  CLICK_FORGIVENESS_PX,
  HINTS_PER_LEVEL,
  HINT_PULSE_MS,
  LEVEL_TIME_SECONDS,
  POINTS_PER_FIND,
  POINTS_PER_HINT,
  POINTS_PER_SECOND_LEFT,
  FOUND_TIME_BONUS_SECONDS,
  WRONG_CLICK_TIME_PENALTY_SECONDS,
  LEFT_PANEL_X,
  RIGHT_PANEL_X,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  PANEL_Y,
} from './config.js';
import { LEVELS, differenceCount } from './scenes.js';
import { SoundFX } from './sound.js';

export const STATUS = {
  PLAYING: 'playing',
  LEVEL_DONE: 'levelDone',
  GAME_DONE: 'gameDone',
  TIME_UP: 'timeUp',
};

export class ClockmakerGame {
  constructor() {
    this.sound = new SoundFX();
    this.shotMode = false;
    this.levelIndex = 0;
    this.totalScore = 0;
    this.totalFound = 0;
    this.totalWrong = 0;
    this.startedAt = Date.now();
    this.startLevel(0);
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get remainingCount() {
    return differenceCount(this.level) - this.found.size;
  }

  get hintsLeft() {
    return this.hints;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.hints = HINTS_PER_LEVEL;
    this.timeLeft = LEVEL_TIME_SECONDS;
    this.status = STATUS.PLAYING;
    this.message = this.level.subtitle;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.wrongMarks = [];
    this.levelScore = 0;
    this.levelStartedAt = Date.now();
  }

  // Which panel, if any, holds this canvas point, and where inside it?
  panelHit(x, y) {
    if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return null;
    if (x >= LEFT_PANEL_X && x <= LEFT_PANEL_X + PANEL_WIDTH) {
      return { panel: 0, lx: x - LEFT_PANEL_X, ly: y - PANEL_Y };
    }
    if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL_WIDTH) {
      return { panel: 1, lx: x - RIGHT_PANEL_X, ly: y - PANEL_Y };
    }
    return null;
  }

  // A click on the canvas: a button, a difference, or a miss.
  click(x, y) {
    this.sound.unlock();
    if (this.status === STATUS.LEVEL_DONE) {
      if (this.insideButton(x, y, BUTTONS.next)) this.nextLevel();
      return;
    }
    if (this.status === STATUS.GAME_DONE) {
      if (this.insideButton(x, y, BUTTONS.again)) this.restartGame();
      return;
    }
    if (this.status === STATUS.TIME_UP) {
      if (this.insideButton(x, y, BUTTONS.retry)) this.startLevel(this.levelIndex);
      return;
    }
    if (this.insideButton(x, y, BUTTONS.hint)) {
      this.useHint();
      return;
    }
    if (this.insideButton(x, y, BUTTONS.sound)) {
      this.sound.enabled = !this.sound.enabled;
      return;
    }
    if (this.status !== STATUS.PLAYING) return;
    const hit = this.panelHit(x, y);
    if (!hit) return;
    const found = this.level.differences.find(
      (d) => !this.found.has(d.id) && Math.hypot(hit.lx - d.x, hit.ly - d.y) <= d.r + CLICK_FORGIVENESS_PX,
    );
    if (found) {
      this.found.add(found.id);
      this.totalFound += 1;
      this.levelScore += POINTS_PER_FIND;
      this.totalScore += POINTS_PER_FIND;
      this.timeLeft = Math.min(LEVEL_TIME_SECONDS, this.timeLeft + FOUND_TIME_BONUS_SECONDS);
      this.message = `Found it — ${found.label}! ${this.remainingCount} still hiding.`;
      this.sound.found();
      if (this.hintTarget === found.id) {
        this.hintTarget = null;
        this.hintUntil = 0;
      }
      if (this.remainingCount === 0) this.finishLevel();
    } else {
      this.totalWrong += 1;
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_TIME_PENALTY_SECONDS);
      this.wrongMarks.push({ x, y, until: Date.now() + 900 });
      this.message = 'Nothing different there — minus 5 seconds. Look closer!';
      this.sound.wrong();
      if (this.timeLeft <= 0) this.runOutOfTime();
    }
  }

  insideButton(x, y, button) {
    return x >= button.x && x <= button.x + button.w && y >= button.y && y <= button.y + button.h;
  }

  useHint() {
    if (this.status !== STATUS.PLAYING) return;
    if (this.hints <= 0) {
      this.message = 'No hints left on this level — trust your eyes!';
      return;
    }
    const hiding = this.level.differences.filter((d) => !this.found.has(d.id));
    if (hiding.length === 0) return;
    const pick = hiding[Math.floor(Math.random() * hiding.length)];
    this.hints -= 1;
    this.totalScore = Math.max(0, this.totalScore + POINTS_PER_HINT);
    this.levelScore = Math.max(0, this.levelScore + POINTS_PER_HINT);
    this.hintTarget = pick.id;
    this.hintUntil = Date.now() + HINT_PULSE_MS;
    this.message = `Hint: something changed near the ${pick.label.toLowerCase()}.`;
    this.sound.hint();
  }

  hintDifference() {
    if (!this.hintTarget || Date.now() > this.hintUntil) return null;
    return this.level.differences.find((d) => d.id === this.hintTarget) ?? null;
  }

  finishLevel() {
    const bonus = Math.round(this.timeLeft) * POINTS_PER_SECOND_LEFT;
    this.levelScore += bonus;
    this.totalScore += bonus;
    this.status = this.levelIndex === LEVELS.length - 1 ? STATUS.GAME_DONE : STATUS.LEVEL_DONE;
    this.message =
      this.status === STATUS.GAME_DONE
        ? `Every difference found — the workshop is whole again! Time bonus +${bonus}.`
        : `Level complete! Time bonus +${bonus}. On to the next room.`;
    this.sound.levelClear();
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) this.startLevel(this.levelIndex + 1);
  }

  restartGame() {
    this.totalScore = 0;
    this.totalFound = 0;
    this.totalWrong = 0;
    this.startedAt = Date.now();
    this.startLevel(0);
  }

  runOutOfTime() {
    this.status = STATUS.TIME_UP;
    this.message = 'Out of time! The differences stay hidden… for now.';
  }

  // One tick of the clock; the main loop calls it every animation frame.
  tick(now) {
    if (this.shotMode) return;
    if (this.status !== STATUS.PLAYING) return;
    if (!this.lastTickAt) {
      this.lastTickAt = now;
      return;
    }
    const elapsed = (now - this.lastTickAt) / 1000;
    this.lastTickAt = now;
    if (elapsed <= 0 || elapsed > 1) return;
    this.timeLeft -= elapsed;
    const whole = Math.ceil(this.timeLeft);
    if (whole !== this.lastWholeSecond) {
      this.lastWholeSecond = whole;
      if (whole <= 10 && whole > 0) this.sound.tick();
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.runOutOfTime();
    }
  }

  get timeText() {
    const total = Math.max(0, Math.ceil(this.timeLeft));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  get accuracy() {
    const tries = this.totalFound + this.totalWrong;
    return tries === 0 ? 100 : Math.round((this.totalFound / tries) * 100);
  }

  // Names of the differences, in find order, for the footer checklist.
  get foundLabels() {
    return this.level.differences.filter((d) => this.found.has(d.id)).map((d) => d.label);
  }

  get remainingLabels() {
    return this.level.differences.filter((d) => !this.found.has(d.id)).map((d) => d.label);
  }
}
