from pathlib import Path
import json
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]/'art/architecture/tower-ground'
frames=json.loads((root/'review-polygons.json').read_text())
scale=3
image=Image.new('RGB',(1024*scale,410*scale),'#eaf0ed')
draw=ImageDraw.Draw(image)
for rotation,commands in enumerate(frames):
    for command in commands:
        points=command['points']
        assert all(0<=x<=256 and 0<=y<=384 for x,y in points)
        points=[((rotation*256+x)*scale,y*scale) for x,y in points]
        if 'lineWidth' in command:draw.line(points,fill=command['color'],width=max(1,round(command['lineWidth']*scale)))
        else:draw.polygon(points,fill=command['color'])
    draw.text(((rotation*256+90)*scale,390*scale),['North','East','South','West'][rotation],fill='#163f37')
image.resize((1024,410),Image.Resampling.LANCZOS).save(root/'four-view-review.png')
print('Rendered four bounded runtime tower-ground views.')
