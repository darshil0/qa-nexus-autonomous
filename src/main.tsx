import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/assets/styles/index.css';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { validateEnv } from '@/utils/validateEnv';

// Validate environment before rendering
try {
  validateEnv();
} catch (err) {
  console.error('Environment validation failed:', err);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
