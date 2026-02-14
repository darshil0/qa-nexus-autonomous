
import { setAiClient, reviewRequirements, generateTestCases, executeTests } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import { test, expect, beforeEach, afterEach, vi } from 'vitest';

// Helper to create a fake client
const makeClient = (text: string) => ({ models: { generateContent: async () => await Promise.resolve({ text: () => text }) } });

beforeEach(() => {
  setAiClient(undefined);
  vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('reviewRequirements handles empty response text', async () => {
  setAiClient(makeClient('') as unknown as GoogleGenAI);
  const res = await reviewRequirements('something');
  expect(res.specs).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('reviewRequirements handles malformed JSON', async () => {
  setAiClient(makeClient('not-json') as unknown as GoogleGenAI);
  const res = await reviewRequirements('something');
  expect(res.specs).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});

test('generateTestCases handles empty response text', async () => {
  setAiClient(makeClient('') as unknown as GoogleGenAI);
  const res = await generateTestCases([]);
  expect(res.testCases).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('generateTestCases handles malformed JSON', async () => {
  setAiClient(makeClient('oops') as unknown as GoogleGenAI);
  const res = await generateTestCases([]);
  expect(res.testCases).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});

test('executeTests handles empty response text', async () => {
  setAiClient(makeClient('') as unknown as GoogleGenAI);
  const res = await executeTests([]);
  expect(res.results).toEqual([]);
  expect(res.thinking).toMatch(/No response/i);
});

test('executeTests handles malformed JSON', async () => {
  setAiClient(makeClient('broken') as unknown as GoogleGenAI);
  const res = await executeTests([]);
  expect(res.results).toEqual([]);
  expect(res.thinking).toMatch(/Could not parse/i);
});
