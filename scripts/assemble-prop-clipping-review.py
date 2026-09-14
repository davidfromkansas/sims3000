"""Assemble the geometry diagnostic after render-prop-clipping-review.mjs."""
from PIL import Image, ImageDraw
from pathlib import Path
import json
root = Path(__file__).resolve().parent.parent / 'art/architecture/building-props/clipping'
items = json.loads((root / 'review.json').read_text())
sheet = Image.new('RGB', (1280, 1400), (226, 234, 228))
draw = ImageDraw.Draw(sheet)
for i, item in enumerate(items):
    source = root / item['file']
    im = Image.frombytes('RGBA', (320, 320), source.read_bytes())
    x, y = i % 4 * 320, i // 4 * 350 + 25
    sheet.paste(im, (x, y), im)
    draw.text((x + 8, y - 20), item['name'] + ' / ' + 'NESW'[item['rotation']], fill=(30, 54, 44))
    im.save(source.with_suffix('.png'))
    source.unlink()
sheet.save(root / 'contact-sheet.png')
