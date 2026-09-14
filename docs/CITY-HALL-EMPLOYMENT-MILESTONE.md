# City Hall employment milestone

Players can now use City Hall as a workplace: an operating hall provides 36 jobs, filled through the same finite worker pool and road, bus and rail routes as private businesses. Transport reports show filled civic positions; tile inspection and historical reports expose civic employment. Residential demand includes the additional capacity.

Capacity is counted once per building. Power loss or a failed operating condition removes its jobs; disconnected homes cannot fill them. Stations and nearby roads are evaluated against the whole three-by-three footprint.

The original 36-job value is documented in the SimCity 3000 Unlimited Prima Guide, Reward Structure Directory, City Hall entry (p.409): https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide. The manual discusses rewards on pp.56 and 124. Routing and operating rules remain this reconstruction’s modeled systems. This does not add all original City Hall crime, pollution or residential-cap effects.

Validation: 236 regression suites passed across the full run and targeted reruns after updating two frozen-router comparisons to recognize zero civic employment in their legacy fixtures. New coverage checks finite capacity, nine-tile accounting, shared bus use, power loss, save/load, reports, and a rail-only neighborhood served by a station near the far side of the hall. Browser QA imported an authored isolated test city and verified 36 / 36 operating positions filled in Transport & commuting. The ordinary local city was preserved. Worker counts display one decimal to avoid floating-point noise.

Feedback checkpoint: connect a residential neighborhood to an operating City Hall, inspect civic employment, then compare transport access. The fixture grants the reward for testing; it is not evidence of a browser playthrough to the normal population unlock.

Save schema remains 123. Local preview and GitHub delivery only; production publication remains blocked pending explicit approval to export source to the existing Sites repository.
