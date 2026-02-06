
import { setAiClient, reviewRequirements, generateTestCases, executeTests } from '../services/geminiService';
import { test, expect, beforeEach } from 'vitest';

// Helper to create a fake client
const makeClient = (text: string) => ({ models: { generateContent: async () => ({ text }) } });

beforeEach(() => setAiClient(undefined));

test('reviewRequirements handles empty response text', async () => {
  setAiClient(makeClient('') as any);
  const res = await reviewRequirements('something');
  expect(res.specs).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('reviewRequirements handles malformed JSON', async () => {
  setAiClient(makeClient('not-json') as any);
  const res = await reviewRequirements('something');
  expect(res.specs).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});

test('generateTestCases handles empty response text', async () => {
  setAiClient(makeClient('') as any);
  const res = await generateTestCases([]);
  expect(res.testCases).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('generateTestCases handles malformed JSON', async () => {
  setAiClient(makeClient('oops') as any);
  const res = await generateTestCases([]);
  expect(res.testCases).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});

test('executeTests handles empty response text', async () => {
  setAiClient(makeClient('') as any);
  const res = await executeTests([]);
  expect(res.results).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('executeTests handles malformed JSON', async () => {
  setAiClient(makeClient('broken') as any);
  const res = await executeTests([]);
  expect(res.results).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});