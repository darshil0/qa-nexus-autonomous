# QA Nexus Gemini Skills Registry (v3.0.1)

**Version**: 3.0.1
**Last Updated**: February 20, 2026

This project implements a modular skills architecture specifically designed for Google Gemini 3 models. The system enables AI agents to access specialized capabilities through a standardized interface.

## Architecture Philosophy

The skills system is inspired by industry best practices for AI agent capabilities, featuring:
- **Portable Definitions**: Each skill uses YAML frontmatter for metadata
- **Standardized Documentation**: Consistent SKILL.md format across all skills
- **Executable Scripts**: Organized, testable code per skill
- **Clear Separation**: Each skill is self-contained and independently testable

### Design Principles

1. **Modularity**: Skills can be added, removed, or modified independently
2. **Discoverability**: Agents can query available skills via Model Context Protocol (MCP)
3. **Gemini Optimization**: Each skill is designed for Gemini 3's specific capabilities
4. **Educational Value**: Skills serve as learning resources for AI engineering patterns

---

## Available Skills

### [Requirements Reviewer](./skills/requirements-reviewer/SKILL.md)
**Purpose**: Analyzes software requirements for clarity, completeness, and testability.

**Key Capabilities**:
- Gap detection in specifications
- Ambiguity identification
- Risk classification (Critical, High, Medium, Low)
- Acceptance criteria validation

**Use Cases**:
- Pre-development requirement validation
- Stakeholder communication improvement
- Test case planning foundation

---

### [Test Case Writer](./skills/test-case-writer/SKILL.md)
**Purpose**: Generates structured test cases from reviewed requirements.

**Key Capabilities**:
- Automated test case generation
- Priority assignment (P0-P3)
- Requirement traceability
- Multiple test scenario coverage (happy path, negative, edge cases)

**Use Cases**:
- Rapid test suite creation
- Coverage gap analysis
- Regression test planning

---

### [Test Executor](./skills/test-executor/SKILL.md)
**Purpose**: Simulates the execution of test cases and reports results.

**Key Capabilities**:
- Realistic execution simulation
- Detailed failure logging
- Metrics calculation (pass rate, duration, coverage)
- Integration with issue tracking

**Use Cases**:
- Pre-execution validation
- Test suite quality assessment
- Performance benchmarking

---

### [Gemini Knowledge Base](./skills/gemini-knowledge-base/SKILL.md)
**Purpose**: Provides technical details and prompt optimization for Gemini 3 models.

**Key Capabilities**:
- Model selection guidance (Pro vs Flash)
- Token limit management
- Structured output optimization
- Multi-modal capability reference

**Use Cases**:
- Model configuration decisions
- Prompt engineering optimization
- Context window management
- Performance tuning

---

### [Tiny GPT](./skills/tiny-gpt/SKILL.md)
**Purpose**: Dependency-free Python GPT implementation for educational and reference purposes.

**Key Capabilities**:
- Pure Python transformer architecture
- Autograd engine demonstration
- Attention mechanism implementation
- Training loop visualization

**Use Cases**:
- Educational reference for AI concepts
- Architecture understanding
- Research and experimentation
- Baseline performance comparison

