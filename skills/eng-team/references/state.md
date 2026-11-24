# `.eng-team/` - resumable state

Long tasks outlive a context window (compaction, crashes, a new session). Keep state on disk so
any lead can pick up where the last one stopped.

Create on the first M/L task, and add `.eng-team/` to `.gitignore` (or `.git/info/exclude`
if you must not touch `.gitignore`).

```
.eng-team/
  spec.md    the spec (GOAL / FILES / PLAN / ACCEPTANCE / OUT OF SCOPE / RISKS)
  state.md   checklist + one-line log
```

`state.md` format:

```
# <task title>
size: L   mode: bugfix   started: <date>

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
