// shots.js — frozen mid-game states for the screenshots.
// ?shot=start shows level 1 with three differences found and four hiding,
// ?shot=play shows level 2 with two found, and ?shot=end shows level 3
// finished with the workshop complete. The timer is frozen in every shot
// so the picture is the same on every render. Real play never uses these.

import { LEVELS } from './scenes.js';

export function applyShot(game, name) {
  if (!name) return false;
  game.shotMode = true;
  if (name === 'start') {
    game.startLevel(0);
    game.shotMode = true;
    for (const id of ['hands', 'cat', 'steam']) game.found.add(id);
    game.totalFound = 3;
    game.levelScore = 300;
    game.totalScore = 300;
    game.timeLeft = 151;
    game.message = 'Three found — four still hiding. Look closer!';
    return true;
  }
  if (name === 'play') {
    game.startLevel(1);
    game.shotMode = true;
    for (const id of ['cuckoo', 'cup']) game.found.add(id);
    game.totalFound = 2;
    game.levelScore = 200;
    game.totalScore = 200;
    game.timeLeft = 132;
    game.message = 'Two found — five still hiding. The cuckoo saw you coming.';
    return true;
  }
  if (name === 'end') {
    game.startLevel(2);
    game.shotMode = true;
    for (const diff of LEVELS[2].differences) game.found.add(diff.id);
    game.totalFound = 21;
    game.totalWrong = 2;
    game.levelScore = 794;
    game.totalScore = 2194;
    game.timeLeft = 47;
    game.finishLevel();
    game.shotMode = true;
    return true;
  }
  game.shotMode = false;
  return false;
}
