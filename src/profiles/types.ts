export type AgentCategory = 'tech' | 'product' | 'comms' | 'specialist';
export type PlatformType = 'claude' | 'codex' | 'antigravity' | 'opencode';
export type ArchitectureType = 'lean' | 'standard' | 'enterprise' | 'sdd';

export interface AutoIncludeConfig {
  architectures?: string[];
  stacks?: string | string[];
}

export interface AgentProfile {
  id: string;
  name: string;
  emoji: string;
  category: AgentCategory;
  description: string;
  auto_include?: AutoIncludeConfig;
  system_prompt: string;
  stack_rules?: Record<string, string[]>;
  collaborates_with?: Record<string, string>;
  tags?: string[];
  resolvedStackRules?: string[];
  isCustom?: boolean;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  agents: string[];
}

export interface ProjectConfig {
  version: number;
  generated_at: string;
  platform: {
    primary: PlatformType;
    secondary?: PlatformType[];
  };
  stack: string;
  architecture: ArchitectureType;
  team: string[];
  integrations?: {
    linear?: {
      enabled: boolean;
      team_id?: string;
      team_prefix?: string;
      epic_issue_id?: string;
      epic_url?: string;
    };
  };
}

export interface GeneratorOptions {
  projectPath: string;
  projectName: string;
  config: ProjectConfig;
  agents: AgentProfile[];
  dryRun?: boolean;
}
