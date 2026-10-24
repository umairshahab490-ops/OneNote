export type EditResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

function lineBounds(value: string, start: number, end: number) {
  const lineStart = value.lastIndexOf("\n", Math.max(0, start) - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  return { lineStart, lineEnd };
}

export function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
): EditResult {
  const selected = value.slice(start, end);
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  const selectionStart = start + before.length;
  return {
    value: next,
    selectionStart,
    selectionEnd: selectionStart + selected.length,
  };
}

export function toggleLinePrefix(
  value: string,
  start: number,
  end: number,
  prefix: string,
): EditResult {
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const meaningful = lines.filter((line) => line.length > 0);
  const allHave = meaningful.length > 0 && meaningful.every((line) => line.startsWith(prefix));
  const nextLines = lines.map((line) => {
    if (!line) return line;
    if (allHave) return line.startsWith(prefix) ? line.slice(prefix.length) : line;
    return line.startsWith(prefix) ? line : prefix + line;
  });
  const nextBlock = nextLines.join("\n");
  return {
    value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}

export function insertLink(value: string, start: number, end: number): EditResult {
  const selected = value.slice(start, end);
  if (!selected) {
    const insert = "[text](https://)";
    return {
      value: value.slice(0, start) + insert + value.slice(end),
      selectionStart: start + 1,
      selectionEnd: start + 5,
    };
  }
  const insert = `[${selected}](https://)`;
  const urlStart = start + selected.length + 3;
  return {
    value: value.slice(0, start) + insert + value.slice(end),
    selectionStart: urlStart,
    selectionEnd: urlStart + "https://".length,
  };
}

export function insertCode(value: string, start: number, end: number): EditResult {
  const selected = value.slice(start, end);
  if (selected.includes("\n")) {
    const insert = "```\n" + selected + "\n```";
    return {
      value: value.slice(0, start) + insert + value.slice(end),
      selectionStart: start + 4,
      selectionEnd: start + 4 + selected.length,
    };
  }
  return wrapSelection(value, start, end, "`", "`");
}

export function indentSelection(
  value: string,
  start: number,
  end: number,
  outdent: boolean,
): EditResult {
  if (!outdent && start === end) {
    const insert = "  ";
    return {
      value: value.slice(0, start) + insert + value.slice(end),
      selectionStart: start + insert.length,
      selectionEnd: start + insert.length,
    };
  }
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const nextLines = lines.map((line) => {
    if (outdent) {
      if (line.startsWith("  ")) return line.slice(2);
      if (line.startsWith("\t")) return line.slice(1);
      return line;
    }
    return "  " + line;
  });
  const nextBlock = nextLines.join("\n");
  return {
    value: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + nextBlock.length,
  };
}

export function toggleTask(body: string, raw: string): string {
  const flipped = raw.includes("[ ]")
    ? raw.replace("[ ]", "[x]")
    : raw.replace(/\[[xX]\]/, "[ ]");
  if (flipped === raw) return body;
  const index = body.indexOf(raw);
  if (index < 0) return body;
  return body.slice(0, index) + flipped + body.slice(index + raw.length);
}
