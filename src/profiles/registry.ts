import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { AgentProfile } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agentsMap: Map<string, AgentProfile> = new Map();
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public async loadCatalog(): Promise<void> {
    if (this.isLoaded) return;

    const catalogDir = path.resolve(__dirname, '../../agents');
    const categories = ['tech', 'product', 'comms', 'specialist'];

    for (const category of categories) {
      const catDir = path.join(catalogDir, category);
      if (await fs.pathExists(catDir)) {
        const files = await fs.readdir(catDir);
        for (const file of files) {
          if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const filePath = path.join(catDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const agent = yaml.load(content) as AgentProfile;
            this.agentsMap.set(agent.id, agent);
          }
        }
      }
    }

    this.isLoaded = true;
  }

  public async getAgent(id: string): Promise<AgentProfile | undefined> {
    await this.loadCatalog();
    return this.agentsMap.get(id);
  }

  public async getAllAgents(): Promise<AgentProfile[]> {
    await this.loadCatalog();
    return Array.from(this.agentsMap.values());
  }

  public async getAgentsByCategory(category: string): Promise<AgentProfile[]> {
    await this.loadCatalog();
    return Array.from(this.agentsMap.values()).filter((a) => a.category === category);
  }
}
