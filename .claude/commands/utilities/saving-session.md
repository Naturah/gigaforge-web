---
description: Save session with git commit, push, and GitHub issue updates
argument-hint: [--auto] [--no-push] [--no-close] [--progress <issue>] [--message "custom message"]
allowed-tools: [Bash, Read, Grep, Glob]
---

# Saving Session

## Purpose

Streamlined end-of-session workflow that handles git operations and GitHub issue updates. Automatically generates structured commit messages from session changes, commits to git, pushes to remote, and closes/updates GitHub issues with summary comments that serve as handoff notes for the next session.

**Key Philosophy**: Keep it simple. Use GitHub issues as the handoff mechanism (no extra local files). Pairs perfectly with `/starting-session` at session start.

**When to use**: End of every work session, after accomplishing objectives, before context window exhaustion (typically around 60-70% usage).

## Usage

```bash
/saving-session
/saving-session --auto
/saving-session --no-push
/saving-session --no-close
/saving-session --progress 3
/saving-session --message "Custom commit message"
```

## Arguments

- `--auto` (optional) - Auto-generate commit message and proceed with minimal prompts
- `--no-push` (optional) - Commit locally but don't push to remote
- `--no-close` (optional) - Skip GitHub issue closing entirely (commit + push only)
- `--progress <issue_number>` (optional) - Add progress comment to issue without closing. Use for multi-phase work (e.g., Phase 1 with multiple tasks). Automatically tracks completion percentage and next steps.
- `--message` (optional) - Provide custom commit message (skips auto-generation)

## Workflow Steps

### 1. Detect Session Changes

```bash
git status
git diff --stat
```

Shows:
- Files modified/added/deleted
- Lines changed
- Summary of work done

### 2. Generate Smart Commit Message

Auto-generates structured commit message based on:
- Git diff analysis (new routes, modified components, env changes)
- Current migration phase (from CLAUDE.md)
- Issue references (from branch or work context)

**Commit Message Pattern**:
```
[type]: [Brief title describing main accomplishment]

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]
- Update documentation
- Close/Progress GitHub Issue #N

Migration: Phase [X] - [STATUS]
```

**Type Prefixes**:
- `feat:` - New features (routes, components, integrations)
- `fix:` - Bug fixes
- `refactor:` - Code refactoring, cleanup
- `chore:` - Dependency updates, config changes
- `docs:` - Documentation updates
- `test:` - Test additions/updates

**Prompts**:
```
Use this commit message? [Y/n/e(dit)]
  Y - Use as-is
  n - Cancel
  e - Edit message
```

### 3. Git Commit

```bash
git add .
git commit -m "[Generated message]"
```

**Displays**:
```
✓ Committed: abc1234
  Files: 8 changed, 456 insertions(+), 23 deletions(-)
```

### 4. Push to Remote

```bash
git push origin [current-branch]
```

**Prompts** (if not --no-push):
```
Push to origin/v2-pivot? [Y/n]
```

**Displays**:
```
✓ Pushed to origin/v2-pivot
  Commit: abc1234
```

### 5. Update GitHub Issues

Detects GitHub issue references in commit message (e.g., "Close GitHub Issue #3" or "Progress on #3").

**Prompts**:
```
Close GitHub Issue #3 with session summary? [Y/n]
```

If yes, closes issue with comment in a single operation (prevents re-open bug):
```markdown
## Session Complete

**Accomplished**:
- Removed Clerk dependencies from package.json
- Updated authentication routes
- Implemented guest checkout flow
- All tests passing

**Migration Status**: Phase 1 COMPLETE ✅

**Next Session**: Begin Phase 2 - Deploy Strapi on Railway

**Environment**: v2-pivot branch
```

**Command** (single operation to prevent re-opening):
```bash
gh issue close 3 --comment "$(cat <<'EOF'
## Session Complete

**Accomplished**:
- [Auto-generated from commit message]

**Migration Status**: [Auto-detected from project state]

**Next Session**: [Recommended next task]
EOF)"
```

