---
description: Run all slash command tests
allowed-tools: [Bash]
---

# Testing All Commands

## Purpose
Executes the complete test suite for all slash commands in The Dojo. Validates command structure, documentation, and functionality.

## Usage
```bash
/testing-all-commands
```

## What This Tests
- Command file structure and frontmatter
- Required documentation sections
- Test case definitions
- Expected outputs and exit codes
- Script integrations (if applicable)

## Output
Displays test results for each command:
- ✅ Passed tests
- ❌ Failed tests with details
- 💥 Errors encountered
- Summary statistics

## Examples

### Example 1: Run all tests
```bash
/testing-all-commands
```

Output:
```
================================================================================
  COMMANDS TEST RESULTS
================================================================================

📦 validating-monetization (workflows)
   3/3 passed (0.12s)

📦 scraping-youtube-trending (web-scraping)
   2/2 passed (0.08s)

================================================================================
  SUMMARY
================================================================================
  Total tests:  5
  ✅ Passed:    5
  ❌ Failed:    0
  💥 Errors:    0
  ⏱️  Duration:  0.20s
================================================================================
```

## Implementation
Executes `test-runner.py --type commands`

## Related Commands
- `/testing-command [name]` - Test specific command
- `/testing-all-hooks` - Test all hooks
- `/testing-hook [name]` - Test specific hook

## Notes
- Tests validate structure, not actual execution (requires Claude Code runtime)
- All commands should have at least one test case
- Failed tests indicate missing or invalid test definitions
