# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-02-18

### Added
- **Agentic Memory System**: Integrated a stateful memory buffer (`memoryService.ts`) to provide session-long context for AI agents, improving reasoning continuity across multi-step workflows.
- **Advanced Orchestration Metrics**: Real-time tracking of loop depth, latency, tool call frequency, and estimated token consumption, visualized in the Health Dashboard.
- **Input Sanitization Layer**: Implementation of `sanitizeRequirements` to protect against prompt injection and ensure data integrity.
- **UI Accessibility & UX Enhancements**: Added automated focus management, smooth scrolling to highlighted requirements, and refined glassmorphism animations.
- **Unified Export Engine**: Standardized JSON and CSV export for both test cases and execution results.

### Changed
- **Project Synchronization**: Unified all project documentation, badges, and UI references to version 3.0.0.

## [2.9.0] - 2026-02-16

### Added
- **Path Alias Implementation**: Configured `@/` path alias for the entire project, mapping to the `src/` directory.
- **ESM-Ready Configuration**: Updated `vite.config.ts` and `vitest.config.ts` to use `fileURLToPath` for robust path resolution in ECMAScript Modules.

### Changed
- **Global Import Refactoring**: Systematically replaced relative imports (e.g., `../../components/...`) with standardized `@/` path aliases across all Tab components, services, and the main entry point.
- **Project Documentation Sync**: Updated all Markdown documentation to reflect the new project structure and path alias standards.
- **Version bump**: Upgraded platform to v2.10.0.

## [2.9.0] - 2026-02-16

## [2.8.0] - 2026-02-15

### Added
- **Claude Skills Integration**: Restructured the project to support the [Anthropic Agent Skills](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) standard.
- **Skills Directory**: Introduced `skills/` directory with specialized `SKILL.md` definitions for Requirements Reviewer, Test Case Writer, Test Executor, and Tiny GPT.
- **Skills Registry**: Added a root-level `Skills.MD` for easier navigation of available AI capabilities.

### Fixed
- **Gemini SDK Compatibility**: Fixed a type error where `response.text()` was called as a function instead of a getter in the `@google/genai` v1.x SDK.
- **Linting & Code Quality**: Resolved 20+ linting errors including missing curly braces, unsafe `any` usages, and redundant `await` statements.
- **Type Safety**: Improved type safety in `SettingsTab.tsx` and `validateEnv.ts`.

### Changed
- **Project Structure**: Moved `src/engine/tiny_gpt.py` to `skills/tiny-gpt/scripts/tiny_gpt.py` to align with the Skills standard.

## [2.7.0] - 2026-02-14

### Added
- **Agentic Health Dashboard**: New diagnostic tab for monitoring reasoning loop depth, latency, and token saturation.
- **MCP Tool Analytics**: Visual breakdown of tool call frequency (Jira, GitHub, etc.).
- **Scenario-Based Tuning**: Comprehensive guide for configuring AI parameters based on specific QA objectives.
- **Real-time Loop Monitoring**: Added `activeLoops` tracking to the orchestrator.

### Changed
- **Version bump**: Upgraded platform to v2.7.0.
- **UI Enhancements**: Added sidebar shortcut for Health metrics and updated StatCard iconography.

## [2.6.0] - 2026-02-13

### Added
- **Recursive Reasoning Loop**: Upgraded the agentic workflow to support sequential, multi-step tool calls (up to 3 per task).
- **Advanced Skills Registry**:
  - `code_analysis`: For deep security and logic inspection.
  - `tiny_gpt_reference`: Technical documentation for the internal GPT engine.
  - `performance_audit`: Automated application benchmarking.
- **Enhanced Orchestration**: Agents now maintain stateful context across multiple tool-calling iterations.

### Changed
- **System Instructions**: Refined prompts to encourage sequential information gathering and better synthesis of multi-tool outputs.

## [2.5.0] - 2026-02-08

### Added
- **Agentic Skills Framework**: Introduced a library of executable skills (Jira Search, GitHub Issue Creation, Test Runner) that agents can use autonomously.
- **Model Context Protocol (MCP) Integration**: Implemented a standardized MCP Service based on JSON-RPC 2.0 to handle tool discovery and execution.
- **Autonomous Reasoning Loop**: Developed a robust two-pass reasoning system in `geminiService.ts` allowing agents to call tools and refine their output based on observations.
- **Tiny GPT Engine**: Integrated a pure, dependency-free Python implementation of a GPT model for educational and reference purposes at `src/engine/tiny_gpt.py`.

### Fixed
- **CI Stability**: Resolved multiple linting and TypeScript errors across the service layer (lexical declarations, unused variables, type mismatches).
- **Gemini Response Handling**: Fixed a critical bug in AI response parsing where `.text` was incorrectly accessed as a property instead of a method.

### Changed
- **Service Layer Architecture**: Refactored agent pipelines into a universal `runAgenticWorkflow` helper for better maintainability and extensibility.
- **Documentation Overhaul**: Updated `README.md`, `AGENT.md`, and `CHANGELOG.md` to reflect the v2.5.0 architectural evolution.

