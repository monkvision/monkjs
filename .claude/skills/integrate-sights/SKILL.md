# Integrate Sights

Merge a set of new sights into an existing ordered sight list (typically a
`sights.<vehicleType>` array in a capture app config), placing each new sight where it makes
the most sense in the vehicle walkaround/interior sequence rather than blindly appending.

The new sights can be given as **sight IDs** or as **human-readable labels**. When they are
labels, resolve them to IDs first with the `/find-sight-ids` skill — this skill is designed to
be chained after it.

**No sight ID is ever changed by this skill.** It only reads `@monkvision/sights` data and
produces a re-ordered ID array for the user to paste into their config.

## When to use

Call `/integrate-sights` when:
- The user has an existing ordered sight list (e.g. the current `sights.<vehicleType>` array)
  and wants to add newly-created sights into it at sensible positions.
- The user references "new sights" (e.g. added in a specific commit) that should be woven into
  a config that already ships to a capture app.

Do **not** use it to build a list from scratch (that's `/find-sight-ids`) or to change what a
sight ID means.

## Inputs needed from the user

1. **The existing ordered list** of sight IDs to integrate into. Confirm which config /
   `sights.<vehicleType>` it belongs to so you know the `VehicleModel` prefix (e.g. `haccord-*`
   for `sedan`). See `/find-sight-ids` for how to find the model from an app config.

2. **The new sights** to add — either:
   - a list of **sight IDs** (use directly), or
   - a list of **labels/names** — first run `/find-sight-ids` (names → IDs direction) against
     the same `VehicleModel` to resolve them, handling any `unknown-label` / `ambiguous` /
     `no-sight-for-vehicle` results with the user before continuing.

3. **Any explicit placement instructions** the user gives (e.g. "replace Engine Left/Right with
   Engine Bay", "put Mirror Left after Front Door Left", "add Pedals and Shifter near the
   dashboard"). These override the positional heuristic below — always honor them exactly.

## Steps

1. **Resolve every ID in both lists to its label + positioning**, reading straight from source
   so results track the latest sight data. From `packages/sights`, use the lookup functions for
   labels and read `research/data/<vehicle>/<vehicle>.json` (and `all/all.json`) for the
   `positioning` (`position` angle, `height`, `distance`), `category`, `tasks`, and
   `mirror_sight` fields:

   ```typescript
   import { resolveNamesFromSightIds } from './src/lib/sightLookup';
   console.log(JSON.stringify(resolveNamesFromSightIds(['haccord-8YjMcu0D', /* ... */]), null, 2));
   ```

   Read positioning with a short one-off script (do not commit throwaway scripts), e.g.:

   ```bash
   python3 -c "
   import json
   haccord = json.load(open('research/data/haccord/haccord.json'))
   allv = json.load(open('research/data/all/all.json'))
   get = lambda s: haccord[s] if s.startswith('haccord') else allv[s]
   for sid in ['haccord-8YjMcu0D', 'all-U3sFVCcu']:
       d = get(sid); p = d.get('positioning', {})
       print(sid, d['label'], p.get('position'), p.get('height'), p.get('distance'), d.get('category'))
   "
   ```

2. **Apply the user's explicit placement instructions first.** If an instruction says to
   *replace* one or more existing sights with a new one (e.g. Engine Left + Engine Right →
   Engine Bay), remove the replaced IDs and insert the new one in their place.

3. **Place the remaining new sights by the positional heuristic**, so the final array still
   reads as one continuous sequence:
   - Match on **`category`/`distance` first**: exterior walkaround sights go among the exterior
     sequence; interior sights go among the interior sequence; misc (tires, VIN) stay in their
     existing cluster. Never drop an interior sight into the middle of the exterior walkaround.
   - Within the correct section, insert each new sight next to the existing sight at the
     **closest `position` angle** (and similar `height`). A new sight sharing an angle with an
     existing one (e.g. `headlight-left` at 25° next to `front-bumper-side-left` at 25°) goes
     immediately adjacent to it.
   - Keep left/right symmetry consistent: if you place `mirror-left` after `front-door-left`,
     place `mirror-right` in the symmetric spot on the right-hand sweep. Use the `mirror_sight`
     field to confirm the pair.

4. **Never silently make a judgment call the user didn't ask for.** Produce the merged list,
   then explicitly call out:
   - which sights were **explicitly placed** per the user's instructions, and
   - which were placed by the **heuristic** (your judgment) — list these so the user can
     approve or move them.

5. **Present the final merged ordered ID array** ready to paste into the target
   `sights.<vehicleType>`, plus a readable table (index, ID, label, note) so the user can
   verify placement at a glance. Get sign-off before considering it done.

## Caveats

- **Task mismatch is expected and worth flagging.** New sights are often `tasks: ["compliances"]`
  while the existing list is `damage_detection` / `wheel_analysis`. Integrating them mixes
  pipeline purposes — mention it once so the user is aware, but it is not a blocker.
- **Pre-existing duplicate labels** (e.g. two `Dashboard` or two `Rear Seats` IDs with identical
  positioning) may already be in the existing list. Surface them as a separate data-quality note
  — do not try to dedup or "fix" them here; that is out of scope (see the `add-sight` skill for
  data edits).
- The heuristic is a **best-effort ordering aid, not a source of truth.** When two existing
  sights are equally close in angle, or a new sight has no obvious neighbor, show the options and
  ask rather than guessing.
- This skill only reorders IDs into a list. It does **not** edit `sights` research data, create
  overlays, or change any sight definition — use `/add-sight` for that.
