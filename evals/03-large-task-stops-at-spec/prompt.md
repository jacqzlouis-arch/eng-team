---
max_turns: 40
timeout_seconds: 900
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
runs: 2
---
Set up a small Flask-style project skeleton here: run `git init`, create app.py with two routes (/users and /orders) returning JSON lists, and auth.py with a placeholder `check_token(token)` function. Then: /eng-team feature add token authentication to every route, per-user rate limiting, and an admin-only /stats route, with tests.
