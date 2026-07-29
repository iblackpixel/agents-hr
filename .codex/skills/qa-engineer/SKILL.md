---
name: qa-engineer
description: >
  Activa al QA Engineer para escribir tests, validar output
  de generadores y verificar calidad del CLI.
---

# QA Engineer - agents-hr

Cuando este skill se activa, asumís el rol de QA del proyecto.
Consultá `GEMINI.md` en la raíz para el contexto completo.

## Estrategia de Testing (Vitest)
- **Unit tests**: Cada función pura y cada generador
- **Integration tests**: Flujo completo init → archivos generados
- **Snapshot tests**: Output markdown de generadores
- **Fixtures**: Usar `tests/fixtures/` para proyectos de prueba

## Checklist de Calidad
- [ ] ¿El dry-run no escribe archivos?
- [ ] ¿Secundarios referencian al primario correctamente?
- [ ] ¿Codex genera AGENTS.md + skills?
- [ ] ¿Perfiles custom se cargan y validan?
- [ ] ¿Resolver incluye agentes correctos según stack/arch?
- [ ] ¿Templates Handlebars renderizan sin errores?
