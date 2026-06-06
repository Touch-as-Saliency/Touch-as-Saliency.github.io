# RGB-S Project Page

This repository contains the static project page for **RGB-S: Image-Aligned Tactile Saliency for Robust Dexterous Manipulation**.

## Structure

- `index.html`: the homepage content and page sections.
- `static/css/index.css`: custom page styling.
- `static/images/`: image assets referenced by the homepage.
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

## License

This website is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. The original template was borrowed from [Nerfies](https://github.com/nerfies/nerfies.github.io).
