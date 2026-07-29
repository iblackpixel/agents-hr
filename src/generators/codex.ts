import path from 'path';
import { fileURLToPath } from 'url';
import { PlatformGenerator } from './base.js';
import { GeneratorOptions } from '../profiles/types.js';
import { renderTemplate } from '../utils/markdown.js';
import { writeOutputFile } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CodexGenerator implements PlatformGenerator {
  public async generatePrimary(options: GeneratorOptions): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/codex');
    
    // 1. Render primary AGENTS.md
    const primaryContent = await renderTemplate(path.join(templatesDir, 'primary.md.hbs'), {
      projectName: options.projectName,
      generatedAt: options.config.generated_at,
      stack: options.config.stack,
      architecture: options.config.architecture,
      team: options.agents,
      agents: options.agents,
    });
    await writeOutputFile(path.join(options.projectPath, 'AGENTS.md'), primaryContent, options.dryRun);

    // 2. Render skills for each agent in .codex/skills/{id}/SKILL.md
    const skillTemplatePath = path.join(templatesDir, 'skill.md.hbs');
    for (const agent of options.agents) {
      const skillContent = await renderTemplate(skillTemplatePath, {
        agent,
        stack: options.config.stack,
        stackRules: agent.resolvedStackRules,
      });
      await writeOutputFile(
        path.join(options.projectPath, `.codex/skills/${agent.id}/SKILL.md`),
        skillContent,
        options.dryRun
      );
    }
  }

  public async generateSecondary(options: GeneratorOptions, primaryPlatform: string): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/codex');
    const primaryFileName = primaryPlatform === 'antigravity' ? 'GEMINI.md' : 'CLAUDE.md';

    const secondaryContent = await renderTemplate(path.join(templatesDir, 'secondary.md.hbs'), {
      primaryPlatformName: primaryPlatform,
      primaryFileName,
    });
    await writeOutputFile(path.join(options.projectPath, 'AGENTS.md'), secondaryContent, options.dryRun);
  }
}