**Attribution**: Based on educational work by Andrej Karpathy ([@karpathy](https://github.com/karpathy))  
**License**: MIT (as per original nanoGPT project)

---

## Skill Structure

Each skill follows this standard structure:

```
skills/
└── skill-name/
    ├── SKILL.md           # Documentation with YAML frontmatter
    ├── scripts/           # Executable code (optional)
    │   └── script.py
    └── examples/          # Usage examples (optional)
        └── example.md
```

### SKILL.md Format

All skills use YAML frontmatter for metadata:

```yaml
---
name: skill-name
description: Brief description of what this skill does
version: 1.0.0
author: QA Nexus Team
requires: 
  - python: ">=3.8"
  - dependencies: []
---
```

Followed by markdown documentation with:
- **Purpose**: What the skill does
- **Instructions**: How to use it
- **Examples**: Sample usage
- **Configuration**: Any required setup

---

## Integration with Gemini

### Model Context Protocol (MCP)

Skills are exposed to Gemini agents through the Model Context Protocol:

1. **Discovery**: Agents query available skills via `tools/list`
2. **Invocation**: Agents call skills via `tools/call` with parameters
3. **Response**: Skills return structured results
4. **Feedback**: Results inform agent reasoning and next actions

### Gemini-Specific Optimizations

Skills are designed with Gemini 3's capabilities in mind:

- **Structured Output**: Skills expect and return JSON-formatted data
- **Context Efficiency**: Minimize token usage through concise prompts
- **Multi-Turn Support**: Skills maintain state across agent iterations
- **Error Handling**: Graceful degradation for API limits or failures

---

## Adding New Skills

### Step 1: Create Skill Directory

```bash
mkdir -p skills/my-skill/scripts
```

### Step 2: Write SKILL.md

Create `skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: What this skill does
version: 1.0.0
---

# My Skill

## Purpose
Describe what problem this skill solves.

## Instructions
1. How to invoke the skill
2. Required parameters
3. Expected output format

## Examples
Provide usage examples here.
```

### Step 3: Implement Logic (Optional)

If the skill requires executable code:

```python
# skills/my-skill/scripts/my_skill.py

def execute(param1: str, param2: int):
    """
    Main execution function.
    
    Args:
        param1: Description
        param2: Description
        
    Returns:
        Structured result dictionary
    """
    # Implementation here
    return {"status": "success", "data": result}
```

### Step 4: Register in Service

Add to `src/services/agenticSkills.ts`:

```typescript
export const mySkill: Skill = {
  name: "my_skill",
  description: "What this skill does",
  parameters: {
    param1: "Description of param1",
    param2: "Description of param2"
  },
  execute: async (param1: string, param2: number) => {
    // Implementation
    const output = { param1, param2 }; // replace with real logic
    return { status: "success", data: output };
  }
};

// Add to registry
export const skillRegistry: Record<string, Skill> = {
  // ... existing skills
  my_skill: mySkill,
};
```

### Step 5: Update Documentation

1. Add skill to this Skills.MD registry
2. Update AGENT.md if the skill changes agent capabilities
3. Add examples to README.md if relevant

---

## Testing Skills

All skills should be testable in isolation:

```typescript
// src/__tests__/skills/mySkill.spec.ts

import { mySkill } from '@/services/agenticSkills';
import { expect, test } from 'vitest';

test('mySkill executes successfully', async () => {
  const result = await mySkill.execute('test', 42);
  
  expect(result.status).toBe('success');
  expect(result.data).toBeDefined();
});

test('mySkill handles invalid input', async () => {
  const result = await mySkill.execute('', -1);
  
  expect(result.status).toBe('error');
  expect(result.message).toContain('Invalid input');
});
```

---

## Skill Versioning

Skills follow semantic versioning:
- **Major (X.0.0)**: Breaking changes to interface or behavior
- **Minor (1.X.0)**: New capabilities, backward compatible
- **Patch (1.0.X)**: Bug fixes, no interface changes

Current versions:
- Requirements Reviewer: 1.0.0
- Test Case Writer: 1.0.0
- Test Executor: 1.0.0
- Gemini Knowledge Base: 1.0.0
- Tiny GPT: 1.0.0

---

## Performance Considerations

### Token Efficiency
- Skills should minimize token usage in prompts and responses
- Use concise descriptions and structured data
- Avoid verbose explanations in responses

### Latency
- Skills should execute quickly (<2 seconds typical)
- Async operations should be used for I/O
- Cache frequently accessed data where appropriate

### Reliability
- Skills must handle errors gracefully
- Provide meaningful error messages
- Never fail silently

---

## Security & Best Practices

### Input Validation
All skills must validate input parameters:
- Type checking
- Range validation
- Sanitization of user input
- Prevention of injection attacks

### Error Handling
Skills should use consistent error patterns:

```typescript
interface SkillResult {
  status: 'success' | 'error';
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### Resource Management
- Clean up resources after execution
- Avoid memory leaks
- Handle API rate limits appropriately

---

## Related Documentation

- [AGENT.md](../AGENT.md) - Agent architecture and implementation
- [README.md](../README.md) - Project overview and setup
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System architecture
- [CHANGELOG.md](../CHANGELOG.md) - Version history

---

## Questions & Support

For questions about skills:
1. Check skill's SKILL.md documentation
2. Review examples in the skill directory
3. See AGENT.md for integration patterns
4. Open GitHub issue for bugs or feature requests

---

**Maintained by**: Darshil  
**License**: MIT  
**Last Updated**: February 14, 2026
