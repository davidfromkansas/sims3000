import bpy, math, os, sys
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
width,depth=map(int,args[:2]) if args else (1,1)
assert 1<=width<=5 and 1<=depth<=5
W,D=4.9*width-.9,4.9*depth-.9
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'renders',f'{width}x{depth}');os.makedirs(out,exist_ok=True)
def material(name,color,metal=0,rough=.5):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 return m
stone=material('Warm limestone',(.64,.57,.44),0,.72);trim=material('Cut stone edges',(.77,.7,.56),0,.58)
glass=material('Bronze glazing',(.075,.105,.115),.68,.19);bronze=material('Bronze mullions',(.29,.21,.105),.72,.3)
roof=material('Roof membrane',(.23,.25,.24),0,.85);metal=material('Mechanical zinc',(.38,.43,.43),.65,.43)
dark=material('Vent recess',(.07,.085,.08),.2,.8);leaf=material('Planting',(.13,.24,.085),0,.83);soil=material('Planter soil',(.12,.085,.045),0,.95)
root=bpy.data.objects.new('Commercial mid-rise',None);bpy.context.collection.objects.link(root)
def box(name,loc,scale,mat,bevel=.015):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat);o.parent=root
 if bevel:
  mod=o.modifiers.new('Soft masonry edges','BEVEL');mod.width=bevel;mod.segments=2
  o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
box('Square sidewalk',(0,0,.07),(4.9*width,4.9*depth,.14),trim,.03)
box('Six-story core',(0,0,2.73),(W,D,5.2),stone,.025)
for floor in range(6):
 z=.19+floor*.86
 for face in range(4):
  angle=face*math.pi/2
  def facebox(name,x,depth,zz,sx,sy,sz,mat,b=.006):
   loc=(x*math.cos(angle)-depth*math.sin(angle),x*math.sin(angle)+depth*math.cos(angle),zz)
   o=box(name,loc,(sx,sy,sz),mat,b);o.rotation_euler.z=angle;return o
  span,normal=(W,D) if face%2==0 else (D,W)
  bays=4*(width if face%2==0 else depth);spacing=span/bays;pane=spacing-.22
  for bay in range(bays):
   x=-span/2+spacing*(bay+.5)
   facebox('Inset glazing',x,-normal/2-.007,z+.4,pane,.025,.63,glass)
   for dx in [-pane/2,0,pane/2]:facebox('Window mullion',x+dx,-normal/2-.035,z+.4,.025,.025,.66,bronze)
   facebox('Window sill',x,-normal/2-.035,z+.075,pane+.06,.07,.035,trim)
  facebox('Continuous floor band',0,-normal/2-.028,z+.79,span+.08,.09,.13,trim,.009)
for x in [-W/2,W/2]:
 for y in [-D/2,D/2]:box('Corner pier',(x,y,2.72),(.16,.16,5.2),trim)
box('Roof deck',(0,0,5.36),(W+.12,D+.12,.14),roof)
for x in [-W/2-.05,W/2+.05]:box('Roof parapet',(x,0,5.55),(.14,D+.2,.36),trim)
for y in [-D/2-.05,D/2+.05]:box('Roof parapet',(0,y,5.55),(W+.2,.14,.36),trim)
box('Mechanical enclosure',(.5,.6,5.7),(1.5,1.35,.58),stone)
for j in range(9):box('Louver',(.5,.6-.69,5.48+j*.055),(1.38,.035,.023),bronze,0)
for x,y in [(-1.2,.9),(-1.1,-.8),(.55,-.9)]:
 box('Vent unit',(x,y,5.62),(.55,.55,.4),metal)
 box('Vent grille',(x,y,5.83),(.43,.43,.025),dark,0)
 for k in range(7):box('Grille slat',(x-.19+k*.064,y,5.849),(.025,.42,.01),metal,0)
if width*depth>1:
 for gx in range(width):
  for gy in range(depth):
   xx=-W/2+(gx+.5)*W/width;yy=-D/2+(gy+.5)*D/depth
   if abs(xx)<2 and abs(yy)<2:continue
   box('Distributed rooftop plant',(xx,yy,5.6),(.9,.7,.36),metal)
   box('Distributed plant grille',(xx,yy,5.79),(.76,.57,.02),dark,0)
box('Entrance doors' ,(0,-D/2-.065,.61),(.7,.055,.93),glass)
for x in [-.37,0,.37]:box('Door frame',(x,-D/2-.1,.61),(.035,.035,.95),bronze)
box('Entrance canopy',(0,-D/2-.28,1.28),(1.2,.65,.09),bronze,.018)
for x in [-.52,.52]:box('Canopy support',(x,-D/2-.43,.71),(.04,.04,1.1),bronze,.006)
for x in [-W/2+.55,W/2-.55]:
 box('Entrance planter',(x,-D/2-.26,.28),(.8,.33,.3),stone)
 box('Planter soil',(x,-D/2-.26,.435),(.71,.26,.015),soil,0)
 for j in range(5):
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=.13,location=(x-.28+j*.14,-D/2-.26,.53+(j%2)*.04));o=bpy.context.object;o.data.materials.append(leaf);o.parent=root
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=768;scene.render.resolution_y=768;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.65,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.55
bpy.ops.object.camera_add(location=(10,-10,10.865));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,2.7))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=max(8.6,(4.9*width+4.9*depth)/math.sqrt(2)*1.1);scene.camera=camera
for name,loc,energy,size,color in [('Key',(-5,-6,11),1700,7,(1,.9,.75)),('Fill',(6,1,8),1000,6,(.72,.84,1))]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,0,2.5))-o.location).to_track_quat('-Z','Y').to_euler()
root.rotation_euler.z=0
if width==1 and depth==1:bpy.ops.wm.save_as_mainfile(filepath=out+'/commercial-midrise.blend',compress=True)
for direction in range(4):
 root.rotation_euler.z=-direction*math.pi/2;scene.render.filepath=out+'/view-'+str(direction)+'.png';bpy.ops.render.render(write_still=True)
print('PASS: rendered four consistent views to '+out)
