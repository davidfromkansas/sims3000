# Preserve completed scenario results

## Player-visible change

Completed challenges now retain the goal titles, instructions, values, area references and completion states from their ending month. Later building, borrowing or simulated growth cannot rewrite the displayed evidence. This fixes a won repayment challenge changing from six completed goals to five after the player spent its cash. Both victory and loss are preserved; scripted victories can truthfully retain unfinished optional goals.

The status window identifies recorded results. Old saves without recorded goal evidence retain their won/lost outcome and explicitly label the displayed values as current city conditions. Their compact status uses “Archived result” instead of a misleading current goal count. Restart creates a fresh challenge.

## Feedback exercise

Finish The first repayment and review its six goals. Close the result, continue building or borrowing, and reopen Scenarios & status. The ending evidence should remain unchanged. Export/reload the city and check again. Restart the challenge to verify that it begins a fresh attempt. This supports the manual’s scenario-status and ending flow without changing win conditions.

## Verification

246 suites passed in aggregate: the full run passed 245, then the legacy-rank save fixture was corrected to omit the new field and passed. Scripted-ending coverage was also rerun with explicit assertions for incomplete optional goals and cleared restart evidence. New tests cover post-win construction, post-loss recovery, further months, saved restoration, detached result reads, old-save handling and bounded text/area validation.

Browser QA verified the legacy explanation, won a fresh twelve-month repayment challenge, and recorded all six goals. Post-result borrowing and restored inspection were checked separately. The normal player city was untouched.

## Format and scope

Save schema126 adds optional validated result goals; schema125 and earlier cities remain readable. No historical evidence is invented for old saves. This is a browser-game result record, not original SimCity binary-file compatibility or an authenticated achievement system. It preserves the current attempt only; selecting Continue as sandbox still clears the active scenario as before. GitHub/local delivery only while Sites source-export approval is pending.
