"use strict";

// Stand-in for fast-glob, wired in through the root package.json "overrides".
//
// Its only consumer is @next/eslint-plugin-next (via eslint-config-next),
// which calls `globSync(pattern, { onlyDirectories: true })`, and only when
// `settings.next.rootDir` is set. Real fast-glob 3.x depends on micromatch ->
// braces, which has an advisory with no patched release; tinyglobby offers
// the same call and option without that chain. Drop this shim once
// @next/eslint-plugin-next stops depending on fast-glob.
const { glob, globSync } = require("tinyglobby");

module.exports = { glob, globSync, sync: globSync, async: glob };
