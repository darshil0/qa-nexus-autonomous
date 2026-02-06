# QA Nexus Autonomous

A sophisticated multi-agent QA automation system powered by Google Gemini AI. QA Nexus Autonomous orchestrates three specialized AI agents to streamline the entire quality assurance workflow: from requirements analysis through test case generation to execution simulation.

## Overview

QA Nexus Autonomous demonstrates advanced AI orchestration by combining multiple specialized agents into a cohesive workflow. The system analyzes requirements, generates comprehensive test cases, and simulates test execution—all powered by state-of-the-art language models.

**Version**: 2.3.1  
**Status**: Production Ready  
**Last Updated**: February 6, 2026

## Key Features

### Requirements Reviewer Agent
- Analyzes project requirements in detail
- Identifies potential issues and gaps
- Provides actionable recommendations
- Ensures comprehensive requirement coverage

### Test Case Writer Agent
- Generates comprehensive test cases from requirements
- Prioritizes test cases by importance
- Provides detailed steps and expected results
- Adapts to various testing scenarios

### Test Executor Agent
- Simulates test execution with realistic scenarios
- Tracks pass/fail metrics
- Measures execution duration
- Provides detailed test result reports

### Modern UI
- Clean, intuitive interface with Tailwind CSS
- Real-time workflow progress indicators
- Interactive requirement input
- Comprehensive results visualization
- Responsive design for all devices

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19.2.4 |
| **Build Tool** | Vite 7.3.1 |
| **Language** | TypeScript 5.9.3 (strict mode) |
| **Styling** | Tailwind CSS 4.1.18 |
| **UI Components** | Lucide React 0.563.0 |
| **Visualization** | Recharts 3.7.0 |
| **AI Engine** | Google Gemini 3 (Pro/Flash) |
| **Testing** | Vitest 4.0.18, Testing Library 16.3.2 |
| **Linting** | ESLint 9.39.2, TypeScript ESLint 8.54.0 |

## Getting Started

### Prerequisites

