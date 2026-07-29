import { describe, it, expect } from 'vitest';
import { AgentRegistry } from '../src/profiles/registry.js';
import { resolveTeamAgents } from '../src/profiles/resolver.js';

describe('AgentRegistry', () => {
  it('should load all agents from the catalog', async () => {
    const registry = AgentRegistry.getInstance();
    const agents = await registry.getAllAgents();
    expect(agents.length).toBeGreaterThanOrEqual(22);
  });

  it('should retrieve tech-lead agent profile', async () => {
    const registry = AgentRegistry.getInstance();
    const techLead = await registry.getAgent('tech-lead');
    expect(techLead).toBeDefined();
    expect(techLead?.name).toBe('Tech Lead');
    expect(techLead?.category).toBe('tech');
  });

  it('should auto-include tech-lead and qa-engineer for standard architecture', async () => {
    const resolved = await resolveTeamAgents([], 'nextjs', 'standard', process.cwd());
    const ids = resolved.map((a) => a.id);
    expect(ids).toContain('tech-lead');
    expect(ids).toContain('frontend-dev');
    expect(ids).toContain('qa-engineer');
  });

  it('should resolve nextjs stack rules for tech-lead', async () => {
    const resolved = await resolveTeamAgents(['tech-lead'], 'nextjs', 'standard', process.cwd());
    const techLead = resolved.find((a) => a.id === 'tech-lead');
    expect(techLead?.resolvedStackRules).toBeDefined();
    expect(techLead?.resolvedStackRules?.some((r) => r.includes('App Router'))).toBe(true);
  });
});
