// CIEfinder by DoctoriZe — lógica de la app
(function(){
  "use strict";

  const LS_HISTORY = "cief_history_v1";
  const LS_FAVORITES = "cief_favorites_v1";
  const LS_CUSTOM = "cief_custom_data_v1";

  // ---------- Datos ----------
  function loadCustomData(){
    try{
      const raw = localStorage.getItem(LS_CUSTOM);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  const ALL_CODES = CIE_BASE_DATA.concat(loadCustomData());

  function keyOf(item){ return item.sys + ":" + item.code; }

  // ---------- Utilidades ----------
  function normalize(str){
    return (str || "")
      .toString()
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita acentos
  }

  function readJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function writeJSON(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
  }

  function escapeHtml(s){
    return (s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }

  function timeAgo(ts){
    const diff = Math.max(0, Date.now() - ts);
    const min = Math.floor(diff/60000);
    if (min < 1) return "ahora";
    if (min < 60) return min + " min";
    const h = Math.floor(min/60);
    if (h < 24) return h + " h";
    const d = Math.floor(h/24);
    if (d < 30) return d + " d";
    const dt = new Date(ts);
    return dt.toLocaleDateString("es-ES", {day:"2-digit", month:"short"});
  }

  // ---------- Estado ----------
  const state = {
    view: "search",
    filter: "ALL",
    query: ""
  };

  let favorites = new Set(readJSON(LS_FAVORITES, []));
  let history = readJSON(LS_HISTORY, []); // [{q, ts}]

  // ---------- Elementos ----------
  const el = {
    content: document.getElementById("content"),
    searchInput: document.getElementById("searchInput"),
    clearBtn: document.getElementById("clearBtn"),
    searchWrap: document.getElementById("searchWrap"),
    tabs: document.querySelectorAll(".tab"),
    chips: document.querySelectorAll(".chip"),
    sheetOverlay: document.getElementById("sheetOverlay"),
    sheet: document.getElementById("sheet"),
    toast: document.getElementById("toast")
  };

  // ---------- Búsqueda ----------
  function search(query, filter){
    const q = normalize(query).trim();
    if (!q) return [];
    return ALL_CODES.filter(item => {
      if (filter !== "ALL" && item.sys !== filter) return false;
      const code = normalize(item.code);
      const es = normalize(item.es);
      const en = normalize(item.en);
      return code.indexOf(q) === 0 || code.indexOf(q) !== -1 || es.indexOf(q) !== -1 || en.indexOf(q) !== -1;
    }).sort((a,b) => {
      // prioriza coincidencias por código exacto/al inicio
      const aCode = normalize(a.code), bCode = normalize(b.code);
      const aStarts = aCode.indexOf(q) === 0 ? 0 : 1;
      const bStarts = bCode.indexOf(q) === 0 ? 0 : 1;
      return aStarts - bStarts;
    }).slice(0, 60);
  }

  function addHistory(query){
    const q = query.trim();
    if (q.length < 2) return;
    history = history.filter(h => normalize(h.q) !== normalize(q));
    history.unshift({ q, ts: Date.now() });
    history = history.slice(0, 60);
    writeJSON(LS_HISTORY, history);
  }

  let historyDebounce = null;
  function scheduleHistory(query){
    clearTimeout(historyDebounce);
    historyDebounce = setTimeout(() => addHistory(query), 900);
  }

  // ---------- Render: Buscar ----------
  function renderSearch(){
    const q = state.query;
    if (!q.trim()){
      el.content.innerHTML = emptyState(
        `<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
        "Busca una enfermedad o código",
        "Escribe en español o en inglés. Ej.: “diabetes”, “J45.9”, “headache”."
      );
      return;
    }
    const results = search(q, state.filter);
    if (results.length === 0){
      el.content.innerHTML = emptyState(
        `<path d="M12 9v4M12 16h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>`,
        "Sin resultados",
        "No encontramos coincidencias en el catálogo cargado. Puedes ampliar el catálogo desde el archivo de datos."
      );
      return;
    }
    el.content.innerHTML =
      `<div class="section-title">${results.length} resultado${results.length===1?"":"s"}</div>` +
      `<div class="result-list">${results.map(cardHtml).join("")}</div>`;
    bindCardClicks(results);
  }

  function cardHtml(item){
    const fav = favorites.has(keyOf(item));
    return `
      <div class="code-card" data-key="${keyOf(item)}">
        <div class="row1">
          <span class="pill ${item.sys.toLowerCase()}">${item.sys}</span>
          <span class="code">${escapeHtml(item.code)}</span>
          <button class="star-btn ${fav?"active":""}" data-star="${keyOf(item)}" aria-label="Favorito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${fav?"currentColor":"none"}"><path d="M12 20s-7-4.35-9.5-8.5C.8 8.1 2.6 4.8 6 4.8c2 0 3.3 1.1 4 2.1a4.9 4.9 0 0 1 4-2.1c3.4 0 5.2 3.3 3.5 6.7C19 15.65 12 20 12 20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <p class="desc-es">${escapeHtml(item.es)}</p>
        <p class="desc-en">${escapeHtml(item.en)}</p>
      </div>`;
  }

  function emptyState(iconPaths, title, hint){
    return `<div class="empty-state">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none">${iconPaths}</svg>
      <p><b>${title}</b></p>
      <p class="hint">${hint}</p>
    </div>`;
  }

  function bindCardClicks(items){
    el.content.querySelectorAll(".code-card").forEach(card => {
      const key = card.getAttribute("data-key");
      const item = items.find(i => keyOf(i) === key);
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-star]")) return;
        openDetail(item);
      });
    });
    el.content.querySelectorAll("[data-star]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-star");
        toggleFavorite(key);
        render();
      });
    });
  }

  // ---------- Render: Historial ----------
  function renderHistory(){
    if (history.length === 0){
      el.content.innerHTML = emptyState(
        `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>`,
        "Sin búsquedas todavía",
        "Tus búsquedas recientes aparecerán aquí."
      );
      return;
    }
    el.content.innerHTML =
      `<div class="clear-row"><button class="link-btn" id="clearHistoryBtn">Borrar historial</button></div>` +
      history.map(h => `
        <div class="history-card" data-q="${escapeHtml(h.q)}">
          <div>
            <div class="htext">${escapeHtml(h.q)}</div>
            <div class="htime">${timeAgo(h.ts)}</div>
          </div>
          <button class="hdel" data-del-q="${escapeHtml(h.q)}">✕</button>
        </div>`).join("");

    el.content.querySelectorAll(".history-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-del-q]")) return;
        const q = card.getAttribute("data-q");
        goToSearch(q);
      });
    });
    el.content.querySelectorAll("[data-del-q]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const q = btn.getAttribute("data-del-q");
        history = history.filter(h => h.q !== q);
        writeJSON(LS_HISTORY, history);
        renderHistory();
      });
    });
    const clearBtn = document.getElementById("clearHistoryBtn");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      history = [];
      writeJSON(LS_HISTORY, history);
      renderHistory();
    });
  }

  // ---------- Render: Favoritos ----------
  function renderFavorites(){
    const items = ALL_CODES.filter(i => favorites.has(keyOf(i)));
    if (items.length === 0){
      el.content.innerHTML = emptyState(
        `<path d="M12 20s-7-4.35-9.5-8.5C.8 8.1 2.6 4.8 6 4.8c2 0 3.3 1.1 4 2.1a4.9 4.9 0 0 1 4-2.1c3.4 0 5.2 3.3 3.5 6.7C19 15.65 12 20 12 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`,
        "Sin favoritos todavía",
        "Toca la estrella en cualquier resultado para guardarlo aquí."
      );
      return;
    }
    el.content.innerHTML =
      `<div class="section-title">${items.length} favorito${items.length===1?"":"s"}</div>` +
      `<div class="result-list">${items.map(cardHtml).join("")}</div>`;
    bindCardClicks(items);
  }

  function toggleFavorite(key){
    if (favorites.has(key)) favorites.delete(key);
    else favorites.add(key);
    writeJSON(LS_FAVORITES, Array.from(favorites));
    showToast(favorites.has(key) ? "Añadido a favoritos" : "Quitado de favoritos");
  }

  // ---------- Hoja de detalle ----------
  function openDetail(item){
    const fav = favorites.has(keyOf(item));
    el.sheet.innerHTML = `
      <div class="grip"></div>
      <div class="row1">
        <span class="pill ${item.sys.toLowerCase()}">${item.sys}</span>
        <span class="code-big">${escapeHtml(item.code)}</span>
      </div>
      <div class="lang-block">
        <div class="lang-label">Español</div>
        <div class="lang-text">${escapeHtml(item.es)}</div>
      </div>
      <div class="lang-block">
        <div class="lang-label">English</div>
        <div class="lang-text">${escapeHtml(item.en)}</div>
      </div>
      <div class="actions">
        <button class="btn fav ${fav?"active":""}" id="sheetFavBtn">${fav?"★ En favoritos":"☆ Añadir a favoritos"}</button>
        <button class="btn ghost" id="sheetCopyBtn">Copiar código</button>
      </div>
    `;
    el.sheetOverlay.classList.add("show");

    document.getElementById("sheetFavBtn").addEventListener("click", () => {
      toggleFavorite(keyOf(item));
      openDetail(item);
      render();
    });
    document.getElementById("sheetCopyBtn").addEventListener("click", () => {
      copyToClipboard(item.code);
      showToast("Código copiado");
    });
  }

  el.sheetOverlay.addEventListener("click", (e) => {
    if (e.target === el.sheetOverlay) el.sheetOverlay.classList.remove("show");
  });

  function copyToClipboard(text){
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).catch(()=>{});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta);
    }
  }

  // ---------- Toast ----------
  let toastTimeout = null;
  function showToast(msg){
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.toast.classList.remove("show"), 1600);
  }

  // ---------- Navegación ----------
  function render(){
    el.searchWrap.style.display = state.view === "search" ? "block" : "none";
    el.tabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-view") === state.view));
    if (state.view === "search") renderSearch();
    else if (state.view === "history") renderHistory();
    else renderFavorites();
  }

  function goToSearch(query){
    state.view = "search";
    state.query = query;
    el.searchInput.value = query;
    el.clearBtn.style.display = query ? "inline-block" : "none";
    render();
  }

  el.tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      state.view = tab.getAttribute("data-view");
      render();
    });
  });

  el.chips.forEach(chip => {
    chip.addEventListener("click", () => {
      el.chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.filter = chip.getAttribute("data-filter");
      renderSearch();
    });
  });

  el.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    el.clearBtn.style.display = state.query ? "inline-block" : "none";
    renderSearch();
    scheduleHistory(state.query);
  });

  el.clearBtn.addEventListener("click", () => {
    state.query = "";
    el.searchInput.value = "";
    el.clearBtn.style.display = "none";
    el.searchInput.focus();
    renderSearch();
  });

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator){
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(()=>{});
    });
  }

  render();
})();
