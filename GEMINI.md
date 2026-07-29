# 🏢 Agents-HR — Agencia de RRHH para Agentes AI

## Proyecto

Agents-HR es un CLI interactivo (TypeScript/Node.js) que funciona como una agencia de recursos humanos de agentes AI para proyectos de software móvil y web. Contiene un catálogo de 22+ perfiles de agentes (técnicos, producto, comunicación, especializados) y genera la arquitectura agéntica necesaria según la plataforma, stack y complejidad elegidos.

## Stack Tecnológico

- **Lenguaje:** TypeScript (ES2022, módulos ESM)
- **Runtime:** Node.js 20+
- **CLI Framework:** Commander.js
- **Prompts:** Inquirer.js
- **Templates:** Handlebars (.hbs)
- **YAML parsing:** js-yaml
- **Terminal UI:** Chalk + ora
- **Filesystem:** fs-extra
- **Testing:** Vitest

## Arquitectura

```
src/                → Código fuente TypeScript
  cli/              → Comandos del CLI (init, list, add, remove, sync, team)
  generators/       → Generadores por plataforma (claude, codex, antigravity, opencode, reference)
  profiles/         → Registry, resolver, custom-loader, types
  utils/            → fs, markdown, logger, constants
agents/             → Catálogo de perfiles de agentes (YAML)
templates/          → Templates Handlebars por plataforma
presets/            → Equipos predefinidos (lean, standard, enterprise, sdd)
bin/                → Entry point del CLI
tests/              → Tests con Vitest
```

## Convenciones de Código

- **Nombrado:** camelCase para variables/funciones, PascalCase para tipos/interfaces, kebab-case para archivos
- **Exports:** Named exports, no default exports
- **Async:** Usar async/await, nunca .then() chains
- **Errores:** Custom error classes que extiendan Error
- **Imports:** Imports absolutos desde src/, usar path aliases si se configura
- **Tipos:** Tipos explícitos para parámetros de función y retornos. Usar `interface` para objetos, `type` para uniones/intersecciones
- **Documentación:** JSDoc en funciones y clases públicas

## Principios de Diseño

1. **Single Source of Truth**: Los perfiles YAML son la fuente de verdad. Los generadores leen YAML y producen archivos de plataforma.
2. **Plataforma Primaria + Referencias**: La plataforma principal genera contenido completo. Las secundarias solo referencian a la principal.
3. **Extensibilidad**: El usuario puede crear perfiles custom en `agents-hr/custom/` dentro de su proyecto.
4. **Idempotencia**: Ejecutar `sync` múltiples veces produce el mismo resultado.
5. **Dry-run**: Todo comando destructivo soporta `--dry-run`.

## Plataformas Soportadas

| Plataforma | Archivo principal | Archivos por agente | Extra |
|---|---|---|---|
| Claude | CLAUDE.md | .claude/rules/{id}.md | @import para refs |
| Codex | AGENTS.md | .codex/skills/{id}/SKILL.md | Skills activables |
| Antigravity | GEMINI.md | .gemini/rules/{id}.md | Settings JSON |
| Open Code | AGENTS.md | .ai/agents/{id}.md | .cursorrules |

## Comandos Importantes

```bash
npm run build       # Compila TypeScript → dist/
npm run dev         # Ejecuta con ts-node en modo watch
npm test            # Corre tests con Vitest
node bin/agents-hr  # Ejecuta el CLI
```
