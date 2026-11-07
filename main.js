/* DoRoboty.ai – landing dla firm. Bez zależności. */
(() => {
  const CYAN = "#2DE2E6";
  const PINK = "#FF3EA5";
  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

  /* ---------- komunikat dla niepodłączonych przycisków ---------- */
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  document.querySelectorAll("[data-placeholder]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toast.textContent = "Jeszcze niepodłączone – to prototyp strony";
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 5000);
    });
  });

  /* ---------- raster herosa (Canvas2D z obrazu źródłowego) ----------
     Kropka = jeden kandydat. Na nocnym tle: im jaśniejszy fragment robota, tym większa kropka;
     czerwone elementy zabawki świecą na różowo.
     Tło obrazu źródłowego jest czarne, więc nie daje kropek. */
  const raster = document.querySelector("[data-raster]");
  if (raster) {
    const canvas = raster.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let pixels = null;

    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = img.naturalWidth;
      off.height = img.naturalHeight;
      const octx = off.getContext("2d", { willReadFrequently: true });
      octx.drawImage(img, 0, 0);
      pixels = octx.getImageData(0, 0, off.width, off.height);
      drawRaster();
      raster.classList.add("is-drawn");
    };
    img.src = raster.dataset.src;

    // R = jasność kropki, G = czerwony element robota (kropka różowa)
    function sample(u, v) {
      const x = Math.min(pixels.width - 1, Math.max(0, Math.round(u * pixels.width)));
      const y = Math.min(pixels.height - 1, Math.max(0, Math.round(v * pixels.height)));
      const i = (y * pixels.width + x) * 4;
      return [pixels.data[i] / 255, pixels.data[i + 1] > 128];
    }

    function drawRaster() {
      if (!pixels) return;
      const rect = raster.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      const grad = ctx.createLinearGradient(0, 0, 0, rect.height);
      grad.addColorStop(0, "#F2FEFF");
      grad.addColorStop(1, CYAN);
      const cyanPath = new Path2D();
      const pinkPath = new Path2D();

      const step = isMobile() ? 8 : Math.max(5.5, rect.width / 76);
      const half = step / 2;
      for (let y = half; y < rect.height; y += step) {
        for (let x = half; x < rect.width; x += step) {
          const [v, isPink] = sample(x / rect.width, y / rect.height);
          if (v < 0.03) continue; // tło
          const r = (0.15 + 0.85 * Math.pow(v, 0.9)) * half;
          const path = isPink ? pinkPath : cyanPath;
          path.moveTo(x + r, y);
          path.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = grad;
      ctx.fill(cyanPath);
      ctx.fillStyle = PINK;
      ctx.shadowColor = "rgba(255, 62, 165, 0.8)";
      ctx.shadowBlur = 6;
      ctx.fill(pinkPath);
      ctx.shadowBlur = 0;
    }

    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(drawRaster, 150); });
  }

  /* ---------- karuzela ofert ----------
     Port komponentu „Coverflow Carousel” z 21st.dev (React + Tailwind) do czystego JS.
     Mechanika 1:1: ułamkowa pozycja jako jedyne źródło prawdy, malowanie prosto do DOM,
     zapętlenie przez „zwijanie” odległości po pierścieniu (bez klonów), przyciąganie
     wykładnicze, rzut po przeciągnięciu (maks. 2 karty), strzałki, przyciski i kropki.
     Bez JS zostaje zwykła siatka ofert (progressive enhancement). */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const offerList = document.querySelector("[data-offer-grid]");

  function coverflow(list, {
    rotate = 44, depth = 0.6, perspective = 3, falloff = 0.56, fade = 0.1, gap = 0.05, loop = true,
    label = "Karuzela",
  } = {}) {
    const cards = [...list.children];
    const count = cards.length;
    if (count < 2) return null;

    // struktura komponentu: region > relative > frame(perspektywa) > stage(3D) > karty
    const root = document.createElement("div");
    root.className = "cf";
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "karuzela");
    root.setAttribute("aria-label", label);
    const rel = document.createElement("div");
    rel.className = "cf-rel";
    const frame = document.createElement("div");
    frame.className = "cf-frame";
    frame.tabIndex = 0;
    frame.style.perspective = `calc(var(--cf-card) * ${perspective})`;
    frame.style.touchAction = "pan-y"; // poziome przeciąganie nasze, pionowe przewijanie strony zostaje
    list.parentNode.insertBefore(root, list);
    list.classList.add("cf-stage");
    frame.append(list);

    const chevron = (d) =>
      `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "cf-nav cf-prev";
    prev.setAttribute("aria-label", "Poprzednia oferta");
    prev.innerHTML = chevron("m15 18-6-6 6-6");
    const next = document.createElement("button");
    next.type = "button";
    next.className = "cf-nav cf-next";
    next.setAttribute("aria-label", "Następna oferta");
    next.innerHTML = chevron("m9 18 6-6-6-6");
    rel.append(frame, prev, next);

    const pager = document.createElement("div");
    pager.className = "cf-pager";
    const dots = cards.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Pokaż ofertę ${i + 1} z ${count}`);
      b.addEventListener("click", () => goTo(i));
      pager.append(b);
      return b;
    });
    const hint = document.createElement("p");
    hint.className = "cf-hint small";
    hint.textContent = "Przeciągnij, użyj strzałek albo kliknij boczną kartę";
    root.append(rel, pager, hint);

    cards.forEach((card, i) => {
      card.classList.add("cf-card");
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slajd");
      card.setAttribute("aria-label", `${i + 1} z ${count}`);
    });

    let pos = 0;          // ułamkowy indeks karty na środku – jedyne źródło prawdy
    let target = 0;       // dokąd zmierza bieżące przyciąganie
    let width = 0;
    let raf = null;
    let drag = null;
    let selected = -1;

    const indexAt = (p) => ((Math.round(p) % count) + count) % count;
    const clamp = (p) => (loop ? p : Math.max(0, Math.min(count - 1, p)));

    function select(i) {
      if (i === selected) return;
      selected = i;
      cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
      dots.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
    }

    function paint() {
      if (!width) return;
      const pitch = width * (1 + gap);
      cards.forEach((card, index) => {
        // zwinięcie odległości na krótszą stronę pierścienia = cała mechanika pętli
        let offset = index - pos;
        if (loop) {
          offset = ((offset % count) + count) % count;
          if (offset > count / 2) offset -= count;
        }
        const distance = Math.abs(offset);
        const ramp = Math.pow(distance, falloff); // pochylenie i oddalenie słabną z odległością
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
        card.style.transform =
          `translateX(calc(-50% + ${offset * pitch}px)) ` +
          `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
        // karta przeskakuje na drugą stronę pierścienia w pół obrotu – musi być już niewidoczna
        const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
        card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
        card.style.zIndex = String(100 - Math.round(distance));
      });
    }

    function settle(to) {
      if (raf !== null) cancelAnimationFrame(raf);
      target = to;
      select(indexAt(to));
      if (reduceMotion.matches) { // ograniczenie ruchu: bez dojazdu, od razu na miejscu
        pos = to;
        paint();
        raf = null;
        return;
      }
      const step = () => {
        const remaining = target - pos;
        if (Math.abs(remaining) < 0.0004) {
          pos = target;
          paint();
          raf = null;
          return;
        }
        pos += remaining * 0.16; // wykładnicze wyhamowanie
        paint();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    function goTo(index) {
      const to = loop ? index + Math.round((target - index) / count) * count : index;
      settle(clamp(to));
    }
    const nudge = (by) => settle(clamp(Math.round(target) + by));

    prev.addEventListener("click", () => nudge(-1));
    next.addEventListener("click", () => nudge(1));
    frame.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge(1); }
    });

    frame.addEventListener("pointerdown", (e) => {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      frame.setPointerCapture(e.pointerId);
      target = pos;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, pos, v: 0, t: performance.now(), moved: 0 };
    });
    frame.addEventListener("pointermove", (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const pitch = width * (1 + gap);
      if (!pitch) return;
      const now = performance.now();
      const previous = pos;
      pos = clamp(drag.pos - (e.clientX - drag.x) / pitch);
      drag.v = ((pos - previous) / Math.max(now - drag.t, 1)) * 1000; // karty na sekundę
      drag.t = now;
      drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.x));
      select(indexAt(pos));
      paint();
    });
    const endDrag = (e) => {
      if (!drag || drag.id !== e.pointerId) return;
      const d = drag;
      drag = null;
      if (d.moved < 6 && e.type === "pointerup") {
        // kliknięcie bez przeciągania: boczna karta jedzie na środek
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const card = hit && hit.closest(".cf-card");
        const i = cards.indexOf(card);
        if (i >= 0 && i !== selected) { goTo(i); return; }
      }
      const carried = Math.max(-2, Math.min(2, d.v * 0.18)); // rzut, ale maks. 2 karty
      settle(clamp(Math.round(pos + carried)));
    };
    frame.addEventListener("pointerup", endDrag);
    frame.addEventListener("pointercancel", endDrag);

    // szerokość karty wyznacza rozstaw, głębię i perspektywę; wysokość sceny = najwyższa karta
    function measure() {
      cards.forEach((c) => { c.style.height = "auto"; });
      width = cards[0].offsetWidth;
      const h = Math.max(...cards.map((c) => c.offsetHeight));
      cards.forEach((c) => { c.style.height = `${h}px`; });
      list.style.height = `${h}px`;
      paint();
      root.dispatchEvent(new CustomEvent("cf:layout", { bubbles: true }));
    }
    measure();
    select(0);
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(frame);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return { root, frame, list };
  }

  const carousel = offerList
    ? coverflow(offerList, { label: "Przykładowe oferty" })
    : null;

  /* ---------- pole kropek w sekcji ofert ----------
     Kropki gęstnieją tam, gdzie stoją karty ofert – „układają się” w karty.
     Rozmieszczenie jest deterministyczne, żeby nie migało przy zmianie rozmiaru. */
  const field = document.querySelector("[data-dot-field]");
  const grid = document.querySelector("[data-offer-grid]");
  if (field && grid) {
    const fctx = field.getContext("2d");
    const hash = (x, y) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };

    function drawField() {
      const host = field.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      field.width = Math.round(host.width * dpr);
      field.height = Math.round(host.height * dpr);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.clearRect(0, 0, host.width, host.height);

      // W karuzeli kropki gęstnieją wokół miejsca karty środkowej (stały „reflektor”);
      // bez karuzeli – wokół każdej karty siatki.
      let cards;
      if (carousel) {
        const f = carousel.frame.getBoundingClientRect();
        const s = carousel.list.getBoundingClientRect();
        const w = grid.children[0].offsetWidth;
        const cx = f.left + f.width / 2 - host.left;
        cards = [{ l: cx - w / 2, t: s.top - host.top, r: cx + w / 2, b: s.bottom - host.top }];
      } else {
        cards = [...grid.children].map((c) => {
          const r = c.getBoundingClientRect();
          return { l: r.left - host.left, t: r.top - host.top, r: r.right - host.left, b: r.bottom - host.top };
        });
      }
      const step = isMobile() ? 18 : 14;
      const halo = isMobile() ? 18 : 28;

      fctx.fillStyle = CYAN;
      fctx.beginPath();
      for (let y = step / 2; y < host.height; y += step) {
        for (let x = step / 2; x < host.width; x += step) {
          // odległość do najbliższej karty
          let dist = Infinity;
          for (const c of cards) {
            const dx = Math.max(c.l - x, 0, x - c.r);
            const dy = Math.max(c.t - y, 0, y - c.b);
            dist = Math.min(dist, Math.hypot(dx, dy));
          }
          if (dist === 0) continue; // pod kartą kropek nie widać
          const near = Math.max(0, 1 - dist / halo);           // obrys karty
          const ambient = hash(x, y) < 0.09 ? 0.35 : 0;        // rozproszone „pojedyncze” kropki
          const k = Math.max(near, ambient);
          if (k <= 0) continue;
          const r = (0.6 + 1.6 * k) * (isMobile() ? 0.9 : 1);
          fctx.moveTo(x + r, y);
          fctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      fctx.globalAlpha = 0.5;
      fctx.fill();
      fctx.globalAlpha = 1;
    }

    let ft;
    const schedule = () => { clearTimeout(ft); ft = setTimeout(drawField, 150); };
    window.addEventListener("resize", schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawField);
    window.addEventListener("load", drawField);
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(grid);
    document.addEventListener("cf:layout", schedule);
  }
})();
