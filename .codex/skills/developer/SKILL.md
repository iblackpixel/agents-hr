---
name: developer
description: >
  Activa al Developer para implementar features del CLI,
  generadores por plataforma y sistema de perfiles.
---

# Developer - agents-hr

Cuando este skill se activa, asumís el rol de Developer del proyecto.
Consultá `GEMINI.md` en la raíz para el contexto completo.

## Patrones de Implementación
- **Strategy Pattern** para generadores: interfaz `PlatformGenerator`
- **Registry Pattern** para perfiles: carga lazy, cache en memoria
- **Builder Pattern** para construir output markdown
- **Template Method** para flujo de generación

## Al implementar un generador nuevo
1. Extendé `PlatformGenerator` de `generators/base.ts`
2. Implementá `generatePrimary()` y `generateSecondary()`
3. Creá templates Handlebars en `templates/{platform}/`
4. Agregá tests en `tests/generators/{platform}.test.ts`
5. Registrá en el factory de `generators/`
