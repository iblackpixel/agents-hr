import { PlatformType } from '../profiles/types.js';

export const PLATFORM_NAMES: Record<PlatformType, string> = {
  claude: 'Claude Code',
  codex: 'OpenAI Codex CLI',
  antigravity: 'Google Antigravity',
  opencode: 'Open Code / Cursor',
};

export const PLATFORM_FILES: Record<PlatformType, string> = {
  claude: 'CLAUDE.md',
  codex: 'AGENTS.md',
  antigravity: 'GEMINI.md',
  opencode: 'AGENTS.md',
};

export const STACK_OPTIONS = [
  { name: 'Next.js 15+ (React, App Router, TypeScript)', value: 'nextjs' },
  { name: 'React Native (Expo SDK, Navigation, TypeScript)', value: 'react-native' },
  { name: 'NestJS (Node.js, Express/Fastify, TypeScript)', value: 'nestjs' },
  { name: 'React SPA (Vite / CRA, TypeScript)', value: 'react' },
  { name: 'Vue.js / Nuxt', value: 'vue' },
  { name: 'Flutter (Dart)', value: 'flutter' },
  { name: 'Python (FastAPI / Django)', value: 'python' },
  { name: 'Otro / Genérico', value: 'generic' },
];

export const ARCHITECTURE_OPTIONS = [
  { name: 'Liviana (Lean - 3-4 agentes)', value: 'lean' },
  { name: 'Estándar (6-8 agentes recomendados)', value: 'standard' },
  { name: 'Compleja / Enterprise (10+ agentes con Seguridad y BD)', value: 'enterprise' },
  { name: 'Spec-Driven Development (Foco en Producto y Especificación)', value: 'sdd' },
];
