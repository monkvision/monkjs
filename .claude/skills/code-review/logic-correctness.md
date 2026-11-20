# Logic correctness

Loaded by `/code-review` when the diff adds or changes parsing, regexes, string/number
normalization, conditions and thresholds that decide behavior, or async/concurrent state (queue
callbacks, refs mutated from callbacks, counters, retries, backoff).

## Rules

- **Check the code against its comment, step by step.** When a comment lists steps or examples,
  verify each pattern really produces the stated examples. A mismatch means one of them is wrong.
  Report the logic bug first, the comment second.
- **Escape regex metacharacters meant literally.** An unescaped `.` matches any character. Use `\.`
  or a class (`[.,]`).
- **Flag steps that can never change the result.** A replace whose work is already done by a later
  step (e.g. a separator strip before a `\D` strip) is dead logic. Remove it, or fix it if it was
  meant to do something different.
- **Run the examples mentally.** Trace at least one input per branch (`"123 456"`, `"123456,7"`,
  `"1.234.567"`, empty string, only symbols) and compare with what the code returns.
- **Check boundaries and ordering.** Replace chains are order-dependent: an early step can consume
  what a later one expects. Limits are inclusive or exclusive on purpose (`> MAX` vs `>= MAX`).
- **Report a concrete failure.** Name the input and the wrong output. Without one, drop the finding.

## Async and concurrency

Trace checklist. Run it for every counter, flag, delay or backlog that callbacks mutate:

1. **Count the concurrent writers.** If a concurrency limit is above 1 (`MAX_CONCURRENT_*`), trace
   with **2 items in flight**, not 1.
2. **Trace mixed outcomes.** Both fail, both succeed, one fails and one succeeds, in **both
   completion orders**. The result must not depend on which callback runs last.
3. **Check the accounting unit.** A counter or backoff meant per round/batch/attempt must not be
   updated per item. Look for `+= 1` / `* 2` / `= 0` inside a per-item callback.
4. **Check the reset paths.** A success resetting a counter must not erase a failure from the same
   round. Manual actions (e.g. a retry button) and automatic ones share the same state correctly.
5. **Check the tests.** If no test covers 2+ concurrent items with mixed outcomes, that is part of
   the finding.

### Per-item update of a per-round counter

Bad: with 2 retries in flight, one round that fails twice counts as 2 failures and doubles the
delay twice. A late success resets both right after a failure.

```ts
const onRetryEnd = (upload: PictureUpload, failed: boolean) => {
  inFlightRef.current -= 1;
  if (failed) {
    failuresRef.current += 1;
    delayRef.current *= 2;
  } else {
    failuresRef.current = 0;
    delayRef.current = 0;
  }
};
```

Good: record the outcome, then settle it once when the round is over.

```ts
const onRetryEnd = (upload: PictureUpload, failed: boolean) => {
  inFlightRef.current -= 1;
  roundHadFailureRef.current ||= failed;
  roundHadSuccessRef.current ||= !failed;
  if (inFlightRef.current === 0 && backlogRef.current.length === 0) {
    settleRound();
  }
};
```

Severity: a wrong result for realistic input is **Major** (**Blocker** if it corrupts data sent to
the API). Dead but harmless logic is **Minor**.

## Examples

### Regex step that doesn't do what its comment says

Bad:

```ts
// 3. Strip thousands separators: sep + exactly 3 digits (e.g. "1.234.567" → "1234567")
const digits = raw
  .replace(/\s/g, "")
  .replace(/[.,]\d{1,2}(?=\D|$)/g, "")
  .replace(/.,/g, "")
  .replace(/\D/g, "");
```

Problems:

- `/.,/g` has an unescaped `.`: it deletes **any character followed by a comma**. In `"12a,5"` it
  removes `a,`. It matches a literal dot-comma pair only if written `/\.,/`.
- It never does what step 3 describes (sep + exactly 3 digits), so the comment is false.
- The final `/\D/g` already strips every remaining separator, making step 3 redundant either way.

Good:

```ts
const digits = raw
  .replace(/\s/g, "")
  .replace(/[.,]\d{1,2}(?=\D|$)/g, "")
  .replace(/\D/g, "");
```

Finding format: `"1.234,5" → expected 1234` / trace each input through the chain and show where it
diverges. Suggest the smallest safe fix (delete the dead step) and don't rewrite the rest.
