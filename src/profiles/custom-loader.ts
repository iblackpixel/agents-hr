import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { AgentProfile } from './types.js';

export async function loadCustomAgents(projectPath: string): Promise<AgentProfile[]> {
  const customDir = path.join(projectPath, 'agents-hr/custom');
  const customAgents: AgentProfile[] = [];

  if (!(await fs.pathExists(customDir))) {
    return customAgents;
  }

  const files = await fs.readdir(customDir);
  for (const file of files) {
    if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      const filePath = path.join(customDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const agent = yaml.load(content) as AgentProfile;
      agent.isCustom = true;
      customAgents.push(agent);
    }
  }

  return customAgents;
}
