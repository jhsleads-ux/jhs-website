import os
import shutil
from PIL import Image

def assemble():
    temp_v2 = r"C:\Users\Pravina\.gemini\antigravity-ide\brain\1347e988-e52a-4ecb-a01d-4236139417e9\temp_v2"
    temp_v3 = r"C:\Users\Pravina\.gemini\antigravity-ide\brain\1347e988-e52a-4ecb-a01d-4236139417e9\temp_v3"
    temp_v4 = r"C:\Users\Pravina\.gemini\antigravity-ide\brain\1347e988-e52a-4ecb-a01d-4236139417e9\temp_v4"

    target_dir = r"e:\Veer\JHS\Website\jhs-premium-react\jhs-premium-react\public\hero-frames"
    backup_dir = r"e:\Veer\JHS\Website\jhs-premium-react\jhs-premium-react\public\hero-frames-backup"

    v2_files = sorted([os.path.join(temp_v2, f) for f in os.listdir(temp_v2) if f.endswith(".webp")])
    v3_files = sorted([os.path.join(temp_v3, f) for f in os.listdir(temp_v3) if f.endswith(".webp")])
    v4_files = sorted([os.path.join(temp_v4, f) for f in os.listdir(temp_v4) if f.endswith(".webp")])

    print(f"Source counts - V2: {len(v2_files)}, V3: {len(v3_files)}, V4: {len(v4_files)}")
    assert len(v2_files) == 100
    assert len(v3_files) == 85
    assert len(v4_files) == 45

    # Backup existing frames if backup doesn't already exist
    if os.path.exists(target_dir) and not os.path.exists(backup_dir):
        print(f"Creating backup at {backup_dir}...")
        shutil.copytree(target_dir, backup_dir)

    # Recreate target dir
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir, exist_ok=True)

    # 1. Process V2 frames (0 to 95 as direct copy)
    for i in range(96):
        src = v2_files[i]
        dst = os.path.join(target_dir, f"frame-{String_pad(i + 1)}.webp")
        shutil.copy2(src, dst)

    # Transition 1: V2 -> V3 across frames 97, 98, 99, 100, 101, 102
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
        dst = os.path.join(target_dir, f"frame-{String_pad(frame_num)}.webp")
        img.save(dst, "WEBP", quality=74)

    # 2. Process V3 frames (indices 2 to 79, corresponding to frames 103 to 180)
    for i in range(2, 80):
        frame_num = 100 + i + 1  # when i=2 -> 103, when i=79 -> 180
        src = v3_files[i]
        dst = os.path.join(target_dir, f"frame-{String_pad(frame_num)}.webp")
        shutil.copy2(src, dst)

    # Transition 2: V3 -> V4 across frames 181, 182, 183, 184, 185, 186
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
        dst = os.path.join(target_dir, f"frame-{String_pad(frame_num)}.webp")
        img.save(dst, "WEBP", quality=74)

    # 3. Process V4 frames (indices 2 to 44, corresponding to frames 187 to 229)
    for i in range(2, 45):
        frame_num = 185 + i  # when i=2 -> 187, when i=44 -> 229
        src = v4_files[i]
        dst = os.path.join(target_dir, f"frame-{String_pad(frame_num)}.webp")
        shutil.copy2(src, dst)

    # Frame 230 is the final landmark playground frame
    dst_230 = os.path.join(target_dir, f"frame-{String_pad(230)}.webp")
    shutil.copy2(v4_files[-1], dst_230)

    # Verification
    final_files = sorted(os.listdir(target_dir))
    print(f"Assembly complete! Total files in target: {len(final_files)}")
    assert len(final_files) == 230, f"Expected 230 files, got {len(final_files)}"
    assert final_files[0] == "frame-0001.webp"
    assert final_files[-1] == "frame-0230.webp"

    # Check frame 1
    f1 = Image.open(os.path.join(target_dir, "frame-0001.webp"))
    print(f"Frame 1: size={f1.size}, format={f1.format}")

def String_pad(num):
    return str(num).zfill(4)

if __name__ == "__main__":
    assemble()
