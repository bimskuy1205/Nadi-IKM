/**
 * NADI-IKM Interactive Scenario Simulator & Hybrid Decision Pipeline
 * Conforms strictly to IYEEA 2026 Paper V6 (Sections 2.3, 2.4, 2.5).
 * Executes:
 *  1) Deterministic Mulberry32 PRNG (_seed = 20261117)
 *  2) Stage 0: Machine Operating State Check (BEROPERASI vs BERHENTI if I_rms < 15%)
 *  3) Stage 1: Signal Quality Check (indication of PERIKSA SENSOR only while BEROPERASI)
 *  4) Stage 2: Load-Conditioned Robust Deviation (Z_MAD conditioned on CT load I_rms)
 *  5) Stage 3: Genuine Trained scikit-learn 100-Tree IsolationForest (when loaded)
 *              + S_ISO normalized index -> Unified Eq. (5):
 *              S_gab(t) = alpha * S_ISO(t) + (1 - alpha) * s_IF(t), alpha = 0.5
 *  6) Stage 4: Persistence Filter (M=3 of N=5 windows) with unified initial
 *              design thresholds: 0.55 (PANTAU / KUNING) and 0.75 (INSPEKSI / MERAH)
 */

const NadiDashboard = {
  currentScenario: 'anomaly', // 'normal' | 'load_shift' | 'anomaly' | 'sensor_fault'
  selectedAssetId: 'M-02',
  isPaused: false,
  timer: null,
  _seed: 20261117,

  // Fallback average path length c(psi) for psi = 256 per Liu et al. (2008)
  cFactor(n) {
    if (n <= 1) return 0;
    if (n === 2) return 1;
    return 2.0 * (Math.log(n - 1) + 0.5772156649) - (2.0 * (n - 1)) / n;
  },

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
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Kaku (Perlu Verifikasi Klasifikasi)',
      isoLimits: { vA: 1.8, vB: 2.8, vC: 4.5 },
      location: 'Area Utilitas Lini A',
      criticality: 'Tinggi (Aliran Pendingin)',
      operatingState: 'BEROPERASI',
      status: 'NORMAL',
      rms: 1.38,
      rmsBaseline: 1.35,
      temp: 41.4,
      tempBaseline: 41.0,
      ambientTemp: 25.0,
      kurtosis: 3.05,
      kurtBaseline: 3.00,
      mountResonanceHz: 2420,
      load: 76,
      loadDefault: 76,
      regimeStats: {
        low:     { medRms: 1.15, madRms: 0.08, medTemp: 14.0, madTemp: 0.7, medKurt: 2.95, madKurt: 0.12 },
        nominal: { medRms: 1.35, madRms: 0.10, medTemp: 16.0, madTemp: 0.8, medKurt: 3.00, madKurt: 0.15 },
        high:    { medRms: 1.85, madRms: 0.14, medTemp: 19.8, madTemp: 1.0, medKurt: 3.08, madKurt: 0.16 }
      },
      deviation: 0.24,
      sIF: 0.47,
      sISO: 0.00,
      zMadMax: 0.35,
      dominantIndicators: { rmsPct: 40, kurtPct: 30, tempPct: 30, zRms: 0.2, zKurt: 0.1, zTemp: 0.1, regimeKey: 'nominal', refMedRms: 1.35 },
      quality: 'VALID',
      scoreWindow: [0.24, 0.24, 0.24, 0.24, 0.24],
      history: []
    },
    'M-02': {
      id: 'M-02',
      name: 'Motor Induksi M-02',
      type: 'Motor 3-Fasa 22 kW (1.480 rpm)',
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Kaku (Perlu Verifikasi Kopling)',
      isoLimits: { vA: 1.8, vB: 2.8, vC: 4.5 },
      location: 'Penggerak Konveyor Utama',
      criticality: 'Kritis (Lini Tunggal)',
      operatingState: 'BEROPERASI',
      status: 'INSPEKSI',
      rms: 4.85,
      rmsBaseline: 2.10,
      temp: 68.4,
      tempBaseline: 43.5,
      ambientTemp: 25.0,
      kurtosis: 6.40,
      kurtBaseline: 3.02,
      mountResonanceHz: 2390,
      load: 82,
      loadDefault: 82,
      // Regime medians anchored to benchmark_isolation_forest.py (when available, updated in init)
      regimeStats: {
        low:     { medRms: 1.6539, madRms: 0.0581, medTemp: 14.9913, madTemp: 0.5003, medKurt: 2.9537, madKurt: 0.0738 },
        nominal: { medRms: 2.1034, madRms: 0.0749, medTemp: 18.5107, madTemp: 0.6856, medKurt: 3.0171, madKurt: 0.0891 },
        high:    { medRms: 3.0447, madRms: 0.1106, medTemp: 23.0044, madTemp: 0.8048, medKurt: 3.1489, madKurt: 0.1063 }
      },
      deviation: 0.86,
      sIF: 0.72,
      sISO: 1.00,
      zMadMax: 15.0,
      dominantIndicators: { rmsPct: 45, kurtPct: 30, tempPct: 25, zRms: 12.0, zKurt: 10.0, zTemp: 8.0, regimeKey: 'nominal', refMedRms: 2.10 },
      quality: 'VALID',
      scoreWindow: [0.86, 0.86, 0.86, 0.86, 0.86],
      history: []
    },
    'F-03': {
      id: 'F-03',
      name: 'Kipas Ventilasi Sentral F-03',
      type: 'Blower Sentrifugal 15 kW (1.460 rpm)',
      isoGroup: 'ISO 20816-3 Kelompok 2 • Tumpuan Fleksibel (Perlu Verifikasi Daya)',
      isoLimits: { vA: 2.3, vB: 4.5, vC: 7.1 },
      location: 'Atap Gedung Produksi',
      criticality: 'Sedang (Sirkulasi)',
      operatingState: 'BEROPERASI',
      status: 'NORMAL',
      rms: 1.82,
      rmsBaseline: 1.80,
      temp: 38.2,
      tempBaseline: 38.0,
      ambientTemp: 25.0,
      kurtosis: 3.02,
      kurtBaseline: 3.00,
      mountResonanceHz: 2410,
      load: 74,
      loadDefault: 74,
      regimeStats: {
        low:     { medRms: 1.50, madRms: 0.10, medTemp: 11.0, madTemp: 0.8, medKurt: 2.96, madKurt: 0.14 },
        nominal: { medRms: 1.80, madRms: 0.13, medTemp: 13.0, madTemp: 1.0, medKurt: 3.00, madKurt: 0.16 },
        high:    { medRms: 2.42, madRms: 0.18, medTemp: 16.8, madTemp: 1.3, medKurt: 3.10, madKurt: 0.19 }
      },
      deviation: 0.24,
      sIF: 0.47,
      sISO: 0.00,
      zMadMax: 0.42,
      dominantIndicators: { rmsPct: 38, kurtPct: 32, tempPct: 30, zRms: 0.2, zKurt: 0.1, zTemp: 0.1, regimeKey: 'nominal', refMedRms: 1.80 },
      quality: 'VALID',
      scoreWindow: [0.24, 0.24, 0.24, 0.24, 0.24],
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
    // Sync M-02 regimeStats directly from trained model exported by Python benchmark when loaded
    if (window.NADI_TRAINED_IF_MODEL && window.NADI_TRAINED_IF_MODEL.regimeStats) {
      this.assets['M-02'].regimeStats = window.NADI_TRAINED_IF_MODEL.regimeStats;
    }
    this.setScenario(this.currentScenario, true);
    this.generateInitialHistory();
    this.initChart();
    this.renderAssetCards();
    this.renderAssetDetails(this.selectedAssetId);
    this.renderLogs();
    this.startSimulation();
    this.bindEvents();
  },

  // Genuine scikit-learn trained IsolationForest path length scoring: s(z, psi) = 2^(-E[h(z)] / c(psi))
  computeIsolationForestScore(zVec) {
    const model = window.NADI_TRAINED_IF_MODEL;
    if (model && model.trees && model.trees.length > 0) {
      let totalPath = 0;
      const trees = model.trees;
      for (let i = 0; i < trees.length; i++) {
        const t = trees[i];
        let node = 0;
        let depth = 0;
        while (t.l[node] !== -1) {
          const featIdx = t.f[node];
          node = zVec[featIdx] <= t.t[node] ? t.l[node] : t.r[node];
          depth += 1;
        }
        const nLeaf = t.s[node];
        totalPath += depth + this.cFactor(nLeaf);
      }
      const avgPath = totalPath / trees.length;
      const sIF = Math.pow(2.0, -avgPath / model.meta.c_psi);
      return Math.min(0.99, Math.max(0.05, +sIF.toFixed(3)));
    }
    // Fallback deterministic monotonic mapping matching Liu et al. (2008) scale [0.42..0.85]
    const norm = Math.sqrt(zVec[0] * zVec[0] + zVec[1] * zVec[1] + zVec[2] * zVec[2]);
    return Math.min(0.95, Math.max(0.45, +(0.45 + 0.40 * (1 - Math.exp(-norm / 10.0))).toFixed(3)));
  },

  getLoadRegime(loadPct) {
    if (loadPct < 60) return 'low';
    if (loadPct <= 85) return 'nominal';
    return 'high';
  },

  // 3-Stage Decision Pipeline strictly aligned with Paper V6 §2.4 (Eq. 4 & Eq. 5)
  evaluateAssetPipeline(asset, sampleRms, sampleTemp, sampleKurt, sampleLoad, sampleMountHz) {
    asset.rms = +sampleRms.toFixed(2);
    asset.temp = +sampleTemp.toFixed(1);
    asset.kurtosis = +sampleKurt.toFixed(2);
    asset.load = Math.round(sampleLoad);
    asset.mountResonanceHz = Math.round(sampleMountHz);

    // STAGE 0: Machine Operating State Gate (must NOT declare sensor fault when idle/stopped!)
    if (asset.load < 15) {
      asset.operatingState = 'BERHENTI / SIAGA';
      asset.quality = 'TIDAK DIEVALUASI (MESIN MATI)';
      asset.status = 'BERHENTI';
      asset.deviation = 0.0;
      asset.sIF = 0.0;
      asset.sISO = 0.0;
      asset.zMadMax = 0.0;
      return;
    }
    asset.operatingState = 'BEROPERASI';

    // STAGE 1: Signal Quality Check (only evaluated while machine is BEROPERASI)
    if (asset.rms < 0.08) {
      asset.quality = 'DROPOUT / FLATLINE (BEROPERASI)';
      asset.status = 'PERIKSA SENSOR';
      asset.deviation = 0.0;
      asset.sIF = 0.0;
      asset.sISO = 0.0;
      asset.zMadMax = 0.0;
      return;
    }
    if (asset.mountResonanceHz < 1000) {
      asset.quality = `INDIKASI RESONANSI SKENARIO (${asset.mountResonanceHz} Hz < 1 kHz)`;
      asset.status = 'PERIKSA SENSOR';
      asset.deviation = 0.0;
      asset.sIF = 0.0;
      asset.sISO = 0.0;
      asset.zMadMax = 0.0;
      return;
    }
    asset.quality = 'VALID';

    // STAGE 2: Load-Conditioned Z_MAD Calculation (Eq. 4)
    const regimeKey = this.getLoadRegime(asset.load);
    const ref = asset.regimeStats[regimeKey];
    const dT = Math.max(1.0, asset.temp - asset.ambientTemp);
    const zRms = Math.abs(asset.rms - ref.medRms) / (1.4826 * ref.madRms + 1e-6);
    const zKurt = Math.abs(asset.kurtosis - ref.medKurt) / (1.4826 * ref.madKurt + 1e-6);
    const zTemp = Math.abs(dT - ref.medTemp) / (1.4826 * ref.madTemp + 1e-6);
    asset.zMadMax = +Math.max(zRms, zKurt, zTemp).toFixed(2);

    // Compute proportion of Z_MAD deviation strictly as rule-based priority indicator (NOT AI SHAP causality)
    const zSum = zRms + zKurt + zTemp + 1e-6;
    const rmsPct = Math.round((zRms / zSum) * 100);
    const kurtPct = Math.round((zKurt / zSum) * 100);
    const tempPct = Math.max(0, 100 - rmsPct - kurtPct);
    asset.dominantIndicators = {
      rmsPct, kurtPct, tempPct,
      zRms: +zRms.toFixed(2), zKurt: +zKurt.toFixed(2), zTemp: +zTemp.toFixed(2),
      regimeKey, refMedRms: +ref.medRms.toFixed(2)
    };

    // STAGE 3: Unified Eq. (5) -> S_gab(t) = alpha * S_ISO(t) + (1 - alpha) * s_IF(t), alpha = 0.5
    const sIF = this.computeIsolationForestScore([zRms, zKurt, zTemp]);
    const { vA, vC } = asset.isoLimits;
    const sISO = Math.min(1.0, Math.max(0.0, (asset.rms - vA) / (vC - vA)));
    const alpha = 0.5;
    const sGab = +(alpha * sISO + (1.0 - alpha) * sIF).toFixed(2);

    asset.sIF = +sIF.toFixed(2);
    asset.sISO = +sISO.toFixed(2);
    asset.deviation = sGab;

    // STAGE 4: Hysteresis Persistence Filter (M=3 of N=5 windows) with unified initial thresholds 0.55 & 0.75
    asset.scoreWindow.push(sGab);
    if (asset.scoreWindow.length > 5) asset.scoreWindow.shift();

    const countRed = asset.scoreWindow.filter(s => s >= 0.75).length;
    const countYellow = asset.scoreWindow.filter(s => s >= 0.55).length;

    if (countRed >= 3) {
      asset.status = 'INSPEKSI';
    } else if (countYellow >= 3) {
      asset.status = 'PANTAU';
    } else if (regimeKey === 'high') {
      asset.status = 'NORMAL (BEBAN TINGGI)';
    } else {
      asset.status = 'NORMAL';
    }
  },

  applyScenarioState(scenName, resetWindow = false) {
    for (let id in this.assets) {
      const a = this.assets[id];
      const jitterRms = (this.nextRand() - 0.5) * 0.06;
      const jitterTemp = (this.nextRand() - 0.5) * 0.25;

      let simRms = a.rmsBaseline + jitterRms;
      let simTemp = a.tempBaseline + jitterTemp;
      let simKurt = a.kurtBaseline + (this.nextRand() - 0.5) * 0.05;
      let simLoad = a.loadDefault;
      let simMountHz = 2400;

      if (scenName === 'load_shift') {
        simLoad = 92;
        simRms = a.regimeStats.high.medRms + jitterRms;
        simTemp = a.ambientTemp + a.regimeStats.high.medTemp + jitterTemp;
        simKurt = a.regimeStats.high.medKurt + 0.03;
      } else if (scenName === 'anomaly' && id === 'M-02') {
        simLoad = 82;
        simRms = 4.88 + jitterRms;
        simTemp = 68.5 + jitterTemp;
        simKurt = 6.35;
      } else if (scenName === 'sensor_fault' && id === 'F-03') {
        simLoad = 74; // Active motor load verifies fault is in acquisition chain, NOT stopped machine
        simRms = 0.02;
        simTemp = 38.0;
        simMountHz = 380;
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
      const activeBaseline = +asset.regimeStats[activeRegime].medRms.toFixed(2);
      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 15000);
        const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const jitter = (this.nextRand() - 0.5) * 0.10;
        asset.history.push({
          time: timeLabel,
          rms: Math.max(0.02, +(asset.rms + jitter).toFixed(2)),
          temp: +(asset.temp + (this.nextRand() - 0.5) * 0.30).toFixed(1),
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
          legend: { labels: { color: '#94A3B8', font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: {
            backgroundColor: '#0A1F2E',
            borderColor: '#173447',
            borderWidth: 1,
            titleColor: '#59D8D1',
            bodyColor: '#F8FAFC'
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 10 } } },
          y: {
            type: 'linear', display: true, position: 'left',
            title: { display: true, text: 'Vibration RMS (mm/s)', color: '#0DB3A6' },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }, ticks: { color: '#94A3B8' }
          },
          y1: {
            type: 'linear', display: true, position: 'right',
            title: { display: true, text: 'Temperature (°C)', color: '#E96F67' },
            grid: { drawOnChartArea: false }, ticks: { color: '#94A3B8' }
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
      const activeBaseline = +asset.regimeStats[activeRegime].medRms.toFixed(2);
      asset.history.push({ time: timeLabel, rms: asset.rms, temp: asset.temp, baseline: activeBaseline });
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
      const m02Score = this.assets['M-02'].deviation.toFixed(2);
      const msgs = {
        normal: 'Skenario Simulasi Aktif [NORMAL]: Mesin beroperasi (I_rms ≥ 15%) pada rezim nominal. Skor hibrida S_gab < 0.55 (parameter awal).',
        load_shift: 'Skenario Simulasi Aktif [LONJAKAN BEBAN 92%]: Normalisasi Z_MAD bergeser ke baseline beban tinggi sehingga S_gab tetap < 0.55 (tanpa alarm palsu).',
        anomaly: `Skenario Simulasi Aktif [ANOMALI BANTALAN M-02]: Getaran naik disertai peningkatan kurtosis & suhu. Skor hibrida S_gab = ${m02Score} ≥ 0.75 (3/5 jendela) → Status INSPEKSI.`,
        sensor_fault: 'Skenario Simulasi Aktif [INDIKASI GANGGUAN SENSOR F-03]: Mesin beroperasi (beban 74%), namun sinyal sensor terindikasi dropout/kendur → Status BIRU (indikasi perlu pemeriksaan sensor).'
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
      if (a.status.includes('INSPEKSI')) badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      else if (a.status.includes('PANTAU')) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      else if (a.status.includes('PERIKSA SENSOR')) badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      else if (a.status.includes('BERHENTI')) badgeColor = 'bg-slate-600/20 text-slate-300 border-slate-500/30';

      html += `
        <div onclick="NadiDashboard.selectAsset('${a.id}')" class="cursor-pointer bg-deep-steel/80 backdrop-blur rounded-2xl p-5 border ${borderClass} transition-all duration-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-bold text-signal-cyan px-2.5 py-1 rounded-md bg-signal-cyan/10 border border-signal-cyan/20">${a.id}</span>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeColor}">
              <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${a.status.includes('INSPEKSI') ? 'bg-rose-400 animate-pulse' : a.status.includes('PANTAU') ? 'bg-amber-400' : a.status.includes('PERIKSA') ? 'bg-sky-400' : 'bg-emerald-400'}"></span>
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

    // Update top KPI cards dynamically so numbers match active scenario 100%
    const allAssets = Object.values(this.assets);
    const nNorm = allAssets.filter(x => x.status.includes('NORMAL')).length;
    const nWarn = allAssets.filter(x => x.status.includes('INSPEKSI') || x.status.includes('PANTAU')).length;
    const nSens = allAssets.filter(x => x.status.includes('PERIKSA SENSOR')).length;
    const kpiSum = document.getElementById('kpiSummaryCounts');
    if (kpiSum) {
      kpiSum.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ${nNorm} Normal • ${nWarn} Inspeksi • ${nSens} Sensor`;
    }
    const alertAssets = allAssets.filter(x => x.status.includes('INSPEKSI') || x.status.includes('PANTAU') || x.status.includes('PERIKSA SENSOR'));
    const kpiAlert = document.getElementById('kpiAlertAsset');
    const kpiAlertSub = document.getElementById('kpiAlertSub');
    if (kpiAlert && kpiAlertSub) {
      if (alertAssets.length > 0) {
        kpiAlert.innerText = `${alertAssets.length} Aset (${alertAssets.map(x => x.id).join(', ')})`;
        kpiAlertSub.innerText = alertAssets[0].status.includes('PERIKSA') ? 'Indikasi perlu pemeriksaan sensor' : 'Deviasi S_gab persisten ≥ 3/5 jendela';
      } else {
        kpiAlert.innerText = '0 Aset';
        kpiAlertSub.innerText = 'Seluruh unit dalam batas awal';
      }
    }
    const nValid = allAssets.filter(x => x.quality === 'VALID').length;
    const kpiSig = document.getElementById('kpiSignalValidity');
    const kpiSigSub = document.getElementById('kpiSignalSub');
    if (kpiSig && kpiSigSub) {
      kpiSig.innerText = `${nValid}/${allAssets.length} Valid`;
      const bad = allAssets.find(x => x.quality !== 'VALID');
      kpiSigSub.innerText = bad ? `${bad.id}: ${bad.quality}` : 'Gerbang mutu aktif saat beroperasi';
    }
  },

  renderAssetDetails(id) {
    const a = this.assets[id];
    if (!a) return;

    const titleEl = document.getElementById('selectedAssetTitle');
    const badgeEl = document.getElementById('selectedAssetBadge');
    const devScoreEl = document.getElementById('selectedDevScore');
    const reasonTextEl = document.getElementById('selectedReasonText');

    if (titleEl) titleEl.innerText = `${a.id} • ${a.name} (${a.operatingState})`;
    if (badgeEl) {
      badgeEl.innerText = a.status;
      let cls = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      if (a.status.includes('INSPEKSI')) cls = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      else if (a.status.includes('PANTAU')) cls = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      else if (a.status.includes('PERIKSA')) cls = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      badgeEl.className = `px-3 py-1 rounded-full text-xs font-semibold border ${cls}`;
    }
    if (devScoreEl) {
      if (a.status.includes('PERIKSA SENSOR')) {
        devScoreEl.innerText = `CEK SENSOR`;
        devScoreEl.className = `text-xl font-mono font-bold text-sky-400`;
      } else if (a.status.includes('BERHENTI')) {
        devScoreEl.innerText = `SIAGA`;
        devScoreEl.className = `text-xl font-mono font-bold text-slate-400`;
      } else {
        devScoreEl.innerText = `${a.deviation.toFixed(2)} (${(a.deviation * 100).toFixed(0)}%)`;
        devScoreEl.className = `text-xl font-mono font-bold ${a.deviation >= 0.75 ? 'text-rose-400' : a.deviation >= 0.55 ? 'text-amber-400' : 'text-emerald-400'}`;
      }
    }

    if (reasonTextEl) {
      if (a.status.includes('BERHENTI')) {
        reasonTextEl.innerHTML = `
          <strong>Mesin Berhenti / Siaga (Beban ${a.load}% &lt; 15%):</strong> Evaluasi anomali getaran dibekukan agar mesin mati tidak disalahartikan sebagai sensor rusak.
        `;
      } else if (a.status.includes('PERIKSA SENSOR')) {
        reasonTextEl.innerHTML = `
          <strong>Indikasi Perlunya Pemeriksaan Sensor (Status Biru):</strong> Mesin terpantau beroperasi (beban ${a.load}%), namun mutu sinyal menunjukkan <span class="text-sky-300 font-semibold">${a.quality}</span>.
          <br><span class="text-sky-300 font-medium">Penjelasan Berbasis Aturan:</span> Status ini merupakan indikasi awal pemeriksaan rantai sensor/dudukan magnet sebelum mengambil kesimpulan kondisi mekanis mesin.
        `;
      } else if (a.status.includes('INSPEKSI') || a.status.includes('PANTAU')) {
        const ind = a.dominantIndicators;
        const pctOver = Math.round(((a.rms - ind.refMedRms) / ind.refMedRms) * 100);
        reasonTextEl.innerHTML = `
          <strong>Penjelasan Berbasis Aturan & Indikator Dominan Penyimpangan (Z_MAD):</strong> Skor gabungan <strong>S_gab = ${a.deviation.toFixed(2)}</strong> [0.5·S_ISO(${a.sISO}) + 0.5·s_IF(${a.sIF})] pada beban ${a.load}% (${ind.regimeKey}).
          <br>• <strong>Prioritas Pemeriksaan Fisik:</strong> Deviasi dominan pada Getaran v_rms (${ind.rmsPct}%; +${pctOver}% di atas median rezim ${ind.refMedRms} mm/s), Kurtosis (${ind.kurtPct}%; κ=${a.kurtosis}), dan Suhu (${ind.tempPct}%; ${a.temp}°C).
          <br><span class="text-amber-300 text-[11px]"><em>Catatan: seluruh ambang (0.55 / 0.75) bersifat awal dan belum tervalidasi sebagai ambang keselamatan. Wajib verifikasi LOTO.</em></span>
        `;
      } else {
        const ind = a.dominantIndicators;
        reasonTextEl.innerHTML = `
          <strong>Status Operasi Normal (${a.operatingState}):</strong> Pada beban <strong>${a.load}%</strong>, v_rms = <strong>${a.rms} mm/s</strong> (median rezim ${ind.refMedRms} mm/s) dan suhu <strong>${a.temp}°C</strong> menghasilkan <strong>S_gab = ${a.deviation.toFixed(2)}</strong> (&lt; 0.55; ambang awal desain). Tidak diperlukan inspeksi darurat.
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
    let csv = "ID,Timestamp,Asset_ID,Operating_State,Vibration_RMS_mms,Temperature_C,Load_Pct,Quality_Status,S_IF,S_ISO,Hybrid_Score_Sgab\n";
    for (let id in this.assets) {
      const a = this.assets[id];
      a.history.forEach(h => {
        csv += `${id},${h.time},${a.name},${a.operatingState},${h.rms},${h.temp},${a.load},${a.quality},${a.sIF},${a.sISO},${a.deviation}\n`;
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
