"""Import selected resume and portfolio images into web-ready assets."""

from pathlib import Path
import shutil

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PERSONAL = Path(r"D:\个人资料")
RESUME = Path(r"D:\桌面\project\卢嘉贤_嵌入式简历.pdf")

PHOTO_ASSETS = {
    PERSONAL / "国奖推文材料" / "证件照.png": "profile.webp",
    PERSONAL / "国奖推文材料" / "生活照" / "3.jpg": "workbench.webp",
    PERSONAL / "国奖推文材料" / "生活照" / "2.jpg": "portrait-candid.webp",
    PERSONAL / "国奖推文材料" / "生活照" / "4.jpg": "hero-sunset.webp",
}

CERTIFICATE_ASSETS = {
    PERSONAL / "获奖证书" / "2024年TI杯全国大学生电子设计竞赛福建赛区（本科组）一等奖.jpg": "ti-2024-first.webp",
    PERSONAL / "获奖证书" / "暨2025年中国大学生工程实践与创新能力大赛（智能物流搬运赛项决赛成绩）国赛一等奖.jpg": "engineering-practice-2025-national-first.webp",
    PERSONAL / "获奖证书" / "2024睿抗机器人开发者大赛全国一等奖.jpg": "ruichuang-2024-national-first.webp",
    PERSONAL / "获奖证书" / "2024年第十五届蓝桥杯国赛二等奖.jpg": "lanqiao-2024-national-second.webp",
    PERSONAL / "获奖证书" / "2025中国机器人大赛暨RoboCup机器人世界杯中国赛国家一等奖.jpg": "robocup-2025-national-first.webp",
    PERSONAL / "获奖证书" / "2024年第六届全球校园人工智能算法精英大赛全国总决赛三等奖.png": "ai-algorithm-2024-national-third.webp",
    PERSONAL / "获奖证书" / "2023创芯中国集成电路创新挑战赛-集成电路测试应用技术技能赛道华东赛区一等奖.jpg": "ic-innovation-2023-east-first.webp",
    PERSONAL / "非比赛证书" / "国家奖学金荣誉证书.jpg": "national-scholarship.webp",
    PERSONAL / "非比赛证书" / "2024南京Ros机器人操作系统培训结业证书.jpg": "ros-training-2024.webp",
    PERSONAL / "非比赛证书" / "2024国家鼓励奖学金.jpg": "national-inspirational-scholarship-2024.webp",
    PERSONAL / "非比赛证书" / "泉信院一等奖学金.jpg": "university-first-scholarship.webp",
    PERSONAL / "非比赛证书" / "2024三好学生.jpg.jpg": "excellent-student-2024.webp",
}

ROTATE_CLOCKWISE = {"ti-2024-first.webp"}


def convert(source: Path, target: Path, max_size: tuple[int, int], quality: int = 88) -> None:
    if not source.is_file():
        raise FileNotFoundError(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        if target.name in ROTATE_CLOCKWISE:
            image = image.transpose(Image.Transpose.ROTATE_90)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=quality, method=6)
    print(f"{source.name} -> {target.relative_to(ROOT)}")


def main() -> None:
    for source, name in PHOTO_ASSETS.items():
        convert(source, ROOT / "assets" / "photos" / name, (1800, 1800), quality=90)

    for source, name in CERTIFICATE_ASSETS.items():
        convert(source, ROOT / "assets" / "certificates" / name, (2000, 2000), quality=88)

    if not RESUME.is_file():
        raise FileNotFoundError(RESUME)
    shutil.copy2(RESUME, ROOT / "assets" / "resume.pdf")
    print(f"{RESUME.name} -> assets/resume.pdf")


if __name__ == "__main__":
    main()
