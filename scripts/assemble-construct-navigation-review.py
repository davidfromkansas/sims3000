from pathlib import Path
import json,re
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]/'art/architecture/construct-navigation'
frames=json.loads((root/'review-polygons.json').read_text())
scale=3
result=Image.new('RGB',(4*384*scale,420*scale),'#eaf0ed')
def color(value):
    if value.startswith('rgba'):
        r,g,b,a=map(float,re.findall(r'[\d.]+',value));return (int(r),int(g),int(b),round(a*255))
    return value
for i,frame in enumerate(frames):
    for key,width,height,left,top in [('main',256,384,0,20),('overview',112,168,266,90)]:
        panel=Image.new('RGBA',(width*scale,height*scale),'#d9e4de')
        for command in frame[key]:
            layer=Image.new('RGBA',panel.size);draw=ImageDraw.Draw(layer)
            points=[(x*scale,y*scale) for x,y in command['points']]
            if 'lineWidth' in command:draw.line(points,fill=color(command['color']),width=max(1,round(command['lineWidth']*scale)))
            else:draw.polygon(points,fill=color(command['color']))
            panel=Image.alpha_composite(panel,layer)
        result.paste(panel.convert('RGB'),((i*384+left)*scale,top*scale))
    draw=ImageDraw.Draw(result);draw.text(((i*384+10)*scale,3*scale),['North','East','South','West'][i],fill='#17382f')
result.resize((1536,420),Image.Resampling.LANCZOS).save(root/'four-view-review.png')
print('Rendered four Construct workspace and overview pairs from runtime drawing commands.')
