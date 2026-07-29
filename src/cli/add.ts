import path from 'path';
import { readYamlFile, writeYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { AgentRegistry } from '../profiles/registry.js';
import { syncCommand } from './sync.js';
import { logger } from '../utils/logger.js';

export async function addCommand(agentId: string, options: { dryRun?: boolean }): Promise<void> {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  const config = await readYamlFile<ProjectConfig>(configPath);
  if (!config) {
    logger.error('No se encontró el archivo agents-hr/config.yml en la carpeta actual.');
    logger.info('Ejecutá "agents-hr init" primero.');
    return;
  }

  const registry = AgentRegistry.getInstance();
  const agent = await registry.getAgent(agentId);

  if (!agent) {
    logger.error(`El agente '${agentId}' no existe en el catálogo.`);
    return;
  }

  if (config.team.includes(agentId)) {
    logger.warning(`El agente '${agentId}' ya está incluido en el equipo.`);
    return;
  }

  config.team.push(agentId);
  await writeYamlFile(configPath, config, options.dryRun);

  logger.success(`Agregado '${agent.name}' (${agent.id}) al equipo.`);
  await syncCommand(options);
}
