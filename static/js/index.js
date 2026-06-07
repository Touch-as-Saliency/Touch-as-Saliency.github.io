const VIDEO_SETS = {
  standard: {
    'pick-place': {
      rgb: './static/videos/pick-place-rgb.mp4?v=h264',
      saliency: './static/videos/pick-place-saliency.mp4?v=h264',
    },
    'open-drawer': {
      rgb: './static/videos/open-drawer-rgb.mp4?v=h264',
      saliency: './static/videos/open-drawer-saliency.mp4?v=h264',
    },
    'flip-box': {
      rgb: './static/videos/flip-box-rgb.mp4?v=h264',
      saliency: './static/videos/flip-box-saliency.mp4?v=h264',
    },
  },
  occluded: {
    'pick-place': {
      rgb: './static/videos/occluded-pick-place-rgb.mp4?v=h264',
      saliency: './static/videos/occluded-pick-place-saliency.mp4?v=h264',
    },
    'open-drawer': {
      rgb: './static/videos/occluded-open-drawer-rgb.mp4?v=h264',
      saliency: './static/videos/occluded-open-drawer-saliency.mp4?v=h264',
    },
    'flip-box': {
      rgb: './static/videos/occluded-flip-box-rgb.mp4?v=h264',
      saliency: './static/videos/occluded-flip-box-saliency.mp4?v=h264',
    },
  },
};

const ATTENTION_MODELS = {
  sim: [
    { id: 'vo', label: 'Vision-Only' },
    { id: 'concat', label: 'Concat' },
    { id: 'film', label: 'FiLM' },
    { id: 'clip', label: 'CLIP' },
    { id: 'ca', label: 'Cross-Attn' },
    { id: 'rgbs', label: 'Ours (RGB-S)' },
  ],
  real: [
    { id: 'vo', label: 'Vision-Only' },
    { id: 'concat', label: 'Concat' },
    { id: 'ca', label: 'Cross-Attn' },
    { id: 'rgbs', label: 'Ours (RGB-S)' },
  ],
};

const ATTENTION_EXTENSIONS = {
  sim_pap_vo_nm: 'jpg',
  sim_rc_vo_nm: 'jpg',
  sim_rc_vo_occ: 'jpg',
  sim_rc_concat_nm: 'jpg',
  sim_rc_concat_occ: 'jpg',
  sim_rc_film_nm: 'jpg',
  sim_rc_film_occ: 'jpg',
  sim_rc_clip_nm: 'jpg',
  sim_rc_clip_occ: 'jpg',
  sim_rc_ca_nm: 'jpg',
  sim_rc_ca_occ: 'jpg',
  sim_rc_rgbs_nm: 'jpg',
  sim_rc_rgbs_occ: 'jpg',
  real_pap_vo_nm: 'jpg',
  real_pap_vo_occ: 'jpg',
  real_pap_concat_nm: 'jpg',
  real_pap_concat_occ: 'jpg',
  real_pap_ca_nm: 'jpg',
  real_pap_ca_occ: 'jpg',
  real_pap_rgbs_nm: 'jpg',
  real_pap_rgbs_occ: 'jpg',
  real_od_vo_nm: 'jpg',
};

