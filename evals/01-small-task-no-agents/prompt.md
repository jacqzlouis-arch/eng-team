---
max_turns: 15
timeout_seconds: 300
allowed_tools: [Skill, Read, Write, Edit, Glob, Grep, Bash, Agent]
runs: 3
---
Create a file greet.py with `def greet(name): return "Helo, " + name`. Then use /eng-team to fix the typo in the greeting ("Helo" should be "Hello").
