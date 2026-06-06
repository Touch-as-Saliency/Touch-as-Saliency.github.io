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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-video-panel]').forEach(setupVideoPanel);
});
