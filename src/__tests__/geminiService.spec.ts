
import { fetchJiraRequirement, reviewRequirements } from '../services/geminiService';
import { test, expect } from 'vitest';

test('fetchJiraRequirement returns formatted data', async () => {
  const res = await fetchJiraRequirement('AUTH-101');
  expect(res).toContain('AUTH-101');
  expect(res).toContain('Title:');
});

test('reviewRequirements throws when AI client not initialized', async () => {
  await expect(reviewRequirements('some input')).rejects.toThrow('GenAI client not initialized');
});