- **Node.js**: 18 or higher
- **npm**: 9 or higher
- **Google Gemini API Key**: Get one at [Google AI Studio](https://aistudio.google.com)
- **Supabase Account** (optional): For data persistence

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd qa-nexus-autonomous
   npm install
   ```

2. **Configure Environment**

   Copy the example environment file and add your keys:
   ```bash
   cp .env.example .env
   ```

   Alternatively, create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Type-check TypeScript without emitting |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run ci` | Run type-check and tests (CI mode) |

## Project Structure

```
qa-nexus-autonomous/
├── src/
│   ├── App.tsx                    # Main application orchestrator
│   ├── index.tsx                  # React DOM entry point
│   ├── index.css                  # Global styles and Tailwind imports
│   ├── constants.ts               # App constants and defaults
│   ├── types.ts                   # TypeScript interfaces
│   ├── metadata.json              # Agent configuration and metadata
│   ├── components/                # UI components
│   │   ├── tabs/                  # Modular tab views (v2.2+)
│   │   │   ├── OrchestratorTab.tsx
│   │   │   ├── Agent1Tab.tsx
│   │   │   ├── Agent2Tab.tsx
│   │   │   ├── Agent3Tab.tsx
│   │   │   └── ReportsTab.tsx
│   │   ├── NavBtn.tsx
│   │   ├── StatCard.tsx
│   │   └── AgentThinkingLog.tsx
│   └── services/
│       └── geminiService.ts       # Gemini API integration (centralized parsing)
│
├── docs/                          # Project documentation
├── public/                        # Static assets
├── .github/                       # GitHub configuration
│   ├── workflows/                 # CI/CD pipelines
│   │   ├── ci.yml
│   │   └── eslint.yml
│   └── copilot-instructions.md    # AI assistant guidance
├── index.html                     # HTML entry point
├── eslint.config.js               # ESLint 9 configuration (Flat Config)
├── .gitignore                     # Git ignore patterns
├── .env                           # Environment variables (create this)
├── vitest.config.ts               # Vitest configuration
├── package.json                   # Dependencies and scripts
├── CHANGELOG.md                   # Version history
├── AGENT.md                       # AI Agent identity and guidelines
└── README.md                      # This file
```

## Usage Guide

### Basic Workflow

1. **Enter Requirements**
   - Navigate to the "Project Requirements" text area
   - Input your project requirements, user stories, or specifications
   - Be as detailed as possible for better AI analysis

2. **Start Workflow**
   - Click the "Start Workflow" button
   - The system will sequentially run all three agents
   - Watch the progress indicators update in real-time

3. **Review Results**
   - **Requirements Review**: Analyze the AI's assessment of your requirements
   - **Test Cases**: Review generated test cases with steps and expected results
   - **Execution Results**: Check metrics including pass/fail counts and execution time

### Example Requirements

```
Build a user authentication system with:
- Email/password login
- Password reset functionality
- OAuth2 integration (Google, GitHub)
- Two-factor authentication
- Session management
- Rate limiting (5 failed attempts)
```

## Architecture

### Agent Orchestration Flow

```
User Input (Requirements)
        ↓
Agent 1: Requirements Reviewer
├─ Analyzes requirements
├─ Identifies issues
└─ Provides recommendations
        ↓
Agent 2: Test Case Writer
├─ Generates test cases
├─ Prioritizes by importance
└─ Creates execution plan
        ↓
Agent 3: Test Executor
├─ Simulates execution
├─ Tracks results
└─ Computes metrics
        ↓
Results Dashboard
├─ Requirements review
├─ Test cases
└─ Execution metrics
```

### Service Layer

The `geminiService.ts` module handles all Gemini API interactions:
- Client initialization with API key validation
- Prompt engineering for consistent AI responses
- JSON response parsing with fallback handling
- Error handling and logging

## Configuration

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API authentication | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | No |
| `VITE_SUPABASE_SUPABASE_ANON_KEY` | Supabase anonymous key | No |

### Vite Configuration

Path aliases are configured for cleaner imports:
```typescript
// Instead of:
import { reviewRequirements } from '../../../services/geminiService';

// Use:
import { reviewRequirements } from '@/services/geminiService';
```

### Configuration Files

All configuration files follow standard naming conventions:
- **`.env`** - Environment variables (you create this)
- **`eslint.config.js`** - ESLint 9 rules and settings
- **`.gitignore`** - Files to exclude from version control
- **`vite.config.ts`** - Vite 7 / Tailwind 4 unified configuration
- **`tsconfig.json`** - Main TypeScript configuration
- **`vitest.config.ts`** - Test runner configuration

## Development

### Setting Up for Development

1. Install Node.js 18+
2. Clone the repository
3. Run `npm install` (use `--legacy-peer-deps` if needed for React 19)
4. Create `.env` with your API keys
5. Run `npm run dev`

### Code Quality

- **TypeScript**: Full strict mode enabled for type safety
- **ESLint**: Enforces consistent code style with auto-fix support
- **Testing**: Vitest framework for unit and integration tests
- **Type Checking**: Comprehensive TypeScript coverage

### Adding New Features

1. Create components in `/src/components/`
2. Add services in `/src/services/`
3. Export types from `/src/types.ts`
4. Update `/src/constants.ts` if needed
5. Write tests in `/src/__tests__/`
6. Run `npm run lint:fix` to ensure code quality
7. Run `npm run typecheck` to verify TypeScript
8. Run `npm test` to verify all tests pass

## Performance

- **Bundle Size**: ~255KB (gzipped: ~79KB) for production build
- **Load Time**: <1s on modern connections
- **API Response**: Depends on Gemini API latency (typically 2-5s per agent)
- **Memory Usage**: Minimal footprint with efficient state management

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: All modern versions

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Semantic HTML structure

## Security

- API keys stored in environment variables only
- TypeScript strict mode prevents type-related bugs
- No sensitive data logged to console in production
- XSS protection through React's built-in sanitization
- CSRF protection through standard HTTP practices

## API Integration

### Google Gemini API

- **Models**: `gemini-3-pro-preview`, `gemini-3-flash-preview`
- **Rate Limits**: Refer to Google's pricing and quotas
- **Response Format**: JSON with fallback to empty structures
- **Error Handling**: Graceful degradation with user feedback

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/__tests__/geminiService.spec.ts

# Run tests with coverage
npm test -- --coverage
```

## Troubleshooting

### Common Issues & Solutions:

| Issue | Solution |
|-------|----------|
| API key error | Verify `VITE_GEMINI_API_KEY` in `.env` file |
| Port 3000 in use | Change port in `vite.config.ts` or kill process using port |
| Module not found | Run `npm install` and restart dev server |
| TypeScript errors in IDE | Restart TypeScript server in your editor |
| ESLint not working | Ensure `eslint.config.js` exists (not `.eslintrc.cjs`) |
| Build fails | Check all config files use correct naming (ESLint 9 / Vite 7 / Tailwind 4) |

### Configuration File Issues

If your build tools aren't working:
1. Verify all config files use modern conventions (`eslint.config.js`, `vite.config.ts`)
2. Check file names match exactly: `.env`, `eslint.config.js`, `vite.config.ts`, etc.
3. Run `npm run lint` to verify ESLint 9 configuration
4. Run `npm run typecheck` to verify TypeScript configuration

## Future Enhancements

- Database integration for history tracking
- Multi-project management
- Custom AI model selection
- Result export (PDF, JSON, CSV)
- CI/CD pipeline integration with GitHub Actions
- Collaboration features
- Advanced filtering and search
- Performance optimization and caching

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Run linting and tests (`npm run ci`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode guidelines
- Ensure ESLint passes without warnings
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub. Detailed documentation can be found in the [docs/ directory](./docs/README_DOCUMENTATION.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

**Built with ❤️ by Darshil using React, TypeScript, and Gemini AI**
