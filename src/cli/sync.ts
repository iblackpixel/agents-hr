import path from 'path';
import ora from 'ora';
import { readYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { resolveTeamAgents } from '../profiles/resolver.js';
import { executeGeneration } from '../generators/reference.js';
import { logger } from '../utils/logger.js';

export async function syncCommand(options: { dryRun?: boolean }): Promise<void> {
  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  const config = await readYamlFile<ProjectConfig>(configPath);
  if (!config) {
    logger.error('No se encontró el archivo agents-hr/config.yml en la carpeta actual.');
    logger.info('Ejecutá "agents-hr init" primero para inicializar el proyecto.');
    return;
  }

  const spinner = ora('Sincronizando archivos del equipo de agentes...').start();

  try {
    const resolvedAgents = await resolveTeamAgents(
      config.team,
      config.stack,
      config.architecture,
      projectPath
    );

    config.generated_at = new Date().toISOString();

    await executeGeneration({
      projectPath,
      projectName: path.basename(projectPath),
      config,
      agents: resolvedAgents,
      dryRun: options.dryRun,
    });

    spinner.succeed('¡Equipo de agentes sincronizado con éxito!');
    logger.success(`Sincronizados ${resolvedAgents.length} agentes.`);
  } catch (err: unknown) {
    spinner.fail('Error al sincronizar el equipo.');
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