const ATTENTION_STATE_LABELS = {
  nm: 'Normal',
  occ: 'Occluded',
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

function setupVideoPanel(panel) {
  const videoSet = VIDEO_SETS[panel.dataset.videoSet || 'standard'];
  const selector = panel.querySelector('[data-task-selector]');
  const rgbVideo = panel.querySelector('[data-rgb-video]');
  const saliencyVideo = panel.querySelector('[data-saliency-video]');
  const playButton = panel.querySelector('[data-video-play]');
  const playIcon = playButton.querySelector('i');
  const progress = panel.querySelector('[data-video-progress]');
  const timeLabel = panel.querySelector('[data-video-time]');
  const statusLabel = panel.querySelector('[data-video-status]');
  const videos = [rgbVideo, saliencyVideo];
  let isDragging = false;
  let isSyncing = false;

  function duration() {
    return Math.max(...videos.map((video) => video.duration || 0));
  }

  function syncTo(time) {
    isSyncing = true;
    videos.forEach((video) => {
      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.min(time, video.duration);
      }
    });
    isSyncing = false;
  }

  function updateProgress() {
    const total = duration();
    const current = rgbVideo.currentTime || 0;

    if (!isDragging && total > 0) {
      progress.value = Math.round((current / total) * Number(progress.max));
    }

    timeLabel.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }

  function updatePlayState(isPlaying) {
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function setStatus(message) {
    statusLabel.textContent = message;
    statusLabel.hidden = !message;
  }

  function waitUntilReady(video) {
    if (video.readyState >= 2) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
      const handleCanPlay = () => {
        cleanup();
        resolve();
      };
      const handleError = () => {
        cleanup();
        reject(video.error || new Error('Video failed to load.'));
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
      video.load();
    });
  }

  async function playVideos() {
    try {
      setStatus('');
      await Promise.all(videos.map(waitUntilReady));
      syncTo(rgbVideo.currentTime || 0);
      await Promise.all(videos.map((video) => video.play()));
      updatePlayState(true);
    } catch (error) {
      updatePlayState(false);
      setStatus('Playback was blocked or this MP4 cannot be decoded by the browser. Try the native controls on the videos, or re-encode as H.264 MP4.');
      console.error(error);
    }
  }

  function loadTask(taskId) {
    const task = videoSet[taskId];
    const wasPlaying = videos.some((video) => !video.paused);

    setStatus('');
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

    rgbVideo.src = task.rgb;
    saliencyVideo.src = task.saliency;
    videos.forEach((video) => video.load());
    progress.value = 0;
    updatePlayState(false);
    updateProgress();

    if (wasPlaying) {
      playVideos();
    }
  }

  selector.addEventListener('change', () => {
    loadTask(selector.value);
  });

  playButton.addEventListener('click', () => {
    const shouldPlay = videos.every((video) => video.paused);

    if (shouldPlay) {
      playVideos();
    } else {
      videos.forEach((video) => video.pause());
      updatePlayState(false);
    }
  });

  progress.addEventListener('input', () => {
    isDragging = true;
    const total = duration();
    if (total > 0) {
      syncTo((Number(progress.value) / Number(progress.max)) * total);
      updateProgress();
    }
  });

  progress.addEventListener('change', () => {
    isDragging = false;
    updateProgress();
  });

  rgbVideo.addEventListener('timeupdate', () => {
    if (!isSyncing && !isDragging) {
      const drift = Math.abs((saliencyVideo.currentTime || 0) - rgbVideo.currentTime);
      if (drift > 0.12) {
        syncTo(rgbVideo.currentTime);
      }
    }
    updateProgress();
  });

  videos.forEach((video) => {
    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('pause', () => {
      if (videos.every((item) => item.paused)) {
        updatePlayState(false);
      }
    });
  });

  rgbVideo.addEventListener('ended', () => {
    videos.forEach((item) => item.pause());
    updatePlayState(false);
    syncTo(0);
    updateProgress();
  });

  loadTask(selector.value);
}

