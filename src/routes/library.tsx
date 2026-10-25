import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Library, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SourceBadge } from "@/components/LessonView";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My library — NEXIUM" },
      { name: "description", content: "Your saved lessons, notes, quizzes and flashcards, stored in this browser." },
      { property: "og:title", content: "My library — NEXIUM" },
      { property: "og:description", content: "Saved lessons stored in this browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { library, removeLesson, setCurrent } = useApp();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const items = library.filter((l) =>
    [l.title, l.summary, l.prompt, l.format].join(" ").toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <AppShell crumb="My library">
      <h1 className="text-4xl font-normal text-foreground">My library</h1>
      <p className="mt-2 text-muted-foreground">
        Saved in <strong className="font-medium text-foreground">this browser only</strong> — clearing site data or switching devices removes them.
      </p>
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Search saved lessons"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search saved lessons"
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>
      {library.length === 0 ? (
        <div className="card-soft mt-8 flex flex-col items-center p-12 text-center">
          <Library className="h-6 w-6 text-sage" />
          <p className="mt-3 font-serif text-lg text-foreground">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Generate or open a lesson, then choose “Save lesson”.</p>
        </div>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No saved lessons match “{q}”.</p>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((l) => (
            <li key={l.id} className="card-soft flex flex-col p-5">
              <div className="flex flex-wrap items-center gap-2">
                <SourceBadge lesson={l} />
                <span className="text-xs text-muted-foreground">
                  {l.format} · {l.level} · {l.language} · {new Date(l.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-medium text-foreground">{l.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{l.summary}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setCurrent(l);
                    navigate({ to: "/" });
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Open
                </button>
                <button
                  onClick={() => removeLesson(l.id)}
                  aria-label={`Remove ${l.title}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
