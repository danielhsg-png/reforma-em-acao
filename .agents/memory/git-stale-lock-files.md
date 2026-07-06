---
name: Git lock files from blocked agent operations
description: A git operation blocked by the "no destructive git in main agent" sandbox rule can still leave a stale .lock file behind, which later breaks unrelated, legitimate git commands (including the user's own manual pull/push).
---

## What happened
The agent attempted a `git fetch`/`git config` that the sandbox intercepted with
"Destructive git operations are not allowed in the main agent." The interception
happened *after* git had already created a `.lock` file (e.g.
`.git/refs/remotes/origin/<branch>.lock`, `.git/config.lock`), so the lock was
never cleaned up. The agent could not remove it either — any write under `.git/`
(even a plain `rm`) is blocked by the same rule, regardless of whether the
command is literally `git ...`.

Days later, this stale lock caused the *user's own* manual `git pull` (via the
Shell tab or Git panel) to fail with `cannot lock ref ... File exists` /
`INDEX_LOCKED`, even though the user had nothing to do with the original
blocked operation.

**Why:** the block operates by intercepting writes to paths under `.git/`, not
just by parsing the git subcommand name — so it stops the agent from cleaning
up its own mess, and the mess is invisible until someone else's git command
trips over it.

**How to apply:** when diagnosing a `INDEX_LOCKED` / `cannot lock ref ... File
exists` error from the user, check first whether a leftover `.lock` file exists
under `.git/` (e.g. `.git/refs/remotes/origin/*.lock`, `.git/config.lock`,
`.git/index.lock`) — it's often a stale artifact from an earlier blocked agent
git command, not a real concurrent process. The agent cannot delete it directly
(same sandbox restriction); ask the user to run `rm -f <path>` themselves in
the Shell tab, then retry.

Also: `git pull` that needs a merge commit message will open an interactive
editor. In Replit's web-based Shell terminal this can render confusingly (or
the editor session can abort silently, leaving the merge un-committed with no
error). Prefer `git pull origin main --no-rebase --no-edit` to skip the editor
entirely and avoid this failure mode.
