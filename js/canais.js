
const video = document.getElementById("video");
const yt = document.getElementById("yt");
const ytContainer = document.getElementById("ytContainer");

const select = document.getElementById("playlistSelect");
const statusEl = document.getElementById("status");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const reloadBtn = document.getElementById("reload");
const fsBtn = document.getElementById("fs");
const playToggleBtn = document.getElementById("playToggle");
const muteBtn = document.getElementById("muteBtn");
const qualitySelect = document.getElementById("qualitySelect");
const player = document.getElementById("player");

let PLAYLIST = [
  { name: "Pica Pau 24H", url: "https://www.youtube.com/watch?v=xIs3odCrjZs" },
  { name: "Cartoonito BABY LOONEY TUNES 24h", url: "https://www.youtube.com/watch?v=XfZetbS9084" },
  { name: "TOM and JERRY 24H", url: "https://www.youtube.com/watch?v=rEKifG2XUZg" },
  { name: "Luluzinha 24H", url: "https://www.youtube.com/watch?v=Q3Og7Id_NiQ" },
  { name: "Garfield CARTOONS 24H", url: "https://www.youtube.com/watch?v=oV5gVoZQ7xU" },
  { name: "Disney Pixar Cars NEW 24h", url: "https://www.youtube.com/watch?v=yzKTO-6KWHU" },
  { name: "Disney Phineas and Ferb Season 24h", url: "https://www.youtube.com/watch?v=_HviSyC7zSU" },
  { name: "Disney DuckTales 24h", url: "https://www.youtube.com/watch?v=XD50huu0M24" },
  { name: "Disney Lilo & Stitch 24h", url: "https://www.youtube.com/watch?v=F4Tnje7wi-o" },
  { name: "SBT FHD", url: "https://www.youtube.com/watch?v=LLpNUqHVam8" },
  { name: "SBT Central", url: "https://www.youtube.com/watch?v=INtLcsYlcZ4" },
  { name: "RETRO MUSIC HD", url: "http://stream.mediawork.cz/retrotv//retrotvHQ1/playlist.m3u8" },
  { name: "Vídeo MP4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
];

const PLAYLIST_API = "./playlist.php";
const MAX_CHANNELS = 500;

let index = 0;
let hlsInstance = null;
let ytPlayer = null;
let ytReady = false;
let currentType = "video";

function setStatus(msg){
  statusEl.textContent = msg;
}

function cleanupHls(){
  if (hlsInstance) {
    try { hlsInstance.destroy(); } catch(e) {}
    hlsInstance = null;
  }
}

function stopYouTube(){
  try {
    if (ytPlayer && ytReady) ytPlayer.stopVideo();
  } catch(e){}
  yt.src = "about:blank";
  ytContainer.classList.remove("active");
}

function isM3U8(url){
  return /\.m3u8(\?|#|$)/i.test(url) || /stream\.php\?src=/i.test(url);
}

function isMP4(url){
  return /\.mp4(\?|#|$)/i.test(url);
}

function isYouTube(url){
  return /(youtube\.com|youtu\.be)/i.test(url);
}

function getYouTubeID(url){
  const patterns = [
    /youtu\.be\/([^?&#/]+)/i,
    /youtube\.com\/watch\?v=([^?&#/]+)/i,
    /youtube\.com\/embed\/([^?&#/]+)/i,
    /youtube\.com\/live\/([^?&#/]+)/i,
    /youtube\.com\/shorts\/([^?&#/]+)/i,
  ];

  for (const p of patterns) {
    const m = url.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

function fillSelect(){
  select.innerHTML = "";
  PLAYLIST.forEach((item, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = item.name || `Item ${i+1}`;
    select.appendChild(opt);
  });
  select.value = String(index);
}

function fillQualityOptions(type){
  qualitySelect.innerHTML = `<option value="">Qualidade</option>`;

  if (type === "youtube" && ytPlayer && ytReady) {
    const labels = {
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

    const levels = ytPlayer.getAvailableQualityLevels?.() || [];
    levels.forEach(level => {
      const opt = document.createElement("option");
      opt.value = level;
      opt.textContent = labels[level] || level;
      qualitySelect.appendChild(opt);
    });
    return;
  }

  const opt = document.createElement("option");
  opt.value = "auto";
  opt.textContent = "Auto";
  qualitySelect.appendChild(opt);
}

function showVideo(){
  currentType = "video";
  stopYouTube();
  ytContainer.classList.remove("active");
  video.style.display = "block";
  fillQualityOptions("video");
}

function createYouTubePlayer(videoId){
  return new Promise((resolve) => {
    if (ytPlayer && ytReady) {
      ytPlayer.loadVideoById(videoId);
      ytContainer.classList.add("active");
      currentType = "youtube";
      setTimeout(() => fillQualityOptions("youtube"), 800);
      resolve();
      return;
    }

    yt.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1&fs=0&disablekb=1`;

    yt.onload = () => {
      ytPlayer = new YT.Player("yt", {
        events: {
          onReady: () => {
            ytReady = true;
            ytContainer.classList.add("active");
            currentType = "youtube";
            setTimeout(() => fillQualityOptions("youtube"), 1200);
            resolve();
          }
        }
      });
    };
  });
}

async function showYouTube(url, name){
  cleanupHls();

  try { video.pause(); } catch(e) {}
  video.removeAttribute("src");
  video.load();
  video.style.display = "none";

  const id = getYouTubeID(url);

  if (!id) {
    setStatus("Link do YouTube inválido.");
    return;
  }

  await createYouTubePlayer(id);
  setStatus(`Tocando: ${name}`);
}

async function playItem(i){
  if (!PLAYLIST[i]) return;
  index = i;

  const { name, url } = PLAYLIST[index];
  fillSelect();
  setStatus(`Abrindo: ${name}`);

  if (isYouTube(url)) {
    await showYouTube(url, name);
    return;
  }

  showVideo();
  cleanupHls();

  try { video.pause(); } catch(e) {}
  video.removeAttribute("src");
  video.load();

  if (isM3U8(url)) {
    if (window.Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
        try { await video.play(); } catch(e) {}
        setStatus(`Tocando: ${name}`);
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        setStatus(`Erro HLS: ${data?.details || "desconhecido"}`);
      });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      try { await video.play(); } catch(e) {}
      setStatus(`Tocando (Safari HLS): ${name}`);
    } else {
      setStatus("Seu navegador não suporta HLS.");
    }

  } else {
    video.src = url;
    try { await video.play(); } catch(e) {}
    setStatus(`Tocando: ${name}`);
  }
}

async function tryLoadM3U(){
  try {
    setStatus("Carregando playlist...");

    const res = await fetch(PLAYLIST_API, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar playlist");

    const data = await res.json();

    if (!data.ok || !Array.isArray(data.items) || !data.items.length) {
      throw new Error("Playlist vazia");
    }

    PLAYLIST = [...PLAYLIST, ...data.items.slice(0, MAX_CHANNELS)];
    index = 0;
    fillSelect();
    await playItem(0);
  } catch (e) {
    console.error(e);
    setStatus("Erro ao carregar playlist.");
  }
}

function togglePlayPause(){
  if (currentType === "youtube" && ytPlayer && ytReady) {
    const state = ytPlayer.getPlayerState();
    if (state === 1) ytPlayer.pauseVideo();
    else ytPlayer.playVideo();
    return;
  }

  if (video.paused) video.play();
  else video.pause();
}

function toggleMute(){
  if (currentType === "youtube" && ytPlayer && ytReady) {
    if (ytPlayer.isMuted()) ytPlayer.unMute();
    else ytPlayer.mute();
    return;
  }

  video.muted = !video.muted;
}

function applyQuality(){
  const value = qualitySelect.value;
  if (!value) return;

  if (currentType === "youtube" && ytPlayer && ytReady) {
    try {
      ytPlayer.setPlaybackQuality(value);
      ytPlayer.playVideo();
      setStatus(`Qualidade: ${qualitySelect.options[qualitySelect.selectedIndex].text}`);
    } catch(e) {
      setStatus("Não foi possível trocar a qualidade.");
    }
    return;
  }

  setStatus("Qualidade manual não disponível para este tipo de vídeo.");
}

select.addEventListener("change", () => playItem(Number(select.value)));
prevBtn.addEventListener("click", () => playItem((index - 1 + PLAYLIST.length) % PLAYLIST.length));
nextBtn.addEventListener("click", () => playItem((index + 1) % PLAYLIST.length));
reloadBtn.addEventListener("click", () => playItem(index));
playToggleBtn.addEventListener("click", togglePlayPause);
muteBtn.addEventListener("click", toggleMute);
qualitySelect.addEventListener("change", applyQuality);

fsBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) await player.requestFullscreen();
  else await document.exitFullscreen();
});

(async () => {
  fillSelect();
  await tryLoadM3U();
})();