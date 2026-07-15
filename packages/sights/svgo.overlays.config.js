// Overlays are inlined together into a single DOM (e.g. the documentation gallery), so
// their ids share one global namespace. They MUST keep `prefixIds` (namespaces every id
// with the filename) to avoid collisions — without it, `cleanupIds` minifies ids to `a`/`b`
// and masks/refs like `url(#a)` clash across files, causing duplicated/blank overlays.
//
// This is the opposite of the base `svgo.config.js`, which drops `prefixIds` because the
// part-selection wireframes rely on clean ids/classes for part-name extraction.
module.exports = require('@monkvision/svgo-config');
