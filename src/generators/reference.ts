import { PlatformGenerator } from './base.js';
import { ClaudeGenerator } from './claude.js';
import { CodexGenerator } from './codex.js';
import { AntigravityGenerator } from './antigravity.js';
import { OpenCodeGenerator } from './opencode.js';
import { GeneratorOptions, PlatformType } from '../profiles/types.js';
import { writeYamlFile } from '../utils/fs.js';
import path from 'path';

export function getGenerator(platform: PlatformType): PlatformGenerator {
  switch (platform) {
    case 'claude':
      return new ClaudeGenerator();
    case 'codex':
      return new CodexGenerator();
    case 'antigravity':
      return new AntigravityGenerator();
    case 'opencode':
      return new OpenCodeGenerator();
    default:
      throw new Error(`Plataforma no soportada: ${platform}`);
  }
}

export async function executeGeneration(options: GeneratorOptions): Promise<void> {
  const primaryPlatform = options.config.platform.primary;
  const secondaryPlatforms = options.config.platform.secondary || [];

  // 1. Guardar config.yml en agents-hr/config.yml
  const configPath = path.join(options.projectPath, 'agents-hr/config.yml');
  await writeYamlFile(configPath, options.config, options.dryRun);

  // 2. Generar plataforma principal
  const primaryGen = getGenerator(primaryPlatform);
  await primaryGen.generatePrimary(options);

  // 3. Generar plataformas secundarias que referencian a la principal
  for (const secPlatform of secondaryPlatforms) {
    if (secPlatform !== primaryPlatform) {
      const secGen = getGenerator(secPlatform);
      await secGen.generateSecondary(options, primaryPlatform);
    }
  }
}