**Important**: Use `--comment` flag with heredoc to close AND comment in one operation.

### 6. Final Confirmation

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SESSION SAVED

📦 Commit:  abc1234 - feat: Complete Phase 1 Clerk removal
🚀 Pushed:  origin/v2-pivot
🎯 Closed:  Issue #2
⏭️  Next:   Run /starting-session at session start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Examples

### Example 1: Interactive mode (default)
```bash
/saving-session
```

**Flow**:
1. Shows git status and changes
2. Generates commit message
3. Prompts: "Use this message? [Y/n/e]"
4. Commits
5. Prompts: "Push to origin/v2-pivot? [Y/n]"
6. Pushes
7. Prompts: "Close Issue #2? [Y/n]"
8. Closes issue with summary
9. Displays final confirmation

### Example 2: Auto mode (minimal prompts)
```bash
/saving-session --auto
```

**Flow**:
- Auto-generates commit message
- Auto-commits
- Auto-pushes
- Auto-closes referenced issues
- Only stops if conflicts detected

### Example 3: Commit only, no push
```bash
/saving-session --no-push
```

**Flow**:
- Generates commit message
- Commits locally
- Skips push and GitHub updates
- Useful for offline work or when reviewing changes later

### Example 4: Mid-phase progress update
```bash
/saving-session --progress 3
```

**Scenario**: Phase 3 has multiple tasks, some complete, some pending

**Flow**:
1. Shows git status and changes
2. Generates commit message (includes "Progress on GitHub Issue #3")
3. Commits
4. Pushes to remote
5. Auto-generates progress comment
6. Adds comment to Issue #3 (does NOT close)
7. Displays completion percentage and next steps

**Result**:
- ✅ Work committed and pushed
- ✅ Issue #3 stays OPEN (partial progress, more work remaining)
- ✅ Progress documented in GitHub automatically
- ✅ Next session sees updated progress in `/starting-session`

**Use this when**: Working through multi-task phases incrementally

### Example 5: Custom commit message
```bash
/saving-session --message "fix: Stripe webhook signature validation"
```

**Flow**:
- Uses provided message
- Skips auto-generation
- Proceeds with commit + push

## Integration with `/starting-session`

This command creates the **handoff mechanism** for next session:

**End of Session** (this command):
```bash
/saving-session
# Closes Issue #2 with summary comment
```

**Start of Next Session** (`/starting-session`):
```bash
/starting-session

# Shows:
✅ RECENTLY COMPLETED
  #2 - Phase 1: Remove Clerk authentication [CLOSED]
      Completed: 2025-11-18

      Session Summary (last comment):
      - Removed Clerk dependencies
      - Implemented guest checkout
      - Migration: Phase 1 COMPLETE
      - Next: Begin Phase 2 - Strapi deployment

🔴 HIGH PRIORITY
  #3 - Phase 2: Deploy Strapi on Railway [READY]
```

**Key Insight**: GitHub issue comments = session handoff notes. No extra files needed!

## Mid-Phase Workflow (Multi-Task Phases)

**Problem**: Some migration phases have multiple tasks that span multiple sessions. Need incremental progress commits without closing the parent issue prematurely.

**Solution**: Use `--progress` flag for mid-phase commits, normal invocation when phase fully complete.

### When to Use `--progress`

**Use Cases**:
- Multi-task phases (Phase 3 has: create service, update routes, test integration)
- Incremental progress commits (daily sessions)
- Need to track progress WITHOUT closing parent issue
- Want automatic progress comment generation

**Example Workflow**:
```bash
# Task 1 complete (create Strapi service)
/saving-session --progress 4
# → Commits, pushes, adds progress comment
# → Issue #4 stays OPEN (33% complete, 2 tasks remaining)

# Task 2 complete (update product routes)
/saving-session --progress 4
# → Issue #4 stays OPEN (66% complete, 1 task remaining)

# Task 3 complete (test integration)
/saving-session
# → Issue #4 CLOSES (100% complete, all tasks done)
```

