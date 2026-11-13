/**
 * NADI-IKM Interactive Demonstration Dashboard Logic
 * Conforms to IYEEA 2026 Paper specifications (Section 2.4 & Figure 5).
 * Explicitly labeled: SYNTHETIC DATA GENERATOR & SCENARIO ENGINE.
 */

const NadiDashboard = {
  currentScenario: 'anomaly', // 'normal' | 'load_shift' | 'anomaly' | 'sensor_fault'
  selectedAssetId: 'M-02',
  isPaused: false,
  timer: null,

  assets: {
    'P-01': {
      id: 'P-01',
      name: 'Pompa Sentrifugal P-01',
      type: 'Pompa Sentrifugal',
      location: 'Area Utilitas Lini A',
      criticality: 'Tinggi (Aliran Pendingin)',
      status: 'NORMAL',
      statusClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      statusBadge: 'statusNormal',
      rms: 1.42,
      rmsBaseline: 1.35,
      temp: 42.5,
      tempBaseline: 41.0,
      load: 78,
      deviation: 0.28,
      quality: 'VALID',
      history: []
    },
    'M-02': {
      id: 'M-02',
      name: 'Motor Induksi M-02',
      type: 'Motor 3-Fasa 15 kW',
      location: 'Penggerak Konveyor Utama',
      criticality: 'Kritis (Lini Tunggal)',
      status: 'INSPEKSI',
      statusClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      statusBadge: 'statusInspect',
      rms: 4.85,
      rmsBaseline: 2.10,
      temp: 68.4,
      tempBaseline: 48.0,
      load: 85,
      deviation: 0.74,
      quality: 'VALID',
      history: []
    },
    'F-03': {
      id: 'F-03',
      name: 'Kipas Ventilasi Sentral F-03',
      type: 'Blower Sentrifugal',
      location: 'Atap Gedung Produksi',
      criticality: 'Sedang (Sirkulasi)',
      status: 'PERIKSA SENSOR',
      statusClass: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      statusBadge: 'statusSensorErr',
      rms: 0.05,
      rmsBaseline: 1.80,
      temp: 28.0,
      tempBaseline: 38.0,
      load: 0,
      deviation: 0.95,
      quality: 'SENSOR_FAULT',
      history: []
    }
  },

  inspectionLogs: [
    {
      id: 'LOG-001',
      time: '13 Nov 2026 10:15',
      assetId: 'M-02',
      technician: 'Suryo (Teknisi Mesin)',
      action: 'Pemeriksaan Bantalan Sisi Beban',
      result: 'Baut fondasi longgar 1/4 putaran; getaran menurun pasca pengencangan',
      status: 'Selesai'
    },
    {
      id: 'LOG-002',
      time: '12 Nov 2026 14:30',
      assetId: 'P-01',
      technician: 'Rahmat',
      action: 'Inspeksi Rutin Mingguan',
      result: 'Kondisi getaran normal dalam rentang baseline 1.4 mm/s',
      status: 'Normal'
    }
  ],

  init() {
    this.generateInitialHistory();
    this.initChart();
    this.renderAssetCards();
    this.renderAssetDetails(this.selectedAssetId);
    this.renderLogs();
    this.startSimulation();
    this.bindEvents();
  },

  generateInitialHistory() {
    const now = Date.now();
    for (let id in this.assets) {
      const asset = this.assets[id];
      asset.history = [];
      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 15000);
        const timeLabel = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const jitter = (Math.random() - 0.5) * 0.15;
        asset.history.push({
          time: timeLabel,
          rms: Math.max(0.1, +(asset.rms + jitter).toFixed(2)),
          temp: +(asset.temp + (Math.random() - 0.5) * 0.4).toFixed(1),
          baseline: asset.rmsBaseline
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
            borderColor: '#0DB3A6', // Industrial Teal
            backgroundColor: 'rgba(13, 179, 166, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          },
          {
            label: 'Ambang Baseline Teliti (mm/s)',
            data: baselineData,
            borderColor: '#F0A444', // Safety Amber
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false,
            yAxisID: 'y'
          },
          {
            label: 'Suhu Bantalan (°C)',
            data: tempData,
            borderColor: '#E96F67', // Alert Coral
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
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#94A3B8',
              font: { family: 'Plus Jakarta Sans', size: 12 }
            }
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

    for (let id in this.assets) {
      const asset = this.assets[id];
      let targetRms = asset.rmsBaseline;
      let targetTemp = asset.tempBaseline;

      // Adjust based on scenario
      if (this.currentScenario === 'normal') {
        asset.status = 'NORMAL';
        asset.deviation = 0.22;
        asset.quality = 'VALID';
        targetRms = asset.rmsBaseline + (Math.random() - 0.5) * 0.2;
        targetTemp = asset.tempBaseline + (Math.random() - 0.5) * 0.5;
      } else if (this.currentScenario === 'load_shift') {
        // Operational load bumped from 60% to 92%
        asset.load = 92;
        targetRms = asset.rmsBaseline * 1.35; // higher but within contextual tolerance
        targetTemp = asset.tempBaseline + 4;
        asset.deviation = 0.38; // not anomaly, just high load!
        asset.status = 'NORMAL (BEBAN TINGGI)';
        asset.quality = 'VALID';
      } else if (this.currentScenario === 'anomaly') {
        if (id === 'M-02') {
          asset.status = 'INSPEKSI';
          asset.deviation = 0.78;
          targetRms = 4.9 + Math.random() * 0.3;
          targetTemp = 69.2 + Math.random() * 0.8;
          asset.quality = 'VALID';
        } else {
          targetRms = asset.rmsBaseline + (Math.random() - 0.5) * 0.15;
          targetTemp = asset.tempBaseline;
        }
      } else if (this.currentScenario === 'sensor_fault') {
        if (id === 'F-03') {
          asset.status = 'PERIKSA SENSOR';
          asset.deviation = 0.99;
          targetRms = 0.02; // signal dropout
          asset.quality = 'KABEL_PUTUS';
        }
      }

      const newPoint = {
        time: timeLabel,
        rms: Math.max(0.01, +targetRms.toFixed(2)),
        temp: +targetTemp.toFixed(1),
        baseline: asset.rmsBaseline
      };

      asset.rms = newPoint.rms;
      asset.temp = newPoint.temp;
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
    this.chart.update('none'); // smooth realtime update
  },

  setScenario(scenName) {
    this.currentScenario = scenName;
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
        normal: 'Skenario Aktif: Seluruh 3 mesin beroperasi pada rentang baseline stabil. Skor deviasi rendah.',
        load_shift: 'Skenario Aktif: Beban motor dinaikkan menjadi 92%. Logika NADI-IKM memverifikasi konteks beban sehingga TIDAK memicu alarm palsu.',
        anomaly: 'Skenario Aktif: Anomali getaran bantalan terdeteksi pada M-02 (RMS 4.9 mm/s, Suhu 69°C). Status: INSPEKSI dengan SOP terarah.',
        sensor_fault: 'Skenario Aktif: Sinyal sensor F-03 terputus / dropout. NADI-IKM mengklasifikasikan sebagai PERIKSA SENSOR, bukan kerusakan mekanis.'
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
      if (a.status.includes('INSPEKSI')) badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
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
          <p class="text-xs text-slate-400 mb-4">${a.location}</p>

          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Getaran RMS</span>
              <span class="text-white font-bold text-sm">${a.rms} <span class="text-[10px] text-slate-400">mm/s</span></span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Suhu Bantalan</span>
              <span class="text-white font-bold text-sm">${a.temp} <span class="text-[10px] text-slate-400">°C</span></span>
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

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
      devScoreEl.innerText = `${(a.deviation * 100).toFixed(0)}%`;
      devScoreEl.className = `text-2xl font-mono font-bold ${a.deviation > 0.6 ? 'text-amber-400' : 'text-emerald-400'}`;
    }

    if (reasonTextEl) {
      if (a.id === 'M-02') {
        reasonTextEl.innerHTML = `
          <strong>Penjelasan Algoritma (Explainability):</strong> Getaran RMS sumbu radial meningkat <strong>+130%</strong> di atas baseline stabil pada beban 85%. Tren suhu naik <strong>+20.4°C</strong> dalam 45 menit pengamatan. 
          <br><span class="text-amber-300 font-medium">Anjuran:</span> Periksa kekencangan baut dudukan motor dan pelumasan bantalan sebelum giliran kerja berikutnya. <em>(Bukan diagnosis kerusakan pasti; verifikasi langsung diwajibkan).</em>
        `;
      } else if (a.id === 'F-03') {
        reasonTextEl.innerHTML = `
          <strong>Peringatan Mutu Sinyal:</strong> Amplitudo getaran tercatat mendekati 0.00 mm/s saat motor terdaftar aktif. Kualitas data: <span class="text-sky-300 font-semibold">SENSOR_FAULT</span>.
          <br><span class="text-sky-300 font-medium">Anjuran:</span> Periksa konektor kabel probe dan pengkabelan catu daya sensor sebelum memeriksa komponen mekanis blower.
        `;
      } else {
        reasonTextEl.innerHTML = `
          <strong>Status Normal:</strong> Seluruh fitur getaran radial, aksial, dan suhu permukaan berada dalam rentang toleransi baseline ISO 20816-3. Tidak diperlukan tindakan inspeksi darurat.
        `;
      }
    }
  },

  renderLogs() {
    const tbody = document.getElementById('inspectionLogTableBody');
    if (!tbody) return;

    let html = '';
    this.inspectionLogs.forEach((log, index) => {
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
    const timeLabel = new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    this.inspectionLogs.unshift({
      id: `LOG-00${this.inspectionLogs.length + 1}`,
      time: timeLabel,
      assetId: assetId || this.selectedAssetId,
      technician: technician || 'Bimo Satrio (Lead)',
      action: action || 'Verifikasi Fisik & Baseline Ulang',
      result: result || 'Pemeriksaan selesai sesuai SOP. Status dinormalkan.',
      status: 'Terverifikasi'
    });
    this.renderLogs();

    // Reset status to normal if M-02 was inspected
    if (this.selectedAssetId === 'M-02') {
      this.assets['M-02'].status = 'NORMAL (DIVERIFIKASI)';
      this.assets['M-02'].deviation = 0.32;
      this.renderAssetCards();
      this.renderAssetDetails('M-02');
    }
  },

  exportCsv() {
    let csv = "ID,Timestamp,Asset_ID,Vibration_RMS_mms,Temperature_C,Load_Pct,Quality_Status,Deviation_Score\n";
    for (let id in this.assets) {
      const a = this.assets[id];
      a.history.forEach(h => {
        csv += `${id},${h.time},${a.name},${h.rms},${h.temp},${a.load},${a.quality},${a.deviation}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NADI-IKM_Synthetic_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  bindEvents() {
    // Scenario buttons
    document.querySelectorAll('.scen-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scen = btn.getAttribute('data-scen');
        this.setScenario(scen);
      });
    });

    // Pause button
    const pauseBtn = document.getElementById('pauseSimulationBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        pauseBtn.innerHTML = this.isPaused ? `<span>▶ Lanjutkan Data</span>` : `<span>⏸ Jeda Data</span>`;
      });
    }

    // Export CSV button
    const exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCsv());
    }

    // Modal Add Log
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
