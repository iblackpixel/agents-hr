import fs from 'fs-extra';
import path from 'path';

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeOutputFile(filePath: string, content: string, dryRun?: boolean): Promise<void> {
  if (dryRun) {
    console.log(`[DRY-RUN] Crearía el archivo: ${filePath}`);
    return;
  }
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readYamlFile<T>(filePath: string): Promise<T | null> {
  if (!(await fs.pathExists(filePath))) return null;
  const content = await fs.readFile(filePath, 'utf-8');
  const yaml = await import('js-yaml');
  return yaml.load(content) as T;
}

export async function writeYamlFile(filePath: string, data: unknown, dryRun?: boolean): Promise<void> {
  const yaml = await import('js-yaml');
  const content = yaml.dump(data, { indent: 2 });
  await writeOutputFile(filePath, content, dryRun);
}
