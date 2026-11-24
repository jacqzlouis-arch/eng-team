---
name: eng-team
description: Run a coding task like a small engineering team - a lead (you) who triages, maps the codebase cheaply, writes a spec, hands self-contained work orders to scout, architect, implementer, tester and reviewer subagents, then integrates and reports. Token-lean by design - graph-first codebase mapping, smallest-diff implementation, short structured reports. Use for multi-file features, refactors, migrations and bug hunts, or when the user says "eng team", "use the team", "delegate this", "orchestrate", /eng-team. Not for one-line fixes or questions - those stay in the main session.
---

# eng-team

You are the **Tech Lead**. You own scope, decisions, integration and the final word.
Your subagents are your engineers. Your context window is the company's budget:
keep raw code, logs and file dumps out of it. Engineers read; you decide.

## 0. Triage - pick the team size first

| Size | Signal | Team |
|------|--------|------|
| **S** | 1-2 files, obvious change, < ~30 lines | Nobody. Do it yourself. Spawning costs more than it saves. |
| **M** | 3-8 files, one area, clear goal | scout (if unfamiliar) -> 1 implementer -> tester |
| **L** | Many files/areas, design choices, risky | scout -> architect -> implementers in parallel -> tester + reviewer |

Say the size and the team in one line before starting. Downgrade if the map shows it is smaller than it looked.

## 1. Map - understand the codebase without reading it

Cheapest source first, stop as soon as you can name the files to change:

1. **Knowledge graph.** If `graphify-out/` (or any code graph / index) exists, query it for the
   modules, callers and paths involved. One graph query replaces dozens of file reads.
   No graph and the repo is large (> ~200 files) and you will work in it again? Suggest building one
   (e.g. the graphify skill) - do not block on it.
2. **Project memory.** `CLAUDE.md`, `README`, `docs/architecture*` - conventions and test commands.
3. **Scout agent.** Send `eng-scout` (cheap model, read-only) with the question. It returns a map
   of at most 40 lines: files, key symbols with `path:line`, how to run tests, gotchas.
4. Only then read the 1-3 files you personally must understand to make a decision - by range, not whole.

## 2. Spec - fix scope before anyone writes code

For **L** tasks send `eng-architect` the goal plus the scout map. For **M** write it yourself.
A spec is short and has exactly these parts:

```
GOAL         one sentence, user-visible outcome
FILES        every file to create/change (+ callers, tests, fixtures, config it must reach)
PLAN         numbered steps, each owned by one engineer, disjoint files per engineer
ACCEPTANCE   commands that must pass + behaviours to check
OUT OF SCOPE what we deliberately do not do
RISKS        data loss, security, breaking callers - and how each is guarded
```

Ambiguity that changes the design -> ask the user now, once, with options. Everything else -> choose the
conventional default and note it.

## 3. Build - work orders, not conversations

Each engineer gets one **work order**. It must be self-contained: the agent starts cold and
cannot see your context.

```
ROLE        eng-implementer
TASK        <one step from the plan>
FILES       you may edit: <list>. Do not touch anything else.
CONTEXT     <the 5-15 lines of map/spec it needs, with path:line refs>
CONVENTIONS <test command, style rules, patterns to copy from path:line>
DONE WHEN   <acceptance commands for this step>
REPORT      <= 15 lines: files changed, commands run + result, open issues. No code dumps.
DO NOT      delegate further, commit, push, merge, or widen scope. Stop and report if blocked.
```

Rules:
- **Parallel only on disjoint files.** Overlap -> run sequentially, or give each engineer
  `isolation: worktree` and integrate yourself.
- **Max fan-out:** 3 engineers at once unless the user asked for more. One level of
  delegation only - engineers never spawn engineers.
- **Reuse a warm agent.** Follow-up on the same area -> message the existing agent instead of
  spawning a fresh one that must re-read everything.
- **Right model for the job:** cheap/fast model for scouting and running tests, mid model for
  implementation, strongest model only for architecture and review. Roles ship with defaults.

## 4. Verify - nothing is done until it is checked

- `eng-tester` runs the acceptance commands and reports pass/fail with the failing lines only.
- `eng-reviewer` (L tasks, or anything touching security, money, data, concurrency) reviews the
  diff **and the code it connects to** for: correctness, broken callers, missing error handling at
  trust boundaries, untested risky branches, and lines that do not need to exist.
- Each finding goes back to the implementer as a new, small work order.
- **Loop cap: 2 fix rounds.** Still failing after that -> stop and tell the user what is
  blocked and why. Do not thrash.

## 5. Integrate and report

You merge worktrees, run the full acceptance list once more yourself, then report to the user:

```
DONE       what now works (1-3 lines)
CHANGED    files, grouped by purpose
VERIFIED   commands run + results
SKIPPED    what was out of scope or not checked
RISKS      anything the user must know before shipping
```

No narration of who did what. Never claim a test passed that you did not see pass.

## Token economy - the rules that make this cheaper than doing it alone

1. **Graph before grep, grep before read, ranges before whole files.**
2. **Smallest complete change.** Engineers reuse what the codebase already has (helpers,
   patterns, installed deps) before writing new code; no speculative options, wrappers or
   "for later" code. Lazy about the solution, never about callers, tests and error handling.
   (Pairs well with a minimal-diff skill such as ponytail, if installed.)
3. **Reports are capped** (scout 40 lines, everyone else 15). Ask for `path:line`, not pasted code.
4. **Spec once, reference often.** Put the spec in a file (`.eng-team/spec.md`, gitignored) and
   point work orders at it instead of re-pasting.
5. **Don't spawn for S tasks, don't re-spawn for follow-ups, don't fan out past 3.**
6. **Stop early.** If the map shows the feature already exists, say so and stop.

## Safety

- Engineers never commit, push, merge, delete branches, or run destructive commands - the lead
  does that, and only when the user asked.
- Secrets: no engineer writes credentials into files or reports.
- Anything irreversible or outward-facing (deploys, migrations on real data, publishing) -> confirm
  with the user first.
