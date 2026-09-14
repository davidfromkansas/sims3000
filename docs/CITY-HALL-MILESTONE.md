# City Hall reward

## Player capability
City Hall becomes available after a simulation month with at least 20,000 residents and 50 approval. Its earned offer is permanent. Place one free 3 × 3 hall on level land, connect power and roads for its local amenity benefit, and rebuild after demolition or destruction. The reward gallery previews its original limestone building, colonnade, clock tower, flags and gardens from four views. Scenario reward offers can also grant it through the existing reward mechanism.

## Sources and fidelity
The supplied manual (pp.56 and 124) describes earned rewards, notification and deferred placement. The official Prima guide's Reward Structure Directory (printed p.409), available at https://www.scribd.com/doc/303581554/SimCity-3000-Unlimited-Prima-Guide, identifies City Hall as a free 3 × 3 reward at 20,000 residents. Those three values guide this addition.

Our 50/100 approval requirement, one-month check, zero recurring upkeep and local amenity of 25 fading over ten tiles are reconstruction calibration. The original guide uses a different aura scale and lists additional demand-cap, employment, crime and pollution effects that are not implemented by this addition. The model is original procedural artwork, not a copied original asset. Four rewards are now available; the full catalog remains incomplete.

## Feedback checkpoint
1. Open City desk → Rewards and rotate the City Hall preview.
2. Grow to 20,000 residents while maintaining 50 approval and run a month to earn the offer.
3. Place the hall near a neighborhood and connect power and roads.
4. Export/reload the city, or demolish and rebuild the hall; the offer remains unlocked.

## Validation
The full run passed 234 suites; one preview fixture assumed exactly three rewards and passed after being updated for the expanded catalog (235 suites total). Coverage verifies unlock boundaries and idempotence, permanent offers, free unique placement, footprint demolition and rebuilding, connected operation, save continuity and old-version rejection of City Hall data. Existing reward rendering tests now cover four models in sixteen bounded distinct views and once-per-footprint city rendering.

Browser review verified an older starter save opening successfully, the City Hall requirement and locked placement state, plus the original preview and rotation. No browser errors or warnings; the user's city was not advanced or saved. A complete 20,000-resident browser playthrough remains unverified.

Save schema 123 migrates older reward records with City Hall unearned. Version-123 records require its history fields. GitHub/local-preview milestone only; Sites publication awaits explicit source-export authorization.

Follow-up: `CITY-HALL-EMPLOYMENT-MILESTONE.md` implements the 36-job employment effect. Other omitted original effects remain pending.
