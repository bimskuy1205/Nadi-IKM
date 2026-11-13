/**
 * NADI-IKM 3D Product Lab - WebGL Interactive Digital Twin
 * Features:
 * - 360° OrbitControls with smooth damping
 * - Exploded view displacement animation (0 - 100%)
 * - X-Ray / Housing transparency toggle
 * - Hotspot raycasting & camera focus
 * - Procedural PBR materials & industrial details
 */

class NadiDeviceViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      explodedProgress: 0,
      isXray: false,
      autoRotate: false
    }, options);

    this.parts = {};
    this.hotspots = [];
    this.selectedPart = null;
    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A1F2E); // Midnight Navy
    this.scene.fog = new THREE.FogExp2(0x0A1F2E, 0.04);

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(4.5, 3.8, 5.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 12;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip below ground
    this.controls.autoRotate = this.options.autoRotate;
    this.controls.autoRotateSpeed = 1.2;

    // Lighting
    this.setupLighting();

    // Ground Grid & Studio pedestal
    this.setupGround();

    // Build Industrial Sensor Node Model
    this.buildDeviceModel();

    // Raycaster for interactions
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));

    // Animation Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    // Key Light (Clean White / Industrial)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);

    // Fill Light (Teal tone)
    const fillLight = new THREE.DirectionalLight(0x0DB3A6, 0.8);
    fillLight.position.set(-6, 3, -4);
    this.scene.add(fillLight);

    // Rim / Cyan Highlight Light
    const rimLight = new THREE.PointLight(0x59D8D1, 1.2, 10);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);

    // Safety Amber Accent Light
    const amberAccent = new THREE.PointLight(0xF0A444, 0.7, 8);
    amberAccent.position.set(3, 1, 3);
    this.scene.add(amberAccent);
  }

  setupGround() {
    // Industrial Circular Base Platform
    const pedestalGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.15, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x112738,
      roughness: 0.8,
      metalness: 0.3
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.1;
    pedestal.receiveShadow = true;
    this.scene.add(pedestal);

    // Subtle Grid Rings
    const ringGeo = new THREE.RingGeometry(1.8, 1.83, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0DB3A6, opacity: 0.3, transparent: true, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -1.02;
    this.scene.add(ringMesh);

    const outerRingGeo = new THREE.RingGeometry(3.2, 3.23, 64);
    const outerRingMesh = new THREE.Mesh(outerRingGeo, ringMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = -1.02;
    this.scene.add(outerRingMesh);
  }

  buildDeviceModel() {
    this.deviceGroup = new THREE.Group();
    this.scene.add(this.deviceGroup);

    // Materials Palette
    this.matEnclosure = new THREE.MeshPhysicalMaterial({
      color: 0x173447, // Deep Steel / Polycarbonate
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.2, // Frosted plastic feel
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.5,
      clearcoat: 0.3
    });

    this.matPCB = new THREE.MeshStandardMaterial({
      color: 0x0E4435, // Industrial Forest PCB
      roughness: 0.4,
      metalness: 0.2
    });

    this.matGold = new THREE.MeshStandardMaterial({
      color: 0xF4D35E,
      roughness: 0.3,
      metalness: 0.9
    });

    this.matSilver = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.25,
      metalness: 0.95
    });

    this.matTeal = new THREE.MeshStandardMaterial({
      color: 0x0DB3A6,
      roughness: 0.3,
      metalness: 0.4
    });

    this.matAmber = new THREE.MeshStandardMaterial({
      color: 0xF0A444,
      emissive: 0xF0A444,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });

    this.matCyanLed = new THREE.MeshBasicMaterial({
      color: 0x59D8D1
    });

    this.matDarkMetal = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.4,
      metalness: 0.8
    });

    // 1. BASE MOUNTING STUD & MAGNET (Bottom-most)
    const baseGroup = new THREE.Group();
    const magnetBaseGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.25, 32);
    const magnetBase = new THREE.Mesh(magnetBaseGeo, this.matDarkMetal);
    magnetBase.castShadow = true;
    magnetBase.receiveShadow = true;
    baseGroup.add(magnetBase);

    // M8 Stud Thread representation
    const studGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.45, 16);
    const stud = new THREE.Mesh(studGeo, this.matSilver);
    stud.position.y = -0.3;
    baseGroup.add(stud);

    // Neodymium Ring pads
    const neoPadGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.05, 32);
    const neoPad = new THREE.Mesh(neoPadGeo, this.matGold);
    neoPad.position.y = -0.13;
    baseGroup.add(neoPad);

    baseGroup.position.set(0, -0.65, 0);
    this.parts.mount = {
      group: baseGroup,
      basePos: baseGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -1.2, 0),
      id: 'mount',
      nameKey: 'partMount'
    };
    this.deviceGroup.add(baseGroup);

    // 2. LOWER HOUSING CHASSIS
    const lowerHousingGroup = new THREE.Group();
    const lowerGeo = new THREE.CylinderGeometry(1.05, 0.95, 0.4, 32);
    const lowerMesh = new THREE.Mesh(lowerGeo, this.matDarkMetal);
    lowerMesh.castShadow = true;
    lowerMesh.receiveShadow = true;
    lowerHousingGroup.add(lowerMesh);

    // Cooling ribs around lower housing
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const ribGeo = new THREE.BoxGeometry(0.06, 0.35, 0.12);
      const rib = new THREE.Mesh(ribGeo, this.matSilver);
      rib.position.set(Math.cos(angle) * 1.02, 0, Math.sin(angle) * 1.02);
      rib.rotation.y = -angle;
      lowerHousingGroup.add(rib);
    }

    lowerHousingGroup.position.set(0, -0.35, 0);
    this.parts.chassis = {
      group: lowerHousingGroup,
      basePos: lowerHousingGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -0.6, 0),
      id: 'chassis',
      nameKey: 'partEnclosure'
    };
    this.deviceGroup.add(lowerHousingGroup);

    // 3. POWER & PROTECTION STAGE (Buck converter, TVS Diode, Fuse, Terminal)
    const powerGroup = new THREE.Group();
    const powerPcbGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.06, 32);
    const powerPcb = new THREE.Mesh(powerPcbGeo, this.matPCB);
    powerGroup.add(powerPcb);

    // Choke coil / Inductor
    const inductorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
    const inductor = new THREE.Mesh(inductorGeo, this.matDarkMetal);
    inductor.position.set(-0.35, 0.1, -0.2);
    powerGroup.add(inductor);

    // Industrial Solid Capacitors
    for (let j = 0; j < 3; j++) {
      const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16);
      const cap = new THREE.Mesh(capGeo, this.matSilver);
      cap.position.set(-0.15 + (j * 0.22), 0.13, -0.4);
      powerGroup.add(cap);
    }

    // Terminal Screw Connector
    const termGeo = new THREE.BoxGeometry(0.4, 0.22, 0.25);
    const term = new THREE.Mesh(termGeo, this.matTeal);
    term.position.set(0.4, 0.13, 0.3);
    powerGroup.add(term);

    powerGroup.position.set(0, -0.05, 0);
    this.parts.power = {
      group: powerGroup,
      basePos: powerGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -0.15, 0),
      id: 'power',
      nameKey: 'partPower'
    };
    this.deviceGroup.add(powerGroup);

    // 4. MEMS ACCELEROMETER & THERMAL RTD INTERFACE
    const sensorGroup = new THREE.Group();
    const sensorPlateGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.05, 32);
    const sensorPlate = new THREE.Mesh(sensorPlateGeo, this.matPCB);
    sensorGroup.add(sensorPlate);

    // Triaxial MEMS Accelerometer IC (Gold / Metallic QFN package)
    const memsGeo = new THREE.BoxGeometry(0.24, 0.08, 0.24);
    const mems = new THREE.Mesh(memsGeo, this.matGold);
    mems.position.set(0, 0.06, 0);
    mems.castShadow = true;
    sensorGroup.add(mems);

    // Decoupling Acoustic Pad
    const decoupleGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 24);
    const decouple = new THREE.Mesh(decoupleGeo, this.matSilver);
    decouple.position.set(0, 0.02, 0);
    sensorGroup.add(decouple);

    // Temperature RTD Probe Cable Lead out of the side
    const probeWireGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
    const probeWire = new THREE.Mesh(probeWireGeo, this.matAmber);
    probeWire.rotation.z = Math.PI / 2;
    probeWire.position.set(0.7, 0.05, -0.2);
    sensorGroup.add(probeWire);

    // Stainless Steel RTD Probe Head
    const probeHeadGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
    const probeHead = new THREE.Mesh(probeHeadGeo, this.matSilver);
    probeHead.rotation.z = Math.PI / 2;
    probeHead.position.set(1.2, 0.05, -0.2);
    sensorGroup.add(probeHead);

    sensorGroup.position.set(0, 0.18, 0);
    this.parts.sensor = {
      group: sensorGroup,
      basePos: sensorGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 0.35, 0),
      id: 'sensor',
      nameKey: 'partMems'
    };
    this.deviceGroup.add(sensorGroup);

    // 5. MAIN EDGE PROCESSING BOARD (ESP32-S3 + DSP Engine)
    const espGroup = new THREE.Group();
    const mainPcbGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.06, 32);
    const mainPcb = new THREE.Mesh(mainPcbGeo, this.matPCB);
    espGroup.add(mainPcb);

    // ESP32-S3 SoC Shield (Metallic Silver rectangular can)
    const espCanGeo = new THREE.BoxGeometry(0.48, 0.1, 0.55);
    const espCan = new THREE.Mesh(espCanGeo, this.matSilver);
    espCan.position.set(-0.15, 0.08, 0);
    espCan.castShadow = true;
    espGroup.add(espCan);

    // Microstrip Antenna Trace / Ceramic Resonator
    const antGeo = new THREE.BoxGeometry(0.12, 0.04, 0.35);
    const ant = new THREE.Mesh(antGeo, this.matGold);
    ant.position.set(0.28, 0.06, 0);
    espGroup.add(ant);

    // Signal Conditioning Op-Amps & Passive ICs
    for (let k = 0; k < 4; k++) {
      const icGeo = new THREE.BoxGeometry(0.1, 0.04, 0.12);
      const ic = new THREE.Mesh(icGeo, this.matDarkMetal);
      ic.position.set(0.15, 0.06, -0.3 + (k * 0.2));
      espGroup.add(ic);
    }

    espGroup.position.set(0, 0.42, 0);
    this.parts.esp = {
      group: espGroup,
      basePos: espGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 0.8, 0),
      id: 'esp',
      nameKey: 'partEsp'
    };
    this.deviceGroup.add(espGroup);

    // 6. TOP POLYCARBONATE ENCLOSURE & STATUS RING
    const topEnclosureGroup = new THREE.Group();
    // Beveled cylindrical dome housing
    const domeGeo = new THREE.CylinderGeometry(0.95, 1.08, 0.5, 32);
    this.topEnclosureMesh = new THREE.Mesh(domeGeo, this.matEnclosure);
    this.topEnclosureMesh.castShadow = true;
    topEnclosureGroup.add(this.topEnclosureMesh);

    // Top Dome Cap
    const domeCapGeo = new THREE.SphereGeometry(0.95, 32, 16, 0, Math.PI * 2, 0, Math.PI / 4);
    const domeCap = new THREE.Mesh(domeCapGeo, this.matEnclosure);
    domeCap.position.y = 0.24;
    topEnclosureGroup.add(domeCap);

    // 360° Optical Pulse Status Ring (Illumination)
    const statusRingGeo = new THREE.TorusGeometry(0.72, 0.04, 16, 48);
    this.statusRingMesh = new THREE.Mesh(statusRingGeo, this.matAmber);
    this.statusRingMesh.rotation.x = Math.PI / 2;
    this.statusRingMesh.position.y = 0.28;
    topEnclosureGroup.add(this.statusRingMesh);

    // NADI-IKM Monogram Emblem Badge on top
    const badgeGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.03, 32);
    const badge = new THREE.Mesh(badgeGeo, this.matDarkMetal);
    badge.position.y = 0.35;
    topEnclosureGroup.add(badge);

    const emblemPulseGeo = new THREE.BoxGeometry(0.24, 0.02, 0.05);
    const emblemPulse = new THREE.Mesh(emblemPulseGeo, this.matTeal);
    emblemPulse.position.y = 0.37;
    topEnclosureGroup.add(emblemPulse);

    topEnclosureGroup.position.set(0, 0.82, 0);
    this.parts.enclosure = {
      group: topEnclosureGroup,
      basePos: topEnclosureGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 1.45, 0),
      id: 'enclosure',
      nameKey: 'partEnclosure'
    };
    this.deviceGroup.add(topEnclosureGroup);

    // Center pivot slightly
    this.deviceGroup.position.y = 0.1;

    // Build Hotspots in DOM
    this.createDomHotspots();
  }

  createDomHotspots() {
    this.hotspotDefs = [
      { id: 'enclosure', num: '1', titleKey: 'partEnclosure', descKey: 'partEnclosureDesc', targetGroup: this.parts.enclosure },
      { id: 'esp', num: '2', titleKey: 'partEsp', descKey: 'partEspDesc', targetGroup: this.parts.esp },
      { id: 'sensor', num: '3', titleKey: 'partMems', descKey: 'partMemsDesc', targetGroup: this.parts.sensor },
      { id: 'power', num: '4', titleKey: 'partPower', descKey: 'partPowerDesc', targetGroup: this.parts.power },
      { id: 'mount', num: '5', titleKey: 'partMount', descKey: 'partMountDesc', targetGroup: this.parts.mount }
    ];

    // Overlay container
    let overlay = this.container.querySelector('.hotspot-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'hotspot-overlay absolute inset-0 pointer-events-none overflow-hidden';
      this.container.appendChild(overlay);
    }
    overlay.innerHTML = '';

    this.hotspotElements = this.hotspotDefs.map(def => {
      const el = document.createElement('button');
      el.className = 'absolute pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-industrial-teal/90 text-white font-mono text-xs font-bold shadow-lg border border-signal-cyan/50 backdrop-blur hover:scale-125 transition-transform duration-200 focus:outline-none';
      el.innerHTML = `<span>${def.num}</span>`;
      el.title = def.id;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectPart(def.id);
      });

      overlay.appendChild(el);
      return { def, el };
    });
  }

  updateHotspotsPositions() {
    if (!this.hotspotElements) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.hotspotElements.forEach(item => {
      const targetGroup = item.def.targetGroup.group;
      const worldPos = new THREE.Vector3();
      targetGroup.getWorldPosition(worldPos);

      // Offset hotspot outward slightly
      worldPos.x += 1.1;

      worldPos.project(this.camera);

      // Check if behind camera
      if (worldPos.z > 1) {
        item.el.style.display = 'none';
        return;
      }

      item.el.style.display = 'flex';
      const x = (worldPos.x * 0.5 + 0.5) * width;
      const y = (-(worldPos.y * 0.5) + 0.5) * height;

      item.el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
    });
  }

  setExploded(progress) {
    this.options.explodedProgress = Math.max(0, Math.min(1, progress));
    for (const key in this.parts) {
      const part = this.parts[key];
      part.group.position.copy(part.basePos).addScaledVector(part.explodeVec, this.options.explodedProgress);
    }
  }

  setXray(enabled) {
    this.options.isXray = enabled;
    if (this.matEnclosure) {
      this.matEnclosure.opacity = enabled ? 0.22 : 0.95;
      this.matEnclosure.transmission = enabled ? 0.9 : 0.2;
      this.matEnclosure.wireframe = false;
      this.matEnclosure.needsUpdate = true;
    }
  }

  resetView() {
    gsap.to(this.camera.position, {
      x: 4.5,
      y: 3.8,
      z: 5.5,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => this.controls.update()
    });
    this.setExploded(0);
  }

  setView(viewType) {
    let targetPos = { x: 4.5, y: 3.8, z: 5.5 };
    if (viewType === 'iso') {
      targetPos = { x: 4.5, y: 4.2, z: 4.5 };
    } else if (viewType === 'top') {
      targetPos = { x: 0.01, y: 8.5, z: 0.01 };
    } else if (viewType === 'side') {
      targetPos = { x: 7.5, y: 0.5, z: 0 };
    }

    if (window.gsap) {
      gsap.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => this.controls.update()
      });
    } else {
      this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      this.controls.update();
    }
  }

  selectPart(partId) {
    this.selectedPart = partId;
    const def = this.hotspotDefs.find(d => d.id === partId);
    if (!def) return;

    // Trigger custom event for DOM info card
    const lang = currentLang || 'id';
    const title = translations[lang][def.titleKey] || def.id;
    const desc = translations[lang][def.descKey] || '';

    window.dispatchEvent(new CustomEvent('partSelected', {
      detail: {
        id: partId,
        title,
        desc,
        num: def.num
      }
    }));

    // Focus camera slightly towards part
    const worldPos = new THREE.Vector3();
    def.targetGroup.group.getWorldPosition(worldPos);

    if (window.gsap) {
      gsap.to(this.controls.target, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();

    // Subtle breathing pulse on LED Status Ring
    if (this.statusRingMesh) {
      const t = this.clock.getElapsedTime();
      const pulse = 0.5 + Math.sin(t * 3.5) * 0.4;
      this.matAmber.emissiveIntensity = pulse;
    }

    this.controls.update();
    this.updateHotspotsPositions();
    this.renderer.render(this.scene, this.camera);
  }
}

// Global hook
window.NadiDeviceViewer = NadiDeviceViewer;
