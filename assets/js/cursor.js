/**
 * NADI-IKM Engineering Interactive Cursor & HUD Tracker
 * Creates a tactical crosshair reticle, real-time coordinate tracker,
 * and a glowing neon particle trail behind cursor motion.
 */

(function initEngineeringCursor() {
  // Create DOM Elements if not present
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

  if (!document.getElementById('eng-hud-badge')) {
    const hud = document.createElement('div');
    hud.id = 'eng-hud-badge';
    hud.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span id="hud-coords">X:0000 Y:0000</span>
      <span class="text-slate-500">|</span>
      <span class="text-amber-400">EDGE-DSP: 2.048 kS/s</span>
    `;
    document.body.appendChild(hud);
  }

  // Particle Canvas for Glowing Wake
  const particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'cursor-trail-canvas';
  particleCanvas.style.position = 'fixed';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100vw';
  particleCanvas.style.height = '100vh';
  particleCanvas.style.pointerEvents = 'none';
  particleCanvas.style.zIndex = '9998';
  document.body.appendChild(particleCanvas);

  const ctx = particleCanvas.getContext('2d');
  let width = (particleCanvas.width = window.innerWidth);
  let height = (particleCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = particleCanvas.width = window.innerWidth;
    height = particleCanvas.height = window.innerHeight;
  });

  // State
  let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, isMoving: false };
  let reticlePos = { x: width / 2, y: height / 2 };
  const particles = [];
  const dot = document.getElementById('cursor-dot');
  const reticle = document.getElementById('cursor-reticle');
  const coordsLabel = document.getElementById('hud-coords');

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isMoving = true;

    // Spawn 1-2 glowing trail particles
    if (Math.random() > 0.3) {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1.5,
        alpha: 0.8,
        color: Math.random() > 0.4 ? '#00F2FE' : '#FFA834' // Cyan or Plasma Amber
      });
    }

    if (coordsLabel) {
      coordsLabel.innerText = `X:${String(e.clientX).padStart(4, '0')} Y:${String(e.clientY).padStart(4, '0')}`;
    }
  });

  // Hover detection for magnetic lock-on feel
  const updateInteractiveTargets = () => {
    const targets = document.querySelectorAll('a, button, input, select, .retro-card, .hotspot-btn, canvas');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };

  // Animation Loop
  function render() {
    // Smooth lerp for dot and reticle
    mouse.x += (mouse.targetX - mouse.x) * 0.45;
    mouse.y += (mouse.targetY - mouse.y) * 0.45;

    reticlePos.x += (mouse.targetX - reticlePos.x) * 0.18;
    reticlePos.y += (mouse.targetY - reticlePos.y) * 0.18;

    if (dot) dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    if (reticle) reticle.style.transform = `translate3d(${reticlePos.x}px, ${reticlePos.y}px, 0)`;

    // Draw particle trail
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      p.size *= 0.96;

      if (p.alpha <= 0 || p.size <= 0.2) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('DOMContentLoaded', () => {
    updateInteractiveTargets();
    render();
  });

  // Re-bind targets when DOM updates
  const observer = new MutationObserver(() => updateInteractiveTargets());
  observer.observe(document.body, { childList: true, subtree: true });
})();
