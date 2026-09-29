# Tac2Pix Project Page

This repository contains the static project page for **Tac2Pix: Image-Space Visuo-Tactile Fusion for Dexterous Manipulation**.

The page remains anonymous without displaying a review-status or conference badge. The Paper button is disabled and Code is marked Soon; neither links to an unreleased resource.

## Structure

- `index.html`: the homepage content and page sections.
- `static/css/index.css`: custom page styling.
- `static/js/index.js`: synchronized RGB/saliency viewers, accessible result tabs, and random-rollout view selection.
- `static/images/`: image assets referenced by the homepage.
- `static/videos/`: video assets referenced by the homepage.
- `paper_Inpaint_IL_CoRL_2026/`: local reference paper folder, ignored by git.
- `video_materials/`: local staging folder for future video assets, ignored by git.

The page uses CDN-hosted dependencies for Bulma, Font Awesome, Academicons, and Google Fonts.

## Homepage Images

The homepage references PNG files exported from the paper's active `\includegraphics` PDF figures:

- `static/images/tac2pix-teaser.png` from `images/teaser.pdf`
- `static/images/tac2pix-pipeline.png` from `images/pipeline.pdf`
- `static/images/tac2pix-learning-curves.png` from the companion `images/figure3_full_width.pdf`
- `static/images/rgb-s-real-platform.png` from `images/real_platform.pdf`
- `static/images/rgb-s-tasks.png` from `images/tasks.pdf`
- `static/images/rgb-s-real-world-demo.png` from `images/demo.pdf`
- `static/images/rgb-s-fusion-ablation.png` from `images/ablation_arch.pdf`
- `static/images/touch.png` from `video_materials/touch.png`, used as the page icon and preview thumbnail

Grad-CAM attention visualizations are copied from `video_materials/grad_cam/grad_cam` into `static/images/grad_cam/`.

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

Ablation rollout comparison keeps the original 1 + 2 + 2 layout and shared playback controls:

- `static/videos/tac2pix-ablation-overlay-left.mp4`: previously recorded white-overlay normal-condition example.
- `static/videos/tac2pix-ablation-static-rgb-left.mp4` and `tac2pix-ablation-static-saliency-left.mp4`: newly recorded Binary44 policy, synchronized left-camera RGB and binary saliency.
- `static/videos/tac2pix-ablation-dynamic-rgb-left.mp4` and `tac2pix-ablation-dynamic-saliency-left.mp4`: newly recorded force-aware policy, synchronized left-camera RGB and dynamic saliency.

All five videos are 640×480, 600 frames at 30 fps (20 seconds), H.264/yuv420p with faststart. They show independent normal-condition policy rollouts. Each RGB/saliency pair comes from the same trajectory and exact recorded observation frames. The page references the current media files listed above.

## Project Demo

`static/videos/tac2pix-demo.mp4` appears below the resource buttons and above the teaser figure, with a poster and native playback controls. The Supplementary Video button jumps to this demo. It does not autoplay and preloads only metadata.

The supplied `tac2pix_word.mp4` demo is 854×480 HEVC. The browser copy uses H.264/yuv420p with faststart, reduced from 33.22 MiB to 11.20 MiB while preserving all 6,531 frames, their presentation timestamps, 30 fps, and the 217.7-second duration. AAC audio is copied without re-encoding. Full-frame SSIM against the original is 0.997776 and full decoding passed. The source file remains unchanged; its native resolution is retained. The media and poster URLs include a version query so returning visitors load the replacement.

## New Random-Occlusion Rollouts

New `static/videos/tac2pix_random_*` clips show full force-aware Tac2Pix simulation rollouts: one success and one failure, each with dual/left/right white-saliency views and dual-camera masked/observer RGB. Existing fixed-occlusion and Grad-CAM media are retained; the ablation viewer uses the updated clips listed above.

These selected examples use the simulation rebuttal protocol: a 240×120 mask at 640×480, refreshed every 20 control steps from step 0. The white visualization has maximum opacity 30%; policy RGB receives the mask while saliency is supplied separately. The observer view shows the same trajectory and is not an unmasked-policy evaluation. Clips play 600 observation frames at 30 fps (20 seconds).

Real-world Random and Physical Occlusion results are shown separately with their manuscript protocols. No simulated clip is presented as a physical-occlusion experiment. The original three-task real-world averages and expanded three-seed Pick-and-Place results remain distinct.

## Layout

All primary sections use the same responsive content container, up to 1080px wide. Full-width figures, captions, abstracts, and section introductions align to that container; comparison cards, legends, and table scrolling retain their internal layout.

## Local Preview

Serve this repository with a local HTTP server and open its loopback URL. A server supporting HTTP byte ranges is recommended for reliable MP4 seeking. This is a static site with no build step.

## License

This website is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. The original template was borrowed from [Nerfies](https://github.com/nerfies/nerfies.github.io).
