# HAR Viewer CLI

## Getting Started
Install dependencies and launch the sample HAR viewer.

```
npm install
npm run dev file.har
```

If `tsx` is installed globally, you can run the script directly:

```
./hr.ts path/to/file.har
```

## Roadmap

### Near Term Enhancements
- **Interactive filtering**: Add a Vim-style `/` command that opens a search prompt and progressively filters rows by URL, method, status, or payload text. Support `n`/`N` to cycle through matches while keeping selection aligned.
- **Detailed entry view**: Let users press `enter` to open a secondary pane showing request headers, query parameters, and response timing/body snippets with syntax highlighting when possible.

### Medium Term Improvements
- **Status grouping dashboard**: Provide a toggle that displays aggregated counts for 2xx/3xx/4xx/5xx statuses; selecting a group temporarily filters the table.
- **Export utilities**: Introduce an `e` shortcut for exporting the current entry or filtered set as JSON or ready-to-run `curl` commands for quick reproduction.

### Longer Term Ideas
- **Performance insights**: Calculate slowest endpoints, total duration, and other latency metrics, surfacing the data in a dedicated panel triggered by `p`.
- **Bookmarking workflow**: Allow marking entries with `m` and jumping between saved bookmarks using `'` + letter, enabling rapid comparisons across related calls.
