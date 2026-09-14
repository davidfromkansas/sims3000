# Sawtooth factory — architecture collection draft

Original brick industrial workshop with north-light sawtooth roofs, glazed roof panels, framed workshop windows, loading doors, safety bollards and an asymmetric chimney. Geometry is authored in Blender without external models or textures. The number of roof bays and facade bays scales with the lot while physical heights remain constant.

`render.py` accepts width and depth from 1 through 5 after Blender’s `--` separator. It writes four transparent 768×768 views into `renders/WxH/`, rotating the model by negative quarter-turns with fixed camera and lighting. The 1×1 run saves an editable Blender file.

Production staging uses `scripts/stage-directional-art.py sawtooth-factory`, which requires every supported footprint and view to pass transparency and unclipped-boundary checks. All 100 views across 25 footprints passed staging checks. The current architecture worktree integrates them as style 79, including mixed low-rise industry on larger lots. A browser fixture was inspected through all four camera directions with no recorded runtime errors. The broader architecture milestone remains unreleased.

Five-tile generation and staging are complete: 100 views cover all 25 footprints. The expanded mixed office/factory browser fixture has been reviewed from North, East and South. Its West-facing check remains pending because the Mac is locked; the earlier complete rotation review covers footprints up to 4×4.
