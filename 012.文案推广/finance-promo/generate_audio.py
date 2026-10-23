import os
import subprocess
from datetime import datetime

# 视频内容脚本
SCRIPT = """
财务管家，你的私人理财小助手。
你是不是也有这种感觉？工资刚到账就没了，钱不知道花哪儿了，想省钱但无从下手？
现在起，三秒改变！选择分类，输入金额，完成！只要三秒，就能记一笔账。
收入支出，一目了然。分类统计、月度趋势、还能导出Excel。
粉色UI超好看，用着心情好，才能坚持记账！
越早开始，越早受益！三秒改变，月底惊喜。财务管家，让你的钱包不再月光。
"""

# 分段对应视频场景
SCENES = [
    (0, "封面", "财务管家，你的私人理财小助手"),
    (3, "痛点", "工资刚到账就没了"),
    (6, "功能介绍", "3秒快速记账"),
    (9, "统计功能", "收入支出一目了然"),
    (12, "UI设计", "粉色UI超好看"),
    (15, "结束", "越早开始越早受益"),
]

def generate_audio():
    """使用 edge-tts 生成配音"""
    output_dir = "/Volumes/lee/workspaces/claude_workspace/claude-my-product/012.文案推广/finance-promo/public"
    os.makedirs(output_dir, exist_ok=True)

    # 检查是否有 edge-tts
    try:
        subprocess.run(["edge-tts", "--version"], capture_output=True, check=True)
    except FileNotFoundError:
        print("edge-tts 未安装，尝试安装...")
        subprocess.run(["pip", "install", "edge-tts"], check=True)

    # 使用中文女声
    voice = "zh-CN-XiaoxiaoNeural"
    output_file = os.path.join(output_dir, "voiceover.mp3")

    print(f"生成配音到: {output_file}")

    # 生成音频
    cmd = [
        "edge-tts",
        "--voice", voice,
        "--write-media", output_file,
        "--text", SCRIPT
    ]

    subprocess.run(cmd, check=True)
    print("配音生成完成!")
    return output_file

if __name__ == "__main__":
    generate_audio()