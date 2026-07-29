import path from 'path';
import { readYamlFile, writeYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { syncCommand } from './sync.js';
import { logger } from '../utils/logger.js';

export async function removeCommand(agentId: string, options: { dryRun?: boolean }): Promise<void> {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  const config = await readYamlFile<ProjectConfig>(configPath);
  if (!config) {
    logger.error('No se encontró el archivo agents-hr/config.yml en la carpeta actual.');
    return;
  }

  if (!config.team.includes(agentId)) {
    logger.warning(`El agente '${agentId}' no forma parte del equipo actual.`);
    return;
  }

  config.team = config.team.filter((id) => id !== agentId);
  await writeYamlFile(configPath, config, options.dryRun);

  logger.success(`Removido '${agentId}' del equipo.`);
  await syncCommand(options);
}
