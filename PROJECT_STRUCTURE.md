# QA Nexus Project Structure

**Version**: 2.4.0
**Last Updated**: February 6, 2026

## Project Organization

This project follows the standard Vite + React + TypeScript structure:

```
qa-nexus-autonomous/
├── src/                          # Application source code
│   ├── App.tsx                   # Main application component
│   ├── index.tsx                 # React entry point
│   ├── constants.ts              # Application constants (agent models, etc.)
│   ├── types.ts                  # TypeScript types and interfaces
│   ├── metadata.json             # Agent metadata
│   ├── components/               # UI components
│   │   ├── tabs/                 # View-specific tab components
│   │   │   ├── OrchestratorTab.tsx
│   │   │   ├── Agent1Tab.tsx
│   │   │   ├── Agent2Tab.tsx
│   │   │   ├── Agent3Tab.tsx
│   │   │   └── ReportsTab.tsx
│   │   ├── NavBtn.tsx            # Sidebar navigation button
│   │   ├── StatCard.tsx          # Reporting metric card
│   │   └── AgentThinkingLog.tsx  # Terminal-style log display
│   └── services/                 # External service integrations
│       └── geminiService.ts     # Google Gemini API integration
│
├── docs/                         # Project documentation
│   ├── ARCHITECTURE.md           # Multi-agent architecture & specifications
│   ├── README_DOCUMENTATION.md   # Documentation index
│   ├── QUICK_REFERENCE.md        # Commands and environment guide
│   ├── IMPLEMENTATION_SUMMARY.md # Technical implementation details
│   ├── UI_ENHANCEMENTS.md        # UI/UX and accessibility guide
│   └── Walkthrough.md            # Step-by-step user guide
│
│
├── public/                       # Static assets (images, fonts, etc.)
│   └── .gitkeep                  # Placeholder
│
├── .github/                      # GitHub-specific configuration
│   └── copilot-instructions.md  # AI assistant guidance
│
├── .gitignore                    # Git ignore patterns
├── eslint.config.js              # ESLint 9 configuration (Flat Config)
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite 7 configuration
├── AGENT.md                      # AI Agent identity and guidelines
└── README.md                     # Project overview
```

## Directory Purposes

### `/src`
Contains all application source code organized by type:
- **Main Files**: App.tsx, index.tsx, constants.ts, types.ts
- **Services**: External API integrations (Gemini AI, simulated Jira/GitHub)
- **Components**: Reusable UI components (NavBtn, StatCard, AgentThinkingLog)
- **Metadata**: Agent profiles and configuration

### `/docs`
Comprehensive project documentation:
- **ARCHITECTURE.md**: Detailed specifications of the multi-agent system, prompt strategies, and technical deep-dive.

### `/public`
Reserved for static assets:
- Images
- Icons
- Fonts
- Any files that should be served directly by the web server

### `/.github`
GitHub-specific configuration:
- **copilot-instructions.md**: AI assistant guidance for developers
- (Future: workflows, templates, etc.)

### Root Level
Configuration and build files:
- **index.html**: HTML entry point for Vite
- **vite.config.ts**: Build tool configuration
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Dependencies and npm scripts
- **README.md**: Project overview

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { reviewRequirements } from '../../services/geminiService';
// Use:        import { reviewRequirements } from '@/services/geminiService';
```

**Configured in**:
- `vite.config.ts`: `'@': path.resolve(__dirname, './src')`
- `tsconfig.json`: Path mappings for TypeScript

## Development Workflow

1. **Start development server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Preview production build**: `npm run preview`
4. **Edit source files** in `/src`
5. **Read documentation** from `/docs`

## Import Guidelines

- **Components**: Import from `@/` (path alias pointing to src/)
- **Services**: `import { reviewRequirements } from '@/services/geminiService'`
- **Types**: `import { WorkflowStatus } from '@/types'`
- **Constants**: `import { AGENT_MODELS } from '@/constants'`

## Future Enhancements

1. Extract more components from App.tsx (e.g., AgentCard, ResultsPanel)
2. Add utility functions to `/src/utils`
3. Create `/src/hooks` for custom React hooks
4. Add `/src/styles` for CSS modules
5. Add unit tests to `/src/__tests__`

## Git Structure

All files are properly organized and tracked by Git:
- Source code changes in `/src` are captured automatically
- Documentation in `/docs` is version controlled
- Configuration files at root are tracked
- Public assets in `/public` are tracked with `.gitkeep`

## Performance Considerations

- **Tree-shaking**: Unused code is eliminated during build
- **Code splitting**: Vite automatically splits large modules
- **HMR**: Hot Module Replacement enabled for fast development
- **CSS**: Custom Vanilla CSS Design System

---

This structure provides:
✅ Clear separation of concerns
✅ Easy navigation and maintenance  
✅ Scalability for future growth
✅ Industry-standard organization
✅ Better IDE support with path aliases
