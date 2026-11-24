---
max_turns: 40
timeout_seconds: 900
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
runs: 2
---
Set up a tiny project here: run `git init`, create calc.py with `def add(a, b): return a - b` and `def mul(a, b): return a * b`, create test_calc.py with pytest tests for both functions, and commit it all as "init". Then use /eng-team bugfix to fix the failing test, running without stopping for approval.
