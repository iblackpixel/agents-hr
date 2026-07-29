import path from 'path';
import { readYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { resolveTeamAgents } from '../profiles/resolver.js';
import { logger } from '../utils/logger.js';
import { PLATFORM_NAMES } from '../utils/constants.js';

export async function teamCommand(): Promise<void> {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  const config = await readYamlFile<ProjectConfig>(configPath);
  if (!config) {
    logger.error('No se encontró el equipo de agents-hr configurado en este directorio.');
    logger.info('Ejecutá "agents-hr init" para inicializar.');
    return;
  }

  const agents = await resolveTeamAgents(
    config.team,
    config.stack,
    config.architecture,
    projectPath
  );

  logger.header(`🏢 Equipo Actual de ${path.basename(projectPath)}`);
  console.log(`📦 Plataforma Principal: ${PLATFORM_NAMES[config.platform.primary]}`);
  if (config.platform.secondary?.length) {
    console.log(
      `🔗 Secundarias: ${config.platform.secondary.map((p) => PLATFORM_NAMES[p]).join(', ')}`
    );
  }
  console.log(`📐 Stack: ${config.stack} | Arquitectura: ${config.architecture}`);
  console.log('─'.repeat(55));

  agents.forEach((a) => {
    console.log(`  ${a.emoji}  ${a.name.padEnd(25)} (id: ${a.id}) ${a.isCustom ? '[CUSTOM]' : ''}`);
    console.log(`      ${a.description.trim()}`);
  });
}
