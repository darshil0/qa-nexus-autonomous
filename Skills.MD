# QA Nexus Gemini Skills Registry (v2.10.0)

This project implements the [Anthropic Agent Skills](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) standard, optimized for Google Gemini 3.

## Available Skills

### [Requirements Reviewer](./skills/requirements-reviewer/SKILL.md)
Analyzes software requirements for clarity, completeness, and testability.

### [Test Case Writer](./skills/test-case-writer/SKILL.md)
Generates structured test cases from reviewed requirements.

### [Test Executor](./skills/test-executor/SKILL.md)
Simulates the execution of test cases and reports results.

### [Gemini Knowledge Base](./skills/gemini-knowledge-base/SKILL.md)
Provides technical details and prompt optimization for Gemini 3 models.

### [Tiny GPT](./skills/tiny-gpt/SKILL.md)
Dependency-free Python GPT implementation for educational and reference purposes.

## Structure
Following the official guide:
- `skills/`: Contains all portable skill definitions.
- `skills/<skill-name>/SKILL.md`: Core instructions and YAML frontmatter.
- `skills/<skill-name>/scripts/`: Executable assets used by the skill.
