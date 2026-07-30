import { cleanCommand, CleanOptions } from './clean.js';
import { initCommand } from './init.js';
import { logger } from '../utils/logger.js';

export async function resetCommand(options: CleanOptions = {}): Promise<void> {
  logger.header('🔄 Reset de Arquitectura Agéntica');
  console.log('Se limpiará la estructura actual y se ejecutará el instalador interactivo.\n');

  // Perform clean with force flag if specified or confirmed
  await cleanCommand({ ...options, force: options.force });

  console.log('\n---------------------------------------------------');
  logger.info('Iniciando proceso de configuración desde cero...\n');

  await initCommand({ dryRun: options.dryRun });
}
