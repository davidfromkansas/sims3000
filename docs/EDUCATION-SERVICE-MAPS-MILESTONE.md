# Education service planning


## Education service planning checkpoint — milestones 4 and 5

School access (ages 0–14), College access (15–24), and Adult learning access (25+) now have separate city and navigation maps. The maps use the existing per-home road-connected capacity coverage; schools cannot mask college shortages, and library/museum capacity remains separate from youth teaching. Occupied homes show red-to-green service coverage. Nonresidential tiles and age groups with no current demand are gray. Operating/inactive facility markers identify the relevant schools, colleges, libraries and museums; these capacity services have no invented radial service rings.

Players can open the maps from Civic services, City data or City view layers, keeping their construction tool. Navigation retains City as its default. These maps show access to places, not attained EQ. Demand uses the current citywide age mix distributed across homes, so this does not claim neighborhood-specific demographics. The manual pp.112–114 describes separate education services and diagnostic views; the three named layers are an authored browser adaptation, not a recovered original map catalog.

This release also corrects civic and station inspections to count each multi-tile home/workplace once when any member is reached. Resident/job totals still include only reached members, matching simulation allocation. A lot whose origin is outside the catchment is still counted when its edge is reached.

Feedback exercise: provide schools to a neighborhood but leave colleges absent. Compare the separate maps, build a connected college, then compare the adult map and add a library or museum. Reduce education funding, observe coverage and facility markers, then restore it. Inspect a station beside a multi-tile building and assess whether building counts and partial service totals are understandable.

Validation: three new suites cover real construction and coverage, disconnected homes, funding/strikes, zero-age demand, exact navigation/city colors through all four renderer rotations, relevant facility markers, actual Civic/City data/City view handlers, partial larger-lot catchments, read-only behavior and save restoration. Schema remains 111; no simulation inputs or save fields change. Browser visual acceptance and player feedback remain pending. Not published to Sites; source-export approval remains pending.

Final release checkpoint: all 177 regression suites pass. Cache graph: education-service-maps-1. Save schema: 111.