## [2.4.1] - 2026-02-07

### Fixed
- **Dependency Conflicts**: Resolved critical peer dependency issues between `eslint` and `eslint-plugin-react-hooks` by upgrading to version 5.x.
- **Type Safety**:
  - Replaced unsafe `any` types in `geminiService.ts` with proper `GenerateContentResponse` interfaces from `@google/genai`.
  - Fixed `implicitly any` errors in test files by using correct type casting (`as unknown as GoogleGenAI`).
- **Linting**: Achieved zero linting errors across the entire codebase.

## [2.4.0] - 2026-02-06

### Added
- **Premium UI Revamp**: Replaced Tailwind CSS with a custom-built Vanilla CSS design system.
  - Implemented **Glassmorphism** aesthetics with translucent surfaces and backdrop blurs.
  - Introduced a unified color palette using CSS Custom Properties (Variables).
  - Added rich micro-animations and hover effects across all interactive elements.
- **Neural Engine Trace**: Refactored the agent thinking log into a "Neural Engine Trace" with a dark terminal aesthetic and pulse animations.
- **Enhanced StatCards**: Revamped metric displays with glowing text shadows and status-specific accent colors.
- **Analytics Visualization**: Updated Recharts integration to align with the new dark-themed glass design.

### Changed
- **Tech Stack Simplification**: Removed Tailwind CSS, PostCSS, and related plugins from the build pipeline.
- **Component Refactoring**: Migrated all tab components to the new design system:
  - `OrchestratorTab`, `Agent1Tab`, `Agent2Tab`, `Agent3Tab`, `ReportsTab`.
- **Navigation Overhaul**: Implemented a reusable `NavBtn` component for consistent sidebar interactions.
- **Type Safety Improvements**: Resolved multiple "implicitly any" TypeScript errors across core components.

### Removed
- `tailwindcss` and `@tailwindcss/vite` devDependencies.
- Legacy Tailwind utility classes from JSX files.

## [2.3.1] - 2026-02-06

### Added
- **Agent Documentation Foundation**: Restored and updated the root `AGENT.md` file to provide a comprehensive identity and development roadmap for AI assistants.
- **Agent Identity Update**: Rebranded the AI agent from "Antigravity" to "QA Nexus Autonomous Agent".
- **AI Client API Key Fix**: Updated `geminiService.ts` to utilize `import.meta.env.VITE_GEMINI_API_KEY`, ensuring compatibility with Vite environment variables and project-standard naming.
- **Model Name Synchronization**: Unified model references throughout the project to utilize `gemini-3-pro-preview` and `gemini-3-flash-preview` for technical precision.
- **Browser Support Update**: Updated verified browser target versions to reflect early 2026 standards (Chrome v144+, Firefox v147+, Safari v26+).
- **Project-Wide Synchronization**: Unified version numbers and update dates across all core documentation (`README.md`, `ARCHITECTURE.md`, `PROJECT_STRUCTURE.md`) and `package.json`.
- **Documentation Linking**: Integrated `AGENT.md` references into the main project structure and architectural guides.

## [2.3.0] - 2026-02-05

### Added
- **Vite 7 Integration**: Upgraded the build engine to Vite 7.3.1 for faster HMR and optimized production builds.
- **Tailwind CSS 4 Support**: Migrated the styling engine to Tailwind CSS 4.1.18, utilizing the new `@tailwindcss/vite` plugin and CSS-first configuration.
- **ESLint 9 (Flat Config)**: Fully migrated the linting system from legacy `.eslintrc.cjs` to the modern `eslint.config.js` (Flat Config) system.
- **Improved React 19 Support**: Updated all testing and build dependencies to resolve peer dependency conflicts with React 19.

### Changed
- **Tech Stack Modernization**: 
  - Upgraded `@google/genai` to v1.40.0.
  - Upgraded `typescript` to v5.9.3.
  - Upgraded `vitest` to v4.0.18.
- **Project Structure**: Removed legacy configuration files (`.eslintrc.cjs`, `.eslintignore`, `postcss.config.js`, `tailwind.config.js`) in favor of centralized Vite 7/Tailwind 4/ESLint 9 configurations.
- **CI/CD Tuning**: Adjusted GitHub workflows to support the new ESLint 9 configuration format.

## [2.2.0] - 2026-02-05

### Added
- **Modular Tab Architecture**: Decomposed the monolithic `App.tsx` into specialized tab components:
  - `OrchestratorTab`: Workflow management and Jira sync.
  - `Agent1Tab`: Requirements visualization.
  - `Agent2Tab`: Test case analysis and traceability.
  - `Agent3Tab`: Execution results and GitHub reporting.
  - `ReportsTab`: Analytics and coverage metrics.
- **Environment Documentation**: Added `.env.example` to guide developers on API key configuration.

