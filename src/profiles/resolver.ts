import { AgentRegistry } from './registry.js';
import { loadCustomAgents } from './custom-loader.js';
import { AgentProfile, ArchitectureType } from './types.js';

export async function resolveTeamAgents(
  selectedIds: string[],
  stack: string,
  architecture: ArchitectureType,
  projectPath: string
): Promise<AgentProfile[]> {
  const registry = AgentRegistry.getInstance();
  await registry.loadCatalog();

  const allCatalogAgents = await registry.getAllAgents();
  const customAgents = await loadCustomAgents(projectPath);

  const customMap = new Map<string, AgentProfile>();
  customAgents.forEach((a) => customMap.set(a.id, a));

  const resolvedSet = new Set<string>();

  // Add auto-included agents
  for (const agent of allCatalogAgents) {
    const autoInc = agent.auto_include;
    if (autoInc) {
      const matchArch = autoInc.architectures?.includes(architecture);
      const matchStack =
        autoInc.stacks === 'all' ||
        (Array.isArray(autoInc.stacks) && autoInc.stacks.includes(stack));

      if (matchArch && matchStack) {
        resolvedSet.add(agent.id);
      }
    }
  }

  // Add user selected agents
  selectedIds.forEach((id) => resolvedSet.add(id));

  const resolvedAgents: AgentProfile[] = [];

  for (const id of resolvedSet) {
    let agent = customMap.get(id);
    if (!agent) {
      agent = await registry.getAgent(id);
    }

    if (agent) {
      // Resolve stack-specific rules for this agent
      const copy = { ...agent };
      if (copy.stack_rules && copy.stack_rules[stack]) {
        copy.resolvedStackRules = copy.stack_rules[stack];
      } else if (copy.stack_rules && copy.stack_rules['generic']) {
        copy.resolvedStackRules = copy.stack_rules['generic'];
      } else {
        copy.resolvedStackRules = [];
      }
      resolvedAgents.push(copy);
    }
  }

  return resolvedAgents;
}
