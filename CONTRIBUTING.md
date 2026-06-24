# Contributing to QA Nexus Autonomous

Thank you for your interest in contributing! We aim for a high standard of code quality and maintainability.

## Local Development Setup

### Prerequisites
- Node.js 20.19.0+ (LTS)
- npm 10+
- A Google Gemini API Key

### Setup Steps
1. **Fork and Clone** the repository.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Add your VITE_GEMINI_API_KEY to .env
   ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Contribution Workflow

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Develop and Test**:
   - Ensure your code follows the established [Code Standards](#code-standards).
   - Write tests for new functionality in `src/tests/`.
   - Verify everything passes locally:
     ```bash
     npm run ci
     ```
3. **Commit Your Changes**:
   - Use [Conventional Commits](https://www.conventionalcommits.org/).
   - Example: `feat(agent1): improve ambiguity detection`
4. **Submit a Pull Request**:
   - Provide a clear description of your changes.
   - Link any relevant issues.

## Code Standards

- ✅ **TypeScript**: Use strict mode. Avoid `any`. Ensure all new code is properly typed.
- ✅ **Linting**: Code must pass `npm run lint`.
- ✅ **Logging**: Use the centralized `@/utils/logger` utility instead of `console`.
- ✅ **UI/UX**: Follow the Glassmorphism design system using existing CSS custom properties.
- ✅ **Testing**: Maintain 100% line coverage for new logic.

## Reporting Issues
Please use the GitHub Issue tracker to report bugs or propose new features. Provide as much context as possible, including steps to reproduce for bugs.

---

**Last Updated**: June 24, 2026
**Version**: 3.2.6
