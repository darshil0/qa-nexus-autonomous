# QA Nexus Autonomous

An autonomous, multi-agent pipeline designed to transform raw product requirements into fully validated test suites and execution reports using Google Gemini.

## 🚀 Overview
QA Nexus removes the manual bottleneck in quality assurance by orchestrating three specialized AI agents to handle requirements analysis, test design, and execution simulation in a single continuous flow.

## 🛠 Tech Stack
- **Frontend:** React (ES6 Modules)
- **AI Core:** Google Gemini API (`@google/genai`)
- **Styling:** Tailwind CSS
- **Visualization:** Recharts
- **Icons:** Lucide React

## 🧬 Architecture
1. **Orchestrator:** Manages state and agent handoffs.
2. **Agent 1 (Reviewer):** Cleanses and validates requirements.
3. **Agent 2 (Writer):** Authors traceable test scenarios.
4. **Agent 3 (Executor):** Simulates execution and logs defects.

## 📥 Setup
Ensure your environment variable `API_KEY` is configured with a valid Google Gemini API key.

```bash
# Conceptually (Standard Web App)
npm install
npm run dev
```

## 🔒 Security
- **Least Privilege:** Each agent operates on a strict subset of data.
- **RBAC:** Integrated role-based access control for integration points (Jira/GitHub).