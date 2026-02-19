
import { describe, it, expect } from 'vitest';
import { skillRegistry, getSkillDescriptions } from '@/services/agenticSkills';

describe('Agentic Skills', () => {
  it('each skill\'s execute method returns an object or string (not null/undefined)', async () => {
    for (const skill of Object.values(skillRegistry)) {
      // Mock arguments for skills that might require them
      const args: Record<string, string> = {};
      if (skill.name === 'jira_search') {args.query = 'test';}
      if (skill.name === 'github_issue_create') {args.title = 'test'; args.body = 'test';}
      if (skill.name === 'test_runner') {args.testCaseId = 'TC-1';}
      if (skill.name === 'code_analysis') {args.code = 'const x = 1;';}
      if (skill.name === 'tiny_gpt_reference') {args.topic = 'attention';}
      if (skill.name === 'performance_audit') {args.url = 'https://example.com';}
      if (skill.name === 'gemini_knowledge_base') {args.topic = 'models';}

      const result = await skill.execute(args);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    }
  }, 10000);

  it('getSkillDescriptions() returns a string containing all 7 skill names', () => {
    const descriptions = getSkillDescriptions();
    const skillNames = Object.keys(skillRegistry);

    expect(typeof descriptions).toBe('string');
    for (const name of skillNames) {
      expect(descriptions).toContain(name);
    }
    expect(skillNames.length).toBe(7);
  });
});
