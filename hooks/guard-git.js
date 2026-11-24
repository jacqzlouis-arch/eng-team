// Blocks git commands that change history or remotes when run by an eng-team subagent.
// Exit 2 + stderr = block (shown to the agent). Anything else = allow. The lead (no agent_type) is never blocked.
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }
  const agent = String(input.agent_type || '');
  if (!/(^|:)eng-/.test(agent)) process.exit(0);
  const cmd = String((input.tool_input && input.tool_input.command) || '');
  const bad = /\bgit\s+(?:-[cC]\s+\S+\s+|--?[\w-]+(?:=\S+)?\s+)*(commit|push|merge|rebase|reset\s+--hard|branch\s+-[dD]|tag|checkout\s+--|clean\s+-\w*f\w*|stash\s+(drop|clear)|update-ref|filter-branch)\b/;
  if (bad.test(cmd)) {
    process.stderr.write(`eng-team: "${cmd.slice(0, 80)}" is not allowed for ${agent}. Engineers never commit, push, merge or rewrite git state - report to the lead instead.\n`);
    process.exit(2);
  }
  process.exit(0);
});
