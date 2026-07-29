import path from 'path';
import { fileURLToPath } from 'url';
import { PlatformGenerator } from './base.js';
import { GeneratorOptions } from '../profiles/types.js';
import { renderTemplate } from '../utils/markdown.js';
import { writeOutputFile } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AntigravityGenerator implements PlatformGenerator {
  public async generatePrimary(options: GeneratorOptions): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/antigravity');
    
    // 1. Render primary GEMINI.md
    const primaryContent = await renderTemplate(path.join(templatesDir, 'primary.md.hbs'), {
      projectName: options.projectName,
      generatedAt: options.config.generated_at,
      stack: options.config.stack,
      architecture: options.config.architecture,
      team: options.agents,
      agents: options.agents,
    });
    await writeOutputFile(path.join(options.projectPath, 'GEMINI.md'), primaryContent, options.dryRun);

    // 2. Render rules for each agent in .gemini/rules/
    const ruleTemplatePath = path.join(templatesDir, 'rule.md.hbs');
    for (const agent of options.agents) {
      const ruleContent = await renderTemplate(ruleTemplatePath, {
        agent,
        stack: options.config.stack,
        stackRules: agent.resolvedStackRules,
      });
      await writeOutputFile(
        path.join(options.projectPath, `.gemini/rules/${agent.id}.md`),
        ruleContent,
        options.dryRun
      );
    }
  }

  public async generateSecondary(options: GeneratorOptions, primaryPlatform: string): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/antigravity');
    const primaryFileName = primaryPlatform === 'codex' ? 'AGENTS.md' : 'CLAUDE.md';

    const secondaryContent = await renderTemplate(path.join(templatesDir, 'secondary.md.hbs'), {
      primaryPlatformName: primaryPlatform,
      primaryFileName,
    });
    await writeOutputFile(path.join(options.projectPath, 'GEMINI.md'), secondaryContent, options.dryRun);
  }
}
