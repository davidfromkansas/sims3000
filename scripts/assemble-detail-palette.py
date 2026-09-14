from pathlib import Path
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw
root = Path(__file__).resolve().parents[1] / 'art/architecture/detail-palette'
names = ['Framed window', 'Entrance door', 'Vent grille', 'Window with ledge', 'Cornice']
sheet = Image.new('RGB', (800, 525), '#eaf0ed')
draw = ImageDraw.Draw(sheet)
for row, variant in enumerate(['default', 'terracotta', 'night']):
    for kind, name in enumerate(names, 1):
        source = root / (f'detail-{kind}.svg' if variant == 'default' else f'{variant}-{kind}.svg')
        x, y = (kind - 1) * 160, row * 175
        for element in ET.parse(source).getroot():
            if element.tag.endswith('rect'):
                draw.rectangle((x, y, x + 159, y + 127), fill=element.attrib['fill'])
            elif element.tag.endswith('polygon'):
                points = [tuple(map(float, value.split(','))) for value in element.attrib['points'].split()]
                assert all(0 <= a <= 80 and 0 <= b <= 64 for a, b in points)
                draw.polygon([(x + a * 2, y + b * 2) for a, b in points], fill=element.attrib['fill'])
        draw.text((x + 5, y + 140), name, fill='#183d36')
        draw.text((x + 5, y + 155), variant, fill='#52645d')
sheet.save(root / 'color-variants-review.png')
print('Rendered and bounded all 15 preview polygons.')
