/**
 * NADI-IKM 3D Digital Twin - Masterpiece Engineering Edition
 * High-precision procedural industrial CAD assembly with:
 * - CNC machined finishes, heat sink fins, Allen socket screws
 * - Anodized 6061-T6 aluminum, gold PCB traces, coiled cable strain relief
 * - 360° OrbitControls, smooth Exploded View slider (0-100%)
 * - Sub-assembly isolation mode, X-Ray transparency, dynamic laser grid
 * - Direct component inspection HUD synchronization
 */

class NadiDeviceViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      explodedProgress: 0,
      isXray: false,
      autoRotate: false,
      isolatedPart: null
    }, options);

    this.parts = {};
    this.hotspotDefs = [];
    this.selectedPart = null;
    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 550;

    // Scene & Deep Retro Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050B11); // Deep Obsidian
    this.scene.fog = new THREE.FogExp2(0x050B11, 0.035);

    // Camera with Engineering Ortho/Perspective Feel
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(4.8, 3.6, 5.8);

    // High Fidelity PBR Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 14;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15;
    this.controls.autoRotate = this.options.autoRotate;
    this.controls.autoRotateSpeed = 1.4;

    this.setupStudioLighting();
    this.setupEngineeringGrid();
    this.buildMasterpieceModel();
    this.setupLaserScanner();

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('resize', this.onResize.bind(this));
    this.clock = new THREE.Clock();
    this.animate();
  }

  setupStudioLighting() {
    // Ambient fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(ambient);

    // Key Light - Clean surgical white
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    keyLight.position.set(6, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    // Rim Light - Vivid Electric Cyan (#00F2FE)
    const rimCyan = new THREE.PointLight(0x00F2FE, 2.2, 14);
    rimCyan.position.set(-6, 4, -5);
    this.scene.add(rimCyan);

    // Underbelly Fill - Warm Plasma Amber (#FFA834)
    const amberFill = new THREE.PointLight(0xFFA834, 1.8, 10);
    amberFill.position.set(4, -1, 3);
    this.scene.add(amberFill);

    // Top Halo Light
    const topHalo = new THREE.SpotLight(0x05D5C5, 2.5, 12, Math.PI / 4, 0.3);
    topHalo.position.set(0, 7, 0);
    this.scene.add(topHalo);
  }

  setupEngineeringGrid() {
    // Rotating concentric calibration rings
    this.gridGroup = new THREE.Group();
    this.scene.add(this.gridGroup);

    // Machined Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.18, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x08131C,
      roughness: 0.85,
      metalness: 0.4
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.2;
    pedestal.receiveShadow = true;
    this.gridGroup.add(pedestal);

    // Concentric Neon Calibration Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    const innerRing = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.62, 64), ringMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = -1.1;
    this.gridGroup.add(innerRing);

    const outerRing = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.12, 64), ringMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = -1.1;
    this.gridGroup.add(outerRing);

    // Radial Compass Ticks
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const tickGeo = new THREE.BoxGeometry(0.04, 0.02, i % 6 === 0 ? 0.35 : 0.18);
      const tickMat = new THREE.MeshBasicMaterial({
        color: i % 6 === 0 ? 0xFFA834 : 0x00F2FE,
        transparent: true,
        opacity: 0.6
      });
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(Math.cos(angle) * 3.1, -1.09, Math.sin(angle) * 3.1);
      tick.rotation.y = -angle;
      this.gridGroup.add(tick);
    }
  }

  setupLaserScanner() {
    // Dynamic Laser Scanner Plane
    const laserGeo = new THREE.RingGeometry(0.1, 3.4, 64);
    this.laserMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide
    });
    this.laserDisc = new THREE.Mesh(laserGeo, this.laserMat);
    this.laserDisc.rotation.x = -Math.PI / 2;
    this.laserDisc.position.y = -0.5;
    this.scene.add(this.laserDisc);

    // ==========================================
    // 3D HOLOGRAPHIC PROJECTION SYSTEM (AURA & ORBITS)
    // ==========================================
    this.holoGroup = new THREE.Group();
    this.scene.add(this.holoGroup);

    // 1. Volumetric Upward Hologram Projector Beam Cone
    const coneGeo = new THREE.ConeGeometry(2.8, 3.8, 48, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      transparent: true,
      opacity: 0.055,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.holoCone = new THREE.Mesh(coneGeo, coneMat);
    this.holoCone.position.y = 0.75;
    this.holoCone.rotation.x = Math.PI; // Inverted cone expanding upward from pedestal
    this.holoGroup.add(this.holoCone);

    // 2. Gyroscopic 3D Hologram Orbital Rings (Cyan, Amber, Magenta)
    this.holoRings = [];
    const ringConfigs = [
      { radius: 2.05, tube: 0.014, color: 0x00F2FE, rx: 0.45, rz: 0.25, speed: 0.65 },
      { radius: 2.35, tube: 0.012, color: 0xFFA834, rx: -0.55, rz: 0.40, speed: -0.50 },
      { radius: 2.65, tube: 0.010, color: 0xFF2E93, rx: 0.20, rz: -0.65, speed: 0.38 }
    ];
    ringConfigs.forEach((cfg) => {
      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 12, 96);
      const rMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.48
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.set(cfg.rx, 0, cfg.rz);
      rMesh.position.y = 0.25;
      rMesh.userData = { speed: cfg.speed };
      this.holoGroup.add(rMesh);
      this.holoRings.push(rMesh);
    });

    // 3. Outer Holographic Wireframe Geodesic Cylinder Lattice
    const cageGeo = new THREE.CylinderGeometry(1.55, 1.55, 2.5, 24, 6, true);
    this.holoCageMat = new THREE.MeshBasicMaterial({
      color: 0x00F2FE,
      wireframe: true,
      transparent: true,
      opacity: 0.09
    });
    this.holoCage = new THREE.Mesh(cageGeo, this.holoCageMat);
    this.holoCage.position.y = 0.22;
    this.holoGroup.add(this.holoCage);

    // 4. Floating 3D Hologram Telemetry Particles
    const pCount = 90;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 1.15 + Math.random() * 1.8;
      pPositions[i * 3] = Math.cos(ang) * rad;
      pPositions[i * 3 + 1] = -1.0 + Math.random() * 3.0;
      pPositions[i * 3 + 2] = Math.sin(ang) * rad;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00FF87,
      size: 0.055,
      transparent: true,
      opacity: 0.75
    });
    this.holoParticles = new THREE.Points(pGeo, pMat);
    this.holoGroup.add(this.holoParticles);
  }

  buildMasterpieceModel() {
    this.deviceGroup = new THREE.Group();
    this.scene.add(this.deviceGroup);

    // ==========================================
    // Master Materials Library (PBR Engineering)
    // ==========================================
    this.matAnodizedDark = new THREE.MeshStandardMaterial({
      color: 0x122230,
      roughness: 0.3,
      metalness: 0.85
    });

    this.matAnodizedBevel = new THREE.MeshStandardMaterial({
      color: 0x00F2FE,
      roughness: 0.2,
      metalness: 0.9
    });

    this.matPolycarbonate = new THREE.MeshPhysicalMaterial({
      color: 0x142B3B,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.35,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.6,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });

    this.matPCB = new THREE.MeshStandardMaterial({
      color: 0x063B34, // Industrial Deep Forest Solder Mask
      roughness: 0.35,
      metalness: 0.15
    });

    this.matGoldTraces = new THREE.MeshStandardMaterial({
      color: 0xF5C443,
      roughness: 0.2,
      metalness: 0.95
    });

    this.matStainlessSteel = new THREE.MeshStandardMaterial({
      color: 0xE8ECEF,
      roughness: 0.18,
      metalness: 0.95
    });

    this.matCopperHeatsink = new THREE.MeshStandardMaterial({
      color: 0xD97443, // Pure Copper Heat Sink
      roughness: 0.28,
      metalness: 0.92
    });

    this.matSiliconeOrange = new THREE.MeshStandardMaterial({
      color: 0xFF5E36, // Retro Orange Flex Cable
      roughness: 0.5,
      metalness: 0.05
    });

    this.matPlasmaRing = new THREE.MeshStandardMaterial({
      color: 0xFFA834,
      emissive: 0xFFA834,
      emissiveIntensity: 0.8,
      roughness: 0.15
    });

    // ==========================================
    // 1. SUB-ASSEMBLY: BASE MOUNTING & MAGNETS
    // ==========================================
    const mountGroup = new THREE.Group();
    
    // CNC Machined Stainless Steel Base Flange
    const basePlateGeo = new THREE.CylinderGeometry(0.92, 0.98, 0.22, 48);
    const basePlate = new THREE.Mesh(basePlateGeo, this.matAnodizedDark);
    basePlate.castShadow = true;
    basePlate.receiveShadow = true;
    mountGroup.add(basePlate);

    // M8 Threaded Stud (Machined Spiral Approximation)
    const m8StudGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 24);
    const m8Stud = new THREE.Mesh(m8StudGeo, this.matStainlessSteel);
    m8Stud.position.y = -0.34;
    mountGroup.add(m8Stud);

    // Dual Rare-Earth N52 Neodymium Magnetic Discs
    for (let m = -1; m <= 1; m += 2) {
      const magPadGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.06, 24);
      const magPad = new THREE.Mesh(magPadGeo, this.matGoldTraces);
      magPad.position.set(m * 0.45, -0.12, 0);
      mountGroup.add(magPad);

      // Brass retention bezel
      const brassBezel = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 12, 32), this.matCopperHeatsink);
      brassBezel.rotation.x = Math.PI / 2;
      brassBezel.position.set(m * 0.45, -0.12, 0);
      mountGroup.add(brassBezel);
    }

    mountGroup.position.set(0, -0.7, 0);
    this.parts.mount = {
      group: mountGroup,
      basePos: mountGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -1.35, 0),
      id: 'mount',
      title: 'Dudukan Magnetik & Stud M8 Nirkarat',
      specs: 'Material: AISI 304 + Dual N52 Neodymium | Kekuatan Tarik: 18.5 kgf'
    };
    this.deviceGroup.add(mountGroup);

    // ==========================================
    // 2. SUB-ASSEMBLY: LOWER HEATSINK & CHASSIS
    // ==========================================
    const chassisGroup = new THREE.Group();

    // Cylindrical Chassis with Machined Lathe Grooves
    const chassisGeo = new THREE.CylinderGeometry(1.08, 0.98, 0.42, 48);
    const chassisMesh = new THREE.Mesh(chassisGeo, this.matAnodizedDark);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    chassisGroup.add(chassisMesh);

    // 24 Radial Copper Heat Dissipation Fins
    for (let f = 0; f < 24; f++) {
      const finAngle = (f / 24) * Math.PI * 2;
      const finGeo = new THREE.BoxGeometry(0.04, 0.38, 0.14);
      const fin = new THREE.Mesh(finGeo, this.matCopperHeatsink);
      fin.position.set(Math.cos(finAngle) * 1.05, 0, Math.sin(finAngle) * 1.05);
      fin.rotation.y = -finAngle;
      chassisGroup.add(fin);
    }

    chassisGroup.position.set(0, -0.38, 0);
    this.parts.chassis = {
      group: chassisGroup,
      basePos: chassisGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -0.65, 0),
      id: 'chassis',
      title: 'Sasis Pendingin Heatsink Tembaga',
      specs: 'Alloy: 6061-T6 Anodized + 24 Fin Tembaga C1100 | Disipasi Pasif: 3.8 W'
    };
    this.deviceGroup.add(chassisGroup);

    // ==========================================
    // 3. SUB-ASSEMBLY: POWER REGULATION & TVS
    // ==========================================
    const powerGroup = new THREE.Group();

    const powerPcb = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.06, 36), this.matPCB);
    powerGroup.add(powerPcb);

    // Toroidal High-Q Inductor Choke
    const chokeGeo = new THREE.TorusGeometry(0.18, 0.08, 16, 32);
    const choke = new THREE.Mesh(chokeGeo, this.matCopperHeatsink);
    choke.rotation.x = Math.PI / 2;
    choke.position.set(-0.35, 0.12, -0.2);
    powerGroup.add(choke);

    // Solid Polymer Capacitors (Silver with Blue Markings)
    for (let c = 0; c < 3; c++) {
      const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 18);
      const cap = new THREE.Mesh(capGeo, this.matStainlessSteel);
      cap.position.set(-0.15 + (c * 0.24), 0.14, -0.42);
      powerGroup.add(cap);
    }

    // Industrial Phoenix-style Screw Terminal Block
    const termBlock = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.28), this.matAnodizedBevel);
    termBlock.position.set(0.42, 0.14, 0.25);
    powerGroup.add(termBlock);

    // Brass screw heads inside terminal
    for (let s = -1; s <= 1; s += 2) {
      const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12), this.matGoldTraces);
      screwHead.position.set(0.42 + (s * 0.1), 0.26, 0.25);
      powerGroup.add(screwHead);
    }

    powerGroup.position.set(0, -0.06, 0);
    this.parts.power = {
      group: powerGroup,
      basePos: powerGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, -0.15, 0),
      id: 'power',
      title: 'Modul Catu Daya & Proteksi TVS Surge',
      specs: 'Input: 12-24V DC / Step-down Buck 3.3V | TVS Clamp: 36V 600W | Sekering PTC'
    };
    this.deviceGroup.add(powerGroup);

    // ==========================================
    // 4. SUB-ASSEMBLY: MEMS ACCELEROMETER & RTD PROBE
    // ==========================================
    const sensorGroup = new THREE.Group();

    const sensorPcb = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.05, 36), this.matPCB);
    sensorGroup.add(sensorPcb);

    // Acoustic Decoupling Ring (Viton O-Ring)
    const oRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 16, 36), this.matAnodizedDark);
    oRing.rotation.x = Math.PI / 2;
    oRing.position.y = 0.03;
    sensorGroup.add(oRing);

    // Triaxial MEMS Accelerometer Ceramic IC Package (LGA/QFN Gold Leadless)
    const memsChip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), this.matGoldTraces);
    memsChip.position.set(0, 0.08, 0);
    memsChip.castShadow = true;
    sensorGroup.add(memsChip);

    // Gold Axis Crosshair Marker on Chip (X-Y-Z)
    const axisX = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.02), this.matAnodizedBevel);
    axisX.position.set(0, 0.125, 0);
    sensorGroup.add(axisX);

    // Flexible Braided RTD Cable with Spring Strain Relief
    const cableCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.5, 0.06, -0.2),
      new THREE.Vector3(0.8, 0.06, -0.2),
      new THREE.Vector3(1.1, 0.15, -0.3),
      new THREE.Vector3(1.4, 0.06, -0.3)
    );
    const cableGeo = new THREE.TubeGeometry(cableCurve, 24, 0.04, 12, false);
    const cable = new THREE.Mesh(cableGeo, this.matSiliconeOrange);
    sensorGroup.add(cable);

    // Stainless Spring Strain Relief
    const springGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12);
    const spring = new THREE.Mesh(springGeo, this.matStainlessSteel);
    spring.rotation.z = Math.PI / 2;
    spring.position.set(0.72, 0.06, -0.2);
    sensorGroup.add(spring);

    // Knurled Stainless RTD Sensor Sheath
    const rtdSheath = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.45, 18), this.matStainlessSteel);
    rtdSheath.rotation.z = Math.PI / 2;
    rtdSheath.position.set(1.65, 0.06, -0.3);
    sensorGroup.add(rtdSheath);

    sensorGroup.position.set(0, 0.18, 0);
    this.parts.sensor = {
      group: sensorGroup,
      basePos: sensorGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 0.38, 0),
      id: 'sensor',
      title: 'Akselerometer MEMS Triaksial & RTD PT100',
      specs: 'Bandwidth Getaran: 1-2 kHz (±16g) | Sensor Suhu: RTD Kelas A (-40 sd +125°C)'
    };
    this.deviceGroup.add(sensorGroup);

    // ==========================================
    // 5. SUB-ASSEMBLY: ESP32-S3 EDGE MCU & DSP
    // ==========================================
    const espGroup = new THREE.Group();

    const mainPcb = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.06, 36), this.matPCB);
    espGroup.add(mainPcb);

    // ESP32-S3 Nickel RF Shielding Can with Etched Logo
    const rfCan = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.6), this.matStainlessSteel);
    rfCan.position.set(-0.15, 0.08, 0);
    rfCan.castShadow = true;
    espGroup.add(rfCan);

    // PCB Antenna Meander Line
    const pcbAntenna = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.42), this.matGoldTraces);
    pcbAntenna.position.set(0.32, 0.05, 0);
    espGroup.add(pcbAntenna);

    // Gold SMD Decoupling Passives (0402/0603)
    for (let p = 0; p < 8; p++) {
      const smd = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.08), this.matGoldTraces);
      smd.position.set(0.12, 0.05, -0.35 + (p * 0.1));
      espGroup.add(smd);
    }

    espGroup.position.set(0, 0.44, 0);
    this.parts.esp = {
      group: espGroup,
      basePos: espGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 0.85, 0),
      id: 'esp',
      title: 'Unit Komputasi Tepi ESP32-S3 (Edge DSP)',
      specs: 'Xtensa Dual-Core 240 MHz | Akselerasi Vektor FFT | Inferensi Lokal MAD'
    };
    this.deviceGroup.add(espGroup);

    // ==========================================
    // 6. SUB-ASSEMBLY: TOP DOME ENCLOSURE & OPTICAL RING
    // ==========================================
    const enclosureGroup = new THREE.Group();

    // Frosted Polycarbonate Shell Dome
    const domeCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.12, 0.52, 48), this.matPolycarbonate);
    domeCylinder.castShadow = true;
    enclosureGroup.add(domeCylinder);

    const domeCap = new THREE.Mesh(new THREE.SphereGeometry(0.98, 48, 18, 0, Math.PI * 2, 0, Math.PI / 4), this.matPolycarbonate);
    domeCap.position.y = 0.26;
    enclosureGroup.add(domeCap);

    // 4 Stainless Steel Hex Socket Cap Screws on Top Flange
    for (let s = 0; s < 4; s++) {
      const sAngle = (s / 4) * Math.PI * 2 + Math.PI / 4;
      const screwGroup = new THREE.Group();

      const screwHead = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16), this.matStainlessSteel);
      screwGroup.add(screwHead);

      // Inner Hex Socket
      const hexSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 6), this.matAnodizedDark);
      hexSocket.position.y = 0.02;
      screwGroup.add(hexSocket);

      screwGroup.position.set(Math.cos(sAngle) * 0.88, 0.26, Math.sin(sAngle) * 0.88);
      enclosureGroup.add(screwGroup);
    }

    // 360° Phosphor Glowing Optical Status Ring
    const statusTorus = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.045, 20, 64), this.matPlasmaRing);
    statusTorus.rotation.x = Math.PI / 2;
    statusTorus.position.y = 0.32;
    this.statusTorusMesh = statusTorus;
    enclosureGroup.add(statusTorus);

    // Top Knurled Cable Gland for External Interconnect
    const glandGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.16, 24);
    const gland = new THREE.Mesh(glandGeo, this.matAnodizedDark);
    gland.position.y = 0.42;
    enclosureGroup.add(gland);

    enclosureGroup.position.set(0, 0.86, 0);
    this.parts.enclosure = {
      group: enclosureGroup,
      basePos: enclosureGroup.position.clone(),
      explodeVec: new THREE.Vector3(0, 1.55, 0),
      id: 'enclosure',
      title: 'Housing Polikarbonat & Ring Optik 360°',
      specs: 'Material: Sabic Lexan PC-GF30 | Rating: Konsep IP65 | Status Ring: Phosphor Amber'
    };
    this.deviceGroup.add(enclosureGroup);

    this.deviceGroup.position.y = 0.12;

    this.createDomHotspots();
  }

  createDomHotspots() {
    this.hotspotDefs = [
      { id: 'enclosure', num: '01', titleKey: 'partEnclosure', targetGroup: this.parts.enclosure },
      { id: 'esp', num: '02', titleKey: 'partEsp', targetGroup: this.parts.esp },
      { id: 'sensor', num: '03', titleKey: 'partMems', targetGroup: this.parts.sensor },
      { id: 'power', num: '04', titleKey: 'partPower', targetGroup: this.parts.power },
      { id: 'chassis', num: '05', titleKey: 'partEnclosure', targetGroup: this.parts.chassis },
      { id: 'mount', num: '06', titleKey: 'partMount', targetGroup: this.parts.mount }
    ];

    let overlay = this.container.querySelector('.hotspot-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'hotspot-overlay absolute inset-0 pointer-events-none overflow-hidden';
      this.container.appendChild(overlay);
    }
    overlay.innerHTML = '';

    this.hotspotElements = this.hotspotDefs.map(def => {
      const el = document.createElement('button');
      el.className = 'hotspot-btn absolute pointer-events-auto flex items-center justify-center w-7 h-7 rounded-full bg-deep-steel/90 text-signal-cyan font-mono text-[11px] font-bold shadow-lg border border-neon-cyan/50 backdrop-blur hover:scale-125 hover:border-plasma-amber hover:text-plasma-amber transition-all duration-200 focus:outline-none';
      el.innerHTML = `<span>${def.num}</span>`;

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

      // Offset hotspot outward slightly along X
      worldPos.x += 1.25;

      worldPos.project(this.camera);

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
    if (this.matPolycarbonate) {
      this.matPolycarbonate.opacity = enabled ? 0.22 : 0.94;
      this.matPolycarbonate.transmission = enabled ? 0.95 : 0.35;
      this.matPolycarbonate.needsUpdate = true;
    }
    if (this.holoCageMat) {
      this.holoCageMat.opacity = enabled ? 0.28 : 0.09;
      this.holoCageMat.color.setHex(enabled ? 0x00FF87 : 0x00F2FE);
    }
  }

  isolatePart(partId) {
    this.options.isolatedPart = partId;
    for (const key in this.parts) {
      const part = this.parts[key];
      const isTarget = key === partId || partId === null;
      part.group.visible = isTarget;
    }
    if (partId) {
      this.selectPart(partId);
    }
  }

  resetView() {
    if (window.gsap) {
      gsap.to(this.camera.position, {
        x: 4.8, y: 3.6, z: 5.8,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => this.controls.update()
      });
      gsap.to(this.controls.target, {
        x: 0, y: 0.1, z: 0,
        duration: 1,
        ease: "power2.out"
      });
    } else {
      this.camera.position.set(4.8, 3.6, 5.8);
      this.controls.target.set(0, 0.1, 0);
      this.controls.update();
    }
    this.setExploded(0);
    this.isolatePart(null);
  }

  setView(viewType) {
    let targetPos = { x: 4.8, y: 3.6, z: 5.8 };
    if (viewType === 'iso') targetPos = { x: 4.8, y: 4.2, z: 4.8 };
    else if (viewType === 'top') targetPos = { x: 0.01, y: 8.8, z: 0.01 };
    else if (viewType === 'side') targetPos = { x: 8.2, y: 0.2, z: 0 };

    if (window.gsap) {
      gsap.to(this.camera.position, {
        x: targetPos.x, y: targetPos.y, z: targetPos.z,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => this.controls.update()
      });
    } else {
      this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      this.controls.update();
    }
  }

  play30sSideExplodeDemo(onUpdateCallback) {
    this.isolatePart(null);
    this.setView('side');
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 3.2;

    if (this._demoInterval) clearInterval(this._demoInterval);
    const startTime = performance.now();
    const durationMs = 30000;
    this.setExploded(0);

    this._demoInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const rawP = Math.min(1, elapsed / durationMs);
      const smoothP = rawP * rawP * (3 - 2 * rawP);
      this.setExploded(smoothP);
      if (typeof onUpdateCallback === 'function') {
        onUpdateCallback(smoothP, Math.min(30, elapsed / 1000));
      }
      if (rawP >= 1) {
        clearInterval(this._demoInterval);
        this._demoInterval = null;
      }
    }, 33);
  }

  selectPart(partId) {
    this.selectedPart = partId;
    const part = this.parts[partId];
    if (!part) return;

    window.dispatchEvent(new CustomEvent('partSelected', {
      detail: {
        id: partId,
        title: part.title,
        specs: part.specs
      }
    }));

    const worldPos = new THREE.Vector3();
    part.group.getWorldPosition(worldPos);

    if (window.gsap) {
      gsap.to(this.controls.target, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z,
        duration: 0.75,
        ease: "power2.out"
      });
    }
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
    const t = this.clock.getElapsedTime();

    // Oscillating Laser Disc
    if (this.laserDisc) {
      this.laserDisc.position.y = -0.6 + Math.sin(t * 1.5) * 0.9;
    }

    // Breathing Optical Pulse on Status Ring
    if (this.matPlasmaRing) {
      this.matPlasmaRing.emissiveIntensity = 0.5 + Math.sin(t * 3.2) * 0.45;
    }

    // Animate 3D Hologram Gyroscopic Rings, Cage & Floating Particles
    if (this.holoRings) {
      this.holoRings.forEach((ring, idx) => {
        ring.rotation.y = t * ring.userData.speed;
        ring.rotation.x += Math.sin(t * 0.8 + idx) * 0.002;
      });
    }
    if (this.holoCage) {
      this.holoCage.rotation.y = -t * 0.25;
      this.holoCage.scale.y = 1 + this.options.explodedProgress * 0.65;
    }
    if (this.holoParticles) {
      this.holoParticles.rotation.y = t * 0.18;
      this.holoParticles.position.y = Math.sin(t * 1.2) * 0.15;
    }

    this.controls.update();
    this.updateHotspotsPositions();
    this.renderer.render(this.scene, this.camera);
  }
}

window.NadiDeviceViewer = NadiDeviceViewer;
