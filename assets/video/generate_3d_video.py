"""
NADI-IKM: 30-Second 3D 360° Side-View Exploded Anatomy Masterpiece Video Renderer
Renders 900 frames (30.0 seconds @ 30 fps, 1920x1080 Full HD) and encodes to MP4 with FFmpeg.
Features:
- True volumetric 3D side-elevation projection (stacked cylinder walls, depth-sorted 3D components)
- Continuous 360-degree automatic turntable rotation from the side view
- Gradual, continuous slow explosion from 0.0% (t=0s) all the way to 100.0% (t=30s)
- Left-side live digital caliper measurement brackets (mm displacement)
- Right-side 6 interactive component anatomy cards with live sequential highlighting
- Oscillating holographic laser scanner ring, CRT scanlines, and live engineering HUD
"""

import math
import os
import subprocess
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

# Exotic Retro-Industrial Palette
COLOR_BG = (5, 11, 17)
COLOR_CYAN = (0, 242, 254)
COLOR_CYAN_DIM = (0, 125, 145)
COLOR_AMBER = (255, 168, 52)
COLOR_ORANGE = (255, 94, 54)
COLOR_GREEN = (0, 255, 135)
COLOR_PCB = (8, 72, 62)
COLOR_STEEL_DARK = (16, 32, 46)
COLOR_STEEL_LIGHT = (34, 62, 86)
COLOR_COPPER = (224, 122, 72)
COLOR_GOLD = (248, 202, 75)
COLOR_SILVER = (215, 228, 240)
COLOR_WHITE = (245, 250, 255)
COLOR_MUTED = (145, 172, 194)

print(f"Initializing 30-Second 3D Volumetric Side-View Explode Render: {TOTAL_FRAMES} frames @ {FPS} fps...")

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
    font_title = ImageFont.truetype("arialbd.ttf", 26)
    font_card_title = ImageFont.truetype("arialbd.ttf", 19)
    font_mid = ImageFont.truetype("arial.ttf", 18)
    font_small = ImageFont.truetype("arial.ttf", 14)
    font_mono_lg = ImageFont.truetype("consolab.ttf", 18)
    font_mono = ImageFont.truetype("consola.ttf", 15)
    font_mono_sm = ImageFont.truetype("consola.ttf", 13)
except Exception:
    font_title = font_card_title = font_mid = font_small = font_mono_lg = font_mono = font_mono_sm = ImageFont.load_default()

# Side-elevation 3D projection helper (pitch=0.19 rad = ~10.8 deg side view)
def project_3d(x, y, z, rot_y, pitch=0.19, fov=720):
    cos_y = math.cos(rot_y)
    sin_y = math.sin(rot_y)
    rx = x * cos_y + z * sin_y
    rz = -x * sin_y + z * cos_y

    cos_p = math.cos(pitch)
    sin_p = math.sin(pitch)
    ry = y * cos_p - rz * sin_p
    rz2 = y * sin_p + rz * cos_p + 5.8

    scale = fov / max(0.1, rz2)
    sx = int(WIDTH * 0.37 + rx * scale)
    sy = int(HEIGHT * 0.51 - ry * scale)
    return sx, sy, scale, rz2

def draw_cylinder_3d(draw, y_center, radius, height, rot_y, top_fill, side_fill, outline_col, slices=10, rim_width=2):
    """Draws a volumetric 3D cylinder seen from the side-isometric angle using stacked slices."""
    y_bot = y_center - height / 2.0
    y_top = y_center + height / 2.0
    for s in range(slices):
        frac = s / float(max(1, slices - 1))
        yc = y_bot + frac * height
        sx, sy, sc, _ = project_3d(0, yc, 0, rot_y)
        rx = radius * sc
        ry = radius * sc * 0.21  # Side-view foreshortened ellipse ratio
        col = top_fill if s == slices - 1 else side_fill
        out = outline_col if (s == 0 or s == slices - 1) else side_fill
        w = rim_width if (s == 0 or s == slices - 1) else 1
        draw.ellipse([sx - rx, sy - ry, sx + rx, sy + ry], fill=col, outline=out, width=w)
    return project_3d(0, y_center, 0, rot_y)

