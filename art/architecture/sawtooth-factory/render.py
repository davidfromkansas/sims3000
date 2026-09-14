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
brick=material('Fired red brick',(.38,.12,.065));mortar=material('Brick courses',(.53,.3,.18));stone=material('Concrete lintels',(.5,.46,.37));roof=material('Weathered zinc',(.19,.25,.24),.55);glass=material('North-light glazing',(.12,.3,.32),.6,.2);steel=material('Painted doors',(.2,.27,.26),.35);dark=material('Vent recess',(.045,.05,.047));yellow=material('Loading safety paint',(.73,.49,.08));paving=material('Factory paving',(.29,.3,.27))
root=bpy.data.objects.new('Sawtooth factory',None);bpy.context.collection.objects.link(root)
def box(name,loc,scale,mat,bevel=.01):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat);o.parent=root
 if bevel:
  mod=o.modifiers.new('Edge light','BEVEL');mod.width=bevel;mod.segments=2;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def prism(name,vertices,faces,mat):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);o.data.materials.append(mat);o.parent=root;return o
box('Paved lot',(0,0,.065),(4.9*width,4.9*depth,.13),paving)
box('Brick workshop',(0,0,1.0),(W,D,1.74),brick)
for face in range(4):
 angle=face*math.pi/2;span,normal=(W,D) if face%2==0 else (D,W)
 def panel(name,x,z,sx,sz,mat,offset=.025,thick=.035):
  y=-normal/2-offset;o=box(name,(x*math.cos(angle)-y*math.sin(angle),x*math.sin(angle)+y*math.cos(angle),z),(sx,thick,sz),mat);o.rotation_euler.z=angle;return o
 for course in range(1,12):panel('Horizontal mortar',0,.18+course*.14,span,.014,mortar,.008,.008)
 bays=width*2 if face%2==0 else depth*2
 for bay in range(bays):
  x=-span/2+(bay+.5)*span/bays
  panel('Brick pilaster',x-span/bays*.46,1.03,.13,1.8,brick,.065,.15)
  if face==0 and bay%2==0:
   panel('Loading bay',x,.8,span/bays*.65,1.25,steel,.04)
   for j in range(8):panel('Roller door slat',x,.24+j*.145,span/bays*.62,.025,stone,.065,.015)
   for dx in [-span/bays*.37,span/bays*.37]:panel('Loading guard',x+dx,.36,.075,.42,yellow,.18,.075)
  else:
   panel('Workshop window',x,1.13,span/bays*.65,.72,glass,.03)
   panel('Window transom',x,1.13,span/bays*.67,.035,steel,.06)
   for dx in [-1,0,1]:panel('Window mullion',x+dx*span/bays*.32,1.13,.035,.75,steel,.06)
  panel('Stone lintel',x,1.59,span/bays*.76,.1,stone,.075,.13)
 panel('Roof cornice',0,1.9,span+.1,.15,stone,.025,.13)
# Each roof bay has one long opaque slope and a steep glazed north-light face.
bays=2*depth;pitch=D/bays;low,high=1.97,2.62
for bay in range(bays):
 y0=-D/2+bay*pitch;y1=y0+pitch*.74;y2=y0+pitch
 verts=[(-W/2,y0,low),(W/2,y0,low),(-W/2,y1,high),(W/2,y1,high),(-W/2,y2,low),(W/2,y2,low)]
 prism('Zinc roof slope',verts,[(0,1,3,2)],roof);prism('North-light roof glass',verts,[(2,3,5,4)],glass);prism('Brick roof gables',verts,[(0,2,4),(1,5,3)],brick)
 for x in [-W/2+i*W/(3*width) for i in range(3*width+1)]:
  length=math.hypot(y2-y1,high-low);o=box('Roof glazing rib',(x,(y1+y2)/2,(high+low)/2),(.045,length,.035),steel,0);o.rotation_euler.x=-math.atan2(high-low,y2-y1)
 box('Roof ridge',(0,y1,high+.015),(W+.08,.07,.06),stone)
# Asymmetric service equipment makes the four orientations easy to distinguish.
cx,cy=W/2-.44,D/2-.43
box('Chimney base',(cx,cy,1.75),(.65,.65,3.25),brick)
box('Chimney rim',(cx,cy,3.41),(.77,.77,.16),stone)
box('Chimney opening',(cx,cy,3.497),(.5,.5,.012),dark,0)
box('Entrance canopy',(-W/2+.55,-D/2-.22,1.68),(.85,.48,.07),steel)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=768;scene.render.resolution_y=768;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.65,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.55
bpy.ops.object.camera_add(location=(10,-10,10.865));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,2.7))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=max(8.6,(4.9*width+4.9*depth)/math.sqrt(2)*1.1);scene.camera=camera
for loc,energy,size,color in [((-5,-6,11),1700,7,(1,.9,.75)),((6,1,8),1000,6,(.72,.84,1))]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,0,2))-o.location).to_track_quat('-Z','Y').to_euler()
if width==1 and depth==1:bpy.ops.wm.save_as_mainfile(filepath=out+'/sawtooth-factory.blend',compress=True)
for direction in range(4):
 root.rotation_euler.z=-direction*math.pi/2;scene.render.filepath=out+'/view-'+str(direction)+'.png';bpy.ops.render.render(write_still=True)
print('PASS: rendered four factory views to '+out)
