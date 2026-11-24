// Self-check: node hooks/guard-git.test.js
const { spawnSync } = require('child_process');
const run = (agent, command) =>
  spawnSync('node', [__dirname + '/guard-git.js'], { input: JSON.stringify({ agent_type: agent, tool_input: { command } }) }).status;
const I = 'eng-team:eng-implementer';
const cases = [
  [I, 'git commit -m x', 2], [I, 'cd a && git -C . push origin', 2], [I, 'git -c user.name=x commit', 2],
  [I, 'git reset --hard HEAD~1', 2], [I, 'git branch -D old', 2], [I, 'git clean -fd', 2],
  [I, 'git diff --name-only abc', 0], [I, 'git status --porcelain', 0], [I, 'git log -L 1,5:a.py', 0],
  [I, 'git add -N .', 0], [I, 'git apply --3way x.patch', 0], ['', 'git commit -m lead', 0], ['other-agent', 'git push', 0],
];
let fail = 0;
for (const [a, c, want] of cases) { const got = run(a, c); if (got !== want) { fail++; console.log(`FAIL ${a || '(lead)'} "${c}" -> ${got}, want ${want}`); } }
console.log(fail ? `${fail} failed` : `all ${cases.length} passed`); process.exit(fail ? 1 : 0);
