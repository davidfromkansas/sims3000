# Scenario result messages and browser playthrough

Scripted victory and loss messages now appear prominently on the result screen, before goals and history. Previously, a routine ending’s authored message could be found only inside collapsed routine history. The result uses the captured ending receipt, preserving its original text and substituted values across later city changes and reloads. Content is escaped and line breaks preserved. Restart clears the completed result.

## Feedback checkpoint 8

Create a routine containing a popup followed by End scenario. Choose script-controlled completion and schedule the routine. Run until the popup, reload, acknowledge it, and resume. Verify the authored ending message on the result screen. Reload again, then restart the challenge.

## Complete browser acceptance exercise

Used a separate local origin to avoid touching the user's saved city. Authored the entire challenge through the UI on the starter town: script-controlled completion, a routine with “Council checkpoint. Acknowledge to finish this test.” followed by victory text “The council has completed its review.”, scheduled in month 1.

The popup appeared in month 1 and survived reload. After acknowledgement and resuming, the routine ended the challenge in month 2. The custom ending message was initially absent from the main status view, which motivated this fix. After the fix and another reload, the saved victory and custom message appeared at the top of the result screen. Restart returned the challenge to playing. No browser errors or warnings. Temporary QA server was stopped; the regular local preview remains running.

## Regression evidence

All 229 suites passed. New tests cover both direct ending events and routine endings, victory and loss, captured values after city changes, city save/load, escaped multiline text, restart reset and result-screen placement. This is one complete browser-authored scenario flow, not blanket acceptance of every editor command or browser.

Source milestone only; hosted publication remains pending the existing Sites export approval. No save format change.
