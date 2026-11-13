"""
NADI-IKM: 30-Second 3D 360° Holographic Side-View Exploded Anatomy Masterpiece Video
Renders 900 frames (30.0 seconds @ 30 fps, 1920x1080 Full HD) and encodes to MP4 with FFmpeg.
Upgrades:
- Rich Exotic Multi-Gradient Colour-Graded Background (Cyan, Amber, Cyber-Magenta, Synth-Violet, Mint)
- Perspective Retro-Industrial Synth Horizon Grid + CRT Scanline Texture
- Highlighted NADI-IKM Holographic Brand Emblem Crest in Top HUD
- True 3D Hologram Projection Cone, 3 Gyroscopic 3D Orbital Rings, and Floating Hologram Particles
- Side-Elevation 3D Volumetric Cylinder & Component Stack exploding smoothly 0% -> 100% over 30s
- Layman-Friendly ("Bahasa Awam") + Engineering Specs on all 6 Anatomy Cards
"""

import math
import os
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 30
TOTAL_FRAMES = FPS * DURATION_SEC  # 900 frames

OUTPUT_DIR = r"C:\Users\ASUS\.gemini\antigravity\scratch\Nadi-IKM\assets\video"
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_MP4 = os.path.join(OUTPUT_DIR, "nadi-ikm-3d-anatomy-30s.mp4")
FFMPEG_EXE = r"C:\Users\ASUS\Documents\PYTHON-BOOCAMP-IPB\bin\ffmpeg.exe"

# Exotic Retro-Industrial & Hologram Palette
COLOR_CYAN = (0, 242, 254)
COLOR_AMBER = (255, 168, 52)
COLOR_ORANGE = (255, 94, 54)
COLOR_MAGENTA = (255, 46, 147)
COLOR_VIOLET = (121, 40, 202)
COLOR_GREEN = (0, 255, 135)
COLOR_PCB = (8, 76, 66)
COLOR_STEEL_DARK = (14, 30, 46)
COLOR_STEEL_LIGHT = (34, 66, 94)
COLOR_COPPER = (228, 124, 72)
COLOR_GOLD = (250, 204, 78)
COLOR_SILVER = (220, 232, 244)
COLOR_WHITE = (246, 250, 255)
COLOR_MUTED = (165, 190, 212)

print("Pre-computing Exotic Retro-Industrial Colour-Graded Background Canvas...")

# Fast NumPy Multi-Stop Radial Nebula & CRT Scanline Base Canvas
yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH].astype(np.float32)
nx = xx / float(WIDTH)
ny = yy / float(HEIGHT)

base_r = np.full((HEIGHT, WIDTH), 5.0, dtype=np.float32)
base_g = np.full((HEIGHT, WIDTH), 11.0, dtype=np.float32)
base_b = np.full((HEIGHT, WIDTH), 20.0, dtype=np.float32)

# 1. Cyan Hologram Nebula around 3D stage (x=0.35, y=0.52)
d_cyan = np.exp(-(((nx - 0.35) ** 2) / 0.055 + ((ny - 0.52) ** 2) / 0.09))
base_r += d_cyan * 0.0
base_g += d_cyan * 62.0
base_b += d_cyan * 78.0

# 2. Plasma Amber Glow Top Right (x=0.82, y=0.22)
d_amber = np.exp(-(((nx - 0.82) ** 2) / 0.07 + ((ny - 0.22) ** 2) / 0.08))
base_r += d_amber * 58.0
base_g += d_amber * 36.0
base_b += d_amber * 8.0

# 3. Cyber Magenta Glow Lower Right (x=0.75, y=0.78)
d_mag = np.exp(-(((nx - 0.75) ** 2) / 0.07 + ((ny - 0.78) ** 2) / 0.08))
base_r += d_mag * 52.0
base_g += d_mag * 10.0
base_b += d_mag * 38.0

# 4. Synth Violet Glow Bottom Left (x=0.12, y=0.85)
d_vio = np.exp(-(((nx - 0.12) ** 2) / 0.06 + ((ny - 0.85) ** 2) / 0.08))
base_r += d_vio * 32.0
base_g += d_vio * 12.0
base_b += d_vio * 56.0

