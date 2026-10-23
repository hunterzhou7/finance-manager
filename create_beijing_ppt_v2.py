#!/usr/bin/env python3
"""
北京3日游 PPT - 春夏旅行风格
使用专业设计系统
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Design System
COLORS = {
    # Theme 1: Summer Sky (天蓝色)
    'primary': (64, 168, 251),
    'secondary': (255, 255, 255),
    'accent': (255, 183, 197),  # 樱花粉
    # Theme 2: Forest Green
    'forest': (46, 139, 87),
    # Theme 3: Sunset Coral
    'coral': (255, 127, 80),
    # Neutrals
    'dark': (30, 30, 40),
    'light': (250, 250, 252),
    'gray': (150, 150, 160),
    'white': (255, 255, 255),
}

def rgb_tuple_to_rgb(rgb):
    return RGBColor(*rgb)

# Create presentation
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Helper functions
def add_title_slide(slide, title, subtitle=None, bg_color=COLORS['primary'], accent_color=COLORS['accent']):
    """Create a beautiful title slide with gradient background simulation"""
    # Main background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0),
                               prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = rgb_tuple_to_rgb(bg_color)
    bg.line.fill.background()

    # Add decorative accent bar at top
    accent_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0),
                                       prs.slide_width, Inches(0.15))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = rgb_tuple_to_rgb(accent_color)
    accent_bar.line.fill.background()

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(2.8), Inches(11.7), Inches(1.2))
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.name = "Microsoft YaHei"
    p.alignment = PP_ALIGN.LEFT
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['white'])

    # Subtitle
    if subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(4.1), Inches(11.7), Inches(0.8))
        tf = sub_box.text_frame
        p = tf.paragraphs[0]
        p.text = subtitle
        p.font.size = Pt(28)
        p.font.name = "Microsoft YaHei"
        for run in p.runs:
            run.font.color.rgb = rgb_tuple_to_rgb((220, 235, 255))

def add_content_slide(slide, title, title_color=COLORS['dark'],
                     left_content=None, right_image=None):
    """Create a content slide with card layout"""
    # White background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0),
                           prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['light'])
    bg.line.fill.background()

    # Title bar
    title_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0),
                                     prs.slide_width, Inches(1.1))
    title_bar.fill.solid()
    title_bar.fill.fore_color.rgb = rgb_tuple_to_rgb(title_color)
    title_bar.line.fill.background()

    # Title text
    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.3), Inches(6), Inches(0.6))
    tf = title_box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.name = "Microsoft YaHei"
    p.alignment = PP_ALIGN.LEFT
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['white'])

    # Day indicator
    day_box = slide.shapes.add_textbox(Inches(11), Inches(0.3), Inches(2), Inches(0.6))
    tf = day_box.text_frame
    p = tf.paragraphs[0]
    p.text = "DAY 1"
    p.font.size = Pt(18)
    p.font.bold = True
    p.alignment = PP_ALIGN.RIGHT
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['accent'])

# ==================== SLIDE 1: COVER ====================
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
add_title_slide(slide1, "北京3日游", "春日漫游 · 探寻古今", COLORS['primary'], COLORS['accent'])

# Add decorative circles
for i in range(5):
    opacity = 150 - i * 30
    circle = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(10 + i*0.4), Inches(5.5 + i*0.3),
                                   Inches(1.5 - i*0.2), Inches(1.5 - i*0.2))
    circle.fill.solid()
    circle.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['accent'])
    circle.fill.transparency = 20 + i*10
    circle.line.fill.background()

# Add tagline
tag_box = slide1.shapes.add_textbox(Inches(0.8), Inches(5.2), Inches(8), Inches(0.5))
tf = tag_box.text_frame
p = tf.paragraphs[0]
p.text = "🌸 春天来北京赴一场穿越古今的约会"
p.font.size = Pt(18)
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb((200, 220, 255))

# ==================== SLIDE 2: DAY 1 TIANANMEN ====================
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
add_content_slide(slide2, "Day 1：天安门广场 → 故宫", COLORS['primary'], "left")

# Location card
card_x, card_y = 0.5, 1.4
card_w, card_h = 5.5, 5.3

# Card background
card_bg = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_x), Inches(card_y),
                                 Inches(card_w), Inches(card_h))
card_bg.fill.solid()
card_bg.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['white'])
card_bg.line.color.rgb = rgb_tuple_to_rgb(COLORS['primary'])
card_bg.line.width = Pt(2)

# Card title
card_title = slide2.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 0.3),
                                      Inches(card_w - 0.6), Inches(0.6))
tf = card_title.text_frame
p = tf.paragraphs[0]
p.text = "📍 第一站：天安门广场 & 故宫"
p.font.size = Pt(24)
p.font.bold = True
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['primary'])

# Card content
content_lines = [
    "🎫 门票：免费（广场）/ 60元（故宫）",
    "⏰ 建议游览：2-3小时",
    "👣 亮点：升旗仪式、胡同穿越、皇城根遗迹",
    "📸 拍照：午门、太和殿视角最震撼",
    "🍜 美食：四季民福烤鸭店"
]

card_content = slide2.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 1.2),
                                        Inches(card_w - 0.6), Inches(3.5))
tf = card_content.text_frame
for i, line in enumerate(content_lines):
    if i == 0:
        p = tf.paragraphs[0]
    else:
        p = tf.add_paragraph()
    p.text = line
    p.font.size = Pt(16)
    p.space_after = Pt(12)
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['dark'])

# Tips card
tip_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_x + 5.8), Inches(card_y + 3.5),
                                  Inches(2.8), Inches(3.8))
tip_card.fill.solid()
tip_card.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['accent'])
tip_card.fill.transparency = 30
tip_card.line.fill.background()

tip_text = slide2.shapes.add_textbox(Inches(card_x + 6), Inches(card_y + 3.7),
                                     Inches(2.5), Inches(3))
tf = tip_text.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "💡 小贴士"
p.font.size = Pt(18)
p.font.bold = True
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['primary'])

p2 = tf.add_paragraph()
p2.text = "\n建议早起看升旗\n需要提前预约\n周一闭馆注意"
p2.font.size = Pt(14)
for run in p2.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['dark'])

# Insert image on right
img_dir = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/010.内容运营（自媒体与运维）/beijing_images"
img_path = f"{img_dir}/beijing_tiananmen.png"
if os.path.exists(img_path):
    try:
        slide2.shapes.add_picture(img_path, Inches(8), Inches(1.4), width=Inches(5))
    except:
        pass

# Day badge
day2 = slide2.shapes.add_textbox(Inches(0), Inches(0), Inches(2), Inches(0.4))
tf = day2.text_frame
p = tf.paragraphs[0]
p.text = "DAY 1"
p.font.size = Pt(14)
p.alignment = PP_ALIGN.CENTER
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['accent'])

# ==================== SLIDE 3: DAY 2 GREAT WALL ====================
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
add_content_slide(slide3, "Day 2：八达岭长城", COLORS['forest'], "left")

# Update day indicator
day_box3 = slide3.shapes.add_textbox(Inches(11), Inches(0.3), Inches(2), Inches(0.6))
tf = day_box3.text_frame
p = tf.paragraphs[0]
p.text = "DAY 2"
p.font.size = Pt(18)
p.font.bold = True
p.alignment = PP_ALIGN.RIGHT
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb((170, 255, 200))

# Location card
card_x, card_y = 0.5, 1.4

# Card background
card_bg3 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_x), Inches(card_y),
                                 Inches(card_w), Inches(card_h))
card_bg3.fill.solid()
card_bg3.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['white'])
card_bg3.line.color.rgb = rgb_tuple_to_rgb(COLORS['forest'])
card_bg3.line.width = Pt(2)

# Card title
card_title3 = slide3.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 0.3),
                                      Inches(card_w - 0.6), Inches(0.6))
tf = card_title3.text_frame
p = tf.paragraphs[0]
p.text = "🏔️ 第二站：八达岭长城"
p.font.size = Pt(24)
p.font.bold = True
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['forest'])

# Card content
content_lines3 = [
    "🎫 门票：40元（学生20元）",
    "⏰ 建议游览：3-4小时",
    "👣 亮点：登长城做好汉、春日踏青",
    "🚠 索道：单程100元/双程140元",
    "🧗 难度：南坡较缓，北坡较陡"
]

card_content3 = slide3.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 1.2),
                                        Inches(card_w - 0.6), Inches(3.5))
tf = card_content3.text_frame
for i, line in enumerate(content_lines3):
    if i == 0:
        p = tf.paragraphs[0]
    else:
        p = tf.add_paragraph()
    p.text = line
    p.font.size = Pt(16)
    p.space_after = Pt(12)
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['dark'])

# Insert image
img_path3 = f"{img_dir}/beijing_greatwall.png"
if os.path.exists(img_path3):
    try:
        slide3.shapes.add_picture(img_path3, Inches(8), Inches(1.4), width=Inches(5))
    except:
        pass

# ==================== SLIDE 4: DAY 3 HOUHAI ====================
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
add_content_slide(slide4, "Day 3：后海酒吧街", COLORS['coral'], "left")

# Update day indicator
day_box4 = slide4.shapes.add_textbox(Inches(11), Inches(0.3), Inches(2), Inches(0.6))
tf = day_box4.text_frame
p = tf.paragraphs[0]
p.text = "DAY 3"
p.font.size = Pt(18)
p.font.bold = True
p.alignment = PP_ALIGN.RIGHT
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb((255, 200, 150))

# Location card
card_x, card_y = 0.5, 1.4

# Card background
card_bg4 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(card_x), Inches(card_y),
                                 Inches(card_w), Inches(card_h))
card_bg4.fill.solid()
card_bg4.fill.fore_color.rgb = rgb_tuple_to_rgb(COLORS['white'])
card_bg4.line.color.rgb = rgb_tuple_to_rgb(COLORS['coral'])
card_bg4.line.width = Pt(2)

# Card title
card_title4 = slide4.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 0.3),
                                      Inches(card_w - 0.6), Inches(0.6))
tf = card_title4.text_frame
p = tf.paragraphs[0]
p.text = "🍺 第三站：后海酒吧街"
p.font.size = Pt(24)
p.font.bold = True
for run in p.runs:
    run.font.color.rgb = rgb_tuple_to_rgb(COLORS['coral'])

# Card content
content_lines4 = [
    "🎫 门票：免费",
    "⏰ 最佳时段：18:00-24:00",
    "👣 亮点：胡同文艺、酒吧音乐、夜景观什刹海",
    "☕ 咖啡：%arabica、后海V酒吧",
    "🚲 伴行：骑单车逛胡同"
]

card_content4 = slide4.shapes.add_textbox(Inches(card_x + 0.3), Inches(card_y + 1.2),
                                        Inches(card_w - 0.6), Inches(3.5))
tf = card_content4.text_frame
for i, line in enumerate(content_lines4):
    if i == 0:
        p = tf.paragraphs[0]
    else:
        p = tf.add_paragraph()
    p.text = line
    p.font.size = Pt(16)
    p.space_after = Pt(12)
    for run in p.runs:
        run.font.color.rgb = rgb_tuple_to_rgb(COLORS['dark'])

# Insert image
img_path4 = f"{img_dir}/beijing_houhai.png"
if os.path.exists(img_path4):
    try:
        slide4.shapes.add_picture(img_path4, Inches(8), Inches(1.4), width=Inches(5))
    except:
        pass

# ==================== SAVE ====================
output_dir = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/010.内容运营（自媒体与运维）"
prs.save(f"{output_dir}/北京3日游v2.pptx")
print(f"✓ PPT已创建: {output_dir}/北京3日游v2.pptx")