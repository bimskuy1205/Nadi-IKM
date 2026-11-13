/**
 * NADI-IKM Bilingual Translations (ID / EN)
 * Complete coverage for landing page, 3D lab, dashboard, tech, economics, and team sections.
 */
const translations = {
  id: {
    // Nav & System
    brandName: "NADI-IKM",
    brandTagline: "Intelligent Machine Care",
    navHome: "Beranda",
    navTech: "Teknologi",
    navExplore: "3D Product Lab",
    navDashboard: "Demo Dashboard",
    navPilot: "Peta Pilot",
    navEconomics: "Kalkulator Dampak",
    navResearch: "Riset & Paper",
    navTeam: "Struktur Tim",
    badgeConcept: "RANCANGAN KONSEPTUAL • DEMO SINTETIS",
    ctaExplore3D: "Jelajahi 3D Lab",
    ctaDashboard: "Buka Dashboard Demo",
    ctaReadPaper: "Unduh Ringkasan Riset",
    institution: "Universitas Brawijaya • IYEEA 2026",

    // Hero
    heroHeadline: "Sebelum mesin berhenti, pahami sinyalnya.",
    heroSubhead: "NADI-IKM menghadirkan sistem pemantauan kondisi mesin berbasis edge AI retrofit bagi industri kecil & menengah (IKM). Mengubah getaran mikro dan tren termal menjadi anjuran inspeksi yang logis, hemat data, dan tanpa ketergantungan internet penuh.",
    heroStat1Val: "Rp8.000.000",
    heroStat1Label: "Asumsi Investasi Awal 3 Mesin",
    heroStat2Val: "10,7 Bulan",
    heroStat2Label: "Payback Skenario Moderat",
    heroStat3Val: "100%",
    heroStat3Label: "Pemrosesan Lokal Mandiri",

    // Problem Section
    problemBadge: "AKAR MASALAH IKM",
    problemTitle: "Gangguan kecil. Dampak produksi yang besar.",
    problemDesc: "IKM mengoperasikan 4,2 juta unit usaha dengan 12,3 juta tenaga kerja di Indonesia. Kerusakan pada satu motor penggerak atau pompa utama dapat menghentikan seluruh lini perakitan.",
    prob1Title: "Aset Kritis Tanpa Prioritas",
    prob1Desc: "Sensor dipasang membabi buta atau diabaikan sama sekali. Padahal kerusakan motor tunggal jauh lebih fatal dibanding kipas bantu.",
    prob2Title: "Data Rusak Sangat Sedikit",
    prob2Desc: "IKM jarang memiliki log kegagalan historis ribuan jam. Model AI komersial konvensional gagal dilatih tanpa data rusak.",
    prob3Title: "Alarm Tanpa Konteks Operasi",
    prob3Desc: "Getaran melonjak saat beban naik atau start-up sering memicu alarm palsu hingga teknisi mematikan buzzer peringatan.",
    prob4Title: "Keputusan Terlambat & Reaktif",
    prob4Desc: "Perawatan dilakukan setelah mesin berasap atau macet total, memicu biaya lembur perbaikan darurat dan kehilangan pesanan.",

    // 4 Pillars
    pillarBadge: "PENDEKATAN NADI-IKM",
    pillarTitle: "Empat Fondasi Inovasi Bertanggung Jawab",
    p1Title: "1. Audit Kekritisan Aset",
    p1Desc: "Fokus pada 3 mesin inti terpenting berdasarkan dampak penghentian, kemudahan suku cadang, dan risiko keselamatan.",
    p2Title: "2. Baseline Spesifik per Mesin",
    p2Desc: "Model belajar dari kondisi normal masing-masing unit tanpa ambang getaran seragam yang kaku (ISO 17359 / 20816-3).",
    p3Title: "3. Alarm yang Dapat Dijelaskan",
    p3Desc: "Bukan persentase probabilitas hitam, melainkan bukti: deviasi RMS, tren suhu, validasi mutu sinyal, dan rekomendasi SOP.",
    p4Title: "4. Kendali Tetap di Teknisi",
    p4Desc: "Tanpa shutdown otomatis berbahaya. Sistem adalah asisten navigasi; keputusan tindakan keselamatan mutlak di tangan teknisi.",

    // 3D Product Lab
    labBadge: "ANATOMI PERANGKAT RETROFIT",
    labTitle: "Kenali Setiap Komponen, Lapis demi Lapis.",
    labDesc: "Kit sensor retrofit non-invasif NADI-IKM dirancang untuk dipasang tanpa memodifikasi sirkuit kendali utama (PLC) mesin industri.",
    explodeSlider: "Tingkat Explode View (Pemisahan)",
    xrayToggle: "Mode Transparansi / X-Ray",
    btnResetView: "Reset Posisi",
    btnIsoView: "Tampak Isometrik",
    btnTopView: "Tampak Atas",
    partEnclosure: "Housing Enclosure Polikarbonat",
    partEnclosureDesc: "Tutup atas polikarbonat tahan benturan dengan ventilasi labirin termal dan indikator status akrilik.",
    partEsp: "Modul Komputasi Tepi (Edge MCU)",
    partEspDesc: "Mikrokontroler ESP32-S3 dengan akselerasi DSP untuk kalkulasi FFT, RMS getaran, dan pemfilteran kualitas sinyal lokal.",
    partMems: "Akselerometer MEMS Triaksial",
    partMemsDesc: "Sensor getaran bandwidth 1-2 kHz dengan pelat peredam kopling mekanik untuk penempelan presisi di bantalan mesin.",
    partTemp: "Probe Suhu RTD Industri",
    partTempDesc: "Sensor suhu permukaan berpelindung silikon fleksibel dengan isolasi galvanik termal hingga 125°C.",
    partPower: "Modul Catu Daya & Proteksi TVS",
    partPowerDesc: "Konverter daya teregulasi dengan proteksi tegangan lebih, sekering pemulihan mandiri, dan isolasi noise industri.",
    partMount: "Dudukan Magnetik & Stud Baut M8",
    partMountDesc: "Basis dudukan baja nirkarat dengan magnet neodymium berkekuatan tinggi untuk pemasangan retrofit cepat tanpa bor.",

    // 4-Layer Architecture
    archBadge: "ARSITEKTUR 4 LAPIS",
    archTitle: "Dari Getaran Menjadi Keputusan Terarah",
    archL1Title: "Lapisan 1: Akuisisi Sinyal",
    archL1Desc: "Pembacaan frekuensi tinggi getaran (1-2 kHz) dan suhu interval 15 detik dengan validasi kabel longgar.",
    archL2Title: "Lapisan 2: Komputasi Tepi (Edge)",
    archL2Desc: "Ekstraksi fitur statistik ringkas (RMS, kurtosis, deviasi median robust MAD) langsung pada mikrokontroler.",
    archL3Title: "Lapisan 3: Gateway & Visualisasi",
    archL3Desc: "Penyimpanan histori lokal SQLite, evaluasi algoritma Isolation Forest, dan server dashboard web lokal.",
    archL4Title: "Lapisan 4: Keputusan Teknisi & Log",
    archL4Desc: "Antarmuka teknisi dengan panduan checklist inspeksi dan pencatatan riwayat tindakan perawatan berkala.",

    // Dashboard Preview
    dashBadge: "DASHBOARD DEMONSTRASI",
    dashTitle: "Data Sintetis yang Nyata dan Dapat Ditindaklanjuti",
    dashDesc: "Simulasi interaktif 3 unit mesin IKM tipikal. Seluruh angka adalah data uji sintetis untuk membuktikan logika alarm berjenjang.",
    m1Name: "Pompa Sentrifugal P-01",
    m1Role: "Sirkulasi Pendingin Pabrik",
    m2Name: "Motor Induksi M-02",
    m2Role: "Penggerak Lini Konveyor Utama",
    m3Name: "Kipas Ventilasi F-03",
    m3Role: "Ekstraksi Udara Sentral",
    statusNormal: "NORMAL",
    statusInspect: "INSPEKSI",
    statusSensorErr: "PERIKSA SENSOR",

    // Economics
    econBadge: "ANALISIS SENSITIVITAS FINANSIAL",
    econTitle: "Manfaat Harus Dihitung, Bukan Diasumsikan.",
    econDesc: "Berdasarkan Tabel 5 & 6 pada esai IYEEA 2026: Investasi awal (CAPEX) Rp8.000.000 untuk 3 mesin, biaya operasional & alarm palsu (OPEX) Rp3.000.000/tahun.",
    sliderHours: "Jam Downtime Terhindar / Tahun:",
    sliderCost: "Biaya Downtime / Jam (Rp):",
    resGross: "Manfaat Penghematan Kotor:",
    resOpex: "Biaya Operasi & Alarm Palsu:",
    resNet: "Manfaat Bersih per Tahun:",
    resPayback: "Estimasi Waktu Impas (Payback):",
    btnScenKons: "Skenario Konservatif (4 jam @ Rp500rb)",
    btnScenMod: "Skenario Moderat (12 jam @ Rp1jt)",
    btnScenOpt: "Skenario Optimistis (20 jam @ Rp1,5jt)",
    econDisclaimer: "*Catatan: Seluruh angka merupakan model simulasi sensitivitas ekonomi hipotetis, bukan jaminan kepastian finansial di lapangan.",

    // Roadmap
    roadBadge: "PETA JALAN IMPLEMENTASI",
    roadTitle: "Enam Bulan untuk Menguji, Bukan Menebak.",
    m12Title: "Bulan 1-2: Audit & Pemasangan",
    m12Desc: "Audit kekritisan mesin IKM, pemasangan sensor retrofit non-invasif, kalibrasi instrumen, dan penentuan baseline awal.",
    m34Title: "Bulan 3-4: Uji Prospektif & Baseline",
    m34Desc: "Perekaman data operasi stabil, penyesuaian ambang statistik robust, pelatihan teknisi dalam membaca indikasi anomali.",
    m56Title: "Bulan 5-6: Audit Manfaat & Gerbang Keputusan",
    m56Desc: "Verifikasi rasio alarm palsu, pencatatan waktu henti aktual, perhitungan ROI riil, dan penentuan ekspansi unit.",

    // Team & Jobdesk
    teamBadge: "TIM PENGEMBANG INOVASI",
    teamTitle: "Tiga Disiplin, Satu Pendekatan Terintegrasi.",
    teamDesc: "Kolaborasi multidisiplin mahasiswa Universitas Brawijaya memadukan rekayasa perangkat lunak, sistem tertanam, dan kecerdasan buatan.",
    bimoRole: "Ketua Tim • Arsitek Web & Dashboard",
    bimoDesc: "Bertanggung jawab atas visi produk, arsitektur informasi UX/UI, perancangan dashboard interaktif, integrasi visualisasi 3D, deployment Vercel, serta koordinasi esai IYEEA 2026.",
    ihwanRole: "Lead Sistem Tertanam & Hardware",
    ihwanDesc: "Bertanggung jawab atas riset komponen retrofit, pemilihan sensor akselerometer MEMS & probe termal, optimasi BOM perangkat, pengkondisian sinyal edge, dan panduan instalasi mekanik.",
    raizRole: "Lead Kecerdasan Buatan & Analitik Data",
    raizDesc: "Bertanggung jawab atas pipeline deteksi anomali (Isolation Forest & Robust MAD), validasi mutu sinyal (deteksi kabel lepas), generator dataset sintetis, dan model simulasi ekonomi.",

    // Research & References
    researchBadge: "LANDASAN RISET & PUSTAKA",
    researchTitle: "Transparansi Akademis & Landasan Teori",
    researchDesc: "Gagasan NADI-IKM dibangun di atas 16 publikasi ilmiah internasional, standar ISO 17359 / 20816, dan pedoman keamanan NIST OT.",
    btnDownloadEssay: "Unduh Naskah Esai Lengkap (PDF)",
    bibtexTitle: "Format Sitasi Ilmiah (BibTeX)",

    // Footer
    footerDisclaimer: "Penafian: Website ini mendemonstrasikan rancangan konseptual, prototipe digital, dan simulasi interaktif proyek NADI-IKM (Universitas Brawijaya). Seluruh data mesin pada dashboard adalah data sintetis berlabel untuk tujuan edukasi dan kompetisi IYEEA 2026.",
    footerRights: "Hak Cipta © 2026 Tim NADI-IKM • Universitas Brawijaya, Malang. Seluruh hak cipta dilindungi."
  },

  en: {
    // Nav & System
    brandName: "NADI-IKM",
    brandTagline: "Intelligent Machine Care",
    navHome: "Home",
    navTech: "Technology",
    navExplore: "3D Product Lab",
    navDashboard: "Demo Dashboard",
    navPilot: "Pilot Roadmap",
    navEconomics: "Impact Calculator",
    navResearch: "Research & Paper",
    navTeam: "Team Structure",
    badgeConcept: "CONCEPTUAL DESIGN • SYNTHETIC DEMO",
    ctaExplore3D: "Explore 3D Lab",
    ctaDashboard: "Open Demo Dashboard",
    ctaReadPaper: "Download Research Brief",
    institution: "Universitas Brawijaya • IYEEA 2026",

    // Hero
    heroHeadline: "Before machines stop, understand the signals.",
    heroSubhead: "NADI-IKM introduces a retrofit edge AI condition monitoring system for small and medium enterprises (SMEs). Transforming micro-vibrations and thermal trends into logical, data-efficient inspection actions with zero permanent cloud dependency.",
    heroStat1Val: "IDR 8,000,000",
    heroStat1Label: "Assumed Initial Investment (3 Units)",
    heroStat2Val: "10.7 Months",
    heroStat2Label: "Moderate Scenario Payback",
    heroStat3Val: "100%",
    heroStat3Label: "Independent Local Edge Processing",

    // Problem Section
    problemBadge: "SME ROOT CAUSES",
    problemTitle: "Minor anomalies. Severe production losses.",
    problemDesc: "SMEs operate 4.2 million enterprises employing 12.3 million workers in Indonesia. The sudden breakdown of a single primary drive motor or main pump halts the entire production line.",
    prob1Title: "Unprioritized Machinery",
    prob1Desc: "Sensors deployed without criticality audits or neglected completely. A failure in an unredundant motor is catastrophic compared to an auxiliary exhaust fan.",
    prob2Title: "Scarce Historical Fault Data",
    prob2Desc: "SMEs rarely possess thousands of hours of labeled failure logs. Conventional deep learning models fail to train without extensive fault history.",
    prob3Title: "Context-Blind Alarms",
    prob3Desc: "Vibrations naturally spike during start-ups or load shifts, causing frequent false alarms that compel technicians to disable warning sirens.",
    prob4Title: "Delayed & Reactive Decisions",
    prob4Desc: "Maintenance occurs only after catastrophic failure, inducing expensive emergency repairs, overtime wages, and lost customer delivery deadlines.",

    // 4 Pillars
    pillarBadge: "NADI-IKM APPROACH",
    pillarTitle: "Four Pillars of Responsible Innovation",
    p1Title: "1. Critical Asset Audit",
    p1Desc: "Focusing capital on the top 3 high-impact production machines based on downtime cost, spare parts lead time, and physical safety.",
    p2Title: "2. Asset-Specific Baseline",
    p2Desc: "Adaptive statistical learning per machine rather than rigid generic vibration thresholds (conforming to ISO 17359 / 20816-3 guidelines).",
    p3Title: "3. Explainable Actionable Alarms",
    p3Desc: "Transparent root indicators rather than black-box failure percentages: RMS deviation, thermal delta, signal health check, and SOP checklist.",
    p4Title: "4. Human-In-The-Loop Control",
    p4Desc: "No hazardous automated machine shutdowns. The system acts as a navigation co-pilot; final safety authority rests with qualified technicians.",

    // 3D Product Lab
    labBadge: "RETROFIT HARDWARE ANATOMY",
    labTitle: "Inspect Every Layer, Inside and Out.",
    labDesc: "The non-invasive NADI-IKM retrofit sensor node is engineered for fast clamp-on installation without tampering with primary machine PLC controls.",
    explodeSlider: "Exploded View Separation Level",
    xrayToggle: "X-Ray / Transparency Mode",
    btnResetView: "Reset Orientation",
    btnIsoView: "Isometric View",
    btnTopView: "Top View",
    partEnclosure: "Polycarbonate Housing Shell",
    partEnclosureDesc: "Ruggedized polycarbonate upper enclosure featuring thermal labyrinth vents and acrylic status illumination window.",
    partEsp: "Edge Compute Module (MCU)",
    partEspDesc: "ESP32-S3 microcontroller with hardware vector acceleration for real-time FFT, vibration RMS, and local signal verification.",
    partMems: "Tri-Axial MEMS Accelerometer",
    partMemsDesc: "1-2 kHz bandwidth vibration sensor isolated by an acoustic decoupling plate for precise bearing housing contact.",
    partTemp: "Industrial RTD Thermal Probe",
    partTempDesc: "High-accuracy surface temperature probe encased in heat-resistant silicone with galvanic isolation up to 125°C.",
    partPower: "Power Management & TVS Surge Stage",
    partPowerDesc: "Regulated industrial buck power stage featuring TVS diode transient suppression and self-resetting PTC fuse protection.",
    partMount: "M8 Stud & Neodymium Magnetic Base",
    partMountDesc: "High-grade stainless steel base equipped with rare-earth neodymium magnets for drill-free, secure retrofit mounting.",

    // 4-Layer Architecture
    archBadge: "4-LAYER ARCHITECTURE",
    archTitle: "From Raw Sensation to Clear Action",
    archL1Title: "Layer 1: Signal Acquisition",
    archL1Desc: "High-frequency vibration sampling (1-2 kHz) and 15-second temperature polling with open-circuit sensor cable diagnosis.",
    archL2Title: "Layer 2: Edge Computing",
    archL2Desc: "Extraction of compact robust statistical features (RMS, kurtosis, robust median absolute deviation) directly on-chip.",
    archL3Title: "Layer 3: Local Gateway & UI",
    archL3Desc: "Local SQLite historical logging, secondary Isolation Forest scoring, and lightweight offline web dashboard serving.",
    archL4Title: "Layer 4: Human Decision & Log",
    archL4Desc: "Technician terminal providing explainable inspection SOP checklists and perpetual maintenance audit trails.",

    // Dashboard Preview
    dashBadge: "DEMO DASHBOARD",
    dashTitle: "Actionable, Explainable Synthetic Telemetry",
    dashDesc: "Interactive simulation across 3 representative industrial SME machines. All values are synthetic data to demonstrate multi-tier alarm logic.",
    m1Name: "Centrifugal Pump P-01",
    m1Role: "Plant Cooling Circulation",
    m2Name: "Induction Motor M-02",
    m2Role: "Main Conveyor Line Drive",
    m3Name: "Ventilation Blower F-03",
    m3Role: "Central Exhaust Extraction",
    statusNormal: "NORMAL",
    statusInspect: "INSPECTION",
    statusSensorErr: "CHECK SENSOR",

    // Economics
    econBadge: "FINANCIAL SENSITIVITY MODEL",
    econTitle: "Value Must Be Measured, Not Assumed.",
    econDesc: "Based on Tables 5 & 6 in the IYEEA 2026 paper: Assumed initial investment (CAPEX) of IDR 8,000,000 for 3 machines, annual operating & false alarm overhead (OPEX) IDR 3,000,000/year.",
    sliderHours: "Avoided Downtime Hours / Year:",
    sliderCost: "Downtime Cost / Hour (IDR):",
    resGross: "Gross Annual Downtime Savings:",
    resOpex: "Annual OPEX & False Alarm Cost:",
    resNet: "Net Annual Financial Benefit:",
    resPayback: "Estimated Payback Period:",
    btnScenKons: "Conservative (4h @ IDR 500k)",
    btnScenMod: "Moderate (12h @ IDR 1M)",
    btnScenOpt: "Optimistic (20h @ IDR 1.5M)",
    econDisclaimer: "*Caveat: All figures represent hypothetical sensitivity models for auditing purposes, not guaranteed commercial outcomes.",

    // Roadmap
    roadBadge: "PILOT IMPLEMENTATION ROADMAP",
    roadTitle: "Six Months to Validate, Never to Guess.",
    m12Title: "Months 1-2: Audit & Deployment",
    m12Desc: "Machinery criticality audit, non-invasive retrofit installation, sensor calibration, and initial baseline recording.",
    m34Title: "Months 3-4: Prospective Testing & Baselines",
    m34Desc: "Logging stable operational data, tuning robust statistical thresholds, and training technicians on alarm interpretations.",
    m56Title: "Months 5-6: Economic Audit & Expansion Gate",
    m56Desc: "Verifying false alarm rates, auditing avoided downtime, evaluating net ROI, and executing the formal expansion decision gate.",

    // Team & Jobdesk
    teamBadge: "DEVELOPMENT TEAM",
    teamTitle: "Three Disciplines, One Unified System.",
    teamDesc: "A multidisciplinary team from Universitas Brawijaya combining software architecture, embedded engineering, and machine intelligence.",
    bimoRole: "Team Lead • Web & Dashboard Architect",
    bimoDesc: "Responsible for overall product vision, UX/UI information architecture, interactive dashboard engineering, 3D WebGL integration, Vercel CI/CD deployment, and IYEEA 2026 research coordination.",
    ihwanRole: "Hardware & Embedded Systems Lead",
    ihwanDesc: "Responsible for retrofit hardware BOM selection, MEMS vibration and RTD sensor integration, edge signal conditioning, enclosure thermal design, and machine installation SOPs.",
    raizRole: "AI & Data Analytics Lead",
    raizDesc: "Responsible for edge anomaly detection pipelines (Isolation Forest & Robust MAD), sensor health validation algorithms, synthetic test generator, and financial sensitivity ROI models.",

    // Research & References
    researchBadge: "RESEARCH & ACADEMIC CITATIONS",
    researchTitle: "Academic Integrity & Theoretical Foundation",
    researchDesc: "NADI-IKM is grounded in 16 peer-reviewed international publications, ISO 17359 / 20816 standards, and NIST OT cybersecurity guidelines.",
    btnDownloadEssay: "Download Full Research Paper (PDF)",
    bibtexTitle: "Academic Citation Format (BibTeX)",

    // Footer
    footerDisclaimer: "Disclaimer: This website demonstrates the conceptual design, digital twin prototype, and interactive simulation of NADI-IKM (Universitas Brawijaya). All telemetry on the dashboard is synthetic data labeled for educational and IYEEA 2026 competition purposes.",
    footerRights: "Copyright © 2026 NADI-IKM Team • Universitas Brawijaya, Malang. All rights reserved."
  }
};

let currentLang = localStorage.getItem('nadi_lang') || 'id';

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('nadi_lang', lang);
  document.documentElement.lang = lang;

  // Update text in elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Update language toggle buttons UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('bg-teal-500', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-300', 'hover:text-white');
    } else {
      btn.classList.remove('bg-teal-500', 'text-white', 'shadow-sm');
      btn.classList.add('text-slate-300', 'hover:text-white');
    }
  });

  // Dispatch event for other components (like 3D viewer or dashboard)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});
