import ora from 'ora';
import path from 'path';
import inquirer from 'inquirer';
import { promptInitQuestions } from './prompts.js';
import { resolveTeamAgents } from '../profiles/resolver.js';
import { executeGeneration } from '../generators/reference.js';
import { ProjectConfig } from '../profiles/types.js';
import { logger } from '../utils/logger.js';
import { PLATFORM_NAMES } from '../utils/constants.js';

export async function initCommand(options: { dryRun?: boolean; targetDir?: string }): Promise<void> {
  logger.header('🏢 Agents-HR — Inicialización de Agencia de Agentes AI');

  const answers = await promptInitQuestions();
  const projectPath = options.targetDir ? path.resolve(options.targetDir) : process.cwd();
  const projectName = path.basename(projectPath);

  const resolvedAgents = await resolveTeamAgents(
    answers.selectedAgents,
    answers.stack,
    answers.architecture,
    projectPath
  );

  console.log('\n📋 ' + logger.header('Resumen del Equipo Seleccionado:'));
  resolvedAgents.forEach((a) => {
    console.log(`  ${a.emoji}  ${a.name} (${a.id}) ${a.isCustom ? '[CUSTOM]' : ''}`);
  });

  console.log(`\n📦 Plataforma Principal: ${PLATFORM_NAMES[answers.primaryPlatform]}`);
  if (answers.secondaryPlatforms.length > 0) {
    console.log(
      `🔗 Plataformas Secundarias (Referencias): ${answers.secondaryPlatforms
        .map((p) => PLATFORM_NAMES[p])
        .join(', ')}`
    );
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '¿Proceder a generar los archivos en el proyecto?',
      default: true,
    },
  ]);

  if (!confirm) {
    logger.warning('Inicialización cancelada por el usuario.');
    return;
  }

  const spinner = ora('Generando arquitectura de agentes...').start();

  try {
    const config: ProjectConfig = {
      version: 1,
      generated_at: new Date().toISOString(),
      platform: {
        primary: answers.primaryPlatform,
        secondary: answers.secondaryPlatforms,
      },
      stack: answers.stack,
      architecture: answers.architecture,
      team: resolvedAgents.map((a) => a.id),
    };

    await executeGeneration({
      projectPath,
      projectName,
      config,
      agents: resolvedAgents,
      dryRun: options.dryRun,
    });

    spinner.succeed('¡Arquitectura agéntica generada con éxito!');
    logger.success(`Se configuraron ${resolvedAgents.length} agentes para tu proyecto.`);
  } catch (err: unknown) {
    spinner.fail('Error al generar la arquitectura de agentes.');
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
