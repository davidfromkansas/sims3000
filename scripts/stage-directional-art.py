"""Inspect Blender output and copy original PNGs into the static game assets."""
from pathlib import Path
import json, shutil, sys
from PIL import Image
root=Path(__file__).resolve().parents[1]
asset=sys.argv[1] if len(sys.argv)>1 else 'commercial-midrise'
assert asset in {'commercial-midrise','sawtooth-factory','courtyard-apartments'}
source=root/'art/architecture'/asset/'renders'
output=root/'dist/assets'/asset
frames={}
review=[]
for width in range(1,6):
 for height in range(1,6):
  key=f'{width}x{height}';bounds=[]
  for direction in range(4):
   path=source/key/f'view-{direction}.png'
   with Image.open(path) as im:
    assert im.mode=='RGBA' and im.size==(768,768),path
    alpha=im.getchannel('A');box=alpha.getbbox()
    assert box and box[0]>0 and box[1]>0 and box[2]<768 and box[3]<768,(path,box)
    assert alpha.getextrema()==(0,255),path
    bounds.append(box)
    review.append({'footprint':key,'view':direction,'size':list(im.size),'alphaBounds':list(box),'alphaExtrema':list(alpha.getextrema())})
  left=min(b[0] for b in bounds);top=min(b[1] for b in bounds)
  right=max(b[2] for b in bounds);bottom=max(b[3] for b in bounds)
  frames[key]={'x':left,'y':top,'w':right-left,'h':bottom-top}
# Copy only after every required view passes inspection.
output.mkdir(parents=True,exist_ok=True)
for key in frames:
 for direction in range(4):shutil.copyfile(source/key/f'view-{direction}.png',output/f'{key}-view-{direction}.png')
module,constant={'commercial-midrise':('commercial-art-frames.js','COMMERCIAL_ART_FRAMES'),'sawtooth-factory':('factory-art-frames.js','FACTORY_ART_FRAMES'),'courtyard-apartments':('courtyard-art-frames.js','COURTYARD_ART_FRAMES')}[asset]
(root/'dist'/module).write_text('// Generated from inspected original renders by scripts/stage-directional-art.py.\nexport const '+constant+'='+json.dumps(frames,separators=(',',':'))+';\n')
(source.parent/'alpha-review.json').write_text(json.dumps(review,indent=2)+'\n')
print('PASS: inspected and staged 100 transparent building views across 25 footprints')
