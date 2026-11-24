# Playbooks - load only the one for the current mode

## feature
1. Map where similar features live; copy their pattern (path:line in CONVENTIONS).
2. Spec lists every entry point the feature must reach: routes, CLI, UI, config, docs, exports.
3. Tests first: acceptance test(s) describing the user-visible behaviour, red.
4. Implement smallest slice that turns them green; then edge cases (empty, max, invalid, unauthorised).
5. Reviewer if public API, auth or data is involved.

## bugfix
1. **Reproduce first.** Tester or debugger writes a failing test / script that shows the bug.
   No repro -> debugger gathers evidence (logs, inputs, versions) before anyone edits.
2. **Root cause, not symptom.** Debugger traces from the failure to the first wrong value;
   reports cause at path:line and why. Check `git log -L` / blame for when it broke.
3. Grep **every caller** of the function being changed; fix once in shared code.
4. Repro test goes green; full nearby suite stays green.
5. Look for the same bug pattern elsewhere (one grep) and list hits under RISKS - do not fix
   them unasked.

## refactor
1. Behaviour must not change. Before touching code, make sure tests cover current behaviour;
   if not, add characterization tests that pin today's outputs.
2. Small mechanical steps, tests green after each. Moves and renames before logic changes.
3. Moved code keeps its validation and error handling.
4. Reviewer checks public signatures, imports/exports and anything reflective/dynamic (string
   lookups, DI, serialization) that grep may miss.

## migration (schema, framework, dependency, API version)
1. Inventory: scout lists every usage site; count them - that count is the acceptance target.
2. Plan must be reversible: rollback step written before the forward step.
3. Data migrations: dry run on a copy, row counts before/after, never on real data without the
   user's explicit go.
4. Split usage sites into disjoint batches for parallel implementers; one batch first as pilot.
5. Done = zero remaining old-API usages (grep shown) + suite green.

## perf
1. **Measure first.** Tester produces a baseline benchmark/profile with exact command and numbers.
2. Debugger/scout identifies the hot path from the profile - no guessing.
3. One change at a time, re-measure each; keep only changes that move the number.
4. Report before -> after with the same command. Check correctness tests still pass.

## review (no code changes)
1. Scout maps the diff's blast radius (callers, tests).
2. Reviewer reviews; each finding self-verified (try to disprove it) before reporting.
3. Lead ranks findings (blocker / should-fix / nit) and reports. Edits only if the user asks.
