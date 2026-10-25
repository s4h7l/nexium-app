import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, BookOpen, Loader2, Square, Trash2, TriangleAlert } from "lucide-react";
import { AppShell, useGeminiStatus } from "@/components/AppShell";
import { RichText } from "@/components/RichText";
import { OptionGroup } from "@/components/OptionGroup";
import { postJson, ClientError } from "@/lib/api-client";
import { LANGUAGES, LEVELS } from "@/lib/lesson";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Ask your tutor — AI Education Assistant" },
      { name: "description", content: "Chat with a Gemini-powered tutor at your level and in your language." },
      { property: "og:title", content: "Ask your tutor — AI Education Assistant" },
      { property: "og:description", content: "A patient Gemini tutor for your follow-up questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tutor,
});

type Msg = { role: "user" | "assistant"; content: string };
const HISTORY_LIMIT = 12;

function Tutor() {
  const { prefs, setPrefs, markVerified } = useApp();
  const status = useGeminiStatus();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const notConnected = status.data && !status.data.configured;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }].slice(-HISTORY_LIMIT);
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const { reply } = await postJson<{ reply: string }>("/api/tutor", { messages: next, level: prefs.level, language: prefs.language }, ac.signal);
      markVerified();
      setMessages((m) => [...m, { role: "assistant" as const, content: reply }].slice(-HISTORY_LIMIT));
    } catch (err) {
      setError(err instanceof ClientError && err.code === "cancelled" ? "Stopped. Your question wasn't answered." : err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell crumb="Ask your tutor">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal text-foreground">Ask your tutor</h1>
          <p className="mt-2 text-muted-foreground">Every answer comes live from Gemini. The last {HISTORY_LIMIT} messages are kept as context.</p>
        </div>
        <button
          onClick={() => {
            abortRef.current?.abort();
            setMessages([]);
            setError(null);
          }}
          disabled={messages.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" /> Clear chat
        </button>
      </div>
      <div className="mt-5 flex flex-wrap gap-6">
        <OptionGroup label="Level" options={LEVELS} value={prefs.level} onChange={(level) => setPrefs({ level })} />
        <OptionGroup label="Language" options={LANGUAGES} value={prefs.language} onChange={(language) => setPrefs({ language })} />
      </div>

      <div className="card-soft mt-6 flex min-h-[420px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7" aria-live="polite">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-6 w-6 text-sage" />
              <p className="mt-3 font-serif text-lg text-foreground">What are you curious about?</p>
              <p className="mt-1 text-sm text-muted-foreground">Try “Why does dividing by zero not work?”</p>
            </div>
          ) : null}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-wrap">
                {m.content}
              </div>
            ) : (
              <div key={i} className="flex max-w-[92%] gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sage-soft text-primary">
                  <BookOpen className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0 text-[15px]">
                  <span className="sr-only">Tutor: </span>
                  <RichText text={m.content} />
                </div>
              </div>
            ),
          )}
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Tutor is thinking…
            </div>
          ) : null}
          {error ? (
            <div role="alert" className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <TriangleAlert className="h-4 w-4 shrink-0 text-destructive" /> {error}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="border-t border-border p-3 sm:p-4">
          {notConnected ? <p className="mb-2 text-sm text-destructive">Gemini isn't connected on the server, so the tutor is unavailable.</p> : null}
          <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 focus-within:border-ring">
            <label htmlFor="tutor-input" className="sr-only">Your question</label>
            <textarea
              id="tutor-input"
              ref={inputRef}
              rows={2}
              maxLength={4000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask a question… (Enter to send, Shift+Enter for a new line)"
              className="flex-1 resize-none bg-transparent px-2 py-1 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {loading ? (
              <button type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted">
                <Square className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button type="submit" aria-label="Send" disabled={!input.trim() || !!notConnected} className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}
