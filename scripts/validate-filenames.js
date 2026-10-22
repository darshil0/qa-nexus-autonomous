import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

export function checkFilenameHazards(rootDir = '.') {
  const invalidChars = /[<>:"\\|?*]/;
  const reservedNames = new Set([
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ]);

  let gitFiles = [];
  try {
    const stdout = execSync('git ls-files', { encoding: 'utf-8' });
    gitFiles = stdout.split('\n').filter(Boolean);
  } catch {
    // Fallback if git is unavailable
    function walk(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        if (file === '.git' || file === 'node_modules' || file === 'dist' || file === 'coverage') {
          continue;
        }
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          results = results.concat(walk(filePath));
        } else {
          results.push(path.relative(rootDir, filePath));
        }
      }
      return results;
    }
    gitFiles = walk(rootDir);
  }

  const issues = [];
  const seenPathsLower = new Map();

  for (const rawPath of gitFiles) {
    const normPath = rawPath.replace(/\\/g, '/');
    const lowerPath = normPath.toLowerCase();

    if (seenPathsLower.has(lowerPath) && seenPathsLower.get(lowerPath) !== normPath) {
      issues.push(`Case collision detected: '${normPath}' collides with '${seenPathsLower.get(lowerPath)}'`);
    } else {
      seenPathsLower.set(lowerPath, normPath);
    }

    const segments = normPath.split('/');
    for (const segment of segments) {
      if (!segment) { continue; }

      if (segment.endsWith('.') || segment.endsWith(' ')) {
        issues.push(`Trailing period or space in path segment '${segment}' of file '${normPath}'`);
      }

      const baseName = segment.split('.')[0].toUpperCase();
      if (reservedNames.has(baseName)) {
        issues.push(`Reserved Windows filename '${segment}' detected in file '${normPath}'`);
      }

      if (invalidChars.test(segment)) {
        issues.push(`Invalid character in file path '${normPath}': '${segment}'`);
      }
    }
  }

  return issues;
}

if (process.argv[1] && process.argv[1].endsWith('validate-filenames.js')) {
  const issues = checkFilenameHazards();
  if (issues.length > 0) {
    console.error('Filename Validation Failed:');
    for (const issue of issues) {
      console.error(`  • ${issue}`);
    }
    process.exit(1);
  } else {
    console.log('Filename validation passed successfully.');
  }
}
