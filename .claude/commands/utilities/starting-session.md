---
description: Session start - Load essential docs + sync GitHub issues + handoff context
argument-hint: [--labels label1,label2] [--show-closed] [--quick]
allowed-tools: [Bash, Read, Grep, Glob]
---

# Starting Session

## Purpose

Complete session start workflow: Load essential documentation + sync GitHub issues with smart priority detection + review handoff from previous session. This command ensures consistent onboarding for every Claude Code session.

**When to use**: At the start of every session.

## Workflow

### Phase 1: Essential Onboarding (Documentation Loading)

**Always Read (in order)**:

1. **CLAUDE.md** (auto-loaded by Claude Code, focus on these key sections):
   - Project Overview
   - Architecture
   - Tech Stack
   - Current Migration Status
   - Environment Variables
   - Development Workflow

2. **Conditional Reads** (based on work type):
   - **If working on Stripe**: Focus on Stripe Integration section
   - **If working on Strapi**: Focus on Content Types and Strapi setup
   - **If deploying**: Focus on Deployment sections

**Quick Mode** (`--quick` flag):
- Skip full doc reads
- Show 3-line summary per doc
- Proceed directly to GitHub sync

**Token Efficiency**:
- Core onboarding: ~8k tokens (CLAUDE.md + issues)
- With full context: ~15k tokens

---

### Phase 2: GitHub Issues & Handoff Context

## Usage

```bash
/starting-session
/starting-session --labels phase-1,phase-2
/starting-session --show-closed
/starting-session --quick
```

## Arguments

- `--labels` (optional) - Filter by specific labels (comma-separated), e.g., `--labels phase-1,stripe`
- `--show-closed` (optional) - Include recently closed issues in output (handoff context)
- `--quick` (optional) - Skip full doc reads, summary only (for mid-session refresh)
- `--state` (optional) - Filter by state: `open`, `closed`, `all` (default: `open`)

## Implementation Steps

### 1. Fetch Live GitHub Data

Use `gh` CLI to fetch issues (never read from local cache files):

```bash
# Fetch open issues
gh issue list --repo Naturah/gigaforge-web --limit 50 --json number,title,labels,state,body,assignees

# Fetch recently closed issues (for context)
gh issue list --repo Naturah/gigaforge-web --state closed --limit 5 --json number,title,labels,closedAt
```

If user provided `--labels`, filter:
```bash
gh issue list --repo Naturah/gigaforge-web --label "phase-1" --json number,title,labels,state
```

### 2. Cross-Reference with Project State

To detect completion status, check actual project files:

**Check package.json**:
```
Read: package.json
```
- Check if @clerk/remix still present (Phase 1 incomplete if yes)
- Verify dependencies match current phase

**Check Strapi service file**:
```
Read: app/services/strapi.server.ts
```
- Exists = Phase 3 in progress/complete
- Doesn't exist = Phase 2/3 not started

**Check webhook handler**:
```
Read: app/routes/api.stripe-webhook.ts
```
- Implementation present = Phase 4 progress/complete
- Stub only = Phase 4 not started

**Read current phase context**:
```
Read: CLAUDE.md
```
- Look for "Current Migration Status", "Phase X Complete"
- Use this to set priority levels

### 3. Categorize Issues

**HIGH PRIORITY** (current phase work):
- Issues #2-#7 (6-phase migration)
- Issues blocking deployment
- Issues with `high-priority` label

**MEDIUM PRIORITY** (next phase):
- Dependencies for high priority issues
- Documentation updates
- Testing improvements

**LOW PRIORITY** (future work):
- Enhancement requests
- Future feature ideas

**RECENTLY COMPLETED**:
- Recently closed issues with last comment (session handoff notes from `/saving-session`)
- Open issues where deliverables exist (mark "⚠️ SHOULD BE CLOSED")

### 4. Format and Display Output

Display formatted report directly to user (**no file writes**):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SESSION START - GigaForge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: Naturah/gigaforge-web
Branch: feature-clerk-auth-ui
Last Fetched: [timestamp] (live data)

