import process from 'node:process'
import {
  ANTHROPIC_VERSION,
  DEEPSEEK_URL,
  MAX_TOKENS,
  MODEL,
  SYSTEM_PROMPT,
  WEB_SEARCH_TOOL,
} from './constants'

interface TextBlock {
  type?: string
  text?: string
}

export async function searchWeb(query: string, signal?: AbortSignal): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey)
    throw new Error('DEEPSEEK_API_KEY is not set')

  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'authorization': `Bearer ${apiKey}`,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Perform a web search for the query: ${query}` }],
      tools: [WEB_SEARCH_TOOL],
    }),
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`DeepSeek returned HTTP ${response.status}: ${detail}`.slice(0, 500))
  }

  const { content } = await response.json() as { content?: TextBlock[] }
  const text = (content ?? [])
    .flatMap(block => (block.type === 'text' && block.text ? [block.text] : []))
    .join('\n\n')

  return text || 'No results found.'
}
