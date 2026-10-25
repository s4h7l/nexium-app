// Safe renderer: never uses dangerouslySetInnerHTML; all text is rendered as React text nodes.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") && p.length > 4 ? (
          <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
        ) : p.startsWith("`") && p.endsWith("`") && p.length > 2 ? (
          <code key={i} className="rounded bg-code px-1 py-0.5 font-mono text-[0.85em] text-code-foreground">{p.slice(1, -1)}</code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-code">
      {lang ? <div className="border-b border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{lang}</div> : null}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-code-foreground"><code>{code}</code></pre>
    </div>
  );
}

export function RichText({ text }: { text: string }) {
  // Split out fenced code first.
  const chunks = text.split(/```(\w*)\n?([\s\S]*?)```/g);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < chunks.length; i += 3) {
    const prose = chunks[i];
    prose
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean)
      .forEach((block, j) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          out.push(
            <ul key={`${i}-${j}`} className="ml-5 list-disc space-y-1.5 marker:text-sage">
              {lines.map((l, k) => (
                <li key={k}><Inline text={l.replace(/^\s*([-*•]|\d+\.)\s+/, "")} /></li>
              ))}
            </ul>,
          );
        } else {
          out.push(
            <p key={`${i}-${j}`} className="whitespace-pre-line">
              <Inline text={block.replace(/^#+\s*/gm, "")} />
            </p>,
          );
        }
      });
    if (i + 2 < chunks.length) out.push(<CodeBlock key={`c${i}`} lang={chunks[i + 1]} code={chunks[i + 2].trimEnd()} />);
  }
  return <div className="space-y-3 leading-relaxed text-foreground/85">{out}</div>;
}
