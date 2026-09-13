# Scenario script cut, copy and paste

Scenario creators can copy or cut an action, subroutine call, or complete If/Else branch. Paste before step and Paste at end insert independent copies into any routine or nested action block. The editor shows its current copied step and provides Clear copied step. The clipboard is local to the open editor; it does not access the system clipboard or persist when the editor closes.

This implements the script-line editing workflow on manual page 175, adapted to structured steps. Copied conditions, messages, branches, goal rows and variable references remain intact. Clipboard subroutine calls protect their targets from deletion, and references are renumbered when earlier routines are removed. Pasting rejects the existing 128-instruction and eight-level limits before changing the draft. Existing validation still rejects recursive programs when applying a challenge.

Browser testing also found and fixed a pre-existing message-field rendering failure: textarea.type is read-only, but the field helper tried to assign it. Adding an announcement could therefore leave the routine editor partially rendered. Textareas now keep their native type, and test DOMs model that browser restriction.

## Feedback checkpoint 8

Create a challenge from a city, add a routine and an announcement. Enter a message, Copy step and Paste at end. Change the pasted message and confirm the first stays unchanged. Try moving a complete If/Else branch into another routine with Cut step. Copied logic takes effect when the challenge is started; editing remains a draft.

## Verification

All 228 suites passed before the final textarea correction; both affected scenario-editor suites passed after it, including additional depth-limit coverage. Tests include independent deep copies, cross-routine movement, insertion order, protected and remapped call references, atomic limit rejection and real execution of copied variable actions.

Local browser verified complete message-action rendering, copied announcement text, and independent editing of the pasted message. No browser errors or warnings. The test authoring draft was closed without starting a challenge or modifying the saved city.

Source milestone only. Hosted publication remains pending the existing Sites export approval. No save format change. Local preview serves this milestone.
