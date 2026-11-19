# After Hours — Vice City Poster Studio

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/akun-kerja/gta6-cover-art-01-codex/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/akun-kerja/gta6-cover-art-01-codex/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

[Competition bounty page](https://make.fun/bounty/gta6-cover-art-01)

Make a personal, multi-frame Vice City night poster from photos on your device. Reframe each panel, set a headline and color grade, choose a share-ready size, and download a full-resolution PNG. Photos stay in your browser and are never uploaded.

## Run locally

This is a static app with no install or build step. With Node 22, run:

```sh
node serve.ts
```

Then open <http://localhost:8080>. User photos are selected locally from the editor.

## Build the competition dossier

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The command copies `app/` and `screenshots/` and writes `dossier.json`.
