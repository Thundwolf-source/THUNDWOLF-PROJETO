const TMDB_API_KEY = "8f92c41544a63794405ac8abeabc8792";
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";

  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  const homeBtn = document.getElementById("homeBtn");
  const serieBtn = document.getElementById("serieBtn");
  const filmeBtn = document.getElementById("filmeBtn");

  const detailsModal = document.getElementById("detailsModal");
  const trailerModal = document.getElementById("trailerModal");

  const modalPoster = document.getElementById("modalPoster");
  const modalTitle = document.getElementById("modalTitle");
  const modalMeta = document.getElementById("modalMeta");
  const modalVote = document.getElementById("modalVote");
  const modalDescription = document.getElementById("modalDescription");
  const modalGenres = document.getElementById("modalGenres");

  const tvSection = document.getElementById("tvSection");
  const seasonTabs = document.getElementById("seasonTabs");
  const episodesList = document.getElementById("episodesList");
  const recommendations = document.getElementById("recommendations");

  const closeDetails = document.getElementById("closeDetails");
  const closeInfoBtn = document.getElementById("closeInfoBtn");
  const watchTrailerBtn = document.getElementById("watchTrailerBtn");

  const closeTrailer = document.getElementById("closeTrailer");
  const trailerFrame = document.getElementById("trailerFrame");

  let currentMedia = null;

  function setGridMsg(msg){
    grid.innerHTML = `<p class="emptyMsg">${msg}</p>`;
  }

  function titleOf(item){
    return item.title || item.name || "Sem título";
  }

  function yearOf(item){
    const date = item.release_date || item.first_air_date || "";
    return date ? date.slice(0,4) : "----";
  }

  function typeOf(item){
    if (item.media_type) return item.media_type;
    if (item.title) return "movie";
    if (item.name) return "tv";
    return "movie";
  }

  async function tmdbFetch(endpoint){
    const url = `https://api.themoviedb.org/3${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`;
    const res = await fetch(url);
    const text = await res.text();
    if(!res.ok){
      console.error("TMDB ERRO:", res.status, text);
      throw new Error(`TMDB erro ${res.status}`);
    }
    return JSON.parse(text);
  }

  function renderGrid(items){
    grid.innerHTML = "";

    const only = (items || []).filter(it => {
      const t = typeOf(it);
      return t === "movie" || t === "tv";
    });

    if(!only.length){
      setGridMsg("Nenhum conteúdo encontrado.");
      return;
    }

    only.forEach(item => {
      const title = titleOf(item);
      const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : "";

      const card = document.createElement("div");
      card.className = "square";
      card.innerHTML = `
        <img class="imgConstent" src="${poster}" alt="${title}">
        <div class="cardOverlay"><span class="cardTitle">${title}</span></div>
      `;
      card.addEventListener("click", () => openDetails(item.id, typeOf(item)));
      grid.appendChild(card);
    });
  }

  async function loadTrending(){
    setGridMsg("Carregando conteúdos…");
    try{
      const data = await tmdbFetch(`/trending/all/day?language=pt-BR&page=1`);
      renderGrid(data.results || []);
    }catch(e){
      setGridMsg("Erro ao carregar. Abra o console (F12).");
    }
  }

  async function loadMovies(){
    setGridMsg("Carregando filmes…");
    try{
      const data = await tmdbFetch(`/movie/popular?language=pt-BR&page=1`);
      renderGrid(data.results || []);
    }catch(e){
      setGridMsg("Erro ao carregar filmes.");
    }
  }

  async function loadSeries(){
    setGridMsg("Carregando séries…");
    try{
      const data = await tmdbFetch(`/tv/popular?language=pt-BR&page=1`);
      renderGrid(data.results || []);
    }catch(e){
      setGridMsg("Erro ao carregar séries.");
    }
  }

  async function searchContent(){
    const q = searchInput.value.trim();
    if(!q){ loadTrending(); return; }

    setGridMsg("Pesquisando…");
    try{
      const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(q)}&language=pt-BR&page=1`);
      const filtered = (data.results || []).filter(x => x.media_type === "movie" || x.media_type === "tv");
      renderGrid(filtered);
    }catch(e){
      setGridMsg("Erro na pesquisa.");
    }
  }

  function renderRecommendations(items){
    recommendations.innerHTML = "";

    if(!items.length){
      recommendations.innerHTML = `<p class="emptyMsg">Sem recomendações.</p>`;
      return;
    }

    items.slice(0, 12).forEach(item => {
      const card = document.createElement("div");
      card.className = "recCard";

      card.innerHTML = `
        <img class="recPoster" src="${item.poster_path ? IMG_BASE + item.poster_path : ""}" alt="${titleOf(item)}">
        <div class="recTitle">${titleOf(item)}</div>
        <div class="recVote">⭐ ${(item.vote_average ?? 0).toFixed(1)}</div>
      `;

      card.addEventListener("click", () => openDetails(item.id, typeOf(item)));
      recommendations.appendChild(card);
    });
  }

  async function loadRecommendations(id, type){
    try{
      const data = await tmdbFetch(`/${type}/${id}/recommendations?language=pt-BR&page=1`);
      renderRecommendations(data.results || []);
    }catch(e){
      recommendations.innerHTML = `<p class="emptyMsg">Erro ao carregar recomendações.</p>`;
    }
  }

  function renderSeasons(show){
    seasonTabs.innerHTML = "";
    episodesList.innerHTML = "";

    const seasons = (show.seasons || []).filter(s => s.season_number > 0);

    if(!seasons.length){
      episodesList.innerHTML = `<p class="emptyMsg">Sem temporadas disponíveis.</p>`;
      return;
    }

    seasons.forEach((season, idx) => {
      const btn = document.createElement("button");
      btn.className = `seasonBtn ${idx === 0 ? "active" : ""}`;
      btn.textContent = `Temporada ${season.season_number}`;

      btn.addEventListener("click", async () => {
        document.querySelectorAll(".seasonBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        await loadSeasonEpisodes(show.id, season.season_number);
      });

      seasonTabs.appendChild(btn);
    });

    loadSeasonEpisodes(show.id, seasons[0].season_number);
  }

  async function loadSeasonEpisodes(seriesId, seasonNumber){
    episodesList.innerHTML = `<p class="emptyMsg">Carregando episódios…</p>`;

    try{
      const data = await tmdbFetch(`/tv/${seriesId}/season/${seasonNumber}?language=pt-BR`);
      const episodes = data.episodes || [];

      if(!episodes.length){
        episodesList.innerHTML = `<p class="emptyMsg">Sem episódios encontrados.</p>`;
        return;
      }

      episodesList.innerHTML = "";

      episodes.forEach(ep => {
        const card = document.createElement("div");
        card.className = "episodeCard";

        card.innerHTML = `
          <div class="episodeTop">
            <div class="episodeTitle">Ep. ${ep.episode_number} - ${ep.name || "Sem título"}</div>
            <div class="episodeMeta">⭐ ${(ep.vote_average ?? 0).toFixed(1)}</div>
          </div>
          <div class="episodeOverview">${ep.overview || "Sem descrição."}</div>
        `;

        episodesList.appendChild(card);
      });
    }catch(e){
      episodesList.innerHTML = `<p class="emptyMsg">Erro ao carregar episódios.</p>`;
    }
  }

  async function openDetails(id, type){
    try{
      const details = await tmdbFetch(`/${type}/${id}?language=pt-BR`);
      currentMedia = { id, type };

      const title = titleOf(details);
      modalTitle.textContent = title;

      modalPoster.src = details.poster_path ? `${IMG_BASE}${details.poster_path}` : "";
      modalPoster.alt = title;

      const y = yearOf(details);
      const rating = (details.vote_average != null) ? details.vote_average.toFixed(1) : "N/A";

      let extra = "";
      if(type === "movie" && details.runtime) extra = `${details.runtime} min`;
      if(type === "tv" && details.number_of_seasons) extra = `${details.number_of_seasons} temporada(s)`;

      modalMeta.textContent = `${y} • ${extra ? extra : "Sem duração"}`;
      modalVote.textContent = `⭐ Avaliação dos usuários: ${rating}`;
      modalDescription.textContent = details.overview || "Sem descrição disponível.";

      modalGenres.innerHTML = "";
      (details.genres || []).forEach(g => {
        const s = document.createElement("span");
        s.className = "genreTag";
        s.textContent = g.name;
        modalGenres.appendChild(s);
      });

      if(type === "tv"){
        tvSection.classList.remove("hidden");
        renderSeasons(details);
      }else{
        tvSection.classList.add("hidden");
        seasonTabs.innerHTML = "";
        episodesList.innerHTML = "";
      }

      loadRecommendations(id, type);

      detailsModal.classList.remove("hidden");
      detailsModal.setAttribute("aria-hidden","false");
    }catch(e){
      console.error(e);
      alert("Não foi possível abrir os detalhes.");
    }
  }

  async function openTrailer(){
    if(!currentMedia) return;

    try{
      const data = await tmdbFetch(`/${currentMedia.type}/${currentMedia.id}/videos?language=pt-BR`);
      const vids = data.results || [];

      let trailer = vids.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official);
      if(!trailer) trailer = vids.find(v => v.site === "YouTube" && v.type === "Trailer");
      if(!trailer) trailer = vids.find(v => v.site === "YouTube");

      if(!trailer){
        alert("Esse conteúdo não tem trailer disponível.");
        return;
      }

      trailerFrame.src = "about:blank";
      trailerFrame.src = `./trailer-player.html?v=${encodeURIComponent(trailer.key)}&r=${Date.now()}`;

      trailerModal.classList.remove("hidden");
      trailerModal.setAttribute("aria-hidden","false");
    }catch(e){
      console.error(e);
      alert("Erro ao carregar trailer.");
    }
  }

  function closeDetailsModal(){
    detailsModal.classList.add("hidden");
    detailsModal.setAttribute("aria-hidden","true");
  }

  function closeTrailerModal(){
    trailerModal.classList.add("hidden");
    trailerModal.setAttribute("aria-hidden","true");
    trailerFrame.src = "";
  }

  searchBtn.addEventListener("click", searchContent);
  searchInput.addEventListener("keydown", (e) => { if(e.key === "Enter") searchContent(); });

  homeBtn.addEventListener("click", (e)=>{ e.preventDefault(); loadTrending(); });
  filmeBtn.addEventListener("click", (e)=>{ e.preventDefault(); loadMovies(); });
  serieBtn.addEventListener("click", (e)=>{ e.preventDefault(); loadSeries(); });

  watchTrailerBtn.addEventListener("click", openTrailer);

  closeDetails.addEventListener("click", closeDetailsModal);
  closeInfoBtn.addEventListener("click", closeDetailsModal);

  closeTrailer.addEventListener("click", closeTrailerModal);

  detailsModal.addEventListener("click", (e)=>{ if(e.target === detailsModal) closeDetailsModal(); });
  trailerModal.addEventListener("click", (e)=>{ if(e.target === trailerModal) closeTrailerModal(); });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      closeTrailerModal();
      closeDetailsModal();
    }
  });

  loadTrending();
