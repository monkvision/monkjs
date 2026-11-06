# Logic correctness

Loaded by `/code-review` when the diff adds or changes parsing, regexes, string/number
normalization, or conditions and thresholds that decide behavior.

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

Severity: a wrong result for realistic input is **Major** (**Blocker** if it corrupts data sent to
the API). Dead but harmless logic is **Minor**.

## Examples

### Regex step that doesn't do what its comment says

Bad:

```ts
// 3. Strip thousands separators: sep + exactly 3 digits (e.g. "1.234.567" → "1234567")
const digits = raw
  .replace(/\s/g, '')
  .replace(/[.,]\d{1,2}(?=\D|$)/g, '')
  .replace(/.,/g, '')
  .replace(/\D/g, '');
```

Problems:

- `/.,/g` has an unescaped `.`: it deletes **any character followed by a comma**. In `"12a,5"` it
  removes `a,`. It matches a literal dot-comma pair only if written `/\.,/`.
- It never does what step 3 describes (sep + exactly 3 digits), so the comment is false.
- The final `/\D/g` already strips every remaining separator, making step 3 redundant either way.

Good:

```ts
const digits = raw
  .replace(/\s/g, '')
  .replace(/[.,]\d{1,2}(?=\D|$)/g, '')
  .replace(/\D/g, '');
```

Finding format: `"1.234,5" → expected 1234` / trace each input through the chain and show where it
diverges. Suggest the smallest safe fix (delete the dead step) and don't rewrite the rest.
