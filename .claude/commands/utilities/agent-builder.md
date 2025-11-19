---
description: Generate sub-agents from templates with proper structure and validation
argument-hint: --name "agent-name" --category orchestrator|specialist|support --description "Brief description" [--tools "Read, Write, Task"] [--model opus|sonnet|haiku]
allowed-tools: Read, Write, Edit, Glob
---

# Agent Builder

## Purpose

Generates new sub-agent files from templates following The Dojo's agent architecture. Automatically creates the agent markdown file from the appropriate template (orchestrator, specialist, or support) with proper YAML frontmatter and structured instructions.

**When to use**: Creating any new sub-agent for parallelization, context optimization, or specialized domain expertise.

## Usage

```bash
/utilities:agent-builder \
  --name "agent-name" \
  --category orchestrator|specialist|support \
  --description "Brief description" \
  [--tools "Read, Write, Task"] \
  [--model opus|sonnet|haiku]
```

## Arguments

- `--name` (required) - Agent identifier in kebab-case (e.g., "research-orchestrator", "youtube-specialist", "result-aggregator")
- `--category` (required) - Agent category: `orchestrator`, `specialist`, or `support`
- `--description` (required) - One-line description of when/why to use this agent
- `--tools` (optional) - Comma-separated tool list (default based on category)
- `--model` (optional) - AI model: `opus`, `sonnet`, `haiku`, or `inherit` (default based on category)

## Naming Convention

### Agent Naming Patterns

**Orchestrators** (Coordination agents):
- Pattern: `[domain]-orchestrator`
- Examples: `research-orchestrator`, `monetization-orchestrator`, `content-orchestrator`

**Specialists** (Domain experts):
- Pattern: `[domain]-specialist`
- Examples: `research-specialist`, `youtube-specialist`, `asset-production-specialist`

**Support** (Utility agents):
- Pattern: `[function]-[type]`
- Examples: `result-aggregator`, `quality-validator`, `query-clarifier`

### Validation Rules

**✅ Good Names**:
- `research-orchestrator` - Clear domain, correct suffix
- `youtube-specialist` - Specific platform, specialist role
- `result-aggregator` - Function + type pattern

**❌ Avoid**:
- `helper` - Too vague
- `ResearchAgent` - Use kebab-case, not PascalCase
- `research_orchestrator` - Use hyphens, not underscores

## Default Tool Permissions

**Orchestrators**:
- Default: `Read, Write, Task, TodoWrite`
- Rationale: Coordination requires spawning agents (Task) and tracking progress (TodoWrite)

**Specialists**:
- Default: `Read, Write, Bash, Task`
- Rationale: Execute commands (Bash), invoke other specialists if needed (Task)

**Support**:
- Default: `Read, Write`
- Rationale: Lightweight processing, minimal side effects

## Default Model Selection

**Orchestrators**:
- Default: `opus`
- Rationale: Complex coordination logic requires most capable model

**Specialists**:
- Default: `sonnet`
- Rationale: Focused domain tasks, balance of capability and cost

**Support**:
- Default: `sonnet`
- Rationale: Utility functions, consistent with specialists

## Examples

### Example 1: Create Research Orchestrator

```bash
/utilities:agent-builder \
  --name "research-orchestrator" \
  --category orchestrator \
  --description "Use PROACTIVELY for multi-platform research. Orchestrates parallel research across YouTube, Reddit, Medium."
```

**Output**:
- Creates: `.claude/agents/orchestrators/research-orchestrator.md`
- Template: `orchestrator-template.md`
- Tools: `Read, Write, Task, TodoWrite` (default)
- Model: `opus` (default)

---

### Example 2: Create YouTube Specialist

```bash
/utilities:agent-builder \
  --name "youtube-specialist" \
  --category specialist \
  --description "Executes YouTube research and video downloading. Invokes scraping commands."
```

**Output**:
- Creates: `.claude/agents/specialists/youtube-specialist.md`
- Template: `specialist-template.md`
- Tools: `Read, Write, Bash, Task` (default)
- Model: `sonnet` (default)

---

### Example 3: Create Result Aggregator (Custom Tools)

