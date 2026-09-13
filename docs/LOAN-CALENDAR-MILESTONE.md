# Loan repayment planning

The Budget panel now shows a collapsible repayment calendar beside the loan principal selector. It separates existing commitments from the selected new loan, groups payment dates by calendar year and identifies the largest combined payment date. Changing the principal changes only the preview. When ten loans are outstanding, the calendar excludes a new loan and explains why.

The manual specifies up to ten loans, §5,000 increments through §25,000, ten annual payments, no early payoff and total repayment of 150% (p.91). The existing engine and this schedule place payments on issue-month anniversaries; the manual does not expose a more precise calendar rule. This report displays contractual payments, not a forecast of treasury or operating performance. No save schema or settlement-rule changes.

All 223 suites passed. The new schedule test compares every dated obligation against 120 months of actual staggered loan settlement, including a mid-contract save/load, total repayment and maturity. It also verifies read-only planning, loan-limit display, invalid principal rejection and empty schedules. A separate ten-loan acceptance exercise borrowed §150,000, paid §22,500 annually for ten years (§225,000 total), cleared all contracts, and allowed a new loan afterward.

Browser QA selected §25,000 without borrowing, verified §37,500 total across ten §3,750 payments from Jan 1951 through Jan 1960, expanded the dated breakdown and found no console errors. No city funds or loans changed.

Feedback checkpoint: in Budget, compare existing commitments with a proposed loan and check whether the busiest payment dates fit your development plan.

Source only; Sites publication remains pending explicit export authorization. The local preview remains available.
