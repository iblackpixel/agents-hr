import { AgentRegistry } from '../profiles/registry.js';
import { logger } from '../utils/logger.js';

export async function listCommand(options: { category?: string }): Promise<void> {
  const registry = AgentRegistry.getInstance();
  await registry.loadCatalog();

  logger.header('🏢 Agents-HR — Catálogo de Perfiles de Agentes AI');

  const agents = options.category
    ? await registry.getAgentsByCategory(options.category)
    : await registry.getAllAgents();

  if (agents.length === 0) {
    logger.warning(`No se encontraron agentes en la categoría '${options.category}'.`);
    return;
  }

  const grouped: Record<string, typeof agents> = {};
  agents.forEach((a) => {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  });

  for (const [cat, items] of Object.entries(grouped)) {
    console.log(`\n📁 Categoría: ${cat.toUpperCase()}`);
    console.log('─'.repeat(50));
    items.forEach((a) => {
      console.log(`  ${a.emoji}  ${a.name.padEnd(25)} (id: ${a.id})`);
      console.log(`      ${a.description.trim()}`);
    });
  }
}
