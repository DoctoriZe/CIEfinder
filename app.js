// CIEfinder by DoctoriZe — lógica de la app
(function(){
  "use strict";

  const LS_HISTORY = "cief_history_v1";
  const LS_FAVORITES = "cief_favorites_v1";
  const LS_CUSTOM = "cief_custom_data_v1";
  const LS_IMPORT_META = "cief_import_meta_v1";

  // ---------- Datos ----------
  function loadCustomData(){
    try{
      const raw = localStorage.getItem(LS_CUSTOM);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  }
  let ALL_CODES = CIE_BASE_DATA.concat(loadCustomData());
  function rebuildAllCodes(){ ALL_CODES = CIE_BASE_DATA.concat(loadCustomData()); }

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
    toast: document.getElementById("toast"),
    importFile: document.getElementById("importFile")
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

  // ---------- Render: Ajustes / Importar catálogo ----------
  function renderSettings(){
    const customCount = loadCustomData().length;
    const meta = readJSON(LS_IMPORT_META, null);
    el.content.innerHTML = `
      <div class="section-title">Catálogo de códigos</div>
      <div class="settings-card">
        <div class="settings-row"><span>Códigos base incluidos</span><b>${CIE_BASE_DATA.length}</b></div>
        <div class="settings-row"><span>Códigos importados</span><b>${customCount}</b></div>
        ${meta ? `<div class="settings-row"><span>Última importación</span><b>${escapeHtml(meta.name)} · ${timeAgo(meta.ts)}</b></div>` : ""}
      </div>
      <div class="settings-card">
        <p class="hint" style="margin:0 0 12px;">
          Importa un catálogo CIE-9/CIE-10 actualizado en formato <b>JSON</b> o <b>CSV</b>.
          Cada código debe incluir sistema (CIE9/CIE10), código, nombre en español e inglés.
          Si un código ya existe, se actualiza con los datos nuevos.
        </p>
        <button class="btn fav" id="importBtn" style="width:100%;">⭳ Importar catálogo (JSON/CSV)</button>
        ${customCount > 0 ? `<button class="link-btn" id="clearImportBtn" style="margin-top:10px;">Borrar códigos importados</button>` : ""}
      </div>
      <div class="settings-card">
        <p class="hint" style="margin:0;">
          Formato JSON esperado: una lista de objetos <code>{"sys":"CIE10","code":"J45.9","es":"Asma","en":"Asthma"}</code>.<br><br>
          Formato CSV esperado: primera fila de cabecera <code>sys,code,es,en</code>, una fila por código.
        </p>
      </div>
      <div class="settings-card">
        <p class="hint" style="margin:0 0 12px;">
          Si acabas de subir una versión nueva a GitHub y la app no la muestra
          (sigue viendo datos o funciones viejas), usa este botón en vez de
          borrar la caché de Chrome a mano.
        </p>
        <button class="btn ghost" id="forceUpdateBtn" style="width:100%;">🔄 Buscar y forzar actualización</button>
      </div>
      <p class="hint" style="text-align:center;margin:4px 0 0;">CIEfinder by DoctoriZe · v1.2.8</p>
    `;
    document.getElementById("importBtn").addEventListener("click", () => el.importFile.click());
    document.getElementById("forceUpdateBtn").addEventListener("click", () => {
      if (confirm("Esto borrará los datos en caché y recargará la app con la última versión publicada. El historial y los favoritos NO se pierden. ¿Continuar?")) {
        forceUpdate();
      }
    });
    const clearBtn = document.getElementById("clearImportBtn");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      writeJSON(LS_CUSTOM, []);
      writeJSON(LS_IMPORT_META, null);
      rebuildAllCodes();
      showToast("Catálogo importado eliminado");
      renderSettings();
    });
  }

  // Parseo CSV simple (soporta campos entre comillas con comas dentro)
  function parseCSV(text){
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++){
      const c = text[i];
      if (inQuotes){
        if (c === '"' && text[i+1] === '"'){ field += '"'; i++; }
        else if (c === '"'){ inQuotes = false; }
        else field += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ','){ row.push(field); field = ""; }
        else if (c === '\n' || c === '\r'){
          if (field !== "" || row.length){ row.push(field); rows.push(row); }
          field = ""; row = [];
          if (c === '\r' && text[i+1] === '\n') i++;
        } else field += c;
      }
    }
    if (field !== "" || row.length){ row.push(field); rows.push(row); }
    if (!rows.length) return [];
    const header = rows[0].map(h => h.trim().toLowerCase());
    return rows.slice(1).filter(r => r.length && r.some(c => c.trim() !== "")).map(r => {
      const obj = {};
      header.forEach((h, idx) => obj[h] = (r[idx] || "").trim());
      return obj;
    });
  }

  function normalizeSys(s){
    const v = (s||"").toString().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (v === "CIE10" || v === "ICD10") return "CIE10";
    if (v === "CIE9" || v === "ICD9") return "CIE9";
    return null;
  }

  function validateEntries(list){
    const valid = [];
    let skipped = 0;
    list.forEach(raw => {
      const sys = normalizeSys(raw.sys || raw.system || raw.sistema);
      const code = (raw.code || raw.codigo || raw.código || "").toString().trim();
      const es = (raw.es || raw.español || raw.nombre_es || "").toString().trim();
      const en = (raw.en || raw.ingles || raw.inglés || raw.nombre_en || "").toString().trim();
      if (sys && code && (es || en)){
        valid.push({ sys, code, es: es || en, en: en || es });
      } else {
        skipped++;
      }
    });
    return { valid, skipped };
  }

  function importCatalog(file){
    console.log("importCatalog iniciado con archivo:", file.name);
    const reader = new FileReader();
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      showToast("No se pudo leer el archivo. Inténtalo de nuevo.");
    };
    reader.onload = () => {
      console.log("Archivo leído, tamaño:", reader.result.length);
      try {
        let entries;
        if (file.name.toLowerCase().endsWith(".csv")) {
          console.log("Parseando como CSV");
          entries = parseCSV(reader.result);
        } else {
          console.log("Parseando como JSON");
          const parsed = JSON.parse(reader.result);
          entries = Array.isArray(parsed) ? parsed : (parsed.codes || parsed.data || []);
        }
        console.log("Entradas parseadas:", entries.length);
        const { valid, skipped } = validateEntries(entries);
        console.log("Validadas:", valid.length, "| Omitidas:", skipped);
        if (valid.length === 0){
          showToast("No se encontraron códigos válidos en el archivo");
          return;
        }
        const existing = loadCustomData();
        const map = new Map(existing.map(i => [keyOf(i), i]));
        valid.forEach(i => map.set(keyOf(i), i));
        const merged = Array.from(map.values());
        writeJSON(LS_CUSTOM, merged);
        writeJSON(LS_IMPORT_META, { name: file.name, ts: Date.now() });
        rebuildAllCodes();
        console.log("Importación completada. Total en BD:", merged.length);
        showToast(`Importados ${valid.length} códigos${skipped ? ` (${skipped} omitidos)` : ""}`);
        renderSettings();
      } catch (e) {
        console.error("Error al importar catálogo:", e.message, e.stack);
        showToast("El archivo no se pudo leer. Revisa el formato.");
      }
    };
    console.log("Iniciando lectura del archivo...");
    reader.readAsText(file, "UTF-8");
  }

  el.importFile.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    console.log("Importing file:", file.name, "size:", file.size);
    importCatalog(file);
    el.importFile.value = "";
  });

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
    else if (state.view === "favorites") renderFavorites();
    else renderSettings();
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

  // Fuerza una actualización completa: borra cachés, desregistra el SW viejo
  // y recarga pidiendo todo de nuevo al servidor. Es el equivalente a
  // "Borrar datos del sitio" pero desde dentro de la propia app.
  async function forceUpdate(){
    try {
      showToast("Buscando actualizaciones…");
      if ("caches" in window){
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ("serviceWorker" in navigator){
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      setTimeout(() => {
        location.reload(true);
      }, 300);
    } catch (e) {
      console.error("Error al actualizar:", e);
      showToast("No se pudo actualizar. Cierra y vuelve a abrir la app.");
    }
  }
  window.__ciefinderForceUpdate = forceUpdate;

  render();
})();
