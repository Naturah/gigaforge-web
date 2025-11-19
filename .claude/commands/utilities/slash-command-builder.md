---
description: Generate new slash commands from templates with proper naming conventions
argument-hint: --name command-name --description "Brief description" --category category [--script path]
allowed-tools: [Write, Read, Bash]
---

# Slash Command Builder

## Purpose
Generates new slash command files following The Dojo's best practices and naming conventions. Automatically creates the command markdown file, test file, and updates the slash-command-index.md.

## Usage
```bash
/slash-command-builder --name "command-name" --description "Brief description" --category "category" [--script "path/to/script.py"]
```

## Arguments
- `--name` (required) - Command name in gerund form (e.g., "processing-videos", "validating-monetization")
- `--description` (required) - Brief one-line description for autocomplete
- `--category` (required) - Category: utilities, workflows, brand-content, web-scraping, video-processing, image-processing, data-ops, knowledge
- `--script` (optional) - Path to Python script if command wraps executable code

## Naming Convention Validation
The builder enforces gerund form naming:

**✅ Good Examples:**
- `processing-videos`
- `validating-monetization`
- `applying-brand-voice`
- `scraping-youtube-trending`
- `optimizing-thumbnails`

**✅ Acceptable Alternatives:**
- Noun phrases: `video-processing`, `monetization-validation`
- Action-oriented: `process-videos`, `validate-monetization`

**❌ Avoid:**
- Vague names: `helper`, `utils`, `tools`
- Overly generic: `documents`, `data`, `files`
- Reserved words: `anthropic-helper`, `claude-tools`
- Inconsistent patterns

## Examples

### Example 1: Simple workflow command
```bash
/slash-command-builder \
  --name "validating-monetization" \
  --description "Validate project monetization potential with 4-dimension scoring" \
  --category "workflows"
```

### Example 2: Command with Python script
```bash
/slash-command-builder \
  --name "scraping-youtube-trending" \
  --description "Scrape YouTube trending videos by category" \
  --category "web-scraping" \
  --script "scripts/custom-scripts/web-scraping/youtube_trending.py"
```

### Example 3: Knowledge framework command
```bash
/slash-command-builder \
  --name "applying-storytelling" \
  --description "Apply storytelling frameworks (Hero's Journey, 3-Act, Story Spine)" \
  --category "knowledge"
```

## Output
Creates three files:

1. **Command file**: `.claude/commands/{category}/{name}.md`
   - Frontmatter with metadata
   - Comprehensive instructions
   - Usage examples
   - Related commands section

2. **Test file**: `scripts/test-framework/tests/{name}.test.json`
   - Test case structure
   - Expected outputs
   - Exit codes

3. **Updates index**: `docs/slash-command-index.md`
   - Adds command to appropriate category
   - Includes brief description

## Command Template Structure

The generated command file follows this structure:

```markdown
---
description: [Brief description from argument]
argument-hint: [Generated based on command type]
allowed-tools: [Auto-detected based on --script flag]
---

# [Command Name in Title Case]

## Purpose
[Expanded description of what this command does and when to use it]

## Usage
/[command-name] [args]

## Arguments
[Auto-generated argument documentation]

## Examples

### Example 1: Basic usage
[Auto-generated example]

## Output
[What the user can expect to see]

## Related Commands
[Empty section for manual population]

## Script Integration
[If --script provided, documents script path and invocation]

## Notes
[Best practices, limitations, caveats]
```

## Test Template Structure

The generated test file follows this structure:

```json
{
  "command": "command-name",
  "category": "category",
  "description": "Brief description",
  "tests": [
    {
      "name": "Basic functionality test",
      "input": "[example args]",
      "expected_output_contains": ["keyword1", "keyword2"],
      "expected_exit_code": 0
    }
  ],
  "script_path": "path/to/script.py",
  "hooks_triggered": []
}
```

## Implementation Steps

When invoked, this command:

1. **Validates naming convention**
   - Checks if name follows gerund form
   - Warns if using alternative patterns
   - Rejects vague/generic names

2. **Creates command file**
   - Generates markdown with frontmatter
   - Includes comprehensive template sections
   - Adds script integration if --script provided

3. **Creates test file**
   - Generates JSON test structure
   - Includes basic test case
   - Documents script path if applicable

4. **Updates documentation**
   - Adds entry to slash-command-index.md
   - Sorts alphabetically within category
   - Includes brief description

5. **Confirms creation**
   - Displays file paths created
   - Shows next steps (edit details, add tests)
   - Suggests related commands to link

## Related Commands
- `/hook-builder` - Generate hooks for automation
- `/testing-command [name]` - Test a specific command
- `/testing-all-commands` - Run all command tests

## Quality Standards

Commands generated by this builder must:
- ✅ Follow gerund naming convention (or acceptable alternatives)
- ✅ Include comprehensive documentation
- ✅ Have at least one test case
- ✅ Be added to slash-command-index.md
- ✅ Include usage examples
- ✅ Document related commands (after creation)

## Notes

**Naming Philosophy**: Gerund form (verb + -ing) clearly indicates action and intent. "processing-videos" is more descriptive than "videos" and more natural than "process-videos".

**Category Organization**: Categories help with discovery and maintenance. Choose the most specific category that fits the command's primary purpose.

**Script Integration**: If wrapping Python scripts, document the script path clearly. Users should understand that the command invokes external code.

**Testing First**: Every command needs tests. The builder creates a basic test structure to encourage test-driven development.

**Progressive Enhancement**: Start with the generated template, then enhance with specific examples, edge cases, and related command links.
