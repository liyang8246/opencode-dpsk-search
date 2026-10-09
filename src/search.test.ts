import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchWeb } from './search'

function mockFetch(payload: unknown, init?: ResponseInit) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(payload), init))
}

afterEach(() => {
  vi.restoreAllMocks()
  delete process.env.DEEPSEEK_API_KEY
})

describe('searchWeb', () => {
  it('returns the text blocks of the response', async () => {
    process.env.DEEPSEEK_API_KEY = 'sk-test'
    mockFetch({
      content: [
        { type: 'thinking', thinking: '...' },
        { type: 'server_tool_use', name: 'web_search' },
        { type: 'text', text: 'Shenzhen is 30°C today.' },
      ],
    })

    await expect(searchWeb('深圳天气')).resolves.toBe('Shenzhen is 30°C today.')
  })

  it('sends the query with the server-side web search tool', async () => {
    process.env.DEEPSEEK_API_KEY = 'sk-test'
    const spy = mockFetch({ content: [{ type: 'text', text: 'ok' }] })

    await searchWeb('深圳天气')

    const [url, init] = spy.mock.calls[0]
    expect(url).toBe('https://api.deepseek.com/anthropic/v1/messages')
    const body = JSON.parse(String(init?.body))
    expect(body.model).toBe('deepseek-v4-flash')
    expect(body.tools).toEqual([{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }])
    expect(body.messages[0].content).toContain('深圳天气')
    expect((init?.headers as Record<string, string>)['anthropic-version']).toBe('2023-06-01')
  })

  it('reports when the response carries no text', async () => {
    process.env.DEEPSEEK_API_KEY = 'sk-test'
    mockFetch({ content: [{ type: 'server_tool_use' }] })

    await expect(searchWeb('深圳天气')).resolves.toBe('No results found.')
  })

  it('requires the API key', async () => {
    await expect(searchWeb('深圳天气')).rejects.toThrow('DEEPSEEK_API_KEY')
  })

  it('surfaces a non-OK response', async () => {
    process.env.DEEPSEEK_API_KEY = 'sk-test'
    mockFetch({ error: { message: 'bad key' } }, { status: 401 })

    await expect(searchWeb('深圳天气')).rejects.toThrow('HTTP 401')
  })
})
