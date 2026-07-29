import path from 'path';
import { fileURLToPath } from 'url';
import { PlatformGenerator } from './base.js';
import { GeneratorOptions } from '../profiles/types.js';
import { renderTemplate } from '../utils/markdown.js';
import { writeOutputFile } from '../utils/fs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ClaudeGenerator implements PlatformGenerator {
  public async generatePrimary(options: GeneratorOptions): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/claude');
    
    // 1. Render primary CLAUDE.md
    const primaryContent = await renderTemplate(path.join(templatesDir, 'primary.md.hbs'), {
      projectName: options.projectName,
      generatedAt: options.config.generated_at,
      stack: options.config.stack,
      architecture: options.config.architecture,
      team: options.agents,
      agents: options.agents,
    });
    await writeOutputFile(path.join(options.projectPath, 'CLAUDE.md'), primaryContent, options.dryRun);

    // 2. Render rules for each agent in .claude/rules/
    const ruleTemplatePath = path.resolve(__dirname, '../../templates/antigravity/rule.md.hbs');
    for (const agent of options.agents) {
      const ruleContent = await renderTemplate(ruleTemplatePath, {
        agent,
        stack: options.config.stack,
        stackRules: agent.resolvedStackRules,
      });
      await writeOutputFile(
        path.join(options.projectPath, `.claude/rules/${agent.id}.md`),
        ruleContent,
        options.dryRun
      );
    }

    // 3. Render subagents for each agent in .claude/agents/
    const agentTemplatePath = path.join(templatesDir, 'agent.md.hbs');
    for (const agent of options.agents) {
      const agentContent = await renderTemplate(agentTemplatePath, {
        agent,
        stack: options.config.stack,
        stackRules: agent.resolvedStackRules,
      });
      await writeOutputFile(
        path.join(options.projectPath, `.claude/agents/${agent.id}.md`),
        agentContent,
        options.dryRun
      );
    }
  }

  public async generateSecondary(options: GeneratorOptions, primaryPlatform: string): Promise<void> {
    const templatesDir = path.resolve(__dirname, '../../templates/claude');
    const primaryFileName = primaryPlatform === 'antigravity' ? 'GEMINI.md' : 'AGENTS.md';

    const secondaryContent = await renderTemplate(path.join(templatesDir, 'secondary.md.hbs'), {
      primaryPlatformName: primaryPlatform,
      primaryFileName,
    });
    await writeOutputFile(path.join(options.projectPath, 'CLAUDE.md'), secondaryContent, options.dryRun);
  }
}
