# Hyunsu Go — personal website

This repository serves [gohyunsu.github.io](https://gohyunsu.github.io/) from the root of `main` with GitHub Pages. The site is plain HTML and CSS; it has no build step.

## Editing

- Update copy and links in `index.html`.
- Update layout, type, and colors in `assets/css/site.css`.
- `assets/img/autodex-grasp.gif` is full AutoDex footage at 2× playback. The Place and Adapt images are concept illustrations, not experiment photos.
- Update the concise CV in `scripts/build_cv.py`, then regenerate `assets/cv/Hyunsu_Go_CV.pdf` with the bundled Python runtime (requires ReportLab).
- Preview locally with `python -m http.server 8000`, then open `http://localhost:8000/`.

Changes pushed to `main` are published by the repository's GitHub Pages configuration.

## Archived content

The branch `archive/pre-redesign-2026-10-13` preserves the complete site before the October 2026 redesign, including the robot dashboard, full publication and activity listings, previous imagery, and original scripts. This branch is not served as the public site. To recover an item, copy it from that branch into `main`.

The branch `archive/pre-visual-computing-2026-10-18` preserves the preceding portfolio and its CV. The current CV is a concise, one-page academic CV with the same current research details as this site.
