# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.0] - 2026-02-16

### Added
- **Gemini Skills Integration**: Rebranded and enhanced Agent Skills for Google Gemini 3 models.
- **Gemini Knowledge Base Skill**: Introduced a specialized skill for retrieving technical details and prompt optimization strategies for Gemini.
- **Mermaid Diagrams**: Replaced legacy ASCII architecture diagrams with modern Mermaid.js visualizations across all core documentation.

### Changed
- **Documentation Overhaul**: Updated `README.md`, `ARCHITECTURE.md`, `AGENT.md`, and `Skills.MD` to reflect the transition to Gemini-centric skills.
- **Version Synchronization**: Unified all documentation versions to v2.9.0.

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

#### Core Application
- Main orchestrator component (App.tsx) managing workflow state
- Three-agent QA automation workflow:
  - Requirements Reviewer Agent
  - Test Case Writer Agent
  - Test Executor Agent
- Gemini AI service integration (geminiService.ts)
- Type-safe implementation with comprehensive TypeScript interfaces
- Error handling and graceful degradation

#### User Interface
- React components with Tailwind CSS styling
- Agent cards with real-time status indicators
- Requirements input textarea with form validation
- Results visualization with test metrics
- Responsive design for all screen sizes
- Loading spinners and error states
- Accessibility features (WCAG 2.1 AA compliance)

#### Features
- Requirements analysis with issue identification
- Comprehensive test case generation
- Test execution simulation with metrics
- Real-time workflow progress tracking
- JSON response parsing with fallbacks
- Error recovery and user feedback

#### Development Tools
- Development server with HMR on port 3000
- Production build optimization
- Path alias configuration (@/ for src/)
- ESLint configuration with auto-fix support
- Pre-configured Vitest for unit testing

#### Documentation
- Comprehensive README.md with quick start guide
- Architecture documentation with flow diagrams
- Configuration guide for environment variables
- Troubleshooting section with common solutions
- API integration documentation
- Security best practices
- Performance metrics

#### Configuration Files
- vite.config.ts - Build and dev server configuration
- tsconfig.json - TypeScript compiler options (strict mode)
- tsconfig.node.json - TypeScript for build tools
- tailwind.config.js - Tailwind CSS theme configuration
- postcss.config.js - PostCSS configuration
- vitest.config.ts - Test runner configuration
- .eslintrc.cjs - ESLint rules and settings
- .eslintignore - ESLint ignore patterns

#### Dependencies
- React and React-DOM 19.2.4
- Google Generative AI (@google/genai) 1.39.0
- Lucide React icons 0.563.0
- Recharts visualization 3.7.0
- Testing libraries and tools
- Development tools and linters

#### Project Structure & Organization
- New directory structure following Vite conventions:
  - `src/` directory for all source code (App.tsx, services, components, constants, types)
  - `docs/` directory for comprehensive documentation (9 markdown files)
  - `public/` directory for static assets
- PROJECT_STRUCTURE.md - Guide explaining new directory organization and conventions
- Enhanced AGENT.md - Comprehensive developer reference guide (940 lines):
  - Multi-agent architecture diagrams and explanations
  - Detailed specifications for all three agents (Requirements Reviewer, Test Case Writer, Test Executor)
  - Core development patterns with code examples (Agent Functions, State Management, Async Operations, Response Schemas)
  - Integration points documentation (Gemini API, Jira, GitHub) with debugging tables
  - Complete response schema examples for all agents
  - TypeScript type definitions matching schemas
  - Testing & validation workflow
  - Security & production considerations
  - Merging guidance with commit message format examples
  - Key takeaways (do's and don'ts)

#### Documentation
- Complete README.md rewrite (343 lines):
  - Quick Start guide with installation instructions
  - Project structure overview with visual tree
  - Technology stack table
  - Architecture diagram
  - Feature highlights (UI enhancements v2.0)
  - Complete documentation index
  - Security & accessibility sections
  - Testing & deployment guides
  - Performance metrics and roadmap
- 9 comprehensive documentation files in `docs/`:
  - `AGENT.md` - Multi-agent architecture reference
  - `README_DOCUMENTATION.md` - Documentation hub
  - `QUICK_REFERENCE.md` - Quick overview
  - `BEFORE_AFTER_COMPARISON.md` - UI improvements catalog
  - `IMPLEMENTATION_SUMMARY.md` - Technical specifications
  - `PROJECT_COMPLETION_REPORT.md` - Milestone report
  - `UI_ENHANCEMENTS.md` - Accessibility guide
  - `Walkthrough.md` - UI workflow guide

#### UI Enhancements (v2.0)
- Focus state improvements - Clear visual indicators for keyboard navigation
- Loading spinners - Animated feedback during agent processing
- Help text tooltips - Contextual guidance for all input fields
- Enhanced color scheme - Improved contrast and accessibility
- Accessibility compliance - WCAG 2.1 AA standards throughout

### Changed

- Updated Vite configuration - Path alias `@` now points to `src/` directory for cleaner imports
- Moved 15 source files from root to `src/` directory:
  - Core files: App.tsx, index.tsx, constants.ts, types.ts, metadata.json
  - Services layer: geminiService.ts and related files
  - Components directory created for future component modularization
- Moved 9 documentation files to `docs/` directory for better organization
- Updated import paths throughout codebase to reflect new structure
- Updated vite.config.ts path alias configuration
- README.md - Complete rewrite from minimal (31 lines) to comprehensive (343 lines)
  - Added Quick Start section with environment setup
  - Added detailed Project Structure explanation
  - Added Technology Stack table
  - Expanded integration points documentation
  - Added Testing & Deployment sections
  - Added Performance metrics and roadmap
