#!/usr/bin/env tsx
import termkit from "terminal-kit";
import { readFile } from "fs/promises";
import assert from "assert";

const term = termkit.terminal;

interface HarEntry {
  request: {
    url: string;
    method: string;
  };
  response: {
    status: number;
  };
}

interface Har {
  log: {
    entries: HarEntry[];
  };
}

(async () => {
  const fileName = process.argv[2];
  assert(fileName, "Please provide a HAR file as an argument");
  const harContent = await readFile(fileName, "utf-8");
  const har: Har = JSON.parse(harContent);
  assert(har.log && Array.isArray(har.log.entries), "Invalid HAR file format");

  const entries = har.log.entries;
  let selectedRow = 0;

  const tableData = entries.map(({ request, response }) => [
    request.url,
    request.method,
    response.status.toString(),
  ]);

  const renderTable = () => {
    term.clear();
    term.saveCursor();

    const displayData = tableData.map((row, index) => {
      if (index === selectedRow) {
        return row.map((cell) => `^+^b${cell}^:`);
      }
      return row;
    });

    term.table([["URL", "METHOD", "STATUS"], ...displayData], {
      hasBorder: true,
      contentHasMarkup: true,
      borderChars: "lightRounded",
      textAttr: { bgColor: "default" },
      width: 60,
      fit: true,
    });
  };

  renderTable();
  term.grabInput({ mouse: "button" });

  term.on("key", (name: string) => {
    if (name === "q") {
      term.restoreCursor();
      process.exit();
    } else if (name === "j" && selectedRow < entries.length - 1) {
      selectedRow++;
      renderTable();
    } else if (name === "k" && selectedRow > 0) {
      selectedRow--;
      renderTable();
    } else if (name === "o") {
      const selectedEntry = entries[selectedRow];
      term.clear();
      term.bold.cyan("Selected Entry Details:\n");
      term.white(`URL: ${selectedEntry.request.url}\n`);
      term.white(`Method: ${selectedEntry.request.method}\n`);
      term.white(`Status: ${selectedEntry.response.status}\n\n`);
      term.yellow("Press any key to return to table...\n");

      term.once("key", () => {
        renderTable();
      });
    }
  });
})();
