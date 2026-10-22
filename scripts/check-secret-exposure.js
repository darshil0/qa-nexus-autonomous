import fs from 'node:fs';
import path from 'node:path';

export function checkDistSecrets(distDir = 'dist') {
  if (!fs.existsSync(distDir)) {
    console.warn(`Directory '${distDir}' does not exist. Skipping secret check.`);
    return [];
  }

  const secretPatterns = [
    { name: 'VITE_GEMINI_API_KEY reference', regex: /VITE_GEMINI_API_KEY/ },
    { name: 'Google API key string pattern', regex: /AIzaSy[A-Za-z0-9_-]{33}/ }
  ];

  const issues = [];

  function scanDirectory(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.html') || item.endsWith('.css'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const pattern of secretPatterns) {
          if (pattern.regex.test(content)) {
            issues.push(`Secret pattern '${pattern.name}' found in bundle file '${fullPath}'`);
          }
        }
      }
    }
  }

  scanDirectory(distDir);
  return issues;
}

if (process.argv[1] && process.argv[1].endsWith('check-secret-exposure.js')) {
  const issues = checkDistSecrets();
  if (issues.length > 0) {
    console.error('Secret Exposure Check Failed:');
    for (const issue of issues) {
      console.error(`  • ${issue}`);
    }
    process.exit(1);
  } else {
    console.log('Secret exposure check passed successfully. No credentials in build output.');
  }
}