- AGENT.md - Expanded from 58 lines to 940 lines (16x growth)
  - Original minimal overview replaced with detailed specifications
  - Added prerequisite requirements and installation commands
  - Added Big-picture Architecture with ASCII diagrams
  - Replaced simple conventions with comprehensive patterns and examples
  - Enhanced testing and security sections with production guidance
  - Added complete response schema examples for all agents
  - Added complete TypeScript type definitions
  - Added merging guidance and commit message format

### Fixed

- Google Generative AI import to use GoogleGenAI class
- eslint-plugin-react-hooks version to support React 19
- Peer dependency conflicts with React 19
- Missing remote documentation - 6 documentation files now synced to GitHub
- Project structure organization - Source files properly organized following Vite conventions
- Path imports - Vite alias configuration updated to point to src/ for consistency
- Build configuration - tsconfig.json and vite.config.ts aligned with new structure

### Security

- API keys stored only in environment variables
- TypeScript strict mode prevents type-related vulnerabilities
- No sensitive data logged to console
- XSS protection through React's built-in sanitization
- Environment variables properly isolated
- Environment variables - Documented best practices for API key management
- WCAG 2.1 AA compliance - All UI components meet accessibility standards
- Rate limiting documentation - Guidance for Gemini API usage patterns

### Performance

- Production bundle: ~255KB (79KB gzipped)
- Initial load time: <1 second
- Efficient state management
- Optimized Vite build configuration

## [1.0.0] - 2026-01-XX

### Added

- Initial project setup with React 19.2.4 and Vite 6.2.0
- Three-agent QA automation system:
  - Agent 1: Requirements Reviewer (Gemini API)
  - Agent 2: Test Case Writer (Gemini API)
  - Agent 3: Test Executor (Gemini API)
- Multi-agent orchestrator (App.tsx)
- Google Gemini API integration (@google/genai ^1.39.0)
- Tailwind CSS styling with responsive design
- Lucide React icons
- Recharts for data visualization
- Mock Jira and GitHub integrations
- TypeScript strict mode configuration

### Features

- Requirements Analysis - AI-powered review of project requirements
- Test Case Generation - Automated test case creation
- Test Execution Simulation - Simulated test execution with metrics
- Rich UI - Modern, responsive interface with Tailwind CSS
- Real-time Updates - Vite HMR on port 3000

---

## Version Information

**Current Version**: 2.9.0
**Release Date**: February 14, 2026
**Status**: Production Ready  
**License**: MIT

### Supported Node Versions

- Node.js 18.x and higher
- npm 9.x and higher

### Tech Stack

- **Frontend**: React 19.2.4
- **Framework**: Vite 7.3.1 (Unified Config)
- **Language**: TypeScript 5.9.3 (strict mode)
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide React 0.563.0
- **Charts**: Recharts 3.7.0
- **AI**: Google Gemini API (@google/genai ^1.40.0)
- **Testing**: Vitest 4.0.18
- **Linting**: ESLint 9.39.2
- **Build Tool**: Vite 7

### Breaking Changes

**v2.0.1**:
- None - This is a patch release fixing configuration issues

**v2.0.0**:
- Project structure reorganization (source files moved to `src/`)
- Path alias changes (now using `@/` for src imports)
- Configuration file naming conventions standardized

### Migration Guide

#### Migrating from 2.0.0 to 2.0.1

1. Rename all configuration files to use proper conventions:
   - `_env` → `.env`
   - `_eslintrc.cjs` → `.eslintrc.cjs`
   - `postcss_config.js` → `postcss.config.js`
   - `tailwind_config.js` → `tailwind.config.js`
   - `vite_config.ts` → `vite.config.ts`
   - etc.

2. Verify build tools work:
   ```bash
   npm run lint        # Should now work
   npm run typecheck   # Should pass
   npm run dev         # Should start
   ```

---

## Planned Features (v2.2.0+)

- Database integration for workflow history
- Multi-project management dashboard
- Custom AI model selection
- Result export (PDF, JSON, CSV formats)
- GitHub Actions CI/CD integration
- Team collaboration features
- Advanced filtering and search capabilities
- Performance optimization and caching
- Webhook support for external integrations
- API rate limiting and quota management

---

## Known Issues

### v2.0.1
None currently identified.

### Reporting Issues

Please report issues via GitHub Issues with:
- Step-by-step reproduction instructions
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshot or error log if applicable

---

## Contributing Guidelines

See README.md for detailed contribution guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with clear commit messages
4. Ensure all tests pass: `npm run ci`
5. Run linting: `npm run lint:fix`
6. Submit a pull request with description of changes

### Code Standards

- TypeScript strict mode required
- ESLint passes without warnings
- All functions must be typed
- Components must be documented
- Tests required for new features
- Use conventional commit messages

---

## Acknowledgments

Built with cutting-edge technologies:
- React 19 for modern component architecture
- Vite for lightning-fast development
- TypeScript for type safety
- Google Gemini AI for intelligent automation
- Vanilla CSS for premium design

---

## Support

- Documentation: See README.md
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: See repository for contact info

---

## Repository

- **URL**: https://github.com/darshil0/qa-nexus-autonomous
- **Branch**: main
- **Status**: Synchronized with origin/main

---

## Documentation

All documentation is comprehensive and up-to-date:
- `README.md` - Main entry point (comprehensive project overview)
- `CHANGELOG.md` - Version history (this file)
- `AGENT.md` - AI agent guidelines (located at project root)
- `docs/ARCHITECTURE.md` - Technical deep-dive
- `docs/Walkthrough.md` - User guide

---

## Contributing

See [README.md](README.md) for contribution guidelines and [AGENT.md](AGENT.md) for detailed developer documentation.

## Roadmap

See [README.md](README.md#future-enhancements) for planned features and improvements.

---

**Last Updated**: February 14, 2026
**Version**: 2.9.0
