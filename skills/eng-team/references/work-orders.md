# Work-order templates

Every agent starts with zero context. Fill each field; leave nothing implied.
Common footer for all roles:

```
DO NOT   delegate, commit, push, merge, delete, or widen scope. Blocked or unclear -> stop and report.
```

## scout
```
ROLE      eng-scout
QUESTION  <what must be located/understood, one sentence>
AREA      <dirs to search; dirs to ignore>
REPORT    <= 40 lines: RELEVANT FILES / KEY SYMBOLS (path:line) / CALLERS / TESTS (command) / GOTCHAS / UNKNOWN
```

## architect
```
ROLE      eng-architect
GOAL      <user-visible outcome>
MAP       <scout report or pointer to it>
CONSTRAINTS <must keep / must not touch / deadlines / perf targets>
REPORT    spec (<= 60 lines) + QUESTIONS for the user if any. (Architect is read-only; the lead saves it to .eng-team/spec.md.)
```

## implementer
```
ROLE        eng-implementer
SPEC        .eng-team/spec.md, step <n>
TASK        <the one step>
FILES       may edit: <list>. Nothing else.
CONTEXT     <5-15 lines, path:line refs>
CONVENTIONS <test command; pattern to copy from path:line; style rules>
TEST FIRST  <failing test to write first, or "existing test X covers it">
DONE WHEN   <commands that must pass>
REPORT      <= 15 lines (25 if > 3 files): files changed / red->green evidence (failing assertion,
            then command + exit code) / commands + results / open issues / ASSUMPTIONS (max 3)
```

## debugger
```
ROLE      eng-debugger
SYMPTOM   <exact error/output, how to trigger>
TRIED     <every attempt so far, from state.md, and why each failed - do not repeat these>
AREA      <suspect files>
REPORT    <= 15 lines: ROOT CAUSE at path:line / evidence / minimal fix proposal / other places at risk
```

## tester
```
ROLE      eng-tester
RUN       <exact commands, in order - always given, the tester never guesses>
ALSO      existing tests nearest: <files/dirs>
REPORT    <= 15 lines: PASS/FAIL per command; per failure: name, one-line cause, path:line
```

## reviewer
```
ROLE      eng-reviewer
BASE      <sha from state.md> - review `git diff <sha>` + `git status --porcelain` (no git: files: <list>)
FOCUS     <correctness | security | data | concurrency | API compat>
SPEC      .eng-team/spec.md
REPORT    <= 5 findings, each: [blocker|should-fix|nit] [CONFIRMED|LIKELY] path:line - defect - failing
          scenario - fix; CONFIRMED needs `evidence: <command> -> <output line>`
```

## Filled example (implementer)
```
ROLE        eng-implementer
SPEC        .eng-team/spec.md, step T2
TASK        Refresh tokens must expire after 24h, not 5 min.
FILES       may edit: auth/refresh.py, tests/auth/test_expiry.py. Nothing else.
CONTEXT     auth/refresh.py:41 builds expiry from settings.SESSION_TTL (seconds);
            settings.py:88 SESSION_TTL = 300 is the access-token TTL, wrongly reused.
            settings.py:89 REFRESH_TTL = 86400 exists but is unused.
CONVENTIONS pytest; copy fixture style from tests/auth/test_login.py:10-25.
TEST FIRST  test_refresh_valid_after_6_minutes in tests/auth/test_expiry.py - red now.
DONE WHEN   `pytest tests/auth -q` exits 0
REPORT      <= 15 lines as in the template
DO NOT      delegate, commit, push, merge, delete, or widen scope.
```
