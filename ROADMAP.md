# Roadmap

## Near Term Enhancements

- **Status text column**: Surface `response.statusText` alongside the numeric code so failures (e.g., “Not Found”) are immediately understandable without expanding details.
- **Timing metrics**: Display the overall `entry.time` value and a condensed breakdown of wait/receive timings to highlight slow calls directly in the table.
- **Payload size indicator**: Show response size using `response.content.size` (falling back to `Content-Length`) to quickly spot heavy payloads.
- **MIME type badge**: Render `response.content.mimeType` (e.g., `application/json`, `text/html`) to distinguish payload formats at a glance.
- **Redirect target hint**: Include `response.redirectURL` for 3xx responses so users know the next hop without opening the entry.
- **Interactive filtering**: Add a Vim-style `/` command that opens a search prompt and progressively filters rows by URL, method, status, or payload text. Support `n`/`N` to cycle through matches while keeping selection aligned.
- **Detailed entry view**: Let users press `enter` to open a secondary pane showing request headers, query parameters, and response timing/body snippets with syntax highlighting when possible.

## Medium Term Improvements

- **Status grouping dashboard**: Provide a toggle that displays aggregated counts for 2xx/3xx/4xx/5xx statuses; selecting a group temporarily filters the table.
- **Export utilities**: Introduce an `e` shortcut for exporting the current entry or filtered set as JSON or ready-to-run `curl` commands for quick reproduction.

## Longer Term Ideas

- **Performance insights**: Calculate slowest endpoints, total duration, and other latency metrics, surfacing the data in a dedicated panel triggered by `p`.
- **Bookmarking workflow**: Allow marking entries with `m` and jumping between saved bookmarks using `'` + letter, enabling rapid comparisons across related calls.
