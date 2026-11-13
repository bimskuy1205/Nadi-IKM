"""
NADI-IKM: Full Website, 3D 360° Lab, Telemetry Dashboard & Team Mindmap Masterpiece Video
Renders 1260 frames (42.0 seconds @ 30 fps, 1920x1080 Full HD) and encodes to MP4 with FFmpeg.
Features:
- Complete walkthrough of the NADI-IKM Web Application from start to finish:
  * Chapter 1 (0.0s - 7.0s):  Landing Page Hero, Browser Bar, Live Oscilloscope & KPI Counters
  * Chapter 2 (7.0s - 13.5s): Akar Masalah IKM & 4-Layer Edge AI Architecture Flow
  * Chapter 3 (13.5s - 21.5s): Highlight Utama: 3D 360° Side-View Digital Twin & Exploded Anatomy
  * Chapter 4 (21.5s - 29.5s): Live Telemetry Dashboard (P-01, M-02, F-03), Anomaly Chart & Explainable SOP
  * Chapter 5 (29.5s - 36.5s): Engineering Mindmap Flowchart: Ketua Tim Bimo Satrio, Ihwan Ridwan, Muhammad Raiz
  * Chapter 6 (36.5s - 42.0s): Financial Sensitivity Calculator, 16 ISO/IEEE Citations & Grand Finale
- Luxury Multi-Stage Cinematic Transitions between every chapter:
  * Smooth ease-in-out alpha cross-dissolve
  * Holographic Diagonal Laser Shutter Wipe (Neon Cyan + Phosphor Amber)
  * Glowing Chapter HUD Banner Reveal
"""

import math
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 42
TOTAL_FRAMES = FPS * DURATION_SEC  # 1260 frames

OUTPUT_DIR = r"C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM\assets\video"
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_MP4 = os.path.join(OUTPUT_DIR, "nadi-ikm-full-showcase.mp4")
FFMPEG_EXE = r"C:\Users\ASUS\Documents\PYTHON-BOOCAMP-IPB\bin\ffmpeg.exe"

# Exotic Retro-Industrial Palette
COLOR_BG = (5, 11, 17)
COLOR_CYAN = (0, 242, 254)
COLOR_CYAN_DIM = (0, 125, 145)
COLOR_AMBER = (255, 168, 52)
COLOR_ORANGE = (255, 94, 54)
COLOR_GREEN = (0, 255, 135)
COLOR_GOLD = (248, 202, 75)
COLOR_COPPER = (224, 122, 72)
COLOR_SILVER = (215, 228, 240)
COLOR_CARD = (12, 25, 38)
COLOR_CARD_HI = (18, 38, 56)
COLOR_PCB = (8, 72, 62)
COLOR_WHITE = (245, 250, 255)
COLOR_MUTED = (145, 172, 194)

print(f"Initializing Full Website Masterpiece Showcase Video: {TOTAL_FRAMES} frames @ {FPS} fps...")

cmd = [
    FFMPEG_EXE,
    "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{WIDTH}x{HEIGHT}",
    "-pix_fmt", "rgb24",
    "-r", str(FPS),
    "-i", "-",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "17",
    "-pix_fmt", "yuv420p",
    OUTPUT_MP4
]

pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

try:
    font_hero = ImageFont.truetype("arialbd.ttf", 44)
    font_h1 = ImageFont.truetype("arialbd.ttf", 32)
    font_h2 = ImageFont.truetype("arialbd.ttf", 23)
    font_h3 = ImageFont.truetype("arialbd.ttf", 18)
    font_body = ImageFont.truetype("arial.ttf", 17)
    font_small = ImageFont.truetype("arial.ttf", 14)
    font_mono_lg = ImageFont.truetype("consolab.ttf", 20)
    font_mono = ImageFont.truetype("consola.ttf", 15)
    font_mono_sm = ImageFont.truetype("consola.ttf", 13)
except Exception:
    font_hero = font_h1 = font_h2 = font_h3 = font_body = font_small = font_mono_lg = font_mono = font_mono_sm = ImageFont.load_default()

def ease_out_cubic(x):
    x = max(0.0, min(1.0, x))
    return 1.0 - pow(1.0 - x, 3)

def draw_base_chrome(draw, chapter_num, chapter_title, url_path, t_sec, f_idx):
    # Blueprint grid
    for gy in range(0, HEIGHT, 45):
        draw.line([(0, gy), (WIDTH, gy)], fill=(9, 20, 30), width=1)
    for gx in range(0, WIDTH, 45):
        draw.line([(gx, 0), (gx, HEIGHT)], fill=(9, 20, 30), width=1)

    # Top Browser & Retro-Industrial App Navbar
    draw.rectangle([30, 18, WIDTH - 30, 82], fill=(8, 18, 28), outline=COLOR_CYAN, width=2)
    # Traffic light dots
    draw.ellipse([50, 42, 64, 56], fill=COLOR_ORANGE)
    draw.ellipse([74, 42, 88, 56], fill=COLOR_AMBER)
    draw.ellipse([98, 42, 112, 56], fill=COLOR_GREEN)

    # URL Address Bar
    draw.rectangle([135, 31, 650, 69], fill=(14, 30, 44), outline=(0, 140, 165), width=1)
    draw.text((152, 41), f"https://nadi-ikm.vercel.app/{url_path}", fill=COLOR_CYAN, font=font_mono)

    # Chapter Badge & Telemetry Clock
    draw.text((680, 38), f"CHAPTER 0{chapter_num} // {chapter_title}", fill=COLOR_AMBER, font=font_h2)
    draw.text((WIDTH - 360, 41), f"REC ● T+{t_sec:05.2f}s | FRAME {f_idx:04d}", fill=COLOR_GREEN, font=font_mono)

    # Bottom Status Footer
    draw.rectangle([30, HEIGHT - 58, WIDTH - 30, HEIGHT - 16], fill=(8, 18, 28), outline=(0, 110, 130), width=1)
    draw.text((52, HEIGHT - 45), "NADI-IKM • UNIVERSITAS BRAWIJAYA • IYEEA 2026 | KETUA: BIMO SATRIO (245150307111060) • IHWAN RIDWAN • MUHAMMAD RAIZ", fill=COLOR_MUTED, font=font_mono_sm)
    prog_w = int((WIDTH - 60) * (t_sec / DURATION_SEC))
    draw.rectangle([30, HEIGHT - 20, 30 + prog_w, HEIGHT - 16], fill=COLOR_CYAN)

