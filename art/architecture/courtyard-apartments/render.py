"""Original brick factory with north-light roof bays; no external assets."""
import bpy, math, os, sys
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
width,depth=map(int,args[:2]) if args else (1,1)
assert 1<=width<=5 and 1<=depth<=5
W,D=4.9*width-.8,4.9*depth-.8
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'renders',f'{width}x{depth}');os.makedirs(out,exist_ok=True)
def material(name,color,metal=0,rough=.6):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 return m
brick=material('Terracotta masonry',(.52,.22,.13));stone=material('Limestone trim',(.74,.67,.51));glass=material('Blue green glazing',(.12,.25,.27),.45,.24);roof=material('Roof membrane',(.17,.2,.18));metal=material('Balcony railings',(.13,.18,.17),.45);paving=material('Courtyard paving',(.46,.43,.35));grass=material('Garden green',(.18,.33,.12));wood=material('Bench timber',(.35,.19,.08));dark=material('Entrance shadow',(.06,.09,.08))
root=bpy.data.objects.new('Courtyard apartments',None);bpy.context.collection.objects.link(root)
def box(name,loc,size,mat):
 x,y,z=loc;a,b,c=[n/2 for n in size]
 vertices=[(dx*a,dy*b,dz*c) for dx,dy,dz in [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);mesh.update()
 o=bpy.data.objects.new(name,mesh);o.location=loc;bpy.context.collection.objects.link(o);o.data.materials.append(mat);o.parent=root;return o
H=3.65;wing=1.05
box('Stone perimeter',(0,0,.065),(4.9*width,4.9*depth,.13),paving)
box('Courtyard garden',(0,0,.15),(W-2*wing-.22,D-2*wing-.22,.08),grass)
box('Entry path',(0,-D/4,.2),(.65,D/2,.06),stone)
# Four wings enclose a genuine open-air court. The front passage opens below its bridge.
box('West residential wing',(-W/2+wing/2,0,H/2+.16),(wing,D,H),brick)
box('East residential wing',(W/2-wing/2,0,H/2+.16),(wing,D,H),brick)
box('Rear residential wing',(0,D/2-wing/2,H/2+.16),(W-2*wing,wing,H),brick)
front=D/-2+wing/2;gate=.8
for sign in [-1,1]:box('Front gateway pier',(sign*(W/2+gate/2)/2,front,H/2+.16),(W/2-gate/2,wing,H),brick)
box('Apartments above passage',(0,front,(H+1.15)/2+.16),(gate,wing,H-1.15),brick)
# Flat roofs and raised copings follow the perimeter, leaving the courtyard uncovered.
for x,y,sx,sy in [(-W/2+wing/2,0,wing,D),(W/2-wing/2,0,wing,D),(0,D/2-wing/2,W-2*wing,wing),(0,front,W-2*wing,wing)]:
 box('Roof deck',(x,y,H+.2),(sx,sy,.12),roof)
 for dx,dy,ax,ay in [(0,-sy/2,sx,.085),(0,sy/2,sx,.085),(-sx/2,0,.085,sy),(sx/2,0,.085,sy)]:box('Stone roof coping',(x+dx,y+dy,H+.32),(ax,ay,.12),stone)
# Outer facades use repeated apartment bays; physical floor height stays constant.
for face in range(4):
 angle=face*math.pi/2;span,normal=(W,D) if face%2==0 else (D,W)
 def panel(name,x,z,sx,sz,mat,offset=.025,thick=.04):
  y=-normal/2-offset;o=box(name,(x*math.cos(angle)-y*math.sin(angle),x*math.sin(angle)+y*math.cos(angle),z),(sx,thick,sz),mat);o.rotation_euler.z=angle;return o
 bays=max(2,round(span/1.2))
 for floor in range(4):
  z=.64+floor*.86
  for bay in range(bays):
   x=-span/2+(bay+.5)*span/bays
   if face==0 and floor==0 and abs(x)<.65:continue
   panel('Apartment window surround',x,z,.65,.66,stone,.035)
   panel('Apartment glass',x,z,.53,.53,glass,.065)
   panel('Window center mullion',x,z,.027,.54,stone,.09)
   panel('Window sill',x,z-.35,.74,.055,stone,.12,.18)
   if floor in [1,2] and bay%3==0:
    panel('Balcony slab',x,z-.39,.85,.065,stone,.24,.42)
    panel('Balcony top rail',x,z-.04,.81,.035,metal,.44)
    for dx in [-.37,-.18,0,.18,.37]:panel('Balcony baluster',x+dx,z-.22,.025,.36,metal,.44)
  if not(face==0 and floor==0):panel('Floor band',0,z+.42,span,.055,stone,.04)
# Windows facing into the courtyard make the rear views coherent as well.
for sign in [-1,1]:
 for floor in range(4):
  for i in range(max(1,round((D-2*wing)/1.1))):
   y=-D/2+wing+(i+.5)*(D-2*wing)/max(1,round((D-2*wing)/1.1))
   box('Courtyard side window',(sign*(W/2-wing-.025),y,.65+floor*.86),(.05,.5,.54),glass)
for floor in range(4):
 for i in range(max(1,round((W-2*wing)/1.1))):
  x=-W/2+wing+(i+.5)*(W-2*wing)/max(1,round((W-2*wing)/1.1))
  box('Courtyard rear window',(x,D/2-wing-.025,.65+floor*.86),(.5,.05,.54),glass)
# Low planting beds and benches sit inside the court, away from the entrance path.
for sign in [-1,1]:
 x=sign*(W-2*wing)*.32
 box('Garden planter',(x,0,.27),(.4,max(.5,(D-2*wing)*.45),.2),stone)
 box('Planter foliage',(x,0,.4),(.32,max(.4,(D-2*wing)*.42),.16),grass)
 box('Bench seat',(x,D/2-wing-.4,.38),(.55,.2,.07),wood)
for x in [-.49,.49]:box('Gateway stone jamb',(x,-D/2-.03,.72),(.14,.14,1.12),stone)
box('Gateway lintel',(0,-D/2-.04,1.31),(1.12,.16,.18),stone)
box('Roof stair enclosure',(-W/2+wing/2,D/2-wing/2,H+.57),(.7,.7,.55),brick)
box('Stair roof cap',(-W/2+wing/2,D/2-wing/2,H+.88),(.8,.8,.09),stone)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=768;scene.render.resolution_y=768;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.65,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.55
bpy.ops.object.camera_add(location=(10,-10,10.865));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,2.7))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=max(8.6,(4.9*width+4.9*depth)/math.sqrt(2)*1.1);scene.camera=camera
for loc,energy,size,color in [((-5,-6,11),1700,7,(1,.9,.75)),((6,1,8),1000,6,(.72,.84,1))]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
if width==1 and depth==1:bpy.ops.wm.save_as_mainfile(filepath=out+'/courtyard-apartments.blend',compress=True)
for direction in range(4):
 root.rotation_euler.z=-direction*math.pi/2;scene.render.filepath=out+'/view-'+str(direction)+'.png';bpy.ops.render.render(write_still=True)
print('PASS: rendered four courtyard apartment views to '+out)
