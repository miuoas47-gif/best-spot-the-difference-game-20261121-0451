# The Clockmaker's Workshop — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/miuoas47-gif/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/miuoas47-gif/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

**The Clockmaker's Workshop** is a complete spot-the-difference game that
runs entirely in a desktop browser from static files — no build step, no
network, no downloads. Two near-identical pictures of a clockmaker's
workshop sit side by side; find the seven differences in each of three
rooms before the clock runs out.

## The three rooms

1. **Morning in the Workshop** — sunlight, fresh tea, and seven small
   changes: the clock hands, the cat on the rug, the teapot steam, a red
   book, a gear, a bird at the window, and the lamp shade.
2. **The Cuckoo's Tea Break** — afternoon tea while the cuckoo keeps time:
   the cuckoo itself, a tipped teacup, the picture on the wall, the
   pendulum, a mouse on the shelf, the rug stripe, and the candle flame.
3. **Midnight Repairs** — moonlight and lamplight, the hardest seven: the
   moon, a star, the lantern glow, the magnifier, the gear's teeth, the
   cat's eyes, and a key on its hook.

Every picture is drawn fresh in code — original art, original names,
nothing copied from another game.

## How to play

- **Click** a difference in either picture to circle it on both. Found
  differences stay ringed in red; the header counts them down
  (`FOUND 3 / 7 · 4 LEFT`).
- A find scores **100 points** and adds 5 seconds. A wrong click costs
  5 seconds. Finishing a room adds a **time bonus** of 2 points per
  second left.
- **H** spends one of your 3 hints per room (−50 points) and pulses a
  gold ring around a difference still hiding.
- **R** restarts the room, **N** moves to the next room when one is
  cleared, **M** toggles sound, **1/2/3** jump between rooms.
- Each room gives you **3:00** on the clock. Clear all three rooms to
  finish the workshop.

## Play it

Serve the `game/` folder with any static server and open
`game/index.html` in desktop Chrome, for example:

```sh
python3 -m http.server 8123 --directory game
# open http://127.0.0.1:8123/
```

Screenshot states are built into the game: `?shot=start` shows level 1
with three differences found, `?shot=play` shows level 2 with two found,
and `?shot=end` shows level 3 finished. The three screenshots in
`screenshots/` are real renders of the game's own code, taken in headless
Chrome from those states (see `shots.json`).

## Files

- `main.ts` — the hand-in program (Node 22, standard library only): it
  copies `game/` and `screenshots/` to the output directory and writes
  `dossier.json` with the vendored make.fun library.
- `game/index.html` — the page; `game/src/` holds the game in one file
  per job: `config.js` (sizes, timing, scoring), `scenes.js` (the three
  rooms and their seven differences each), `art.js` (draws the room),
  `game.js` (rules and state), `render.js` (header, pictures, footer),
  `sound.js` (WebAudio effects, no sound files), `shots.js`
  (screenshot states), `main.js` (boot, input, loop).
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `screenshots/` — 3 real renders of the game (1280×720).
- `shots.json` — which `?shot=` state each screenshot shows.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Run it twice into two fresh directories and the outputs are byte
identical.

Entry for the make.fun bounty
[Best Spot the Difference Game](https://make.fun/c/best-spot-the-difference-game-20261121-0451).
