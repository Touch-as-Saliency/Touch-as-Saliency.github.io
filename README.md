# RGB-S Project Page

This repository contains the static project page for **RGB-S: Image-Aligned Tactile Saliency for Robust Dexterous Manipulation**.

## Structure

- `index.html`: the homepage content and page sections.
- `static/css/index.css`: custom page styling.
- `static/js/index.js`: synchronized RGB/saliency video interaction.
- `static/images/`: image assets referenced by the homepage.
- `static/videos/`: video assets referenced by the homepage.
- `paper_Inpaint_IL_CoRL_2026/`: local reference paper folder, ignored by git.
- `video_materials/`: local staging folder for future video assets, ignored by git.

The page uses CDN-hosted dependencies for Bulma, Font Awesome, Academicons, and Google Fonts.

## Homepage Images

The homepage references PNG files exported from the paper's active `\includegraphics` PDF figures:

- `static/images/rgb-s-teaser.png` from `images/teaser.pdf`
- `static/images/rgb-s-architecture.png` from `images/pipeline.pdf`
- `static/images/rgb-s-real-platform.png` from `images/real_platform.pdf`
- `static/images/rgb-s-tasks.png` from `images/tasks.pdf`
- `static/images/rgb-s-real-world-demo.png` from `images/demo.pdf`
- `static/images/rgb-s-gradcam.png` from `images/viz.pdf`
- `static/images/rgb-s-fusion-ablation.png` from `images/ablation_arch.pdf`

Do not commit the full reference paper folder or unsorted video material folder.

## Homepage Videos

The interactive rollout viewers use H.264 MP4 videos copied from the ignored `video_materials/` folder into deployable `static/videos/`.

Standard rollouts from `video_materials/P1(1)/P1`:

- `static/videos/pick-place-rgb.mp4`
- `static/videos/pick-place-saliency.mp4`
- `static/videos/open-drawer-rgb.mp4`
- `static/videos/open-drawer-saliency.mp4`
- `static/videos/flip-box-rgb.mp4`
- `static/videos/flip-box-saliency.mp4`

Real-world rollouts with occlusions from `video_materials/P9(1)/P9`:

- `static/videos/occluded-pick-place-rgb.mp4`
- `static/videos/occluded-pick-place-saliency.mp4`
- `static/videos/occluded-open-drawer-rgb.mp4`
- `static/videos/occluded-open-drawer-saliency.mp4`
- `static/videos/occluded-flip-box-rgb.mp4`
- `static/videos/occluded-flip-box-saliency.mp4`

## License

This website is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. The original template was borrowed from [Nerfies](https://github.com/nerfies/nerfies.github.io).