### What `--progress` Does

1. **Generate commit message** (as normal)
2. **Commit all changes** with message
3. **Push to remote** repository
4. **Add progress comment** to specified issue (auto-generated)
5. **Do NOT close issue** (keeps open for remaining work)
6. **Display completion percentage** and next steps

### Auto-Generated Progress Comment

**Format**:
```markdown
## Phase [X] Progress ⏳

**Progress**: [percentage]% ([completed]/[total] tasks)

**Accomplished Today**:
[Auto-extracted from commit message]

**Migration Status**:
- ✅ Task 1: [description] - COMPLETE
- ✅ Task 2: [description] - **COMPLETE** (today)
- ⏳ Task 3: [description] - NEXT
- ⏳ Task 4: [description] - PENDING

**Next Session**: [Inferred from pending tasks]

**Commit**: [commit-hash]
**Branch**: v2-pivot
```

**Data Sources**:
- **Progress percentage**: Calculate from CLAUDE.md or issue description
- **Accomplished**: Extract from commit message bullets
- **Task status**: Parse from issue body or track manually
- **Next session**: Infer from next pending task

### Comparison: `--progress` vs `--no-close` vs Normal

| Scenario | Flag | Commit | Push | GitHub Action |
|----------|------|--------|------|---------------|
| Mid-phase work | `--progress 3` | ✅ | ✅ | Add progress comment, keep open |
| Mid-phase (simple) | `--no-close` | ✅ | ✅ | No action (manual comment needed) |
| Phase complete | (none) | ✅ | ✅ | Close issue with summary |
| Offline work | `--no-push` | ✅ | ❌ | No action |

**Recommendation**: Use `--progress` for multi-task workflows (automatic progress tracking).

## Commit Message Auto-Generation

The command analyzes git changes to build the commit message:

**Detects**:
- New routes in `app/routes/` → "Create [route-name] route"
- Modified components → "Update [component-name] component"
- package.json changes → "Update dependencies" or "Remove [package]"
- Environment variable changes → "Configure [service] integration"
- Documentation updates → "Update documentation"
- Test file changes → "Add/update tests"

**Extracts Metrics**:
- Migration phase: Read from CLAUDE.md or git branch
- Files changed: Count from git diff
- Tests status: Check if tests passing

**GigaForge-Specific Detection**:
- Clerk removal: Check for "@clerk/remix" removal
- Strapi integration: Detect strapi.server.ts creation
- Stripe webhook: Detect webhook handler implementation
- Deployment prep: Detect Vercel config changes

**Formats**:
```
feat: Complete Phase 1 Clerk removal

- Remove @clerk/remix and related packages from package.json
- Update authentication routes for guest checkout
- Implement cart persistence with localStorage
- Update documentation with guest checkout flow
- Close GitHub Issue #2

Migration: Phase 1 COMPLETE ✅
Branch: v2-pivot
```

## GitHub Issue Summary Format

When closing issues, the comment includes:

**Accomplished** (bulleted list from commit):
- Main work items completed
- Routes/components created or modified
- Dependencies updated
- Tests status

**Migration Status** (current state):
- Phase: X of 6
- Status: COMPLETE/IN PROGRESS
- Branch: v2-pivot

**Next Session** (what to do next):
- Next phase to tackle
- GitHub issue to start
- Recommended commands to run

**Environment** (deployment context):
- Branch name
- Deployment status (if applicable)
- Environment variables status

This becomes the handoff note read by `/starting-session`!

## Error Handling

**Uncommitted changes warning**:
```
⚠ Warning: Uncommitted changes detected
Proceed with commit? [Y/n]
```

**Merge conflicts detected**:
```
❌ Error: Merge conflicts detected
Resolve conflicts before committing
Run: git status
```

**Not authenticated with GitHub**:
```
❌ Error: Not authenticated with GitHub
Run: gh auth login
```

