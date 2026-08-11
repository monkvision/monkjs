# Add API Request

Implement a new `MonkApi` request end-to-end: the network request, the state action/reducer it dispatches in
`@monkvision/common`, and the `useMonkApi` wiring. Pattern reference: commit `aaec99e2` (`deleteImage`).

## When to use

Call `/add-api-request <name>` (e.g. `/add-api-request deleteImage`) for a new Monk API call that should update
`MonkState`. Skip the state-action steps for purely read-only requests that don't mutate state.

## How state flows

`MonkProvider` (`packages/common/src/state/provider.tsx`) runs `useReducer(monkReducer, ...)` and exposes
`{ state, dispatch }` via context — a Redux-like pattern with no Redux dependency. Each mutation is a matcher +
reducer pair in `packages/common/src/state/actions/`, registered in `packages/common/src/state/reducer.ts`. Network
requests take `dispatch` as an optional last param and dispatch a `MonkAction` after the API call succeeds.
`useMonkApi` (`packages/network/src/api/react.ts`) auto-binds `dispatch` via `useMonkState()`.

## Steps

1. **Add the action type** in `packages/common/src/state/actions/monkAction.ts` — new `MonkActionType` enum member,
   e.g. `DELETED_ONE_IMAGE = 'deleted_one_image'`, with a one-line TSDoc.

2. **Create the action file** `packages/common/src/state/actions/<actionName>.ts`. Use
   `packages/common/src/state/actions/deletedOneImage.ts` and `createdOneImage.ts` as templates for the
   payload/action interfaces, matcher (`is<ActionName>Action`), and reducer function. Never mutate state in place —
   `.filter`/`.map` into new arrays/objects and spread them into the returned state. If the change cascades into
   other slices (e.g. deleting an image also touches `inspections`, `damages`, `parts`, `views`,
   `renderedOutputs`), handle all of them in this one reducer. For optimistic client-side creation before the API
   confirms, follow `createdOneImage`'s `localId` pattern.

3. **Register it**: add `export * from './<actionName>';` to `actions/index.ts`, and wire the matcher/reducer into
   the `if` chain in `reducer.ts`, next to related actions.

4. **Update `packages/common/test/state/reducer.test.ts`**: add the new matcher/handler to the
   `jest.mock('../../src/state/actions', ...)` factory and to the `actions` array, following the existing
   `isDeletedOneImageAction`/`deletedOneImage` entries.

5. **Write the action test** `packages/common/test/state/actions/<actionName>.test.ts`, mirroring
   `deletedOneImage.test.ts`: a matcher describe block (true/false cases) and a handler describe block asserting a
   new state object is returned and every affected slice is correctly updated.

6. **Implement the network request** in `packages/network/src/api/<entity>/requests.ts` (create the folder if new,
   otherwise append). Use `deleteImage` in `packages/network/src/api/image/requests.ts` as the template: options
   interface, `ky.<verb>` call with `getDefaultOptions(config)`, dispatch after success, `console.error` + re-throw
   on failure. `dispatch` is always the last, optional param.

7. **Export it**: `export * from './requests';` in `packages/network/src/api/<entity>/index.ts` if new; add the
   options type to the grouped export in `packages/network/src/api/index.ts`; add the function to the `MonkApi`
   object in `packages/network/src/api/api.ts`.

8. **Wire into `useMonkApi`** in `packages/network/src/api/react.ts` — add
   `<name>: reactify(MonkApi.<name>, config, dispatch, handleError)` with a matching TSDoc comment.

9. **Update the `ky` mock** in `configs/test-utils/src/__mocks__/ky.ts` only if this introduces a `ky` verb
   (`get`/`post`/`patch`/`delete`) not already mocked there.

10. **Write the request test** in `packages/network/test/api/<entity>/requests.test.ts`, mirroring the
    `deleteImage request` describe block: one test for the correct `ky` call + dispatched action, one for the
    error/re-throw path with no dispatch.

11. **Document it** in `packages/network/README.md` — add a `### <name>` section following the existing `deleteImage`
    section format (code snippet, one-line description, param table).

12. **Verify**:
    ```bash
    yarn build
    yarn workspace @monkvision/common test
    yarn workspace @monkvision/network test
    yarn lint:fix
    ```

## Checklist

- [ ] `MonkActionType` entry added
- [ ] Action file (payload, action interface, matcher, reducer) created and exported
- [ ] Reducer wired in `reducer.ts`, tests updated in `reducer.test.ts`
- [ ] Action unit test written
- [ ] Request function implemented, exported from `index.ts`/`api.ts`
- [ ] `useMonkApi` wired in `react.ts`
- [ ] `ky` mock updated if a new verb was introduced
- [ ] Request unit test written (success + error)
- [ ] `packages/network/README.md` updated
- [ ] `yarn build`, workspace tests, `yarn lint:fix` pass

## Notes

- Naming ties the chain together: `DELETED_ONE_IMAGE` ↔ `deletedOneImage.ts` ↔ `MonkDeletedOneImagePayload`/
  `MonkDeletedOneImageAction` ↔ `isDeletedOneImageAction` ↔ `deletedOneImage` (reducer) ↔ `deleteImage` (request) ↔
  `useMonkApi().deleteImage`. Keep new requests consistent with this so the chain stays greppable.
- Only the first `MonkProvider` in the tree has any effect — nested providers are no-ops.
