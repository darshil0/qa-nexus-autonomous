# 🚶 QA Nexus Workflow Walkthrough

**Version**: 2.6.0
**Last Updated**: February 13, 2026

This guide provides a step-by-step walkthrough of the **QA Nexus Autonomous** user experience.

## 1. Initial Setup
Upon loading the application, you land on the **Orchestrator (Overview)** tab. 
- Ensure your `VITE_GEMINI_API_KEY` is configured.
- The status bar should indicate `IDLE`.

## 2. Requirement Ingestion
There are two ways to provide requirements:
- **Manual Input**: Type your project specifications directly into the large text area.
- **Jira Sync**: Enter a Jira issue key (e.g., `PROJ-123`) and click **Fetch**. The system will simulate pulling the summary and description into the workspace.

## 3. Launching the Multi-Agent Pipeline
Click the **"Start Workflow"** button. The system will sequentially trigger:
1.  **Agent 1**: Normalizes input and flags ambiguities.
2.  **Agent 2**: Generates a set of traceable test cases.
3.  **Agent 3**: Simulates an execution run and generates logs.

*Note: You can follow the AI's "Chain of Thought" in the **Thinking Log** at the bottom of the screen. In v2.6.0, you can see the agents calling multiple MCP tools (Jira, GitHub, Code Analysis) in real-time during this phase.*

## 4. Reviewing Specs (Agent 1 Tab)
Navigate to the **Specs** tab to see:
- Categorized requirements with Risk Classifications.
- Detected ambiguities that need human clarification.
- Traceability links to generated tests.

## 5. Reviewing Tests (Agent 2 Tab)
The **Tests** tab allows you to:
- Search through generated test cases.
- Filter tests by specific requirements.
- View detailed steps and expected outcomes.

## 6. Execution & Reporting (Agent 3 & Reports)
- **Results Tab**: View real-time logs for each test. Click "GitHub Issue" to simulate logging a bug.
- **Reports Tab**: View data visualizations (Recharts) showing Stability, Traceability, and Pass/Fail metrics.

## 7. System Reset
Use the **"Reset System"** button in the sidebar to clear all previous agent data and start a new session.
