# Contributing to QA Nexus Autonomous

Thank you for your interest in contributing to QA Nexus Autonomous. We aim to keep the project maintainable, testable, and consistent with the repository's existing patterns.

## Local Development Setup

### Prerequisites

- Node.js 24.0.0+ (LTS)
- npm 10+
- A Google Gemini API key from Google AI Studio
- Optional: Supabase credentials for persistence features

### Setup Steps

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/qa-nexus-autonomous.git
   cd qa-nexus-autonomous
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   If you want to install strictly from the lockfile, `npm ci` is also supported.

3. Configure your environment:
   ```bash
   cp .env.example .env
   ```
   Add your `VITE_GEMINI_API_KEY` to `.env`. If you plan to use Supabase-backed persistence, also add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Contribution Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Develop and validate your change:
   - Follow the repository's [Code Standards](#code-standards).
   - Add or update tests for new behavior in `src/tests/`.
   - Run the project's checks locally:
     ```bash
     npm run ci
     ```
   - If you need to validate in smaller steps:
     ```bash
     npm run typecheck
     npm run lint
     npm run test -- --run
     ```

3. Commit your changes:
   - Use [Conventional Commits](https://www.conventionalcommits.org/).
   - Example: `feat(agent1): improve ambiguity detection`

4. Submit a pull request:
   - Include a clear summary of what changed and why.
   - Link any related issues or discussions.
   - Keep changes focused and scoped to the feature or fix.

## Code Standards

- ✅ TypeScript: Use strict typing; avoid `any` unless explicitly justified and approved.
- ✅ Linting: Code must pass `npm run lint`.
- ✅ Logging: Use the centralized `@/utils/logger` utility instead of raw `console` calls.
- ✅ UI/UX: Follow the existing Glassmorphism design system and reuse established styling patterns.
- ✅ Testing: Add tests for new logic and maintain the project's quality bar.
- ✅ Security: Do not commit real API keys or secrets. Keep `.env` local-only.

## Reporting Issues

Please use the GitHub Issue tracker to report bugs, request enhancements, or discuss potential improvements. Include as much context as possible, including:

- steps to reproduce
- expected vs. actual behavior
- relevant environment details
- screenshots or logs when helpful

---

**Last Updated**: October 1, 2026
**Version**: 3.3.0
