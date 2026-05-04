(() => {
  const canvas = document.getElementById("kaleido");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) return;

  let w = 1;
  let h = 1;
  let dpr = 1;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = Math.max(1, canvas.clientWidth || window.innerWidth || 1);
    const cssH = Math.max(1, canvas.clientHeight || window.innerHeight || 1);
    w = Math.floor(cssW * dpr);
    h = Math.floor(cssH * dpr);
    canvas.width = w;
    canvas.height = h;
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function draw(now) {
    const t = now * 0.0001;
    const cOrange = cssVar("--g-orange", "orange");
    const cOrangeRed = cssVar("--g-orangered", "orangered");
    const cYellow = cssVar("--g-yellow", "#ffe14a");
    const cGreen = cssVar("--g-green", "#20e36b");
    const cGreenBlue = cssVar("--g-greenblue", "#00c6b8");

    const angle = t * 1.2;
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    const diag = Math.hypot(w, h);
    const ax = w * 0.5 + vx * diag * 0.35;
    const ay = h * 0.5 + vy * diag * 0.35;
    const bx = w * 0.5 - vx * diag * 0.35;
    const by = h * 0.5 - vy * diag * 0.35;

    const g = ctx.createLinearGradient(ax, ay, bx, by);
    const s1 = (Math.sin(t * 1.3) * 0.5 + 0.5) * 0.12;
    const s2 = (Math.sin(t * 0.9 + 1.2) * 0.5 + 0.5) * 0.12;
    g.addColorStop(0.0, cOrange);
    g.addColorStop(0.18 + s1, cOrangeRed);
    g.addColorStop(0.42, cYellow);
    g.addColorStop(0.68 - s2, cGreen);
    g.addColorStop(1.0, cGreenBlue);

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Soft moving highlights for depth
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.35;
    const hx = (Math.sin(t * 1.7) * 0.5 + 0.5) * w;
    const hy = (Math.cos(t * 1.3) * 0.5 + 0.5) * h;
    const r1 = Math.min(w, h) * 0.15;
    const r2 = Math.max(w, h) * 0.75;
    const glow = ctx.createRadialGradient(hx, hy, r1, hx, hy, r2);
    glow.addColorStop(0, "rgba(255,255,255,0.6)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    requestAnimationFrame(draw);
  }

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 60);
    },
    { passive: true }
  );

  resize();
  requestAnimationFrame(draw);
})();

