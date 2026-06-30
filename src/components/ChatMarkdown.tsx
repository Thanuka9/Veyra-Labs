"use client";

import { cn } from "@/lib/cn";

/** Renders assistant markdown-lite: bold, links, code, lists, paragraphs. */
export function ChatMarkdown({ text, className }: { text: string; className?: string }) {
  const blocks = splitBlocks(text);

  return (
    <div className={cn("chat-markdown", className)}>
      {blocks.map((block, bi) => (
        <Block key={bi} block={block} />
      ))}
    </div>
  );
}

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "list"; items: string[] }
  | { type: "heading"; text: string };

function splitBlocks(text: string): Block[] {
  const rawBlocks = text.split(/\n\n+/).filter((b) => b.trim());
  const result: Block[] = [];

  for (const raw of rawBlocks) {
    const lines = raw.split("\n").filter((l) => l.trim());
    if (lines.length === 0) continue;

    const allBullets = lines.every((l) => /^[•\--]\s/.test(l.trim()));
    if (allBullets && lines.length >= 1) {
      result.push({
        type: "list",
        items: lines.map((l) => l.trim().replace(/^[•\--]\s+/, "")),
      });
      continue;
    }

    const allNumbered = lines.every((l) => /^\d+\.\s/.test(l.trim()));
    if (allNumbered && lines.length >= 1) {
      result.push({
        type: "list",
        items: lines.map((l) => l.trim().replace(/^\d+\.\s+/, "")),
      });
      continue;
    }

    if (lines.length === 1 && /^\*\*[^*]+\*\*$/.test(lines[0].trim())) {
      result.push({ type: "heading", text: lines[0].trim().slice(2, -2) });
      continue;
    }

    result.push({ type: "paragraph", lines });
  }

  return result;
}

function Block({ block }: { block: Block }) {
  if (block.type === "heading") {
    return (
      <p className="chat-md-heading">
        <Inline text={block.text} />
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="chat-md-list">
        {block.items.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="chat-md-paragraph">
      {block.lines.map((line, li) => {
        const trimmed = line.trim();
        const bullet = /^[•\--]\s/.test(trimmed);
        const content = bullet ? trimmed.replace(/^[•\--]\s+/, "") : trimmed;
        if (bullet) {
          return (
            <div key={li} className="chat-md-inline-bullet">
              <span className="chat-md-bullet-dot" aria-hidden />
              <span>
                <Inline text={content} />
              </span>
            </div>
          );
        }
        return (
          <p key={li}>
            <Inline text={content} />
          </p>
        );
      })}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {tokens.map((token, ti) => {
        const key = `${ti}-${token.slice(0, 8)}`;
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <strong key={key} className="font-semibold text-foreground">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
          return (
            <code key={key} className="chat-md-code">
              {token.slice(1, -1)}
            </code>
          );
        }
        if (/^\[[^\]]+\]\([^)]+\)$/.test(token)) {
          const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (m) {
            return (
              <a
                key={key}
                href={m[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-md-link"
              >
                {m[1]}
              </a>
            );
          }
        }
        if (token) return <span key={key}>{token}</span>;
        return null;
      })}
    </>
  );
}