def draw_box_3d(draw, lx, ly, lz, w, h, d, rot_y, fill_col, outline_col):
    """Draws a 3D rotated small component block on a PCB."""
    sx, sy, sc, rz = project_3d(lx, ly, lz, rot_y)
    bw = w * sc * 0.55
    bh = h * sc * 0.55
    # Top and front illusion
    draw.rectangle([sx - bw, sy - bh, sx + bw, sy + bh * 0.5], fill=fill_col, outline=outline_col, width=2)
    return sx, sy, rz

for f in range(TOTAL_FRAMES):
    t_sec = f / float(FPS)

    # Continuous 360-degree rotation (4 full revolutions over 30 seconds = 48 deg/sec)
    rot_y = (t_sec / DURATION_SEC) * (math.pi * 2.0 * 4.0)

    # Gradual, continuous explosion from 0% at t=0s all the way until 30s finishes!
    # Smooth ease-in-out curve stretched across the entire 30.0 seconds:
    raw_p = min(1.0, max(0.0, t_sec / 29.2))
    explode = raw_p * raw_p * (3.0 - 2.0 * raw_p)

    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)

    # 1. Retro-Industrial Blueprint Grid & Subtle Horizon Line
    for gy in range(0, HEIGHT, 40):
        col_g = (10, 24, 36) if gy % 160 != 0 else (16, 38, 56)
        draw.line([(0, gy), (WIDTH, gy)], fill=col_g, width=1)
    for gx in range(0, WIDTH, 40):
        col_g = (10, 24, 36) if gx % 160 != 0 else (16, 38, 56)
        draw.line([(gx, 0), (gx, HEIGHT)], fill=col_g, width=1)

    # Side-view reference axis & calibration pedestal ring
    ped_pts = []
    for deg in range(0, 360, 8):
        rad = math.radians(deg)
        px, py, _, _ = project_3d(math.cos(rad) * 2.1, -1.65, math.sin(rad) * 2.1, rot_y * 0.25)
        ped_pts.append((px, py))
    if len(ped_pts) > 2:
        draw.polygon(ped_pts, fill=(9, 20, 30), outline=(0, 110, 130))

    # Central vertical alignment axis (cyan dashed centerline)
    _, axis_top_y, _, _ = project_3d(0, 2.25, 0, rot_y)
    axis_x, axis_bot_y, _, _ = project_3d(0, -1.75, 0, rot_y)
    for ay in range(axis_top_y, axis_bot_y, 14):
        draw.line([(axis_x, ay), (axis_x, min(axis_bot_y, ay + 7))], fill=(0, 160, 185), width=2)

    # =========================================================================
    # 2. Render 6 Volumetric 3D Sub-Assemblies (Bottom to Top Painter's Order)
    # =========================================================================

    # --- PART 06: Base Mount Stud M8 & Dual N52 Neodymium Magnets ---
    y_mount = -0.58 - explode * 1.12
    # Threaded M8 stud shaft extending down
    draw_cylinder_3d(draw, y_mount - 0.24, 0.22, 0.34, rot_y, COLOR_SILVER, (130, 145, 160), COLOR_CYAN, slices=8, rim_width=1)
    # Dual N52 Magnet Base Plate
    sx_m, sy_m, sc_m, _ = draw_cylinder_3d(draw, y_mount, 0.88, 0.22, rot_y, (32, 58, 80), COLOR_STEEL_DARK, COLOR_AMBER, slices=9, rim_width=2)
    # 2 Rotating N52 Magnet Pods
    for m_dir in (-0.48, 0.48):
        mx, my, msc, _ = project_3d(m_dir, y_mount - 0.08, 0, rot_y)
        draw.ellipse([mx - msc * 0.22, my - msc * 0.08, mx + msc * 0.22, my + msc * 0.08], fill=COLOR_SILVER, outline=COLOR_AMBER, width=2)

    # --- PART 05: Lower Sasis Heatsink 6061-T6 + 24 Copper Fins ---
    y_chassis = -0.28 - explode * 0.56
    sx_c, sy_c, sc_c, _ = draw_cylinder_3d(draw, y_chassis, 1.04, 0.38, rot_y, COLOR_STEEL_LIGHT, COLOR_STEEL_DARK, COLOR_CYAN, slices=14, rim_width=2)
    # 24 Copper Heatsink Fins around perimeter
    for fin_i in range(24):
        fa = (fin_i / 24.0) * math.pi * 2.0 + rot_y
        # Only draw front-facing fins (where cos(fa - rot_y) or Z depth is toward camera)
        fx, fy, fsc, frz = project_3d(math.cos(fa) * 1.05, y_chassis, math.sin(fa) * 1.05, 0)
        if math.cos(fa) * math.sin(0) + math.sin(fa) * math.cos(0) < 0.25:
            fin_h = fsc * 0.17
            draw.rectangle([fx - 3, fy - fin_h, fx + 3, fy + fin_h], fill=COLOR_COPPER, outline=COLOR_AMBER, width=1)

    # --- PART 04: Power Regulation & TVS Surge Protection PCB ---
    y_pwr = -0.02 - explode * 0.12
    sx_p, sy_p, sc_p, _ = draw_cylinder_3d(draw, y_pwr, 0.90, 0.09, rot_y, COLOR_PCB, (5, 48, 40), COLOR_GREEN, slices=5, rim_width=2)
    # 3D Components on Power PCB (Toroidal Copper Choke, 3 Silver Caps, Terminal Block)
    draw_box_3d(draw, -0.35, y_pwr + 0.10, -0.20, 0.32, 0.22, 0.32, rot_y, COLOR_COPPER, COLOR_AMBER)
    draw_box_3d(draw, 0.38, y_pwr + 0.12, 0.22, 0.38, 0.25, 0.28, rot_y, (16, 135, 110), COLOR_GREEN)
    for cap_i in range(3):
        draw_box_3d(draw, -0.18 + cap_i * 0.22, y_pwr + 0.12, -0.38, 0.16, 0.24, 0.16, rot_y, COLOR_SILVER, COLOR_WHITE)

    # --- PART 03: MEMS Triaxial Accelerometer & RTD PT100 Probe ---
    y_sensor = 0.20 + explode * 0.38
    sx_s, sy_s, sc_s, _ = draw_cylinder_3d(draw, y_sensor, 0.90, 0.08, rot_y, COLOR_PCB, (5, 48, 40), COLOR_GOLD, slices=5, rim_width=2)
    # Acoustic Decoupling Ring + Gold MEMS LGA Chip
    draw.ellipse([sx_s - sc_s * 0.42, sy_s - sc_s * 0.09, sx_s + sc_s * 0.42, sy_s + sc_s * 0.09], outline=COLOR_AMBER, width=2)
    draw_box_3d(draw, 0.0, y_sensor + 0.09, 0.0, 0.30, 0.14, 0.30, rot_y, COLOR_GOLD, COLOR_WHITE)
    # Coiled Orange Silicone RTD Cable & Stainless Probe extending outward
    cable_pts = []
    for c_step in range(10):
        r_dist = 0.72 + c_step * 0.11
        c_y = y_sensor + 0.05 + math.sin(c_step * 1.1 + t_sec * 3) * 0.04
        cx, cy, csc, _ = project_3d(r_dist, c_y, -0.15, rot_y)
        cable_pts.append((cx, cy))
    if len(cable_pts) > 1:
        draw.line(cable_pts, fill=COLOR_ORANGE, width=5)
        # Stainless RTD Probe tip at end of cable
        px_end, py_end = cable_pts[-1]
        draw.rectangle([px_end - 14, py_end - 5, px_end + 18, py_end + 5], fill=COLOR_SILVER, outline=COLOR_CYAN, width=2)

    # --- PART 02: ESP32-S3 Edge Compute SoC & Vector DSP ---
    y_esp = 0.44 + explode * 0.88
    sx_e, sy_e, sc_e, _ = draw_cylinder_3d(draw, y_esp, 0.92, 0.09, rot_y, COLOR_PCB, (5, 48, 40), COLOR_CYAN, slices=5, rim_width=2)
    # Metallic Silver ESP32-S3 RF Shielding Can + Gold Meander PCB Antenna
    draw_box_3d(draw, -0.14, y_esp + 0.10, 0.0, 0.52, 0.16, 0.52, rot_y, COLOR_SILVER, COLOR_WHITE)
    draw_box_3d(draw, 0.36, y_esp + 0.08, 0.0, 0.18, 0.10, 0.42, rot_y, COLOR_GOLD, COLOR_AMBER)

    # --- PART 01: Top Polycarbonate Dome Enclosure & 360° Status Ring ---
    y_top = 0.78 + explode * 1.48
    sx_t, sy_t, sc_t, _ = draw_cylinder_3d(draw, y_top, 1.04, 0.42, rot_y, (28, 58, 82), (18, 40, 58), COLOR_CYAN, slices=15, rim_width=3)
    # Top Cable Gland Boss
    draw_cylinder_3d(draw, y_top + 0.28, 0.26, 0.16, rot_y, COLOR_STEEL_DARK, (10, 22, 32), COLOR_CYAN, slices=6, rim_width=2)
    # 360° Pulsing Phosphor Amber Optical Status Ring
    pulse_val = int(175 + math.sin(t_sec * 6.0) * 65)
    ring_col = (255, min(255, pulse_val), 45)
    sx_ring, sy_ring, sc_ring, _ = project_3d(0, y_top + 0.21, 0, rot_y)
    draw.ellipse([sx_ring - sc_ring * 0.76, sy_ring - sc_ring * 0.16, sx_ring + sc_ring * 0.76, sy_ring + sc_ring * 0.16], outline=ring_col, width=5)
    # 4 Stainless Hex Socket Bolts rotating on top flange
    for b_i in range(4):
        ba = (b_i / 4.0) * math.pi * 2.0 + math.pi / 4.0
        bx, by, bsc, _ = project_3d(math.cos(ba) * 0.86, y_top + 0.21, math.sin(ba) * 0.86, rot_y)
        draw.ellipse([bx - 6, by - 4, bx + 6, by + 4], fill=COLOR_SILVER, outline=COLOR_BG, width=1)

    # Oscillating Holographic Laser Scanner Ring sweeping up and down the 3D stack
    laser_y = -0.9 + math.sin(t_sec * 2.2) * (1.2 + explode * 0.9)
    laser_pts = []
    for deg in range(0, 360, 12):
        rad = math.radians(deg)
        lx, ly, _, _ = project_3d(math.cos(rad) * 1.45, laser_y, math.sin(rad) * 1.45, rot_y)
        laser_pts.append((lx, ly))
    if len(laser_pts) > 2:
        draw.polygon(laser_pts, outline=COLOR_CYAN, width=2)

    # =========================================================================
    # 3. Left-Side Live Digital Caliper Rulers (Millimeter Separation)
    # =========================================================================
    cal_x = 95
    draw.line([(cal_x, sy_t), (cal_x, sy_m)], fill=COLOR_AMBER, width=2)
    layer_ys = [
        (sy_t, "L1: DOME PC-GF30"),
        (sy_e, "L2: ESP32-S3 DSP"),
        (sy_s, "L3: MEMS + RTD"),
        (sy_p, "L4: POWER + TVS"),
        (sy_c, "L5: HEATSINK C1100"),
        (sy_m, "L6: MOUNT M8/N52")
    ]
    for idx_l, (ly_pos, l_tag) in enumerate(layer_ys):
        draw.line([(cal_x - 10, ly_pos), (cal_x + 25, ly_pos)], fill=COLOR_AMBER, width=2)
        # Dotted trace from caliper tick to component edge
        draw.line([(cal_x + 25, ly_pos), (sx_c - int(sc_c * 1.15), ly_pos)], fill=(90, 120, 145), width=1)
        mm_disp = explode * (5 - idx_l) * 28.5
        draw.text((cal_x + 32, ly_pos - 16), f"{l_tag} [+{mm_disp:04.1f} mm]", fill=COLOR_AMBER if explode > 0.05 else COLOR_MUTED, font=font_mono_sm)

    # =========================================================================
    # 4. Right-Side 6 Interactive Anatomy Callout Cards with Sequential Highlight
    # =========================================================================
    callouts = [
        (sx_t, sy_t, "01 // HOUSING POLIKARBONAT & RING STATUS 360°", "Sabic Lexan PC-GF30 | Konsep IP65 | Indikator LED Phosphor Amber", "Ketahanan Kimia & Debu Bengkel IKM", COLOR_CYAN),
        (sx_e, sy_e, "02 // UNIT KOMPUTASI TEPI ESP32-S3 (EDGE AI DSP)", "Xtensa Dual-Core 240 MHz | FFT Vektor Real-Time | Robust MAD", "Inferensi Mandiri 100% Tanpa Cloud", COLOR_CYAN),
        (sx_s, sy_s, "03 // AKSELEROMETER MEMS TRIAKSIAL & RTD PT100", "Bandwidth 1-2 kHz (±16g) | Probe Suhu Kelas A (-40 s/d +125°C)", "Isolasi Akustik Viton O-Ring", COLOR_GOLD),
        (sx_p, sy_p, "04 // MODUL CATU DAYA & PROTEKSI SURGE TVS", "Step-Down Buck 12-24V DC -> 3.3V | Dioda TVS 36V 600W + PTC", "Tahan Fluktuasi Tegangan Listrik IKM", COLOR_GREEN),
        (sx_c, sy_c, "05 // SASIS PENDINGIN AL-6061 & 24 SIRIP TEMBAGA", "Aluminium Anodized 6061-T6 + 24 Fin Tembaga C1100 | 3.8W Pasif", "Disipasi Termal Tanpa Kipas (Fanless)", COLOR_COPPER),
        (sx_m, sy_m, "06 // DUDUKAN RETROFIT STUD M8 & MAGNET N52", "Ulir Baja Tahan Karat M8 + Dual Magnet Neodymium N52 (18.5 kgf)", "Instalasi Non-Invasif Tanpa Modifikasi Mesin", COLOR_AMBER)
    ]

    active_idx = int((t_sec / DURATION_SEC) * 6.0) % 6
    anchor_x = int(WIDTH * 0.60)

    for idx, (px, py, c_title, c_spec1, c_spec2, col) in enumerate(callouts):
        anchor_y = 122 + idx * 134
        is_active = (idx == active_idx)

        # Leader line from 3D part center to callout card
        elbow_x = px + int(sc_c * 1.05) + 25
        line_col = COLOR_WHITE if is_active else col
        line_w = 3 if is_active else 2
        draw.line([(px, py), (elbow_x, py), (anchor_x - 18, anchor_y + 38), (anchor_x, anchor_y + 38)], fill=line_col, width=line_w)
        draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=line_col, outline=COLOR_BG, width=1)

        # Card Box
        card_bg = (18, 38, 56) if is_active else (11, 23, 35)
        border_w = 3 if is_active else 1
        draw.rectangle([anchor_x, anchor_y, WIDTH - 45, anchor_y + 116], fill=card_bg, outline=col, width=border_w)
        # Left accent bar
        draw.rectangle([anchor_x, anchor_y, anchor_x + 8, anchor_y + 116], fill=col)

        draw.text((anchor_x + 22, anchor_y + 12), c_title, fill=COLOR_WHITE if is_active else col, font=font_card_title)
        draw.text((anchor_x + 22, anchor_y + 42), c_spec1, fill=COLOR_WHITE, font=font_small)
        draw.text((anchor_x + 22, anchor_y + 66), f"Fungsi Utama: {c_spec2}", fill=COLOR_MUTED, font=font_small)

        # Mini status badge on right of card
        badge_txt = "INSPECTING LAYER" if is_active else f"DELTA-Z: +{explode * (6 - idx) * 24.5:04.1f}mm"
        draw.text((WIDTH - 245, anchor_y + 90), badge_txt, fill=COLOR_AMBER if is_active else COLOR_CYAN_DIM, font=font_mono_sm)

    # =========================================================================
    # 5. Top & Bottom Retro-Industrial HUD Frame + 30s Progress Bar
    # =========================================================================
    # Top HUD Header
    draw.rectangle([40, 24, WIDTH - 40, 82], fill=(8, 18, 28), outline=COLOR_CYAN, width=2)
    draw.text((62, 38), "NADI-IKM // 3D 360° SIDE-VIEW EXPLODED ANATOMY STUDIO", fill=COLOR_CYAN, font=font_title)
    deg_now = (rot_y * 180.0 / math.pi) % 360.0
    draw.text((WIDTH * 0.53, 44), f"CAMERA: SIDE ELEVATION (10.8°) | ORBIT: {deg_now:05.1f}°", fill=COLOR_AMBER, font=font_mono)
    draw.text((WIDTH - 340, 44), f"T+{t_sec:05.2f}s / 30.00s | EXPLODE: {explode*100:05.1f}%", fill=COLOR_GREEN, font=font_mono)

    # Bottom HUD Bar
    draw.rectangle([40, HEIGHT - 96, WIDTH - 40, HEIGHT - 24], fill=(8, 18, 28), outline=COLOR_CYAN, width=1)
    draw.text((62, HEIGHT - 84), f"GRADUAL EXPLODE PROGRESS: {explode * 100:05.1f}% (CONTINUOUS 0s -> 30s)", fill=COLOR_AMBER, font=font_mono_lg)
    draw.text((62, HEIGHT - 54), "RETROFIT TARGET: Rp850.000/node | NON-INVASIVE M8 STUD + N52 MAGNET | ESP32-S3 EDGE AI", fill=COLOR_MUTED, font=font_mono)

    # Timeline Progress Bar
    bar_x1 = int(WIDTH * 0.52)
    bar_x2 = WIDTH - 65
    bar_y1 = HEIGHT - 76
    bar_y2 = HEIGHT - 58
    draw.rectangle([bar_x1, bar_y1, bar_x2, bar_y2], fill=(14, 30, 44), outline=COLOR_CYAN, width=1)
    fill_w = int((bar_x2 - bar_x1) * (t_sec / DURATION_SEC))
    draw.rectangle([bar_x1, bar_y1, bar_x1 + fill_w, bar_y2], fill=COLOR_CYAN)
    draw.text((bar_x1, HEIGHT - 48), "TIMELINE: 00.0s [ASSEMBLED] ----------------------------------------------> 30.0s [100% EXPLODED] • TEAM: BIMO SATRIO (LEAD), IHWAN RIDWAN, MUHAMMAD RAIZ", fill=COLOR_WHITE, font=font_mono_sm)

    pipe.stdin.write(img.tobytes())

    if f % 150 == 0 or f == TOTAL_FRAMES - 1:
        print(f"3D Video Progress: {f+1}/{TOTAL_FRAMES} frames ({((f+1)/TOTAL_FRAMES)*100:.1f}%) | Explode={explode*100:.1f}%")

pipe.stdin.close()
pipe.wait()
print(f"SUCCESS: Upgraded 30-Second 3D Volumetric Side-View Video saved to {OUTPUT_MP4}")
