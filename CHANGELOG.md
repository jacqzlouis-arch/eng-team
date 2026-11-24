# Changelog

## 2.1.0 - 2026-11-24

Fixes (would break the first large run):
- Implementer now has an explicit `tools:` list and `disallowedTools: Agent`, so it cannot spawn agents.
- Reviewer reviews `git diff <base_sha>` + untracked files instead of `<base>..HEAD` (empty, since the team never commits).
- Worktree integration is defined (patch + `git apply --3way`); disjoint files on one checkout are the default.
- Repro tests and benchmarks are implementer steps (tester and debugger are read-only).
- Implementer reports out-of-scope callers instead of editing them; the lead runs a scope check after each report.

Enforcement:
- `hooks/` PreToolUse guard blocks git writes from every `eng-*` agent (self-test: `node hooks/guard-git.test.js`).
- `maxTurns`, `effort`, `color` per agent; `memory: project` on the scout.
- `evals/` with three cases: small task spawns no agents, engineers never commit, large task stops at the spec.

Process:
- Step 0 preflight (git? test command? baseline failures) and a richer resumable state header.
- Implementers sequential by default; parallel only for `[P]` steps with a spec INTERFACES section.
- Reviewer: CONFIRMED needs command evidence, max 5 findings, false-positive exclusions.
- Tester: exact commands only, exit code + last 5 lines, `git status` before/after.
- ASSUMPTIONS line in implementer reports; escalation counted per blocker; run budget.
- New playbooks: ui, infra, hard-bug. Learnings file. Excuse/reality table. Third-person description.
- `.eng-team/` excluded via `.git/info/exclude` instead of editing `.gitignore`.

## 2.0.0
- Initial public version.
