# Add Overlays

Add new sight overlay SVGs to `packages/sights`. Design gives only the raw SVGs; everything
else (ids, JSON entries, schema/type wiring) is done by us.

## Steps

1. Drop the new SVG(s) into `packages/sights/research/data/<vehicle>/overlays/`.

2. **New vehicle only** — add an entry to `packages/sights/research/data/vehicles.json`
   (`id`, `make`, `model`, `type`).

3. **New vehicle only** — add `<vehicle>` id to the enum in
   `packages/sights/research/schemas/subschemas/vehicle.schema.json`.

4. **New vehicle only** — create `packages/sights/research/data/<vehicle>/<vehicle>.schema.json`
   (copy an existing vehicle's schema file, swap the id prefix).

5. Add/update sight entries for each new overlay in
   `packages/sights/research/data/<vehicle>/<vehicle>.json`
   (`id`, `category`, `label`, `overlay`, `vehicle`, `tasks`, `positioning`, `referencePicture`).

6. **New vehicle only** — add a `VehicleModel` entry in `packages/types/src/sights.ts`.

7. **New vehicle only** — in `packages/sights/src/lib/data.ts`, import the new
   `<vehicle>.json` under `src/lib/data/sights/` and spread it into the `sights` object.

8. **New vehicle only** — in
   `documentation/src/components/Sights/SightCard/SightCard.tsx`, add a representative
   overlay to `vehicleModelDisplayOverlays` for the new `VehicleModel`.

9. **Run the overlay SVGO pass** (namespaces ids + minifies). From `packages/sights`:

   ```
   yarn svgo:overlays
   ```

   Idempotent, no-op on already-prefixed files. Note: full `yarn svgo` runs
   `svgo:wireframe && svgo:all && svgo:overlays` in that order; `svgo:overlays` must stay
   last so `svgo:all` can't strip the prefixes.

10. **Validate.** From `packages/sights`:

    ```
    yarn compile && yarn validate
    ```

11. Sanity-check the diff: only the new/changed overlays should appear, each with unique
    `id="<file>_svg__…"` and matching `url(#…)` references.

## Key facts

- `<style>` does NOT prevent collisions — it only makes `cleanupIds` skip the file, freezing
  existing ids. Uniqueness comes from `prefixIds`, not `<style>`.
- Build-enforced: any new overlay is auto-prefixed on every `yarn build`, and validation
  fails the build if a raw export is committed without running the pass.
