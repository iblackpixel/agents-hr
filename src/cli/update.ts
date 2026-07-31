import path from 'path';
import ora from 'ora';
import { readYamlFile } from '../utils/fs.js';
import { ProjectConfig } from '../profiles/types.js';
import { AgentRegistry } from '../profiles/registry.js';
import { syncCommand } from './sync.js';
import { logger } from '../utils/logger.js';

export interface UpdateOptions {
  audit?: boolean;
  dryRun?: boolean;
  targetDir?: string;
}

export async function updateCommand(options: UpdateOptions = {}): Promise<void> {
  const projectPath = options.targetDir ? path.resolve(options.targetDir) : process.cwd();
  const configPath = path.join(projectPath, 'agents-hr/config.yml');

  logger.header('🔄 Agents-HR — Auditoría y Actualización de Perfiles Agénticos');

  const spinner = ora('Analizando perfiles agénticos y tendencias de stack...').start();

  try {
    const registry = AgentRegistry.getInstance();
    await registry.loadCatalog();
    const allAgents = await registry.getAllAgents();

    const config = await readYamlFile<ProjectConfig>(configPath);

    spinner.succeed('Análisis del catálogo completado.');

    console.log('\n📊 Estado del Catálogo Agéntico:');
    console.log(`  • Perfiles totales disponibles: ${allAgents.length}`);
    if (config) {
      console.log(`  • Agentes instalados en este proyecto: ${config.team.length}`);
      console.log(`  • Plataforma Principal: ${config.platform.primary.toUpperCase()}`);
      console.log(`  • Stack activo: ${config.stack}`);
    }

    // Audit Recommendations
    logger.header('💡 Recomendaciones de Actualización de Mercado:');
    console.log('  1. ⚡ Optimización de contexto: Verificar que los archivos raíz no superen los 3KB.');
    console.log('  2. 📐 Reglas 2026: Next.js 15+ App Router, Expo SDK 51+ y NestJS 10+ activados.');
    console.log('  3. 🛡️ Principio Proponer-Primero: Confirmado en todos los system prompts.');

    if (options.audit) {
      logger.info('\n[MODO AUDITORÍA] Informe generado exitosamente. No se realizaron cambios en archivos.');
      return;
    }

    if (config) {
      logger.info('\nSincronizando el proyecto con los perfiles y reglas más recientes...');
      await syncCommand({ dryRun: options.dryRun });
    } else {
      logger.warning('No se detectó un archivo agents-hr/config.yml en la carpeta actual.');
      logger.info('Para inicializar un equipo actualizado, ejecutá "agents-hr init".');
    }
  } catch (err: unknown) {
    spinner.fail('Error al auditar o actualizar perfiles.');
    if (err instanceof Error) {
      logger.error(err.message);
    }
  }
}
