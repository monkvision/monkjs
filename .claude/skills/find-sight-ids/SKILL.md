# Find Sight IDs

Resolve human-readable sight names to sight IDs (or IDs back to names) using the pure lookup
functions in `packages/sights/src/lib/sightLookup.ts`. Use this whenever a client gives a list
of sight names for a vehicle and wants the corresponding sight ID array — typically to build or
replace the `sights.<vehicleType>` array in a capture app config (see
`apps/demo-app/src/local-config.json`) — or the reverse: given an existing array of sight IDs,
get back their readable names.

**No sight ID is ever changed by this skill.** It only reads `@monkvision/sights` data.

## When to use

Call `/find-sight-ids` when:
- A client sends an ordered list of sight names for a vehicle and you need the matching sight
  ID array (e.g. to replace an existing `sights.<vehicleType>` list wholesale).
- You need to review what an existing `sights.<vehicleType>` ID array actually contains, in
  human-readable form.

## Inputs needed from the user

1. **The vehicle.** Sights are keyed by `VehicleModel` (e.g. `haccord`, `fesc20`, `teslam3`),
   not by the broader `VehicleType` (e.g. `sedan`, `cuv`) — several models can share a
   `VehicleType`. Check which model the client's app config already uses for that vehicle type
   before asking the user:
   ```bash
   grep -A 20 '"sights"' apps/demo-app/src/local-config.json
   ```
   Every ID under a given `VehicleType` key uses one single model prefix (e.g. all `"sedan"`
   entries are `haccord-*`). If the app/config in question isn't `demo-app`, look at that app's
   own config file the same way. If no existing config gives you the model, ask the user which
   `VehicleModel` to use — do not guess when a `VehicleType` maps to more than one model (see
   `packages/sights/research/data/vehicles.json`).

2. **The ordered list of sight names** (labels → IDs direction), or **the list of sight IDs**
   (IDs → labels direction).

## Steps

1. From `packages/sights`, run a short one-off script (e.g. `ts-node` or a scratch Jest test)
   importing the lookup functions directly from source so the result is always up to date with
   the latest sight data:

   ```typescript
   import { VehicleModel } from '@monkvision/types';
   import { resolveSightIdsFromNames, resolveNamesFromSightIds } from './src/lib/sightLookup';

   // Names -> IDs
   console.log(
     JSON.stringify(
       resolveSightIdsFromNames(
         ['Front low', 'Hood', 'Front lateral low left', /* ... */],
         VehicleModel.HACCORD,
       ),
       null,
       2,
     ),
   );

   // IDs -> names
   console.log(JSON.stringify(resolveNamesFromSightIds(['haccord-8YjMcu0D', /* ... */]), null, 2));
   ```

   The quickest way to run this without leaving artifacts: `npx ts-node -e "..."` from
   `packages/sights`, or a temporary `.ts` file deleted after use. Do not commit throwaway
   scripts.

2. **Interpret the structured result** — never silently pick an answer for the user:
   - `error: 'unknown-label'` — the name didn't match any label dictionary key even after
     normalization (lower-case, trim, spaces → hyphens). Show the user the closest labels you
     can find (e.g. `grep` the label key substring in
     `packages/sights/research/data/labels.json`) and ask them to confirm the exact name.
   - `error: 'no-sight-for-vehicle'` — the label exists, but no sight uses it for the requested
     vehicle model. Confirm the vehicle model is correct, or tell the user this sight doesn't
     exist for that vehicle.
   - `ambiguous: true` — more than one sight ID shares this label for the vehicle (e.g. a
     standard sight and a dev/wheel-close-up variant). Show the user all candidate IDs (check
     `packages/sights/research/data/<vehicle>/<vehicle>.json` for each ID's `tasks`/`dev`/
     `wheel_name` fields to help them pick) and ask which one they want, rather than guessing.
   - Otherwise, take `sightIds[0]` (or the single entry) in the same order as the input list.

3. **Produce the final ordered ID array** (or name array) once every input has been resolved
   unambiguously, ready to paste into the target config's `sights.<vehicleType>` array.

## Caveats

- Some labels are used by multiple sight IDs — both across different vehicle models (expected;
  a label is a shared translation key, not a unique ID) and, less commonly, *within* the same
  vehicle model (e.g. a close-up wheel variant sharing a label with the standard shot). The
  lookup functions always return every match rather than guessing — resolve these with the user
  per step 2.
- A separate, distinct data-quality issue exists where the `all` vehicle's
  `dashboard-from-back-seat` label (and a few similar `all-*` groups) has 4+ sight IDs with no
  distinguishing field at all (no `dev` flag, no `wheel_name`). That is a research-data cleanup
  task, out of scope for this skill — flag it to the user rather than trying to fix it here.