```bash
/utilities:agent-builder \
  --name "result-aggregator" \
  --category support \
  --description "Use PROACTIVELY after parallel research completes. Consolidates findings from multiple specialists." \
  --tools "Read, Write" \
  --model sonnet
```

**Output**:
- Creates: `.claude/agents/support/result-aggregator.md`
- Template: `support-template.md`
- Tools: `Read, Write` (explicit)
- Model: `sonnet` (explicit)

---

### Example 4: Create with Model Inheritance

```bash
/utilities:agent-builder \
  --name "quality-validator" \
  --category support \
  --description "Validates output quality and scoring. Use for quality gates between workflow stages." \
  --model inherit
```

**Output**:
- Creates: `.claude/agents/support/quality-validator.md`
- Model: `inherit` (matches main conversation model)

---

## Implementation Steps

When invoked, this command:

### 1. Validate Input

**Name Validation**:
- Check kebab-case format (lowercase with hyphens)
- Verify appropriate suffix/pattern for category
- Reject vague names (helper, utils, agent)

**Category Validation**:
- Must be: `orchestrator`, `specialist`, or `support`
- Reject invalid categories

**Description Validation**:
- Non-empty string
- Recommend including "Use PROACTIVELY" for automatic delegation

---

### 2. Determine Directory Structure

**Agent Directory** (progressive disclosure pattern):
```
.claude/agents/{category}s/{name}/
├── AGENT.md              # Entry point (<200 lines, core workflow)
├── reference/            # Detailed docs (loaded as needed)
│   ├── protocols.md      # Communication formats
│   ├── examples.md       # Usage scenarios
│   └── [domain].md       # Domain-specific details (optional)
└── scripts/              # Executable scripts (executed, not loaded)
    └── [script].sh       # Deterministic operations (optional)

Examples:
- orchestrator → .claude/agents/orchestrators/research-orchestrator/
- specialist → .claude/agents/specialists/youtube-specialist/
- support → .claude/agents/support/result-aggregator/
```

**Template Directory**:
```
.claude/_agent-templates/{category}/
├── AGENT.md              # Core template
├── reference/
│   ├── protocols-template.md
│   └── examples-template.md
└── scripts/
    └── README.md
```

---

### 3. Load Template

**Read appropriate template**:
```bash
Read: .claude/_agent-templates/{category}/AGENT.md
Read: .claude/_agent-templates/{category}/reference/protocols-template.md
Read: .claude/_agent-templates/{category}/reference/examples-template.md
```

