#!/usr/bin/env python3
"""Generate 9:16 video frames using PIL, then combine with ffmpeg"""

import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

# 设置
WIDTH, HEIGHT = 1080, 1920
FPS = 30
DURATION = 18  # 秒

OUTPUT_DIR = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/012.文案推广/finance-promo/out_frames"
FRAME_PATTERN = f"{OUTPUT_DIR}/frame_%04d.png"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 调色板
COLORS = {
    "pink": "#FFE4E9",
    "darkPink": "#FFB7C5",
    "coral": "#FF8FA3",
    "white": "#FFFFFF",
    "text": "#4A4A4A",
    "green": "#7DD3C0",
}

# 计算
total_frames = DURATION * FPS
frames_per_scene = FPS * 3  # 每个场景3秒

def get_font(size):
    try:
        return ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", size)
    except:
        return ImageFont.load_default()

def draw_scene(scene_num):
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    w, h = WIDTH, HEIGHT

    if scene_num == 0:  # 封面
        draw.rectangle([0, 0, w, h], fill=COLORS["pink"])
        draw.text((w//2, h//3), "💰", anchor="mm", font=get_font(120), fill=COLORS["text"])
        draw.text((w//2, h//2), "财务管家", anchor="mm", font=get_font(80), fill=COLORS["text"])
        draw.text((w//2, h//2 + 100), "你的私人理财小助手", anchor="mm", font=get_font(36), fill=COLORS["coral"])

    elif scene_num == 1:  # 痛点
        draw.rectangle([0, 0, w, h], fill=COLORS["white"])
        draw.text((w//2, h//5), "你是不是也有这种感觉？", anchor="mm", font=get_font(48), fill=COLORS["text"])
        draw.text((w//2, h//3 + 50), "💸 工资刚到账就没了", anchor="mm", font=get_font(36), fill=COLORS["coral"])
        draw.text((w//2, h//3 + 120), "🤔 钱不知道花哪儿了", anchor="mm", font=get_font(36), fill=COLORS["coral"])
        draw.text((w//2, h//3 + 190), "😰 想省钱但无从下手", anchor="mm", font=get_font(36), fill=COLORS["coral"])

    elif scene_num == 2:  # 3秒记账
        draw.rectangle([0, 0, w, h], fill=COLORS["darkPink"])
        draw.text((w//2, h//4), "现在起，3秒改变！", anchor="mm", font=get_font(48), fill=COLORS["text"])
        draw.text((w//2, h//2), "⚡", anchor="mm", font=get_font(120), fill=COLORS["white"])
        draw.text((w//2, h//2 + 150), "3秒快速记账", anchor="mm", font=get_font(60), fill=COLORS["white"])
        draw.text((w//2, h//2 + 250), "选择分类 → 输入金额 → 完成！", anchor="mm", font=get_font(32), fill=COLORS["white"])

    elif scene_num == 3:  # 统计功能
        draw.rectangle([0, 0, w, h], fill=COLORS["white"])
        draw.text((w//2, h//4), "收入支出，一目了然", anchor="mm", font=get_font(56), fill=COLORS["text"])
        draw.text((w//2, h//3 + 100), "📊 分类统计", anchor="mm", font=get_font(40), fill=COLORS["green"])
        draw.text((w//2, h//3 + 180), "📈 月度趋势", anchor="mm", font=get_font(40), fill=COLORS["green"])
        draw.text((w//2, h//3 + 260), "📥 Excel导出", anchor="mm", font=get_font(40), fill=COLORS["green"])

    elif scene_num == 4:  # UI
        draw.rectangle([0, 0, w, h], fill=COLORS["pink"])
        draw.text((w//2, h//3), "💕", anchor="mm", font=get_font(120), fill=COLORS["text"])
        draw.text((w//2, h//2), "粉色UI超好看", anchor="mm", font=get_font(72), fill=COLORS["text"])
        draw.text((w//2, h//2 + 100), "用着心情好，才能坚持记账！", anchor="mm", font=get_font(36), fill=COLORS["text"])

    elif scene_num == 5:  # 结束
        draw.rectangle([0, 0, w, h], fill=COLORS["darkPink"])
        draw.text((w//2, h//3), "越早开始，越早受益！", anchor="mm", font=get_font(56), fill=COLORS["white"])
        draw.text((w//2, h//2), "3秒改变，月底惊喜", anchor="mm", font=get_font(40), fill=COLORS["white"])
        draw.text((w//2, h//2 + 150), "💰", anchor="mm", font=get_font(100), fill=COLORS["white"])
        draw.text((w//2, h//2 + 280), "财务管家", anchor="mm", font=get_font(64), fill=COLORS["white"])

    return img

# 生成帧
print(f"Generating {total_frames} frames...")
for i in range(total_frames):
    scene = min(i // frames_per_scene, 5)
    img = draw_scene(scene)
    img.save(FRAME_PATTERN % i)
    if i % 90 == 0:
        print(f"  Frame {i}/{total_frames}")

print(f"Done! Frames saved to {OUTPUT_DIR}")

# 使用 ffmpeg 合成视频
AUDIO_FILE = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/012.文案推广/finance-promo/public/voiceover.m4a"
OUTPUT_VIDEO = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/012.文案推广/ financeira-promo.mp4"
os.makedirs(os.path.dirname(OUTPUT_VIDEO), exist_ok=True)

print("Combining with ffmpeg...")

cmd = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", FRAME_PATTERN,
    "-i", AUDIO_FILE,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-vsync", "cfr",
    "-shortest",
    OUTPUT_VIDEO
]

result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print(f"Error: {result.stderr[:500]}")
else:
    print(f" SUCCESS! Video saved to: {OUTPUT_VIDEO}")