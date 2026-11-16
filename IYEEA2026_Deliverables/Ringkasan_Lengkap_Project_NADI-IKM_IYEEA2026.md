# 📦 Ringkasan Lengkap Hasil Proyek NADI-IKM (Web, Video 1080p, Deploy GitHub/Vercel, & Esai Final IYEEA 2026)

Dokumen ini merangkum seluruh hasil kerja, arsitektur sistem, pembaruan visual, aset video, panduan publikasi ke GitHub/Vercel, hingga revisi final naskah lomba esai **IYEEA 2026** untuk tim **EngineerSpiking — Universitas Brawijaya** (`Bimo Satrio`, `Ihwan Ridwan S Maulidian`, `Muhammad Raiz Belyaa`).

---

## 1. Gambaran Besar Evolusi Proyek dalam Sesi Ini

Sepanjang percakapan, proyek **NADI-IKM** (*Navigasi Anomali dan Diagnosis Industri untuk Industri Kecil dan Menengah*) dikembangkan melalui 4 fase terpadu:

1. **Fase 1 — Pembangunan Portal Web & Prototipe Interaktif:** Mengonversi gagasan esai serta dokumen konsep menjadi aplikasi web multi-halaman berbasis HTML5, Tailwind CSS, Three.js (WebGL 3D), dan Chart.js dengan dukungan dwibahasa (`ID / EN`).
2. **Fase 2 — Penyempurnaan Estetika Retro-Industrial, Kursor & Penjelasan Bahasa Awam:** Meningkatkan tata warna gradien eksotis, memperbesar emblem/logo **NADI-IKM**, menyematkan kursor taktis CAD + efek *scroll reveal*, menambahkan peta tim berbentuk *engineering mindmap/flowchart*, menyederhanakan penjelasan teknis agar dipahami orang awam (*"Paham dalam 10 Detik"* & analogi *"Stetoskop Dokter Pintar"*), serta **membersihkan cincin orbit melingkar** pada tampilan 3D 360° agar anatomi komponen terlihat tajam tanpa halangan visual.
3. **Fase 3 — Produksi 2 Video Demo 1080p Full HD (30 FPS) + Panduan Push GitHub & Deploy Vercel:** Merender ulang video anatomi 3D 360° tampilan samping (*exploded view* bertahap 30 detik) dan video *full showcase* website (42 detik) bebas cincin melingkar, sekaligus menyiapkan perintah PowerShell untuk `https://github.com/bimskuy1205/Nadi-IKM.git` dan konfigurasi `vercel.json`.
4. **Fase 4 — Revisi Langsung Naskah Esai IYEEA 2026 (MS Word) & Brief Audit Guidebook/Rubrik:** Mengaudit naskah esai terhadap **Guidebook IYEEA 2026**, mengintegrasikan cuplikan resolusi tinggi website terbaru + QR Code + tautan Vercel ke dalam esai tanpa mengubah **Halaman Sampul (Cover Page 1)** sedikit pun, memperbaiki pelanggaran batas halaman inti dan typo, serta menyusun dokumen Master Brief terpisah dalam format MS Word (`.docx`).

---

## 2. Daftar Lengkap File Website & Struktur Proyek (`Nadi-IKM`)

