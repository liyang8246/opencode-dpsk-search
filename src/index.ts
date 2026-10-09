import type { Plugin } from '@opencode/plugin'
import { searchWeb } from './search'

const plugin: Plugin.Plugin = {
  id: 'opencode-dpsk-search',
  async setup(context) {
    await context.tool.transform((editor) => {
      editor.remove('websearch')
      editor.add({
        name: 'dpsksearch',
        description: 'Search the web through DeepSeek\'s server-side web search. Use it for anything recent or beyond your knowledge cutoff instead of guessing. Returns findings with source URLs.',
        input: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'A natural-language question describing what to find out — full sentence, not keyword lists',
            },
          },
          required: ['question'],
          additionalProperties: false,
        },
        options: { codemode: false },
        execute: async (input, toolContext) => {
          try {
            return { content: await searchWeb(String((input as { question: string }).question), toolContext.signal) }
          }
          catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            return { content: `dpsksearch failed: ${message}` }
          }
        },
      })
    })
  },
}

export default plugin
