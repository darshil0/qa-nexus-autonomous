# QA Nexus Autonomous

A sophisticated multi-agent QA automation system powered by Google Gemini AI. QA Nexus Autonomous orchestrates three specialized AI agents to streamline the entire quality assurance workflow: from requirements analysis through test case generation to execution simulation.

## Overview

QA Nexus Autonomous demonstrates advanced AI orchestration by combining multiple specialized agents into a cohesive workflow. The system analyzes requirements, generates comprehensive test cases, and simulates test execution—all powered by state-of-the-art language models.

**Version**: 2.0.0
**Status**: Production Ready

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
| **Build Tool** | Vite 6.2.0 |
| **Language** | TypeScript 5.8.2 (strict mode) |
| **Styling** | Tailwind CSS 3.4.0 |
| **UI Components** | Lucide React 0.563.0 |
| **Visualization** | Recharts 3.7.0 |
| **AI Engine** | Google Gemini API 1.39.0 |
| **Testing** | Vitest 1.3.0, Testing Library 14.0.0 |
| **Linting** | ESLint 8.50.0, TypeScript ESLint 6.9.0 |

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

   Create a `.env` file in the project root:
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
│   ├── components/                # Reusable React components
│   │   └── .gitkeep
│   └── services/
│       └── geminiService.ts       # Gemini API integration layer
│
├── docs/                          # Documentation (future)
├── public/                        # Static assets
├── .github/                       # GitHub configuration
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript compiler options
├── tsconfig.node.json             # TypeScript for build files
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── .eslintrc.cjs                  # ESLint configuration
├── .eslintignore                  # ESLint ignore patterns
├── vitest.config.ts               # Vitest configuration
├── package.json                   # Dependencies and scripts
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

## Development

### Setting Up for Development

1. Install Node.js 18+
2. Clone the repository
3. Run `npm install --legacy-peer-deps` (for React 19 compatibility)
4. Create `.env` with your API keys
5. Run `npm run dev`

### Code Quality

- **TypeScript**: Full strict mode enabled for type safety
- **ESLint**: Enforces consistent code style
- **Prettier**: Integrated for code formatting (via ESLint)
- **Vitest**: Unit testing framework for functions and components

### Adding New Features

1. Create components in `/src/components/`
2. Add services in `/src/services/`
3. Export types from `/src/types.ts`
4. Update `/src/constants.ts` if needed
5. Write tests in `/src/__tests__/`

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

- **Model**: `gemini-pro`
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
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API key error | Verify `VITE_GEMINI_API_KEY` in `.env` |
| Port 3000 in use | Change port in `vite.config.ts` |
| Module not found | Run `npm install` and restart dev server |
| TypeScript errors in IDE | Restart TypeScript server in your editor |

## Future Enhancements

- Database integration for history tracking
- Multi-project management
- Custom AI model selection
- Result export (PDF, JSON, CSV)
- CI/CD pipeline integration
- Collaboration features
- Advanced filtering and search
- Performance optimization

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Gemini AI**