Lokasi folder proyek lokal: `C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM\` (status commit Git kode web: `b09ede0`).

### A. Halaman Web Utama & Konfigurasi
| File | Fungsi Utama |
| :--- | :--- |
| `index.html` | Beranda utama: Hero + Logo Highlight + kotak *Paham dalam 10 Detik* + Pratinjau 3D Twin, Seksi Masalah IKM, *3D Product Lab* (6 lapis komponen & slider *Exploded View*), Galeri Video Showcase, Arsitektur 4 Lapis, Kalkulator Sensitivitas Ekonomi, *Engineering Mindmap* Tim UB, serta Riset & 16 Referensi. |
| `dashboard.html` | Simulator *Dashboard* Telemetri Sintetis waktu nyata: panduan warna awam (`HIJAU` Normal, `KUNING` Inspeksi, `BIRU` Periksa Sensor), 4 tombol skenario *What-If*, ekspor CSV sintetis, grafik RMS vs ambang *Robust MAD*, skor *Explainability* (`78%`), 4 langkah SOP teknisi, peringatan pasif non-*interlock*, dan *Logbook* pemeriksaan. |
| `explore.html` | Studio CAD 3D 360° layar penuh: slider *Exploded View* 0–100%, tombol *Auto-Explode 30s (Tampilan Samping)*, Mode X-Ray, tombol sudut pandang Isometrik/Atas/Samping, serta putar otomatis. |
| `technology.html` | Pendalaman arsitektur 4 lapis, komparasi metode deteksi anomali (*Robust MAD* vs *Isolation Forest*), dan pembatasan RUL. |
| `team.html` | Profil terstruktur & peta tanggung jawab tim multidisiplin (**Bimo Satrio**, **Ihwan Ridwan S. M.**, **Muhammad Raiz B.**). |
| `research.html` | Landasan ilmiah (ISO 17359:2018, ISO 20816-3:2026, NIST SP 800-82r3, IEEE/Elsevier) dan posisi kejujuran metodologis. |
| `vercel.json` | Konfigurasi *clean routes* (`/dashboard`, `/explore`, dll.) untuk deployment di Vercel. |
| `README.md` | Dokumentasi repositori proyek NADI-IKM. |

### B. Aset CSS, JavaScript, & Grafis
| File | Fungsi |
| :--- | :--- |
| `assets/css/style.css` | Tema *dark retro-industrial*, palet gradien eksotis, *blueprint grid*, horizon grid, sorotan logo `.brand-logo-showcase`, serta gaya tombol & kartu HUD. |
| `assets/js/three-viewer.js` | Mesin Three.js WebGL untuk model *Digital Twin* 3D CAD 6 lapis (`#01` Enclosure PC-GF30, `#02` ESP32-S3, `#03` MEMS 1–2 kHz & Probe RTD PT100, `#04` Modul Daya & TVS 36V, `#05` Basis Magnetik N52, `#06` Ring Isolasi) — bersih tanpa efek cincin melingkar. |
| `assets/js/dashboard.js` | Logika simulasi deterministik 3 aset (`P-01`, `M-02`, `F-03`), skenario *What-If*, pembaruan Chart.js tiap 2 detik, kalkulasi deviasi, dan manajemen logbook. |
| `assets/js/calculator.js` | Kalkulator interaktif sensitivitas ekonomi berbasis CAPEX `Rp8.000.000` dan OPEX + beban alarm palsu `Rp3.000.000/tahun` (skenario Konservatif, Moderat, Optimistis, maupun geser slider manual). |
| `assets/js/cursor.js` | Kursor *CAD reticle* + tag koordinat, *sonar click shockwaves*, *constellation trail*, bilah progres *scroll*, dan *scroll-reveal observer*. |
| `assets/js/translations.js` | Kamus dwibahasa `ID` / `EN` interaktif di seluruh situs. |
| `assets/img/logo-dark.svg`, `logo.svg`, `favicon.svg` | Identitas visual logo **NADI-IKM** berbingkai hologram & ikon tab browser. |

---

## 3. Video Demo 1080p Full HD (`30 FPS`)

Kedua video telah dirender ulang bersih **tanpa efek cincin melingkar** agar seluruh anatomi komponen dan teks terbaca jelas:

1. **Video 1 — Anatomi 3D 360° Tampilan Samping & Gradual Explode (30 Detik, 900 Frame):**
   - File: `assets/video/nadi-ikm-3d-anatomy-30s.mp4` (~5,57 MB) | Skrip: `assets/video/generate_3d_video.py`
   - Isi: Model *retrofit node* berputar otomatis 360° dari tampak samping sambil terurai (*explode*) perlahan dari `0%` hingga `100%` selama tepat 30 detik, disertai anotasi 6 komponen (spesifikasi teknik + penjelasan awam).

2. **Video 2 — Full Website, Dashboard, 3D Lab, & Mindmap Tim Showcase (42 Detik, 1.260 Frame):**
   - File: `assets/video/nadi-ikm-full-showcase.mp4` (~12,74 MB) | Skrip: `assets/video/generate_full_showcase_video.py`
   - Isi: Alur lengkap 6 bab dengan transisi *Holographic Cyber-Shutter*: (01) Hero & Analogi Stetoskop Pintar, (02) Masalah IKM & Arsitektur 4 Lapis, (03) Studio 3D 360° Exploded View, (04) Dashboard 3 Warna & SOP Teknisi, (05) Mindmap Tim (**Bimo Satrio** sebagai Ketua/Lead Arsitek Web & Dashboard, **Ihwan Ridwan S. M.** sebagai Lead Hardware/Embedded, **Muhammad Raiz Belyaa** sebagai Lead AI & Analitik Data), dan (06) Kalkulator Balik Modal (`~10,7 bulan`), 16 Referensi, & Penutup IYEEA 2026.

---

## 4. Panduan Push ke GitHub (`PowerShell`) & Deploy ke Vercel

### Langkah 1: Push Project ke GitHub (`https://github.com/bimskuy1205/Nadi-IKM.git`)
```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM
git branch -M main
git remote set-url origin https://github.com/bimskuy1205/Nadi-IKM.git
git status
git push -u origin main --force
```

### Langkah 2: Deploy Publik di Vercel
1. Buka **https://vercel.com/new** dan login dengan akun GitHub `bimskuy1205`.
2. Klik **Import** pada repositori **`Nadi-IKM`**.
3. Pilih **Framework Preset: `Other`** (konfigurasi rute sudah siap di `vercel.json`), biarkan Root Directory `./`, lalu klik **Deploy**.
4. Alternatif CLI lewat PowerShell:
   ```powershell
   cd C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM
   npx vercel --prod
   ```
