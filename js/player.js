const params = new URLSearchParams(location.search);
const videoId = params.get("v");

const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const timeEl = document.getElementById("time");
const prog = document.getElementById("progress");
const vol = document.getElementById("volume");
const quality = document.getElementById("quality");
const fsBtn = document.getElementById("fs");
const root = document.getElementById("root");

let player;
let timer = null;
let isSeeking = false;

const labelMap = {
  highres: "Máxima",
  hd2160: "2160p",
  hd1440: "1440p",
  hd1080: "1080p",
  hd720: "720p",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
  auto: "Auto"
};

function fmt(seconds) {
  seconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setPlayIcon() {
  const state = player?.getPlayerState?.();
  playBtn.textContent = state === 1 ? "⏸️" : "▶️";
}

function setMuteIcon() {
  if (!player) return;
  muteBtn.textContent = player.isMuted() ? "🔇" : "🔊";
}

function updateUI() {
  if (!player) return;

  const duration = player.getDuration?.() || 0;
  const current = player.getCurrentTime?.() || 0;
  timeEl.textContent = `${fmt(current)} / ${fmt(duration)}`;

  if (!isSeeking && duration > 0) {
    prog.value = Math.round((current / duration) * 1000);
  }
}

function fillQuality() {
  if (!player) return;

  const levels = player.getAvailableQualityLevels?.() || [];
  quality.innerHTML = '<option value="" selected>Qualidade</option>';

  levels.forEach((level) => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = labelMap[level] || level;
    quality.appendChild(opt);
  });
}

window.onYouTubeIframeAPIReady = function () {
  if (!videoId) {
    document.body.innerHTML = "<p style='color:#fff;padding:20px'>Sem trailer.</p>";
    return;
  }

  player = new YT.Player("ytapi", {
    videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      fs: 0,
      disablekb: 1
    },
    events: {
      onReady: () => {
        player.setVolume(100);
        setMuteIcon();
        setPlayIcon();
        fillQuality();
        timer = setInterval(updateUI, 250);

        try {
          player.setPlaybackQuality("auto");
        } catch (error) {}
      },
      onStateChange: () => {
        setPlayIcon();
        setTimeout(fillQuality, 300);
      }
    }
  });
};

playBtn.addEventListener("click", () => {
  if (!player) return;

  const state = player.getPlayerState();
  if (state === 1) player.pauseVideo();
  else player.playVideo();
  setPlayIcon();
});

muteBtn.addEventListener("click", () => {
  if (!player) return;

  if (player.isMuted()) player.unMute();
  else player.mute();

  setMuteIcon();
});

vol.addEventListener("input", () => {
  if (!player) return;

  const value = Number(vol.value);
  player.setVolume(value);

  if (value === 0) player.mute();
  else player.unMute();

  setMuteIcon();
});

prog.addEventListener("input", () => {
  isSeeking = true;
});

prog.addEventListener("change", () => {
  if (!player) return;

  const duration = player.getDuration() || 0;
  const target = (Number(prog.value) / 1000) * duration;
  player.seekTo(target, true);
  isSeeking = false;
});

quality.addEventListener("change", () => {
  if (!player) return;

  const selected = quality.value;
  if (!selected) return;

  try {
    player.setPlaybackQuality(selected);
    player.playVideo();
  } catch (error) {}
});

fsBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) await root.requestFullscreen();
  else await document.exitFullscreen();
});

window.addEventListener("beforeunload", () => {
  if (timer) clearInterval(timer);
});
