import { describe, it, expect } from 'vitest';
// @ts-expect-error JS script import without declaration
import { checkFilenameHazards } from '../../scripts/validate-filenames.js';
// @ts-expect-error JS script import without declaration
import { checkDistSecrets } from '../../scripts/check-secret-exposure.js';
import fs from 'node:fs';
import path from 'node:path';

type FilenameChecker = (dir?: string) => string[];
type SecretChecker = (dir?: string) => string[];

const validateFilenamesFn = checkFilenameHazards as FilenameChecker;
const checkDistSecretsFn = checkDistSecrets as SecretChecker;

describe('Filename Validation Script', () => {
  it('detects no issues in current repository tracked files', () => {
    const issues = validateFilenamesFn('.');
    expect(issues).toEqual([]);
  });
});

describe('Secret Exposure Script', () => {
  it('scans dist directory without throwing and detects secret key patterns if present', () => {
    const testDir = path.resolve(process.cwd(), 'node_modules/.tmp_test_dist');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const cleanFile = path.join(testDir, 'clean.js');
    fs.writeFileSync(cleanFile, 'console.log("no secrets");');

    const cleanResult = checkDistSecretsFn(testDir);
    expect(cleanResult).toEqual([]);

    const dirtyFile = path.join(testDir, 'secret.js');
    fs.writeFileSync(dirtyFile, 'const key = "VITE_GEMINI_API_KEY";');

    const dirtyResult = checkDistSecretsFn(testDir);
    expect(dirtyResult.length).toBeGreaterThan(0);
    expect(dirtyResult[0]).toContain('VITE_GEMINI_API_KEY');

    fs.rmSync(testDir, { recursive: true, force: true });
  });
});
