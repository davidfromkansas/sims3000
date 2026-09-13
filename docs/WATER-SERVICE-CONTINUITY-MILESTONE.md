# Established water-service continuity milestone

A developed RCI building that has received water now retains that service history. Losing supply remains a failure when it shrinks to level one, and four consecutive failed monthly checks at level one abandon the building. Restoring water before the threshold resets stress; restoring it after abandonment allows reoccupation when the other growth requirements are met. Query warns when established service is interrupted.

Manual page 116 says zones without water cannot reach full development and that developed zones cut off for too long lose their occupants. Previously a building could shrink to level one and remain indefinitely without restoring its former service. New low-density districts can still start dry; empty watered zoning does not establish building service.

## Rules and saved state

Each RCI tile records `waterEstablished` once occupied and supplied at a monthly update, including newly developed buildings. Development above level one also establishes the requirement because it necessarily relied on water. A multi-tile lot shares lifecycle changes: an interrupted member can cause the whole building to shrink or abandon. The flag survives abandonment and loading, and is cleared when the building is removed. Existing combined service stress, four-month shrink timing, growth demand and land-value rules remain calibrated reconstruction behavior.

Save schema 119 preserves the history. Versions 117 and 118 are explicitly accepted, correcting a version-list omission. Older saves infer established service for development above level one; previously watered low-level buildings cannot recover unrecorded history and establish it on the next supplied monthly update. Current-schema files require a boolean field.

## Feedback exercise

Start with a low-density home, supply it from a powered water tower and pipe, then advance a month. Remove its pipe supply and run three months. Inspect the interruption warning. Repairing now preserves occupation; leaving it dry for another month abandons it. Save and reload during the interruption to verify continuation, then restore the pipes and allow recovery.

## Validation and availability

196 regression suites pass. Dedicated tests cover dry starts, occupied service history, empty zoning, four-month failure, repairs, saved interruptions, reoccupation, demolition, strict current saves and versions 117/118. Multi-tile lifecycle coverage now includes whole-building water abandonment. Browser playtesting remains pending while the Mac is locked. This is a source milestone; Sites publication awaits explicit source-export approval.
