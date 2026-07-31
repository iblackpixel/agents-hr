import { describe, it, expect } from 'vitest';
import { updateCommand } from '../src/cli/update.js';
import { AgentRegistry } from '../src/profiles/registry.js';

describe('Update Command', () => {
  it('should find the new profile-updater agent in catalog', async () => {
    const registry = AgentRegistry.getInstance();
    const agent = await registry.getAgent('profile-updater');
    expect(agent).toBeDefined();
    expect(agent?.name).toBe('Profile & Agentic Trends Auditor');
    expect(agent?.category).toBe('specialist');
  });

  it('should run audit mode without throwing errors', async () => {
    await expect(updateCommand({ audit: true, dryRun: true })).resolves.not.toThrow();
  });
});