function setupAblationPanel(panel) {
  const videos = Array.from(panel.querySelectorAll('[data-ablation-video]'));
  const leadVideo = videos[0];
  const playButton = panel.querySelector('[data-ablation-play]');
  const playIcon = playButton.querySelector('i');
  const progress = panel.querySelector('[data-ablation-progress]');
  const timeLabel = panel.querySelector('[data-ablation-time]');
  const statusLabel = panel.querySelector('[data-ablation-status]');
  let isDragging = false;
  let isSyncing = false;

  function duration() {
    return Math.max(...videos.map((video) => video.duration || 0));
  }

  function syncTo(time) {
    isSyncing = true;
    videos.forEach((video) => {
      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.min(time, video.duration);
      }
    });
    isSyncing = false;
  }

  function updateProgress() {
    const total = duration();
    const current = leadVideo.currentTime || 0;

    if (!isDragging && total > 0) {
      progress.value = Math.round((current / total) * Number(progress.max));
    }

    timeLabel.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }

  function updatePlayState(isPlaying) {
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function setStatus(message) {
    statusLabel.textContent = message;
    statusLabel.hidden = !message;
  }

  function waitUntilReady(video) {
    if (video.readyState >= 2) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
      const handleCanPlay = () => {
        cleanup();
        resolve();
      };
      const handleError = () => {
        cleanup();
        reject(video.error || new Error('Video failed to load.'));
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
      video.load();
    });
  }

  async function playVideos() {
    try {
      setStatus('');
      await Promise.all(videos.map(waitUntilReady));
      syncTo(leadVideo.currentTime || 0);
      await Promise.all(videos.map((video) => video.play()));
      updatePlayState(true);
    } catch (error) {
      updatePlayState(false);
      setStatus('Playback was blocked or this MP4 cannot be decoded by the browser. Try the native controls on the videos, or re-encode as H.264 MP4.');
      console.error(error);
    }
  }

  playButton.addEventListener('click', () => {
    const shouldPlay = videos.every((video) => video.paused);

    if (shouldPlay) {
      playVideos();
    } else {
      videos.forEach((video) => video.pause());
      updatePlayState(false);
    }
  });

  progress.addEventListener('input', () => {
    isDragging = true;
    const total = duration();
    if (total > 0) {
      syncTo((Number(progress.value) / Number(progress.max)) * total);
      updateProgress();
    }
  });

  progress.addEventListener('change', () => {
    isDragging = false;
    updateProgress();
  });

  leadVideo.addEventListener('timeupdate', () => {
    if (!isSyncing && !isDragging) {
      videos.slice(1).forEach((video) => {
        const drift = Math.abs((video.currentTime || 0) - leadVideo.currentTime);
        if (drift > 0.12) {
          video.currentTime = Math.min(leadVideo.currentTime, video.duration || leadVideo.currentTime);
        }
      });
    }
    updateProgress();
  });

  videos.forEach((video) => {
    video.addEventListener('loadedmetadata', updateProgress);
    video.addEventListener('pause', () => {
      if (videos.every((item) => item.paused)) {
        updatePlayState(false);
      }
    });
  });

  leadVideo.addEventListener('ended', () => {
    videos.forEach((item) => item.pause());
    updatePlayState(false);
    syncTo(0);
    updateProgress();
  });

  updateProgress();
}

function attentionImagePath(domain, scene, model, state) {
  const key = `${domain}_${scene}_${model}_${state}`;
  const extension = ATTENTION_EXTENSIONS[key] === undefined ? 'png' : ATTENTION_EXTENSIONS[key];

  if (extension === null) {
    return null;
  }

  return `./static/images/grad_cam/${key}.${extension}`;
}

function createAttentionImage(domain, scene, model, state) {
  const path = attentionImagePath(domain, scene, model.id, state);
  const figure = document.createElement('figure');
  figure.className = 'attention-image-frame';

  if (path) {
    const image = document.createElement('img');
    image.src = path;
    image.alt = `${domain} ${scene} ${model.label} ${ATTENTION_STATE_LABELS[state]} Grad-CAM`;
    figure.appendChild(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'attention-missing';
    placeholder.textContent = 'Missing image';
    figure.appendChild(placeholder);
  }

  const caption = document.createElement('figcaption');
  caption.textContent = ATTENTION_STATE_LABELS[state];
  figure.appendChild(caption);

  return figure;
}

function renderAttentionPanel(panel) {
  const domain = panel.dataset.attentionDomain;
  const selector = panel.querySelector('[data-attention-scene]');
  const grid = panel.querySelector('[data-attention-grid]');
  const scene = selector.value;

  grid.innerHTML = '';
  ATTENTION_MODELS[domain].forEach((model) => {
    const card = document.createElement('article');
    card.className = 'attention-model-card';

    const title = document.createElement('h4');
    title.textContent = model.label;
    card.appendChild(title);

    const pair = document.createElement('div');
    pair.className = 'attention-image-pair';
    pair.appendChild(createAttentionImage(domain, scene, model, 'nm'));
    pair.appendChild(createAttentionImage(domain, scene, model, 'occ'));
    card.appendChild(pair);

    grid.appendChild(card);
  });
}

function setupAttentionPanel(panel) {
  const selector = panel.querySelector('[data-attention-scene]');
  selector.addEventListener('change', () => renderAttentionPanel(panel));
  renderAttentionPanel(panel);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-video-panel]').forEach(setupVideoPanel);
  document.querySelectorAll('[data-ablation-panel]').forEach(setupAblationPanel);
  document.querySelectorAll('[data-attention-panel]').forEach(setupAttentionPanel);
});
