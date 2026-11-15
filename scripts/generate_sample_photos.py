"""Generate sample photos of the Uvie UV sticker worn on the back of a hand.

The photos are procedurally rendered (not real camera shots) so the scan flow can be
tested without a physical sticker. Each sample uses a different photochromic coating
color, from fresh/unactivated (pale yellow) to fully activated by UV (deep violet).

Usage:
    python3 scripts/generate_sample_photos.py

Writes JPEGs to public/samples/ and prints the center luminance the app will measure.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "samples"
SIZE = 960

# (file name, coating RGB, seed). Coating colors follow the brand's
# "yellow -> dark" sticker gradient.
SAMPLES = [
    ("sticker-fresh.jpg", (246, 232, 186), 11),      # unactivated: protected
    ("sticker-fading.jpg", (160, 128, 140), 23),     # starting to tint: borderline
    ("sticker-worn-off.jpg", (118, 88, 124), 37),   # mostly activated: reapply
    ("sticker-activated.jpg", (74, 52, 104), 41),    # fully activated: reapply
]


def smooth_noise(rng: np.random.Generator, scale: int, blur: float) -> np.ndarray:
    """Low-frequency noise in [-1, 1] at SIZE x SIZE."""
    small = rng.standard_normal((SIZE // scale, SIZE // scale)).astype(np.float32)
    img = Image.fromarray(((small - small.min()) / np.ptp(small) * 255).astype(np.uint8))
    img = img.resize((SIZE, SIZE), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    arr = np.asarray(img, dtype=np.float32) / 127.5 - 1.0
    return arr


def render_skin(rng: np.random.Generator) -> np.ndarray:
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32) / SIZE

    base = np.array([214, 168, 138], dtype=np.float32)  # warm medium skin tone
    skin = np.ones((SIZE, SIZE, 3), dtype=np.float32) * base

    # Soft directional daylight from the top-left, falling off to the bottom-right.
    light = 1.08 - 0.28 * (0.6 * xx + 0.4 * yy)
    skin *= light[..., None]

    # Blotchy tone variation and fine pores.
    blotch = smooth_noise(rng, 24, 18)
    skin += blotch[..., None] * np.array([10, 9, 8], dtype=np.float32)
    pores = rng.standard_normal((SIZE, SIZE)).astype(np.float32)
    pores = np.asarray(
        Image.fromarray(np.clip(pores * 40 + 128, 0, 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(1.1)
        ),
        dtype=np.float32,
    ) / 128.0 - 1.0
    skin += pores[..., None] * 6

    # Faint tendons running toward the knuckles (back-of-hand look).
    tendon_layer = Image.new("L", (SIZE, SIZE), 0)
    draw = ImageDraw.Draw(tendon_layer)
    for i, x0 in enumerate((0.18, 0.40, 0.62, 0.84)):
        x1 = x0 + 0.06 * (i - 1.5)
        draw.line(
            [(x0 * SIZE, SIZE * 1.05), (x1 * SIZE, -SIZE * 0.05)],
            fill=255,
            width=int(SIZE * 0.035),
        )
    tendons = np.asarray(tendon_layer.filter(ImageFilter.GaussianBlur(28)), dtype=np.float32) / 255
    skin += tendons[..., None] * 9

    # Fine skin creases in a diamond cross-hatch.
    crease_layer = Image.new("L", (SIZE, SIZE), 0)
    cdraw = ImageDraw.Draw(crease_layer)
    for _ in range(260):
        x, y = rng.uniform(0, SIZE, 2)
        length = rng.uniform(25, 70)
        angle = np.deg2rad(rng.choice([25, 155]) + rng.normal(0, 8))
        cdraw.line(
            [(x, y), (x + np.cos(angle) * length, y + np.sin(angle) * length)],
            fill=int(rng.uniform(80, 200)),
            width=1,
        )
    creases = np.asarray(crease_layer.filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255
    skin -= creases[..., None] * np.array([26, 30, 30], dtype=np.float32)

    # A faint bluish vein.
    vein_layer = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(vein_layer).line(
        [(0.05 * SIZE, 0.95 * SIZE), (0.22 * SIZE, 0.7 * SIZE), (0.15 * SIZE, 0.35 * SIZE),
         (0.28 * SIZE, 0.0)],
        fill=255,
        width=14,
        joint="curve",
    )
    vein = np.asarray(vein_layer.filter(ImageFilter.GaussianBlur(10)), dtype=np.float32) / 255
    skin += vein[..., None] * np.array([-14, -6, 6], dtype=np.float32)

    # Fine hairs.
    hair_layer = Image.new("L", (SIZE, SIZE), 0)
    hdraw = ImageDraw.Draw(hair_layer)
    for _ in range(140):
        x, y = rng.uniform(0, SIZE, 2)
        length = rng.uniform(10, 26)
        angle = np.deg2rad(rng.normal(-70, 12))
        hdraw.line(
            [(x, y), (x + np.cos(angle) * length, y + np.sin(angle) * length)],
            fill=int(rng.uniform(60, 140)),
            width=1,
        )
    hair = np.asarray(hair_layer.filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32) / 255
    skin -= hair[..., None] * np.array([70, 60, 52], dtype=np.float32)

    return skin


def render_background(skin: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    """Hand edge in the top-right corner with an out-of-focus background behind it."""
    mask = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(mask).ellipse(
        [-0.55 * SIZE, 0.08 * SIZE, 1.02 * SIZE, 1.9 * SIZE], fill=255
    )
    mask_arr = np.asarray(mask.filter(ImageFilter.GaussianBlur(6)), dtype=np.float32) / 255

    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32) / SIZE
    bg = np.ones((SIZE, SIZE, 3), dtype=np.float32) * np.array([92, 118, 104], dtype=np.float32)
    bg *= (0.9 + 0.3 * xx - 0.2 * yy)[..., None]
    bg += smooth_noise(rng, 48, 40)[..., None] * 18

    # Darken the skin slightly at the hand's edge (curvature falloff).
    edge = np.asarray(mask.filter(ImageFilter.GaussianBlur(60)), dtype=np.float32) / 255
    shaded = skin * (0.78 + 0.22 * edge[..., None])
    return shaded * mask_arr[..., None] + bg * (1 - mask_arr[..., None])


def render_sticker(img: np.ndarray, coating: tuple[int, int, int], rng: np.random.Generator) -> np.ndarray:
    cx = SIZE * 0.5 + rng.uniform(-6, 6)
    cy = SIZE * 0.5 + rng.uniform(-6, 6)
    r_coat = SIZE * 0.29
    r_patch = SIZE * 0.315

    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
    # Camera held at a slight angle: the round sticker reads as a tilted ellipse.
    tilt = np.deg2rad(rng.uniform(-25, 25))
    u = (xx - cx) * np.cos(tilt) + (yy - cy) * np.sin(tilt)
    v = -(xx - cx) * np.sin(tilt) + (yy - cy) * np.cos(tilt)
    dist = np.hypot(u, v / 0.93)

    def soft_disc(radius: float, feather: float) -> np.ndarray:
        return np.clip((radius - dist) / feather + 0.5, 0, 1)

    # Contact shadow under the patch, offset away from the light.
    shadow_d = np.hypot(xx - cx - 8, yy - cy - 10)
    shadow = np.clip((r_patch + 14 - shadow_d) / 26, 0, 1) ** 1.5
    img = img * (1 - 0.28 * shadow[..., None])

    # Translucent hydrocolloid patch: skin shows through, slightly milky.
    patch = soft_disc(r_patch, 2.5)
    milky = img * 0.82 + np.array([235, 225, 210], dtype=np.float32) * 0.18
    img = img * (1 - patch[..., None]) + milky * patch[..., None]

    # Photochromic coating with uneven brush thickness.
    angle = np.arctan2(v, u)
    wobble = sum(rng.uniform(1.0, 3.0) * np.sin(k * angle + rng.uniform(0, 6.3)) for k in (3, 7, 13))
    coat = np.clip((r_coat + wobble - dist) / 3.0 + 0.5, 0, 1)
    thickness = 1 + smooth_noise(rng, 32, 14) * 0.045 + smooth_noise(rng, 8, 3) * 0.02
    color = np.array(coating, dtype=np.float32)[None, None, :] * thickness[..., None]
    # Same daylight falloff as the skin so the sticker sits in the scene.
    color *= (1.06 - 0.12 * ((xx - cx) + (yy - cy)) / (2 * r_coat))[..., None]
    grain = rng.standard_normal((SIZE, SIZE)).astype(np.float32)
    color += grain[..., None] * 3.5
    img = img * (1 - coat[..., None]) + color * coat[..., None]

    # Thin raised rim on the patch edge.
    rim = np.exp(-((dist - r_patch + 2) ** 2) / 6.0)
    img += rim[..., None] * np.array([28, 26, 24], dtype=np.float32) * (
        0.4 + 0.6 * np.clip(-(xx - cx + yy - cy) / (2 * r_patch) + 0.5, 0, 1)
    )[..., None]

    # Glossy specular highlight from the top-left.
    hl_d = np.hypot((xx - (cx - r_coat * 0.45)) / 1.6, yy - (cy - r_coat * 0.55))
    highlight = np.clip(1 - hl_d / (r_coat * 0.22), 0, 1) ** 2 * coat
    img += highlight[..., None] * 38

    return img


def finish(img: np.ndarray, rng: np.random.Generator) -> Image.Image:
    yy, xx = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32) / SIZE
    vignette = 1 - 0.22 * (((xx - 0.5) ** 2 + (yy - 0.5) ** 2) / 0.5)
    img = img * vignette[..., None]
    img += rng.standard_normal(img.shape).astype(np.float32) * 2.2  # sensor noise
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    return out.filter(ImageFilter.GaussianBlur(0.7))  # slight lens softness


def center_luminance(image: Image.Image) -> float:
    """Mirror of analyzeSticker.ts: mean luminance of the central 40% square."""
    w, h = image.size
    square = int(min(w, h) * 0.4)
    sx, sy = (w - square) // 2, (h - square) // 2
    arr = np.asarray(image.crop((sx, sy, sx + square, sy + square)), dtype=np.float32)
    r, g, b = arr[..., 0].mean(), arr[..., 1].mean(), arr[..., 2].mean()
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, coating, seed in SAMPLES:
        rng = np.random.default_rng(seed)
        img = render_background(render_skin(rng), rng)
        img = render_sticker(img, coating, rng)
        photo = finish(img, rng)
        path = OUT_DIR / name
        photo.save(path, "JPEG", quality=86, optimize=True)
        print(f"{name:24s} center luminance {center_luminance(photo):6.1f}  "
              f"({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
