#!/usr/bin/env tsx
import termkit from "terminal-kit";
import { readFile } from "fs/promises";
import assert from "assert";

import { filterEntries } from "./filter";
import { Har } from "./types";

const term = termkit.terminal;

(async () => {
  const fileName = process.argv[2];
  assert(fileName, "Please provide a HAR file as an argument");
  const harContent = await readFile(fileName, "utf-8");
  const har: Har = JSON.parse(harContent);
  assert(har.log && Array.isArray(har.log.entries), "Invalid HAR file format");

  const allEntries = har.log.entries;
  let filteredEntries = allEntries;
  let selectedRow = 0;

  const renderTable = () => {
    term.clear();
    term.saveCursor();

    if (filteredEntries.length === 0) {
      term.table([["URL", "METHOD", "STATUS"]], {
        hasBorder: true,
        contentHasMarkup: true,
        borderChars: "lightRounded",
        textAttr: { bgColor: "default" },
        width: 60,
        fit: true,
      });

      term.nextLine(1);
      term.gray("No matches for the current filter. Press '/' to search again.\n");
      return;
    }

    const tableData = filteredEntries.map(({ request, response }) => [
      request.url,
      request.method,
      response.status.toString(),
    ]);

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

  const promptForSearch = async (): Promise<string> => {
    term.grabInput(false);
    term.saveCursor();
    term.moveTo(1, term.height);
    term.eraseLine();
    term.white("Search: ");

    const { promise, abort } = term.inputField({
      history: [],
      cancelable: true,
    });

    try {
      return (await promise) ?? "";
    } finally {
      term.eraseLine();
      term.restoreCursor();
      abort();
      term.grabInput({ mouse: "button" });
    }
  };

  term.on("key", (name: string) => {
    if (name === "q") {
      term.restoreCursor();
      process.exit();
    } else if (name === "j" && selectedRow < filteredEntries.length - 1) {
      selectedRow++;
      renderTable();
    } else if (name === "k" && selectedRow > 0) {
      selectedRow--;
      renderTable();
    } else if (name === "o") {
      if (filteredEntries.length === 0) {
        return;
      }

      const selectedEntry = filteredEntries[selectedRow];
      term.clear();
      term.bold.cyan("Selected Entry Details:\n");
      term.white(`URL: ${selectedEntry.request.url}\n`);
      term.white(`Method: ${selectedEntry.request.method}\n`);
      term.white(`Status: ${selectedEntry.response.status}\n\n`);
      term.yellow("Press any key to return to table...\n");

      term.once("key", () => {
        renderTable();
      });
    } else if (name === "/") {
      promptForSearch().then((query) => {
        filteredEntries = filterEntries(allEntries, query);
        selectedRow = 0;
        renderTable();
      });
    }
  });
})();