**Replace placeholders** (in all template files):
- `[agent-name]` → User-provided name
- `[domain]` → Extracted from name (e.g., "research" from "research-orchestrator")
- `name:` in frontmatter → User-provided name
- `description:` in frontmatter → User-provided description
- `tools:` in frontmatter → User-provided or default tools
- `model:` in frontmatter → User-provided or default model
- `references:` in frontmatter → List of reference/*.md files

---

### 4. Create Agent Directory Structure

**Create directories**:
```bash
mkdir -p .claude/agents/{category}s/{name}/reference
mkdir -p .claude/agents/{category}s/{name}/scripts
```

**Write populated files**:
```bash
Write: .claude/agents/{category}s/{name}/AGENT.md
Content: [Populated AGENT template with replacements]

Write: .claude/agents/{category}s/{name}/reference/protocols.md
Content: [Populated protocols template with placeholders]

Write: .claude/agents/{category}s/{name}/reference/examples.md
Content: [Populated examples template with stub scenarios]

Write: .claude/agents/{category}s/{name}/scripts/README.md (optional)
Content: [Script guidelines if applicable]
```

**Frontmatter Update** (in AGENT.md):
```yaml
---
name: {agent-name}
description: {user-description}
tools: {tool-list}
model: {model}
references:
  - reference/protocols.md
  - reference/examples.md
scripts:
  - scripts/{script-name}.sh (if applicable)
---
```

---

### 5. Confirm Creation

**Display output**:
```
✅ Agent created successfully with progressive disclosure structure!

Directory: .claude/agents/{category}s/{name}/
Files created:
  - AGENT.md (entry point, <200 lines)
  - reference/protocols.md (communication formats)
  - reference/examples.md (usage scenarios)
  - scripts/ (optional executables)

Template: {category}-template/
Tools: {tool-list}
Model: {model}

Next steps:
1. Edit AGENT.md to customize core workflow:
   - Quick Start procedure (3-5 phases)
   - Decision framework (when to X vs Y)
   - Integration summary (who uses this agent)
2. Expand reference/protocols.md with:
   - Input/output JSON schemas
   - Communication formats
   - Error handling patterns
3. Add concrete examples to reference/examples.md:
   - 3-5 complete workflows with input/output
   - Success scenarios and error cases
4. Create scripts/ if deterministic operations needed:
   - Validation scripts
   - Quality scoring calculators
   - Data transformers
5. Test agent invocation with natural language
6. Update .claude/agents/README.md with new agent

Progressive Disclosure Benefits:
✅ Fast loading: AGENT.md <200 lines (entry point only)
✅ Context efficiency: References loaded only when needed
✅ Token savings: Scripts executed, not loaded into context
✅ Scalable: Add new references without bloating core agent

Test invocation:
"[Natural language prompt based on description]"
```

---

## Output

### Agent File Structure

All generated agents follow this structure:

```markdown
---
name: {agent-name}
description: {user-description}
tools: {tool-list}
model: {model-selection}
---

# {Agent Name in Title Case}

[Template-specific content with placeholders replaced]

## Core Responsibilities
[Category-specific sections]

## Workflow/Procedure
[Detailed instructions]

## Communication Protocol
[Input/output schemas]

## Integration
[How this agent is used]

## Examples
[Usage scenarios]

## Notes
[Template usage instructions]
```

---

## Template Customization Guide

After agent creation, customize these sections:

### Orchestrators
1. **Workflow Phases**: Define 3+ stage workflow (Planning → Execution → Synthesis)
2. **Specialist Allocation**: List which specialists to spawn and when
3. **Decision Framework**: Rules for parallel vs sequential execution
4. **Quality Gates**: Thresholds and validation between phases

### Specialists
1. **Execution Procedure**: 3-step pattern (Validate → Execute → Format)
2. **Command Integration**: List specific commands this specialist invokes
3. **Error Handling**: Retry logic, fallback strategies
4. **Domain Logic**: Platform-specific or operation-specific procedures

### Support
1. **Processing Logic**: Validation, transformation, aggregation steps
2. **Quality Standards**: Scoring algorithms, thresholds
3. **Integration**: How orchestrators/specialists invoke this agent
4. **Error Handling**: Input validation, graceful failures

---

## Agent Architecture Reference

### Orchestrator Pattern
**Purpose**: Coordinate multi-agent workflows

**Typical Flow**:
```
1. User invokes orchestrator (natural language or command)
2. Orchestrator plans execution (which specialists needed)
3. Orchestrator spawns specialists in parallel
4. Specialists execute tasks independently
5. Orchestrator aggregates results (via support agent)
6. Orchestrator validates quality (via support agent)
7. Orchestrator returns final output
```

**Example**: `research-orchestrator` spawns `youtube-specialist`, `reddit-specialist`, `medium-specialist` in parallel

---

### Specialist Pattern
**Purpose**: Execute focused domain tasks

**Typical Flow**:
```
1. Orchestrator invokes specialist with parameters
2. Specialist validates input
3. Specialist executes command(s) (e.g., /scraping-youtube-trending)
4. Specialist formats results as JSON
5. Specialist returns structured output to orchestrator
```

**Example**: `youtube-specialist` invokes `/scraping-youtube-trending` and formats results

---

### Support Pattern
**Purpose**: Pre/post-processing, validation, aggregation

**Typical Flow**:
```
1. Orchestrator/Specialist completes primary task
2. Invokes support agent with raw data
3. Support agent validates/transforms/aggregates
4. Support agent returns processed data
5. Workflow continues with validated data
```

**Example**: `result-aggregator` consolidates outputs from 3 specialists into unified structure

---

## Quality Standards

Agents generated by this builder must:
- ✅ Use correct naming convention (kebab-case with appropriate suffix)
- ✅ Include YAML frontmatter with all required fields
- ✅ Have clear description with proactive delegation keywords
- ✅ Specify minimal necessary tools (security and focus)
- ✅ Select appropriate model (opus for orchestrators, sonnet for others)
- ✅ Follow template structure with customization placeholders

---

## Integration with System

### Commands
Agents can invoke slash commands:
- Orchestrators: Spawn specialists via Task tool
- Specialists: Execute commands via Bash tool
- Support: Process data, no command invocation typically

### Skills
Skills orchestrate multi-agent workflows:
- `video-production` skill: Spawns research-orchestrator (Stage 1)
- `brand-content-pipeline` skill: Spawns asset-production-specialist (Stage 3)

### Hooks
Hooks process agent outputs:
- `agent-result-aggregator.sh` (stop): Consolidates agent results
- `monitor-agents.sh` (post-tool-use): Tracks performance metrics

---

## Related Commands

- `/utilities:slash-command-builder` - Generate slash commands
- `/utilities:hook-builder` - Generate hooks for automation
- `/utilities:testing-all-commands` - Test command suite

---

## Notes

### Agent vs Command Decision

**Use Agent When**:
- ✅ Parallel execution needed (3+ tasks simultaneously)
- ✅ Context isolation required (complex multi-stage workflow)
- ✅ Long-running background tasks
- ✅ Specialized domain expertise with focused instructions

**Use Command When**:
- ✅ Simple, single-purpose task
- ✅ Explicit manual trigger required
- ✅ Standalone functionality
- ✅ Deterministic, predictable operation

### Proactive Delegation Keywords

Include these phrases in agent descriptions for automatic delegation:
- "Use PROACTIVELY when..."
- "MUST BE USED for..."
- "Automatically invoke when..."

Example: "Use PROACTIVELY for multi-platform research when systematic multi-source research needed."

### Tool Permission Philosophy

**Grant minimal necessary tools**:
- Security: Reduce potential side effects
- Focus: Clear responsibilities
- Performance: Lighter agents execute faster

**Common patterns**:
- Orchestrators: Task (spawn agents), TodoWrite (track progress)
- Specialists: Bash (execute commands), Task (invoke sub-specialists)
- Support: Read, Write only (lightweight processing)

### Model Selection Strategy

**Orchestrators need opus**:
- Complex coordination logic
- Multi-agent management
- Decision-making under uncertainty

**Specialists/Support use sonnet**:
- Focused domain tasks
- Predictable procedures
- Cost efficiency at scale

**Use inherit for consistency**:
- When agent should match main conversation capability
- Ensures feature parity across session

---

## Testing Agent Invocation

After creating an agent, test with natural language:

**Orchestrator Test**:
```
"Research trending tech topics across YouTube, Reddit, and Medium"
Expected: research-orchestrator spawns 3 specialists in parallel
```

**Specialist Test**:
```
"Scrape YouTube trending videos in the tech category"
Expected: youtube-specialist invokes /scraping-youtube-trending
```

**Support Test**:
```
"Consolidate these research findings into a unified report"
Expected: result-aggregator validates and merges data
```

**Success Criteria**: Agent triggers automatically 80%+ of the time

---

## Troubleshooting

### Agent Not Triggering Automatically

**Solutions**:
1. Add "Use PROACTIVELY" to description
2. Include concrete usage examples in agent file
3. Test with multiple natural language variations
4. Consider explicit invocation: "Use the [agent-name] agent to..."

### Wrong Tools Granted

**Solutions**:
1. Edit agent file frontmatter: `tools: Read, Write` (minimal set)
2. Verify category defaults align with agent needs
3. Test agent invocation to confirm tool access sufficient

### Template Customization Incomplete

**Solutions**:
1. Search for `[placeholder]` syntax in agent file
2. Replace with domain-specific content
3. Review template usage instructions at end of agent file
4. Add 3-5 concrete examples before testing

---

**Version**: 1.0.0
**Category**: Meta-Utilities
**Created**: 2025-10-29
**Part of**: The Dojo Phase 6 - Sub-Agent Integration

**Related Documentation**:
- `.claude/agents/README.md` - Agent architecture overview
- `docs/agents-catalog.md` - Complete agent reference
- `docs/evolution-strategy.md` - Phase 6 implementation plan