5. Pastikan URL live yang aktif sesuai dengan yang dirujuk pada esai (misalnya `https://nadi-ikm.vercel.app`), atau sesuaikan tautan pada Sub-bab 2.5 dan Lampiran 1 file Word esai bila Vercel menghasilkan domain berbeda.

---

## 5. Hasil Final Revisi Esai IYEEA 2026 & Master Brief (MS Word `.docx`)

Lokasi file di folder proyek: `C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM\IYEEA2026_Deliverables\`:

1. **Esai Final Siap Submisi:** `IYEEA2026_EngineerSpiking_NADI-IKM_Esai_Pemeliharaan_Prediktif.docx` (~19,45 MB `.docx`; hasil ekspor PDF murni terukur **4,37 MB**)
2. **Master Brief Revisi, Galeri Cuplikan Web, & Strategi Juara (11 Halaman):** `Brief_Lengkap_Revisi_Esai_dan_Integrasi_Web_NADI-IKM_IYEEA2026.docx` (~13,27 MB `.docx`; hasil ekspor PDF murni terukur **3,03 MB**)

### Ringkasan Pembaruan & Audit Kepatuhan 100% Guidebook IYEEA 2026
| Aspek Audit Guidebook | Sebelumnya (PDF Awal) | Hasil File Word Final |
| :--- | :--- | :--- |
| **Halaman Sampul (Hal. 1)** | Desain asli Tim EngineerSpiking UB | **Dipertahankan 100% identik** (judul 14pt Bold, logo UB latar putih bersih, Sub-Tema 1, 3 penulis, 2026). |
| **Batas Halaman Inti (Bab 4.3)** | **17 halaman** (Hal. 3–19; melanggar batas maks. 15 halaman) | **13 halaman inti** (Hal. 3–15; patuh 100% di bawah batas maks. 15 halaman). |
| **Total Halaman (Bab 4.3)** | 22 halaman | **21 halaman** (patuh 100% di bawah batas maks. 25 halaman, sudah termasuk 4 halaman Lampiran). |
| **Tata Letak & EYD (Bab 4.1)** | Typo fatal di Hal. 3 (`pemrose0/5oltisan`), beberapa tabel terpotong antarhalaman | A4, Margin Kiri 4 cm / Atas-Kanan-Bawah 3 cm, Times New Roman 12pt, spasi 1,5, *Justify*, *First Line Indent* 1,25 cm, typo diperbaiki (`pemrosesan informasi`), istilah asing dicetak miring konsisten EYD V, tabel tidak terputus caption-nya. |
| **Sitasi Harvard-Anglia (Bab 4.2)** | 16 sumber; 1 rujukan Kemenperin di Hal. 3 belum bersitasi kurung | Seluruh **16 referensi** sinkron 1:1 antara teks dan Daftar Referensi (urut A–Z, indentasi gantung 0,8 cm). |
| **Integrasi Web Terbaru** | Hanya memiliki `Gambar 5` *wireframe* pucat | Ditambahkan **`Gambar 3`** (3D CAD *Exploded View* di Sub-bab 2.3), **`Gambar 6`** (*Screenshot Dashboard* terbaru di Sub-bab 2.5 + tautan `https://nadi-ikm.vercel.app`), rujukan Kalkulator ROI (Sub-bab 2.6), serta **Lampiran 1–4** berisi QR Code aktif + cuplikan seluruh modul web. |

---

## 6. Checklist Terakhir Sebelum Upload PDF ke Panitia (Deadline: 21 November 2026)

- [ ] Buka `IYEEA2026_EngineerSpiking_NADI-IKM_Esai_Pemeliharaan_Prediktif.docx` di Microsoft Word, lalu lengkapi NIM **Ihwan Ridwan S Maulidian** dan **Muhammad Raiz Belyaa** (`245150307111…`) pada Halaman Sampul (Hal. 1) tanpa menggeser tata letak lainnya.
- [ ] Jalankan `git push` ke `https://github.com/bimskuy1205/Nadi-IKM.git` dan *deploy* ke Vercel.
- [ ] Pastikan URL publik hasil deploy cocok dengan `https://nadi-ikm.vercel.app` (bila berbeda, perbarui tautan di Sub-bab 2.5 dan Lampiran 1).
- [ ] Ekspor via **File → Save As → PDF** dengan nama file baku `IYEEA2026_EngineerSpiking_NADI-IKM_Esai_Pemeliharaan_Prediktif.pdf` (ukuran wajib `≤ 25 MB`, hasil uji saat ini ~4,37 MB) dan pastikan tidak ada pergeseran halaman pada Daftar Isi setelah pengisian NIM.
