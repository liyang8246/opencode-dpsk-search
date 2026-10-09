export const DEEPSEEK_URL = 'https://api.deepseek.com/anthropic/v1/messages'
export const ANTHROPIC_VERSION = '2023-06-01'
export const MODEL = 'deepseek-v4-flash'
export const WEB_SEARCH_TOOL = {
  type: 'web_search_20250305',
  name: 'web_search',
} as const

export const SYSTEM_PROMPT
  = 'You are a web search assistant. Use the web_search tool to find current information for the user\'s query, then report the findings concisely with source URLs.'
