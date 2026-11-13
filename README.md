# 🩺 NADI-IKM: Intelligent Machine Care
> **Navigasi Anomali dan Diagnosis Industri untuk IKM**  
> *Sistem Pemeliharaan Prediktif Hemat Data Berbasis Retrofit Edge AI untuk Menjaga Keandalan Mesin Industri Kecil dan Menengah*  
> **Kompetisi:** Indonesian Young Economy and Engineering Award (IYEEA 2026) • Universitas Brawijaya

---

## 🌟 Highlight Fitur Website & Sistem
- **🎨 Brand & Visual Identity:** Menggunakan sistem warna industri modern (*Midnight Navy*, *Deep Steel*, *Industrial Teal*, *Signal Cyan*, *Safety Amber*, *Alert Coral*).
- **🌐 Fitur 2 Bahasa (Bilingual ID/EN):** Switch instan antara Bahasa Indonesia dan English dengan persistensi lokal.
- **🧊 3D Product Lab & Digital Twin:**
  - Visualisasi 3D WebGL interaktif (rotasi 360°, zoom, pan).
  - Slider animasi **Exploded View** (0% sampai 100%) memperlihatkan seluruh lapisan anatomi perangkat.
  - Mode **X-Ray / Transparansi** casing luar untuk menginspeksi mikrokontroler dan sensor.
  - Hotspot interaktif (Enclosure, ESP32 MCU, MEMS Akselerometer, Probe Suhu RTD, Catu Daya TVS, Dudukan Magnetik M8).
- **📊 Interactive Live Demo Dashboard (`/dashboard`):**
  - Pemantauan telemetri waktu nyata 3 aset sintetis (`P-01` Pompa Sentrifugal, `M-02` Motor Induksi Konveyor, `F-03` Kipas Ventilasi Sentral).
  - Grafik interaktif *Vibration RMS* vs *Robust Baseline* dan *Suhu Bantalan* (Chart.js).
  - Simulator 4 skenario operasional (*Normal*, *Lonjakan Beban*, *Anomali Bantalan*, *Kabel Sensor Longgar*).
  - Alarm yang dapat dijelaskan (*Explainable Anomaly Score*) dan 4 langkah SOP tindakan teknisi.
  - Modal pencatatan buku log inspeksi (*Technician Logbook*) & fitur Ekspor CSV Data Sintetis.
- **💰 Kalkulator Sensitivitas Finansial:**
  - Simulasi interaktif CAPEX Rp8.000.000 untuk 3 mesin dan OPEX Rp3.000.000/tahun.
  - Slider interaktif jam henti terhindar & biaya downtime per jam dengan kalkulasi payback otomatis.
- **👥 Struktur Tim & RACI Matrix:**
  - **Bimo Satrio** (Ketua Tim, Arsitek Web & Dashboard)
  - **Ihwan Ridwan S. Maulidian** (Lead Sistem Tertanam & Hardware Engineering)
  - **Muhammad Raiz Belyaa** (Lead Kecerdasan Buatan & Analitik Data)

---

## 🚀 Panduan Push ke GitHub & Deploy ke Vercel (PowerShell)

### 1️⃣ Buka PowerShell dan Masuk ke Direktori Proyek
Buka aplikasi **PowerShell** di Windows Anda, lalu jalankan perintah berikut:

```powershell
cd C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM
```

---

### 2️⃣ Inisialisasi Git & Push ke Remote Repository
Jalankan rangkaian perintah berikut satu per satu (atau sekaligus):

```powershell
# Inisialisasi Git
git init

# Tambahkan semua file proyek
git add .

# Buat commit pertama
git commit -m "🚀 Launch: Full NADI-IKM Interactive Web, 3D Product Lab, Dashboard & Bilingual Features"

# Pastikan branch utama bernama main
git branch -M main

# Hubungkan ke repository GitHub Anda
git remote add origin https://github.com/bimskuy1205/Nadi-IKM.git

# Push ke GitHub (Gunakan -u origin main atau --force jika repo baru memiliki README default)
git push -u origin main --force
```