def project_3d(cx_screen, cy_screen, x, y, z, rot_y, pitch=0.19, fov=640):
    cos_y = math.cos(rot_y)
    sin_y = math.sin(rot_y)
    rx = x * cos_y + z * sin_y
    rz = -x * sin_y + z * cos_y
    cos_p = math.cos(pitch)
    sin_p = math.sin(pitch)
    ry = y * cos_p - rz * sin_p
    rz2 = y * sin_p + rz * cos_p + 5.8
    scale = fov / max(0.1, rz2)
    return int(cx_screen + rx * scale), int(cy_screen - ry * scale), scale

def draw_mini_3d_stack(draw, cx_screen, cy_screen, rot_y, explode, t_sec, scale_mult=1.0):
    fov = 620 * scale_mult
    layers = [
        (-0.58 - explode * 1.05, 0.85, 0.20, (32, 58, 80), COLOR_AMBER, 8),
        (-0.28 - explode * 0.52, 1.02, 0.34, (34, 62, 86), COLOR_COPPER, 12),
        (-0.02 - explode * 0.12, 0.88, 0.08, COLOR_PCB, COLOR_GREEN, 5),
        (0.20 + explode * 0.35, 0.88, 0.08, COLOR_PCB, COLOR_GOLD, 5),
        (0.44 + explode * 0.82, 0.90, 0.08, COLOR_PCB, COLOR_CYAN, 5),
        (0.76 + explode * 1.38, 1.02, 0.38, (28, 58, 82), COLOR_CYAN, 14),
    ]
    coords_out = []
    for y_c, rad, h, fill_c, out_c, slices in layers:
        for s in range(slices):
            yc = (y_c - h / 2.0) + (s / float(max(1, slices - 1))) * h
            sx, sy, sc = project_3d(cx_screen, cy_screen, 0, yc, 0, rot_y, 0.19, fov)
            rx = rad * sc
            ry = rad * sc * 0.21
            c = fill_c if s == slices - 1 else (14, 28, 40)
            o = out_c if (s == 0 or s == slices - 1) else (14, 28, 40)
            draw.ellipse([sx - rx, sy - ry, sx + rx, sy + ry], fill=c, outline=o, width=2 if s == slices - 1 else 1)
        sx_mid, sy_mid, sc_mid = project_3d(cx_screen, cy_screen, 0, y_c, 0, rot_y, 0.19, fov)
        coords_out.append((sx_mid, sy_mid, sc_mid))
    # Top glowing amber ring
    sx_top, sy_top, sc_top = coords_out[-1]
    draw.ellipse([sx_top - sc_top * 0.72, sy_top - sc_top * 0.15, sx_top + sc_top * 0.72, sy_top + sc_top * 0.15], outline=COLOR_AMBER, width=4)
    return coords_out

# =============================================================================
# 6 SCENE RENDERERS
# =============================================================================