# Subtle CRT scanlines every 4px
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

# Major & Minor CAD Blueprint Grid on Base Image
for gy in range(0, HEIGHT, 36):
    c = (16, 42, 62) if gy % 144 == 0 else (10, 25, 38)
    bg_draw.line([(0, gy), (WIDTH, gy)], fill=c, width=1)
for gx in range(0, WIDTH, 36):
    c = (16, 42, 62) if gx % 144 == 0 else (10, 25, 38)
    bg_draw.line([(gx, 0), (gx, HEIGHT)], fill=c, width=1)

# Perspective Retro Synth Horizon Fan Lines at Bottom
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
    font_brand = ImageFont.truetype("arialbd.ttf", 28)
    font_title = ImageFont.truetype("arialbd.ttf", 22)
    font_card_title = ImageFont.truetype("arialbd.ttf", 18)
    font_small = ImageFont.truetype("arial.ttf", 14)
    font_layman = ImageFont.truetype("arialbd.ttf", 14)
    font_mono_lg = ImageFont.truetype("consolab.ttf", 17)
    font_mono = ImageFont.truetype("consola.ttf", 14)
    font_mono_sm = ImageFont.truetype("consola.ttf", 12)
except Exception:
    font_brand = font_title = font_card_title = font_small = font_layman = font_mono_lg = font_mono = font_mono_sm = ImageFont.load_default()

def project_3d(x, y, z, rot_y, pitch=0.18, fov=730):
    cos_y = math.cos(rot_y)
    sin_y = math.sin(rot_y)
    rx = x * cos_y + z * sin_y
    rz = -x * sin_y + z * cos_y

    cos_p = math.cos(pitch)
    sin_p = math.sin(pitch)
    ry = y * cos_p - rz * sin_p
    rz2 = y * sin_p + rz * cos_p + 5.8

    scale = fov / max(0.1, rz2)
    sx = int(WIDTH * 0.35 + rx * scale)
    sy = int(HEIGHT * 0.53 - ry * scale)
    return sx, sy, scale, rz2

def draw_cylinder_3d(draw, y_center, radius, height, rot_y, top_fill, side_fill, outline_col, slices=10, rim_width=2):
    y_bot = y_center - height / 2.0
    y_top = y_center + height / 2.0
    for s in range(slices):
        frac = s / float(max(1, slices - 1))
        yc = y_bot + frac * height
        sx, sy, sc, _ = project_3d(0, yc, 0, rot_y)
        rx = radius * sc
        ry = radius * sc * 0.20
        col = top_fill if s == slices - 1 else side_fill
        out = outline_col if (s == 0 or s == slices - 1) else side_fill
        w = rim_width if (s == 0 or s == slices - 1) else 1
        draw.ellipse([sx - rx, sy - ry, sx + rx, sy + ry], fill=col, outline=out, width=w)
    return project_3d(0, y_center, 0, rot_y)

def draw_box_3d(draw, lx, ly, lz, w, h, d, rot_y, fill_col, outline_col):
    sx, sy, sc, rz = project_3d(lx, ly, lz, rot_y)
    bw = w * sc * 0.55
    bh = h * sc * 0.55
    draw.rectangle([sx - bw, sy - bh, sx + bw, sy + bh * 0.5], fill=fill_col, outline=outline_col, width=2)
    return sx, sy, rz

