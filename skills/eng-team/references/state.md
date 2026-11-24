# `.eng-team/` - resumable state

Long tasks outlive a context window (compaction, crashes, a new session). Keep state on disk so
any lead can pick up where the last one stopped.

Create on the first M/L task. Exclude it from git via `.git/info/exclude` (does not touch the
repo's files); only if there is no `.git` dir and the user wants it, use `.gitignore`.
The lead is the only writer; engineers may write only under `.eng-team/scratch/`.

```
.eng-team/
  spec.md    the spec (GOAL / FILES / PLAN / ACCEPTANCE / OUT OF SCOPE / RISKS)
  state.md   header + checklist + one-line log
  learnings.md  1-3 lines per finished task: commands that work, traps found (kept across tasks)
  scratch/   throwaway repro scripts and probes from engineers
```

`state.md` format:

```
# <task title>
size: L   mode: bugfix   started: <date>   approved: <date or ->
base: <sha or "no git">   test_cmd: `pytest -q` (or "no harness")
baseline: 212 pass, 2 fail (tests/legacy/test_x.py::a, ::b - pre-existing)
agents: impl-A (name) files: auth/refresh.py   wt: -
blockers: B1 token clock skew - fails: 2 -> debugger   budget: spawns 5/8, architect 1/2

## plan
- [x] 1. scout auth module            -> 12 files, tests: `pytest tests/auth`
- [x] 2. repro test for token expiry  -> red, tests/auth/test_expiry.py:14
- [ ] 3. fix refresh logic (impl-A, worktree)
- [ ] 4. tester full auth suite
- [ ] 5. reviewer (security focus)

## log
- impl-A: changed auth/refresh.py, test red->green, 1 open issue: clock skew
## decisions
- chose sliding expiry (default), user not asked - reversible
```

Rules: one line per report, never paste code; tick a box only with evidence; record every
default you chose under decisions.
