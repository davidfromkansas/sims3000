from pathlib import Path
from PIL import Image, ImageDraw
root=Path(__file__).resolve().parent.parent/'art/architecture/skyline-landmarks'
sheet=Image.new('RGB',(1024,896),(226,234,227));draw=ImageDraw.Draw(sheet)
for row,kind in enumerate(['empireStateBuilding','cnTower']):
    for rotation in range(4):
        source=root/f'{kind}-{rotation}.rgba'
        im=Image.frombytes('RGBA',(512,848),source.read_bytes())
        im.save(source.with_suffix('.png'));source.unlink()
        im=im.resize((256,424),Image.Resampling.LANCZOS)
        sheet.paste(im,(rotation*256,row*448+24),im)
        draw.text((rotation*256+6,row*448+5),kind+' / '+'NESW'[rotation],fill=(34,57,46))
sheet.save(root/'contact-sheet.png')
