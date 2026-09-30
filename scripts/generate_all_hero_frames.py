import os
import shutil
import subprocess
from PIL import Image

def generate_hero_frames():
    base_dir = r"e:\Veer\JHS\Website\jhs-premium-react\jhs-premium-react"
    target_dir = os.path.join(base_dir, "public", "hero-frames")
    temp_dir = os.path.join(base_dir, "temp_hero_build")

    v2_path = r"E:\Veer\JHS\Videos\drone shoot jhs 2 - Trim.mp4"
    v3_path = r"E:\Veer\JHS\Videos\drone shoot jhs 3 - Trim.mp4"
    v4_path = r"E:\Veer\JHS\Videos\drone shoot jhs 4 - Trim.mp4"

    print("Step 1: Preparing directories...")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(os.path.join(temp_dir, "v2"), exist_ok=True)
    os.makedirs(os.path.join(temp_dir, "v3"), exist_ok=True)
    os.makedirs(os.path.join(temp_dir, "v4"), exist_ok=True)

    print("Step 2: Extracting JHS 2 frames (bypassing 1.1s initial black fade)...")
    subprocess.run([
        "ffmpeg", "-y",
        "-ss", "1.168",
        "-to", "15.464",
        "-i", v2_path,
        "-vf", "fps=100/14.296,scale=1280:720",
        "-c:v", "libwebp",
        "-quality", "74",
        os.path.join(temp_dir, "v2", "f_%04d.webp")
    ], check=True)

    print("Step 3: Extracting JHS 3 frames (entrance & lobby glide)...")
    subprocess.run([
        "ffmpeg", "-y",
        "-ss", "0.0",
        "-to", "12.304",
        "-i", v3_path,
        "-vf", "fps=85/12.304,scale=1280:720",
        "-c:v", "libwebp",
        "-quality", "74",
        os.path.join(temp_dir, "v3", "f_%04d.webp")
    ], check=True)

    print("Step 4: Extracting JHS 4 frames (new trim to landmark sign)...")
    subprocess.run([
        "ffmpeg", "-y",
        "-ss", "0.0",
        "-to", "4.48",
        "-i", v4_path,
        "-vf", "fps=45/4.48,scale=1280:720",
        "-c:v", "libwebp",
        "-quality", "74",
        os.path.join(temp_dir, "v4", "f_%04d.webp")
    ], check=True)

    v2_files = sorted([os.path.join(temp_dir, "v2", f) for f in os.listdir(os.path.join(temp_dir, "v2")) if f.endswith(".webp")])
    v3_files = sorted([os.path.join(temp_dir, "v3", f) for f in os.listdir(os.path.join(temp_dir, "v3")) if f.endswith(".webp")])
    v4_files = sorted([os.path.join(temp_dir, "v4", f) for f in os.listdir(os.path.join(temp_dir, "v4")) if f.endswith(".webp")])

    print(f"Extracted counts -> V2: {len(v2_files)}, V3: {len(v3_files)}, V4: {len(v4_files)}")
    assert len(v2_files) == 100, f"Expected 100 V2 frames, got {len(v2_files)}"
    assert len(v3_files) == 85, f"Expected 85 V3 frames, got {len(v3_files)}"
    assert len(v4_files) == 45, f"Expected 45 V4 frames, got {len(v4_files)}"

    print("Step 5: Clearing old target frames...")
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir, exist_ok=True)

    def pad(num):
        return str(num).zfill(4)

    print("Step 6: Writing V2 frames (1 to 96)...")
    for i in range(96):
        shutil.copy2(v2_files[i], os.path.join(target_dir, f"frame-{pad(i + 1)}.webp"))

    print("Step 7: Applying Transition 1 (V2 -> V3 crossfade, frames 97 to 102)...")
    v2_96 = Image.open(v2_files[96]).convert("RGB")
    v2_97 = Image.open(v2_files[97]).convert("RGB")
    v2_98 = Image.open(v2_files[98]).convert("RGB")
    v2_99 = Image.open(v2_files[99]).convert("RGB")
    v3_0 = Image.open(v3_files[0]).convert("RGB")
    v3_1 = Image.open(v3_files[1]).convert("RGB")
    v3_2 = Image.open(v3_files[2]).convert("RGB")

    blends_t1 = [
        (97, Image.blend(v2_96, v3_0, 0.12)),
        (98, Image.blend(v2_97, v3_0, 0.28)),
        (99, Image.blend(v2_98, v3_0, 0.48)),
        (100, Image.blend(v2_99, v3_0, 0.68)),
        (101, Image.blend(v2_99, v3_1, 0.84)),
        (102, Image.blend(v2_99, v3_2, 0.94)),
    ]
    for frame_num, img in blends_t1:
        img.save(os.path.join(target_dir, f"frame-{pad(frame_num)}.webp"), "WEBP", quality=74)

    print("Step 8: Writing V3 frames (103 to 180)...")
    for i in range(2, 80):
        frame_num = 100 + i + 1  # i=2 -> 103, i=79 -> 180
        shutil.copy2(v3_files[i], os.path.join(target_dir, f"frame-{pad(frame_num)}.webp"))

    print("Step 9: Applying Transition 2 (V3 -> V4 crossfade, frames 181 to 186)...")
    v3_80 = Image.open(v3_files[80]).convert("RGB")
    v3_81 = Image.open(v3_files[81]).convert("RGB")
    v3_82 = Image.open(v3_files[82]).convert("RGB")
    v3_83 = Image.open(v3_files[83]).convert("RGB")
    v3_84 = Image.open(v3_files[84]).convert("RGB")
    v4_0 = Image.open(v4_files[0]).convert("RGB")
    v4_1 = Image.open(v4_files[1]).convert("RGB")
    v4_2 = Image.open(v4_files[2]).convert("RGB")

    blends_t2 = [
        (181, Image.blend(v3_80, v4_0, 0.12)),
        (182, Image.blend(v3_81, v4_0, 0.28)),
        (183, Image.blend(v3_82, v4_0, 0.48)),
        (184, Image.blend(v3_83, v4_0, 0.68)),
        (185, Image.blend(v3_84, v4_1, 0.84)),
        (186, Image.blend(v3_84, v4_2, 0.94)),
    ]
    for frame_num, img in blends_t2:
        img.save(os.path.join(target_dir, f"frame-{pad(frame_num)}.webp"), "WEBP", quality=74)

    print("Step 10: Writing V4 frames (187 to 230) ending at the landmark sign...")
    for i in range(2, 45):
        frame_num = 185 + i  # i=2 -> 187, i=44 -> 229
        shutil.copy2(v4_files[i], os.path.join(target_dir, f"frame-{pad(frame_num)}.webp"))
    shutil.copy2(v4_files[-1], os.path.join(target_dir, f"frame-{pad(230)}.webp"))

    print("Step 11: Cleaning up temp directory...")
    shutil.rmtree(temp_dir)

    print("Step 12: Final verification...")
    final_files = sorted(os.listdir(target_dir))
    assert len(final_files) == 230, f"Expected 230 files, got {len(final_files)}"
    assert final_files[0] == "frame-0001.webp"
    assert final_files[-1] == "frame-0230.webp"

    # Verify frame 1 brightness
    f1 = Image.open(os.path.join(target_dir, "frame-0001.webp"))
    print(f"Success! 230 frames assembled in {target_dir}")
    print(f"Frame 1 info: size={f1.size}, format={f1.format}")

if __name__ == "__main__":
    generate_hero_frames()
