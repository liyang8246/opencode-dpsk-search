import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  // Types are checked against @opencode/plugin during development; publishing
  // them would inline the whole plugin API (and effect) into a multi-MB .d.ts
  // that no consumer reads, since OpenCode loads this package as plain ESM.
  dts: false,
  exports: true,
})
