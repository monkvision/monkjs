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

Call `/add-language <locale-code>` (e.g. `/add-language ja`) to add a new language across the entire monorepo. The locale code must be a valid BCP 47 subtag (lowercase, e.g. `ja`, `ko`, `zh`).

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

### 4. Add locale entries to inline `TranslationObject` maps in `@monkvision/common`

These files define `fr:` string entries for every value and must include the new locale:

- `packages/common/src/i18n/translations/vehicleParts.ts`
- `packages/common/src/i18n/translations/image.ts`
- `packages/common/src/i18n/translations/damageTypes.ts`

For each `TranslationObject` literal in those files, read the `en` and `fr` values as reference, then write a proper translation for the new locale. Vehicle part names (hood, bumper, quarter panel, etc.) and damage types (scratch, dent, crack, etc.) must use the standard automotive terms in the target language.

### 5. Verify TypeScript compiles

`TranslationObject` is `Record<MonkLanguage, string>`, so TypeScript will error on every `TranslationObject` literal that is missing the new locale. Adding the locale to `monkLanguages` in step 1 makes those errors appear; fixing them is the completion signal.

Run the full build:
```bash
yarn build
```

### 6. Run the unit tests

The `useObjectTranslation` and `useSightLabel` tests iterate over every `MonkLanguage` and will fail if any fixture is missing the new locale. Update fixtures in:
- `packages/common/test/hooks/useObjectTranslation.test.ts`
- `packages/common/test/hooks/useSightLabel.test.ts`

Add `<locale>: '<some translated string>'` to every `TranslationObject` fixture in those files. Use a real word in the target language, not a placeholder.

Then run:
```bash
yarn workspace @monkvision/common test
```

### 7. Run lint

```bash
yarn lint:fix
```

## Checklist

- [ ] `monkLanguages` updated in `packages/types/src/i18n.ts`
- [ ] `<locale>.json` created in every `src/translations/` directory
- [ ] `<locale>.json` created in every `common-ui-web` component `translations/` directory
- [ ] `apps/demo-app/src/translations/<locale>.json` created (empty `{}`)
- [ ] `apps/demo-app-video/src/translations/<locale>.json` created
- [ ] All `i18n.ts` files updated with the new import and `resources` entry
- [ ] All inline `TranslationObject` maps updated (`vehicleParts.ts`, `image.ts`, `damageTypes.ts`)
- [ ] Test fixtures updated
- [ ] `yarn build` passes with no TypeScript errors
- [ ] `yarn workspace @monkvision/common test` passes
- [ ] `yarn lint:fix` passes

## Notes

- `inspection-review` and `VideoTutorial` intentionally support fewer languages. Decide with the team whether the new locale belongs there before adding it.
- `monkLanguages` is imported by the demo apps as `supportedLngs` in their `i18next` init — no extra wiring needed there once the array is updated.
- When translating, always read at least `en.json` and `fr.json` side by side. French is the closest culturally to many target languages and often reveals the intended tone better than English alone. For languages with gendered nouns or formal/informal registers, use the same formality level as the French copy (which uses the informal "tu" register in instructions).
