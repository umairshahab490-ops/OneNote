import { lexer, type Token, type Tokens } from "marked";
import { Fragment, useMemo, type ReactNode } from "react";

let taskToggle: ((raw: string) => void) | undefined;

type MarkdownViewProps = {
  source: string;
  onToggleTask?: (raw: string) => void;
};

function safeUrl(href: string): string | null {
  const trimmed = href.trim();
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") return trimmed;
  } catch {
    return null;
  }
  return null;
}

function stripCheckbox(tokens: Token[]): Token[] {
  return tokens
    .filter((token) => token.type !== "checkbox")
    .map((token) => {
      if ("tokens" in token && Array.isArray(token.tokens)) {
        return { ...token, tokens: stripCheckbox(token.tokens) } as Token;
      }
      return token;
    });
}

function renderTokens(tokens: Token[] | undefined, keyPrefix: string): ReactNode {
  if (!tokens?.length) return null;
  return tokens.map((token, index) => (
    <Fragment key={`${keyPrefix}-${index}`}>{renderToken(token, `${keyPrefix}-${index}`)}</Fragment>
  ));
}

function renderToken(token: Token, key: string, onToggleTask?: (raw: string) => void): ReactNode {
  switch (token.type) {
    case "space":
    case "def":
      return null;
    case "br":
      return <br />;
    case "hr":
      return <hr />;
    case "escape":
      return (token as Tokens.Escape).text;
    case "html": {
      const html = token as Tokens.HTML;
      const Tag = html.block ? "p" : "span";
      return <Tag className="text-muted">{html.text}</Tag>;
    }
    case "heading": {
      const heading = token as Tokens.Heading;
      const Tag = (["h1", "h2", "h3", "h4", "h5", "h6"] as const)[Math.min(5, Math.max(0, heading.depth - 1))];
      return <Tag>{renderTokens(heading.tokens, key)}</Tag>;
    }
    case "paragraph":
      return <p>{renderTokens((token as Tokens.Paragraph).tokens, key)}</p>;
    case "blockquote":
      return <blockquote>{renderTokens((token as Tokens.Blockquote).tokens, key)}</blockquote>;
    case "code": {
      const code = token as Tokens.Code;
      return (
        <pre>
          {code.lang ? <span className="code-lang">{code.lang}</span> : null}
          <code>{code.text.replace(/\n$/, "")}</code>
        </pre>
      );
    }
    case "list": {
      const list = token as Tokens.List;
      const Tag = list.ordered ? "ol" : "ul";
      return (
        <Tag start={list.ordered && typeof list.start === "number" ? list.start : undefined}>
          {list.items.map((item, index) => (
            <li key={`${key}-item-${index}`} className={item.task ? "task" : undefined}>
              {item.task ? (
                <input
                  type="checkbox"
                  checked={Boolean(item.checked)}
                  aria-label={item.checked ? "Completed task" : "Open task"}
                  onChange={() => taskToggle?.(item.raw)}
                />
              ) : null}
              <div>{renderTokens(item.task ? stripCheckbox(item.tokens) : item.tokens, `${key}-item-${index}`)}</div>
            </li>
          ))}
        </Tag>
      );
    }
    case "table": {
      const table = token as Tokens.Table;
      const alignClass = (align: "center" | "left" | "right" | null) =>
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {table.header.map((cell, index) => (
                  <th key={`${key}-h-${index}`} className={alignClass(cell.align)}>
                    {renderTokens(cell.tokens, `${key}-h-${index}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, rowIndex) => (
                <tr key={`${key}-r-${rowIndex}`}>
                  {row.map((cell, index) => (
                    <td key={`${key}-c-${rowIndex}-${index}`} className={alignClass(cell.align)}>
                      {renderTokens(cell.tokens, `${key}-c-${rowIndex}-${index}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "text": {
      const text = token as Tokens.Text;
      if (text.tokens?.length) return renderTokens(text.tokens, key);
      return text.text;
    }
    case "strong":
      return <strong>{renderTokens((token as Tokens.Strong).tokens, key)}</strong>;
    case "em":
      return <em>{renderTokens((token as Tokens.Em).tokens, key)}</em>;
    case "del":
      return <del>{renderTokens((token as Tokens.Del).tokens, key)}</del>;
    case "codespan":
      return <code>{(token as Tokens.Codespan).text}</code>;
    case "checkbox":
      return null;
    case "link": {
      const link = token as Tokens.Link;
      const href = safeUrl(link.href);
      if (!href) return <span>{renderTokens(link.tokens, key)}</span>;
      return (
        <a href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer">
          {renderTokens(link.tokens, key)}
        </a>
      );
    }
    case "image": {
      const image = token as Tokens.Image;
      const href = safeUrl(image.href);
      if (!href || href.startsWith("mailto:")) return <span>{image.text}</span>;
      return <img src={href} alt={image.text} loading="lazy" referrerPolicy="no-referrer" />;
    }
    default:
      if ("tokens" in token && Array.isArray(token.tokens)) return renderTokens(token.tokens, key);
      if ("text" in token && typeof token.text === "string") return token.text;
      return null;
  }
}

function renderBlock(token: Token, key: string, onToggleTask?: (raw: string) => void): ReactNode {
  if (token.type === "list") {
    const list = token as Tokens.List;
    const Tag = list.ordered ? "ol" : "ul";
    return (
      <Tag start={list.ordered && typeof list.start === "number" ? list.start : undefined}>
        {list.items.map((item, index) => (
          <li key={`${key}-item-${index}`} className={item.task ? "task" : undefined}>
            {item.task ? (
              <input
                type="checkbox"
                checked={Boolean(item.checked)}
                aria-label={item.checked ? "Completed task" : "Open task"}
                onChange={() => taskToggle?.(item.raw)}
              />
            ) : null}
            <div>{renderTokens(item.task ? stripCheckbox(item.tokens) : item.tokens, `${key}-item-${index}`)}</div>
          </li>
        ))}
      </Tag>
    );
  }
  return renderToken(token, key, onToggleTask);
}

export function MarkdownView({ source, onToggleTask }: MarkdownViewProps) {
  taskToggle = onToggleTask;
  const tokens = useMemo(() => {
    try {
      return lexer(source, { gfm: true, breaks: true });
    } catch {
      return null;
    }
  }, [source]);

  if (!source.trim()) {
    return <p className="empty-preview">Nothing to preview yet.</p>;
  }
  if (!tokens) {
    return <pre className="fallback-preview">{source}</pre>;
  }
  return (
    <div className="note-md">
      {tokens.map((token, index) => (
        <Fragment key={index}>{renderBlock(token, `b-${index}`, onToggleTask)}</Fragment>
      ))}
    </div>
  );
}

export function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;
  const lower = text.toLowerCase();
  const target = needle.toLowerCase();
  const parts: { text: string; match: boolean }[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const at = lower.indexOf(target, cursor);
    if (at < 0) {
      parts.push({ text: text.slice(cursor), match: false });
      break;
    }
    if (at > cursor) parts.push({ text: text.slice(cursor, at), match: false });
    parts.push({ text: text.slice(at, at + target.length), match: true });
    cursor = at + target.length;
  }
  return (
    <>
      {parts.map((part, index) =>
        part.match ? <mark key={index}>{part.text}</mark> : <span key={index}>{part.text}</span>,
      )}
    </>
  );
}
