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

      const cards = [...grid.children].map((c) => {
        const r = c.getBoundingClientRect();
        return { l: r.left - host.left, t: r.top - host.top, r: r.right - host.left, b: r.bottom - host.top };
      });
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
  }
})();
