# opencode-dpsk-search

Removes OpenCode's built-in `websearch` tool and adds a `dpsksearch` tool backed by DeepSeek's server-side web search.

## Install

```bash
opencode plugin add github:liyang8246/opencode-dpsk-search
```

## Usage

Set `DEEPSEEK_API_KEY` in your environment.

The model calls `dpsksearch` with a `query`:

```text
dpsksearch {"query": "深圳今天天气"}
```

## License

MIT
