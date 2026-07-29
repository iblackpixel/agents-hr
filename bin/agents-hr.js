#!/usr/bin/env node

import { runCli } from '../dist/index.js';

runCli().catch((err) => {
  console.error('Error al ejecutar agents-hr:', err.message);
  process.exit(1);
});