**Push failed (behind remote)**:
```
❌ Error: Push rejected (behind remote)
Run: git pull origin v2-pivot
Then retry: /saving-session
```

**No changes to commit**:
```
⚠ No changes detected
Working directory clean
```

## Related Commands

- `/starting-session` - Start-of-session companion (reads issue comments)
- `/gigaforge:testing-stripe-checkout` - Validate before saving
- `/gigaforge:checking-api-health` - Verify services before saving

## Best Practices

### When to Use This Command

**✅ Perfect Time**:
- Context window at 60-70% (before exhaustion)
- Clear stopping point (phase complete, milestone reached)
- After accomplishing session objectives
- Before switching tasks/projects

**✅ Indicators**:
- Multiple files changed (routes, components, docs)
- Clear unit of work completed
- Tests passing (or N/A for current phase)
- Ready to hand off to next session

**❌ Avoid**:
- Mid-task (incomplete work)
- Failing tests (unless expected for phase)
- Merge conflicts unresolved
- Experimental/uncommitted changes

### Commit Message Quality

**Good commit messages**:
- Clear type prefix (feat/fix/refactor/chore)
- Descriptive title (what was accomplished)
- Bulleted specifics (what changed)
- Migration phase reference
- Issue reference (GitHub tracking)

**Avoid**:
- Vague titles ("Update files", "Fix stuff")
- Missing specifics (what specifically changed?)
- No issue reference (loses tracking)
- Missing migration context

### Session Handoff Workflow

**End of Session**:
1. Validate: Run tests if needed (`/gigaforge:testing-stripe-checkout`)
2. Save: `/saving-session` (or `/saving-session --auto`)
3. Verify: Check commit, push, issue close/update
4. Done: Context is saved, handoff is documented

**Start of Next Session**:
1. Sync: `/starting-session`
2. Read: Recent closed issues show last session work
3. Plan: High priority issues show next work
4. Begin: Start with recommended task

## Notes

### Why No Separate Handoff File?

**Problem with local files**:
- Creates bloat (SESSION_SUMMARY.md, NEXT_SESSION.md, etc.)
- Requires cleanup (when to delete?)
- Not single source of truth (GitHub vs. local divergence)
- Extra maintenance overhead

**Solution: GitHub as handoff**:
- Issue comments = session summaries
- Commit messages = change details
- Single source of truth (GitHub)
- No local file cleanup needed
- `/starting-session` reads recent closed issues

### Why Skip Test Execution?

Tests may not be fully implemented during early migration phases. This command assumes:
- Tests were already run if applicable (e.g., `/gigaforge:testing-stripe-checkout`)
- Summary includes test status if relevant
- Pre-commit validation happens manually if needed

### Auto-Mode Guardrails

`--auto` mode still has safety checks:
- Won't push if conflicts detected
- Won't close issues without commit reference
- Won't overwrite unpushed commits
- Shows final summary for verification

Use `--auto` when confident, interactive mode when cautious.

### GigaForge Migration Context

**6-Phase Migration**:
1. Phase 1: Remove Clerk (Issue #2)
2. Phase 2: Deploy Strapi (Issue #3)
3. Phase 3: Integrate Strapi (Issue #4)
4. Phase 4: Stripe Webhooks (Issue #5)
5. Phase 5: Documentation (Issue #6)
6. Phase 6: Testing & Deployment (Issue #7)

**Branch Strategy**:
- `v2-pivot`: Development branch (all phases)
- `main`: Production (after Phase 6 complete)

**Deployment Targets**:
- Frontend: Vercel (gigaforge.xyz)
- CMS: Railway (Strapi + PostgreSQL)
- Payments: Stripe (webhooks to Vercel)

---

**Version**: 1.0.0 (GigaForge Custom)
**Updated**: 2025-11-18
**Part of**: GigaForge Dojo Session Management
**Pairs with**: `/starting-session` (session start)
**Repository**: Naturah/gigaforge-web