def render_scene_1_hero(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 1, "HERO INTERFACE & REAL-TIME EDGE TELEMETRY", "index.html#hero", t_sec, f_idx)

    enter = ease_out_cubic(local_t / 1.2)
    ox = int((1.0 - enter) * -80)

    # Left Column: Badge, Headline, Oscilloscope, CTA Buttons, KPI Cards
    draw.rectangle([80 + ox, 118, 560 + ox, 154], fill=(12, 34, 48), outline=COLOR_CYAN, width=1)
    draw.text((98 + ox, 127), "● EDGE AI PREDICTIVE MAINTENANCE RETROFIT • IYEEA 2026", fill=COLOR_CYAN, font=font_mono_sm)

    draw.text((80 + ox, 175), "Sebelum mesin berhenti,", fill=COLOR_WHITE, font=font_hero)
    draw.text((80 + ox, 232), "pahami sinyalnya.", fill=COLOR_CYAN, font=font_hero)
    draw.text((80 + ox, 298), "Sistem pemantauan kondisi mesin berbasis Edge AI retrofit untuk IKM Indonesia.", fill=COLOR_AMBER, font=font_h3)
    draw.text((80 + ox, 326), "Mengubah getaran mikro (1-2 kHz) & suhu RTD menjadi keputusan inspeksi terukur.", fill=COLOR_MUTED, font=font_body)

    # Live Oscilloscope Box
    osc_x, osc_y, osc_w, osc_h = 80 + ox, 370, 960, 220
    draw.rectangle([osc_x, osc_y, osc_x + osc_w, osc_y + osc_h], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((osc_x + 20, osc_y + 14), "LIVE OSCILLOSCOPE // MULTI-HARMONIC VIBRATION STREAM (2.048 kS/s)", fill=COLOR_CYAN, font=font_mono)
    thresh_y = osc_y + 72
    draw.line([(osc_x + 20, thresh_y), (osc_x + osc_w - 20, thresh_y)], fill=COLOR_AMBER, width=2)
    draw.text((osc_x + osc_w - 340, thresh_y - 22), "ROBUST MAD THRESHOLD (3.5σ)", fill=COLOR_AMBER, font=font_mono_sm)

    pts = []
    for x in range(osc_x + 25, osc_x + osc_w - 25, 6):
        ph = (x * 0.025) + (t_sec * 9.5)
        wy = osc_y + 135 + math.sin(ph) * 38 + math.sin(ph * 2.7) * 18 + math.cos(ph * 5.1) * 9
        pts.append((x, wy))
    draw.line(pts, fill=COLOR_GREEN, width=3)

    # CTA Buttons Row
    btns = [
        ("BUKA DASHBOARD DEMO", COLOR_AMBER, (5, 11, 17)),
        ("VIDEO 3D 360° (30S)", COLOR_CYAN, (5, 11, 17)),
        ("3D CAD LAB EXPLORER", COLOR_CARD_HI, COLOR_WHITE)
    ]
    bx = 80 + ox
    for b_txt, b_bg, b_fg in btns:
        draw.rectangle([bx, 615, bx + 295, 668], fill=b_bg, outline=COLOR_CYAN, width=2)
        draw.text((bx + 28, 632), b_txt, fill=b_fg, font=font_h3)
        bx += 315

    # 3 KPI Cards at Bottom Left
    kpis = [
        ("CAPEX AWAL (3 MESIN)", "Rp8.000.000", "Tabel 5 Esai IYEEA 2026", COLOR_WHITE),
        ("PAYBACK SKENARIO MODERAT", "10,7 Bulan", "Hemat Neto Rp9 Juta/Thn", COLOR_AMBER),
        ("PEMROSESAN TEPI MANDIRI", "100% Edge AI", "Tanpa Cloud Wajib 24/7", COLOR_CYAN),
    ]
    for i, (k_t, k_v, k_s, k_c) in enumerate(kpis):
        kx = 80 + ox + i * 325
        ky = 695
        draw.rectangle([kx, ky, kx + 305, ky + 165], fill=COLOR_CARD, outline=k_c, width=2)
        draw.text((kx + 20, ky + 18), k_t, fill=COLOR_MUTED, font=font_mono_sm)
        draw.text((kx + 20, ky + 52), k_v, fill=k_c, font=font_h1)
        draw.text((kx + 20, ky + 115), k_s, fill=COLOR_WHITE, font=font_small)

    # Right Column: Interactive 3D Hero Turntable Preview Card
    r_x = 1090 - ox
    draw.rectangle([r_x, 118, WIDTH - 60, 860], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((r_x + 25, 138), "MODEL DIGITAL TWIN V1.0 // 360° AUTO-ORBIT", fill=COLOR_CYAN, font=font_h3)
    draw.text((WIDTH - 240, 140), "FPS: 60 | WEBGL", fill=COLOR_GREEN, font=font_mono)
    draw_mini_3d_stack(draw, r_x + 380, 500, t_sec * 1.4, 0.25 + 0.2 * math.sin(t_sec * 1.5), t_sec, scale_mult=0.95)
    draw.rectangle([r_x + 30, 775, WIDTH - 90, 835], fill=COLOR_CARD_HI, outline=COLOR_AMBER, width=1)
    draw.text((r_x + 50, 795), "NODE SENSOR RETROFIT NADI-IKM • TARGET BOM Rp850.000/UNIT", fill=COLOR_AMBER, font=font_mono)
    return img

def render_scene_2_architecture(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 2, "AKAR MASALAH IKM & ARSITEKTUR EDGE AI 4 LAPIS", "index.html#architecture", t_sec, f_idx)

    draw.text((80, 112), "MENGAPA IKM MEMBUTUHKAN PEMELIHARAAN PREDIKTIF HEMAT DATA?", fill=COLOR_CYAN, font=font_h1)
    draw.text((80, 152), "4,2 Juta Unit IKM Indonesia (12,3 Juta Pekerja) Rentan Downtime Mendadak pada Mesin Tunggal Kritis", fill=COLOR_MUTED, font=font_body)

    # Top Row: 4 Problem Pillars
    probs = [
        ("01 // ASET TANPA PRIORITAS", "Kerusakan 1 motor/pompa utama menghentikan seluruh lini produksi IKM.", COLOR_ORANGE),
        ("02 // MINIM DATA HISTORIS", "IKM tidak punya ribuan jam data rusak untuk melatih AI komersial berat.", COLOR_AMBER),
        ("03 // ALARM FATIGUE", "Lonjakan getaran saat beban naik sering memicu alarm palsu tanpa konteks.", COLOR_CYAN),
        ("04 // KENDALA INTERNET & BIAYA", "Langganan cloud mahal & Wi-Fi pabrik tidak stabil bagi bengkel IKM.", COLOR_GREEN),
    ]
    for idx, (pt, pd, pc) in enumerate(probs):
        px = 80 + idx * 445
        py = 200
        draw.rectangle([px, py, px + 425, py + 170], fill=COLOR_CARD, outline=pc, width=2)
        draw.rectangle([px, py, px + 8, py + 170], fill=pc)
        draw.text((px + 22, py + 20), pt, fill=pc, font=font_h3)
        draw.text((px + 22, py + 62), pd[:42], fill=COLOR_WHITE, font=font_small)
        draw.text((px + 22, py + 86), pd[42:], fill=COLOR_WHITE, font=font_small)

    # Bottom Section: 4-Layer Architecture Pipeline with Animated Data Packets
    draw.text((80, 415), "ARSITEKTUR 4 LAPIS NADI-IKM (GAMBAR 2 ESAI IYEEA 2026)", fill=COLOR_AMBER, font=font_h1)

    layers = [
        ("LAPIS 1: SENSOR RETROFIT", "MEMS 1-2 kHz (±16g)\nSuhu RTD PT100 Kelas A\nStud M8 & Magnet N52", COLOR_CYAN),
        ("LAPIS 2: EDGE NODE ESP32-S3", "Ekstraksi Fitur RMS, Peak,\nCrest Factor & FFT Ringkas\nBuffer Lokal Saat Offline", COLOR_GREEN),
        ("LAPIS 3: GATEWAY LOKAL", "Database SQLite / CSV\nBaseline Median/MAD\nFilter Kualitas Sinyal", COLOR_AMBER),
        ("LAPIS 4: DASHBOARD & SOP", "Status 3 Tingkat Jelas\nAlasan Pemicu (Explainable)\nDaftar Periksa & Logbook", COLOR_ORANGE),
    ]
    for i, (lt, ld, lc) in enumerate(layers):
        lx = 80 + i * 445
        ly = 475
        draw.rectangle([lx, ly, lx + 390, ly + 330], fill=COLOR_CARD_HI, outline=lc, width=3)
        draw.rectangle([lx, ly, lx + 390, ly + 58], fill=lc)
        draw.text((lx + 18, ly + 16), lt, fill=(5, 11, 17), font=font_h3)
        for line_i, line_str in enumerate(ld.split("\n")):
            draw.text((lx + 22, ly + 90 + line_i * 42), f"▸ {line_str}", fill=COLOR_WHITE, font=font_body)
        draw.text((lx + 22, ly + 265), f"LATENSI LOKAL < 150 ms | LAYER 0{i+1}", fill=lc, font=font_mono_sm)

        # Animated connecting arrow to next layer
        if i < 3:
            ax1 = lx + 390
            ax2 = lx + 445
            ay = ly + 165
            draw.line([(ax1, ay), (ax2, ay)], fill=COLOR_CYAN, width=4)
            pulse_x = ax1 + int(((t_sec * 2.5) % 1.0) * (ax2 - ax1))
            draw.ellipse([pulse_x - 8, ay - 8, pulse_x + 8, ay + 8], fill=COLOR_AMBER, outline=COLOR_WHITE, width=2)

    return img

def render_scene_3_3d_highlight(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 3, "HIGHLIGHT UTAMA: 3D 360° DIGITAL TWIN & ANATOMI EXPLODED", "explore.html", t_sec, f_idx)

    explode = min(1.0, max(0.0, local_t / 6.2))
    rot_y = t_sec * 1.65

    # Left Control Panel HUD
    draw.rectangle([60, 110, 470, 880], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((84, 134), "STUDIO CAD INTERAKTIF", fill=COLOR_CYAN, font=font_h2)
    draw.text((84, 168), "Putar Otomatis 360° (Tampilan Samping)", fill=COLOR_WHITE, font=font_small)

    # Explode Slider UI inside video
    draw.text((84, 220), f"EXPLODED VIEW: {explode*100:05.1f}%", fill=COLOR_AMBER, font=font_mono_lg)
    draw.rectangle([84, 255, 440, 278], fill=(8, 18, 28), outline=COLOR_CYAN, width=1)
    draw.rectangle([84, 255, 84 + int(356 * explode), 278], fill=COLOR_AMBER)

    specs_list = [
        ("Sudut Kamera", "Side View (Elevasi 10.8°)"),
        ("Rotasi Turntable", f"{(rot_y * 180 / math.pi) % 360:05.1f}° Azimuth"),
        ("Target BOM Node", "Rp850.000 / Unit"),
        ("Metode Pasang", "Stud M8 + Magnet N52"),
        ("Akselerometer", "MEMS Triaksial 1-2 kHz"),
        ("Sensor Termal", "RTD PT100 Kelas A"),
        ("Mikrokontroler", "ESP32-S3 Dual-Core DSP"),
        ("Proteksi Listrik", "TVS Diode 600W + PTC")
    ]
    for s_i, (sk, sv) in enumerate(specs_list):
        sy = 315 + s_i * 64
        draw.rectangle([84, sy, 440, sy + 52], fill=(16, 34, 48), outline=(0, 110, 130), width=1)
        draw.text((100, sy + 8), sk, fill=COLOR_MUTED, font=font_mono_sm)
        draw.text((100, sy + 26), sv, fill=COLOR_WHITE, font=font_h3)

    # Center 3D Side-View Exploding Stack
    coords = draw_mini_3d_stack(draw, 830, 505, rot_y, explode, t_sec, scale_mult=1.08)

    # Right 6 Component Callouts
    labels = [
        ("01 // HOUSING PC-GF30 & RING LED 360°", "Sabic Lexan Tahan Benturan | Status Ring Amber", COLOR_CYAN),
        ("02 // ESP32-S3 EDGE AI & DSP VEKTOR", "Dual-Core 240 MHz | FFT & Robust MAD Lokal", COLOR_CYAN),
        ("03 // MEMS TRIAKSIAL & PROBE RTD PT100", "Getaran 1-2 kHz (±16g) + Isolasi Akustik Viton", COLOR_GOLD),
        ("04 // CATU DAYA BUCK & PROTEKSI TVS", "12-24V DC Industri | TVS Surge Clamp 36V 600W", COLOR_GREEN),
        ("05 // SASIS AL-6061 & 24 SIRIP TEMBAGA", "Pendinginan Pasif 3.8W Tanpa Kipas (Fanless)", COLOR_COPPER),
        ("06 // STUD ULIR M8 & MAGNET N52", "Retrofit Non-Invasif Daya Tarik 18.5 kgf", COLOR_AMBER),
    ]
    for idx, (lt, ld, lc) in enumerate(labels):
        c_idx = 5 - idx
        px, py, sc = coords[c_idx]
        rx = 1190
        ry = 118 + idx * 126
        draw.line([(px + int(sc * 0.9), py), (rx - 20, ry + 45), (rx, ry + 45)], fill=lc, width=2)
        draw.rectangle([rx, ry, WIDTH - 55, ry + 105], fill=COLOR_CARD_HI, outline=lc, width=2)
        draw.rectangle([rx, ry, rx + 8, ry + 105], fill=lc)
        draw.text((rx + 22, ry + 16), lt, fill=COLOR_WHITE, font=font_h3)
        draw.text((rx + 22, ry + 52), ld, fill=COLOR_MUTED, font=font_body)

    return img

def render_scene_4_dashboard(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 4, "LIVE TELEMETRY DASHBOARD & EXPLAINABLE SOP", "dashboard.html", t_sec, f_idx)

    # Top 3 Synthetic Asset Cards
    assets = [
        ("P-01 // POMPA SENTRIFUGAL UTAMA", "NORMAL", "RMS: 1.42 mm/s | Suhu: 42.5°C | Data: VALID", COLOR_GREEN),
        ("M-02 // MOTOR INDUKSI PENGGERAK 15 KW", "INSPEKSI TERJADWAL", "RMS: 4.85 mm/s (+130% di atas Baseline MAD) | 68.4°C", COLOR_AMBER),
        ("F-03 // KIPAS VENTILASI SENTRAL", "PERIKSA SENSOR", "Status Data: SENSOR_FAULT (Drop-out / Kabel RTD Lepas)", COLOR_CYAN),
    ]
    for i, (at, ast, ad, ac) in enumerate(assets):
        ax = 60 + i * 610
        ay = 108
        draw.rectangle([ax, ay, ax + 580, ay + 148], fill=COLOR_CARD_HI if i == 1 else COLOR_CARD, outline=ac, width=3 if i == 1 else 2)
        draw.text((ax + 22, ay + 16), at, fill=COLOR_WHITE, font=font_h3)
        draw.text((ax + 22, ay + 52), f"● {ast}", fill=ac, font=font_h1)
        draw.text((ax + 22, ay + 106), ad, fill=COLOR_MUTED, font=font_mono_sm)

    # Left: Main Real-Time Vibration & Temperature Trend Chart
    cx, cy, cw, ch = 60, 280, 1160, 420
    draw.rectangle([cx, cy, cx + cw, cy + ch], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((cx + 25, cy + 18), "TREN GETARAN RMS (mm/s) & SUHU BEARING (°C) — ASET M-02 (SKENARIO DEGRADASI BEARING)", fill=COLOR_WHITE, font=font_h3)

    # Robust Baseline Threshold line
    by = cy + 250
    draw.line([(cx + 40, by), (cx + cw - 40, by)], fill=COLOR_CYAN, width=2)
    draw.text((cx + 50, by - 24), "ROBUST BASELINE THRESHOLD (Median + 3×MAD = 2.20 mm/s)", fill=COLOR_CYAN, font=font_mono_sm)

    # Animated growing curve
    n_pts = int(min(65, 15 + (local_t / 6.0) * 50))
    v_pts = []
    t_pts = []
    for i in range(n_pts):
        px = cx + 45 + i * 16.5
        prog = i / 65.0
        v_val = 1.6 + (prog ** 1.8) * 3.5 + math.sin(i * 0.7) * 0.18
        vy = cy + ch - 45 - (v_val / 6.0) * (ch - 110)
        ty = cy + ch - 35 - ((0.8 + prog * 2.1) / 6.0) * (ch - 110)
        v_pts.append((px, vy))
        t_pts.append((px, ty))
    if len(v_pts) > 1:
        draw.line(t_pts, fill=COLOR_ORANGE, width=3)
        draw.line(v_pts, fill=COLOR_AMBER, width=4)
        lx, ly = v_pts[-1]
        draw.ellipse([lx - 7, ly - 7, lx + 7, ly + 7], fill=COLOR_AMBER, outline=COLOR_WHITE, width=2)

    # Explainable AI Banner below chart
    draw.rectangle([60, 720, 1220, 880], fill=(18, 34, 48), outline=COLOR_AMBER, width=2)
    draw.text((85, 738), "EXPLAINABLE DIAGNOSTIC REASONING // MENGAPA PERINGATAN INI MUNCUL?", fill=COLOR_AMBER, font=font_h2)
    draw.text((85, 776), "1. Kualitas Sinyal: VALID (Tidak ditemukan kabel lepas atau saturasi ADC pada node M-02).", fill=COLOR_GREEN, font=font_body)
    draw.text((85, 806), "2. Konteks Operasi: Beban produksi terpantau normal/stabil (bukan lonjakan transien start-up).", fill=COLOR_WHITE, font=font_body)
    draw.text((85, 836), "3. Pemicu Fisik: RMS Getaran naik +130% diikuti tren suhu bertahap (+14°C) -> Indikasi aus bearing/kopling.", fill=COLOR_CYAN, font=font_body)

    # Right: Interactive SOP Checklist & Logbook Panel
    sx, sy, sw, sh = 1250, 280, 610, 600
    draw.rectangle([sx, sy, sx + sw, sy + sh], fill=COLOR_CARD, outline=COLOR_AMBER, width=2)
    draw.text((sx + 25, sy + 20), "SOP TINDAKAN TEKNISI & LOGBOOK", fill=COLOR_AMBER, font=font_h2)
    sops = [
        ("✓ [SELESAI] 01. Cek Dudukan Sensor & Stud M8", "Pastikan magnet N52 & baut tidak longgar", COLOR_GREEN),
        ("✓ [SELESAI] 02. Verifikasi Beban Operasi", "Bandingkan RPM motor dengan jadwal produksi", COLOR_GREEN),
        ("● [AKTIF]   03. Inspeksi Bearing & Pelumasan", "Cek grease bearing depan & kelurusan kopling", COLOR_AMBER),
        ("○ [ANTRE]   04. Catat Hasil di Logbook CSV", "Simpan bukti tindakan untuk evaluasi baseline", COLOR_MUTED),
    ]
    for idx, (st, sd, sc) in enumerate(sops):
        cy_sop = sy + 78 + idx * 112
        draw.rectangle([sx + 22, cy_sop, sx + sw - 22, cy_sop + 94], fill=COLOR_CARD_HI, outline=sc, width=2)
        draw.text((sx + 40, cy_sop + 16), st, fill=sc, font=font_h3)
        draw.text((sx + 40, cy_sop + 50), sd, fill=COLOR_WHITE, font=font_small)

    draw.rectangle([sx + 22, sy + 530, sx + sw - 22, sy + 580], fill=COLOR_CYAN)
    draw.text((sx + 145, sy + 544), "UNDUH LOGBOOK INSPEKSI (.CSV)", fill=(5, 11, 17), font=font_h3)

    return img

def render_scene_5_team(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 5, "MINDMAP STRUKTUR TIM & JOBDESK REKAYASA", "team.html", t_sec, f_idx)

    draw.text((70, 104), "ARSITEKTUR ORGANISASI TIM REKAYASA NADI-IKM (UNIVERSITAS BRAWIJAYA)", fill=COLOR_CYAN, font=font_h1)

    # TOP COMMAND HUB: BIMO SATRIO (KETUA TIM / PROJECT COORDINATOR & WEB/DASHBOARD ARCHITECT)
    bx, by, bw, bh = 380, 158, 1160, 245
    draw.rectangle([bx, by, bx + bw, by + bh], fill=(16, 36, 54), outline=COLOR_CYAN, width=4)
    draw.rectangle([bx, by, bx + bw, by + 10], fill=COLOR_AMBER)

    # Avatar Badge BS
    draw.rectangle([bx + 30, by + 35, bx + 185, by + 190], fill=COLOR_CYAN, outline=COLOR_WHITE, width=3)
    draw.text((bx + 64, by + 82), "BS", fill=(5, 11, 17), font=font_hero)

    draw.text((bx + 215, by + 28), "BIMO SATRIO  [NIM: 245150307111060]", fill=COLOR_WHITE, font=font_h1)
    draw.text((bx + 215, by + 70), "KETUA TIM (PROJECT COORDINATOR) • LEAD ARSITEK WEB, 3D LAB & DASHBOARD", fill=COLOR_AMBER, font=font_h2)
    bimo_tasks = [
        "▸ Koordinator Utama Riset & Penyatuan Sistem End-to-End (Hardware + AI + Web) untuk Kompetisi IYEEA 2026",
        "▸ Perancang Utama Arsitektur Website Interaktif, UX/UI Retro-Industrial, & 3D 360° Digital Twin WebGL",
        "▸ Pengembang Simulasi Telemetry Dashboard Multi-Skenario, Kalkulator ROI, & Deployment GitHub + Vercel"
    ]
    for i, bt in enumerate(bimo_tasks):
        draw.text((bx + 215, by + 112 + i * 32), bt, fill=COLOR_WHITE, font=font_body)

    # Animated Mindmap Circuit Bus Connecting Bimo -> Ihwan & Raiz
    mid_x = WIDTH // 2
    bus_y = 445
    draw.line([(mid_x, by + bh), (mid_x, bus_y)], fill=COLOR_CYAN, width=4)
    draw.line([(470, bus_y), (1450, bus_y)], fill=COLOR_AMBER, width=4)
    draw.line([(470, bus_y), (470, 495)], fill=COLOR_CYAN, width=4)
    draw.line([(1450, bus_y), (1450, 495)], fill=COLOR_AMBER, width=4)

    # Flowing data pulses on mindmap circuit
    pulse_p = (t_sec * 1.8) % 1.0
    px_l = int(mid_x - pulse_p * (mid_x - 470))
    px_r = int(mid_x + pulse_p * (1450 - mid_x))
    draw.ellipse([px_l - 9, bus_y - 9, px_l + 9, bus_y + 9], fill=COLOR_CYAN, outline=COLOR_WHITE, width=2)
    draw.ellipse([px_r - 9, bus_y - 9, px_r + 9, bus_y + 9], fill=COLOR_AMBER, outline=COLOR_WHITE, width=2)

    # LEFT BRANCH: IHWAN RIDWAN S. M.
    ix, iy, iw, ih = 70, 495, 840, 385
    draw.rectangle([ix, iy, ix + iw, iy + ih], fill=COLOR_CARD, outline=COLOR_CYAN, width=3)
    draw.rectangle([ix, iy, ix + iw, iy + 8], fill=COLOR_CYAN)
    draw.rectangle([ix + 28, iy + 30, ix + 138, iy + 140], fill=COLOR_CYAN)
    draw.text((ix + 55, iy + 62), "IR", fill=(5, 11, 17), font=font_h1)
    draw.text((ix + 165, iy + 28), "IHWAN RIDWAN S. M.", fill=COLOR_WHITE, font=font_h1)
    draw.text((ix + 165, iy + 70), "LEAD SISTEM TERTANAM & HARDWARE ENGINEERING", fill=COLOR_CYAN, font=font_h2)
    draw.text((ix + 165, iy + 104), "Universitas Brawijaya • Fokus: Sensor Node, Proteksi & Mekanik", fill=COLOR_MUTED, font=font_small)

    ihwan_tasks = [
        "1. Akuisisi Sensor Akselerometer MEMS Triaksial (1-2 kHz) & Probe Suhu RTD PT100",
        "2. Perancangan Catu Daya Buck 12-24V DC, Dioda TVS Surge 600W & Sekering PTC",
        "3. Desain Mekanik Sasis Pendingin Tembaga C1100, Stud M8 & Magnet Neodymium N52",
        "4. Optimalisasi Bill of Materials (BOM) Perangkat Keras Target Rp850.000 / Node"
    ]
    for i, it in enumerate(ihwan_tasks):
        draw.rectangle([ix + 28, iy + 158 + i * 52, ix + iw - 28, iy + 200 + i * 52], fill=COLOR_CARD_HI, outline=(0, 110, 130))
        draw.text((ix + 42, iy + 168 + i * 52), it, fill=COLOR_WHITE, font=font_small)

    # RIGHT BRANCH: MUHAMMAD RAIZ BELYAA
    rx, ry, rw, rh = 1010, 495, 840, 385
    draw.rectangle([rx, ry, rx + rw, ry + rh], fill=COLOR_CARD, outline=COLOR_AMBER, width=3)
    draw.rectangle([rx, ry, rx + rw, ry + 8], fill=COLOR_AMBER)
    draw.rectangle([rx + 28, ry + 30, rx + 138, ry + 140], fill=COLOR_AMBER)
    draw.text((rx + 50, ry + 62), "MR", fill=(5, 11, 17), font=font_h1)
    draw.text((rx + 165, ry + 28), "MUHAMMAD RAIZ BELYAA", fill=COLOR_WHITE, font=font_h1)
    draw.text((rx + 165, ry + 70), "LEAD KECERDASAN BUATAN (EDGE AI) & ANALITIK DATA", fill=COLOR_AMBER, font=font_h2)
    draw.text((rx + 165, ry + 104), "Universitas Brawijaya • Fokus: Algoritma Anomali & Model Ekonomi", fill=COLOR_MUTED, font=font_small)

    raiz_tasks = [
        "1. Perancangan Baseline Adaptif Spesifik Mesin Berbasis Statistik Robust (Median/MAD)",
        "2. Evaluasi Komparatif Isolation Forest & Deteksi Multi-Indikator pada Gateway Lokal",
        "3. Logika Pemisahan Gangguan Sensor (Kabel Lepas/Dropout) dari Kerusakan Mekanis",
        "4. Pemodelan Sensitivitas Ekonomi Siklus Pertama, CAPEX/OPEX & Analisis Payback ROI"
    ]
    for i, rt in enumerate(raiz_tasks):
        draw.rectangle([rx + 28, ry + 158 + i * 52, rx + rw - 28, ry + 200 + i * 52], fill=COLOR_CARD_HI, outline=(140, 95, 25))
        draw.text((rx + 42, ry + 168 + i * 52), rt, fill=COLOR_WHITE, font=font_small)

    return img

def render_scene_6_finale(t_sec, local_t, f_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 6, "KALKULATOR SENSITIVITAS ROI, 16 REFERENSI & FINALE", "research.html", t_sec, f_idx)

    # Left: Financial Sensitivity Simulator Box
    draw.rectangle([70, 110, 930, 515], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((98, 134), "SIMULATOR SENSITIVITAS EKONOMI (TABEL 5 & 6 ESAI)", fill=COLOR_CYAN, font=font_h2)
    scenarios = [
        ("Skenario Konservatif (8 Jam @ Rp500rb)", "Manfaat Bersih: +Rp1.000.000/thn", "Payback: ~96,0 Bulan", COLOR_MUTED),
        ("Skenario Moderat [Rekomendasi] (12 Jam @ Rp1 Jt)", "Manfaat Bersih: +Rp9.000.000/thn", "Payback: ~10,7 Bulan", COLOR_GREEN),
        ("Skenario Intensitas Tinggi (16 Jam @ Rp1,5 Jt)", "Manfaat Bersih: +Rp21.000.000/thn", "Payback: ~4,6 Bulan", COLOR_AMBER),
    ]
    for idx, (st, sm, sp, sc) in enumerate(scenarios):
        sy = 185 + idx * 102
        draw.rectangle([98, sy, 902, sy + 88], fill=COLOR_CARD_HI, outline=sc, width=2)
        draw.text((118, sy + 14), st, fill=COLOR_WHITE, font=font_h3)
        draw.text((118, sy + 48), sm, fill=sc, font=font_body)
        draw.text((640, sy + 32), sp, fill=sc, font=font_h2)

    # Right: 16 Peer-Reviewed References & Standards
    draw.rectangle([970, 110, WIDTH - 70, 515], fill=COLOR_CARD, outline=COLOR_AMBER, width=2)
    draw.text((998, 134), "16 REFERENSI ILMIAH & STANDAR INTERNASIONAL", fill=COLOR_AMBER, font=font_h2)
    refs = [
        "• ISO 17359:2018 — Condition Monitoring and Diagnostics of Machines",
        "• ISO 20816-3:2026 — Mechanical Vibration Evaluation of Industrial Machines",
        "• NIST SP 800-82r3 — Guide to Operational Technology (OT) Security",
        "• Cummins et al. (2024) IEEE Access — Explainable Predictive Maintenance",
        "• Liu, Ting & Zhou (2008) IEEE ICDM — Isolation Forest Anomaly Detection",
        "• Carvalho et al. (2019) Computers & Ind. Eng. — Systematic Review of ML PdM",
        "• Kementerian Perindustrian RI & BPS — Data Strategis IKM Nasional"
    ]
    for idx, r_str in enumerate(refs):
        draw.text((998, 185 + idx * 44), r_str, fill=COLOR_WHITE, font=font_body)

    # Grand Finale Hero Banner at Bottom
    draw.rectangle([70, 545, WIDTH - 70, 885], fill=(14, 30, 46), outline=COLOR_CYAN, width=4)
    draw.rectangle([70, 545, WIDTH - 70, 557], fill=COLOR_AMBER)
    draw.text((120, 585), "NADI-IKM // INTELLIGENT RETROFIT MACHINE CARE", fill=COLOR_WHITE, font=font_hero)
    draw.text((120, 648), "Karya Inovasi Mahasiswa Universitas Brawijaya untuk IYEEA 2026", fill=COLOR_CYAN, font=font_h1)
    draw.text((120, 705), "Ketua Tim & Arsitek Web/3D/Dashboard: Bimo Satrio (245150307111060)", fill=COLOR_AMBER, font=font_h2)
    draw.text((120, 745), "Hardware & Embedded Lead: Ihwan Ridwan S. M.  |  Edge AI & Analytics Lead: Muhammad Raiz Belyaa", fill=COLOR_WHITE, font=font_h2)
    draw.text((120, 805), "GitHub Repository: github.com/bimskuy1205/Nadi-IKM  •  Siap Deploy Publik di Vercel", fill=COLOR_GREEN, font=font_mono_lg)

    return img

# =============================================================================
# LUXURY CINEMATIC TRANSITION COMPOSITOR
# =============================================================================

CHAPTER_BOUNDS = [
    (0.0, 7.0, render_scene_1_hero, "01 // HERO & LIVE OSCILLOSCOPE"),
    (7.0, 13.5, render_scene_2_architecture, "02 // ARSITEKTUR EDGE AI 4 LAPIS"),
    (13.5, 21.5, render_scene_3_3d_highlight, "03 // 3D 360° EXPLODED ANATOMY LAB"),
    (21.5, 29.5, render_scene_4_dashboard, "04 // TELEMETRY DASHBOARD & SOP"),
    (29.5, 36.5, render_scene_5_team, "05 // STRUKTUR TIM: BIMO • IHWAN • RAIZ"),
    (36.5, 42.0, render_scene_6_finale, "06 // SENSITIVITAS ROI & 16 SITASI"),
]

TRANSITION_DUR = 1.10  # 1.1 seconds luxury transition between scenes

def apply_luxury_transition(img_a, img_b, p, next_title):
    """
    Applies a jaw-dropping multi-layer transition between img_a and img_b for p in [0, 1]:
    1. Smooth S-curve cross-dissolve
    2. Diagonal Cyber-Shutter Wipe with glowing Cyan & Phosphor Amber laser beams
    3. Center Holographic HUD Chapter Title Flash Card
    """
    smooth_p = p * p * (3.0 - 2.0 * p)
    blended = Image.blend(img_a, img_b, smooth_p)
    draw = ImageDraw.Draw(blended)

    # Diagonal Laser Scan Beam sweeping from left to right across the screen
    sweep_x = int(-300 + smooth_p * (WIDTH + 600))
    tilt = 260

    # Glowing Cyber-Shutter Laser Lines
    draw.line([(sweep_x - tilt, 0), (sweep_x + tilt, HEIGHT)], fill=COLOR_CYAN, width=10)
    draw.line([(sweep_x - tilt - 35, 0), (sweep_x + tilt - 35, HEIGHT)], fill=COLOR_AMBER, width=6)
    draw.line([(sweep_x - tilt + 35, 0), (sweep_x + tilt + 35, HEIGHT)], fill=COLOR_WHITE, width=4)

    # Horizontal HUD Aperture Bars at peak of transition (0.2 < p < 0.8)
    banner_alpha = math.sin(p * math.pi)
    if banner_alpha > 0.25:
        bh = int(68 * banner_alpha)
        cy = HEIGHT // 2
        draw.rectangle([0, cy - bh, WIDTH, cy + bh], fill=(6, 16, 26), outline=COLOR_CYAN, width=3)
        draw.line([(0, cy - bh + 6), (WIDTH, cy - bh + 6)], fill=COLOR_AMBER, width=2)
        draw.line([(0, cy + bh - 6), (WIDTH, cy + bh - 6)], fill=COLOR_AMBER, width=2)
        if banner_alpha > 0.55:
            draw.text((WIDTH // 2 - 360, cy - 18), f"SWITCHING MODULE >> {next_title}", fill=COLOR_CYAN, font=font_h1)

    return blended

for f in range(TOTAL_FRAMES):
    t_sec = f / float(FPS)

    # Determine active scene and check if we are inside a transition window
    active_idx = 0
    for idx, (t_start, t_end, _, _) in enumerate(CHAPTER_BOUNDS):
        if t_sec < t_end or idx == len(CHAPTER_BOUNDS) - 1:
            active_idx = idx
            break

    t_start, t_end, fn_curr, title_curr = CHAPTER_BOUNDS[active_idx]
    local_t = t_sec - t_start

    # Check if we are within TRANSITION_DUR of the end of the current chapter
    time_left = t_end - t_sec
    if active_idx < len(CHAPTER_BOUNDS) - 1 and time_left <= TRANSITION_DUR:
        trans_p = 1.0 - (time_left / TRANSITION_DUR)
        next_start, _, fn_next, title_next = CHAPTER_BOUNDS[active_idx + 1]
        img_curr = fn_curr(t_sec, local_t, f)
        img_next = fn_next(t_sec, max(0.0, t_sec - next_start), f)
        final_frame = apply_luxury_transition(img_curr, img_next, trans_p, title_next)
    else:
        final_frame = fn_curr(t_sec, local_t, f)

    pipe.stdin.write(final_frame.tobytes())

    if f % 180 == 0 or f == TOTAL_FRAMES - 1:
        print(f"Showcase Video Progress: {f+1}/{TOTAL_FRAMES} frames ({((f+1)/TOTAL_FRAMES)*100:.1f}%) | Time: {t_sec:.1f}s")

pipe.stdin.close()
pipe.wait()
print(f"SUCCESS: Upgraded 42-Second Full Website Masterpiece Video saved to {OUTPUT_MP4}")