> 💡 **Catatan Autentikasi GitHub:**  
> Jika muncul jendela login GitHub di browser, cukup klik **Authorize GitCredentialManager** atau masukkan Personal Access Token (PAT) GitHub Anda.

---

### 3️⃣ Deploy ke Vercel untuk Akses Publik (Paling Cepat & Gratis)

Ada **2 cara mudah** untuk mendeploy web ini ke Vercel:

#### Opsi A: Menggunakan Vercel CLI (Lewat PowerShell)
1. Install Vercel CLI (jika belum):
   ```powershell
   npm install -g vercel
   ```
2. Login ke akun Vercel Anda:
   ```powershell
   vercel login
   ```
3. Deploy langsung ke production:
   ```powershell
   vercel --prod
   ```
   - Ikuti pertanyaan di terminal (tekan `Enter` untuk default). Vercel akan otomatis mendeteksi konfigurasi `vercel.json` dan memberikan URL publik seperti:  
     `https://nadi-ikm.vercel.app` atau sejenisnya.

---

#### Opsi B: Menggunakan Vercel Dashboard Web (Otomatis & Terhubung GitHub)
1. Buka browser dan kunjungi: **[https://vercel.com](https://vercel.com)**
2. Login menggunakan akun GitHub Anda (`bimskuy1205`).
3. Klik tombol **"Add New..."** lalu pilih **"Project"**.
4. Di daftar repository GitHub Anda, cari dan pilih **`Nadi-IKM`**, lalu klik **"Import"**.
5. Pada bagian **Build and Output Settings**, biarkan default (karena situs ini dirancang ultra-cepat dengan zero-build static architecture + `vercel.json` clean routing).
6. Klik **"Deploy"**!
7. Dalam 15-30 detik, website Anda sudah aktif dan dapat diakses publik oleh juri, dosen, dan masyarakat umum!

---

## 📁 Struktur Berkas Proyek

```
Nadi-IKM/
├── index.html            # Halaman landing utama, hero 3D, masalah, pilar, kalkulator, tim & riset
├── dashboard.html        # Dashboard telemetri industri interaktif, 3 mesin, alarm explainability, logs
├── explore.html          # Studio 3D digital twin, exploded view slider, X-Ray & tabel BOM
├── technology.html       # Arsitektur 4 lapis, komparasi algoritma, standar ISO & NIST OT
├── research.html         # Dokumen esai IYEEA 2026, abstrak, 16 daftar pustaka, BibTeX
├── team.html             # Struktur organisasi lengkap, profil 3 anggota, matriks RACI
├── vercel.json           # Konfigurasi routing bersih (cleanUrls), HTTP security headers, asset caching
├── README.md             # Dokumentasi lengkap & panduan deployment
└── assets/
    ├── css/
    │   └── style.css     # Design tokens, gradient hero, glassmorphism, slider styling
    ├── img/
    │   ├── logo.svg      # Logo vektor resmi NADI-IKM
    │   ├── logo-dark.svg # Varian logo untuk latar belakang gelap
    │   └── favicon.svg   # Favicon tab browser
    └── js/
        ├── translations.js # Kamus terjemahan dwibahasa (Indonesia / English)
        ├── three-viewer.js # Engine 3D WebGL (OrbitControls, exploded offset, X-Ray, hotspots)
        ├── dashboard.js    # Mesin simulasi data sintetis, Chart.js, SOP aksi, logbook inspeksi
        └── calculator.js   # Kalkulator sensitivitas ekonomi CAPEX/OPEX & payback period
```

---

## 👥 Tim Pengembang (Engineerspiking • Universitas Brawijaya)
- **Bimo Satrio (NIM: 245150307111060):** Ketua Tim, Lead Arsitek Web & Dashboard
- **Ihwan Ridwan S. Maulidian:** Lead Sistem Tertanam & Hardware Engineering
- **Muhammad Raiz Belyaa:** Lead Kecerdasan Buatan & Analitik Data

---
*Dibuat untuk submisi kompetisi Indonesian Young Economy and Engineering Award (IYEEA) 2026.*