📚 ESSENTIAL DOCS LOADED
  ✓ CLAUDE.md (architecture, migration status, tech stack)
  ✓ [Conditional docs based on work type]

🔴 HIGH PRIORITY (Migration - Current Work)
  #[num] - Phase [X]: [title] [OPEN/CLOSED]
      [brief from body]
      Status: [Ready | In progress | Blocked]
      Dependencies: [blockers if any]
      [if code exists]: ⚠️ Code exists, should close issue

🟡 MEDIUM PRIORITY (Next Phase)
  #[num] - [title] [OPEN]
      Dependencies: [blockers]

🟢 LOW PRIORITY (Future Work)
  #[num] - [title]

✅ RECENTLY COMPLETED (if --show-closed or auto-show last 2)
  #[num] - [title] [CLOSED]
      Completed: [date]

      Session Handoff (last comment from /saving-session):
      - [Accomplishment 1 from session]
      - [Accomplishment 2 from session]
      - System Status: [migration phase status]
      - Next: [Recommended next task from session]

  #[num] - [title] [OPEN - ⚠️ SHOULD BE CLOSED]
      Note: Implementation verified:
        ✅ [feature 1]
        ✅ [feature 2]
      Action: Close issue manually

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Open: [count]
Migration Progress: Phase [X] of 6
Current Branch: feature-clerk-auth-ui

Environment Variables Status:
  ✅ STRAPI_API_URL configured
  ✅ STRIPE_SECRET_KEY configured
  ⚠️ [any missing vars]

Recommended Next Task:
  Issue #[num] - [title with rationale]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ONBOARDING COMPLETE - Ready for Work
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 3: Ready for Work

You now have all context needed:
- ✓ Essential documentation loaded
- ✓ GitHub issues synced with priority
- ✓ Migration phase status verified
- ✓ Environment readiness checked
- ✓ Recommended next task identified

Begin with recommended task from summary.

---

## Examples

### Example 1: Full session start (most common)
```bash
/starting-session
```

