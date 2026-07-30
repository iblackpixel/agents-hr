import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import { readYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { logger } from '../utils/logger.js';

export interface CleanOptions {
  force?: boolean;
  keepCustom?: boolean;
  dryRun?: boolean;
  targetDir?: string;
}

export async function cleanCommand(options: CleanOptions = {}): Promise<void> {
  const projectPath = options.targetDir ? path.resolve(options.targetDir) : process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  const config = await readYamlFile<ProjectConfig>(configPath);

  const targets: string[] = [
    path.join(projectPath, 'GEMINI.md'),
    path.join(projectPath, 'CLAUDE.md'),
    path.join(projectPath, 'AGENTS.md'),
    path.join(projectPath, '.gemini/rules'),
    path.join(projectPath, '.claude/rules'),
    path.join(projectPath, '.claude/agents'),
    path.join(projectPath, '.codex/skills'),
    path.join(projectPath, '.cursor/rules'),
  ];

  if (!options.keepCustom) {
    targets.push(path.join(projectPath, 'agents-hr'));
  } else {
    targets.push(configPath);
  }

  // Filter only existing targets
  const existingTargets: string[] = [];
  for (const target of targets) {
    if (await fs.pathExists(target)) {
      existingTargets.push(target);
    }
  }

  if (existingTargets.length === 0) {
    logger.info('No se encontraron archivos o carpetas agénticas para limpiar.');
    return;
  }

  logger.header('🧹 Archivos y Carpetas a Eliminar:');
  existingTargets.forEach((t) => {
    console.log(`  🗑️  ${path.relative(projectPath, t)}`);
  });

  if (options.dryRun) {
    logger.info('[DRY-RUN] Modo simulación activo. Ningún archivo fue eliminado.');
    return;
  }

  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '¿Estás seguro de eliminar la estructura agéntica del proyecto?',
        default: false,
      },
    ]);

    if (!confirm) {
      logger.warning('Operación de limpieza cancelada.');
      return;
    }
  }

  const spinner = ora('Eliminando estructura agéntica...').start();

  try {
    for (const target of existingTargets) {
      await fs.remove(target);
    }

    // Clean up empty platform parent dirs if they become empty
    const parentDirs = ['.gemini', '.claude', '.codex', '.cursor'];
    for (const pDir of parentDirs) {
      const fullPDir = path.join(projectPath, pDir);
      if (await fs.pathExists(fullPDir)) {
        const contents = await fs.readdir(fullPDir);
        if (contents.length === 0) {
          await fs.remove(fullPDir);
        }
      }
    }

    spinner.succeed('¡Estructura agéntica eliminada correctamente!');
    logger.success('El proyecto quedó limpio para comenzar de cero.');
  } catch (err: unknown) {
    spinner.fail('Error al realizar la limpieza.');
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
