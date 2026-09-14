"""Compatibility entry point for staging the commercial building renders."""
from pathlib import Path
import runpy, sys
sys.argv=[str(Path(__file__).with_name('stage-directional-art.py')),'commercial-midrise']
runpy.run_path(sys.argv[0],run_name='__main__')