**Flow**:
1. Loads CLAUDE.md key sections
2. Fetches live GitHub issues (#2-#7)
3. Checks migration status from code
4. Shows handoff from previous session
5. Displays priority categorization
6. Recommends next task

### Example 2: Quick refresh (mid-session)
```bash
/starting-session --quick
```

**Flow**:
- Skips full doc reads (just summaries)
- Fetches GitHub issues
- Quick status check
- Useful when context window is low

### Example 3: Focus on specific phase
```bash
/starting-session --labels phase-1,phase-2
```

**Output**: Shows only Phase 1 and Phase 2 issues, useful when working on sequential phases.

### Example 4: Include handoff context
```bash
/starting-session --show-closed
```

**Output**: Includes "RECENTLY COMPLETED" section showing last 5 closed issues with handoff comments from `/saving-session`.

## Smart Completion Detection

For each issue, check if work is complete even if issue remains open:

**Issue #2 (Phase 1 - Remove Clerk)**:
- Expected: @clerk/remix removed from package.json
- Check: `grep "@clerk/remix" package.json` returns nothing
- If not found: Mark "✅ COMPLETE" (suggest closing)

**Issue #3 (Phase 2 - Strapi)**:
- Expected: Strapi deployed, API accessible
- Check: STRAPI_API_URL in env, test connectivity
- If accessible: Mark "✅ COMPLETE"

**Issue #4 (Phase 3 - Strapi Integration)**:
- Expected: `app/services/strapi.server.ts` exists
- Check: File exists with complete implementation
- If exists: Mark "✅ COMPLETE"

**Issue #5 (Phase 4 - Webhook)**:
- Expected: `app/routes/api.stripe-webhook.ts` implemented
- Check: File has complete webhook handler
- If complete: Mark "✅ COMPLETE"

**Issue #6 (Phase 5 - Documentation)**:
- Expected: CLAUDE.md updated, README complete
- Check: Documentation sections present
- If updated: Mark "✅ COMPLETE"

**Issue #7 (Phase 6 - Testing)**:
- Expected: All tests passing, deployment verified
- Check: Test coverage, deployment status
- If passing: Mark "✅ COMPLETE"

## Output

This command **displays output directly** and **creates no files**. The formatted report helps you quickly decide what to work on this session.

**What you get**:
- Current priorities based on actual migration phase
- Issues that should be closed (work complete)
- Clear recommended next task
- Context from recently completed work (if requested)
- Environment variable status check

**What this command does NOT do**:
- ❌ Create `GITHUB_ISSUES_STATUS.md` file
- ❌ Create `GITHUB_ISSUES_STATUS.json` file
- ❌ Write any local cache files
- ❌ Modify GitHub issues

## Related Commands

- `/saving-session` - End-of-session companion (closes issues with handoff comments)
- `/gigaforge:testing-stripe-checkout` - Test Stripe integration
- `/gigaforge:checking-api-health` - Verify external services

## Session Lifecycle Integration

This command pairs with `/saving-session` to create a complete session workflow:

**END of Session** (`/saving-session`):
1. Commits changes with structured message
2. Pushes to GitHub
3. Closes/updates issues with summary comments containing:
   - Session accomplishments
   - Migration phase status
   - Next session recommendations

**START of Next Session** (this command):
1. Fetches live GitHub issues
2. Shows recently closed issues with their last comments
3. **Last comments = handoff notes from previous session**
4. Provides context and recommended next tasks

**Key Insight**: GitHub issue comments serve as session handoff notes (no extra local files needed). This command reads what `/saving-session` writes!

## Error Handling

**If gh CLI not installed**:
```
❌ Error: gh CLI not found
Install: https://cli.github.com/
Then authenticate: gh auth login
```

**If not authenticated**:
```
❌ Error: Not authenticated with GitHub
Run: gh auth login
```

**If no issues found**:
```
✅ No open issues found!
All GitHub issues are closed or repository has no issues.
```

## Notes

### CLI-First, Live Data, No Cache

This command exemplifies The Dojo's **CLI-first principle**:

**Why gh CLI?**
- ✅ Deterministic behavior (critical for automation)
- ✅ Battle-tested, stable
- ✅ Fast execution (<2 seconds)
- ✅ Easy to test and debug
- ✅ No authentication complexity (uses existing `gh auth`)
- ✅ Reliable in hooks and scripts

**Why no local cache?**
- ✅ GitHub is single source of truth
- ✅ No stale data
- ✅ No file sync overhead
- ✅ Simpler architecture
- ✅ Always current information

### Smart Context Awareness

Cross-referencing with project state provides:
- Detection of "done but not closed" issues
- Phase-aware priority (knows current vs. future)
- File existence verification
- Accurate status vs. GitHub issue state

### GigaForge-Specific Checks

**Environment Variables**:
- STRAPI_API_URL (required for Phase 3+)
- STRIPE_SECRET_KEY (always required)
- STRIPE_WEBHOOK_SECRET (required for Phase 4+)

**Migration Milestones**:
- Phase 1: Clerk removed from package.json
- Phase 2: Strapi accessible
- Phase 3: Strapi service implemented
- Phase 4: Webhook handler complete
- Phase 5: Documentation updated
- Phase 6: Tests passing, deployed

### Best Practices

- **Run at session start**: Align work with GitHub tracking
- **Use label filtering**: Focus on specific phases (`--labels phase-3`)
- **Include recent completions**: Context helps (`--show-closed`)
- **Close issues when done**: Keep GitHub accurate
- **Reference in commits**: `git commit -m "feat: X (#3)"`

### GitHub Issue Workflow

This command is part of GigaForge's GitHub-first tracking:
1. **GitHub Issues** = detailed task tracking (source of truth)
2. **Session summaries** = historical record
3. **This command** = live viewer with smart context

---

**Version**: 1.0.0 (GigaForge Custom)
**Updated**: 2025-11-18
**Part of**: GigaForge Dojo Session Management
**Pairs with**: `/saving-session` (session end)
**Repository**: Naturah/gigaforge-web
