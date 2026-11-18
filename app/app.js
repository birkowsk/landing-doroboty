/* DoRoboty.ai – ekrany demonstracyjne. Bez zależności, bez backendu.
   Rola i zapisane oferty żyją tylko w localStorage tej przeglądarki; nic nie jest wysyłane. */
(() => {
  const DR = window.DR;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* tryb prywatny: stan tylko do przeładowania */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* jw. */ } },
  };
  const ROLE_KEY = "dr-demo-role";
  const SAVED_KEY = "dr-demo-saved";
  const ROLES = { kandydat: "kandydat", pracodawca: "pracodawca" };

  /* ---------- komunikat ---------- */
  const toastEl = $("[data-toast]");
  let toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 5000);
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-placeholder]")) toast("Jeszcze niepodłączone – to wersja demonstracyjna");
  });

  /* ---------- rola w nagłówku ---------- */
  const role = ROLES[store.get(ROLE_KEY)] || null;
  const roleEl = $("[data-role]");
  if (roleEl) roleEl.textContent = role ? `Rola: ${role} · zmień` : "Wybierz rolę";

  /* ---------- wybór roli: wyśrodkowane okno modalne (atrapa logowania, bez haseł) ---------- */
  let roleDialog;
  function openRole() {
    if (!roleDialog) {
      roleDialog = document.createElement("dialog");
      roleDialog.className = "modal";
      roleDialog.setAttribute("aria-labelledby", "role-title");
      roleDialog.innerHTML = `
        <div class="modal-head">
          <div><p class="eyebrow">Wersja demonstracyjna</p><h2 class="h2" id="role-title">Wybierz rolę</h2></div>
          <button class="icon-btn" type="button" aria-label="Zamknij" data-role-close>×</button>
        </div>
        <form class="modal-body" method="dialog" novalidate data-role-form>
          <p class="small">To atrapa logowania: bez hasła, bez konta i bez wysyłania danych. Wybór zapisuje się tylko w tej przeglądarce.</p>
          <fieldset class="choices">
            <legend class="h3">Jak chcesz obejrzeć DoRoboty.ai?</legend>
            <label class="card choice"><input type="radio" name="rola" value="kandydat"><span class="h3 choice-mark">Kandydat/ka</span><span class="small">Przeglądasz oferty i widzisz przykładowy Match Score.</span></label>
            <label class="card choice"><input type="radio" name="rola" value="pracodawca"><span class="h3 choice-mark">Pracodawca</span><span class="small">Widzisz panel firmy „Pegaz Płatności”: ogłoszenia i aplikacje.</span></label>
          </fieldset>
          <p class="field-error" role="alert" data-role-error hidden>Wybierz jedną z ról, żeby przejść dalej.</p>
          <div class="actions">
            <button class="btn btn-primary" type="submit">Wejdź do wersji demo</button>
            <button class="btn btn-secondary" type="button" data-role-clear>Wyczyść zapisany wybór</button>
          </div>
        </form>`;
      document.body.append(roleDialog);
      const form = $("[data-role-form]", roleDialog);
      $("[data-role-close]", roleDialog).addEventListener("click", () => roleDialog.close());
      roleDialog.addEventListener("click", (e) => { if (e.target === roleDialog) roleDialog.close(); });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const picked = ROLES[new FormData(form).get("rola")];
        if (!picked) { $("[data-role-error]", roleDialog).hidden = false; return; }
        store.set(ROLE_KEY, picked);
        location.href = picked === "pracodawca" ? "pracodawca.html" : "oferty.html";
      });
      $("[data-role-clear]", roleDialog).addEventListener("click", () => { store.del(ROLE_KEY); store.del(SAVED_KEY); location.reload(); });
    }
    const current = role && $(`input[value="${role}"]`, roleDialog);
    if (current) current.checked = true;
    $("[data-role-error]", roleDialog).hidden = true;
    roleDialog.showModal();
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-role], [data-open-role]")) { e.preventDefault(); openRole(); }
  });

  /* ---------- wspólne fragmenty ---------- */
  const addedLabel = (d) => (d === 0 ? "Dzisiaj" : d === 1 ? "1 dzień temu" : `${d} dni temu`);
  const salaryHTML = (o) => o.salary
    ? `<span class="salary-wrap"><span class="salary">${o.salary.min}–${o.salary.max} tys. zł</span><span class="salary-note">${esc(o.salary.basis)} / mies.</span></span>`
    : `<span class="salary">Nie podano wynagrodzenia</span>`;
  const skillsHTML = (tags, max) => {
    const shown = max ? tags.slice(0, max) : tags;
    const rest = tags.length - shown.length;
    return `<ul class="skills" aria-label="Umiejętności">${shown.map((t) => `<li>${esc(t)}</li>`).join("")}${rest > 0 ? `<li>+${rest}</li>` : ""}</ul>`;
  };
  // *fraza* w danych = najważniejsza informacja; najpierw escape, potem pogrubienie
  const rich = (v) => esc(v).replace(/\*(.+?)\*/g, "<strong>$1</strong>");
  const offerURL = (id) => `oferta.html?id=${encodeURIComponent(id)}`;

  function offerRow(o) {
    return `<li class="job-row">
      <div class="job-main">
        <p class="job-company">${esc(o.company)}</p>
        <h3 class="h3 job-title"><a href="${offerURL(o.id)}">${esc(o.title)}</a></h3>
        <ul class="meta"><li><span class="tag tag-muted">${esc(o.category)}</span></li><li>${esc(o.city)}</li><li>${esc(o.mode)}</li><li>${esc(o.level)}</li></ul>
        ${skillsHTML(o.tags, 4)}
      </div>
      <div class="job-facts">
        <span class="small">${addedLabel(o.added)}</span>
        ${salaryHTML(o)}
        <span class="job-score"><span class="score score-sm">${o.score}</span><span class="small">Match Score<span class="sr-only"> ${o.score} na 100</span> · przykład</span></span>
        <a class="btn btn-ghost" href="${offerURL(o.id)}">Zobacz ofertę<span class="sr-only">: ${esc(o.title)}</span></a>
      </div>
    </li>`;
  }

  /* ---------- lista ofert ---------- */
  function initList() {
    const all = DR.getOffers();
    const state = { q: "", cat: "Wszystkie", modes: new Set(), salaryOnly: false, sort: "new" };
    const list = $("[data-list]"), count = $("[data-count]"), empty = $("[data-empty]");
    const seg = $("[data-categories]");
    const cats = ["Wszystkie", "Build", "Apply", "Lead"];
    seg.innerHTML = cats.map((c) => {
      const n = c === "Wszystkie" ? all.length : all.filter((o) => o.category === c).length;
      return `<button type="button" data-cat="${c}" aria-pressed="${c === state.cat}">${c} <span class="count">${n}</span></button>`;
    }).join("");

    function render() {
      const q = state.q.trim().toLowerCase();
      let rows = all.filter((o) =>
        (state.cat === "Wszystkie" || o.category === state.cat) &&
        (!state.modes.size || state.modes.has(o.mode)) &&
        (!state.salaryOnly || o.salary) &&
        (!q || [o.title, o.company, o.city, ...o.tags].some((t) => t.toLowerCase().includes(q))));
      rows = rows.sort((a, b) => (state.sort === "score" ? b.score - a.score : a.added - b.added));
      list.innerHTML = rows.map(offerRow).join("");
      count.textContent = String(rows.length);
      empty.hidden = rows.length > 0;
      list.hidden = rows.length === 0;
      $$("[data-cat]", seg).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)));
    }

    seg.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { state.cat = b.dataset.cat; render(); } });
    $("[data-search]").addEventListener("input", (e) => { state.q = e.target.value; render(); });
    $("[data-search-form]").addEventListener("submit", (e) => e.preventDefault());
    $$("[data-mode]").forEach((c) => c.addEventListener("change", () => { c.checked ? state.modes.add(c.value) : state.modes.delete(c.value); render(); }));
    $("[data-salary-only]").addEventListener("change", (e) => { state.salaryOnly = e.target.checked; render(); });
    $("[data-sort]").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("[data-clear]").addEventListener("click", () => {
      Object.assign(state, { q: "", cat: "Wszystkie", salaryOnly: false }); state.modes.clear();
      $("[data-search]").value = ""; $("[data-salary-only]").checked = false; $$("[data-mode]").forEach((c) => { c.checked = false; });
      render(); $("[data-search]").focus();
    });
    const filters = $("[data-filters]");
    if (window.matchMedia("(max-width: 900px)").matches) filters.removeAttribute("open");
    render();
  }

  /* ---------- szczegóły oferty ---------- */
  function initOffer() {
    const host = $("[data-offer]");
    const o = DR.getOffer(new URLSearchParams(location.search).get("id"));
    if (!o) {
      host.innerHTML = `<div class="card empty"><h1 class="h2">Nie ma takiej oferty</h1><p class="small">Oferta mogła wygasnąć albo adres jest niepełny.</p><a class="btn btn-primary" href="oferty.html">Wróć do ofert</a></div>`;
      return;
    }
    document.title = `${o.title} – ${o.company} | DoRoboty.ai (demo)`;
    const saved = new Set(JSON.parse(store.get(SAVED_KEY) || "[]"));
    const parts = DR.getBreakdown(o.score);
    const li = (xs) => xs.map((x) => `<li><span>${rich(x)}</span></li>`).join("");
    host.innerHTML = `
      <div class="detail-layout">
        <header class="card card-strong detail-head">
          <p class="job-company">${esc(o.company)}</p>
          <h1 class="title">${esc(o.title)}</h1>
          <ul class="meta"><li><span class="tag tag-muted">${esc(o.category)}</span></li><li>${esc(o.city)}</li><li>${esc(o.mode)}</li><li>${esc(o.level)}</li><li>${addedLabel(o.added)}</li></ul>
          ${skillsHTML(o.tags)}
        </header>

        <aside class="detail-aside" aria-label="Warunki i aplikowanie">
          <div class="card card-strong facts">
            <div><p class="eyebrow">Wynagrodzenie</p>${salaryHTML(o)}</div>
            <dl class="facts-list">
              <div><dt>Forma współpracy</dt><dd>${o.salary ? esc(o.salary.basis.replace(/.*\((.*)\)/, "$1")) : "Do ustalenia"}</dd></div>
              <div><dt>Tryb pracy</dt><dd>${esc(o.mode)}</dd></div>
              <div><dt>Lokalizacja</dt><dd>${esc(o.city)}</dd></div>
              <div><dt>Doświadczenie</dt><dd>${esc(o.level)}</dd></div>
            </dl>
            <div><span class="meter" style="--v:${Math.round((o.daysLeft / 30) * 100)}" aria-hidden="true"></span><p class="small">Ogłoszenie widoczne jeszcze ${o.daysLeft} z 30 dni</p></div>
            <button class="btn btn-primary" type="button" data-apply>Aplikuj</button>
            <button class="btn btn-secondary" type="button" data-save aria-pressed="${saved.has(o.id)}">${saved.has(o.id) ? "Zapisano ofertę" : "Zapisz ofertę"}</button>
          </div>
          <p class="small">Oferta demonstracyjna. Aplikacje nie są wysyłane.</p>
        </aside>

        <div class="detail-body">
          <section class="card card-strong callout" aria-labelledby="ai-title">
            <h2 class="eyebrow" id="ai-title">Praca z AI w tej roli</h2>
            <p class="callout-text">${rich(o.ai)}</p>
          </section>
          <div class="card prose">
            <section><h2 class="h2">Zadania</h2><ol class="num-list">${li(o.tasks)}</ol></section>
            <section><h2 class="h2">Wymagania</h2><ul class="check-list">${li(o.reqs)}</ul></section>
            <section><h2 class="h2">Co oferujemy</h2><ul class="perks">${li(o.benefits)}</ul></section>
          </div>
          <section class="card" aria-labelledby="ms-title">
            <p class="eyebrow">Match Score – przykład</p>
            <h2 class="h2" id="ms-title">Jak może wyglądać dopasowanie</h2>
            <div class="score-line"><p class="score"><span>${o.score}</span><small>/100</small></p><p class="small">Wynik jednego fikcyjnego kandydata. To podpowiedź, od kogo zacząć rozmowy, a nie prawdopodobieństwo zatrudnienia ani test umiejętności.</p></div>
            <ul class="breakdown-list">${parts.map((p) => `<li><span>${esc(p.label)}</span><span class="w">${p.weight}%</span><span class="meter" style="--v:${p.value}" aria-hidden="true"></span><span class="n">${p.value}</span></li>`).join("")}</ul>
          </section>
        </div>
      </div>`;
    $("[data-apply]").addEventListener("click", () => toast("Aplikowanie jest symulacją – nic nie zostało wysłane"));
    $("[data-save]").addEventListener("click", (e) => {
      const on = !saved.has(o.id);
      on ? saved.add(o.id) : saved.delete(o.id);
      store.set(SAVED_KEY, JSON.stringify([...saved]));
      e.currentTarget.setAttribute("aria-pressed", String(on));
      e.currentTarget.textContent = on ? "Zapisano ofertę" : "Zapisz ofertę";
    });
  }

  /* ---------- strona wyboru roli: od razu otwiera okno ---------- */
  function initLogin() { openRole(); }

  /* ---------- panel pracodawcy ---------- */
  function initEmployer() {
    const em = DR.getEmployer();
    const state = { status: "aktywne" };
    $$("[data-company]").forEach((el) => { el.textContent = em.company; });
    if (role !== "pracodawca") $("[data-guest]").hidden = false;
    const active = em.postings.filter((p) => p.status === "aktywne");
    const scores = em.applications.map((a) => a.score);
    const activeApps = active.reduce((n, p) => n + p.applications, 0);
    const newApps = active.reduce((n, p) => n + p.newApplications, 0);
    $("[data-stats]").innerHTML = `
      <div class="card card-strong card-accent stat-hero">
        <p class="stat-num stat-num-lg">${activeApps}</p>
        <div><p class="h3">aktywne aplikacje</p><p class="small">w ${active.length} aktywnych ogłoszeniach</p><p class="status status-new">${newApps} nowych czeka na decyzję</p></div>
      </div>
      <div class="card"><p class="stat-num">${active.length}</p><p class="small">aktywne ogłoszenia</p></div>
      <div class="card"><p class="stat-num">${Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}</p><p class="small">średni Match Score aplikacji</p></div>`;

    const seg = $("[data-statuses]");
    const labels = { aktywne: "Aktywne", szkic: "Szkice", "zakończone": "Zakończone" };
    seg.innerHTML = Object.entries(labels).map(([k, l]) =>
      `<button type="button" data-status="${k}" aria-pressed="${k === state.status}">${l} <span class="count">${em.postings.filter((p) => p.status === k).length}</span></button>`).join("");
    const list = $("[data-postings]");
    function render() {
      list.innerHTML = em.postings.filter((p) => p.status === state.status).map((p) => {
        const title = p.offerId ? `<a href="${offerURL(p.offerId)}">${esc(p.title)}</a>` : esc(p.title);
        const cls = p.status === "aktywne" ? " status-active" : "";
        const days = p.status === "aktywne"
          ? `<div class="job-days"><span class="meter" style="--v:${Math.round((p.daysLeft / 30) * 100)}" aria-hidden="true"></span><span class="small">Widoczne jeszcze ${p.daysLeft} z 30 dni</span></div>`
          : `<p class="small job-days">${p.status === "szkic" ? "Nieopublikowane" : "Zakończone po 30 dniach"}</p>`;
        const action = p.offerId ? `<a class="btn btn-ghost" href="${offerURL(p.offerId)}">Zobacz ofertę<span class="sr-only">: ${esc(p.title)}</span></a>`
          : p.status === "szkic" ? `<button class="btn btn-ghost" type="button" data-placeholder>Dokończ szkic</button>` : "";
        return `<li class="job-row">
          <div class="job-main">
            <h3 class="h3 job-title">${title}</h3>
            <ul class="meta"><li><span class="tag tag-muted">${esc(p.category)}</span></li><li><span class="status${cls}">${esc(labels[p.status])}</span></li></ul>
            ${days}
          </div>
          <div class="job-facts">
            <span class="job-apps"><span class="stat-num">${p.applications}</span><span class="small">aplikacji</span></span>
            ${p.newApplications ? `<span class="status status-new">${p.newApplications} nowe</span>` : ""}
            ${p.topScore ? `<span class="job-score"><span class="score score-sm">${p.topScore}</span><span class="small">najwyższy Match Score</span></span>` : ""}
            ${action}
          </div>
        </li>`;
      }).join("");
      $$("[data-status]", seg).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.status === state.status)));
    }
    seg.addEventListener("click", (e) => { const b = e.target.closest("[data-status]"); if (b) { state.status = b.dataset.status; render(); } });
    render();

    $("[data-applications]").innerHTML = em.applications.map((a) => {
      const cls = a.status === "Nowa" ? " status-new" : a.status === "Kontynuujemy" ? " status-active" : "";
      return `<tr><th scope="row">${esc(a.candidate)}</th><td>${esc(a.offer)}</td><td>${esc(a.when)}</td><td><span class="score score-sm">${a.score}</span></td><td><span class="status${cls}">${esc(a.status)}</span></td></tr>`;
    }).join("");
  }

  const page = document.body.dataset.page;
  ({ list: initList, offer: initOffer, login: initLogin, employer: initEmployer }[page] || (() => {}))();
})();
