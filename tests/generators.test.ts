import { describe, it, expect } from 'vitest';
import { getGenerator } from '../src/generators/reference.js';
import { ClaudeGenerator } from '../src/generators/claude.js';
import { CodexGenerator } from '../src/generators/codex.js';
import { AntigravityGenerator } from '../src/generators/antigravity.js';

describe('Generators Factory', () => {
  it('should instantiate ClaudeGenerator for claude', () => {
    const gen = getGenerator('claude');
    expect(gen).toBeInstanceOf(ClaudeGenerator);
  });

  it('should instantiate CodexGenerator for codex', () => {
    const gen = getGenerator('codex');
    expect(gen).toBeInstanceOf(CodexGenerator);
  });

  it('should instantiate AntigravityGenerator for antigravity', () => {
    const gen = getGenerator('antigravity');
    expect(gen).toBeInstanceOf(AntigravityGenerator);
  });
});