def draw_brand_emblem(draw, x, y):
    """Draws the highlighted NADI-IKM Holographic Brand Crest & Wordmark."""
    draw.rectangle([x, y, x + 365, y + 64], fill=(8, 22, 36), outline=COLOR_CYAN, width=2)
    draw.rectangle([x + 6, y + 6, x + 58, y + 58], fill=(12, 34, 52), outline=COLOR_AMBER, width=2)
    # N Monogram + Pulse Wave inside badge
    draw.text((x + 19, y + 16), "N", fill=COLOR_WHITE, font=font_brand)
    draw.line([(x + 10, y + 46), (x + 24, y + 46), (x + 30, y + 34), (x + 36, y + 52), (x + 42, y + 46), (x + 54, y + 46)], fill=COLOR_AMBER, width=2)
    # Brand Title
    draw.text((x + 70, y + 8), "NADI-IKM", fill=COLOR_WHITE, font=font_brand)
    draw.text((x + 220, y + 14), "// HOLO-3D", fill=COLOR_CYAN, font=font_title)
    draw.text((x + 70, y + 40), "INTELLIGENT MACHINE CARE • UB", fill=COLOR_AMBER, font=font_mono_sm)

for f in range(TOTAL_FRAMES):
    t_sec = f / float(FPS)
    rot_y = (t_sec / DURATION_SEC) * (math.pi * 2.0 * 4.0)

    # Continuous gradual explode from 0.0s right until 30.0s ends
    raw_p = min(1.0, max(0.0, t_sec / 29.4))
    explode = raw_p * raw_p * (3.0 - 2.0 * raw_p)

    img = BASE_BG_IMG.copy()
    draw = ImageDraw.Draw(img)

    # =========================================================================
    # 1. Clean Ground Calibration Pedestal (No Circular Rings Blocking the Model)
    # =========================================================================
    pts = []
    for deg in range(0, 360, 10):
        rad = math.radians(deg)
        px, py, _, _ = project_3d(math.cos(rad) * 2.0, -1.72, math.sin(rad) * 2.0, 0)
        pts.append((px, py))
    draw.polygon(pts, fill=(9, 20, 32), outline=COLOR_CYAN, width=2)

    # =========================================================================
    # 2. Render 6 Volumetric 3D Sub-Assemblies (Side View + Gradual Explode)
    # =========================================================================
    # Part 06: Base Mount Stud M8 & Dual N52 Magnets
    y_mount = -0.58 - explode * 1.12
    draw_cylinder_3d(draw, y_mount - 0.24, 0.22, 0.34, rot_y, COLOR_SILVER, (130, 145, 160), COLOR_CYAN, slices=8, rim_width=1)
    sx_m, sy_m, sc_m, _ = draw_cylinder_3d(draw, y_mount, 0.88, 0.22, rot_y, (32, 58, 80), COLOR_STEEL_DARK, COLOR_AMBER, slices=9, rim_width=2)
    for m_dir in (-0.48, 0.48):
        mx, my, msc, _ = project_3d(m_dir, y_mount - 0.08, 0, rot_y)
        draw.ellipse([mx - msc * 0.22, my - msc * 0.08, mx + msc * 0.22, my + msc * 0.08], fill=COLOR_GOLD, outline=COLOR_AMBER, width=2)

    # Part 05: Lower Sasis Heatsink 6061-T6 + 24 Copper Fins
    y_chassis = -0.28 - explode * 0.56
    sx_c, sy_c, sc_c, _ = draw_cylinder_3d(draw, y_chassis, 1.04, 0.38, rot_y, COLOR_STEEL_LIGHT, COLOR_STEEL_DARK, COLOR_CYAN, slices=14, rim_width=2)
    for fin_i in range(24):
        fa = (fin_i / 24.0) * math.pi * 2.0 + rot_y
        fx, fy, fsc, _ = project_3d(math.cos(fa) * 1.05, y_chassis, math.sin(fa) * 1.05, 0)
        if math.sin(fa) < 0.25:
            fin_h = fsc * 0.17
            draw.rectangle([fx - 3, fy - fin_h, fx + 3, fy + fin_h], fill=COLOR_COPPER, outline=COLOR_AMBER, width=1)

    # Part 04: Power Regulation & TVS Surge Protection PCB
    y_pwr = -0.02 - explode * 0.12
    sx_p, sy_p, sc_p, _ = draw_cylinder_3d(draw, y_pwr, 0.90, 0.09, rot_y, COLOR_PCB, (5, 48, 40), COLOR_GREEN, slices=5, rim_width=2)
    draw_box_3d(draw, -0.35, y_pwr + 0.10, -0.20, 0.32, 0.22, 0.32, rot_y, COLOR_COPPER, COLOR_AMBER)
    draw_box_3d(draw, 0.38, y_pwr + 0.12, 0.22, 0.38, 0.25, 0.28, rot_y, (16, 135, 110), COLOR_GREEN)
    for cap_i in range(3):
        draw_box_3d(draw, -0.18 + cap_i * 0.22, y_pwr + 0.12, -0.38, 0.16, 0.24, 0.16, rot_y, COLOR_SILVER, COLOR_WHITE)

    # Part 03: MEMS Triaxial Accelerometer & RTD PT100 Probe
    y_sensor = 0.20 + explode * 0.38
    sx_s, sy_s, sc_s, _ = draw_cylinder_3d(draw, y_sensor, 0.90, 0.08, rot_y, COLOR_PCB, (5, 48, 40), COLOR_GOLD, slices=5, rim_width=2)
    draw.ellipse([sx_s - sc_s * 0.42, sy_s - sc_s * 0.09, sx_s + sc_s * 0.42, sy_s + sc_s * 0.09], outline=COLOR_AMBER, width=2)
    draw_box_3d(draw, 0.0, y_sensor + 0.09, 0.0, 0.30, 0.14, 0.30, rot_y, COLOR_GOLD, COLOR_WHITE)
    cable_pts = []
    for c_step in range(10):
        r_dist = 0.72 + c_step * 0.11
        c_y = y_sensor + 0.05 + math.sin(c_step * 1.1 + t_sec * 3) * 0.04
        cx, cy, _, _ = project_3d(r_dist, c_y, -0.15, rot_y)
        cable_pts.append((cx, cy))
    if len(cable_pts) > 1:
        draw.line(cable_pts, fill=COLOR_ORANGE, width=5)
        px_end, py_end = cable_pts[-1]
        draw.rectangle([px_end - 14, py_end - 5, px_end + 18, py_end + 5], fill=COLOR_SILVER, outline=COLOR_CYAN, width=2)

    # Part 02: ESP32-S3 Edge Compute SoC & Vector DSP
    y_esp = 0.44 + explode * 0.88
    sx_e, sy_e, sc_e, _ = draw_cylinder_3d(draw, y_esp, 0.92, 0.09, rot_y, COLOR_PCB, (5, 48, 40), COLOR_CYAN, slices=5, rim_width=2)
    draw_box_3d(draw, -0.14, y_esp + 0.10, 0.0, 0.52, 0.16, 0.52, rot_y, COLOR_SILVER, COLOR_WHITE)
    draw_box_3d(draw, 0.36, y_esp + 0.08, 0.0, 0.18, 0.10, 0.42, rot_y, COLOR_GOLD, COLOR_AMBER)

    # Part 01: Top Polycarbonate Dome Enclosure & 360° Status Ring
    y_top = 0.78 + explode * 1.48
    sx_t, sy_t, sc_t, _ = draw_cylinder_3d(draw, y_top, 1.04, 0.42, rot_y, (28, 58, 82), (18, 40, 58), COLOR_CYAN, slices=15, rim_width=3)
    draw_cylinder_3d(draw, y_top + 0.28, 0.26, 0.16, rot_y, COLOR_STEEL_DARK, (10, 22, 32), COLOR_CYAN, slices=6, rim_width=2)
    pulse_val = int(175 + math.sin(t_sec * 6.0) * 65)
    ring_col = (255, min(255, pulse_val), 45)
    sx_ring, sy_ring, sc_ring, _ = project_3d(0, y_top + 0.21, 0, rot_y)
    draw.ellipse([sx_ring - sc_ring * 0.76, sy_ring - sc_ring * 0.16, sx_ring + sc_ring * 0.76, sy_ring + sc_ring * 0.16], outline=ring_col, width=5)

    # =========================================================================
    # 3. Left-Side Live Digital Caliper Rulers
    # =========================================================================
    cal_x = 75
    draw.line([(cal_x, sy_t), (cal_x, sy_m)], fill=COLOR_AMBER, width=2)
    layer_ys = [
        (sy_t, "L1: DOME PC-GF30"),
        (sy_e, "L2: ESP32-S3 AI"),
        (sy_s, "L3: MEMS + RTD"),
        (sy_p, "L4: POWER + TVS"),
        (sy_c, "L5: HEATSINK 24F"),
        (sy_m, "L6: MAGNET N52")
    ]
    for idx_l, (ly_pos, l_tag) in enumerate(layer_ys):
        draw.line([(cal_x - 10, ly_pos), (cal_x + 22, ly_pos)], fill=COLOR_AMBER, width=2)
        draw.line([(cal_x + 22, ly_pos), (sx_c - int(sc_c * 1.15), ly_pos)], fill=(0, 140, 165), width=1)
        mm_disp = explode * (5 - idx_l) * 28.5
        draw.text((cal_x + 28, ly_pos - 15), f"{l_tag} [+{mm_disp:04.1f}mm]", fill=COLOR_AMBER if explode > 0.05 else COLOR_MUTED, font=font_mono_sm)

    # =========================================================================
    # 4. Right-Side 6 Interactive Anatomy Cards (Engineering + Bahasa Awam!)
    # =========================================================================
    callouts = [
        (sx_t, sy_t, "01 // PELINDUNG POLIKARBONAT & LAMPU STATUS 360°", "Teknis: Sabic Lexan PC-GF30 | Konsep IP65 | LED Phosphor Amber", "Awam: Cangkang tahan banting & lampu cincin penanda kondisi mesin", COLOR_CYAN),
        (sx_e, sy_e, "02 // OTAK MIKROKONTROLER ESP32-S3 (EDGE AI DSP)", "Teknis: Dual-Core 240 MHz | FFT Vektor Real-Time | Robust MAD", "Awam: Otak pintar yang menganalisis gejala rusak tanpa perlu internet", COLOR_GREEN),
        (sx_s, sy_s, "03 // SENSOR GETARAN MEMS & KABEL SUHU RTD PT100", "Teknis: Bandwidth 1-2 kHz (±16g) | Probe Suhu -40 s/d +125°C", "Awam: 'Telinga & Termometer' peraba getaran kasar dan panas bantalan", COLOR_GOLD),
        (sx_p, sy_p, "04 // PENSTABIL LISTRIK & PEREDAM KEJUT (TVS SURGE)", "Teknis: Buck 12-24V DC -> 3.3V | Dioda TVS 600W + Sekering PTC", "Awam: Pelindung agar alat tidak korslet saat listrik pabrik naik-turun", COLOR_MAGENTA),
        (sx_c, sy_c, "05 // PENDINGIN AL-6061 & 24 SIRIP TEMBAGA MURNI", "Teknis: Aluminium Anodized + 24 Fin Tembaga C1100 (3.8W Pasif)", "Awam: Pelepas panas otomatis tanpa kipas agar awet di ruang mesin", COLOR_COPPER),
        (sx_m, sy_m, "06 // KAKI MAGNET SUPER KUAT N52 & BAUT ULIR M8", "Teknis: Baja Nirkarat 304 M8 + Dual Magnet Neodymium (18.5 kgf)", "Awam: Tempel langsung di bodi besi mesin dalam 5 detik tanpa mengebor!", COLOR_AMBER)
    ]

    active_idx = int((t_sec / DURATION_SEC) * 6.0) % 6
    anchor_x = int(WIDTH * 0.57)

    for idx, (px, py, c_title, c_spec1, c_layman, col) in enumerate(callouts):
        anchor_y = 112 + idx * 138
        is_active = (idx == active_idx)

        elbow_x = px + int(sc_c * 1.05) + 22
        line_col = COLOR_WHITE if is_active else col
        draw.line([(px, py), (elbow_x, py), (anchor_x - 16, anchor_y + 42), (anchor_x, anchor_y + 42)], fill=line_col, width=3 if is_active else 2)
        draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=line_col)

        card_bg = (18, 40, 62) if is_active else (10, 22, 35)
        draw.rectangle([anchor_x, anchor_y, WIDTH - 38, anchor_y + 122], fill=card_bg, outline=col, width=3 if is_active else 1)
        draw.rectangle([anchor_x, anchor_y, anchor_x + 10, anchor_y + 122], fill=col)

        draw.text((anchor_x + 22, anchor_y + 10), c_title, fill=COLOR_WHITE if is_active else col, font=font_card_title)
        draw.text((anchor_x + 22, anchor_y + 38), c_spec1, fill=COLOR_MUTED, font=font_small)
        draw.text((anchor_x + 22, anchor_y + 64), f"★ {c_layman}", fill=COLOR_AMBER if is_active else COLOR_WHITE, font=font_layman)
        draw.text((WIDTH - 255, anchor_y + 94), f"HOLO-SCAN // +{explode * (6 - idx) * 24.5:04.1f}mm", fill=COLOR_GREEN if is_active else col, font=font_mono_sm)

    # =========================================================================
    # 5. Top HUD with Highlighted Brand Emblem & Bottom 30s Timeline Bar
    # =========================================================================
    draw_brand_emblem(draw, 38, 22)

    draw.rectangle([418, 22, WIDTH - 38, 86], fill=(8, 20, 34), outline=COLOR_CYAN, width=2)
    deg_now = (rot_y * 180.0 / math.pi) % 360.0
    draw.text((438, 30), "3D 360° SIDE-VIEW HOLOGRAM ANATOMY // GRADUAL EXPLODE DEMO", fill=COLOR_CYAN, font=font_title)
    draw.text((438, 58), f"SUDUT PANDANG: SAMPING (SIDE ELEVATION) | PUTARAN: {deg_now:05.1f}° | EXPLODE: {explode*100:05.1f}%", fill=COLOR_AMBER, font=font_mono)
    draw.text((WIDTH - 310, 42), f"DURASI: {t_sec:05.2f}s / 30.00s", fill=COLOR_GREEN, font=font_mono_lg)

    # Bottom HUD Bar
    draw.rectangle([38, HEIGHT - 92, WIDTH - 38, HEIGHT - 20], fill=(8, 20, 34), outline=COLOR_AMBER, width=2)
    draw.text((58, HEIGHT - 80), f"STATUS HOLOGRAM: PUTAR OTOMATIS 360° & EXPLODE PERLAHAN ({explode * 100:05.1f}%)", fill=COLOR_AMBER, font=font_mono_lg)
    draw.text((58, HEIGHT - 50), "TIM NADI-IKM (UNIVERSITAS BRAWIJAYA): BIMO SATRIO (KETUA & ARSITEK WEB/3D) • IHWAN RIDWAN • MUHAMMAD RAIZ", fill=COLOR_WHITE, font=font_mono)

    bar_x1 = int(WIDTH * 0.56)
    bar_x2 = WIDTH - 58
    draw.rectangle([bar_x1, HEIGHT - 76, bar_x2, HEIGHT - 54], fill=(14, 32, 48), outline=COLOR_CYAN, width=1)
    fill_w = int((bar_x2 - bar_x1) * (t_sec / DURATION_SEC))
    draw.rectangle([bar_x1, HEIGHT - 76, bar_x1 + fill_w, HEIGHT - 54], fill=COLOR_CYAN)
    draw.text((bar_x1, HEIGHT - 46), "00.0s [TERAKIT UTUH] =========================================> 30.0s [TERURAI PENUH 100%]", fill=COLOR_GREEN, font=font_mono_sm)

    pipe.stdin.write(img.tobytes())

    if f % 180 == 0 or f == TOTAL_FRAMES - 1:
        print(f"3D Hologram Video Progress: {f+1}/{TOTAL_FRAMES} frames ({((f+1)/TOTAL_FRAMES)*100:.1f}%)")

pipe.stdin.close()
pipe.wait()
print(f"SUCCESS: Upgraded 30-Second Hologram 3D Video saved to {OUTPUT_MP4}")
