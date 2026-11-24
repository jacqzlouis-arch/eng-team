# eng-team

A Claude Code plugin that runs your coding tasks like a senior engineering team: **test-first,
evidence-based, resumable and token-lean.**

The main session becomes the **Tech Lead**. It sizes the task, maps the codebase cheaply, writes a
spec, and dispatches self-contained work orders to six specialist subagents:

| Agent | Model | Job | Edits code? |
|-------|-------|-----|-------------|
| `eng-scout` | haiku | Maps files, symbols, callers, test commands (<= 40 lines) | no |
| `eng-architect` | opus | Goal + map -> spec with disjoint work and acceptance tests | no |
| `eng-implementer` | sonnet | One work order, failing test first, smallest complete change | assigned files only |
| `eng-debugger` | sonnet | Reproduces a failure and traces it to the root cause | no (throwaway probes) |
| `eng-tester` | haiku | Runs acceptance commands, reports only the failing lines | no |
| `eng-reviewer` | opus | Reviews diff + connected code, self-verifies every finding | no |

```
                         you
                          |
               Tech Lead (main session)
 resume -> triage -> map -> clarify/spec -> build -> verify -> report
                      |          |            |         |
                 scout x1-3  architect  implementers  tester + reviewer
                 (parallel)  [checkpoint] (<=3, disjoint     |
                                          files/worktrees)   fail x2 -> debugger -> architect -> you
```

## What makes it effective

- **Six playbooks** - `feature`, `bugfix`, `refactor`, `migration`, `perf`, `review` - each with its own
  discipline: reproduce-before-fix, characterization tests before refactors, reversible migrations,
  measure-before-optimising.
- **Test first.** Implementers show the failing test, then the passing one.
- **Evidence or it didn't happen.** Nothing is reported as passing without command output.
- **Self-verifying reviews.** The reviewer tries to disprove each of its own findings and labels the
  rest CONFIRMED or LIKELY - far fewer false alarms.
- **Escalation ladder instead of loops.** A second failure goes to the debugger for root cause, then
  to the architect, then to you with options. No thrashing.
- **Resumable.** Spec and progress live in `.eng-team/` (gitignored), so long tasks survive context
  compaction or a new session.
- **Spec checkpoint** on large tasks: you approve a 15-line plan before any code is written.

## Why it saves tokens instead of burning them

- **Triage first.** Small tasks never spawn agents. Medium tasks get one implementer.
- **Graph -> grep -> line ranges -> whole files.** If a code knowledge graph exists (e.g. graphify
  output in `graphify-out/`), the lead queries it instead of reading files.
- **Progressive disclosure.** The core skill is short; playbooks and templates load only when needed.
- **Cheap models for cheap work**, strongest only for design and review.
- **Capped reports** with `path:line` references, never code dumps.
- **Smallest complete diff** (pairs well with a minimal-diff skill like ponytail).
- Warm agents are reused, fan-out is capped at 3, delegation is one level deep.

## Install

In Claude Code:

```
/plugin marketplace add jacqzlouis-arch/eng-team
/plugin install eng-team@eng-team
```

Or manually: copy `skills/eng-team` to `~/.claude/skills/` and `agents/*.md` to `~/.claude/agents/`.

## Use

```
/eng-team bugfix users get logged out after 5 minutes instead of 24h
/eng-team feature add rate limiting to every public API route, with tests
/eng-team refactor split payments.py into a package without changing behaviour
/eng-team review the current branch
```

or just say "use the eng team for this". Every run ends with:

```
DONE / CHANGED / VERIFIED / SKIPPED / RISKS
```

## Safety

Engineers never commit, push, merge, delete or run destructive commands, and never delegate further.
Irreversible or outward-facing steps (real-data migrations, deploys, publishing) always need your go.

## Customise

- Role models: the `model:` line in `agents/<role>.md`.
- Team sizes, fan-out, loop caps: `skills/eng-team/SKILL.md`.
- Mode disciplines: `skills/eng-team/references/playbooks.md`.

## License

MIT
