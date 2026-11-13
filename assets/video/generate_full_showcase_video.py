"""
NADI-IKM: Full Website, 3D 360° Hologram Lab, Telemetry Dashboard & Team Mindmap Masterpiece Video
Renders 1260 frames (42.0 seconds @ 30 fps, 1920x1080 Full HD) and encodes to MP4 with FFmpeg.
Upgrades:
- Exotic Multi-Gradient Colour-Graded Background (Cyan, Amber, Cyber-Magenta, Synth-Violet, Mint)
- Highlighted NADI-IKM Holographic Brand Crest in Navbar & Hero
- 3D Hologram Orbital Rings & Projection Beams fused with the 3D 360° Digital Twin
- Layman-Friendly ("Paham Dalam 10 Detik / Bahasa Awam") Explanations in every Chapter
- Ultra-Luxury Multi-Beam Holographic Cyber-Shutter Transitions between all 6 Chapters
"""

import math
import os
import subprocess
import numpy as np
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

# Exotic Retro-Industrial & Hologram Palette
COLOR_CYAN = (0, 242, 254)
COLOR_AMBER = (255, 168, 52)
COLOR_ORANGE = (255, 94, 54)
COLOR_MAGENTA = (255, 46, 147)
COLOR_VIOLET = (121, 40, 202)
COLOR_GREEN = (0, 255, 135)
COLOR_GOLD = (250, 204, 78)
COLOR_COPPER = (228, 124, 72)
COLOR_SILVER = (220, 232, 244)
COLOR_CARD = (10, 24, 38)
COLOR_CARD_HI = (18, 40, 62)
COLOR_PCB = (8, 76, 66)
COLOR_WHITE = (246, 250, 255)
COLOR_MUTED = (165, 190, 212)

print("Pre-computing Exotic Retro-Industrial Colour-Graded Background for Full Showcase...")

yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
nx = xx / float(WIDTH)
ny = yy / float(HEIGHT)

base_r = np.full((HEIGHT, WIDTH), 5.0, dtype=np.float32)
base_g = np.full((HEIGHT, WIDTH), 11.0, dtype=np.float32)
base_b = np.full((HEIGHT, WIDTH), 20.0, dtype=np.float32)

d1 = np.exp(-(((nx - 0.18) ** 2) / 0.07 + ((ny - 0.25) ** 2) / 0.08))
base_g += d1 * 56.0
base_b += d1 * 72.0

d2 = np.exp(-(((nx - 0.82) ** 2) / 0.07 + ((ny - 0.28) ** 2) / 0.08))
base_r += d2 * 58.0
base_g += d2 * 36.0
base_b += d2 * 10.0

d3 = np.exp(-(((nx - 0.55) ** 2) / 0.08 + ((ny - 0.65) ** 2) / 0.09))
base_r += d3 * 48.0
base_g += d3 * 10.0
base_b += d3 * 38.0

d4 = np.exp(-(((nx - 0.22) ** 2) / 0.07 + ((ny - 0.82) ** 2) / 0.08))
base_r += d4 * 32.0
base_g += d4 * 12.0
base_b += d4 * 58.0

scan_mask = np.where((yy.astype(np.int32) % 4) == 0, 0.86, 1.0).astype(np.float32)
base_r *= scan_mask
base_g *= scan_mask
base_b *= scan_mask

bg_rgb = np.stack([
    np.clip(base_r, 0, 255).astype(np.uint8),
    np.clip(base_g, 0, 255).astype(np.uint8),
    np.clip(base_b, 0, 255).astype(np.uint8)
], axis=-1)

BASE_BG_IMG = Image.fromarray(bg_rgb, mode="RGB")
bg_draw = ImageDraw.Draw(BASE_BG_IMG)

for gy in range(0, HEIGHT, 36):
    c = (16, 42, 62) if gy % 144 == 0 else (10, 25, 38)
    bg_draw.line([(0, gy), (WIDTH, gy)], fill=c, width=1)
for gx in range(0, WIDTH, 36):
    c = (16, 42, 62) if gx % 144 == 0 else (10, 25, 38)
    bg_draw.line([(gx, 0), (gx, HEIGHT)], fill=c, width=1)

