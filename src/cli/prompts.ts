import inquirer from 'inquirer';
import { AgentRegistry } from '../profiles/registry.js';
import { PlatformType, ArchitectureType } from '../profiles/types.js';
import { PLATFORM_NAMES, STACK_OPTIONS, ARCHITECTURE_OPTIONS } from '../utils/constants.js';

export interface InitAnswers {
  primaryPlatform: PlatformType;
  secondaryPlatforms: PlatformType[];
  stack: string;
  architecture: ArchitectureType;
  selectedAgents: string[];
}

export async function promptInitQuestions(): Promise<InitAnswers> {
  const registry = AgentRegistry.getInstance();
  await registry.loadCatalog();

  const productAgents = await registry.getAgentsByCategory('product');
  const commsAgents = await registry.getAgentsByCategory('comms');
  const specialistAgents = await registry.getAgentsByCategory('specialist');

  const answers = await inquirer.prompt<Record<string, any>>([
    {
      type: 'list',
      name: 'primaryPlatform',
      message: '¿Cuál será tu plataforma PRINCIPAL de agentes AI?',
      choices: [
        { name: 'Google Antigravity (GEMINI.md)', value: 'antigravity' },
        { name: 'OpenAI Codex CLI (AGENTS.md + Skills)', value: 'codex' },
        { name: 'Claude Code (CLAUDE.md + .claude/agents)', value: 'claude' },
        { name: 'Open Code / Cursor (.cursor/rules/*.mdc)', value: 'opencode' },
      ],
      default: 'antigravity',
    },
    {
      type: 'checkbox',
      name: 'secondaryPlatforms',
      message: '¿Querés agregar plataformas SECUNDARIAS? (Referenciarán a la principal sin duplicar)',
      choices: (answersSoFar: { primaryPlatform: PlatformType }) => {
        const platforms: PlatformType[] = ['antigravity', 'codex', 'claude', 'opencode'];
        return platforms
          .filter((p) => p !== answersSoFar.primaryPlatform)
          .map((p) => ({
            name: PLATFORM_NAMES[p],
            value: p,
          }));
      },
    },
    {
      type: 'list',
      name: 'stack',
      message: '¿Cuál es el STACK TECNOLÓGICO del proyecto?',
      choices: STACK_OPTIONS,
      default: 'nextjs',
    },
    {
      type: 'list',
      name: 'architecture',
      message: '¿Qué nivel de ARQUITECTURA / COMPLEJIDAD requiere el proyecto?',
      choices: ARCHITECTURE_OPTIONS,
      default: 'standard',
    },
    {
      type: 'checkbox',
      name: 'productAgents',
      message: '¿Querés incluir perfiles de PRODUCTO?',
      choices: productAgents.map((a) => ({
        name: `${a.emoji} ${a.name} — ${a.description.trim().substring(0, 70)}...`,
        value: a.id,
      })),
    },
    {
      type: 'checkbox',
      name: 'commsAgents',
      message: '¿Querés incluir perfiles de COMUNICACIÓN?',
      choices: commsAgents.map((a) => ({
        name: `${a.emoji} ${a.name} — ${a.description.trim().substring(0, 70)}...`,
        value: a.id,
      })),
    },
    {
      type: 'checkbox',
      name: 'specialistAgents',
      message: '¿Querés incluir perfiles ESPECIALIZADOS extras?',
      choices: specialistAgents.map((a) => ({
        name: `${a.emoji} ${a.name} — ${a.description.trim().substring(0, 70)}...`,
        value: a.id,
      })),
    },
  ]);

  const selectedAgents = [
    ...((answers.productAgents as string[]) || []),
    ...((answers.commsAgents as string[]) || []),
    ...((answers.specialistAgents as string[]) || []),
  ];

  return {
    primaryPlatform: answers.primaryPlatform as PlatformType,
    secondaryPlatforms: answers.secondaryPlatforms as PlatformType[],
    stack: answers.stack as string,
    architecture: answers.architecture as ArchitectureType,
    selectedAgents,
  };
}
