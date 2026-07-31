import { Command } from 'commander';
import { initCommand } from './cli/init.js';
import { listCommand } from './cli/list.js';
import { addCommand } from './cli/add.js';
import { removeCommand } from './cli/remove.js';
import { syncCommand } from './cli/sync.js';
import { teamCommand } from './cli/team.js';
import { cleanCommand } from './cli/clean.js';
import { resetCommand } from './cli/reset.js';
import { updateCommand } from './cli/update.js';

export async function runCli(): Promise<void> {
  const program = new Command();

  program
    .name('agents-hr')
    .description('🏢 Agencia de Recursos Humanos para Agentes AI en proyectos de software móvil y web')
    .version('1.0.0');

  program
    .command('init')
    .description('Inicializar la arquitectura de agentes de forma interactiva en el proyecto actual')
    .option('--dry-run', 'Simular la ejecución sin modificar o crear archivos')
    .option('-t, --target <dir>', 'Directorio de destino (default: carpeta actual)')
    .action((options) => initCommand({ dryRun: options.dryRun, targetDir: options.target }));

  program
    .command('list')
    .description('Listar los perfiles de agentes disponibles en el catálogo')
    .option('-c, --category <category>', 'Filtrar por categoría (tech, product, comms, specialist)')
    .action((options) => listCommand({ category: options.category }));

  program
    .command('add <agentId>')
    .description('Agregar un perfil del catálogo al equipo del proyecto')
    .option('--dry-run', 'Simular sin escribir archivos')
    .action((agentId, options) => addCommand(agentId, { dryRun: options.dryRun }));

  program
    .command('remove <agentId>')
    .description('Remover un agente del equipo del proyecto')
    .option('--dry-run', 'Simular sin escribir archivos')
    .action((agentId, options) => removeCommand(agentId, { dryRun: options.dryRun }));

  program
    .command('sync')
    .description('Sincronizar y regenerar archivos de plataforma según config.yml y agentes custom')
    .option('--dry-run', 'Simular sin escribir archivos')
    .action((options) => syncCommand({ dryRun: options.dryRun }));

  program
    .command('team')
    .description('Ver la lista de agentes del equipo configurado en el proyecto')
    .action(() => teamCommand());

  program
    .command('clean')
    .description('Eliminar la estructura agéntica del proyecto actual para empezar de cero')
    .option('-f, --force', 'Saltar la confirmación interactiva')
    .option('--keep-custom', 'Preservar los agentes definidos en agents-hr/custom/')
    .option('--dry-run', 'Simular los archivos a borrar sin modificar el disco')
    .action((options) => cleanCommand({ force: options.force, keepCustom: options.keepCustom, dryRun: options.dryRun }));

  program
    .command('reset')
    .description('Limpiar la estructura agéntica actual y ejecutar init de nuevo en un solo paso')
    .option('-f, --force', 'Saltar la confirmación interactiva de limpieza')
    .option('--keep-custom', 'Preservar los agentes definidos en agents-hr/custom/')
    .action((options) => resetCommand({ force: options.force, keepCustom: options.keepCustom }));

  program
    .command('update')
    .description('Auditar y actualizar los perfiles agénticos con las tendencias más recientes del mercado')
    .option('-a, --audit', 'Solo realizar una auditoría de recomendaciones sin modificar nada')
    .option('--dry-run', 'Simular cambios sin escribir en disco')
    .action((options) => updateCommand({ audit: options.audit, dryRun: options.dryRun }));

  await program.parseAsync(process.argv);
}
