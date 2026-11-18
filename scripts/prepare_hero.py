"""Przygotowuje obraz źródłowy rastra i statyczny fallback SVG.
Źródło: oryginalna ilustracja scripts/robot.svg (wyrenderowana do PNG, np. zrzutem z przeglądarki).
Użycie: python3 scripts/prepare_hero.py <render_robota.png>

Wynik assets/hero-source.png (RGB):
  R = jasność kropki (0 = brak kropki / tło)
  G = 255 dla czerwonych elementów (kropki różowe), 0 dla reszty (turkusowe)
"""
import sys
from PIL import Image

src = Image.open(sys.argv[1]).convert("RGB")
W = 260
src = src.resize((W, round(src.height * W / src.width)), Image.LANCZOS)
px = src.load()
out = Image.new("RGB", src.size, (0, 0, 0))
op = out.load()
for y in range(src.height):
    for x in range(src.width):
        r, g, b = px[x, y]
        if r > 150 and g < 90 and b < 90:      # czerwień -> różowe kropki
            op[x, y] = (235, 255, 255)
            continue
        lum = 0.3 * r + 0.59 * g + 0.11 * b
        if lum < 10:                            # czarne tło
            continue
        v = int(18 + 237 * (lum / 255) ** 1.25)
        op[x, y] = (v, 0, 255)

bbox = out.getbbox()
out = out.crop(bbox)
out.save("assets/hero-source.png", optimize=True)
print("source", out.size)

# statyczny fallback SVG (ta sama logika co w main.js)
step = 5
w, h = out.size
p = out.load()
cy, pk = [], []
for y in range(step // 2, h, step):
    for x in range(step // 2, w, step):
        v, isred, _ = p[x, y]
        v /= 255
        if v < 0.03:
            continue
        r = (0.15 + 0.85 * v ** 0.9) * step * 0.5
        (pk if isred > 128 else cy).append(f'<circle cx="{x}" cy="{y}" r="{r:.2f}"/>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
       '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'
       '<stop offset="0" stop-color="#F2FEFF"/><stop offset="1" stop-color="#2DE2E6"/>'
       '</linearGradient></defs>'
       '<g fill="url(#g)">' + "".join(cy) + '</g><g fill="#FF3EA5">' + "".join(pk) + "</g></svg>")
open("assets/hero-raster.svg", "w").write(svg)
print("svg dots", len(cy) + len(pk), "pink", len(pk))
