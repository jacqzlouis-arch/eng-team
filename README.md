# eng-team

A Claude Code plugin that runs your coding tasks like a small engineering team.

The main session becomes the **Tech Lead**. It sizes the task, maps the codebase cheaply, writes a
short spec, and hands self-contained work orders to five specialist subagents:

| Agent | Model | Job | Can edit? |
|-------|-------|-----|-----------|
| `eng-scout` | haiku | Maps files, symbols, callers, test commands (max 40 lines) | no |
| `eng-architect` | opus | Turns goal + map into a spec with disjoint work and acceptance tests | no |
| `eng-implementer` | sonnet | Executes one work order, smallest complete change | yes, assigned files only |
| `eng-tester` | haiku | Runs acceptance commands, reports only failing lines | no |
| `eng-reviewer` | opus | Reviews the diff and the code it touches, ranked findings | no |

```
            you
             |
        Tech Lead (main session)
   triage -> map -> spec -> build -> verify -> report
             |       |       |         |
          scout  architect  implementer x1-3   tester + reviewer
                            (parallel on disjoint files / worktrees)
```

## Why it saves tokens instead of burning them

Multi-agent setups often cost more than doing the work alone. eng-team is built around the opposite:

- **Triage first.** Small tasks never spawn agents. Medium tasks get one implementer. Only large ones get the full team.
- **Graph before grep, grep before read.** If a code knowledge graph exists (e.g. graphify output in `graphify-out/`), the lead queries it instead of reading files.
- **Cheap models for cheap work.** Scouting and test runs use haiku; only design and review use opus.
- **Capped reports.** Agents return `path:line` references in 15-40 lines, never code dumps, so the lead's context stays small.
- **Smallest complete diff.** Implementers reuse existing helpers and dependencies and skip speculative code (works well alongside a minimal-diff skill like ponytail).
- **Warm agents are reused**, fan-out is capped at 3, and fix loops stop after 2 rounds.

## Install

In Claude Code:

```
/plugin marketplace add jacqzlouis-arch/eng-team
/plugin install eng-team@eng-team
```

Or manually: copy `skills/eng-team` to `~/.claude/skills/` and `agents/*.md` to `~/.claude/agents/`.

## Use

```
/eng-team add rate limiting to every public API route, with tests
```

or just say "use the eng team for this". The lead states the team size, then works through
map, spec, build, verify, report and finishes with:

```
DONE / CHANGED / VERIFIED / SKIPPED / RISKS
```

## Safety

Engineers never commit, push, merge or run destructive commands, and never delegate further.
Irreversible or outward-facing steps are always confirmed with you first.

## Customise

- Change a role's model in the `model:` line of `agents/<role>.md`.
- Change team sizes, fan-out and loop caps in `skills/eng-team/SKILL.md`.

## License

MIT
