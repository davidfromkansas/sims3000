from pathlib import Path
from PIL import Image, ImageDraw
root=Path(__file__).resolve().parents[1]/'art/architecture/chicago-landmarks'
names=['adlerPlanetarium','sheddAquarium','artInstituteChicago']
sheet=Image.new('RGB',(1024,1320),'#e8eeeb');draw=ImageDraw.Draw(sheet)
for row,name in enumerate(names):
    for rotation in range(4):
        source=root/f'{name}-{rotation}.rgba'
        frame=Image.frombytes('RGBA',(512,848),source.read_bytes())
        bounds=frame.getbbox()
        assert bounds and bounds[0]>0 and bounds[1]>0 and bounds[2]<512 and bounds[3]<848, (name,rotation,bounds)
        frame.save(root/f'{name}-{rotation}.png');source.unlink()
        frame.thumbnail((256,424));sheet.paste(frame,(rotation*256,row*440),frame)
        draw.text((rotation*256+12,row*440+420),f'{name} / {rotation}',fill='#17382f')
sheet.save(root/'contact-sheet.png')
print('Twelve RGBA views passed transparent-boundary checks.')