### Changed
- **Performance Optimization**: 
  - Implemented `useCallback` for all major workflow handlers.
  - Reduced re-renders in the main orchestrator.
- **Service Refactoring**: 
  - Centralized AI response parsing in `geminiService.ts` using a generic helper.
  - Improved error handling and response validation for all agents.
  - Enhanced environment variable detection to support both Vite and Node (test) environments.
- **Code Cleanliness**: Reduced `App.tsx` size by ~60% through component extraction.

## [2.1.0] - 2026-02-05

### Added

- **TypeScript Support**: Added missing `@types/react` and `@types/react-dom` dependencies.
- **Test Infrastructure**: 
  - Added global test setup in `src/test/setup.ts`.
  - Integrated `@testing-library/jest-dom` for enhanced test assertions.
  - Upgraded `vitest` to latest compatible version for Vite 6.

### Fixed

- **Type Safety**: Resolved 200+ "JSX element implicitly has type 'any'" TypeScript errors.
- **Test Errors**: Fixed `toBeInTheDocument` and `toHaveClass` property missing errors in vitest.
- **Unused Variables**: Fixed several unused variable errors in services and test files.
- **Linting**: 
  - Removed deprecated triple-slash references in test files.
  - Configured ESLint to allow underscored unused arguments (`^_`).
  - Achieved clean linting and type-checking across the codebase.

### Changed

- Updated `vitest.config.ts` with new setup files and improved globals handling.
- Refactored `geminiService.ts` for better internal typing and cleaner code.
- **Repository Management**: Initialized Git repository, configured remote, and synchronized with main branch.
- **Documentation Cleanup**: consolidated redundant documentation files into a core `ARCHITECTURE.md` and updated all project-wide references to maintain consistency.

## [2.0.1] - 2026-02-05

### Fixed

#### Critical Configuration Issues
- **File Naming Conventions**: Fixed all configuration files to use standard naming conventions
  - Renamed `_env` → `.env`
  - Renamed `_eslintignore` → `.eslintignore`
  - Renamed `_eslintrc.cjs` → `.eslintrc.cjs`
  - Renamed `_gitignore` → `.gitignore`
  - Renamed `postcss_config.js` → `postcss.config.js`
  - Renamed `tailwind_config.js` → `tailwind.config.js`
  - Renamed `tsconfig_node.json` → `tsconfig.node.json`
  - Renamed `vite_config.ts` → `vite.config.ts`
  - Renamed `vitest_config.ts` → `vitest.config.ts`

#### Code Quality Improvements
- Added missing semicolons in `postcss.config.js` and `tailwind.config.js`
- Enhanced `tsconfig.node.json` to include all configuration files (`vite.config.ts`, `vitest.config.ts`, `postcss.config.js`, `tailwind.config.js`)
- Improved TypeScript type-checking coverage for build configuration files

### Changed

- Updated README.md with:
  - Version bump to 2.0.1
  - Configuration files section explaining proper naming conventions
  - Enhanced troubleshooting section for configuration issues
  - Added code standards section to contributing guidelines
  - Updated project structure to show correct file names

### Impact

These fixes ensure:
- ✅ ESLint now runs correctly (previously couldn't find `.eslintrc.cjs`)
- ✅ Git ignore rules are properly applied
- ✅ Environment variables are correctly loaded from `.env`
- ✅ All build tools can find their configuration files
- ✅ TypeScript properly type-checks all configuration files
- ✅ PostCSS and Tailwind CSS process correctly

## [2.0.0] - 2026-02-05

### Added

#### Project Infrastructure
- Complete Vite 6.2.0 setup with React 19.2.4
- TypeScript 5.8.2 with strict mode enabled
- Tailwind CSS 3.4.0 with PostCSS configuration
- ESLint 8.50.0 with TypeScript and React plugin support
- Vitest 1.3.0 with Testing Library integration
- Modern project structure following Vite conventions

### Changed

- Updated Vite configuration - Path alias `@` now points to `src/` directory for cleaner imports
- Moved 15 source files from root to `src/` directory:
  - Core files: App.tsx, index.tsx, constants.ts, types.ts, metadata.json
- Moved 9 documentation files to `docs/` directory for better organization
- Updated import paths throughout codebase to reflect new structure

## [1.0.0] - 2026-01-XX

### Added

- Initial project setup with React 19.2.4 and Vite 6.2.0
- Three-agent QA automation system (Requirements Reviewer, Test Case Writer, Test Executor)
- Multi-agent orchestrator (App.tsx)
- Google Gemini API integration (@google/genai ^1.39.0)
- Tailwind CSS styling with responsive design
- Mock Jira and GitHub integrations

---

## Technical Reference

- **Documentation**: See the [Documentation Hub](README.md#📁-project-structure)
- **Migration**: See the [Migration Guide](docs/MIGRATION_GUIDE.md)
- **Guidelines**: See [AGENT.md](AGENT.md) for AI Agent development patterns.

---

**Last Updated**: February 18, 2026
**Version**: 3.0.0
