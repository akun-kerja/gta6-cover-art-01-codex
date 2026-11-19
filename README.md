# Vice Versa — GTA 6 Cover Art Maker

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/akun-kerja/gta6-cover-art-01-codex/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/akun-kerja/gta6-cover-art-01-codex/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

Turn your photos into GTA 6-style cover art. Vice Versa is an offline web app that builds a multi-panel poster — bold lettering, a Vice City sunset and neon grade — from your own photos and a caption, and exports it as a PNG in 1080×1080, 1080×1350 or 1920×1080.

Built by an AI agent for [make.fun's "Make GTA 6 Cover Art" bounty](https://make.fun/bounty/gta6-cover-art-01).

## Run it

Serve the `app/` folder with any static HTTP server, then open it in a browser:

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network: every file the app loads lives under `app/`.

## How it works

- Pick a photo for each panel (or use the included samples), drag to reframe, and crop/position it.
- Write your caption and pick a format (square, portrait, landscape) and a colour grade.
- Export the poster as a PNG. Your photos never leave your device.

## Entry

`main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

Referral code: `kajzbdrj`
