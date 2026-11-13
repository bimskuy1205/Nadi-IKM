/**
 * NADI-IKM Financial Sensitivity & Payback Calculator
 * Conforms to IYEEA 2026 Paper (Section 2.6, Tables 5 & 6, Figure 6).
 */

const NadiCalculator = {
  capex: 8000000, // Rp8.000.000 initial investment for 3 machines
  annualOpex: 3000000, // Rp2.000.000 OPEX + Rp1.000.000 False alarm overhead

  state: {
    hoursAvoided: 12,
    costPerHour: 1000000
  },

  init() {
    this.bindSliders();
    this.recalculate();
  },

  formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  },

  setScenario(type) {
    if (type === 'konservatif') {
      this.state.hoursAvoided = 4;
      this.state.costPerHour = 500000;
    } else if (type === 'moderat') {
      this.state.hoursAvoided = 12;
      this.state.costPerHour = 1000000;
    } else if (type === 'optimistis') {
      this.state.hoursAvoided = 20;
      this.state.costPerHour = 1500000;
    }

    const sliderH = document.getElementById('sliderHours');
    const sliderC = document.getElementById('sliderCost');
    if (sliderH) sliderH.value = this.state.hoursAvoided;
    if (sliderC) sliderC.value = this.state.costPerHour;

    this.recalculate();
  },

  recalculate() {
    const gross = this.state.hoursAvoided * this.state.costPerHour;
    const net = gross - this.annualOpex;
    const paybackMonths = net > 0 ? ((this.capex / net) * 12).toFixed(1) : null;

    // Update UI elements
    const hValEl = document.getElementById('sliderHoursVal');
    const cValEl = document.getElementById('sliderCostVal');
    const grossValEl = document.getElementById('calcGrossVal');
    const opexValEl = document.getElementById('calcOpexVal');
    const netValEl = document.getElementById('calcNetVal');
    const paybackValEl = document.getElementById('calcPaybackVal');
    const barEl = document.getElementById('calcNetBar');

    if (hValEl) hValEl.innerText = `${this.state.hoursAvoided} Jam`;
    if (cValEl) cValEl.innerText = this.formatRupiah(this.state.costPerHour);
    if (grossValEl) grossValEl.innerText = this.formatRupiah(gross);
    if (opexValEl) opexValEl.innerText = this.formatRupiah(this.annualOpex);

    if (netValEl) {
      netValEl.innerText = (net >= 0 ? '+' : '') + this.formatRupiah(net);
      if (net > 0) {
        netValEl.className = 'text-2xl lg:text-3xl font-mono font-bold text-emerald-400';
      } else {
        netValEl.className = 'text-2xl lg:text-3xl font-mono font-bold text-rose-400';
      }
    }

    if (paybackValEl) {
      if (paybackMonths) {
        paybackValEl.innerText = `≈ ${paybackMonths} Bulan`;
        paybackValEl.className = 'text-2xl lg:text-3xl font-mono font-bold text-signal-cyan';
      } else {
        paybackValEl.innerText = 'Tidak Tercapai (Defisit)';
        paybackValEl.className = 'text-xl font-mono font-bold text-rose-400';
      }
    }

    if (barEl) {
      const maxVal = 30000000;
      const pct = Math.min(100, Math.max(5, (Math.abs(net) / maxVal) * 100));
      barEl.style.width = `${pct}%`;
      barEl.className = `h-2 rounded-full transition-all duration-300 ${net >= 0 ? 'bg-gradient-to-r from-industrial-teal to-signal-cyan' : 'bg-rose-500'}`;
    }
  },

  bindSliders() {
    const sliderH = document.getElementById('sliderHours');
    const sliderC = document.getElementById('sliderCost');

    if (sliderH) {
      sliderH.addEventListener('input', (e) => {
        this.state.hoursAvoided = parseInt(e.target.value, 10);
        this.recalculate();
      });
    }

    if (sliderC) {
      sliderC.addEventListener('input', (e) => {
        this.state.costPerHour = parseInt(e.target.value, 10);
        this.recalculate();
      });
    }

    document.querySelectorAll('.econ-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-preset');
        this.setScenario(type);

        document.querySelectorAll('.econ-preset-btn').forEach(b => b.classList.remove('bg-industrial-teal', 'text-white'));
        btn.classList.add('bg-industrial-teal', 'text-white');
      });
    });
  }
};

window.NadiCalculator = NadiCalculator;
