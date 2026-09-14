"""Assemble original geometry review rasters, after render-prop-review.mjs."""
from PIL import Image, ImageDraw
from pathlib import Path
import json
root = Path(__file__).resolve().parent.parent / 'art/architecture/building-props'
items = json.loads((root / 'review.json').read_text())
sheet = Image.new('RGB', (680, (len(items) // 4) * 194), (227, 235, 228))
draw = ImageDraw.Draw(sheet)
for i, item in enumerate(items):
    source = root / item['file']
    im = Image.frombytes('RGBA', (160, 160), source.read_bytes())
    x, y = (i % 4) * 170 + 5, (i // 4) * 194 + 26
    sheet.paste(im, (x, y), im)
    if i % 4 == 0:
        draw.text((5, y - 22), item['name'] + ' / ' + item['category'], fill=(34, 58, 48))
    draw.text((x + 142, y + 153), 'NESW'[i % 4], fill=(34, 58, 48))
    im.save(source.with_suffix('.png'))
    source.unlink()
sheet.save(root / 'contact-sheet.png')
