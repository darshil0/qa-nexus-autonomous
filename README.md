# QA Nexus Autonomous

> A multi-agent AI orchestrator powered by Google Gemini 2.5 that automates the end-to-end QA lifecycle—from requirements analysis and ambiguity detection to traceable test case generation and integrated execution tracking.

![Version](https://img.shields.io/badge/version-3.2.7-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![Release](https://img.shields.io/badge/release-june%2024-blue.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Development Workflow](#development-workflow)
- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Contributing](#contributing)

---

## 🌟 Overview

QA Nexus Autonomous is a state-of-the-art multi-agent AI system designed to automate the complete software testing lifecycle. By combining multiple specialized agents into a cohesive workflow, the system transforms raw requirements into executable, verified test suites powered by Google Gemini 2.5.

### Core Workflow

1.  **🔍 Agent 1: Requirements Reviewer**: Analyzes requirements for completeness, clarity, and risk.
2.  **✍️ Agent 2: Test Case Writer**: Generates comprehensive, prioritized test cases with full traceability.
3.  **⚡ Agent 3: Test Executor**: Simulates test execution, tracks metrics, and reports results.

---

## ✨ Key Features

- **Gemini Skills Architecture**: Modular skills system for advanced AI capabilities.
- **Autonomous Reasoning Loop**: Recursive "Thought-Action-Observation" sequence for deep analysis.
- **Agentic Health Dashboard**: Real-time monitoring of AI performance and token utilization.
- **Unified Export Engine**: Export results to JSON or CSV formats.
- **Glassmorphism UI**: Modern, professional design system.

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone https://github.com/darshil0/qa-nexus-autonomous.git
cd qa-nexus-autonomous
npm install

# 2. Configure API Key
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY

# 3. Start development
npm run dev
```

---

## 📖 Usage Examples

### Requirement Analysis
Enter a high-level requirement like:
> "Users should be able to reset their password using a magic link sent to their registered email address."

Agent 1 will detect ambiguities such as "How long should the link remain valid?" and Agent 2 will generate test cases covering happy paths and edge cases (expired link, invalid email, etc.).

### Jira Integration
Pull requirements directly by entering a Jira ticket ID (e.g., `AUTH-101`) in the Orchestrator tab.

---

## 👨‍💻 Development Workflow

1.  **Feature Development**: Create a new branch `feat/your-feature`.
2.  **Code Standards**: We use strict TypeScript and ESLint 9. Run `npm run lint`.
3.  **Testing**: All new logic requires 100% coverage. Run `npm run test:coverage`.
4.  **Verification**: Use Playwright to verify UI changes.

---

## 🛠️ Technology Stack

- **React 19** — UI framework
- **TypeScript 6** — Type safety
- **Vite 8** — Build tool
- **Google Gemini 2.5** — AI engine
- **Lucide React** — Icon library
- **Recharts 3** — Data visualization

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run CI checks
npm run ci
```

---

## ⚠️ Known Limitations

- **Rate Limiting**: The Gemini service is limited to 10 requests per minute by default.
- **Metric Estimates**: Health dashboard token counts are approximations.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Last Updated**: June 24, 2026
**Version**: 3.2.7
