# Complete building-set import


## Complete building-set import checkpoint — milestone 5

City desk → Import building set reads an exported SIMS3000 city and previews all visible changes by source style and tile footprint, including the number of current buildings affected. Apply replaces both the custom-model library and style replacements together; omitted styles return to original artwork. Cancel leaves the city untouched, and Export current city as backup is available before applying. New growth uses the imported set too. The destination terrain, population, finances, scenario and simulation inputs stay intact; its existing save format already persists the two artwork maps (schema 111).

Manual printed pp.81–82 describes importing a saved city's complete Building Set into the current city and either accepting or cancelling. This implementation uses exported SIMS3000 city files, not original game binary files. It supports the currently implemented 14 RCI style families and footprint variants, not the original complete building catalog.

Two new regression suites verify atomic/deep-copy imports, complete resets, malformed-file rejection, legacy migration, save/monthly continuation and actual dialog handlers for preview, backup, cancellation, oversized files, stale asynchronous reads and one-time application. Full source regression count: 174. Browser layout and user acceptance remain unverified. Publication remains pending explicit Sites source-export approval; this checkpoint is not live.

Feedback exercise: customize two styles in one city and export it. In another city with its own model, import the first city's building set. Review the restored and imported styles, cancel once, reopen and apply, then save/load. Assess whether the preview makes the extent of the city makeover clear.
