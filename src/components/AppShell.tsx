import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import logoMark from "@/assets/nexium-mark.png";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Library, Menu, MessageCircle, Moon, Plus, Settings2, Sparkle, Sun } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useApp } from "@/lib/store";

const NAV = [
  { to: "/", label: "Learning studio", icon: BookOpen },
  { to: "/library", label: "My library", icon: Library },
  { to: "/tutor", label: "Ask your tutor", icon: MessageCircle },
  { to: "/preferences", label: "Learning preferences", icon: Settings2 },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { newSession } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 rounded-md px-2 focus-visible:outline-2 focus-visible:outline-ring">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <BookOpen className="h-4.5 w-4.5" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block font-serif text-[15px] font-semibold tracking-wide text-foreground">NEXIUM</span>
          <span className="block text-xs text-muted-foreground">AI learning studio</span>
        </span>
      </Link>
      <button
        onClick={() => {
          newSession();
          navigate({ to: "/" });
          onNavigate?.();
        }}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Plus className="h-4 w-4" aria-hidden /> New learning session
      </button>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-ring ${
                active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-sidebar-border bg-card/60 p-4">
        <Sparkle className="mb-2 h-4 w-4 text-sage" aria-hidden />
        <p className="font-serif text-sm leading-snug text-foreground">Big ideas start with small questions.</p>
        <p className="mt-1 text-xs text-muted-foreground">Ask anything — there are no silly questions here.</p>
      </div>
    </div>
  );
}

export function useGeminiStatus() {
  return useQuery({
    queryKey: ["gemini-status"],
    queryFn: async () => {
      const r = await fetch("/api/status");
      if (!r.ok) throw new Error("status");
      return (await r.json()) as { configured: boolean; model: string };
    },
    staleTime: 60_000,
  });
}

function ConnectionStatus() {
  const { data, isLoading, isError } = useGeminiStatus();
  const { geminiVerified } = useApp();
  const ok = data?.configured && !isError;
  const label = isLoading ? "Checking Gemini…" : ok ? (geminiVerified ? "Gemini connected · verified" : "Gemini connected") : "Gemini not connected";
  return (
    <span
      role="status"
      title={data?.model}
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
    >
      <span className={`h-2 w-2 rounded-full ${isLoading ? "bg-muted-foreground/40" : ok ? "bg-success" : "bg-destructive"}`} aria-hidden />
      {label}
    </span>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("nexium.theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
    >
      {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}


export function AppShell({ children, crumb }: { children: ReactNode; crumb: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="rounded-md border border-border p-2 text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <span>Workspace</span>
              <span className="mx-2 opacity-50">/</span>
              <span className="font-medium text-foreground">{crumb}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatus />
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-8 sm:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
