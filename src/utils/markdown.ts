import handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Registrar partials compartidos de Handlebars
export async function setupHandlebars(): Promise<void> {
  const rootDir = path.resolve(__dirname, '../../templates/shared');
  if (await fs.pathExists(rootDir)) {
    const teamHeader = await fs.readFile(path.join(rootDir, 'team-header.md.hbs'), 'utf-8');
    const agentSection = await fs.readFile(path.join(rootDir, 'agent-section.md.hbs'), 'utf-8');
    
    handlebars.registerPartial('shared_team_header', teamHeader);
    handlebars.registerPartial('shared_agent_section', agentSection);
  }
}

export async function renderTemplate(templatePath: string, data: Record<string, unknown>): Promise<string> {
  await setupHandlebars();
  const source = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(data);
}
