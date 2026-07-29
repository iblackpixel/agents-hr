import { GeneratorOptions } from '../profiles/types.js';

export interface PlatformGenerator {
  generatePrimary(options: GeneratorOptions): Promise<void>;
  generateSecondary(options: GeneratorOptions, primaryPlatform: string): Promise<void>;
}
