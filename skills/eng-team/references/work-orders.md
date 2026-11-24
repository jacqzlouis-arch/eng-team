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
REPORT      <= 15 lines: files changed / red->green evidence / commands + results / open issues
```

## debugger
```
ROLE      eng-debugger
SYMPTOM   <exact error/output, how to trigger>
TRIED     <what already failed and why>
AREA      <suspect files>
REPORT    <= 15 lines: ROOT CAUSE at path:line / evidence / minimal fix proposal / other places at risk
```

## tester
```
ROLE      eng-tester
RUN       <exact commands, in order>
ALSO      existing tests nearest: <files/dirs>
REPORT    <= 15 lines: PASS/FAIL per command; per failure: name, one-line cause, path:line
```

## reviewer
```
ROLE      eng-reviewer
DIFF      git diff <base>..HEAD (or files: <list>)
FOCUS     <correctness | security | data | concurrency | API compat>
SPEC      .eng-team/spec.md
REPORT    <= 10 findings, each: [blocker|should-fix|nit] [CONFIRMED|LIKELY] path:line - defect - failing scenario - fix
```
