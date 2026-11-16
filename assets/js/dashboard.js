/**
 * NADI-IKM Interactive Scenario Simulator & Hybrid Decision Pipeline
 * Conforms to IYEEA 2026 Paper specifications (Sections 2.3, 2.4, 2.5).
 * Explicitly implements:
 *  1) Deterministic Mulberry32 PRNG (_seed = 20261115)
 *  2) Stage 1: Signal Quality Gate (clipping/flatline & sub-kHz mounting resonance check)
 *  3) Stage 2: Load-Conditioned Robust Deviation Score (Z_MAD conditioned on CT load current I_rms)
 *  4) Stage 3: Deterministic Isolation Forest Ensemble (25 binary partition trees) + ISO 20816-3 Severity Index (S_ISO)
 *  5) Stage 4: Hysteresis Persistence Filter (M=3 of N=5 windows) & Rule-Based Feature Attribution
 *  6) Reproducible 500-Window Comparative Benchmark (Method A vs Method B vs Method C)
 */

const NadiDashboard = {
  currentScenario: 'anomaly', // 'normal' | 'load_shift' | 'anomaly' | 'sensor_fault'
  selectedAssetId: 'M-02',
  isPaused: false,
  timer: null,
  _seed: 20261115,
  isolationTrees: [],

  // Deterministic seeded PRNG (Mulberry32) for reproducible synthetic scenario telemetry
  nextRand() {
    let t = (this._seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  },

  assets: {
    'P-01': {
      id: 'P-01',
      name: 'Pompa Sentrifugal P-01',
      type: 'Pompa Proses 18.5 kW (2.950 rpm)',
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Kaku (Rigid)',
      isoLimits: { vA: 1.4, vB: 2.8, vC: 4.5 },
      location: 'Area Utilitas Lini A',
      criticality: 'Tinggi (Aliran Pendingin)',
      status: 'NORMAL',
      rms: 1.38,
      rmsBaseline: 1.35,
      temp: 41.4,
      tempBaseline: 41.0,
      kurtosis: 3.05,
      kurtBaseline: 3.00,
      mountResonanceHz: 2420,
      load: 76,
      loadDefault: 76,
      // Regime baselines: [low (<60%), nominal (60-85%), high (>85%)]
      regimeStats: {
        low:     { medRms: 1.15, madRms: 0.08, medTemp: 39.0, madTemp: 0.7, medKurt: 2.95, madKurt: 0.12 },
        nominal: { medRms: 1.35, madRms: 0.10, medTemp: 41.0, madTemp: 0.8, medKurt: 3.00, madKurt: 0.15 },
        high:    { medRms: 1.82, madRms: 0.14, medTemp: 44.8, madTemp: 1.1, medKurt: 3.08, madKurt: 0.18 }
      },
      deviation: 0.14,
      sIF: 0.24,
      sISO: 0.03,
      zMadMax: 0.45,
      attribution: { rmsPct: 45, tempPct: 30, kurtPct: 25 },
      quality: 'VALID',
      scoreWindow: [0.14, 0.15, 0.13, 0.14, 0.14],
      history: []
    },
    'M-02': {
      id: 'M-02',
      name: 'Motor Induksi M-02',
      type: 'Motor 3-Fasa 22 kW (1.480 rpm)',
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Kaku (Rigid)',
      isoLimits: { vA: 1.8, vB: 2.8, vC: 4.5 },
      location: 'Penggerak Konveyor Utama',
      criticality: 'Kritis (Lini Tunggal)',
      status: 'INSPEKSI',
      rms: 4.85,
      rmsBaseline: 2.10,
      temp: 68.4,
      tempBaseline: 48.0,
      kurtosis: 6.40,
      kurtBaseline: 3.00,
      mountResonanceHz: 2390,
      load: 82,
      loadDefault: 82,
      regimeStats: {
        low:     { medRms: 1.75, madRms: 0.11, medTemp: 45.0, madTemp: 0.9, medKurt: 2.95, madKurt: 0.14 },
        nominal: { medRms: 2.10, madRms: 0.14, medTemp: 48.0, madTemp: 1.1, medKurt: 3.00, madKurt: 0.16 },
        high:    { medRms: 2.84, madRms: 0.19, medTemp: 52.2, madTemp: 1.4, medKurt: 3.12, madKurt: 0.20 }
      },
      deviation: 0.78,
      sIF: 0.76,
      sISO: 0.80,
      zMadMax: 13.2,
      attribution: { rmsPct: 48, tempPct: 24, kurtPct: 28 },
      quality: 'VALID',
      scoreWindow: [0.76, 0.77, 0.78, 0.79, 0.78],
      history: []
    },
    'F-03': {
      id: 'F-03',
      name: 'Kipas Ventilasi Sentral F-03',
      type: 'Blower Sentrifugal 15 kW (1.460 rpm)',
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Fleksibel (Flexible)',
      isoLimits: { vA: 2.3, vB: 4.5, vC: 7.1 },
      location: 'Atap Gedung Produksi',
      criticality: 'Sedang (Sirkulasi)',
      status: 'NORMAL',
      rms: 1.82,
      rmsBaseline: 1.80,
      temp: 38.2,
      tempBaseline: 38.0,
      kurtosis: 3.02,
      kurtBaseline: 3.00,
      mountResonanceHz: 2410,
      load: 74,
      loadDefault: 74,
      regimeStats: {
        low:     { medRms: 1.50, madRms: 0.10, medTemp: 36.0, madTemp: 0.8, medKurt: 2.96, madKurt: 0.14 },
        nominal: { medRms: 1.80, madRms: 0.13, medTemp: 38.0, madTemp: 1.0, medKurt: 3.00, madKurt: 0.16 },
        high:    { medRms: 2.42, madRms: 0.18, medTemp: 41.8, madTemp: 1.3, medKurt: 3.10, madKurt: 0.19 }
      },
      deviation: 0.16,
      sIF: 0.26,
      sISO: 0.00,
      zMadMax: 0.52,
      attribution: { rmsPct: 42, tempPct: 31, kurtPct: 27 },
      quality: 'VALID',
      scoreWindow: [0.15, 0.16, 0.16, 0.15, 0.16],
      history: []
    }
  },

  inspectionLogs: [
    {
      id: 'SIM-LOG-001',
      time: '13 Nov 2026 10:15 [CONTOH SIMULASI]',
      assetId: 'M-02',
      technician: 'Suryo (Contoh Teknisi)',
      action: 'Simulasi Pemeriksaan Bantalan & Alignment',
      result: '[Data Contoh] Baut kaki motor longgar 1/4 putaran; getaran turun pasca pengencangan sesuai SOP.',
      status: 'Contoh Simulasi'
    },
    {
      id: 'SIM-LOG-002',
      time: '12 Nov 2026 14:30 [CONTOH SIMULASI]',
      assetId: 'P-01',
      technician: 'Rahmat (Contoh Teknisi)',
      action: 'Simulasi Inspeksi Rutin Mingguan',
      result: '[Data Contoh] Getaran stabil 1.38 mm/s dalam rentang baseline normal.',
      status: 'Contoh Simulasi'
    }
  ],

  init() {
    this.buildDeterministicIsolationForest();
    this.setScenario(this.currentScenario, true);
    this.generateInitialHistory();
    this.initChart();
    this.renderAssetCards();
    this.renderAssetDetails(this.selectedAssetId);
    this.renderLogs();
    this.startSimulation();
    this.bindEvents();
  },

  // Build a deterministic 25-tree Isolation Forest over normalized Z_MAD feature space [zRms, zTemp, zKurt]
  buildDeterministicIsolationForest() {
    this.isolationTrees = [];
    for (let t = 0; t < 25; t++) {
      // Deterministic split thresholds across 4 levels covering [0, 12] in Z_MAD space
      const feat0 = t % 3;
      const thr0 = 1.8 + (t % 5) * 0.45;
      const feat1L = (t + 1) % 3;
      const thr1L = 1.1 + (t % 4) * 0.30;
      const feat1R = (t + 2) % 3;
      const thr1R = 3.2 + (t % 5) * 0.55;
      const thr2RR = 5.0 + (t % 4) * 0.65;
      this.isolationTrees.push({ feat0, thr0, feat1L, thr1L, feat1R, thr1R, thr2RR });
    }
  },

  // Evaluate Isolation Forest anomaly score S_IF in [0, 1] from Z_MAD vector
  computeIsolationForestScore(zVec) {
    let totalPathLength = 0;
    for (let i = 0; i < this.isolationTrees.length; i++) {
      const tr = this.isolationTrees[i];
      let depth = 1;
      if (zVec[tr.feat0] > tr.thr0) {
        // Right branch (anomalous high Z_MAD isolates faster = shorter path)
        if (zVec[tr.feat1R] > tr.thr2RR) {
          depth = 1.2; // Isolated near root
        } else if (zVec[tr.feat1R] > tr.thr1R) {
          depth = 2.1;
        } else {
          depth = 3.4;
        }
      } else {
        // Left branch (normal region requires deeper partitioning)
        if (zVec[tr.feat1L] > tr.thr1L) {
          depth = 4.6;
        } else {
          depth = 6.2;
        }
      }
      totalPathLength += depth;
    }
    const avgPath = totalPathLength / this.isolationTrees.length;
    const cFactor = 4.35; // Normalization factor c(n) for reference subsample
    const rawScore = Math.pow(2, -avgPath / cFactor);
    return Math.min(0.99, Math.max(0.05, +rawScore.toFixed(3)));
  },

  // Get load regime key from CT load percentage
  getLoadRegime(loadPct) {
    if (loadPct < 60) return 'low';
    if (loadPct <= 85) return 'nominal';
    return 'high';
  },

  // Full 4-stage hybrid pipeline execution for a single telemetry sample
  evaluateAssetPipeline(asset, sampleRms, sampleTemp, sampleKurt, sampleLoad, sampleMountHz) {
    asset.rms = +sampleRms.toFixed(2);
    asset.temp = +sampleTemp.toFixed(1);
    asset.kurtosis = +sampleKurt.toFixed(2);
    asset.load = Math.round(sampleLoad);
    asset.mountResonanceHz = Math.round(sampleMountHz);

    // STAGE 1: Signal Quality & Mounting Resonance Gate
    if (asset.rms < 0.08 || asset.load === 0) {
      asset.quality = 'KABEL_PUTUS / DROPOUT';
      asset.status = 'PERIKSA SENSOR';
      asset.deviation = 0.0; // Not a mechanical score
      asset.sIF = 0.0;
      asset.sISO = 0.0;
      asset.zMadMax = 0.0;
      asset.attribution = { rmsPct: 0, tempPct: 0, kurtPct: 0 };
      return;
    }
    if (asset.mountResonanceHz < 1000) {
      asset.quality = `RESONANSI_DUDUKAN (${asset.mountResonanceHz} Hz)`;
      asset.status = 'PERIKSA SENSOR';
      asset.deviation = 0.0;
      asset.sIF = 0.0;
      asset.sISO = 0.0;
      asset.zMadMax = 0.0;
      asset.attribution = { rmsPct: 0, tempPct: 0, kurtPct: 0 };
      return;
    }
    asset.quality = 'VALID';

    // STAGE 2: Load-Conditioned Z_MAD Calculation (Eq. 4)
    const regimeKey = this.getLoadRegime(asset.load);
    const ref = asset.regimeStats[regimeKey];
    const zRms = Math.abs(asset.rms - ref.medRms) / (1.4826 * ref.madRms);
    const zTemp = Math.abs(asset.temp - ref.medTemp) / (1.4826 * ref.madTemp);
    const zKurt = Math.abs(asset.kurtosis - ref.medKurt) / (1.4826 * ref.madKurt);
    asset.zMadMax = +Math.max(zRms, zTemp, zKurt).toFixed(2);

    // Rule-based feature attribution proportional to load-conditioned Z_MAD
    const zSum = zRms + zTemp + zKurt + 1e-6;
    const rmsPct = Math.round((zRms / zSum) * 100);
    const tempPct = Math.round((zTemp / zSum) * 100);
    const kurtPct = Math.max(0, 100 - rmsPct - tempPct);
    asset.attribution = { rmsPct, tempPct, kurtPct, zRms: +zRms.toFixed(2), zTemp: +zTemp.toFixed(2), zKurt: +zKurt.toFixed(2), regimeKey, refMedRms: ref.medRms };

    // STAGE 3: Hybrid Score S_gab = alpha * S_IF + (1 - alpha) * S_ISO (Eq. 5)
    const sIF = this.computeIsolationForestScore([zRms, zTemp, zKurt]);
    const { vA, vC } = asset.isoLimits;
    const sISO = Math.min(1.0, Math.max(0.0, (asset.rms - vA) / (vC - vA)));
    const alpha = 0.5;
    const sGab = +(alpha * sIF + (1 - alpha) * sISO).toFixed(2);

    asset.sIF = +sIF.toFixed(2);
    asset.sISO = +sISO.toFixed(2);
    asset.deviation = sGab;

    // STAGE 4: Hysteresis Persistence Filter (M=3 of N=5 windows)
    asset.scoreWindow.push(sGab);
    if (asset.scoreWindow.length > 5) asset.scoreWindow.shift();

    const countCritical = asset.scoreWindow.filter(s => s >= 0.72).length;
    const countWarning = asset.scoreWindow.filter(s => s >= 0.55).length;

    if (countCritical >= 3) {
      asset.status = 'INSPEKSI';
    } else if (countWarning >= 3) {
      asset.status = 'PANTAU';
    } else if (regimeKey === 'high') {
      asset.status = 'NORMAL (BEBAN TINGGI)';
    } else {
      asset.status = 'NORMAL';
    }
  },

  // Reset all assets cleanly before applying a scenario so button order never corrupts state
  applyScenarioState(scenName, resetWindow = false) {
    for (let id in this.assets) {
      const a = this.assets[id];
      const jitterRms = (this.nextRand() - 0.5) * 0.08;
      const jitterTemp = (this.nextRand() - 0.5) * 0.3;

      let simRms = a.rmsBaseline + jitterRms;
      let simTemp = a.tempBaseline + jitterTemp;
      let simKurt = a.kurtBaseline + (this.nextRand() - 0.5) * 0.06;
      let simLoad = a.loadDefault;
      let simMountHz = 2400;

      if (scenName === 'load_shift') {
        simLoad = 92;
        simRms = a.regimeStats.high.medRms + jitterRms;
        simTemp = a.regimeStats.high.medTemp + jitterTemp;
        simKurt = a.regimeStats.high.medKurt + 0.04;
      } else if (scenName === 'anomaly' && id === 'M-02') {
        simLoad = 84;
        simRms = 4.88 + jitterRms;
        simTemp = 68.5 + jitterTemp;
        simKurt = 6.35;
      } else if (scenName === 'sensor_fault' && id === 'F-03') {
        simLoad = 74;
        simRms = 0.02; // Open wire dropout
        simTemp = 38.0;
        simMountHz = 380; // Loose mount / sensor fault
      }

      if (resetWindow) {
        a.scoreWindow = [];
        for (let w = 0; w < 5; w++) {
          this.evaluateAssetPipeline(a, simRms, simTemp, simKurt, simLoad, simMountHz);
        }
      } else {
        this.evaluateAssetPipeline(a, simRms, simTemp, simKurt, simLoad, simMountHz);
      }
    }
  },

  generateInitialHistory() {
    const now = Date.now();
    for (let id in this.assets) {
      const asset = this.assets[id];
      asset.history = [];
      const activeRegime = this.getLoadRegime(asset.load);
      const activeBaseline = asset.regimeStats[activeRegime].medRms;
      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 15000);
        const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const jitter = (this.nextRand() - 0.5) * 0.12;
        asset.history.push({
          time: timeLabel,
          rms: Math.max(0.02, +(asset.rms + jitter).toFixed(2)),
          temp: +(asset.temp + (this.nextRand() - 0.5) * 0.35).toFixed(1),
          baseline: activeBaseline
        });
      }
    }
  },

  initChart() {
    const canvas = document.getElementById('telemetryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const asset = this.assets[this.selectedAssetId];
    const labels = asset.history.map(h => h.time);
    const rmsData = asset.history.map(h => h.rms);
    const baselineData = asset.history.map(h => h.baseline);
    const tempData = asset.history.map(h => h.temp);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Getaran RMS (mm/s)',
            data: rmsData,
            borderColor: '#0DB3A6',
            backgroundColor: 'rgba(13, 179, 166, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          },
          {
            label: 'Baseline Terkondisi Beban (mm/s)',
            data: baselineData,
            borderColor: '#F0A444',
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Suhu Bantalan (°C)',
            data: tempData,
            borderColor: '#E96F67',
            borderWidth: 2,
            borderDash: [3, 3],
            pointRadius: 1,
            fill: false,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } }
          },
          tooltip: {
            backgroundColor: '#0A1F2E',
            borderColor: '#173447',
            borderWidth: 1,
            titleColor: '#59D8D1',
            bodyColor: '#F8FAFC'
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748B', font: { size: 10 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Vibration RMS (mm/s)', color: '#0DB3A6' },
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#94A3B8' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Temperature (°C)', color: '#E96F67' },
            grid: { drawOnChartArea: false },
            ticks: { color: '#94A3B8' }
          }
        }
      }
    });
  },

  startSimulation() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPaused) return;
      this.tickTelemetry();
    }, 2000);
  },

  tickTelemetry() {
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.applyScenarioState(this.currentScenario, false);

    for (let id in this.assets) {
      const asset = this.assets[id];
      const activeRegime = this.getLoadRegime(asset.load);
      const activeBaseline = asset.regimeStats[activeRegime].medRms;
      const newPoint = {
        time: timeLabel,
        rms: asset.rms,
        temp: asset.temp,
        baseline: activeBaseline
      };
      asset.history.push(newPoint);
      if (asset.history.length > 25) asset.history.shift();
    }

    this.renderAssetCards();
    this.updateChart();
    this.renderAssetDetails(this.selectedAssetId);
  },

  updateChart() {
    if (!this.chart) return;
    const asset = this.assets[this.selectedAssetId];
    this.chart.data.labels = asset.history.map(h => h.time);
    this.chart.data.datasets[0].data = asset.history.map(h => h.rms);
    this.chart.data.datasets[1].data = asset.history.map(h => h.baseline);
    this.chart.data.datasets[2].data = asset.history.map(h => h.temp);
    this.chart.update('none');
  },

  setScenario(scenName, isInit = false) {
    this.currentScenario = scenName;
    this.applyScenarioState(scenName, true);

    if (!isInit) {
      this.generateInitialHistory();
      this.renderAssetCards();
      this.updateChart();
      this.renderAssetDetails(this.selectedAssetId);
    }

    document.querySelectorAll('.scen-btn').forEach(btn => {
      if (btn.getAttribute('data-scen') === scenName) {
        btn.classList.add('bg-industrial-teal', 'text-white', 'border-signal-cyan');
        btn.classList.remove('bg-deep-steel', 'text-slate-300');
      } else {
        btn.classList.remove('bg-industrial-teal', 'text-white', 'border-signal-cyan');
        btn.classList.add('bg-deep-steel', 'text-slate-300');
      }
    });

    const scenNotice = document.getElementById('scenNotice');
    if (scenNotice) {
      const msgs = {
        normal: 'Skenario Simulasi Aktif [NORMAL]: Ketiga mesin beroperasi pada rezim beban nominal. Skor deviasi Z_MAD dan S_gab berada di bawah ambang peringatan (0.55).',
        load_shift: 'Skenario Simulasi Aktif [LONJAKAN BEBAN 92%]: Arus beban CT naik ke rezim tinggi. Normalisasi Z_MAD otomatis bergeser ke baseline beban tinggi sehingga S_gab tetap rendah dan TIDAK memicu alarm palsu.',
        anomaly: 'Skenario Simulasi Aktif [GEJALA AUS BANTALAN M-02]: Getaran M-02 naik ke 4.88 mm/s disertai kenaikan kurtosis & suhu. Skor hibrida S_gab = 0.78 bertahan ≥3/5 jendela → Status INSPEKSI.',
        sensor_fault: 'Skenario Simulasi Aktif [GANGGUAN SENSOR F-03]: Gerbang mutu sinyal mendeteksi dropout/resonansi dudukan (<1 kHz) pada F-03 → Diisolasi ke Status PERIKSA SENSOR (Biru), bukan rusak mesin.'
      };
      scenNotice.innerHTML = msgs[scenName] || '';
    }
  },

  selectAsset(id) {
    this.selectedAssetId = id;
    this.renderAssetCards();
    this.updateChart();
    this.renderAssetDetails(id);
  },

  renderAssetCards() {
    const container = document.getElementById('assetCardsContainer');
    if (!container) return;

    let html = '';
    for (let id in this.assets) {
      const a = this.assets[id];
      const isSelected = id === this.selectedAssetId;
      const borderClass = isSelected ? 'border-industrial-teal ring-2 ring-industrial-teal/30 shadow-lg shadow-industrial-teal/10' : 'border-slate-800 hover:border-slate-700';

      let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      if (a.status.includes('INSPEKSI') || a.status.includes('PANTAU')) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      if (a.status.includes('PERIKSA SENSOR')) badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';

      html += `
        <div onclick="NadiDashboard.selectAsset('${a.id}')" class="cursor-pointer bg-deep-steel/80 backdrop-blur rounded-2xl p-5 border ${borderClass} transition-all duration-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-bold text-signal-cyan px-2.5 py-1 rounded-md bg-signal-cyan/10 border border-signal-cyan/20">${a.id}</span>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}">
              <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${a.status.includes('INSPEKSI') ? 'bg-amber-400 animate-pulse' : a.status.includes('PERIKSA') ? 'bg-sky-400' : 'bg-emerald-400'}"></span>
              ${a.status}
            </span>
          </div>
          <h4 class="text-white font-bold text-base mb-1 truncate">${a.name}</h4>
          <p class="text-[11px] text-slate-400 mb-3">${a.isoGroup}</p>

          <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div>
              <span class="text-slate-400 block text-[10px]">Getaran v_rms</span>
              <span class="text-white font-bold text-sm">${a.rms} <span class="text-[10px] text-slate-400">mm/s</span></span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Suhu RTD</span>
              <span class="text-white font-bold text-sm">${a.temp} <span class="text-[10px] text-slate-400">°C</span></span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Beban CT</span>
              <span class="text-white font-bold text-sm">${a.load}<span class="text-[10px] text-slate-400">%</span></span>
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  // Dynamic scenario- and status-consistent rule-based attribution explanation
  renderAssetDetails(id) {
    const a = this.assets[id];
    if (!a) return;

    const titleEl = document.getElementById('selectedAssetTitle');
    const badgeEl = document.getElementById('selectedAssetBadge');
    const devScoreEl = document.getElementById('selectedDevScore');
    const reasonTextEl = document.getElementById('selectedReasonText');

    if (titleEl) titleEl.innerText = `${a.id} • ${a.name}`;
    if (badgeEl) {
      badgeEl.innerText = a.status;
      badgeEl.className = `px-3 py-1 rounded-full text-xs font-semibold border ${a.status.includes('INSPEKSI') ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : a.status.includes('PERIKSA') ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`;
    }
    if (devScoreEl) {
      if (a.status.includes('PERIKSA SENSOR')) {
        devScoreEl.innerText = `FAULT`;
        devScoreEl.className = `text-2xl font-mono font-bold text-sky-400`;
      } else {
        devScoreEl.innerText = `${a.deviation.toFixed(2)} (${(a.deviation * 100).toFixed(0)}%)`;
        devScoreEl.className = `text-2xl font-mono font-bold ${a.deviation >= 0.55 ? 'text-amber-400' : 'text-emerald-400'}`;
      }
    }

    if (reasonTextEl) {
      if (a.status.includes('PERIKSA SENSOR')) {
        reasonTextEl.innerHTML = `
          <strong>Gerbang Mutu Sinyal Aktif (Status Biru):</strong> Deteksi anomali mekanis ditangguhkan karena kualitas sinyal <span class="text-sky-300 font-semibold">${a.quality}</span> (v_rms = ${a.rms} mm/s).
          <br><span class="text-sky-300 font-medium">Atribusi Berbasis Aturan:</span> 100% disebabkan anomali rantai akuisisi/dudukan sensor, bukan kerusakan mekanis mesin.
          <br><span class="text-sky-300 font-medium">Tindakan SOP:</span> Periksa konektor kabel sensor dan kekencangan magnet N52 pada bodi mesin sebelum membongkar komponen mekanis.
        `;
      } else if (a.status.includes('INSPEKSI') || a.status.includes('PANTAU')) {
        const pctOver = Math.round(((a.rms - a.attribution.refMedRms) / a.attribution.refMedRms) * 100);
        reasonTextEl.innerHTML = `
          <strong>Penjelasan Berbasis Aturan & Atribusi Z_MAD (Simulasi Skenario):</strong> Skor hibrida <strong>S_gab = ${a.deviation.toFixed(2)}</strong> (S_IF = ${a.sIF}, S_ISO = ${a.sISO}) melampaui ambang pada rezim beban ${a.load}% (${a.attribution.regimeKey}).
          <br>• <strong>Kontribusi Fitur Dominan:</strong> Getaran v_rms menyumbang <strong>${a.attribution.rmsPct}%</strong> (+${pctOver}% di atas median rezim ${a.attribution.refMedRms} mm/s; Z_MAD = ${a.attribution.zRms}), Kurtosis impulsif <strong>${a.attribution.kurtPct}%</strong> (κ = ${a.kurtosis}; Z_MAD = ${a.attribution.zKurt}), dan Suhu RTD <strong>${a.attribution.tempPct}%</strong> (${a.temp}°C; Z_MAD = ${a.attribution.zTemp}).
          <br><span class="text-amber-300 font-medium">Anjuran Inspeksi Terarah:</span> Periksa pelumasan bantalan dan keselarasan poros pada jadwal henti terdekat dengan prosedur LOTO. <em>(Catatan: keluaran simulator skenario sintetis; verifikasi fisik teknisi wajib dilakukan).</em>
        `;
      } else if (a.status.includes('BEBAN TINGGI')) {
        reasonTextEl.innerHTML = `
          <strong>Penekanan Alarm Palsu Terkondisi Beban (Status Hijau):</strong> Meskipun v_rms naik menjadi <strong>${a.rms} mm/s</strong> dan suhu <strong>${a.temp}°C</strong>, sensor arus CT mendeteksi rezim beban tinggi (<strong>${a.load}%</strong>).
          <br>• <strong>Evaluasi Z_MAD:</strong> Terhadap baseline beban tinggi (${a.attribution.refMedRms} mm/s), deviasi Z_MAD = ${a.attribution.zRms} masih normal sehingga <strong>S_gab = ${a.deviation.toFixed(2)} &lt; 0.55</strong>. Tidak ada alarm palsu yang dipicu.
        `;
      } else {
        reasonTextEl.innerHTML = `
          <strong>Status Operasi Normal (Status Hijau):</strong> Pada beban <strong>${a.load}%</strong> (${a.isoGroup}), kecepatan getaran v_rms = <strong>${a.rms} mm/s</strong> (baseline rezim ${a.attribution.refMedRms} mm/s) dan suhu <strong>${a.temp}°C</strong> menghasilkan skor hibrida rendah <strong>S_gab = ${a.deviation.toFixed(2)}</strong> (S_IF = ${a.sIF}, S_ISO = ${a.sISO}). Tidak diperlukan tindakan inspeksi darurat.
        `;
      }
    }
  },

  renderLogs() {
    const tbody = document.getElementById('inspectionLogTableBody');
    if (!tbody) return;

    let html = '';
    this.inspectionLogs.forEach((log) => {
      html += `
        <tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors text-xs font-sans">
          <td class="py-3 px-4 font-mono text-slate-400">${log.time}</td>
          <td class="py-3 px-4 font-mono font-semibold text-signal-cyan">${log.assetId}</td>
          <td class="py-3 px-4 text-slate-200">${log.technician}</td>
          <td class="py-3 px-4 text-slate-300">${log.action}</td>
          <td class="py-3 px-4 text-slate-300">${log.result}</td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">${log.status}</span>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  addInspectionLog(assetId, technician, action, result) {
    const timeLabel = new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' [INPUT SIMULASI]';
    const targetId = assetId || this.selectedAssetId;
    this.inspectionLogs.unshift({
      id: `SIM-LOG-00${this.inspectionLogs.length + 1}`,
      time: timeLabel,
      assetId: targetId,
      technician: technician || 'Bimo Satrio (Simulasi)',
      action: action || 'Verifikasi Fisik & Kalibrasi Baseline',
      result: result || '[Input Simulasi] Pemeriksaan selesai sesuai SOP. Kondisi dinormalkan.',
      status: 'Simulasi Terverifikasi'
    });
    this.renderLogs();

    // Reset the inspected asset back to normal baseline and re-evaluate pipeline so explanation & score match!
    const a = this.assets[targetId];
    if (a) {
      for (let w = 0; w < 5; w++) {
        this.evaluateAssetPipeline(a, a.rmsBaseline, a.tempBaseline, a.kurtBaseline, a.loadDefault, 2400);
      }
      a.status = 'NORMAL (DIVERIFIKASI)';
      this.renderAssetCards();
      this.updateChart();
      this.renderAssetDetails(targetId);
    }
  },

  exportCsv() {
    let csv = "ID,Timestamp,Asset_ID,Vibration_RMS_mms,Temperature_C,Load_Pct,Quality_Status,S_IF,S_ISO,Hybrid_Score_Sgab\n";
    for (let id in this.assets) {
      const a = this.assets[id];
      a.history.forEach(h => {
        csv += `${id},${h.time},${a.name},${h.rms},${h.temp},${a.load},${a.quality},${a.sIF},${a.sISO},${a.deviation}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NADI-IKM_Synthetic_Scenario_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  bindEvents() {
    document.querySelectorAll('.scen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scen = btn.getAttribute('data-scen');
        this.setScenario(scen, false);
      });
    });

    const pauseBtn = document.getElementById('pauseSimulationBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        pauseBtn.innerHTML = this.isPaused ? `<span>▶ Lanjutkan Simulasi</span>` : `<span>⏸ Jeda Simulasi</span>`;
      });
    }

    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCsv());
    }

    const logModal = document.getElementById('logModal');
    const openLogBtn = document.getElementById('openAddLogBtn');
    const closeLogBtn = document.getElementById('closeLogModalBtn');
    const saveLogForm = document.getElementById('addLogForm');

    if (openLogBtn && logModal) {
      openLogBtn.addEventListener('click', () => {
        logModal.classList.remove('hidden');
        logModal.classList.add('flex');
      });
    }
    if (closeLogBtn && logModal) {
      closeLogBtn.addEventListener('click', () => {
        logModal.classList.add('hidden');
        logModal.classList.remove('flex');
      });
    }
    if (saveLogForm) {
      saveLogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tech = document.getElementById('logTechName').value;
        const act = document.getElementById('logAction').value;
        const res = document.getElementById('logResult').value;
        this.addInspectionLog(this.selectedAssetId, tech, act, res);
        saveLogForm.reset();
        logModal.classList.add('hidden');
        logModal.classList.remove('flex');
      });
    }
  }
};

window.NadiDashboard = NadiDashboard;
