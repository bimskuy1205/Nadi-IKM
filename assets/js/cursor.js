/**
 * NADI-IKM: Sigma Retro-Industrial Holographic Cursor, Click Shockwaves & Scroll FX Engine
 * Features:
 * 1. Multi-ring tactical CAD reticle + diamond outer lock-on frame + live cursor HUD tag
 * 2. Constellation neon particle trail + expanding sonar shockwave rings on click
 * 3. Top laser scroll progress bar + live scroll percentage telemetry
 * 4. Interactive card spotlight tracking (--mouse-x, --mouse-y) & scroll-reveal observer
 */

(function initSigmaCursorAndScrollFX() {
  // 1. Create Cursor & Scroll HUD Elements
  if (!document.getElementById('scroll-laser-bar')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-laser-bar';
    document.body.appendChild(bar);
  }

  if (!document.getElementById('cursor-dot')) {
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }

  if (!document.getElementById('cursor-reticle')) {
    const reticle = document.createElement('div');
    reticle.id = 'cursor-reticle';
    document.body.appendChild(reticle);
  }

  if (!document.getElementById('cursor-outer-ring')) {
    const outer = document.createElement('div');
    outer.id = 'cursor-outer-ring';
    document.body.appendChild(outer);
  }

  if (!document.getElementById('cursor-hud-tag')) {
    const tag = document.createElement('div');
    tag.id = 'cursor-hud-tag';
    tag.innerText = 'CAD // 0000:0000';
    document.body.appendChild(tag);
  }

  if (!document.getElementById('eng-hud-badge')) {
    const hud = document.createElement('div');
    hud.id = 'eng-hud-badge';
    hud.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span id="hud-coords">X:0000 Y:0000</span>
      <span class="text-slate-500">|</span>
      <span id="hud-scroll-pct" class="text-amber-400">SCROLL: 00%</span>
      <span class="text-slate-500">|</span>
      <span class="text-cyan-300">HOLO-CAD: 2.048 kS/s</span>
    `;
    document.body.appendChild(hud);
  }

  // 2. Full-Viewport Canvas for Constellation Trail & Click Shockwaves
  const fxCanvas = document.createElement('canvas');
  fxCanvas.id = 'cursor-trail-canvas';
  fxCanvas.style.position = 'fixed';
  fxCanvas.style.top = '0';
  fxCanvas.style.left = '0';
  fxCanvas.style.width = '100vw';
  fxCanvas.style.height = '100vh';
  fxCanvas.style.pointerEvents = 'none';
  fxCanvas.style.zIndex = '9997';
  document.body.appendChild(fxCanvas);

  const ctx = fxCanvas.getContext('2d');
  let width = (fxCanvas.width = window.innerWidth);
  let height = (fxCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = fxCanvas.width = window.innerWidth;
    height = fxCanvas.height = window.innerHeight;
  });

  // State
  const palette = ['#00F2FE', '#FFA834', '#00FF87', '#FF2E93'];
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
  let reticlePos = { x: width / 2, y: height / 2 };
  let outerPos = { x: width / 2, y: height / 2 };
  let angleDeg = 0;
  let isHovering = false;

  const particles = [];
  const shockwaves = [];

  const dot = document.getElementById('cursor-dot');
  const reticle = document.getElementById('cursor-reticle');
  const outerRing = document.getElementById('cursor-outer-ring');
  const hudTag = document.getElementById('cursor-hud-tag');
  const coordsLabel = document.getElementById('hud-coords');
  const scrollLabel = document.getElementById('hud-scroll-pct');
  const laserBar = document.getElementById('scroll-laser-bar');

  // Mouse Move Handler
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    // Spawn glowing holographic trail particles
    if (particles.length < 48) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        size: Math.random() * 3.2 + 1.4,
        alpha: 0.9,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }

    const xStr = String(e.clientX).padStart(4, '0');
    const yStr = String(e.clientY).padStart(4, '0');
    if (coordsLabel) coordsLabel.innerText = `X:${xStr} Y:${yStr}`;
    if (hudTag) {
      hudTag.innerText = isHovering ? `LOCK-ON // [${xStr}:${yStr}]` : `HOLO // ${xStr}:${yStr}`;
    }

    // Spotlight tracking inside .retro-card and .glass-card
    const card = e.target.closest('.retro-card, .glass-card');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }
  });

  // Click Sonar Shockwave Handler
  window.addEventListener('mousedown', (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 8,
      maxRadius: 95,
      alpha: 0.95,
      color: '#00F2FE',
      secondaryColor: '#FFA834'
    });
    // Burst of 10 particles on click
    for (let i = 0; i < 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(ang) * (2.5 + Math.random() * 2),
        vy: Math.sin(ang) * (2.5 + Math.random() * 2),
        size: 3.5,
        alpha: 1.0,
        color: i % 2 === 0 ? '#00F2FE' : '#FFA834'
      });
    }
  });

  // Scroll Progress & Parallax Handler
  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
    if (laserBar) laserBar.style.width = `${pct}%`;
    if (scrollLabel) scrollLabel.innerText = `SCROLL: ${String(Math.round(pct)).padStart(2, '0')}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // Interactive Hover Lock-On Binding
  function bindInteractiveTargets() {
    const targets = document.querySelectorAll('a, button, input, select, textarea, .retro-card, .glass-card, .hotspot-btn, canvas');
    targets.forEach((el) => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        isHovering = false;
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // Scroll-Reveal Intersection Observer for Smooth Entrance FX
  function initScrollReveal() {
    const revealTargets = document.querySelectorAll('.retro-card, .glass-card, section h2, .layman-pill');
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    revealTargets.forEach((el) => {
      if (!el.classList.contains('reveal-on-scroll')) {
        el.classList.add('reveal-on-scroll');
      }
      io.observe(el);
    });
  }

  // Main Animation Loop
  function render() {
    angleDeg = (angleDeg + 1.1) % 360;

    mouse.x += (mouse.targetX - mouse.x) * 0.5;
    mouse.y += (mouse.targetY - mouse.y) * 0.5;

    reticlePos.x += (mouse.targetX - reticlePos.x) * 0.22;
    reticlePos.y += (mouse.targetY - reticlePos.y) * 0.22;

    outerPos.x += (mouse.targetX - outerPos.x) * 0.12;
    outerPos.y += (mouse.targetY - outerPos.y) * 0.12;

    if (dot) dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    if (reticle) reticle.style.transform = `translate3d(${reticlePos.x}px, ${reticlePos.y}px, 0) rotate(${angleDeg}deg)`;
    if (outerRing) outerRing.style.transform = `translate3d(${outerPos.x}px, ${outerPos.y}px, 0) rotate(${isHovering ? 0 : 45 - angleDeg * 0.5}deg)`;
    if (hudTag) hudTag.style.transform = `translate3d(${reticlePos.x + 26}px, ${reticlePos.y + 22}px, 0)`;

    ctx.clearRect(0, 0, width, height);

    // Draw Constellation Particles & Connecting Filaments
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.024;
      p.size *= 0.965;

      if (p.alpha <= 0 || p.size <= 0.25) {
        particles.splice(i, 1);
        continue;
      }

      // Connect nearby particles with subtle cyan hologram lines
      if (i > 0) {
        const prev = particles[i - 1];
        const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
        if (dist < 48) {
          ctx.save();
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(prev.x, prev.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw Click Sonar Shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += 4.2;
      sw.alpha -= 0.038;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(s, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = sw.color;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = sw.secondaryColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('DOMContentLoaded', () => {
    bindInteractiveTargets();
    initScrollReveal();
    updateScrollProgress();
    render();
  });

  const observer = new MutationObserver(() => {
    bindInteractiveTargets();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
