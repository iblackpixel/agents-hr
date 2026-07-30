import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { executeGeneration } from '../src/generators/reference.js';
import { cleanCommand } from '../src/cli/clean.js';
import { ProjectConfig } from '../src/profiles/types.js';
import { resolveTeamAgents } from '../src/profiles/resolver.js';

const tempProjectDir = path.resolve(__dirname, 'fixtures/temp-project');

describe('Clean Command', () => {
  beforeEach(async () => {
    await fs.ensureDir(tempProjectDir);
    const config: ProjectConfig = {
      version: 1,
      generated_at: new Date().toISOString(),
      platform: { primary: 'antigravity', secondary: ['claude', 'codex'] },
      stack: 'nextjs',
      architecture: 'standard',
      team: ['tech-lead', 'qa-engineer'],
    };

    const agents = await resolveTeamAgents(['tech-lead', 'qa-engineer'], 'nextjs', 'standard', tempProjectDir);
    await executeGeneration({
      projectPath: tempProjectDir,
      projectName: 'temp-project',
      config,
      agents,
    });
  });

  afterEach(async () => {
    await fs.remove(tempProjectDir);
  });

  it('should generate agentic files correctly in temp directory', async () => {
    expect(await fs.pathExists(path.join(tempProjectDir, 'GEMINI.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tempProjectDir, 'CLAUDE.md'))).toBe(true);
    expect(await fs.pathExists(path.join(tempProjectDir, 'AGENTS.md'))).toBe(true);
  });

  it('should clean all generated files when running cleanCommand with force and targetDir', async () => {
    await cleanCommand({ force: true, targetDir: tempProjectDir });

    expect(await fs.pathExists(path.join(tempProjectDir, 'GEMINI.md'))).toBe(false);
    expect(await fs.pathExists(path.join(tempProjectDir, 'CLAUDE.md'))).toBe(false);
    expect(await fs.pathExists(path.join(tempProjectDir, 'AGENTS.md'))).toBe(false);
    expect(await fs.pathExists(path.join(tempProjectDir, 'agents-hr'))).toBe(false);
  });
});
