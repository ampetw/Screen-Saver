(() => {
  const host = document.getElementById("glyphs");
  if (!host) return;

  const glyphs = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let last = performance.now();

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function setVar(el, name, value) {
    el.style.setProperty(name, value);
  }

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const GLASS_COLORS = [
    "rgba(186, 232, 197, 0.58)",
    "rgba(255, 248, 176, 0.58)",
    "rgba(255, 212, 170, 0.58)",
  ];

  function createGlyph(letter) {
    const el = document.createElement("div");
    el.className = "glyph";
    el.textContent = letter;

    const fs = rand(42, 120) * dpr;
    const x = rand(0, Math.max(1, w - fs));
    const y = rand(0, Math.max(1, h - fs));
    const speed = rand(60, 190) * dpr;
    const dir = rand(0, Math.PI * 2);

    const g = {
      el,
      x,
      y,
      vx: Math.cos(dir) * speed,
      vy: Math.sin(dir) * speed,
      fs,
    };

    el.style.setProperty("--glyph-color", GLASS_COLORS[(Math.random() * GLASS_COLORS.length) | 0]);
    setVar(el, "--fs", `${fs}px`);
    setVar(el, "--x", `${x}px`);
    setVar(el, "--y", `${y}px`);

    host.appendChild(el);
    glyphs.push(g);
  }

  function clearGlyphs() {
    glyphs.length = 0;
    host.textContent = "";
  }

  function layout() {
    const rect = host.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);

    clearGlyphs();

    const area = w * h;
    const target = Math.max(80, Math.min(320, Math.floor(area / 9000)));
    for (let i = 0; i < target; i++) createGlyph(ALPHABET[i % 26]);

    // background is handled in CSS
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    for (const g of glyphs) {
      const bw = g.fs * 0.72;
      const bh = g.fs * 0.95;

      g.x += g.vx * dt;
      g.y += g.vy * dt;

      if (g.x <= 0) {
        g.x = 0;
        g.vx = Math.abs(g.vx);
      } else if (g.x + bw >= w) {
        g.x = w - bw;
        g.vx = -Math.abs(g.vx);
      }

      if (g.y <= 0) {
        g.y = 0;
        g.vy = Math.abs(g.vy);
      } else if (g.y + bh >= h) {
        g.y = h - bh;
        g.vy = -Math.abs(g.vy);
      }

      setVar(g.el, "--x", `${g.x}px`);
      setVar(g.el, "--y", `${g.y}px`);
    }

    requestAnimationFrame(tick);
  }

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(layout, 80);
    },
    { passive: true }
  );

  layout();
  requestAnimationFrame(tick);
})();

