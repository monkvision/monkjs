# Add Language

Add a new locale `$ARGUMENTS` to all packages and apps that support i18n.

## Context

MonkJs is a **vehicle inspection SDK**. Users photograph or record video of cars to detect damage. Translation strings appear in:
- Camera and capture UIs (shutter, retake, guidelines, tutorials)
- Inspection gallery and review screens
- Damage disclosure flows
- Error and connection-warning messages
- Vehicle part labels (hood, bumper, door, etc.) and damage type labels

All translations must use **automotive/inspection vocabulary** appropriate for the target locale. Prefer the same register as the existing French translations — clear, concise, professional UI copy aimed at non-specialist drivers.

## When to use

Call `/add-language <locale-code>` (e.g. `/add-language ja`) to add a new language across the entire monorepo. The locale code should normally be a valid BCP 47 subtag (lowercase, e.g. `ja`, `ko`, `zh`).

Some locales are **client-specific overlays** rather than real languages — e.g. `en-hag` (Hagerty), which reuses English UI copy but swaps specific strings. These use a fake, non-ISO region subtag (`hag` is not a real ISO 3166 region) and need the extra step in [Custom/non-standard locale codes](#9-custom-non-standard-locale-codes-client-overlays) below. If the requested locale code's region/variant part is not a real ISO region (2 letters) or ISO script (4 letters), treat it as a custom overlay and apply that step.

## Steps

### 1. Register the locale in `@monkvision/types`

File: `packages/types/src/i18n.ts`

- Add the new locale code to the `monkLanguages` array (keep alphabetical order within the existing list is not required — just append it).
- `MonkLanguage` and `TranslationObject` are derived from the array so they update automatically.

### 2. Add translation JSON files

For every package that has a `src/translations/` or `src/components/<Component>/translations/` directory, create a `<locale>.json` file next to the existing `fr.json`.

Packages with a top-level `src/translations/` dir:
- `packages/camera-web/src/translations/`
- `packages/inspection-capture-web/src/translations/`
- `packages/inspection-review/src/translations/`
- `apps/demo-app/src/translations/`
- `apps/demo-app-video/src/translations/`

Packages where each component owns its translations (under `src/components/<Component>/translations/`):
- `packages/common-ui-web/src/components/CaptureSelection/translations/`
- `packages/common-ui-web/src/components/CreateInspection/translations/`
- `packages/common-ui-web/src/components/ImageDetailedView/translations/`
- `packages/common-ui-web/src/components/InspectionGallery/translations/`
- `packages/common-ui-web/src/components/Login/translations/`
- `packages/common-ui-web/src/components/VehicleTypeSelection/translations/`
- `packages/common-ui-web/src/components/VideoTutorial/translations/`

For each location:
1. Read `en.json` to get the full key structure.
2. Read `fr.json` (and one or two other locale files if available) as translation references — they show the expected register, brevity, and phrasing style.
3. Create `<locale>.json` with the same keys, translating every string into the target locale. Keep the same tone and length as the French strings: short, imperative UI copy with automotive vocabulary. Do not transliterate — use natural phrasing a native speaker would expect in a car inspection app.
4. For `apps/demo-app/src/translations/`, the existing `fr.json` is `{}` — create an empty `{}` for the new locale too (the app-level file is an overlay, not a full translation).

### 3. Register the locale in each package's `i18n.ts`

For every `i18n.ts` that calls `i18nCreateSDKInstance({ resources: { ... } })`, add the new locale:

```ts
import newLocale from './translations/<locale>.json';
// ...
resources: {
  // existing locales…
  <locale>: { translation: newLocale },
}
```

Files to update:
- `packages/camera-web/src/i18n.ts`
- `packages/inspection-capture-web/src/i18n.ts`
- `packages/inspection-review/src/i18n.ts` *(only registers 5 langs — check whether to include the new one)*
- `packages/common-ui-web/src/components/CaptureSelection/i18n.ts`
- `packages/common-ui-web/src/components/CreateInspection/i18n.ts`
- `packages/common-ui-web/src/components/ImageDetailedView/i18n.ts`
- `packages/common-ui-web/src/components/InspectionGallery/i18n.ts`
- `packages/common-ui-web/src/components/Login/i18n.ts`
- `packages/common-ui-web/src/components/VehicleTypeSelection/i18n.ts`
- `packages/common-ui-web/src/components/VideoTutorial/i18n.ts` *(only 11 langs — check)*

For app-level i18n (which use the full `i18next` init):
- `apps/demo-app/src/i18n.ts`
- `apps/demo-app-video/src/i18n.ts`

These import directly from their own `src/translations/<locale>.json` and pass the object into `resources`.

### 4. Add locale entries to inline `TranslationObject` literals

These files hardcode a `fr:`/`en-GB:` string entry per value and must include the new locale:

- `packages/common/src/i18n/translations/vehicleParts.ts`
- `packages/common/src/i18n/translations/image.ts`
- `packages/common/src/i18n/translations/damageTypes.ts`
- `packages/camera-web/src/utils/errors.utils.ts` (`getCameraErrorLabel`)
- `packages/network/src/api/image/requests.ts` (`getImageLabel`)

For each `TranslationObject` literal in those files, read the `en` and `fr` values as reference, then write a proper translation for the new locale. Vehicle part names (hood, bumper, quarter panel, etc.) and damage types (scratch, dent, crack, etc.) must use the standard automotive terms in the target language. Watch for values split across two lines (`'en-GB':\n  '...'`) — add the new key in the same multi-line style if the string is long.

### 5. Add the locale to `@monkvision/sights` label data

Sight labels are translated separately from the rest of the SDK:

- `packages/sights/research/schemas/labels.schema.json` — add the new locale to both `properties` and `required` (schema validation fails the build otherwise).
- `packages/sights/research/data/labels.json` — add the new locale to every label entry (100+ entries; script it rather than hand-editing).
- `packages/sights/src/build/buildJSONs.ts` (`mapLabels`) — this function explicitly lists each locale key, so add `'<locale>': labelTranslation['<locale>']` or it will be silently dropped from the compiled output.

Rebuild this package specifically to catch schema/mapping errors early: `yarn workspace @monkvision/sights build`.

### 6. Verify TypeScript compiles

`TranslationObject` is `Record<MonkLanguage, string>`, so TypeScript will error on every `TranslationObject` literal that is missing the new locale. Adding the locale to `monkLanguages` in step 1 makes those errors appear; fixing them is the completion signal.

Run the full build:
```bash
yarn build
```

### 7. Run the unit tests

The `useObjectTranslation` and `useSightLabel` tests iterate over every `MonkLanguage` and will fail if any fixture is missing the new locale. `errors.utils.test.ts` and `requests.test.ts` assert against the full literal from step 4, so they need the matching key too. Update fixtures in:
- `packages/common/test/hooks/useObjectTranslation.test.ts`
- `packages/common/test/hooks/useSightLabel.test.ts`
- `packages/network/test/api/image/requests.test.ts`
- `packages/camera-web/test/utils/errors.utils.test.ts`

Add `<locale>: '<some translated string>'` to every `TranslationObject` fixture in those files. Use a real word in the target language, not a placeholder.

Then run:
```bash
yarn test
```

### 8. Run lint

```bash
yarn lint:fix
```

### 9. Custom/non-standard locale codes (client overlays)

Skip this step for real BCP 47 locales (`ja`, `pt-BR`, etc.) — it only applies to fake, client-specific codes like `en-hag`.

**The pitfall:** i18next resolves the active language through `Intl.getCanonicalLocales()`. For a real tag (`en-GB`, `de-CH`) this succeeds and preserves the exact casing used when registering the resource bundle. For an invalid tag like `en-hag` (`hag` isn't a real ISO region), `Intl.getCanonicalLocales('en-hag')` throws, and i18next falls back to its own formatter — which **uppercases the second segment** (`en-hag` → `en-HAG`) when building the language-resolution hierarchy used by `t()`. If the resource bundle is only registered under the lowercase key, it becomes unreachable and every string silently falls back to the base language (`en`), even though `i18n.language` still reports the correct `en-hag`. This caused topBar.submit to show the old "Validate" (`en` fallback) instead of "Submit Photos" (`en-hag`) for a while before being caught.

**The fix:** register the same resource bundle under both the lowercase code and the uppercase-region alias:

```ts
resources: {
  // ...
  'en-hag': { translation: enHag },
  'en-HAG': { translation: enHag },
}
```

This is already handled centrally for every SDK package via `withEnHagCaseAlias()` in [packages/common/src/i18n/utils.tsx](../../../packages/common/src/i18n/utils.tsx) — `i18nCreateSDKInstance` applies it automatically whenever an `en-hag` key is present, so packages using that helper (step 3's first list) need no per-package change.

The two app-level `i18n.ts` files build their own `i18next` instance directly (they don't go through `i18nCreateSDKInstance`), so **each new custom-code locale added there needs the alias added by hand**:
- `apps/demo-app/src/i18n.ts`
- `apps/demo-app-video/src/i18n.ts`

If a new custom overlay locale is added (not just `en-hag`), either extend `withEnHagCaseAlias` to a generic helper keyed by locale, or add the same alias pattern for the new code — and add the uppercase-alias entry to both app `i18n.ts` files.

## Checklist

- [ ] `monkLanguages` updated in `packages/types/src/i18n.ts`
- [ ] `<locale>.json` created in every `src/translations/` directory
- [ ] `<locale>.json` created in every `common-ui-web` component `translations/` directory
- [ ] `apps/demo-app/src/translations/<locale>.json` created (empty `{}`)
- [ ] `apps/demo-app-video/src/translations/<locale>.json` created
- [ ] All `i18n.ts` files updated with the new import and `resources` entry
- [ ] All inline `TranslationObject` literals updated (`vehicleParts.ts`, `image.ts`, `damageTypes.ts`, `errors.utils.ts`, `requests.ts`)
- [ ] `@monkvision/sights` updated (`labels.schema.json`, `labels.json`, `buildJSONs.ts`)
- [ ] Test fixtures updated
- [ ] `yarn build` passes with no TypeScript errors
- [ ] `yarn workspace @monkvision/common test` passes
- [ ] `yarn lint:fix` passes
- [ ] For custom/non-standard locale codes (fake region, e.g. `en-hag`): uppercase-region alias added to `apps/demo-app/src/i18n.ts` and `apps/demo-app-video/src/i18n.ts` (SDK packages get this for free via `withEnHagCaseAlias` in `i18nCreateSDKInstance`)

## Notes

- `monkLanguages` is imported by the demo apps as `supportedLngs` in their `i18next` init — no extra wiring needed there once the array is updated.
- When translating, always read at least `en.json` and `fr.json` side by side. French is the closest culturally to many target languages and often reveals the intended tone better than English alone. For languages with gendered nouns or formal/informal registers, use the same formality level as the French copy (which uses the informal "tu" register in instructions).
