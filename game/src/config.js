// config.js — every fixed number the Clockmaker's Workshop game uses.
// One place for the canvas size, the two picture panels, timing and scoring,
// so the art, the game logic and the renderer always agree with each other.

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

// The two near-identical pictures sit side by side in this frame.
export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 420;
export const PANEL_Y = 96;
export const LEFT_PANEL_X = 40;
export const RIGHT_PANEL_X = 680;
export const PANEL_GAP = RIGHT_PANEL_X - (LEFT_PANEL_X + PANEL_WIDTH);

// Header strip (title, level, counter, timer, score) and footer strip
// (found list, message, buttons) frame the pictures.
export const HEADER_HEIGHT = 84;
export const FOOTER_Y = 532;
export const FOOTER_HEIGHT = 176;

// A level lasts this long; finding a difference adds a small bonus.
export const LEVEL_TIME_SECONDS = 180;
export const FOUND_TIME_BONUS_SECONDS = 5;
export const WRONG_CLICK_TIME_PENALTY_SECONDS = 5;

// Points: a find, a hint's cost, and the per-second time bonus on a level.
export const POINTS_PER_FIND = 100;
export const POINTS_PER_HINT = -50;
export const POINTS_PER_SECOND_LEFT = 2;

// Hints per level, and how long a hint ring pulses around its difference.
export const HINTS_PER_LEVEL = 3;
export const HINT_PULSE_MS = 2600;

// A click counts as a find when it lands within a difference's radius,
// plus this small forgiveness margin.
export const CLICK_FORGIVENESS_PX = 6;

// Buttons drawn in the footer; the game logic and the renderer share them.
export const BUTTONS = {
  hint: { x: 40, y: 636, w: 150, h: 56, label: 'Hint (H)' },
  next: { x: 950, y: 636, w: 150, h: 56, label: 'Next level (N)' },
  again: { x: 950, y: 636, w: 150, h: 56, label: 'Play again (R)' },
  retry: { x: 950, y: 636, w: 150, h: 56, label: 'Try again (R)' },
  sound: { x: 1110, y: 636, w: 130, h: 56, label: 'Sound: on' },
};

// Warm cream and ink used by the header, footer and overlays.
export const UI = {
  headerBg: '#2b2118',
  headerText: '#f7ead2',
  headerAccent: '#f2b544',
  footerBg: '#f3e7cf',
  footerText: '#2b2118',
  footerMuted: '#6d5b41',
  panelFrame: '#2b2118',
  foundRing: '#e33e2b',
  foundFill: 'rgba(227, 62, 43, 0.12)',
  hintRing: '#f2b544',
  wrongMark: '#e33e2b',
  buttonBg: '#2b2118',
  buttonText: '#f7ead2',
  buttonDisabledBg: '#a89a80',
  pillBg: '#f2b544',
  pillText: '#2b2118',
};
