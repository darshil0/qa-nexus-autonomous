# QA Nexus Autonomous

A multi-agent QA automation system powered by Google Gemini AI.

## Features

- **Requirements Reviewer**: Analyzes project requirements and identifies potential issues
- **Test Case Writer**: Generates comprehensive test cases based on requirements
- **Test Executor**: Executes test cases and provides detailed results

## Tech Stack

- **Frontend**: React 19.2.4
- **Framework**: Vite 6.2.0
- **Language**: TypeScript 5.8.2 (strict mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file with:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Project Structure

```
qa-nexus-autonomous/
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # React entry point
│   ├── index.css            # Global styles
│   ├── constants.ts         # Application constants
│   ├── types.ts             # TypeScript types
│   ├── metadata.json        # Agent metadata
│   ├── components/          # React components
│   └── services/            # Service layer
│       └── geminiService.ts # Gemini AI integration
├── docs/                    # Documentation
├── public/                  # Static assets
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies

```

## Usage

1. Enter your project requirements in the text area
2. Click "Start Workflow" to begin the QA automation process
3. The system will:
   - Review your requirements
   - Generate test cases
   - Execute tests and provide results

## License

MIT