horizon_y = HEIGHT - 220
for hx in range(-400, WIDTH + 400, 110):
    bg_draw.line([(WIDTH // 2, horizon_y), (hx, HEIGHT)], fill=(0, 75, 95), width=1)

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
    font_hero = ImageFont.truetype("arialbd.ttf", 42)
    font_h1 = ImageFont.truetype("arialbd.ttf", 30)
    font_h2 = ImageFont.truetype("arialbd.ttf", 22)
    font_h3 = ImageFont.truetype("arialbd.ttf", 18)
    font_body = ImageFont.truetype("arial.ttf", 16)
    font_layman = ImageFont.truetype("arialbd.ttf", 15)
    font_small = ImageFont.truetype("arial.ttf", 14)
    font_mono_lg = ImageFont.truetype("consolab.ttf", 19)
    font_mono = ImageFont.truetype("consola.ttf", 14)
    font_mono_sm = ImageFont.truetype("consola.ttf", 12)
except Exception:
    font_hero = font_h1 = font_h2 = font_h3 = font_body = font_layman = font_small = font_mono_lg = font_mono = font_mono_sm = ImageFont.load_default()

def ease_out_cubic(x):
    x = max(0.0, min(1.0, x))
    return 1.0 - pow(1.0 - x, 3)

def draw_base_chrome(draw, chapter_num, chapter_title, url_path, t_sec, f_idx):
    # Top Browser & Highlighted NADI-IKM Brand Navbar
    draw.rectangle([28, 16, WIDTH - 28, 86], fill=(8, 20, 34), outline=COLOR_CYAN, width=2)
    # Highlighted Brand Emblem Crest on Left
    draw.rectangle([42, 24, 315, 78], fill=(14, 34, 54), outline=COLOR_AMBER, width=2)
    draw.rectangle([48, 30, 92, 72], fill=COLOR_CYAN)
    draw.text((60, 36), "N", fill=(5, 11, 17), font=font_h1)
    draw.text((104, 28), "NADI-IKM", fill=COLOR_WHITE, font=font_h2)
    draw.text((104, 54), "HOLOGRAM EDGE AI", fill=COLOR_AMBER, font=font_mono_sm)

    # URL Bar
    draw.rectangle([330, 32, 760, 70], fill=(12, 28, 44), outline=(0, 140, 165), width=1)
    draw.text((346, 42), f"https://nadi-ikm.vercel.app/{url_path}", fill=COLOR_CYAN, font=font_mono)

    # Chapter Title & Clock
    draw.text((785, 38), f"ALUR 0{chapter_num}/06 // {chapter_title}", fill=COLOR_AMBER, font=font_h2)
    draw.text((WIDTH - 340, 42), f"REC ● {t_sec:05.2f}s | FRAME {f_idx:04d}", fill=COLOR_GREEN, font=font_mono)

    # Bottom Status Footer
    draw.rectangle([28, HEIGHT - 56, WIDTH - 28, HEIGHT - 14], fill=(8, 20, 34), outline=COLOR_MAGENTA, width=1)
    draw.text((48, HEIGHT - 44), "NADI-IKM • UNIVERSITAS BRAWIJAYA • IYEEA 2026 | KETUA TIM & ARSITEK WEB/3D: BIMO SATRIO (245150307111060) • IHWAN RIDWAN • MUHAMMAD RAIZ", fill=COLOR_WHITE, font=font_mono_sm)
    prog_w = int((WIDTH - 56) * (t_sec / DURATION_SEC))
    draw.rectangle([28, HEIGHT - 18, 28 + prog_w, HEIGHT - 14], fill=COLOR_CYAN)

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

def draw_holo_3d_stack(draw, cx_screen, cy_screen, rot_y, explode, t_sec, scale_mult=1.0):
    fov = 620 * scale_mult
    # Clean, unobstructed 3D model without circular rings blocking the view
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

    sx_top, sy_top, sc_top = coords_out[-1]
    draw.ellipse([sx_top - sc_top * 0.72, sy_top - sc_top * 0.15, sx_top + sc_top * 0.72, sy_top + sc_top * 0.15], outline=COLOR_AMBER, width=4)
    return coords_out

# =============================================================================
# 6 SCENE RENDERERS
# =============================================================================

def render_scene_1_hero(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 1, "HERO, BRAND IDENTITY & STETOSKOP PINTAR MESIN", "index.html#hero", t_sec, f_idx)

    enter = ease_out_cubic(local_t / 1.1)
    ox = int((1.0 - enter) * -70)

    # Highlighted Hero Brand Crest Card
    draw.rectangle([75 + ox, 106, 1035 + ox, 182], fill=COLOR_CARD_HI, outline=COLOR_CYAN, width=2)
    draw.rectangle([85 + ox, 114, 155 + ox, 174], fill=COLOR_AMBER)
    draw.text((106 + ox, 126), "N", fill=(5, 11, 17), font=font_hero)
    draw.text((175 + ox, 114), "NADI-IKM // INTELLIGENT MACHINE CARE", fill=COLOR_WHITE, font=font_h1)
    draw.text((175 + ox, 152), "STETOSKOP HOLOGRAM & EDGE AI RETROFIT UNTUK 4,2 JUTA IKM INDONESIA", fill=COLOR_CYAN, font=font_mono)

    draw.text((75 + ox, 200), "Sebelum mesin berhenti,", fill=COLOR_WHITE, font=font_hero)
    draw.text((75 + ox, 252), "pahami sinyalnya.", fill=COLOR_AMBER, font=font_hero)

    # Layman-Friendly Pill ("Paham Dalam 10 Detik")
    draw.rectangle([75 + ox, 316, 1035 + ox, 422], fill=(20, 34, 52), outline=COLOR_AMBER, width=2)
    draw.rectangle([75 + ox, 316, 85 + ox, 422], fill=COLOR_AMBER)
    draw.text((102 + ox, 326), "★ PAHAM DALAM 10 DETIK (PENJELASAN MUDAH UNTUK ORANG AWAM):", fill=COLOR_AMBER, font=font_layman)
    draw.text((102 + ox, 354), "Bayangkan NADI-IKM seperti 'Stetoskop Dokter Pintar' yang ditempel dengan magnet di luar bodi mesin pabrik.", fill=COLOR_WHITE, font=font_body)
    draw.text((102 + ox, 382), "Sebelum mesin macet mendadak & bikin rugi puluhan juta, alat ini mendeteksi getaran/panas sejak dini!", fill=COLOR_CYAN, font=font_body)

    # Live Oscilloscope Box
    osc_x, osc_y, osc_w, osc_h = 75 + ox, 442, 960, 210
    draw.rectangle([osc_x, osc_y, osc_x + osc_w, osc_y + osc_h], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((osc_x + 20, osc_y + 14), "LIVE OSCILLOSCOPE // GELOMBANG GETARAN MESIN (2.048 kS/s)", fill=COLOR_CYAN, font=font_mono)
    thresh_y = osc_y + 68
    draw.line([(osc_x + 20, thresh_y), (osc_x + osc_w - 20, thresh_y)], fill=COLOR_MAGENTA, width=2)
    draw.text((osc_x + osc_w - 360, thresh_y - 22), "BATAS AMAN OTOMATIS (ROBUST MAD)", fill=COLOR_MAGENTA, font=font_mono_sm)

    pts = []
    for x in range(osc_x + 25, osc_x + osc_w - 25, 6):
        ph = (x * 0.025) + (t_sec * 9.5)
        wy = osc_y + 135 + math.sin(ph) * 36 + math.sin(ph * 2.7) * 18
        pts.append((x, wy))
    draw.line(pts, fill=COLOR_GREEN, width=3)

    # 3 KPI Cards
    kpis = [
        ("MODAL AWAL (3 MESIN)", "Rp8.000.000", "Tabel 5 Esai IYEEA 2026", COLOR_WHITE),
        ("BALIK MODAL (MODERAT)", "10,7 Bulan", "Hemat Neto Rp9 Juta/Thn", COLOR_AMBER),
        ("BEKERJA TANPA INTERNET", "100% Edge AI", "Mandiri di Lokasi Pabrik", COLOR_CYAN),
    ]
    for i, (k_t, k_v, k_s, k_c) in enumerate(kpis):
        kx = 75 + ox + i * 325
        ky = 675
        draw.rectangle([kx, ky, kx + 308, ky + 195], fill=COLOR_CARD_HI, outline=k_c, width=2)
        draw.text((kx + 20, ky + 20), k_t, fill=COLOR_MUTED, font=font_mono_sm)
        draw.text((kx + 20, ky + 58), k_v, fill=k_c, font=font_h1)
        draw.text((kx + 20, ky + 125), k_s, fill=COLOR_WHITE, font=font_small)

    # Right Column: 3D Hologram Preview Card
    r_x = 1075 - ox
    draw.rectangle([r_x, 106, WIDTH - 50, 870], fill=COLOR_CARD, outline=COLOR_CYAN, width=3)
    draw.text((r_x + 24, 126), "3D HOLOGRAM DIGITAL TWIN // 360° GYRO", fill=COLOR_CYAN, font=font_h3)
    draw_holo_3d_stack(draw, r_x + 395, 505, t_sec * 1.5, 0.28 + 0.22 * math.sin(t_sec * 1.6), t_sec, scale_mult=0.96)
    draw.rectangle([r_x + 28, 785, WIDTH - 78, 848], fill=COLOR_CARD_HI, outline=COLOR_AMBER, width=2)
    draw.text((r_x + 48, 806), "STETOSKOP MAGNETIK RETROFIT • TARGET BOM Rp850.000/UNIT", fill=COLOR_AMBER, font=font_mono)
    return img

def render_scene_2_architecture(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 2, "MASALAH PABRIK IKM & CARA KERJA 4 LAPIS", "index.html#architecture", t_sec, f_idx)

    draw.text((75, 106), "KENAPA MESIN PABRIK KECIL SERING MOGOK MENDADAK?", fill=COLOR_CYAN, font=font_h1)
    draw.text((75, 146), "Bahasa Awam: Menunggu mesin berasap baru diperbaiki membuat pabrik rugi besar. Sensor biasa terlalu mahal & butuh Wi-Fi cepat.", fill=COLOR_AMBER, font=font_layman)

    probs = [
        ("01 // 1 MESIN MATI, SEMUA BERHENTI", "Jika motor/pompa utama macet, seluruh produksi pabrik langsung lumpuh.", COLOR_ORANGE),
        ("02 // TIDAK PUNYA DATA RUSAK", "Pabrik kecil tidak punya rekaman ribuan jam mesin rusak untuk melatih AI biasa.", COLOR_AMBER),
        ("03 // SERING ALARM PALSU", "Saat mesin baru dinyalakan getarannya naik, memicu alarm palsu yang membingungkan.", COLOR_MAGENTA),
        ("04 // SINYAL INTERNET LEMAH", "Banyak bengkel IKM tidak punya Wi-Fi stabil atau biaya langganan cloud bulanan.", COLOR_CYAN),
    ]
    for idx, (pt, pd, pc) in enumerate(probs):
        px = 75 + idx * 448
        py = 188
        draw.rectangle([px, py, px + 428, py + 168], fill=COLOR_CARD, outline=pc, width=2)
        draw.rectangle([px, py, px + 8, py + 168], fill=pc)
        draw.text((px + 20, py + 18), pt, fill=pc, font=font_h3)
        draw.text((px + 20, py + 60), pd[:44], fill=COLOR_WHITE, font=font_small)
        draw.text((px + 20, py + 84), pd[44:], fill=COLOR_WHITE, font=font_small)

    draw.text((75, 392), "SOLUSI NADI-IKM: 4 LANGKAH MENGUBAH GETARAN JADI KEPUTUSAN", fill=COLOR_GREEN, font=font_h1)
    draw.text((75, 432), "Analogi Smartwatch: Meraba detak mesin -> Menghitung di dalam alat -> Menyaring alarm palsu -> Memberi panduan teknisi!", fill=COLOR_WHITE, font=font_layman)

    layers = [
        ("LANGKAH 1: RABA GETARAN", "Sensor MEMS (1-2 kHz) &\nTermometer RTD PT100\nDitempel Magnet N52", COLOR_CYAN),
        ("LANGKAH 2: PROSES DI ALAT", "Otak ESP32-S3 menghitung\ngetaran & menyimpannya\nmeski tanpa internet", COLOR_GREEN),
        ("LANGKAH 3: SARING ALARM", "Kenali kebiasaan tiap mesin\n(Robust MAD) & bedakan\nkabel sensor yang lepas", COLOR_AMBER),
        ("LANGKAH 4: PANDUAN CEK", "Layar Dashboard memberi\ntahu bagian mesin mana\nyang harus dicek teknisi", COLOR_MAGENTA),
    ]
    for i, (lt, ld, lc) in enumerate(layers):
        lx = 75 + i * 448
        ly = 478
        draw.rectangle([lx, ly, lx + 392, ly + 365], fill=COLOR_CARD_HI, outline=lc, width=3)
        draw.rectangle([lx, ly, lx + 392, ly + 56], fill=lc)
        draw.text((lx + 18, ly + 15), lt, fill=(5, 11, 17), font=font_h3)
        for line_i, line_str in enumerate(ld.split("\n")):
            draw.text((lx + 22, ly + 92 + line_i * 44), f"▸ {line_str}", fill=COLOR_WHITE, font=font_body)
        draw.text((lx + 22, ly + 295), f"HOLO-PIPELINE // STEP 0{i+1}", fill=lc, font=font_mono_sm)

        if i < 3:
            ax1 = lx + 392
            ax2 = lx + 448
            ay = ly + 180
            draw.line([(ax1, ay), (ax2, ay)], fill=COLOR_CYAN, width=4)
            pulse_x = ax1 + int(((t_sec * 2.5) % 1.0) * (ax2 - ax1))
            draw.ellipse([pulse_x - 8, ay - 8, pulse_x + 8, ay + 8], fill=COLOR_AMBER, outline=COLOR_WHITE, width=2)

    return img

def render_scene_3_3d_highlight(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 3, "HIGHLIGHT 3D 360° HOLOGRAM & ANATOMI KOMPONEN", "explore.html", t_sec, f_idx)

    explode = min(1.0, max(0.0, local_t / 6.2))
    rot_y = t_sec * 1.65

    draw.rectangle([55, 106, 480, 885], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((78, 128), "STUDIO HOLOGRAM 3D 360°", fill=COLOR_CYAN, font=font_h2)
    draw.text((78, 162), "Bahasa Awam: Bedah 6 Lapis Jeroan Alat", fill=COLOR_AMBER, font=font_layman)

    draw.text((78, 210), f"EXPLODED VIEW: {explode*100:05.1f}%", fill=COLOR_GREEN, font=font_mono_lg)
    draw.rectangle([78, 245, 452, 270], fill=(8, 18, 28), outline=COLOR_CYAN, width=1)
    draw.rectangle([78, 245, 78 + int(374 * explode), 270], fill=COLOR_AMBER)

    specs_list = [
        ("Sudut Kamera", "Tampilan Samping + Orbit 360°"),
        ("Efek Visual", "Hologram Gyro + Laser Scan"),
        ("Target Biaya Alat", "Rp850.000 / Unit Sensor"),
        ("Cara Pasang", "Tempel Magnet N52 (Tanpa Bor)"),
        ("Sensor Getaran", "MEMS 1-2 kHz (Telinga Mesin)"),
        ("Sensor Panas", "RTD PT100 (Termometer Industri)"),
        ("Otak Pemroses", "ESP32-S3 Dual-Core 240 MHz"),
        ("Pelindung Listrik", "Dioda TVS 600W + Sekering PTC")
    ]
    for s_i, (sk, sv) in enumerate(specs_list):
        sy = 300 + s_i * 68
        draw.rectangle([78, sy, 452, sy + 56], fill=(16, 36, 54), outline=(0, 130, 155), width=1)
        draw.text((94, sy + 8), sk, fill=COLOR_MUTED, font=font_mono_sm)
        draw.text((94, sy + 28), sv, fill=COLOR_WHITE, font=font_h3)

    coords = draw_holo_3d_stack(draw, 835, 505, rot_y, explode, t_sec, scale_mult=1.08)

    labels = [
        ("01 // TUTUP POLIKARBONAT & CINCIN LED 360°", "Awam: Cangkang tahan banting & lampu status warna", COLOR_CYAN),
        ("02 // OTAK MIKROKONTROLER ESP32-S3 (EDGE AI)", "Awam: Menganalisis gejala rusak langsung tanpa internet", COLOR_GREEN),
        ("03 // SENSOR GETARAN MEMS & SUHU RTD PT100", "Awam: Merasakan getaran kasar & panas bantalan mesin", COLOR_GOLD),
        ("04 // PENSTABIL LISTRIK & ANTI-KORSLET (TVS)", "Awam: Melindungi alat saat listrik pabrik naik-turun", COLOR_MAGENTA),
        ("05 // PENDINGIN AL-6061 & 24 SIRIP TEMBAGA", "Awam: Membuang panas otomatis tanpa kipas", COLOR_COPPER),
        ("06 // KAKI MAGNET N52 & BAUT ULIR M8", "Awam: Langsung menempel kuat di bodi besi mesin", COLOR_AMBER),
    ]
    for idx, (lt, ld, lc) in enumerate(labels):
        c_idx = 5 - idx
        px, py, sc = coords[c_idx]
        rx = 1185
        ry = 112 + idx * 128
        draw.line([(px + int(sc * 0.9), py), (rx - 20, ry + 48), (rx, ry + 48)], fill=lc, width=2)
        draw.rectangle([rx, ry, WIDTH - 48, ry + 108], fill=COLOR_CARD_HI, outline=lc, width=2)
        draw.rectangle([rx, ry, rx + 8, ry + 108], fill=lc)
        draw.text((rx + 22, ry + 16), lt, fill=COLOR_WHITE, font=font_h3)
        draw.text((rx + 22, ry + 54), f"★ {ld}", fill=COLOR_AMBER, font=font_layman)

    return img

def render_scene_4_dashboard(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 4, "LAYAR DASHBOARD PINTAR & PANDUAN TEKNISI", "dashboard.html", t_sec, f_idx)

    # Top 3 Synthetic Asset Cards
    assets = [
        ("P-01 // POMPA PENDINGIN", "HIJAU: NORMAL", "Getaran: 1.42 mm/s | Suhu: 42.5°C (Mesin Sehat)", COLOR_GREEN),
        ("M-02 // MOTOR PENGGERAK UTAMA", "KUNING: PERLU DICEK", "Getaran: 4.85 mm/s (+130%) | Suhu: 68.4°C (Gejala Aus)", COLOR_AMBER),
        ("F-03 // KIPAS VENTILASI", "BIRU: CEK KABEL SENSOR", "Bukan Mesin Rusak! Kabel sensor terdeteksi longgar", COLOR_CYAN),
    ]
    for i, (at, ast, ad, ac) in enumerate(assets):
        ax = 55 + i * 612
        ay = 104
        draw.rectangle([ax, ay, ax + 585, ay + 150], fill=COLOR_CARD_HI if i == 1 else COLOR_CARD, outline=ac, width=3 if i == 1 else 2)
        draw.text((ax + 22, ay + 16), at, fill=COLOR_WHITE, font=font_h3)
        draw.text((ax + 22, ay + 52), f"● {ast}", fill=ac, font=font_h1)
        draw.text((ax + 22, ay + 108), ad, fill=COLOR_WHITE, font=font_layman)

    cx, cy, cw, ch = 55, 275, 1165, 420
    draw.rectangle([cx, cy, cx + cw, cy + ch], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((cx + 25, cy + 18), "GRAFIK GETARAN & SUHU MESIN M-02 (DETEKSI DINI BANTALAN MULAI AUS)", fill=COLOR_WHITE, font=font_h3)

    by = cy + 250
    draw.line([(cx + 40, by), (cx + cw - 40, by)], fill=COLOR_MAGENTA, width=2)
    draw.text((cx + 50, by - 24), "BATAS AMAN NORMAL MESIN M-02 (2.20 mm/s)", fill=COLOR_MAGENTA, font=font_mono_sm)

    n_pts = int(min(65, 15 + (local_t / 6.0) * 50))
    v_pts, t_pts = [], []
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

    draw.rectangle([55, 715, 1220, 885], fill=(18, 36, 56), outline=COLOR_AMBER, width=2)
    draw.text((80, 732), "PENJELASAN AWAM OTOMATIS // KENAPA MUNCUL PERINGATAN KUNING?", fill=COLOR_AMBER, font=font_h2)
    draw.text((80, 770), "1. Kabel Sensor Bagus: Sinyal dari alat M-02 valid (bukan karena kabel putus).", fill=COLOR_GREEN, font=font_body)
    draw.text((80, 802), "2. Beban Pabrik Normal: Mesin sedang bekerja biasa, bukan sedang baru dinyalakan.", fill=COLOR_WHITE, font=font_body)
    draw.text((80, 834), "3. Kesimpulan: Getaran & panas naik bersamaan -> Bantalan (bearing) mulai kering/aus, segera beri pelumas!", fill=COLOR_CYAN, font=font_layman)

    sx, sy, sw, sh = 1245, 275, 620, 610
    draw.rectangle([sx, sy, sx + sw, sy + sh], fill=COLOR_CARD, outline=COLOR_AMBER, width=2)
    draw.text((sx + 25, sy + 20), "URUTAN LANGKAH TEKNISI (SOP)", fill=COLOR_AMBER, font=font_h2)
    sops = [
        ("✓ [SELESAI] 01. Cek Tempelan Magnet Sensor", "Pastikan sensor tidak miring/longgar", COLOR_GREEN),
        ("✓ [SELESAI] 02. Cek Putaran & Beban Mesin", "Pastikan beban produksi sesuai jadwal", COLOR_GREEN),
        ("● [LAKUKAN] 03. Beri Pelumas (Grease) Bearing", "Lumasi bantalan & cek karet kopling", COLOR_AMBER),
        ("○ [TERCATAT] 04. Simpan Bukti di Buku Digital", "Rekam tindakan ke file Logbook CSV", COLOR_CYAN),
    ]
    for idx, (st, sd, sc) in enumerate(sops):
        cy_sop = sy + 76 + idx * 114
        draw.rectangle([sx + 22, cy_sop, sx + sw - 22, cy_sop + 96], fill=COLOR_CARD_HI, outline=sc, width=2)
        draw.text((sx + 40, cy_sop + 16), st, fill=sc, font=font_h3)
        draw.text((sx + 40, cy_sop + 52), sd, fill=COLOR_WHITE, font=font_small)

    draw.rectangle([sx + 22, sy + 540, sx + sw - 22, sy + 590], fill=COLOR_CYAN)
    draw.text((sx + 145, sy + 554), "UNDUH LAPORAN INSPEKSI (.CSV)", fill=(5, 11, 17), font=font_h3)
    return img

def render_scene_5_team(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 5, "MINDMAP STRUKTUR TIM & JOBDESK REKAYASA", "team.html", t_sec, f_idx)

    draw.text((65, 102), "STRUKTUR MINDMAP TIM INOVASI NADI-IKM (UNIVERSITAS BRAWIJAYA)", fill=COLOR_CYAN, font=font_h1)

    # TOP COMMAND HUB: BIMO SATRIO
    bx, by, bw, bh = 350, 152, 1220, 250
    draw.rectangle([bx, by, bx + bw, by + bh], fill=(18, 40, 62), outline=COLOR_CYAN, width=4)
    draw.rectangle([bx, by, bx + bw, by + 12], fill=COLOR_AMBER)
    draw.rectangle([bx + 28, by + 35, bx + 185, by + 195], fill=COLOR_CYAN, outline=COLOR_WHITE, width=3)
    draw.text((bx + 62, by + 84), "BS", fill=(5, 11, 17), font=font_hero)

    draw.text((bx + 215, by + 26), "BIMO SATRIO  [NIM: 245150307111060]", fill=COLOR_WHITE, font=font_h1)
    draw.text((bx + 215, by + 68), "KETUA TIM (PROJECT COORDINATOR) • ARSITEK UTAMA WEB, 3D HOLOGRAM & DASHBOARD", fill=COLOR_AMBER, font=font_h2)
    bimo_tasks = [
        "▸ Koordinator Utama Visi Produk & Integrasi Sistem (Hardware + AI + Web) untuk Lomba Esai IYEEA 2026",
        "▸ Perancang Utama Seluruh Tampilan Website Retro-Industrial, Studio 3D 360° Hologram, & UX/UI Mudah Dipahami",
        "▸ Pengembang Simulasi Dashboard Interaktif, Kalkulator ROI, Dokumentasi Riset & Deployment GitHub + Vercel"
    ]
    for i, bt in enumerate(bimo_tasks):
        draw.text((bx + 215, by + 112 + i * 34), bt, fill=COLOR_WHITE, font=font_body)

    # Animated Mindmap Circuit Bus
    mid_x = WIDTH // 2
    bus_y = 445
    draw.line([(mid_x, by + bh), (mid_x, bus_y)], fill=COLOR_CYAN, width=4)
    draw.line([(465, bus_y), (1455, bus_y)], fill=COLOR_AMBER, width=4)
    draw.line([(465, bus_y), (465, 492)], fill=COLOR_CYAN, width=4)
    draw.line([(1455, bus_y), (1455, 492)], fill=COLOR_MAGENTA, width=4)

    pulse_p = (t_sec * 1.8) % 1.0
    px_l = int(mid_x - pulse_p * (mid_x - 465))
    px_r = int(mid_x + pulse_p * (1455 - mid_x))
    draw.ellipse([px_l - 9, bus_y - 9, px_l + 9, bus_y + 9], fill=COLOR_CYAN, outline=COLOR_WHITE, width=2)
    draw.ellipse([px_r - 9, bus_y - 9, px_r + 9, bus_y + 9], fill=COLOR_MAGENTA, outline=COLOR_WHITE, width=2)

    # LEFT BRANCH: IHWAN RIDWAN S. M.
    ix, iy, iw, ih = 65, 492, 850, 392
    draw.rectangle([ix, iy, ix + iw, iy + ih], fill=COLOR_CARD, outline=COLOR_CYAN, width=3)
    draw.rectangle([ix, iy, ix + iw, iy + 10], fill=COLOR_CYAN)
    draw.rectangle([ix + 26, iy + 28, ix + 136, iy + 138], fill=COLOR_CYAN)
    draw.text((ix + 54, iy + 60), "IR", fill=(5, 11, 17), font=font_h1)
    draw.text((ix + 160, iy + 26), "IHWAN RIDWAN S. M.", fill=COLOR_WHITE, font=font_h1)
    draw.text((ix + 160, iy + 68), "LEAD SISTEM TERTANAM & HARDWARE ENGINEERING", fill=COLOR_CYAN, font=font_h2)
    draw.text((ix + 160, iy + 104), "Universitas Brawijaya • Fokus: Perangkat Keras Sensor & Proteksi", fill=COLOR_MUTED, font=font_small)

    ihwan_tasks = [
        "1. Pemilihan Sensor Getaran MEMS Triaksial (1-2 kHz) & Probe Suhu RTD PT100",
        "2. Perancangan Rangkaian Listrik Anti-Korslet (TVS Surge 600W & Sekering PTC)",
        "3. Desain Sasis Pendingin 24 Sirip Tembaga & Kaki Magnet Neodymium N52 + Stud M8",
        "4. Efisiensi Biaya Komponen Alat agar Terjangkau bagi IKM (Target Rp850.000/node)"
    ]
    for i, it in enumerate(ihwan_tasks):
        draw.rectangle([ix + 26, iy + 156 + i * 54, ix + iw - 26, iy + 200 + i * 54], fill=COLOR_CARD_HI, outline=(0, 120, 145))
        draw.text((ix + 40, iy + 168 + i * 54), it, fill=COLOR_WHITE, font=font_small)

    # RIGHT BRANCH: MUHAMMAD RAIZ BELYAA
    rx, ry, rw, rh = 1005, 492, 850, 392
    draw.rectangle([rx, ry, rx + rw, ry + rh], fill=COLOR_CARD, outline=COLOR_AMBER, width=3)
    draw.rectangle([rx, ry, rx + rw, ry + 10], fill=COLOR_AMBER)
    draw.rectangle([rx + 26, ry + 28, rx + 136, ry + 138], fill=COLOR_AMBER)
    draw.text((rx + 48, ry + 60), "MR", fill=(5, 11, 17), font=font_h1)
    draw.text((rx + 160, ry + 26), "MUHAMMAD RAIZ BELYAA", fill=COLOR_WHITE, font=font_h1)
    draw.text((rx + 160, ry + 68), "LEAD KECERDASAN BUATAN (EDGE AI) & ANALITIK DATA", fill=COLOR_AMBER, font=font_h2)
    draw.text((rx + 160, ry + 104), "Universitas Brawijaya • Fokus: Algoritma Deteksi & Hitungan Ekonomi", fill=COLOR_MUTED, font=font_small)

    raiz_tasks = [
        "1. Rumus Batas Aman Otomatis per Mesin (Statistik Robust Median/MAD)",
        "2. Pengujian Algoritma AI Isolation Forest pada Komputer Mini Gateway Lokal",
        "3. Logika Pintar Pemisah 'Kabel Sensor Lepas' vs 'Mesin Benar-Benar Rusak'",
        "4. Perhitungan Simulasi Balik Modal (ROI Payback) & Penghematan Biaya Pabrik"
    ]
    for i, rt in enumerate(raiz_tasks):
        draw.rectangle([rx + 26, ry + 156 + i * 54, rx + rw - 26, ry + 200 + i * 54], fill=COLOR_CARD_HI, outline=(160, 105, 30))
        draw.text((rx + 40, ry + 168 + i * 54), rt, fill=COLOR_WHITE, font=font_small)

    return img

def render_scene_6_finale(t_sec, local_t, f_idx):
    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)
    draw_base_chrome(draw, 6, "SIMULASI BALIK MODAL, 16 REFERENSI DUNIA & FINALE", "research.html", t_sec, f_idx)

    draw.rectangle([65, 106, 935, 515], fill=COLOR_CARD, outline=COLOR_CYAN, width=2)
    draw.text((92, 128), "HITUNGAN BALIK MODAL (TABEL 5 & 6 ESAI IYEEA 2026)", fill=COLOR_CYAN, font=font_h2)
    scenarios = [
        ("Skenario Hemat (Cegah 8 Jam Mogok @ Rp500rb)", "Untung Bersih: +Rp1.000.000/thn", "Impas: ~96 Bulan", COLOR_MUTED),
        ("Skenario Moderat [Rekomendasi] (12 Jam @ Rp1 Jt)", "Untung Bersih: +Rp9.000.000/thn", "Impas: ~10,7 Bulan", COLOR_GREEN),
        ("Skenario Pabrik Padat (16 Jam @ Rp1,5 Jt)", "Untung Bersih: +Rp21.000.000/thn", "Impas: ~4,6 Bulan", COLOR_AMBER),
    ]
    for idx, (st, sm, sp, sc) in enumerate(scenarios):
        sy = 182 + idx * 102
        draw.rectangle([92, sy, 908, sy + 88], fill=COLOR_CARD_HI, outline=sc, width=2)
        draw.text((112, sy + 14), st, fill=COLOR_WHITE, font=font_h3)
        draw.text((112, sy + 48), sm, fill=sc, font=font_body)
        draw.text((645, sy + 32), sp, fill=sc, font=font_h2)

    draw.rectangle([965, 106, WIDTH - 65, 515], fill=COLOR_CARD, outline=COLOR_AMBER, width=2)
    draw.text((992, 128), "DIDUKUNG 16 REFERENSI ILMIAH & STANDAR DUNIA", fill=COLOR_AMBER, font=font_h2)
    refs = [
        "• ISO 17359:2018 — Standar Internasional Pemantauan Kondisi Mesin",
        "• ISO 20816-3:2026 — Standar Evaluasi Getaran Mesin Industri",
        "• NIST SP 800-82r3 — Standar Keamanan Jaringan Pabrik (OT Security)",
        "• Cummins et al. (2024) IEEE Access — Explainable Predictive Maintenance",
        "• Liu, Ting & Zhou (2008) IEEE ICDM — Algoritma Isolation Forest",
        "• Carvalho et al. (2019) Computers & Ind. Eng. — Machine Learning PdM",
        "• Kementerian Perindustrian RI & BPS — Data Resmi 4,2 Juta IKM"
    ]
    for idx, r_str in enumerate(refs):
        draw.text((992, 182 + idx * 44), r_str, fill=COLOR_WHITE, font=font_body)

    # Grand Finale Banner with Highlighted Brand Emblem
    draw.rectangle([65, 540, WIDTH - 65, 890], fill=(14, 32, 52), outline=COLOR_CYAN, width=4)
    draw.rectangle([65, 540, WIDTH - 65, 554], fill=COLOR_MAGENTA)
    draw.rectangle([105, 585, 235, 715], fill=COLOR_CARD_HI, outline=COLOR_AMBER, width=3)
    draw.text((142, 622), "N", fill=COLOR_CYAN, font=font_hero)
    draw.line([(115, 685), (150, 685), (165, 655), (180, 700), (195, 685), (225, 685)], fill=COLOR_AMBER, width=4)

    draw.text((265, 580), "NADI-IKM // INTELLIGENT MACHINE CARE", fill=COLOR_WHITE, font=font_hero)
    draw.text((265, 640), "Mahakarya Inovasi Universitas Brawijaya — Kompetisi IYEEA 2026", fill=COLOR_CYAN, font=font_h1)
    draw.text((265, 695), "Ketua Tim & Arsitek Web/3D/Dashboard: Bimo Satrio (245150307111060)", fill=COLOR_AMBER, font=font_h2)
    draw.text((265, 735), "Lead Hardware & Sensor: Ihwan Ridwan S. M.  |  Lead AI & Analitik Data: Muhammad Raiz Belyaa", fill=COLOR_WHITE, font=font_h2)
    draw.text((265, 795), "GitHub: github.com/bimskuy1205/Nadi-IKM  •  Siap Deploy Publik di Vercel", fill=COLOR_GREEN, font=font_mono_lg)
    return img

CHAPTER_BOUNDS = [
    (0.0, 7.0, render_scene_1_hero, "01 // HERO & STETOSKOP PINTAR IKM"),
    (7.0, 13.5, render_scene_2_architecture, "02 // MASALAH IKM & SOLUSI 4 LAPIS"),
    (13.5, 21.5, render_scene_3_3d_highlight, "03 // 3D 360° HOLOGRAM ANATOMY LAB"),
    (21.5, 29.5, render_scene_4_dashboard, "04 // DASHBOARD PINTAR & SOP TEKNISI"),
    (29.5, 36.5, render_scene_5_team, "05 // MINDMAP TIM: BIMO • IHWAN • RAIZ"),
    (36.5, 42.0, render_scene_6_finale, "06 // SIMULASI ROI & 16 REFERENSI DUNIA"),
]

TRANSITION_DUR = 1.15

def apply_luxury_transition(img_a, img_b, p, next_title):
    smooth_p = p * p * (3.0 - 2.0 * p)
    blended = Image.blend(img_a, img_b, smooth_p)
    draw = ImageDraw.Draw(blended)

    sweep_x = int(-320 + smooth_p * (WIDTH + 640))
    tilt = 260

    # Multi-Gradient Holographic Laser Shutter Beams (Cyan + Amber + Magenta + White)
    draw.line([(sweep_x - tilt, 0), (sweep_x + tilt, HEIGHT)], fill=COLOR_CYAN, width=12)
    draw.line([(sweep_x - tilt - 38, 0), (sweep_x + tilt - 38, HEIGHT)], fill=COLOR_AMBER, width=8)
    draw.line([(sweep_x - tilt + 38, 0), (sweep_x + tilt + 38, HEIGHT)], fill=COLOR_MAGENTA, width=8)
    draw.line([(sweep_x - tilt, 0), (sweep_x + tilt, HEIGHT)], fill=COLOR_WHITE, width=4)

    banner_alpha = math.sin(p * math.pi)
    if banner_alpha > 0.25:
        bh = int(72 * banner_alpha)
        cy = HEIGHT // 2
        draw.rectangle([0, cy - bh, WIDTH, cy + bh], fill=(6, 16, 28), outline=COLOR_CYAN, width=3)
        draw.line([(0, cy - bh + 6), (WIDTH, cy - bh + 6)], fill=COLOR_AMBER, width=2)
        draw.line([(0, cy + bh - 6), (WIDTH, cy + bh - 6)], fill=COLOR_MAGENTA, width=2)
        if banner_alpha > 0.52:
            draw.text((WIDTH // 2 - 420, cy - 18), f"HOLO-TRANSITION >> {next_title}", fill=COLOR_CYAN, font=font_h1)

    return blended

for f in range(TOTAL_FRAMES):
    t_sec = f / float(FPS)
    active_idx = 0
    for idx, (t_start, t_end, _, _) in enumerate(CHAPTER_BOUNDS):
        if t_sec < t_end or idx == len(CHAPTER_BOUNDS) - 1:
            active_idx = idx
            break

    t_start, t_end, fn_curr, title_curr = CHAPTER_BOUNDS[active_idx]
    local_t = t_sec - t_start

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
        print(f"Full Showcase Hologram Video Progress: {f+1}/{TOTAL_FRAMES} frames ({((f+1)/TOTAL_FRAMES)*100:.1f}%)")

pipe.stdin.close()
pipe.wait()
print(f"SUCCESS: Upgraded 42-Second Full Website Hologram Video saved to {OUTPUT_MP4}")
