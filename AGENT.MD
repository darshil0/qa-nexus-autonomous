# Agent Intelligence Profiles

QA Nexus Autonomous leverages a tiered intelligence model where distinct Gemini-powered agents handle specialized stages of the QA lifecycle.

## Agent 1: Requirements Reviewer
**Model:** `gemini-3-pro-preview`  
**Core Responsibility:** Semantic Analysis & Validation.
- **Input:** Raw PRD text, user stories, or Jira ticket exports.
- **Cognitive Task:** Identifies logical gaps, technical contradictions, and missing edge cases.
- **Output:** Validated Requirements Specification (JSON) with risk classifications and structured acceptance criteria.

## Agent 2: Test Case Writer
**Model:** `gemini-3-pro-preview`  
**Core Responsibility:** Test Architecture & Strategy.
- **Input:** Validated Specifications from Agent 1.
- **Cognitive Task:** Maps requirements to functional, boundary, and negative test scenarios. Evaluates automation candidacy based on complexity and repetition.
- **Output:** Traceable Test Case suite with clear preconditions, steps, and oracles.

## Agent 3: Test Executor
**Model:** `gemini-3-flash-preview`  
**Core Responsibility:** Validation & Reporting.
- **Input:** Generated Test Suite.
- **Cognitive Task:** Simulates runtime environments, generates synthetic execution logs, and determines Pass/Fail status based on the "Oracle Assertion."
- **Output:** Execution results with integrated defect reporting capabilities.